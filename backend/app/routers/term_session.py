from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func, or_, update, case
from datetime import datetime, timezone
from pydantic import ValidationError
from typing import Optional
from uuid import UUID
import math

from app.db.session import get_db
from app.middleware.exception_handler import response_handler
from app.dependencies.permissions import require_roles
from app.utils.ordering import reorder_items

from app.models.term import Term
from app.models.term_session import TermSession
from app.models.session_content import SessionContent
from app.enums.term import SessionType, TermSessionSort
from app.schemas.term_session import TermSessionCreate, TermSessionOut, TermSessionUpdate, ToggleTermSessionActiveStatus, ToggleTermSessionDeleteStatus, TermSessionOrderItemUpdate


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
            raise HTTPException(status_code=404, detail="Term not found")
            
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
        
        return response_handler(
            status=True,
            message="Term session successfully created",
            data=TermSessionOut.model_validate(new_session).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create term session")


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
            raise HTTPException(status_code=404, detail="Term not found")
            
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
        
        return response_handler(
            status=True,
            message="Term sessions retrieved successfully",
            data={
                "sessions": sessions_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch term sessions")


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
            raise HTTPException(status_code=404, detail="Term not found")
        if not viewer_is_admin and db_term.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Term not found")
            
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
            raise HTTPException(status_code=404, detail="Session not found in this term")
            
        if not viewer_is_admin and db_session.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Session not found")
            
        if not viewer_is_admin and not db_session.is_active:
            raise HTTPException(status_code=404, detail="Session not found")

        if not auth and not db_session.is_free_preview:
            raise HTTPException(status_code=403, detail="Only authenticated users can view this session")
            
        session_data = TermSessionOut.model_validate(db_session).model_dump()
        session_data["contents_count"] = len([c for c in db_session.session_contents if c.deleted_at is None]) if db_session.session_contents else 0
        
        return response_handler(
            status=True,
            message="Term session retrieved successfully",
            data=session_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch term session details")


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
            raise HTTPException(status_code=404, detail="Session not found")
        
        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        changed_fields = []
        for key, value in update_data.items():
            setattr(db_session, key, value)
            changed_fields.append(key)
            
        db.commit()
        db.refresh(db_session)
        
        return response_handler(
            status=True,
            message="Term session updated successfully",
            data=TermSessionOut.model_validate(db_session).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors(include_context=False))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Input data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update term session")


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
            raise HTTPException(status_code=400, detail="Items list is empty")
            
        new_numbers = {item.id: item.session_number for item in items}
        if len(new_numbers) != len(items):
            raise HTTPException(status_code=400, detail="Duplicate session IDs in request")
            
        if sorted(new_numbers.values()) != list(range(1, len(items) + 1)):
            raise HTTPException(status_code=400, detail="Session numbers must be unique and consecutive starting from 1")
            
        term = (
            db.query(Term.id)
            .filter(Term.id == term_id, Term.deleted_at.is_(None))
            .with_for_update()
            .first()
        )
        if not term:
            raise HTTPException(status_code=404, detail="Term not found")
            
        current = dict(
            db.query(TermSession.id, TermSession.session_number)
            .filter(TermSession.term_id == term_id, TermSession.deleted_at.is_(None))
            .order_by(TermSession.id)
            .with_for_update()
            .all()
        )
        
        unknown_ids = new_numbers.keys() - current.keys()
        if unknown_ids:
            raise HTTPException(status_code=404, detail=f"Sessions not found or do not belong to this term: {sorted(map(str, unknown_ids))}")
            
        if len(current) != len(new_numbers):
            raise HTTPException(status_code=400, detail="All active sessions must be included")
            
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
        
        return response_handler(
            status=True,
            message="Term sessions reordered successfully",
            data=result,
            status_code=200,
        )
    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Conflict while reordering term sessions")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reorder term sessions")


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
            raise HTTPException(status_code=404, detail="Session not found")
            
        if db_session.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"Session status is already set to {data.is_active}")
            
        db_session.is_active = data.is_active

        db.commit()
        
        return response_handler(
            status=True,
            message=f"Session active status successfully set to {data.is_active}",
            data={"session_id": db_session.id, "is_active": data.is_active},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle session status")


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
            raise HTTPException(status_code=404, detail="Session not found")
            
        if (db_session.deleted_at is not None) == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Session delete status is already set to {data.is_deleted}")
            
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
        
        return response_handler(
            status=True,
            message=f"Session {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"session_id": db_session.id, "is_deleted": data.is_deleted},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update session deletion status")


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
            raise HTTPException(status_code=404, detail="Session not found")
            
        has_contents = db.query(SessionContent.id).filter(SessionContent.term_session_id == session_id).first()
        if has_contents:
            raise HTTPException(status_code=400, detail="Cannot hard-delete session. Active contents are associated with this session.")
            
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
        
        return response_handler(
            status=True,
            message="Session hard-deleted successfully",
            data={"session_id": session_id},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to hard-delete session")

