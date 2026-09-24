from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.classroom import ClassRoom
from app.models.course import Course
from app.models.staff import Staff
from app.schemas.classroom import (
    ClassRoomCreate,
    ClassRoomUpdate,
    ClassRoomPatch,
    ClassRoomResponse,
)

router = APIRouter(
    prefix="/classrooms",
    tags=["Classrooms"]
)

# ۱. دریافت لیست کلاس‌ها (با امکان فیلتر بر اساس دوره، دبیر و نوع برگزاری)
@router.get("", response_model=List[ClassRoomResponse])
def get_classrooms(
    course_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    holding_type: Optional[str] = None,
    db: Session = Depends(get_db)):

    query = db.query(ClassRoom)
    if course_id:
        query = query.filter(ClassRoom.course_id == course_id)
    if teacher_id:
        query = query.filter(ClassRoom.teacher_id == teacher_id)
    if holding_type:
        query = query.filter(ClassRoom.holding_type == holding_type)

    return query.order_by(ClassRoom.id.desc()).all()


# ۲. دریافت جزئیات یک کلاس بر اساس ID
@router.get("/{classroom_id}", response_model=ClassRoomResponse)
def get_classroom(classroom_id: int, db: Session = Depends(get_db)):
    classroom = db.query(ClassRoom).filter(ClassRoom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کلاس مورد نظر یافت نشد"
        )
    return classroom


# ۳. ایجاد کلاس جدید
@router.post("", response_model=ClassRoomResponse, status_code=status.HTTP_201_CREATED)
def create_classroom(payload: ClassRoomCreate, db: Session = Depends(get_db)):
    # بررسی وجود دوره
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دوره انتخاب‌شده وجود ندارد"
        )

    # بررسی وجود دبیر
    teacher = db.query(Staff).filter(Staff.id == payload.teacher_id).first()
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دبیر انتخاب‌شده در لیست کادر یافت نشد"
        )

    new_classroom = ClassRoom(**payload.model_dump())
    db.add(new_classroom)
    db.commit()
    db.refresh(new_classroom)
    return new_classroom


# ۴. ویرایش کامل کلاس (PUT)
@router.put("/{classroom_id}", response_model=ClassRoomResponse)
def update_classroom(classroom_id: int, payload: ClassRoomUpdate, db: Session = Depends(get_db)):
    classroom = db.query(ClassRoom).filter(ClassRoom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کلاس مورد نظر یافت نشد"
        )

    # بررسی وجود دوره در صورت تغییر
    if payload.course_id != classroom.course_id:
        if not db.query(Course).filter(Course.id == payload.course_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    # بررسی وجود دبیر در صورت تغییر
    if payload.teacher_id != classroom.teacher_id:
        if not db.query(Staff).filter(Staff.id == payload.teacher_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دبیر انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(classroom, key, value)

    db.commit()
    db.refresh(classroom)
    return classroom


# ۵. ویرایش جزئی کلاس (PATCH)
@router.patch("/{classroom_id}", response_model=ClassRoomResponse)
def patch_classroom(classroom_id: int, payload: ClassRoomPatch, db: Session = Depends(get_db)):
    classroom = db.query(ClassRoom).filter(ClassRoom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کلاس مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "course_id" in update_data and update_data["course_id"] != classroom.course_id:
        if not db.query(Course).filter(Course.id == update_data["course_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    if "teacher_id" in update_data and update_data["teacher_id"] != classroom.teacher_id:
        if not db.query(Staff).filter(Staff.id == update_data["teacher_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دبیر انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(classroom, key, value)

    db.commit()
    db.refresh(classroom)
    return classroom


# ۶. حذف کلاس (DELETE)
@router.delete("/{classroom_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_classroom(classroom_id: int, db: Session = Depends(get_db)):
    classroom = db.query(ClassRoom).filter(ClassRoom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کلاس مورد نظر یافت نشد"
        )

    db.delete(classroom)
    db.commit()
    return None
