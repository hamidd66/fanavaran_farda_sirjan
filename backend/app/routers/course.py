from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.utils.delete_file import delete_file
from app.repositories.user_repo import get_user_data

from app.models.course import Course
from app.models.course_category import CourseCategory
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut
from app.enums.user import UserRole
from app.enums.course import CourseSort


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.post("/")
def create_course(
    data: CourseCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        category = db.query(CourseCategory).filter(CourseCategory.id == data.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        db_user = get_user_data(db, User.id == payload.get("sub"), first=True)
        if not db_user or not db_user.staff:
            raise HTTPException(status_code=400, detail="Only staff members can create courses")

        outline_data = [item.model_dump() for item in data.outline]

        course_data = data.model_dump(
            exclude={"outline"}
        )

        new_course = Course(
            **course_data,
            created_by=db_user.staff.id,
            outline=outline_data,
        )

        db.add(new_course)
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
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Course data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create course")


@router.get("/")
def get_courses(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    has_certificate: Optional[bool] = Query(None),
    sort: Optional[CourseSort] = Query(None),
):
    try:
        query = db.query(Course).options(
            joinedload(Course.category),
            joinedload(Course.staff),
        )

        if category_id:
            query = query.filter(Course.category_id == category_id)

        if has_certificate is not None:
            query = query.filter(Course.has_certificate == has_certificate)

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
        elif sort == CourseSort.tuition_asc:
            query = query.order_by(Course.tuition.asc())
        elif sort == CourseSort.tuition_desc:
            query = query.order_by(Course.tuition.desc())
        else:
            query = query.order_by(Course.created_at.desc())

        total_count = query.count()
        courses = query.offset((page - 1) * limit).limit(limit).all()

        courses_data = []
        for course in courses:
            course_dict = CourseOut.model_validate(course).model_dump()
            course_dict["contents_count"] = len(course.contents) if course.contents else 0
            course_dict["faqs_count"] = len(course.faqs) if course.faqs else 0
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
    course_id: str,
    db: Session = Depends(get_db)
):
    try:
        db_course = db.query(Course).options(
            joinedload(Course.category),
            joinedload(Course.staff),
        ).filter(Course.id == course_id).first()

        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        course_data = CourseOut.model_validate(db_course).model_dump()
        course_data["contents_count"] = len(db_course.contents) if db_course.contents else 0
        course_data["faqs_count"] = len(db_course.faqs) if db_course.faqs else 0

        return response_handler(
            status=True,
            message="Course retrieved successfully",
            data=course_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch course")


@router.patch("/{course_id}")
def update_course(
    course_id: str,
    data: CourseUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "category_id" in update_data:
            category = db.query(CourseCategory).filter(CourseCategory.id == update_data["category_id"]).first()
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")

        old_image = None
        if "image" in update_data and db_course.image != update_data["image"]:
            old_image = db_course.image

        if "outline" in update_data and update_data["outline"] is not None:
            update_data["outline"] = [item.model_dump() for item in data.outline]

        for key, value in update_data.items():
            setattr(db_course, key, value)

        db.commit()
        db.refresh(db_course)

        if old_image:
            delete_file(old_image)

        return response_handler(
            status=True,
            message="Course updated successfully",
            data=CourseOut.model_validate(db_course).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Course data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course")


@router.delete("/{course_id}")
def delete_course(
    course_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        course = db.query(Course).filter(Course.id == course_id).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        image_to_delete = course.image

        db.delete(course)
        db.commit()

        if image_to_delete:
            delete_file(image_to_delete)

        return response_handler(
            status=True,
            message="Course deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete course because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete course")
