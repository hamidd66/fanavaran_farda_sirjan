from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_, func, update, case
from pydantic import ValidationError
from typing import Optional, List
from uuid import UUID
import math

from app.db.session import get_db
from app.middleware.exception_handler import response_handler
from app.dependencies.permissions import require_roles
from app.repositories.file_repo import add_files, remove_files, reorder_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files
from app.utils.ordering import reorder_items

from app.models.term_session import TermSession
from app.models.session_content import SessionContent
from app.models.audit_logs import AuditLog
from app.enums.file import EntityType, FilePurpose
from app.enums.audit_logs import ActionTypes
from app.enums.term import SessionContentSort, ContentType
from app.schemas.file_attachment import FileAttachmentCreate
from app.schemas.session_content import SessionContentCreate, SessionContentOut, SessionContentUpdate, ToggleSessionContentActiveStatus, ToggleSessionContentDeleteStatus, SessionContentOrderItemUpdate


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
            TermSession.is_deleted == False
        ).first()
        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        display_order = (
            db.query(func.max(SessionContent.display_order))
            .filter(
                SessionContent.term_session_id == session_id,
                SessionContent.is_deleted.is_(False)
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
            is_deleted=False
        )
        db.add(new_content)
        db.flush()
        
        audit_log = AuditLog(
            user_id=user_id,
            entity_id=new_content.id,
            entity_type="SessionContent",
            action=ActionTypes.create,
            changed_fields=["created"],
        )
        db.add(audit_log)
        
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
        
        return response_handler(
            status=True,
            message="Session content successfully created",
            data=SessionContentOut.model_validate(new_content).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        cleanup_pending_uploads(db)
        raise http_error
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=409, detail="Data conflicts with existing records")
    except Exception:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=500, detail="Failed to create session content")


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
            raise HTTPException(status_code=404, detail="Session not found")
        if not viewer_is_admin and db_session.is_deleted:
            raise HTTPException(status_code=404, detail="Session not found")
        
        query = db.query(SessionContent).filter(SessionContent.term_session_id == session_id).options(
            selectinload(SessionContent.user),
            selectinload(SessionContent.file_attachments)
        )
        
        if viewer_is_admin:
            if is_deleted is not None:
                query = query.filter(SessionContent.is_deleted == is_deleted)
        else:
            query = query.filter(SessionContent.is_deleted.is_(False))
            
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
        
        return response_handler(
            status=True,
            message="Session contents retrieved successfully",
            data={
                "contents": contents_data,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch session contents")


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
            raise HTTPException(status_code=404, detail="Session not found")
        if not viewer_is_admin and db_session.is_deleted:
            raise HTTPException(status_code=404, detail="Session not found")
            
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
            raise HTTPException(status_code=404, detail="Content not found in this session")
            
        if not viewer_is_admin and db_content.is_deleted:
            raise HTTPException(status_code=404, detail="Content not found")
            
        if not viewer_is_admin and not db_content.is_active:
            raise HTTPException(status_code=404, detail="Content not found")

        if not auth and not db_session.is_free_preview:
            raise HTTPException(status_code=403, detail="Only authenticated users can view this content")
            
        content_data = SessionContentOut.model_validate(db_content).model_dump()
        
        return response_handler(
            status=True,
            message="Session content retrieved successfully",
            data=content_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch session content details")


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
            .filter(SessionContent.id == content_id, SessionContent.is_deleted == False)
            .options(selectinload(SessionContent.file_attachments))
            .first()
        )
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")

        if not update_data and not files and not deleted_file_ids:
            raise HTTPException(status_code=400, detail="No fields to update")

        changed_fields = []
        for key, value in update_data.items():
            setattr(db_content, key, value)
            changed_fields.append(key)

        # For images

        deleted_paths = []

        if deleted_file_ids:
            deleted_ids_set = set(deleted_file_ids)
            attachments = [
                attachment for attachment in db_content.file_attachments
                if attachment.id in deleted_ids_set and attachment.purpose == "file"
            ]
            if len(attachments) != len(deleted_ids_set):
                raise HTTPException(status_code=400, detail="Invalid file IDs")
            
            deleted_attachment_ids = [attachment.id for attachment in attachments]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        if deleted_file_ids or files:
            changed_fields.append("files")
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

        if changed_fields:
            log = AuditLog(
                user_id=user_id,
                entity_id=db_content.id,
                entity_type="SessionContent",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_content)
        confirm_pending_uploads(db)

        if deleted_file_ids and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Session content updated successfully",
            data=SessionContentOut.model_validate(db_content).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        cleanup_pending_uploads(db)
        raise http_error
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=422, detail=e.errors(include_context=False))
    except IntegrityError:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=409, detail="Input data conflicts with existing records")
    except Exception:
        db.rollback()
        cleanup_pending_uploads(db)
        raise HTTPException(status_code=500, detail="Failed to update session content")


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
            raise HTTPException(status_code=400, detail="Items list is empty")
            
        new_orders = {item.id: item.display_order for item in items}
        if len(new_orders) != len(items):
            raise HTTPException(status_code=400, detail="Duplicate content IDs in request")
            
        if sorted(new_orders.values()) != list(range(1, len(items) + 1)):
            raise HTTPException(status_code=400, detail="Display orders must be unique and consecutive starting from 1")
            
        session = (
            db.query(TermSession.id)
            .filter(TermSession.id == session_id, TermSession.is_deleted.is_(False))
            .with_for_update()
            .first()
        )
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        current = dict(
            db.query(SessionContent.id, SessionContent.display_order)
            .filter(SessionContent.term_session_id == session_id, SessionContent.is_deleted.is_(False))
            .order_by(SessionContent.id)
            .with_for_update()
            .all()
        )
        
        unknown_ids = new_orders.keys() - current.keys()
        if unknown_ids:
            raise HTTPException(status_code=404, detail=f"Contents not found or do not belong to this session: {sorted(map(str, unknown_ids))}")
            
        if len(current) != len(new_orders):
            raise HTTPException(status_code=400, detail="All active contents must be included")
            
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
        
        return response_handler(
            status=True,
            message="Session contents reordered successfully",
            data=result,
            status_code=200,
        )
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Conflict while reordering session contents")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reorder session contents")


