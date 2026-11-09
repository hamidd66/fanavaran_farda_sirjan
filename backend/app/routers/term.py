from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_, func, case, update
from pydantic import ValidationError
from datetime import datetime, timezone
from typing import Optional, List
from uuid import UUID
import math

from app.db.session import get_db
from app.middleware.exception_handler import response_handler
from app.dependencies.permissions import require_roles
from app.repositories.file_repo import add_files, remove_files, reorder_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files
from app.utils.ordering import reorder_items

from app.models.term import Term
from app.models.course import Course
from app.models.term_session import TermSession
from app.models.audit_logs import AuditLog
from app.enums.file import EntityType, FilePurpose
from app.enums.audit_logs import ActionTypes
from app.enums.term import TermSort
from app.schemas.file_attachment import FileAttachmentCreate
from app.schemas.term import TermCreate, TermOut, TermUpdate, ToggleTermActiveStatus, ToggleTermDeleteStatus, TermOrderItemUpdate


router = APIRouter(prefix="/terms", tags=["Terms"])


@router.post("/{course_id}")
async def create_term(
    course_id: UUID,
    data: str = Form(..., description='{"title": "", "short_description": "", "long_description": "", "prerequisites": "", "tuition": 0, "sessions_count": 0, "duration_hours": 0, "is_active": true}'),
    images: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        term_data = TermCreate.model_validate_json(data)

        db_course = db.query(Course).filter(Course.id == course_id, Course.deleted_at.is_(None)).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        existing_term = db.query(Term).filter(
            Term.course_id == course_id,
            Term.title == term_data.title,
            Term.deleted_at.is_(None)
        ).first()
        if existing_term:
            raise HTTPException(status_code=409, detail=f"A term already exists for this course.")

        term_number = (
            db.query(func.max(Term.term_number))
            .filter(
                Term.course_id == course_id,
                Term.deleted_at.is_(None)
            )
            .scalar() or 0
        ) + 1

        new_term = Term(
            course_id=course_id,
            created_by=user_id,
            title=term_data.title,
            short_description=term_data.short_description,
            long_description=term_data.long_description,
            term_number=term_number,
            prerequisites=term_data.prerequisites,
            tuition=term_data.tuition,
            sessions_count=term_data.sessions_count,
            duration_hours=term_data.duration_hours,
            is_active=term_data.is_active,
            deleted_at=None
        )
        db.add(new_term)
        db.flush()

        audit_log = AuditLog(
            user_id=user_id,
            entity_id=new_term.id,
            entity_type="Term",
            action=ActionTypes.create,
            changed_fields=["created"],
        )
        db.add(audit_log)

        if images:
            attachments_data = FileAttachmentCreate.model_validate_json(data)
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=new_term.id,
                entity_type=EntityType.terms,
                folder_name="terms",
                files=images,
                attachments=attachments_data
            )

        db.commit()
        db.refresh(new_term)
        confirm_pending_uploads(db)

        return response_handler(
            status=True,
            message="Term successfully created",
            data=TermOut.model_validate(new_term).model_dump(),
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
        raise HTTPException(status_code=500, detail="Failed to create term")


@router.get("/{course_id}")
def get_terms_by_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True)),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[TermSort] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if not viewer_is_admin and db_course.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Course not found")

        query = db.query(Term).filter(Term.course_id == course_id).options(
            selectinload(Term.course_questions),
            selectinload(Term.term_sessions),
            selectinload(Term.file_attachments),
            selectinload(Term.user)
        )

        if viewer_is_admin:
            if is_deleted is not None:  
                if is_deleted:
                    query = query.filter(Term.deleted_at.isnot(None))
                else:
                    query = query.filter(Term.deleted_at.is_(None))
        else:
            query = query.filter(Term.deleted_at.is_(None))

        if is_active is not None:
            query = query.filter(Term.is_active == is_active)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Term.title.ilike(search_term),
                    Term.short_description.ilike(search_term),
                )
            )

        if sort == TermSort.newest:
            query = query.order_by(Term.created_at.desc())
        elif sort == TermSort.oldest:        
            query = query.order_by(Term.created_at.asc())
        elif sort == TermSort.term_number_asc:
            query = query.order_by(Term.term_number.asc())
        elif sort == TermSort.term_number_desc:
            query = query.order_by(Term.term_number.desc())
        else:
            query = query.order_by(Term.term_number.asc())

        total_count = query.count()
        terms = query.offset((page - 1) * limit).limit(limit).all()

        terms_data = []
        for term in terms:
            term_dict = TermOut.model_validate(term).model_dump()

            sessions = [
                session for session in term.term_sessions
                if session.deleted_at is None
            ]
            term_dict["sessions_count"] = len(sessions)

            duration_hours = sum(
                session.estimated_duration or 0
                for session in sessions
            )
            term_dict["duration_hours"] = duration_hours

            questions = [
                question for question in term.course_questions
                if question.deleted_at is None
            ]
            term_dict["questions_count"] = len(questions) if term.course_questions else 0

            terms_data.append(term_dict)

        return response_handler(
            status=True,
            message="Terms retrieved successfully",
            data={
                "terms": terms_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch course terms")


@router.get("/course/{course_id}/term/{term_id}")
def get_term_by_id(
    course_id: UUID,
    term_id: UUID,
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True))
):
    try:
        viewer_is_admin = bool(auth.get("payload")) and bool("admin" in auth.get("roles", []))

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if not viewer_is_admin and db_course.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Course not found")

        db_term = (
            db.query(Term)
            .filter(Term.id == term_id, Term.course_id == course_id)
            .options(
                selectinload(Term.file_attachments),
                selectinload(Term.term_sessions),
                selectinload(Term.user),
                selectinload(Term.course_questions)
            )
            .first()
        )
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found in this course")

        if not viewer_is_admin and db_term.deleted_at is not None:
            raise HTTPException(status_code=404, detail="Term not found")
    
        if not viewer_is_admin and not db_term.is_active:
            raise HTTPException(status_code=404, detail="Session not found")
        
        term_data = TermOut.model_validate(db_term).model_dump()
        
        sessions = [
            session for session in db_term.term_sessions
            if session.deleted_at is None
        ]
        term_data["sessions_count"] = len(sessions)

        duration_hours = sum(
            session.estimated_duration or 0
            for session in sessions
        )
        term_data["duration_hours"] = duration_hours

        questions = [
            question for question in db_term.course_questions
            if question.deleted_at is None
        ]
        term_data["questions_count"] = len(questions) if db_term.course_questions else 0

        return response_handler(
            status=True,
            message="Term retrieved successfully",
            data=term_data,
            status_code=200
        )

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch term details")


