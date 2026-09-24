from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpensePatch,
    ExpenseResponse,
)

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# ۱) دریافت لیست هزینه‌ها به همراه فیلترهای اختیاری
@router.get("", response_model=List[ExpenseResponse])
def get_expenses(
    category: Optional[str] = None,
    account: Optional[str] = None,
    payment_method: Optional[str] = None,
    expense_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Expense)

    if category:
        query = query.filter(Expense.category == category)
    if account:
        query = query.filter(Expense.account == account)
    if payment_method:
        query = query.filter(Expense.payment_method == payment_method)
    if expense_date:
        query = query.filter(Expense.expense_date == expense_date)

    return query.order_by(Expense.id.desc()).all()


# ۲) دریافت یک هزینه بر اساس شناسه
@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Expense).filter(Expense.id == expense_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="رکورد هزینه مورد نظر یافت نشد"
        )
    return record


# ۳) ثبت هزینه جدید
@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db)
):
    new_expense = Expense(**payload.model_dump())
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


# ۴) ویرایش کامل هزینه (PUT)
@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(Expense).filter(Expense.id == expense_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="رکورد هزینه مورد نظر یافت نشد"
        )

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


# ۵) ویرایش جزئی هزینه (PATCH)
@router.patch("/{expense_id}", response_model=ExpenseResponse)
def patch_expense(
    expense_id: int,
    payload: ExpensePatch,
    db: Session = Depends(get_db)
):
    record = db.query(Expense).filter(Expense.id == expense_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="رکورد هزینه مورد نظر یافت نشد"
        )

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


# ۶) حذف هزینه (DELETE)
@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Expense).filter(Expense.id == expense_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="رکورد هزینه مورد نظر یافت نشد"
        )

    db.delete(record)
    db.commit()
    return None
