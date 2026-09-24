from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.course_topic import CourseTopic
from app.models.course import Course
from app.schemas.course_topic import (
    CourseTopicCreate,
    CourseTopicUpdate,
    CourseTopicPatch,
    CourseTopicResponse,
)

router = APIRouter(
    prefix="/course-topics",
    tags=["Course Topics"]
)


# ۱. دریافت لیست سرفصل‌ها (با قابلیت فیلتر بر اساس دوره)
@router.get("", response_model=List[CourseTopicResponse])
def get_topics(
    course_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CourseTopic)
    if course_id:
        query = query.filter(CourseTopic.course_id == course_id)

    return query.order_by(CourseTopic.id.asc()).all()


# ۲. دریافت یک سرفصل مشخص با ID
@router.get("/{topic_id}", response_model=CourseTopicResponse)
def get_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(CourseTopic).filter(CourseTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سرفصل مورد نظر یافت نشد"
        )
    return topic


# ۳. ثبت سرفصل جدید
@router.post("", response_model=CourseTopicResponse, status_code=status.HTTP_201_CREATED)
def create_topic(payload: CourseTopicCreate, db: Session = Depends(get_db)):
    # بررسی وجود دوره
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دوره انتخاب‌شده وجود ندارد"
        )

    new_topic = CourseTopic(**payload.model_dump())
    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)
    return new_topic


# ۴. ویرایش کامل سرفصل (PUT)
@router.put("/{topic_id}", response_model=CourseTopicResponse)
def update_topic(topic_id: int, payload: CourseTopicUpdate, db: Session = Depends(get_db)):
    topic = db.query(CourseTopic).filter(CourseTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سرفصل مورد نظر یافت نشد"
        )

    if payload.course_id != topic.course_id:
        if not db.query(Course).filter(Course.id == payload.course_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(topic, key, value)

    db.commit()
    db.refresh(topic)
    return topic


# ۵. ویرایش جزئی سرفصل (PATCH)
@router.patch("/{topic_id}", response_model=CourseTopicResponse)
def patch_topic(topic_id: int, payload: CourseTopicPatch, db: Session = Depends(get_db)):
    topic = db.query(CourseTopic).filter(CourseTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سرفصل مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "course_id" in update_data and update_data["course_id"] != topic.course_id:
        if not db.query(Course).filter(Course.id == update_data["course_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(topic, key, value)

    db.commit()
    db.refresh(topic)
    return topic


# ۶. حذف سرفصل (DELETE)
@router.delete("/{topic_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    topic = db.query(CourseTopic).filter(CourseTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="سرفصل مورد نظر یافت نشد"
        )

    db.delete(topic)
    db.commit()
    return None