@router.patch("/{term_id}")
async def update_term(
    term_id: UUID,
    data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        term_data = TermUpdate.model_validate_json(data)
        update_data = term_data.model_dump(
            exclude_unset=True,
            exclude={"deleted_image_ids"}
        )
        deleted_image_ids = term_data.deleted_image_ids

        db_term = (
            db.query(Term)
            .filter(Term.id == term_id, Term.deleted_at.is_(None))
            .options(selectinload(Term.file_attachments))
            .first()
        )
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")

        if not update_data and not images and not deleted_image_ids:
            raise HTTPException(status_code=400, detail="No fields to update")

        changed_fields = []
        for key, value in update_data.items():
            setattr(db_term, key, value)
            changed_fields.append(key)

        # For images

        deleted_paths = []

        if deleted_image_ids:
            deleted_ids_set = set(deleted_image_ids)
            attachments = [
                attachment for attachment in db_term.file_attachments
                if attachment.id in deleted_ids_set and attachment.purpose == "image"
            ]
            if len(attachments) != len(deleted_ids_set):
                raise HTTPException(status_code=400, detail="Invalid image IDs")

            deleted_attachment_ids = [attachment.id for attachment in attachments]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        if deleted_image_ids or images:
            changed_fields.append("images")
            reorder_files(
                db=db,
                entity_id=db_term.id,
                entity_type=EntityType.terms,
                purpose=FilePurpose.image
            )

        if images:
            attachments_data = FileAttachmentCreate.model_validate_json(data)
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=db_term.id,
                entity_type=EntityType.terms,
                folder_name="terms",
                files=images,
                attachments=attachments_data
            )

        if changed_fields:
            log = AuditLog(
                user_id=user_id,
                entity_id=db_term.id,
                entity_type="Term",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_term)
        confirm_pending_uploads(db)

        if deleted_image_ids and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Term updated successfully",
            data=TermOut.model_validate(db_term).model_dump(),
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
        raise HTTPException(status_code=500, detail="Failed to update term")


