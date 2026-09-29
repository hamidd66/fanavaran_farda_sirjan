from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.middleware.exception_handler import response_handler

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentOut, StudentUpdate, StudentResponse
from app.repositories.user_repo import create_user
from app.enums.user import UserRole


router = APIRouter(prefix="/students", tags=["ُStudents"])


@router.post("/")
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    try:
        new_user = create_user(data, db, role=UserRole.user)

        student_data = data.model_dump(
            exclude_none=True,
            exclude={
                "password",
            }
        )

        new_student = Student(**student_data)
        new_student.user_id = new_user["user"].id
        new_student.is_active = True

        db.add(new_student)
        db.commit()
        db.refresh(new_student)

        return response_handler(
            status=True,
            message="student created successfully",
            data={
                "student": StudentOut.model_validate(new_student).model_dump(),
                "access_token": new_user["access_token"],
                "refresh_token": new_user["refresh_token"]
            },
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Student create failed")










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
