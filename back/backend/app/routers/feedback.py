from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.feedback import Feedback
from app.models.classroom import ClassRoom
from app.models.student import Student
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackUpdate,
    FeedbackPatch,
    FeedbackResponse,
)

router = APIRouter(
    prefix="/feedbacks",
    tags=["Class Feedbacks & Surveys"]
)


# ۱. دریافت لیست نظرسنجی‌ها (با فیلتر بر اساس کلاس، هنرجو و وضعیت انتشار)
@router.get("", response_model=List[FeedbackResponse])
def get_feedbacks(
    classroom_id: Optional[int] = None,
    student_id: Optional[int] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Feedback)
    if classroom_id:
        query = query.filter(Feedback.classroom_id == classroom_id)
    if student_id:
        query = query.filter(Feedback.student_id == student_id)
    if is_published is not None:
        query = query.filter(Feedback.is_published == is_published)

    return query.order_by(Feedback.id.desc()).all()


# ۲. دریافت یک نظرسنجی با ID
@router.get("/{feedback_id}", response_model=FeedbackResponse)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نظر مورد نظر یافت نشد"
        )
    return feedback


# ۳. ثبت نظرسنجی جدید
@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    # بررسی وجود کلاس
    if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    # بررسی وجود هنرجو
    if not db.query(Student).filter(Student.id == payload.student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    new_feedback = Feedback(**payload.model_dump())
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback


# ۴. ویرایش کامل نظرسنجی (PUT)
@router.put("/{feedback_id}", response_model=FeedbackResponse)
def update_feedback(feedback_id: int, payload: FeedbackUpdate, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نظر مورد نظر یافت نشد"
        )

    # بررسی وجود کلاس و دانشجو در صورت تغییر
    if payload.classroom_id != feedback.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if payload.student_id != feedback.student_id:
        if not db.query(Student).filter(Student.id == payload.student_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    for key, value in payload.model_dump().items():
        setattr(feedback, key, value)

    db.commit()
    db.refresh(feedback)
    return feedback


# ۵. ویرایش جزئی (PATCH - تغییر وضعیت تایید انتشار، امتیاز یا متن)
@router.patch("/{feedback_id}", response_model=FeedbackResponse)
def patch_feedback(feedback_id: int, payload: FeedbackPatch, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نظر مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "classroom_id" in update_data and update_data["classroom_id"] != feedback.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == update_data["classroom_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if "student_id" in update_data and update_data["student_id"] != feedback.student_id:
        if not db.query(Student).filter(Student.id == update_data["student_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    for key, value in update_data.items():
        setattr(feedback, key, value)

    db.commit()
    db.refresh(feedback)
    return feedback


# ۶. حذف نظرسنجی (DELETE)
@router.delete("/{feedback_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_feedback(feedback_id: int, db: Session = Depends(get_db)):
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نظر مورد نظر یافت نشد"
        )

    db.delete(feedback)
    db.commit()
    return None
