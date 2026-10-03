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

from app.models.course_content import CourseContent
from app.models.course import Course
from app.models.user import User
from app.schemas.course_content import CourseContentCreate, CourseContentUpdate, CourseContentOut
from app.enums.course import ContentType, ContentSort
from app.enums.user import UserRole


router = APIRouter(prefix="/course-contents", tags=["Course Contents"])


@router.post("/{course_id}")
def create_course_content(
    course_id: str,
    data: CourseContentCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        db_user = get_user_data(db, User.id == payload.get("sub"), first=True)
        if not db_user or not db_user.staff:
            raise HTTPException(status_code=400, detail="Only staff members can create content")

        content_data = data.model_dump(exclude_unset=True)

        db_content = CourseContent(
            **content_data,
            course_id=course_id,
            created_by=db_user.staff.id,
        )

        db.add(db_content)
        db.commit()
        db.refresh(db_content)

        return response_handler(
            status=True,
            message="Course content created successfully",
            data=CourseContentOut.model_validate(db_content).model_dump(by_alias=True),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Content data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create course content")


@router.get("/course/{course_id}")
def get_course_contents(
    course_id: str,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session_number: Optional[int] = Query(None, ge=1),
    content_type: Optional[ContentType] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[ContentSort] = Query(None),
):
    try:
        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        query = db.query(CourseContent).options(
            joinedload(CourseContent.staff)
        ).filter(CourseContent.course_id == course_id)

        if session_number is not None:
            query = query.filter(CourseContent.session_number == session_number)

        if content_type is not None:
            query = query.filter(CourseContent.content_type == content_type.value)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    CourseContent.title.ilike(search_term),
                    CourseContent.description.ilike(search_term)
                )
            )

        if sort == ContentSort.session_asc:
            query = query.order_by(CourseContent.session_number.asc(), CourseContent.created_at.asc())
        elif sort == ContentSort.session_desc:
            query = query.order_by(CourseContent.session_number.desc(), CourseContent.created_at.desc())
        elif sort == ContentSort.newest:
            query = query.order_by(CourseContent.created_at.desc())
        elif sort == ContentSort.oldest:
            query = query.order_by(CourseContent.created_at.asc())
        else:
            query = query.order_by(CourseContent.session_number.asc(), CourseContent.created_at.asc())
            
        total_count = query.count()
        db_contents = query.offset((page - 1) * limit).limit(limit).all()

        contents_data = [
            CourseContentOut.model_validate(content).model_dump(by_alias=True)
            for content in db_contents
        ]

        return response_handler(
            status=True,
            message="Course contents retrieved successfully",
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
        raise HTTPException(status_code=500, detail="Failed to fetch course contents")


@router.get("/content/{content_id}")
def get_course_content(
    content_id: str,
    db: Session = Depends(get_db)
):
    try:
        db_content = db.query(CourseContent).options(
            joinedload(CourseContent.staff)
        ).filter(CourseContent.id == content_id).first()

        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found in this course")

        return response_handler(
            status=True,
            message="Course content retrieved successfully",
            data=CourseContentOut.model_validate(db_content).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch course content")


@router.patch("/{content_id}")
def update_course_content(
    content_id: str,
    data: CourseContentUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_content = db.query(CourseContent).filter(
            CourseContent.id == content_id,
        ).first()
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found in this course")

        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        old_file = None
        if "file" in update_data and db_content.file and db_content.file != update_data["file"]:
            old_file = db_content.file

        if "content_type" in update_data and update_data["content_type"] is not None:
            update_data["content_type"] = update_data["content_type"].value

        for key, value in update_data.items():
            setattr(db_content, key, value)

        db.commit()
        db.refresh(db_content)

        if old_file:
            delete_file(old_file)

        return response_handler(
            status=True,
            message="Course content updated successfully",
            data=CourseContentOut.model_validate(db_content).model_dump(by_alias=True),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Content data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course content")


@router.delete("/{content_id}")
def delete_course_content(
    content_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_content = db.query(CourseContent).filter(
            CourseContent.id == content_id,
        ).first()
        if not db_content:
            raise HTTPException(status_code=404, detail="Content not found in this course")

        file_to_delete = db_content.file

        db.delete(db_content)
        db.commit()

        if file_to_delete:
            delete_file(file_to_delete)

        return response_handler(
            status=True,
            message="Course content deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete content because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete course content")
