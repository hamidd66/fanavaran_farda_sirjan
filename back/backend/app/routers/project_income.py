from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.project_income import ProjectIncome
from app.schemas.project_income import (
    ProjectIncomeCreate,
    ProjectIncomeUpdate,
    ProjectIncomePatch,
    ProjectIncomeResponse,
)

router = APIRouter(
    prefix="/project-incomes",
    tags=["Project Incomes"]
)


@router.get("", response_model=List[ProjectIncomeResponse])
def get_project_incomes(
    project_title: Optional[str] = None,
    account: Optional[str] = None,
    payment_method: Optional[str] = None,
    payer_name: Optional[str] = None,
    income_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProjectIncome)

    if project_title:
        query = query.filter(ProjectIncome.project_title.ilike(f"%{project_title}%"))
    if account:
        query = query.filter(ProjectIncome.account == account)
    if payment_method:
        query = query.filter(ProjectIncome.payment_method == payment_method)
    if payer_name:
        query = query.filter(ProjectIncome.payer_name.ilike(f"%{payer_name}%"))
    if income_date:
        query = query.filter(ProjectIncome.income_date == income_date)

    return query.order_by(ProjectIncome.id.desc()).all()


@router.get("/{income_id}", response_model=ProjectIncomeResponse)
def get_project_income(
    income_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectIncome).filter(ProjectIncome.id == income_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد درآمد پروژه یافت نشد")
    return record


@router.post("", response_model=ProjectIncomeResponse, status_code=status.HTTP_201_CREATED)
def create_project_income(
    payload: ProjectIncomeCreate,
    db: Session = Depends(get_db)
):
    new_record = ProjectIncome(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{income_id}", response_model=ProjectIncomeResponse)
def update_project_income(
    income_id: int,
    payload: ProjectIncomeUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectIncome).filter(ProjectIncome.id == income_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد درآمد پروژه یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{income_id}", response_model=ProjectIncomeResponse)
def patch_project_income(
    income_id: int,
    payload: ProjectIncomePatch,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectIncome).filter(ProjectIncome.id == income_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد درآمد پروژه یافت نشد")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_income(
    income_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectIncome).filter(ProjectIncome.id == income_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد درآمد پروژه یافت نشد")

    db.delete(record)
    db.commit()
    return None
