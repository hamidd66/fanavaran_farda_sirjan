from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class ExpenseBase(BaseModel):
    category: str = Field(..., min_length=2, max_length=100, description="دسته‌بندی هزینه")
    title: str = Field(..., min_length=2, max_length=200, description="عنوان هزینه")
    amount: int = Field(..., gt=0, description="مبلغ هزینه به تومان (بزرگتر از صفر)")
    expense_date: str = Field(..., description="تاریخ هزینه شمسی (مثال: 1403/09/01)")
    payment_method: str = Field(..., min_length=2, max_length=50, description="روش پرداخت")
    account: str = Field(..., min_length=2, max_length=100, description="حساب یا صندوق پرداخت‌کننده")
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    record_date: str = Field(..., description="تاریخ ثبت شمسی (مثال: 1403/09/01)")
    recorded_by: str = Field(..., min_length=2, max_length=120, description="ثبت‌کننده")

    @field_validator("expense_date", "record_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/09/01)")
        return v


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(ExpenseBase):
    pass


class ExpensePatch(BaseModel):
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    amount: Optional[int] = Field(None, gt=0)
    expense_date: Optional[str] = None
    payment_method: Optional[str] = Field(None, min_length=2, max_length=50)
    account: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    record_date: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=120)

    @field_validator("expense_date", "record_date")
    @classmethod
    def validate_shamsi_date_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/09/01)")
        return v


class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
