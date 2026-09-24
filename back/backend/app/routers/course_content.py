from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.course_content import CourseContent
from app.models.course import Course
from app.schemas.course_content import (
    CourseContentCreate,
    CourseContentUpdate,
    CourseContentPatch,
    CourseContentResponse,
)

router = APIRouter(
    prefix="/course-contents",
    tags=["Course Contents"]
)


# ۱. دریافت لیست تمام محتواها (با امکان فیلتر بر اساس دوره و شماره جلسه)
@router.get("", response_model=List[CourseContentResponse])
def get_course_contents(
    course_id: Optional[int] = None,
    session_number: Optional[int] = None,
    content_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CourseContent)
    if course_id:
        query = query.filter(CourseContent.course_id == course_id)
    if session_number:
        query = query.filter(CourseContent.session_number == session_number)
    if content_type:
        query = query.filter(CourseContent.content_type == content_type)

    return query.order_by(CourseContent.session_number.asc(), CourseContent.id.asc()).all()


# ۲. دریافت جزئیات یک محتوا با ID
@router.get("/{content_id}", response_model=CourseContentResponse)
def get_course_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="محتوای مورد نظر یافت نشد"
        )
    return content


# ۳. ثبت محتوای جدید برای دوره
@router.post("", response_model=CourseContentResponse, status_code=status.HTTP_201_CREATED)
def create_course_content(payload: CourseContentCreate, db: Session = Depends(get_db)):
    # بررسی وجود دوره
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دوره انتخاب‌شده وجود ندارد"
        )

    new_content = CourseContent(**payload.model_dump())
    db.add(new_content)
    db.commit()
    db.refresh(new_content)
    return new_content


# ۴. ویرایش کامل محتوا (PUT)
@router.put("/{content_id}", response_model=CourseContentResponse)
def update_course_content(content_id: int, payload: CourseContentUpdate, db: Session = Depends(get_db)):
    content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="محتوای مورد نظر یافت نشد"
        )

    if payload.course_id != content.course_id:
        if not db.query(Course).filter(Course.id == payload.course_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(content, key, value)

    db.commit()
    db.refresh(content)
    return content


# ۵. ویرایش جزئی محتوا (PATCH)
@router.patch("/{content_id}", response_model=CourseContentResponse)
def patch_course_content(content_id: int, payload: CourseContentPatch, db: Session = Depends(get_db)):
    content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="محتوای مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "course_id" in update_data and update_data["course_id"] != content.course_id:
        if not db.query(Course).filter(Course.id == update_data["course_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(content, key, value)

    db.commit()
    db.refresh(content)
    return content


# ۶. حذف محتوا (DELETE)
@router.delete("/{content_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course_content(content_id: int, db: Session = Depends(get_db)):
    content = db.query(CourseContent).filter(CourseContent.id == content_id).first()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="محتوای مورد نظر یافت نشد"
        )

    db.delete(content)
    db.commit()
    return None
