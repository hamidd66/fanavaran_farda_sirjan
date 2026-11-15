from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, or_, update, case
from datetime import datetime, timezone
from pydantic import ValidationError
from typing import Optional, List
from uuid import UUID
import math
import logging

from app.db.session import get_db
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode
from app.dependencies.permissions import require_roles
from app.repositories.file_repo import add_files, remove_files, reorder_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files
from app.utils.ordering import reorder_items

from app.models.term import Term
from app.models.term_session import TermSession
from app.models.session_content import SessionContent
from app.enums.file import EntityType, FilePurpose
from app.enums.term import SessionContentSort, ContentType
from app.schemas.file_attachment import FileAttachmentCreate
from app.schemas.session_content import SessionContentCreate, SessionContentOut, SessionContentUpdate, ToggleSessionContentActiveStatus, ToggleSessionContentDeleteStatus, SessionContentOrderItemUpdate

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/sessions-contents", tags=["Session Contents"])


@router.post("/{session_id}")
async def create_session_content(
    session_id: UUID,
    data: str = Form(..., description='{ "content_type": "text", "title": "Content Title", "description": "...", "body": "...", "is_free_preview": false, "is_active": true }'),
    files: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        content_data = SessionContentCreate.model_validate_json(data)
        
        db_session = db.query(TermSession).filter(
            TermSession.id == session_id,
            TermSession.deleted_at.is_(None)
        ).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        display_order = (
            db.query(func.max(SessionContent.display_order))
            .filter(
                SessionContent.term_session_id == session_id,
                SessionContent.deleted_at.is_(None)
            )
            .scalar() or 0
        ) + 1
        
        new_content = SessionContent(
            term_session_id=session_id,
            created_by=user_id,
            title=content_data.title,
            description=content_data.description,
            body=content_data.body,
            content_type=content_data.content_type,
            display_order=display_order,
            is_free_preview=content_data.is_free_preview,
            is_active=content_data.is_active,
            deleted_at=None
        )
        db.add(new_content)
        db.flush()
        
        if files:
            attachments_data = FileAttachmentCreate.model_validate_json(data)
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=new_content.id,
                entity_type=EntityType.session_contents,
                folder_name="session_contents",
                files=files,
                attachments=attachments_data
            )
        
        db.commit()
        db.refresh(new_content)
        confirm_pending_uploads(db)
        
        return success_response(
            code=ResponseCode.CREATED,
            message="Session content successfully created",
            data=SessionContentOut.model_validate(new_content).model_dump(),
        )
    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to create session content")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to create session content") from e


@router.get("/{session_id}")
def get_session_contents(
    session_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True)),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[SessionContentSort] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
    is_free_preview: Optional[bool] = Query(None),
    content_type: Optional[ContentType] = Query(None),
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))
        
        db_session = db.query(TermSession).filter(TermSession.id == session_id).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
        if not viewer_is_admin and db_session.deleted_at is not None:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
        
        query = db.query(SessionContent).filter(SessionContent.term_session_id == session_id).options(
            selectinload(SessionContent.user),
            selectinload(SessionContent.file_attachments)
        )
        
        if viewer_is_admin:
            if is_deleted is not None:
                if is_deleted:
                    query = query.filter(SessionContent.deleted_at.isnot(None))
                else:
                    query = query.filter(SessionContent.deleted_at.is_(None))
        else:
            query = query.filter(SessionContent.deleted_at.is_(None))
            
        if is_active is not None:
            query = query.filter(SessionContent.is_active == is_active)
            
        if is_free_preview is not None:
            query = query.filter(SessionContent.is_free_preview == is_free_preview)
            
        if content_type is not None:
            query = query.filter(SessionContent.content_type == content_type)
            
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    SessionContent.title.ilike(search_term),
                    SessionContent.description.ilike(search_term),
                )
            )
            
        if sort == SessionContentSort.newest:
            query = query.order_by(SessionContent.created_at.desc())
        elif sort == SessionContentSort.oldest:
            query = query.order_by(SessionContent.created_at.asc())
        elif sort == SessionContentSort.display_order_asc:
            query = query.order_by(SessionContent.display_order.asc())
        elif sort == SessionContentSort.display_order_desc:
            query = query.order_by(SessionContent.display_order.desc())
        else:
            query = query.order_by(SessionContent.display_order.asc())
            
        total_count = query.count()
        contents = query.offset((page - 1) * limit).limit(limit).all()
        
        contents_data = [SessionContentOut.model_validate(c).model_dump() for c in contents]
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Session contents retrieved successfully",
            data={
                "contents": contents_data,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch session contents")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch session contents") from e