@router.patch("/{content_id}/toggle-active")
def toggle_session_content_active_status(
    content_id: UUID,
    data: ToggleSessionContentActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        db_content = db.query(SessionContent).filter(
            SessionContent.id == content_id,
            SessionContent.is_deleted == False
        ).first()
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")

        if db_content.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"Content status is already set to {data.is_active}")

        db_content.is_active = data.is_active

        log = AuditLog(
            user_id=user_id,
            entity_id=db_content.id,
            entity_type="SessionContent",
            action=ActionTypes.update,
            changed_fields=["is_active"],
        )
        db.add(log)
        db.commit()

        return response_handler(
            status=True,
            message=f"Content active status successfully set to {data.is_active}",
            data={"content_id": db_content.id, "is_active": data.is_active},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle content status")


@router.patch("/{content_id}/soft-delete")
def toggle_soft_delete_session_content(
    content_id: UUID,
    data: ToggleSessionContentDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_content = db.query(SessionContent).filter(SessionContent.id == content_id).first()
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")

        if db_content.is_deleted == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Content delete status is already set to {data.is_deleted}")

        db_content.is_deleted = data.is_deleted
        db.flush()

        reorder_items(
            db=db,
            model=SessionContent,
            order_field="display_order",
            group_field="term_session_id",
            group_value=db_content.term_session_id,
            soft_delete_field="is_deleted"
        )

        log = AuditLog(
            user_id=user_id,
            entity_id=db_content.id,
            entity_type="SessionContent",
            action=ActionTypes.update,
            changed_fields=["is_deleted"],
        )
        db.add(log)
        db.commit()

        return response_handler(
            status=True,
            message=f"Content {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"content_id": db_content.id, "is_deleted": data.is_deleted},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update content deletion status")


@router.delete("/{content_id}/hard-delete")
def hard_delete_session_content(
    content_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        db_content = (
            db.query(SessionContent)
            .filter(SessionContent.id == content_id)
            .options(selectinload(SessionContent.file_attachments))
            .first()
        )
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found")

        session_id = db_content.term_session_id
        content_title = db_content.title

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
            soft_delete_field="is_deleted"
        )

        log = AuditLog(
            user_id=user_id,
            entity_id=content_id,
            entity_type="SessionContent",
            action=ActionTypes.delete,
            changed_fields=["hard_delete", content_title],
        )
        db.add(log)
        db.commit()

        if deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Session content hard-deleted successfully",
            data={"content_id": content_id},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to hard-delete session content")
