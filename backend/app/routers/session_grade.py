from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.session_grade import SessionGrade
from app.models.classroom import ClassRoom
from app.models.student import Student
from app.schemas.session_grade import (
    SessionGradeCreate,
    SessionGradeUpdate,
    SessionGradePatch,
    SessionGradeResponse,
)

router = APIRouter(
    prefix="/session-grades",
    tags=["Session Grades"]
)


@router.get("", response_model=List[SessionGradeResponse])
def get_session_grades(
    classroom_id: Optional[int] = None,
    student_id: Optional[int] = None,
    session_number: Optional[int] = None,
    record_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SessionGrade)

    if classroom_id:
        query = query.filter(SessionGrade.classroom_id == classroom_id)
    if student_id:
        query = query.filter(SessionGrade.student_id == student_id)
    if session_number:
        query = query.filter(SessionGrade.session_number == session_number)
    if record_date:
        query = query.filter(SessionGrade.record_date == record_date)

    return query.order_by(SessionGrade.id.desc()).all()


@router.get("/{grade_id}", response_model=SessionGradeResponse)
def get_session_grade(
    grade_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(SessionGrade).filter(SessionGrade.id == grade_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نمره جلسه یافت نشد")
    return record


@router.post("", response_model=SessionGradeResponse, status_code=status.HTTP_201_CREATED)
def create_session_grade(
    payload: SessionGradeCreate,
    db: Session = Depends(get_db)
):
    # اعتبارسنجی وجود کلاس
    if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    # اعتبارسنجی وجود هنرجو
    if not db.query(Student).filter(Student.id == payload.student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    new_record = SessionGrade(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{grade_id}", response_model=SessionGradeResponse)
def update_session_grade(
    grade_id: int,
    payload: SessionGradeUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(SessionGrade).filter(SessionGrade.id == grade_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نمره جلسه یافت نشد")

    if payload.classroom_id != record.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if payload.student_id != record.student_id:
        if not db.query(Student).filter(Student.id == payload.student_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{grade_id}", response_model=SessionGradeResponse)
def patch_session_grade(
    grade_id: int,
    payload: SessionGradePatch,
    db: Session = Depends(get_db)
):
    record = db.query(SessionGrade).filter(SessionGrade.id == grade_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نمره جلسه یافت نشد")

    data = payload.model_dump(exclude_unset=True)

    if "classroom_id" in data and data["classroom_id"] != record.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == data["classroom_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if "student_id" in data and data["student_id"] != record.student_id:
        if not db.query(Student).filter(Student.id == data["student_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session_grade(
    grade_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(SessionGrade).filter(SessionGrade.id == grade_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نمره جلسه یافت نشد")

    db.delete(record)
    db.commit()
    return None
