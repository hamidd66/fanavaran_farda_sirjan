from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.classroom import ClassroomResponse
from app.schemas.staff import StaffOut

SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"
TIME_REGEX = r"^([01]\d|2[0-3]):[0-5]\d$"


class PayrollBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    staff_id: int = Field(..., gt=0, description="شناسه کادر / استاد")

    session_count: int = Field(..., gt=0, description="تعداد جلسات (بزرگتر از صفر)")
    session_rate: int = Field(..., gt=0, description="مبلغ هر جلسه به تومان")
    total_amount: int = Field(..., gt=0, description="مبلغ پرداختی کل به تومان")

    account: str = Field(..., min_length=2, max_length=100, description="نام یا شماره حساب مبدا")
    payment_date: str = Field(..., description="تاریخ پرداخت شمسی (مثال: 1403/09/01)")
    payment_time: str = Field(..., description="ساعت پرداخت (مثال: 11:30)")
    payment_method: str = Field(..., min_length=2, max_length=50, description="روش پرداخت")
    settlement_status: str = Field(..., min_length=2, max_length=50, description="وضعیت تسویه")

    record_date: str = Field(..., description="تاریخ ثبت شمسی (مثال: 1403/09/01)")
    recorded_by: str = Field(..., min_length=2, max_length=120, description="نام ثبت کننده")
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")

    @field_validator("payment_date", "record_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/09/01)")
        return v

    @field_validator("payment_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت باید به صورت HH:MM باشد (مثال: 11:30)")
        return v


class PayrollCreate(PayrollBase):
    pass


class PayrollUpdate(PayrollBase):
    pass


class PayrollPatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    staff_id: Optional[int] = Field(None, gt=0)
    session_count: Optional[int] = Field(None, gt=0)
    session_rate: Optional[int] = Field(None, gt=0)
    total_amount: Optional[int] = Field(None, gt=0)
    account: Optional[str] = Field(None, min_length=2, max_length=100)
    payment_date: Optional[str] = None
    payment_time: Optional[str] = None
    payment_method: Optional[str] = Field(None, min_length=2, max_length=50)
    settlement_status: Optional[str] = Field(None, min_length=2, max_length=50)
    record_date: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=120)
    description: Optional[str] = None

    @field_validator("payment_date", "record_date")
    @classmethod
    def validate_shamsi_date_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/09/01)")
        return v

    @field_validator("payment_time")
    @classmethod
    def validate_time_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت باید به صورت HH:MM باشد (مثال: 11:30)")
        return v


class PayrollResponse(PayrollBase):
    id: int
    created_at: datetime
    Classroom: Optional[ClassroomResponse] = None
    staff: Optional[StaffOut] = None

    class Config:
        from_attributes = True
