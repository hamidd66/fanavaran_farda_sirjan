from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, or_, update, case
from datetime import datetime, timezone
from pydantic import ValidationError
from typing import Optional
from uuid import UUID
import math
import logging

from app.db.session import get_db
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode
from app.dependencies.permissions import require_roles
from app.utils.ordering import reorder_items

from app.models.term import Term
from app.models.term_session import TermSession
from app.models.session_content import SessionContent
from app.enums.term import SessionType, TermSessionSort
from app.schemas.term_session import TermSessionCreate, TermSessionOut, TermSessionUpdate, ToggleTermSessionActiveStatus, ToggleTermSessionDeleteStatus, TermSessionOrderItemUpdate

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/terms-sessions", tags=["Term Sessions"])


@router.post("/{term_id}")
async def create_term_session(
    term_id: UUID,
    data: TermSessionCreate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        
        db_term = db.query(Term).filter(Term.id == term_id, Term.deleted_at.is_(None)).first()
        if not db_term:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")
            
        session_number = (
            db.query(func.max(TermSession.session_number))
            .filter(
                TermSession.term_id == term_id,
                TermSession.deleted_at.is_(None)
            )
            .scalar() or 0
        ) + 1
        
        new_session = TermSession(
            term_id=term_id,
            created_by=user_id,
            session_type=data.session_type,
            session_number=session_number,
            estimated_duration=data.estimated_duration,
            title=data.title,
            description=data.description,
            is_free_preview=data.is_free_preview,
            is_active=data.is_active,
            deleted_at=None
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return success_response(
            code=ResponseCode.CREATED,
            message="Term session successfully created",
            data=TermSessionOut.model_validate(new_session).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except ValidationError as e:
        db.rollback()
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create term session")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to create term session") from e


@router.get("/{term_id}")
def get_term_sessions(
    term_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True)),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[TermSessionSort] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
    is_free_preview: Optional[bool] = Query(None),
    session_type: Optional[SessionType] = Query(None),
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))
        
        db_term = db.query(Term).filter(Term.id == term_id, Term.deleted_at.is_(None)).first()
        if not db_term:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")
            
        query = db.query(TermSession).filter(TermSession.term_id == term_id).options(
            selectinload(TermSession.user),
            selectinload(TermSession.session_contents)
        )
        
        if viewer_is_admin:
            if is_deleted is not None:
                if is_deleted:
                    query = query.filter(TermSession.deleted_at.isnot(None))
                else:
                    query = query.filter(TermSession.deleted_at.is_(None))
        else:
            query = query.filter(TermSession.deleted_at.is_(None))
            
        if is_active is not None:
            query = query.filter(TermSession.is_active == is_active)
            
        if is_free_preview is not None:
            query = query.filter(TermSession.is_free_preview == is_free_preview)
            
        if session_type is not None:
            query = query.filter(TermSession.session_type == session_type)
            
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    TermSession.title.ilike(search_term),
                    TermSession.description.ilike(search_term),
                )
            )
            
        if sort == TermSessionSort.newest:
            query = query.order_by(TermSession.created_at.desc())
        elif sort == TermSessionSort.oldest:
            query = query.order_by(TermSession.created_at.asc())
        elif sort == TermSessionSort.session_number_asc:
            query = query.order_by(TermSession.session_number.asc())
        elif sort == TermSessionSort.session_number_desc:
            query = query.order_by(TermSession.session_number.desc())
        else:
            query = query.order_by(TermSession.session_number.asc())
            
        total_count = query.count()
        sessions = query.offset((page - 1) * limit).limit(limit).all()
        
        sessions_data = []
        for session in sessions:
            session_dict = TermSessionOut.model_validate(session).model_dump()
            session_dict["contents_count"] = len([c for c in session.session_contents if c.deleted_at is None]) if session.session_contents else 0
            sessions_data.append(session_dict)
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Term sessions retrieved successfully",
            data={
                "sessions": sessions_data,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch term sessions")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch term sessions") from e


@router.get("/term/{term_id}/session/{session_id}")
def get_term_session_by_id(
    term_id: UUID,
    session_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True))
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))
        
        db_term = db.query(Term).filter(Term.id == term_id).first()
        if not db_term:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")
        if not viewer_is_admin and db_term.deleted_at is not None:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")
            
        db_session = (
            db.query(TermSession)
            .filter(TermSession.id == session_id, TermSession.term_id == term_id)
            .options(
                selectinload(TermSession.user),
                selectinload(TermSession.session_contents)
            )
            .first()
        )
        
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found in this term")
            
        if not viewer_is_admin and db_session.deleted_at is not None:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        if not viewer_is_admin and not db_session.is_active:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")

        if not auth and not db_session.is_free_preview:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="Only authenticated users can view this session")
            
        session_data = TermSessionOut.model_validate(db_session).model_dump()
        session_data["contents_count"] = len([c for c in db_session.session_contents if c.deleted_at is None]) if db_session.session_contents else 0
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Term session retrieved successfully",
            data=session_data,
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch term session details")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch term session details") from e