@router.get("/session/{session_id}/content/{content_id}")
def get_session_content_by_id(
    session_id: UUID,
    content_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True))
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))
        
        db_session = db.query(TermSession).filter(TermSession.id == session_id).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
        if not viewer_is_admin and db_session.deleted_at is not None:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        db_content = (
            db.query(SessionContent)
            .filter(
                SessionContent.id == content_id,
                SessionContent.term_session_id == session_id
            )
            .options(
                selectinload(SessionContent.user),
                selectinload(SessionContent.file_attachments)
            )
            .first()
        )
        
        if not db_content:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found in this session")
            
        if not viewer_is_admin and db_content.deleted_at is not None:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")
            
        if not viewer_is_admin and not db_content.is_active:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")

        if not auth and not db_session.is_free_preview:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="Only authenticated users can view this content")
            
        content_data = SessionContentOut.model_validate(db_content).model_dump()
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Session content retrieved successfully",
            data=content_data,
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch session content details")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch session content details") from e


@router.patch("/{content_id}")
async def update_session_content(
    content_id: UUID,
    data: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        
        content_data = SessionContentUpdate.model_validate_json(data)
        update_data = content_data.model_dump(
            exclude_unset=True,
            exclude={"deleted_file_ids"}
        )
        deleted_file_ids = content_data.deleted_file_ids

        db_content = (
            db.query(SessionContent)
            .filter(SessionContent.id == content_id, SessionContent.deleted_at.is_(None))
            .options(selectinload(SessionContent.file_attachments))
            .first()
        )
        if not db_content:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")

        if not update_data and not files and not deleted_file_ids:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")

        for key, value in update_data.items():
            setattr(db_content, key, value)

        # For images

        deleted_paths = []

        if deleted_file_ids:
            deleted_ids_set = set(deleted_file_ids)
            attachments = [
                attachment for attachment in db_content.file_attachments
                if attachment.id in deleted_ids_set and attachment.purpose == "file"
            ]
            if len(attachments) != len(deleted_ids_set):
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Invalid file IDs")
            
            deleted_attachment_ids = [attachment.id for attachment in attachments]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        if deleted_file_ids or files:
            reorder_files(
                db=db,
                entity_id=db_content.id,
                entity_type=EntityType.session_contents,
                purpose=FilePurpose.image
            )

        if files:
            attachments_data = FileAttachmentCreate.model_validate_json(data)
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=db_content.id,
                entity_type=EntityType.session_contents,
                folder_name="session_contents",
                files=files,
                attachments=attachments_data
            )

        db.commit()
        db.refresh(db_content)
        confirm_pending_uploads(db)

        if deleted_file_ids and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Session content updated successfully",
            data=SessionContentOut.model_validate(db_content).model_dump(),
        )
    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors(include_context=False)) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Input data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to update session content")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update session content") from e