@router.patch("/{course_id}/reorder")
def reorder_course_terms(
    course_id: UUID,
    data: TermOrderItemUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        items = data.items
        if not items:
            raise HTTPException(status_code=400, detail="Items list is empty")

        new_numbers = {item.id: item.term_number for item in items}

        if len(new_numbers) != len(items):
            raise HTTPException(status_code=400, detail="Duplicate term IDs in request")

        if sorted(new_numbers.values()) != list(range(1, len(items) + 1)):
            raise HTTPException(status_code=400, detail="Term numbers must be unique and consecutive starting from 1")

        course = (
            db.query(Course.id)
            .filter(Course.id == course_id, Course.deleted_at.is_(None))
            .with_for_update()
            .first()
        )
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        current = dict(
            db.query(Term.id, Term.term_number)
            .filter(Term.course_id == course_id, Term.deleted_at.is_(None))
            .order_by(Term.id)
            .with_for_update()
            .all()
        )

        unknown_ids = new_numbers.keys() - current.keys()
        if unknown_ids:
            raise HTTPException(
                status_code=404,
                detail=f"Terms not found or do not belong to this course: {sorted(map(str, unknown_ids))}",
            )

        if len(current) != len(new_numbers):
            raise HTTPException(status_code=400, detail="All active terms must be included")

        changes = {tid: num for tid, num in new_numbers.items() if current[tid] != num}

        if changes:
            changed_ids = list(changes)
            temp_shift = max(current.values()) + len(current)

            db.execute(
                update(Term)
                .where(Term.id.in_(changed_ids))
                .values(term_number=Term.term_number + temp_shift)
                .execution_options(synchronize_session=False)
            )

            db.execute(
                update(Term)
                .where(Term.id.in_(changed_ids))
                .values(term_number=case(changes, value=Term.id))
                .execution_options(synchronize_session=False)
            )

        terms = (
            db.query(Term)
            .filter(Term.id.in_(new_numbers))
            .order_by(Term.term_number)
            .all()
        )
        result = [TermOut.model_validate(t).model_dump() for t in terms]

        db.commit()

        return response_handler(
            status=True,
            message="Course terms reordered successfully",
            data=result,
            status_code=200,
        )

    except HTTPException:
        db.rollback()
        raise
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Conflict while reordering course terms")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reorder course terms")


@router.patch("/{term_id}/toggle-active")
def toggle_term_active_status(
    term_id: UUID,
    data: ToggleTermActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_term = db.query(Term).filter(Term.id == term_id, Term.deleted_at.is_(None)).first()
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")

        if db_term.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"Term status is already set to {data.is_active}")

        db_term.is_active = data.is_active

        log = AuditLog(
            user_id=user_id,
            entity_id=db_term.id,
            entity_type="Term",
            action=ActionTypes.update,
            changed_fields=["is_active"],
        )
        db.add(log)
        db.commit()

        return response_handler(
            status=True,
            message=f"Term active status successfully set to {data.is_active}",
            data={"term_id": db_term.id, "is_active": data.is_active},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle term status")


@router.patch("/{term_id}/soft-delete")
def toggle_soft_delete_term(
    term_id: UUID,
    data: ToggleTermDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_term = db.query(Term).filter(Term.id == term_id).first()
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")

        if (db_term.deleted_at is not None) == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Term delete status is already set to {data.is_deleted}")

        db_term.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None
        db.flush()

        reorder_items(
            db=db,
            model=Term,
            order_field="term_number",
            group_field="course_id",
            group_value=db_term.course_id,
            soft_delete_field="deleted_at"
        )

        log = AuditLog(
            user_id=user_id,
            entity_id=db_term.id,
            entity_type="Term",
            action=ActionTypes.update,
            changed_fields=["deleted_at"],
        )
        db.add(log)
        db.commit()

        return response_handler(
            status=True,
            message=f"Term {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"term_id": db_term.id, "is_deleted": data.is_deleted},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update term deletion status")


@router.delete("/{term_id}/hard-delete")
def hard_delete_term(
    term_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        db_term = db.query(Term).filter(Term.id == term_id).first()
        if not db_term:
            raise HTTPException(status_code=404, detail="Term not found")

        course_id = db_term.course_id
        term_title = db_term.title

        has_sessions = db.query(TermSession.id).filter(TermSession.term_id == term_id).first()
        if has_sessions:
            raise HTTPException(status_code=400, detail="Cannot hard-delete term. Active sessions are associated with this term.")

        # has_classrooms = db.query(Classroom.id).filter(Classroom.term_id == term_id).first()
        # if has_classrooms:
        #     raise HTTPException(status_code=400, detail="Cannot hard-delete term. Active classrooms are associated with this term.")

        deleted_paths = []
        attachments = [
            attachment for attachment in db_term.file_attachments
        ]
        deleted_attachment_ids = [attachment.id for attachment in attachments]
        if deleted_attachment_ids:
            result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
            deleted_paths = result["deleted_paths"]

        db.delete(db_term)
        db.flush()

        reorder_items(
            db=db,
            model=Term,
            order_field="term_number",
            group_field="course_id",
            group_value=course_id,
            soft_delete_field="deleted_at"
        )

        log = AuditLog(
            user_id=admin_id,
            entity_id=term_id,
            entity_type="Term",
            action=ActionTypes.delete,
            changed_fields=["hard_delete", term_title],
        )
        db.add(log)
        db.commit()

        # if len(deleted_paths) > 0:
        if deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Term hard-deleted successfully",
            data={"term_id": term_id},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to hard-delete term")

