from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload
from pydantic import ValidationError
from typing import Optional, List
import math

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.middleware.exception_handler import response_handler
from app.repositories.file_repo import add_files, remove_files, reorder_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files

from app.models.course import Course
from app.models.term import Term
from app.models.course_category import CourseCategory
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.enums.course import CourseSort
from app.enums.file import EntityType, FilePurpose
from app.schemas.file_attachment import FileAttachmentCreate
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut, ToggleCourseActiveStatus, ToggleCourseDeleteStatus


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/")
async def create_course(
    data: str = Form(..., description='{"category_id": "", "title": "", "prerequisites": "", "short_description": "", "long_description": "", "has_certificate": true, "is_active": true}'),
    images: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        course_data = CourseCreate.model_validate_json(data)

        category = db.query(CourseCategory).filter(CourseCategory.id == course_data.category_id, CourseCategory.deleted_at.is_(None)).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        new_course = Course(
            created_by=user_id,
            category_id=course_data.category_id,
            title=course_data.title,
            prerequisites=course_data.prerequisites,
            short_description=course_data.short_description,
            long_description=course_data.long_description,
            has_certificate=course_data.has_certificate,
            is_active=course_data.is_active
        )

        db.add(new_course)
        db.flush()

        log = AuditLog(
            user_id=user_id,
            entity_id=new_course.id,
            entity_type="Course",
            action=ActionTypes.create,
            changed_fields=["created"],
        )
        db.add(log)

        if images:
            attachments_data = FileAttachmentCreate.model_validate_json(data)

            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=new_course.id,
                entity_type=EntityType.courses,
                folder_name="courses",
                files=images,
                attachments=attachments_data
            )

        db.commit()
        db.refresh(new_course)
        confirm_pending_uploads(db)

        return response_handler(
            status=True,
            message="Course created successfully",
            data=CourseOut.model_validate(new_course).model_dump(),
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
        raise HTTPException(status_code=500, detail="Failed to create course")
    

@router.get("/")
def get_courses(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True)),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[CourseSort] = Query(None),
    category_id: Optional[str] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
):
    try:
        viewer_is_admin = bool(auth["payload"]) and bool("admin" in auth["roles"])

        query = db.query(Course).options(
            selectinload(Course.course_questions),
            selectinload(Course.terms),
        )

        if viewer_is_admin:
            if is_deleted is not None:  
                if is_deleted:
                    query = query.filter(Course.deleted_at.is_not(None))
                else:
                    query = query.filter(Course.deleted_at.is_(None))
        else:
            query = query.filter(Course.deleted_at.is_(None))

        if is_active:
            query = query.filter(Course.is_active == is_active)

        if category_id:
            category = db.query(CourseCategory).filter(CourseCategory.id == category_id, CourseCategory.deleted_at.is_(None)).first()
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")
            query = query.filter(Course.category_id == category_id)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Course.title.ilike(search_term),
                    Course.short_description.ilike(search_term),
                )
            )

        if sort == CourseSort.newest:
            query = query.order_by(Course.created_at.desc())
        elif sort == CourseSort.oldest:        
            query = query.order_by(Course.created_at.asc())
        else:
            query = query.order_by(Course.created_at.desc())

        total_count = query.count()
        courses = query.offset((page - 1) * limit).limit(limit).all()

        courses_data = []
        for course in courses:
            course_dict = CourseOut.model_validate(course).model_dump()
            course_dict["terms"] = len(course.terms) if course.terms else 0
            course_dict["questions_count"] = len(course.course_questions) if course.course_questions else 0
            courses_data.append(course_dict)

        return response_handler(
            status=True,
            message="Courses retrieved successfully",
            data={
                "courses": courses_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch courses")


@router.get("/{course_id}")
def get_course_by_id(
    course_id: UUID,
    auth: dict = Depends(require_roles(auth_optional=True)),
    db: Session = Depends(get_db)
):
    try:
        viewer_is_admin = bool(auth["payload"]) and bool("admin" in auth["roles"])

        db_course = (
            db.query(Course)
            .filter(Course.id == course_id)
            .options(
                selectinload(Course.course_questions),
                selectinload(Course.terms),
            )
            .first()
        )
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if not viewer_is_admin and db_course.deleted_at is None:
            raise HTTPException(status_code=404, detail="Course not found")

        course_dict = CourseOut.model_validate(db_course).model_dump()
        course_dict["terms_count"] = len(db_course.terms) if db_course.terms else 0
        course_dict["questions_count"] = len(db_course.course_questions) if db_course.course_questions else 0

        return response_handler(
            status=True,
            message="Course retrieved successfully",
            data=CourseOut.model_validate(db_course).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch course")


@router.patch("/{course_id}")
async def update_course(
    course_id: UUID,
    data: str = Form(...),
    images: Optional[List[UploadFile]] = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        course_data = CourseUpdate.model_validate_json(data)
        update_data = course_data.model_dump(
            exclude_unset=True,
            exclude={"deleted_image_ids"}
        )

        deleted_image_ids = course_data.deleted_image_ids

        db_course = (
            db.query(Course)
            .filter(Course.id == course_id, Course.deleted_at.is_(None))
            .options(selectinload(Course.file_attachments))
            .first()
        )
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        if not update_data and not images and not deleted_image_ids:
            raise HTTPException(status_code=400, detail="No fields to update")

        changed_fields = []
        for key, value in update_data.items():
            setattr(db_course, key, value)
            changed_fields.append(key)

        # For images

        deleted_paths = []

        if deleted_image_ids:
            deleted_ids_set = set(deleted_image_ids)
            attachments = [
                attachment for attachment in db_course.file_attachments
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
                entity_id=db_course.id,
                entity_type=EntityType.courses,
                purpose=FilePurpose.image
            )

        if images:
            attachments_data = FileAttachmentCreate.model_validate_json(data)

            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=db_course.id,
                entity_type=EntityType.courses,
                folder_name="courses",
                files=images,
                attachments=attachments_data
            )

        if changed_fields:
            log = AuditLog(
                user_id=user_id,
                entity_id=db_course.id,
                entity_type="Course",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_course)
        confirm_pending_uploads(db)

        if deleted_image_ids and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Course updated successfully",
            data=CourseOut.model_validate(db_course).model_dump(),
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
        raise HTTPException(status_code=500, detail="Failed to update course")


@router.patch("/{course_id}/toggle-active")
def toggle_course_active_status(
    course_id: UUID,
    data: ToggleCourseActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        db_course = db.query(Course).filter(Course.id == course_id, Course.deleted_at.is_(None)).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        if db_course.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"Course status is already set to {data.is_active}")

        db_course.is_active = data.is_active
        log = AuditLog(
            user_id=admin_id,
            entity_id=db_course.id,
            entity_type="Course",
            action=ActionTypes.update,
            changed_fields=["is_active"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message=f"Course active status successfully set to {data.is_active}",
            data={"course_id": db_course.id, "is_active": data.is_active},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle course status")


@router.patch("/{course_id}/soft-delete")
def toggle_soft_delete_course(
    course_id: UUID,
    data: ToggleCourseDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        if (db_course.deleted_at is not None) == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Course delete is already set to {data.is_deleted}")

        db_course.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_course.id,
            entity_type="Course",
            action=ActionTypes.update,
            changed_fields=["deleted_at"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message=f"Course {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"course_id": db_course.id, "deleted_at": db_course.deleted_at},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course deletion status")


@router.delete("/{course_id}/hard-delete")
def hard_delete_course(
    course_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        has_terms = db.query(Term.id).filter(
            Term.course_id == course_id
        ).first()
        if has_terms:
            raise HTTPException(status_code=400, detail="Cannot hard-delete course. Delete all terms first.")

        deleted_paths = []
        attachments = [
            attachment for attachment in db_course.file_attachments
        ]
        deleted_attachment_ids = [attachment.id for attachment in attachments]
        if deleted_attachment_ids:
            result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
            deleted_paths = result["deleted_paths"]

        course_title = db_course.title

        db.delete(db_course)

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_course,
            entity_type="Specialty",
            action=ActionTypes.delete,
            changed_fields=["hard_delete", course_title],
        )
        db.add(log)
        db.commit()

        # if len(deleted_paths) > 0:
        if deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Course hard-deleted successfully",
            data={"course_id": course_id},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to hard-delete course")

