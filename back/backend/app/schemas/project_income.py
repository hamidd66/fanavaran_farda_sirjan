from pydantic import BaseModel, Field
from typing import Optional


# الگوی اعتبارسنجی تاریخ شمسی: 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class ProjectIncomeBase(BaseModel):
    project_title: str = Field(..., min_length=2, max_length=200, description="عنوان پروژه")
    amount: int = Field(..., gt=0, description="مبلغ دریافتی به ریال/تومان")
    account: str = Field(..., min_length=2, max_length=100, description="حساب واریزی")
    income_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ دریافت وجه (14xx/xx/xx)")
    payment_method: str = Field(..., min_length=2, max_length=50, description="روش دریافت (کارت به کارت، پوز، نقد و...)")
    payer_name: str = Field(..., min_length=2, max_length=100, description="نام پرداخت‌کننده / کارفرما")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت‌کننده")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت رکورد (14xx/xx/xx)")


class ProjectIncomeCreate(ProjectIncomeBase):
    pass


class ProjectIncomeUpdate(ProjectIncomeBase):
    pass


class ProjectIncomePatch(BaseModel):
    project_title: Optional[str] = Field(None, min_length=2, max_length=200)
    amount: Optional[int] = Field(None, gt=0)
    account: Optional[str] = Field(None, min_length=2, max_length=100)
    income_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    payment_method: Optional[str] = Field(None, min_length=2, max_length=50)
    payer_name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)


class ProjectIncomeResponse(ProjectIncomeBase):
    id: int

    class Config:
        from_attributes = True
