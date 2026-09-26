from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.attendance import Attendance
from app.models.classroom import ClassRoom
from app.models.student import Student
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
 AttendancePatch,
    AttendanceResponse,
)

router = APIRouter(
    prefix="/attendances",
    tags=["Attendances"]
)


@router.get("", response_model=List[AttendanceResponse])
def get_attendances(
    classroom_id: Optional[int] = None,
    student_id: Optional[int] = None,
    session_number: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Attendance)

    if classroom_id:
        q = q.filter(Attendance.classroom_id == classroom_id)
    if student_id:
        q = q.filter(Attendance.student_id == student_id)
    if session_number:
        q = q.filter(Attendance.session_number == session_number)
    if status_filter:
        q = q.filter(Attendance.status == status_filter)

    return q.order_by(Attendance.id.desc()).all()


@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    rec = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حضور و غیاب یافت نشد")
    return rec


@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(
    payload: AttendanceCreate,   # AttendanceCreate اینجا باشد
    db: Session = Depends(get_db)
):
    # اعتبارسنجی وجود کلاس و هنرجو
    if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    if not db.query(Student).filter(Student.id == payload.student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    # جلوگیری از ثبت تکراری برای یک (کلاس، هنرجو، جلسه)
    exists = db.query(Attendance).filter(
        Attendance.classroom_id == payload.classroom_id,
        Attendance.student_id == payload.student_id,
        Attendance.session_number == payload.session_number,
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="برای این هنرجو در این کلاس و این جلسه قبلاً حضور و غیاب ثبت شده است"
        )

    rec = Attendance(**payload.model_dump())
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec


@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(
    attendance_id: int,
    payload: AttendanceUpdate,
    db: Session = Depends(get_db)
):
    rec = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حضور و غیاب یافت نشد")

    # اعتبارسنجی وجود کلاس و هنرجو در صورت تغییر
    if payload.classroom_id != rec.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    if payload.student_id != rec.student_id:
        if not db.query(Student).filter(Student.id == payload.student_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    # جلوگیری از تکراری شدن بعد از PUT
    exists = db.query(Attendance).filter(
        Attendance.classroom_id == payload.classroom_id,
        Attendance.student_id == payload.student_id,
        Attendance.session_number == payload.session_number,
        Attendance.id != attendance_id,
    ).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="بعد از ویرایش، رکورد تکراری برای (کلاس، هنرجو، جلسه) ایجاد می‌شود"
        )

    for k, v in payload.model_dump().items():
        setattr(rec, k, v)

    db.commit()
    db.refresh(rec)
    return rec


@router.patch("/{attendance_id}", response_model=AttendanceResponse)
def patch_attendance(
    attendance_id: int,
    payload: AttendancePatch,
    db: Session = Depends(get_db)
):
    rec = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حضور و غیاب یافت نشد")

    data = payload.model_dump(exclude_unset=True)

    if "classroom_id" in data and data["classroom_id"] != rec.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == data["classroom_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    if "student_id" in data and data["student_id"] != rec.student_id:
        if not db.query(Student).filter(Student.id == data["student_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    # اگر هر کدام از سه‌گانه تغییر کند، تکراری بودن را چک کن
    new_classroom_id = data.get("classroom_id", rec.classroom_id)
    new_student_id = data.get("student_id", rec.student_id)
    new_session_number = data.get("session_number", rec.session_number)

    if (
        new_classroom_id != rec.classroom_id
        or new_student_id != rec.student_id
        or new_session_number != rec.session_number
    ):
        exists = db.query(Attendance).filter(
            Attendance.classroom_id == new_classroom_id,
            Attendance.student_id == new_student_id,
            Attendance.session_number == new_session_number,
            Attendance.id != attendance_id,
        ).first()
        if exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="بعد از ویرایش، رکورد تکراری برای (کلاس، هنرجو، جلسه) ایجاد می‌شود"
            )

    for k, v in data.items():
        setattr(rec, k, v)

    db.commit()
    db.refresh(rec)
    return rec


@router.delete("/{attendance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    rec = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حضور و غیاب یافت نشد")

    db.delete(rec)
    db.commit()
    return None