@router.patch("/{session_id}")
def update_term_session(
    session_id: UUID,
    data: TermSessionUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        
        db_session = (
            db.query(TermSession)
            .filter(
                TermSession.id == session_id, 
                TermSession.deleted_at.is_(None)
            )
            .first()
        )
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")
            
        changed_fields = []
        for key, value in update_data.items():
            setattr(db_session, key, value)
            changed_fields.append(key)
            
        db.commit()
        db.refresh(db_session)
        
        return success_response(
            code=ResponseCode.UPDATED,
            message="Term session updated successfully",
            data=TermSessionOut.model_validate(db_session).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except ValidationError as e:
        db.rollback()
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors(include_context=False)) from e
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Input data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update term session")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update term session") from e


@router.patch("/{term_id}/reorder")
def reorder_term_sessions(
    term_id: UUID,
    data: TermSessionOrderItemUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        items = data.items
        if not items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list is empty")
            
        new_numbers = {item.id: item.session_number for item in items}
        if len(new_numbers) != len(items):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Duplicate session IDs in request")
            
        if sorted(new_numbers.values()) != list(range(1, len(items) + 1)):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Session numbers must be unique and consecutive starting from 1")
            
        term = (
            db.query(Term.id)
            .filter(Term.id == term_id, Term.deleted_at.is_(None))
            .with_for_update()
            .first()
        )
        if not term:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")
            
        current = dict(
            db.query(TermSession.id, TermSession.session_number)
            .filter(TermSession.term_id == term_id, TermSession.deleted_at.is_(None))
            .order_by(TermSession.id)
            .with_for_update()
            .all()
        )
        
        unknown_ids = new_numbers.keys() - current.keys()
        if unknown_ids:
            raise AppException(
                code=ResponseCode.RESOURCE_NOT_FOUND,
                message=f"Sessions not found or do not belong to this term: {sorted(map(str, unknown_ids))}",
            )
            
        if len(current) != len(new_numbers):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="All active sessions must be included")
            
        changes = {sid: num for sid, num in new_numbers.items() if current[sid] != num}
        if changes:
            changed_ids = list(changes)
            temp_shift = max(current.values()) + len(current)
            db.execute(
                update(TermSession)
                .where(TermSession.id.in_(changed_ids))
                .values(session_number=TermSession.session_number + temp_shift)
                .execution_options(synchronize_session=False)
            )
            db.execute(
                update(TermSession)
                .where(TermSession.id.in_(changed_ids))
                .values(session_number=case(changes, value=TermSession.id))
                .execution_options(synchronize_session=False)
            )
            
        sessions = (
            db.query(TermSession)
            .filter(TermSession.id.in_(new_numbers))
            .order_by(TermSession.session_number)
            .all()
        )

        result = [TermSessionOut.model_validate(s).model_dump() for s in sessions]
        db.commit()
        
        return success_response(
            code=ResponseCode.UPDATED,
            message="Term sessions reordered successfully",
            data=result,
        )
    except AppException:
        db.rollback()
        raise
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Conflict while reordering term sessions") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to reorder term sessions")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to reorder term sessions") from e


@router.patch("/{session_id}/toggle-active")
def toggle_term_session_active_status(
    session_id: UUID,
    data: ToggleTermSessionActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        db_session = db.query(TermSession).filter(
            TermSession.id == session_id, 
            TermSession.deleted_at.is_(None)
        ).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        if db_session.is_active == data.is_active:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Session status is already set to {data.is_active}")
            
        db_session.is_active = data.is_active

        db.commit()
        
        return success_response(
            code=ResponseCode.UPDATED,
            message=f"Session active status successfully set to {data.is_active}",
            data={"session_id": db_session.id, "is_active": data.is_active},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to toggle session status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to toggle session status") from e


@router.patch("/{session_id}/soft-delete")
def toggle_soft_delete_term_session(
    session_id: UUID,
    data: ToggleTermSessionDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        db_session = db.query(TermSession).filter(
            TermSession.id == session_id, 
        ).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        if (db_session.deleted_at is not None) == data.is_deleted:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Session delete status is already set to {data.is_deleted}")
            
        db_session.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None
        db.flush()

        reorder_items(
            db=db,
            model=TermSession,
            order_field="session_number",
            group_field="term_id",
            group_value=db_session.term_id,
            soft_delete_field="deleted_at"
        )

        db.commit()
        
        return success_response(
            code=ResponseCode.UPDATED,
            message=f"Session {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"session_id": db_session.id, "is_deleted": data.is_deleted},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update session deletion status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update session deletion status") from e


@router.delete("/{session_id}/hard-delete")
def hard_delete_term_session(
    session_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        db_session = db.query(TermSession).filter(
            TermSession.id == session_id, 
        ).first()
        if not db_session:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Session not found")
            
        has_contents = db.query(SessionContent.id).filter(SessionContent.term_session_id == session_id).first()
        if has_contents:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Cannot hard-delete session. Active contents are associated with this session")
            
        term_id_value = db_session.term_id
        
        db.delete(db_session)
        db.flush()

        reorder_items(
            db=db,
            model=TermSession,
            order_field="session_number",
            group_field="term_id",
            group_value=term_id_value,
            soft_delete_field="deleted_at"
        )

        db.commit()
        
        return success_response(
            code=ResponseCode.DELETED,
            message="Session hard-deleted successfully",
            data={"session_id": session_id},
            status_code=200
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to hard-delete session")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to hard-delete session") from e

