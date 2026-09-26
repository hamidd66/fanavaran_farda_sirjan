from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.tuition import Tuition
from app.models.classroom import ClassRoom
from app.models.student import Student
from app.schemas.tuition import (
    TuitionCreate,
    TuitionUpdate,
    TuitionPatch,
    TuitionResponse,
)

router = APIRouter(
    prefix="/tuitions",
    tags=["Tuitions"]
)


@router.get("", response_model=List[TuitionResponse])
def get_tuitions(
    classroom_id: Optional[int] = None,
    student_id: Optional[int] = None,
    transaction_status: Optional[str] = None,
    payment_type: Optional[str] = None,
    account: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Tuition)

    if classroom_id:
        query = query.filter(Tuition.classroom_id == classroom_id)
    if student_id:
        query = query.filter(Tuition.student_id == student_id)
    if transaction_status:
        query = query.filter(Tuition.transaction_status == transaction_status)
    if payment_type:
        query = query.filter(Tuition.payment_type == payment_type)
    if account:
        query = query.filter(Tuition.account == account)

    return query.order_by(Tuition.id.desc()).all()


@router.get("/{tuition_id}", response_model=TuitionResponse)
def get_tuition(
    tuition_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Tuition).filter(Tuition.id == tuition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد شهریه یافت نشد")
    return record


@router.post("", response_model=TuitionResponse, status_code=status.HTTP_201_CREATED)
def create_tuition(
    payload: TuitionCreate,
    db: Session = Depends(get_db)
):
    # بررسی وجود کلاس
    if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    # بررسی وجود هنرجو
    if not db.query(Student).filter(Student.id == payload.student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی مورد نظر یافت نشد")

    new_tuition = Tuition(**payload.model_dump())
    db.add(new_tuition)
    db.commit()
    db.refresh(new_tuition)
    return new_tuition


@router.put("/{tuition_id}", response_model=TuitionResponse)
def update_tuition(
    tuition_id: int,
    payload: TuitionUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(Tuition).filter(Tuition.id == tuition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد شهریه یافت نشد")

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


@router.patch("/{tuition_id}", response_model=TuitionResponse)
def patch_tuition(
    tuition_id: int,
    payload: TuitionPatch,
    db: Session = Depends(get_db)
):
    record = db.query(Tuition).filter(Tuition.id == tuition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد شهریه یافت نشد")

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


@router.delete("/{tuition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tuition(
    tuition_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Tuition).filter(Tuition.id == tuition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد شهریه یافت نشد")

    db.delete(record)
    db.commit()
    return None
