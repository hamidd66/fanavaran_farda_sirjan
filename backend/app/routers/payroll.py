from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.payroll import Payroll
from app.models.classroom import Classroom
from app.models.staff import Staff
from app.schemas.payroll import (
    PayrollCreate,
    PayrollUpdate,
    PayrollPatch,
    PayrollResponse,
)

router = APIRouter(
    prefix="/payrolls",
    tags=["Payrolls"]
)


@router.get("", response_model=List[PayrollResponse])
def get_payrolls(
    classroom_id: Optional[int] = None,
    staff_id: Optional[int] = None,
    settlement_status: Optional[str] = None,
    payment_method: Optional[str] = None,
    account: Optional[str] = None,
    db: Session =  Depends(get_db)
):
    query = db.query(Payroll)

    if classroom_id:
        query = query.filter(Payroll.classroom_id == classroom_id)
    if staff_id:
        query = query.filter(Payroll.staff_id == staff_id)
    if settlement_status:
        query = query.filter(Payroll.settlement_status == settlement_status)
    if payment_method:
        query = query.filter(Payroll.payment_method == payment_method)
    if account:
        query = query.filter(Payroll.account == account)

    return query.order_by(Payroll.id.desc()).all()


@router.get("/{payroll_id}", response_model=PayrollResponse)
def get_payroll(
    payroll_id: int,
    db: Session =  Depends(get_db)
):
    record = db.query(Payroll).filter(Payroll.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حقوق و دستمزد یافت نشد")
    return record


@router.post("", response_model=PayrollResponse, status_code=status.HTTP_201_CREATED)
def create_payroll(
    payload: PayrollCreate,
    db: Session =  Depends(get_db)
):
    # بررسی وجود کلاس
    if not db.query(Classroom).filter(Classroom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    # بررسی وجود کادر / استاد
    if not db.query(Staff).filter(Staff.id == payload.staff_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کادر یا استاد مورد نظر یافت نشد")

    new_payroll = Payroll(**payload.model_dump())
    db.add(new_payroll)
    db.commit()
    db.refresh(new_payroll)
    return new_payroll


@router.put("/{payroll_id}", response_model=PayrollResponse)
def update_payroll(
    payroll_id: int,
    payload: PayrollUpdate,
    db: Session =  Depends(get_db)
):
    record = db.query(Payroll).filter(Payroll.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حقوق و دستمزد یافت نشد")

    if payload.classroom_id != record.classroom_id:
        if not db.query(Classroom).filter(Classroom.id == payload.classroom_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if payload.staff_id != record.staff_id:
        if not db.query(Staff).filter(Staff.id == payload.staff_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کادر یا استاد مورد نظر یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{payroll_id}", response_model=PayrollResponse)
def patch_payroll(
    payroll_id: int,
    payload: PayrollPatch,
    db: Session =  Depends(get_db)
):
    record = db.query(Payroll).filter(Payroll.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حقوق و دستمزد یافت نشد")

    data = payload.model_dump(exclude_unset=True)

    if "classroom_id" in data and data["classroom_id"] != record.classroom_id:
        if not db.query(Classroom).filter(Classroom.id == data["classroom_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس مورد نظر یافت نشد")

    if "staff_id" in data and data["staff_id"] != record.staff_id:
        if not db.query(Staff).filter(Staff.id == data["staff_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کادر یا استاد مورد نظر یافت نشد")

    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{payroll_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payroll(
    payroll_id: int,
    db: Session =  Depends(get_db)
):
    record = db.query(Payroll).filter(Payroll.id == payroll_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد حقوق و دستمزد یافت نشد")

    db.delete(record)
    db.commit()
    return None
