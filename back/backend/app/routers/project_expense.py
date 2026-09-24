from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.project_expense import ProjectExpense
from app.schemas.project_expense import (
    ProjectExpenseCreate,
    ProjectExpenseUpdate,
    ProjectExpensePatch,
    ProjectExpenseResponse,
)

router = APIRouter(
    prefix="/project-expenses",
    tags=["Project Expenses"]
)


@router.get("", response_model=List[ProjectExpenseResponse])
def get_project_expenses(
    project_title: Optional[str] = None,
    recipient_name: Optional[str] = None,
    account: Optional[str] = None,
    payment_method: Optional[str] = None,
    payment_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProjectExpense)

    if project_title:
        query = query.filter(ProjectExpense.project_title.ilike(f"%{project_title}%"))
    if recipient_name:
        query = query.filter(ProjectExpense.recipient_name.ilike(f"%{recipient_name}%"))
    if account:
        query = query.filter(ProjectExpense.account == account)
    if payment_method:
        query = query.filter(ProjectExpense.payment_method == payment_method)
    if payment_date:
        query = query.filter(ProjectExpense.payment_date == payment_date)

    return query.order_by(ProjectExpense.id.desc()).all()


@router.get("/{expense_id}", response_model=ProjectExpenseResponse)
def get_project_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectExpense).filter(ProjectExpense.id == expense_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد هزینه پروژه یافت نشد")
    return record


@router.post("", response_model=ProjectExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_project_expense(
    payload: ProjectExpenseCreate,
    db: Session = Depends(get_db)
):
    new_record = ProjectExpense(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{expense_id}", response_model=ProjectExpenseResponse)
def update_project_expense(
    expense_id: int,
    payload: ProjectExpenseUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectExpense).filter(ProjectExpense.id == expense_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد هزینه پروژه یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{expense_id}", response_model=ProjectExpenseResponse)
def patch_project_expense(
    expense_id: int,
    payload: ProjectExpensePatch,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectExpense).filter(ProjectExpense.id == expense_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد هزینه پروژه یافت نشد")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(ProjectExpense).filter(ProjectExpense.id == expense_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="رکورد هزینه پروژه یافت نشد")

    db.delete(record)
    db.commit()
    return None
