from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.classroom import ClassRoomResponse
from app.schemas.student import StudentResponse

SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"
TIME_REGEX = r"^([01]\d|2[0-3]):[0-5]\d$"


class TuitionBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")

    payment_type: str = Field(..., min_length=2, max_length=50, description="نوع پرداخت")
    amount: int = Field(..., gt=0, description="مبلغ پرداختی به ریال یا تومان")
    account: str = Field(..., min_length=2, max_length=100, description="حسابی که شهریه به آن واریز شده")
    discount_percent: float = Field(default=0.0, ge=0.0, le=100.0, description="درصد تخفیف بین 0 تا 100")

    payment_date: str = Field(..., description="تاریخ واریز شمسی (مثال: 1403/08/25)")
    payment_time: str = Field(..., description="زمان واریز (مثال: 14:30)")

    transaction_status: str = Field(..., min_length=2, max_length=50, description="وضعیت تراکنش")

    record_date: str = Field(..., description="تاریخ ثبت شمسی (مثال: 1403/08/25)")
    record_time: str = Field(..., description="زمان ثبت (مثال: 14:35)")

    description: Optional[str] = Field(None, description="توضیحات اختیاری")
    recorded_by: str = Field(..., min_length=2, max_length=120, description="نام ثبت کننده")

    @field_validator("payment_date", "record_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی معتبر باشد (مثال: 1403/08/25)")
        return v

    @field_validator("payment_time", "record_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت باید به صورت HH:MM باشد (مثال: 14:30)")
        return v


class TuitionCreate(TuitionBase):
    pass


class TuitionUpdate(TuitionBase):
    pass


class TuitionPatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    student_id: Optional[int] = Field(None, gt=0)
    payment_type: Optional[str] = Field(None, min_length=2, max_length=50)
    amount: Optional[int] = Field(None, gt=0)
    account: Optional[str] = Field(None, min_length=2, max_length=100)
    discount_percent: Optional[float] = Field(None, ge=0.0, le=100.0)
    payment_date: Optional[str] = None
    payment_time: Optional[str] = None
    transaction_status: Optional[str] = Field(None, min_length=2, max_length=50)
    record_date: Optional[str] = None
    record_time: Optional[str] = None
    description: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=120)

    @field_validator("payment_date", "record_date")
    @classmethod
    def validate_shamsi_date_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی معتبر باشد (مثال: 1403/08/25)")
        return v

    @field_validator("payment_time", "record_time")
    @classmethod
    def validate_time_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت باید به صورت HH:MM باشد (مثال: 14:30)")
        return v


class TuitionResponse(TuitionBase):
    id: int
    created_at: datetime
    classroom: Optional[ClassRoomResponse] = None
    student: Optional[StudentResponse] = None

    class Config:
        from_attributes = True
