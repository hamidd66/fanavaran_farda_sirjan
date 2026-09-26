from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
import re

from app.schemas.classroom import ClassRoomResponse
from app.schemas.student import StudentResponse


SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

AttendanceStatus = Literal["present", "absent", "late"]


class AttendanceBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")
    session_number: int = Field(..., ge=1, description="شماره جلسه (>=1)")

    status: AttendanceStatus = Field(..., description="وضعیت: present | absent | late")

    late_minutes: int = Field(..., ge=0, description="مدت تاخیر (دقیقه)")

    record_date: str = Field(..., description="تاریخ ثبت شمسی مثل 1403/08/22")

    absence_reason: str = Field(..., min_length=1, max_length=255, description="علت غیبت")
    late_reason: str = Field(..., min_length=1, max_length=255, description="علت تاخیر")

    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    recorded_by: str = Field(..., min_length=2, max_length=120, description="ثبت کننده")

    @field_validator("record_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/08/22)")
        return v

    @field_validator("late_minutes")
    @classmethod
    def validate_late_minutes_by_status(cls, v: int, info):
        # status در داده‌ها موجود است؟
        status = (info.data or {}).get("status")
        if status in ("present", "absent") and v != 0:
            raise ValueError("برای وضعیت present یا absent مقدار late_minutes باید 0 باشد.")
        if status == "late" and v <= 0:
            raise ValueError("برای وضعیت late مقدار late_minutes باید بزرگتر از 0 باشد.")
        return v


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(AttendanceBase):
    pass


class AttendancePatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    student_id: Optional[int] = Field(None, gt=0)
    session_number: Optional[int] = Field(None, ge=1)
    status: Optional[AttendanceStatus] = None
    late_minutes: Optional[int] = Field(None, ge=0)
    record_date: Optional[str] = None
    absence_reason: Optional[str] = Field(None, min_length=1, max_length=255)
    late_reason: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=120)

    @field_validator("record_date")
    @classmethod
    def validate_shamsi_date_optional(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی و معتبر باشد (مثال: 1403/08/22)")
        return v


class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    classroom: Optional[ClassRoomResponse] = None
    student: Optional[StudentResponse] = None

    class Config:
        from_attributes = True
