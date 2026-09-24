from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import not_, exists, and_, func
from typing import List

from app.core.database import get_db
from app.models.student import Student
from app.models.classroom import ClassRoom
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.attendance import Attendance
from app.models.term_grade import TermGrade
# ایمپورت زیر کلیدی است:
from app.schemas.dashboard import (
    ActiveStudentsResponse, 
    ActiveStudentItem, 
    OngoingClassesResponse, 
    OngoingClassItem
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard & Reports"]
)

@router.get("/active-students-count", response_model=ActiveStudentsResponse)
def get_active_students(db: Session = Depends(get_db)):
    """
    دریافت تعداد و لیست هنرجویان فعال:
    نام و نام‌خانوادگی به صورت فیلد full_name ترکیب شده‌اند.
    """
    
    # شرط نهایی نشدن نمره
    is_finalized_subquery = exists().where(
        and_(
            TermGrade.classroom_id == Enrollment.classroom_id,
            TermGrade.student_id == Enrollment.student_id,
            TermGrade.is_finalized == True
        )
    )

    # ترکیب نام و نام خانوادگی در سطح کوئری با func.concat
    query = (
        db.query(
            Student.id.label("student_id"),
            func.concat(Student.first_name, ' ', Student.last_name).label("full_name"),
            Student.national_code,
            Enrollment.classroom_id
        )
        .join(Enrollment, Student.id == Enrollment.student_id)
        .join(
            Attendance,
            and_(
                Attendance.classroom_id == Enrollment.classroom_id,
                Attendance.student_id == Enrollment.student_id
            )
        )
        .filter(not_(is_finalized_subquery))
        .distinct(Student.id, Enrollment.classroom_id)
    )

    records = query.all()

    unique_student_ids = {r.student_id for r in records}

    items = [
        ActiveStudentItem(
            student_id=r.student_id,
            full_name=r.full_name,
            national_code=r.national_code,
            classroom_id=r.classroom_id
        )
        for r in records
    ]

    return ActiveStudentsResponse(
        total_active_students=len(unique_student_ids),
        students=items
    )



from app.models.course import Course # ایمپورت مدل دوره برای نام کلاس

@router.get("/ongoing-classes", response_model=OngoingClassesResponse)
def get_ongoing_classes(db: Session = Depends(get_db)):
    """
    دریافت لیست کلاس‌هایی که:
    ۱. حداقل یک جلسه حضور و غیاب شده‌اند.
    ۲. هیچ نمره نهایی شده‌ای ندارند.
    """
    
    # ۱. شرط: حداقل یک حضور و غیاب داشته باشد
    has_attendance = exists().where(Attendance.classroom_id == ClassRoom.id)
    
    # ۲. شرط: نمره نهایی نشده باشد (نباید هیچ رکوردی با is_finalized=True داشته باشد)
    is_finalized = exists().where(
        and_(
            TermGrade.classroom_id == ClassRoom.id,
            TermGrade.is_finalized == True
        )
    )

    # کوئری اصلی
    ongoing_classes = (
        db.query(ClassRoom, Course.name.label("course_name"))
        .join(Course, ClassRoom.course_id == Course.id)
        .filter(has_attendance)          # کلاس شروع شده باشد
        .filter(not_(is_finalized))      # نمره نهایی نداشته باشد
        .all()
    )

    items = [
        OngoingClassItem(
            classroom_id=c.ClassRoom.id,
            course_name=course_name,
            class_code=getattr(c.ClassRoom, "name", "بدون نام") # اگر مدل کلاس فیلد name دارد
        )
        for c, course_name in ongoing_classes
    ]

    return OngoingClassesResponse(
        total_ongoing=len(items),
        classes=items
    )