@router.patch("/{session_id}/reorder")
def reorder_session_contents(
    session_id: UUID,
    data: SessionContentOrderItemUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        items = data.items
        if not items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list is empty")
            
        new_orders = {item.id: item.display_order for item in items}
        if len(new_orders) != len(items):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Duplicate content IDs in request")
            
        if sorted(new_orders.values()) != list(range(1, len(items) + 1)):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Display orders must be unique and consecutive starting from 1")
            
        session = (
            db.query(TermSession.id)
            .filter(TermSession.id == session_id, TermSession.deleted_at.is_(None))
            .with_for_update()
            .first()
        )
        if not session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        current = dict(
            db.query(SessionContent.id, SessionContent.display_order)
            .filter(SessionContent.term_session_id == session_id, SessionContent.deleted_at.is_(None))
            .order_by(SessionContent.id)
            .with_for_update()
            .all()
        )
        
        unknown_ids = new_orders.keys() - current.keys()
        if unknown_ids:
            raise AppException(
                code=ResponseCode.RESOURCE_NOT_FOUND,
                message=f"Contents not found or do not belong to this session: {sorted(map(str, unknown_ids))}",
            )
            
        if len(current) != len(new_orders):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="All active contents must be included")
            
        changes = {cid: order for cid, order in new_orders.items() if current[cid] != order}
        if changes:
            changed_ids = list(changes)
            temp_shift = max(current.values()) + len(current)
            db.execute(
                update(SessionContent)
                .where(SessionContent.id.in_(changed_ids))
                .values(display_order=SessionContent.display_order + temp_shift)
                .execution_options(synchronize_session=False)
            )
            db.execute(
                update(SessionContent)
                .where(SessionContent.id.in_(changed_ids))
                .values(display_order=case(changes, value=SessionContent.id))
                .execution_options(synchronize_session=False)
            )
            
        contents = (
            db.query(SessionContent)
            .filter(SessionContent.id.in_(new_orders))
            .order_by(SessionContent.display_order)
            .all()
        )
        result = [SessionContentOut.model_validate(c).model_dump() for c in contents]
        db.commit()
        
        return success_response(
            code=ResponseCode.UPDATED,
            message="Session contents reordered successfully",
            data=result,
        )
    except AppException:
        db.rollback()
        raise
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Conflict while reordering session contents") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to reorder session contents")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to reorder session contents") from e


@router.patch("/{content_id}/toggle-active")
def toggle_session_content_active_status(
    content_id: UUID,
    data: ToggleSessionContentActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        db_content = db.query(SessionContent).filter(
            SessionContent.id == content_id,
            SessionContent.deleted_at.is_(None)
        ).first()
        if not db_content:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")

        if db_content.is_active == data.is_active:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Content status is already set to {data.is_active}")

        db_content.is_active = data.is_active

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message=f"Content active status successfully set to {data.is_active}",
            data={"content_id": db_content.id, "is_active": data.is_active},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to toggle content status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to toggle content status") from e


@router.patch("/{content_id}/soft-delete")
def toggle_soft_delete_session_content(
    content_id: UUID,
    data: ToggleSessionContentDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        db_content = db.query(SessionContent).filter(SessionContent.id == content_id).first()
        if not db_content:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")

        if (db_content.deleted_at is not None) == data.is_deleted:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Content delete status is already set to {data.is_deleted}")

        db_content.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None
        db.flush()

        reorder_items(
            db=db,
            model=SessionContent,
            order_field="display_order",
            group_field="term_session_id",
            group_value=db_content.term_session_id,
            soft_delete_field="deleted_at"
        )

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message=f"Content {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"content_id": db_content.id, "is_deleted": data.is_deleted},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update content deletion status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update content deletion status") from e


@router.delete("/{content_id}/hard-delete")
def hard_delete_session_content(
    content_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        db_content = (
            db.query(SessionContent)
            .filter(SessionContent.id == content_id)
            .options(selectinload(SessionContent.file_attachments))
            .first()
        )
        if not db_content:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Content not found")

        session_id = db_content.term_session_id

        deleted_paths = []
        attachments = [
            attachment for attachment in db_content.file_attachments
        ]
        deleted_attachment_ids = [attachment.id for attachment in attachments]
        if deleted_attachment_ids:
            result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
            deleted_paths = result["deleted_paths"]

        db.delete(db_content)
        db.flush()

        reorder_items(
            db=db,
            model=SessionContent,
            order_field="display_order",
            group_field="term_session_id",
            group_value=session_id,
            soft_delete_field="deleted_at"
        )

        db.commit()

        if deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.DELETED,
            message="Session content hard-deleted successfully",
            data={"content_id": content_id},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to hard-delete session content")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to hard-delete session content") from e
