from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.enrollment import Enrollment
from app.models.student import Student
from app.models.course import Course
from app.models.classroom import ClassRoom
from app.models.staff import Staff
from app.schemas.enrollment import (
    EnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentPatch,
    EnrollmentResponse,
)

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)

# تابع کمکی برای بررسی وجود شناسه در جداول مربوطه
def validate_foreign_keys(db: Session, student_id: int, course_id: int, classroom_id: int, staff_id: int):
    if not db.query(Student).filter(Student.id == student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده یافت نشد")
    
    if not db.query(Course).filter(Course.id == course_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده یافت نشد")

    classroom = db.query(ClassRoom).filter(ClassRoom.id == classroom_id).first()
    if not classroom:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده یافت نشد")
    
    # بررسی اینکه آیا این کلاس واقعاً متعلق به همین دوره است؟
    if classroom.course_id != course_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="کلاس انتخاب‌شده متعلق به این دوره نیست"
        )

    if not db.query(Staff).filter(Staff.id == staff_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="پرسنل/دبیر انتخاب‌شده یافت نشد")


# ۱. دریافت لیست تمام ثبت‌نام‌ها (همراه با امکان فیلتر)
@router.get("", response_model=List[EnrollmentResponse])
def get_enrollments(
    student_id: Optional[int] = None,
    classroom_id: Optional[int] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Enrollment)
    if student_id:
        query = query.filter(Enrollment.student_id == student_id)
    if classroom_id:
        query = query.filter(Enrollment.classroom_id == classroom_id)
    if course_id:
        query = query.filter(Enrollment.course_id == course_id)

    return query.order_by(Enrollment.id.desc()).all()


# ۲. دریافت جزئیات یک ثبت‌نام بر اساس ID
@router.get("/{enrollment_id}", response_model=EnrollmentResponse)
def get_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    record = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد ثبت‌نام یافت نشد")
    return record


# ۳. ثبت‌نام جدید (با جلوگیری از ثبت‌نام تکراری در یک کلاس)
@router.post("", response_model=EnrollmentResponse, status_code=status.HTTP_201_CREATED)
def create_enrollment(payload: EnrollmentCreate, db: Session = Depends(get_db)):
    # ۱. اعتبارسنجی وجود کلیدهای خارجی
    validate_foreign_keys(db, payload.student_id, payload.course_id, payload.classroom_id, payload.staff_id)

    # ۲. جلوگیری از ثبت نام تکراری هنرجو در همان کلاس
    duplicate_check = db.query(Enrollment).filter(
        Enrollment.student_id == payload.student_id,
        Enrollment.classroom_id == payload.classroom_id
    ).first()

    if duplicate_check:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="این هنرجو قبلاً در این کلاس ثبت‌نام شده است"
        )

    new_enrollment = Enrollment(**payload.model_dump())
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment


# ۴. ویرایش کامل (PUT)
@router.put("/{enrollment_id}", response_model=EnrollmentResponse)
def update_enrollment(enrollment_id: int, payload: EnrollmentUpdate, db: Session = Depends(get_db)):
    record = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد ثبت‌نام یافت نشد")

    validate_foreign_keys(db, payload.student_id, payload.course_id, payload.classroom_id, payload.staff_id)

    for key, value in payload.model_dump().items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


# ۵. ویرایش جزئی (PATCH)
@router.patch("/{enrollment_id}", response_model=EnrollmentResponse)
def patch_enrollment(enrollment_id: int, payload: EnrollmentPatch, db: Session = Depends(get_db)):
    record = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد ثبت‌نام یافت نشد")

    update_data = payload.model_dump(exclude_unset=True)

    # اگر یکی از شناسه‌ها تغییر کرده بود، مجدداً اعتبارسنجی شود
    student_id = update_data.get("student_id", record.student_id)
    course_id = update_data.get("course_id", record.course_id)
    classroom_id = update_data.get("classroom_id", record.classroom_id)
    staff_id = update_data.get("staff_id", record.staff_id)

    validate_foreign_keys(db, student_id, course_id, classroom_id, staff_id)

    for key, value in update_data.items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


# ۶. حذف ثبت‌نام (DELETE)
@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    record = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد ثبت‌نام یافت نشد")

    db.delete(record)
    db.commit()
    return None
