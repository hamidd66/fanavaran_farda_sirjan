from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload, selectinload
from pydantic import ValidationError
from typing import Optional, List
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload, get_optional_payload
from app.middleware.exception_handler import response_handler
from app.repositories.file_repo import add_files, remove_files, reorder_files
from app.utils.delete_file import delete_files

from app.models.course import Course
from app.models.course_category import CourseCategory
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut, ToggleCourseActiveStatus, ToggleCourseDeleteStatus
from app.enums.user import UserRoleEnum
from app.enums.course import CourseSort


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/")
async def create_course(
    data: str = Form(..., description='{"category_id": "", "title": "", "prerequisites": "", "short_description": "", "long_description": "", "has_certificate": true, "is_active": true}'),
    images: List[UploadFile] | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(payload.get("sub"))
        
        if not any(role in {UserRoleEnum.admin.value, UserRoleEnum.teacher.value} for role in payload.get("role", [])):
            raise HTTPException(status_code=403, detail="Access denied")

        course_data = CourseCreate.model_validate_json(data)
        category = db.query(CourseCategory).filter(CourseCategory.id == course_data.category_id).first()
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
            changed_fields=["title", "category_id"],
        )
        db.add(log)

        if images:
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=new_course.id,
                entity_type="courses",
                purpose="image",
                files=images,
                display_order=[i+1 for i in range(len(images))]
            )

        db.commit()
        db.refresh(new_course)

        return response_handler(
            status=True,
            message="Course created successfully",
            data=CourseOut.model_validate(new_course).model_dump(),
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
        raise HTTPException(status_code=500, detail="Failed to create course")
    

@router.get("/")
def get_courses(
    db: Session = Depends(get_db),
    payload: dict | None = Depends(get_optional_payload),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[CourseSort] = Query(None),
    category_id: Optional[str] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
):
    try:
        viewer_is_admin = bool(payload) and "admin" in payload.get("role", [])

        query = db.query(Course).options(
            # joinedload(Course.faqs),
            # joinedload(Course.terms),
        )

        if viewer_is_admin:
            if is_deleted is not None:  
                query = query.filter(Course.is_deleted == is_deleted)
        else:
            query = query.filter(Course.is_deleted.is_(False))

        if is_active:
            query = query.filter(Course.is_active == is_active)

        if category_id:
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
            # course_dict["terms_count"] = len(course.contents) if course.terms else 0
            # course_dict["faqs_count"] = len(course.faqs) if course.faqs else 0
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
    payload: dict | None = Depends(get_optional_payload),
    db: Session = Depends(get_db)
):
    try:
        viewer_is_admin = bool(payload) and "admin" in payload.get("role", [])

        db_course = (
            db.query(Course)
            .filter(Course.id == course_id)
            .options(
                # joinedload(Course.faqs),
                # joinedload(Course.terms),
            )
            .first()
        )
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        if not viewer_is_admin and not db_course.is_deleted:
            raise HTTPException(status_code=404, detail="Course not found")

        course_dict = CourseOut.model_validate(db_course).model_dump()
        # course_dict["terms_count"] = len(db_course.contents) if db_course.terms else 0
        # course_dict["faqs_count"] = len(db_course.faqs) if db_course.faqs else 0

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
    images: List[UploadFile] | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(payload.get("sub"))
        
        if not any(role in {UserRoleEnum.admin.value, UserRoleEnum.teacher.value} for role in payload.get("role", [])):
            raise HTTPException(status_code=403, detail="Access denied")

        course_data = CourseUpdate.model_validate_json(data)
        update_data = course_data.model_dump(
            exclude_unset=True,
            exclude={"deleted_image_ids"}
        )

        deleted_image_ids = course_data.deleted_image_ids

        db_course = (
            db.query(Course)
            .filter(Course.id == course_id, Course.is_deleted == False)
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
        last_display_order = 0

        if deleted_image_ids:
            deleted_ids_set = set(deleted_image_ids)
            attachments = [
                attachment
                for attachment in db_course.file_attachments
                if attachment.id in deleted_ids_set
                and attachment.purpose == "image"
            ]
            if len(attachments) != len(deleted_ids_set):
                raise HTTPException(status_code=400, detail="Invalid image IDs")

            deleted_attachment_ids = [attachment.id for attachment in attachments]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        if deleted_image_ids or images:
            changed_fields.append("images")

            last_display_order = reorder_files(
                db=db,
                entity_id=db_course.id,
                entity_type="courses",
                purpose="image"
            )

        if images:
            await add_files(
                db=db,
                uploaded_by=user_id,
                entity_id=db_course.id,
                entity_type="courses",
                purpose="image",
                files=images,
                display_order=[
                    last_display_order + i
                    for i in range(1, len(images) + 1)
                ]
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
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors(include_context=False))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Input data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course")


@router.patch("/{course_id}/toggle-active")
def toggle_course_active_status(
    course_id: UUID,
    data: ToggleCourseActiveStatus,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(payload.get("sub"))
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id, Course.is_deleted == False).first()
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
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(payload.get("sub"))
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        if db_course.is_deleted == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Course delete is already set to {data.is_deleted}")

        db_course.is_deleted = data.is_deleted

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_course.id,
            entity_type="Course",
            action=ActionTypes.update,
            changed_fields=["is_deleted"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message=f"Course {'soft-deleted' if data.is_deleted else 'restored'} successfully",
            data={"course_id": db_course.id, "is_deleted": data.is_deleted},
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
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(payload.get("sub"))
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        # has_terms = db.query(Term.id).filter(
        #     Term.course_id == course_id
        # ).first()
        # if has_terms:
        #     raise HTTPException(status_code=400, detail="Cannot hard-delete course. Delete all terms first.")

        db.delete(db_course)
        db.commit()

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

