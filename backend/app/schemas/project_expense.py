from pydantic import BaseModel, Field
from typing import Optional

# الگوی اعتبارسنجی تاریخ شمسی: 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class ProjectExpenseBase(BaseModel):
    project_title: str = Field(..., min_length=2, max_length=200, description="عنوان پروژه")
    recipient_name: str = Field(..., min_length=2, max_length=100, description="نام دریافت‌کننده")
    total_wage: int = Field(..., gt=0, description="کل دستمزد به ریال/تومان")
    paid_amount: int = Field(..., gt=0, description="مبلغ پرداختی به ریال/تومان")
    account: str = Field(..., min_length=2, max_length=100, description="حساب برداشت‌شده")
    payment_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ پرداخت (14xx/xx/xx)")
    payment_method: str = Field(..., min_length=2, max_length=50, description="روش پرداخت")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت‌کننده")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت رکورد (14xx/xx/xx)")


class ProjectExpenseCreate(ProjectExpenseBase):
    pass


class ProjectExpenseUpdate(ProjectExpenseBase):
    pass


class ProjectExpensePatch(BaseModel):
    project_title: Optional[str] = Field(None, min_length=2, max_length=200)
    recipient_name: Optional[str] = Field(None, min_length=2, max_length=100)
    total_wage: Optional[int] = Field(None, gt=0)
    paid_amount: Optional[int] = Field(None, gt=0)
    account: Optional[str] = Field(None, min_length=2, max_length=100)
    payment_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    payment_method: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)


class ProjectExpenseResponse(ProjectExpenseBase):
    id: int

    class Config:
        from_attributes = True
