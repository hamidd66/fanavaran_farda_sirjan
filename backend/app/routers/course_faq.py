from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.course_faq import CourseFAQ
from app.models.course import Course
from app.schemas.course_faq import (
    CourseFAQCreate,
    CourseFAQUpdate,
    CourseFAQPatch,
    CourseFAQResponse,
)

router = APIRouter(
    prefix="/course-faqs",
    tags=["Course FAQs"]
)


# ۱. لیست سوالات متداول با قابلیت فیلتر براساس دوره
@router.get("", response_model=List[CourseFAQResponse])
def get_faqs(
    course_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CourseFAQ)
    if course_id:
        query = query.filter(CourseFAQ.course_id == course_id)

    return query.order_by(CourseFAQ.id.asc()).all()


# ۲. دریافت یک سوال متداول با ID
@router.get("/{faq_id}", response_model=CourseFAQResponse)
def get_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سوال متداول مورد نظر یافت نشد"
        )
    return faq


# ۳. ثبت سوال متداول جدید
@router.post("", response_model=CourseFAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(payload: CourseFAQCreate, db: Session = Depends(get_db)):
    # بررسی وجود دوره
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دوره انتخاب‌شده وجود ندارد"
        )

    new_faq = CourseFAQ(**payload.model_dump())
    db.add(new_faq)
    db.commit()
    db.refresh(new_faq)
    return new_faq


# ۴. ویرایش کامل سوال متداول (PUT)
@router.put("/{faq_id}", response_model=CourseFAQResponse)
def update_faq(faq_id: int, payload: CourseFAQUpdate, db: Session = Depends(get_db)):
    faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سوال متداول مورد نظر یافت نشد"
        )

    if payload.course_id != faq.course_id:
        if not db.query(Course).filter(Course.id == payload.course_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(faq, key, value)

    db.commit()
    db.refresh(faq)
    return faq


# ۵. ویرایش جزئی سوال متداول (PATCH)
@router.patch("/{faq_id}", response_model=CourseFAQResponse)
def patch_faq(faq_id: int, payload: CourseFAQPatch, db: Session = Depends(get_db)):
    faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سوال متداول مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "course_id" in update_data and update_data["course_id"] != faq.course_id:
        if not db.query(Course).filter(Course.id == update_data["course_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(faq, key, value)

    db.commit()
    db.refresh(faq)
    return faq


# ۶. حذف سوال متداول (DELETE)
@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سوال متداول مورد نظر یافت نشد"
        )

    db.delete(faq)
    db.commit()
    return None
