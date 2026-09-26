# app/routers/students.py
from fastapi import APIRouter, Depends, HTTPException, Query,status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse
from app.core.user_service import create_user_for_entity

router = APIRouter(prefix="/api/students", tags=["هنرجویان"])

# ۱. دریافت لیست هنرجویان با جستجو و فیلتر وضعیت
@router.get("", response_model=List[StudentResponse])
def get_students(
    search: Optional[str] = Query(None, description="جستجو در نام، کدملی یا تلفن"),
    is_active: Optional[bool] = Query(True, description="پیش‌فرض نمایش هنرجویان فعال"),
    db: Session = Depends(get_db)
):
    query = db.query(Student).filter(Student.is_active == is_active)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Student.full_name.ilike(search_term)) |
            (Student.national_code.like(search_term)) |
            (Student.phone.like(search_term))
        )
    return query.order_by(Student.id.desc()).all()


# ۲. دریافت اطلاعات یک هنرجو با ID
@router.get("/{student_id}", response_model=StudentResponse)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="هنرجویی با این شناسه یافت نشد")
    return student


# ۳. ثبت هنرجوی جدید (همه فیلدها به جز توضیحات بررسی و اجباری می‌شوند)
# خط مربوط به post را به شکل استاندارد زیر تغییر دهید:
@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(payload: StudentCreate, db: Session = Depends(get_db)):
    # ۱. ساخت شیء هنرجو
    student = Student(**payload.model_dump())
    db.add(student)

    # ۲. ساخت خودکار کاربر متناظر
    create_user_for_entity(
        db=db,
        national_code=student.national_code,
        full_name=student.full_name,
        role="هنرجو",
        access_level="student"
    )

    # ۳. ثبت نهایی در دیتابیس
    db.commit()
    db.refresh(student)
    return student
    


# ۴. ویرایش هنرجو
@router.put("/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, payload: StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="هنرجو یافت نشد")

    update_data = payload.model_dump(exclude_unset=True)
    if "email" in update_data and update_data["email"]:
        update_data["email"] = str(update_data["email"])

    for key, value in update_data.items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


# ۵. غیرفعال کردن هنرجو (حذف نرم)
@router.delete("/{student_id}")
def soft_delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="هنرجو یافت نشد")
    
    student.is_active = False
    db.commit()
    return {"message": "هنرجو با موفقیت بایگانی (غیرفعال) شد"}


# ۶. بازیابی هنرجوی بایگانی‌شده
@router.patch("/{student_id}/restore")
def restore_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="هنرجو یافت نشد")
    
    student.is_active = True
    db.commit()
    return {"message": "هنرجو با موفقیت فعال شد"}
