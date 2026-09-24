from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
import re

from app.schemas.course import CourseResponse
from app.schemas.staff import StaffOut

# الگوی اعتبارسنجی تاریخ شمسی: 1400/01/01 تا 1499/12/29
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

# الگوی اعتبارسنجی ساعت: 00:00 تا 23:59
TIME_REGEX = r"^([01]\d|2[0-3]):([0-5]\d)$"


class ClassRoomBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="عنوان کلاس")
    course_id: int = Field(..., gt=0, description="شناسه دوره")
    teacher_id: int = Field(..., gt=0, description="شناسه دبیر")
    holding_type: Literal["حضوری", "آنلاین", "آفلاین"] = Field(..., description="نوع برگزاری")
    class_link: str = Field(..., min_length=3, max_length=500, description="لینک کلاس یا آدرس سامانه")
    description: Optional[str] = Field(None, description="توضیحات کلاس (اختیاری)")
    start_date: str = Field(..., description="تاریخ شروع شمسی با فرمت 1403/07/01")
    end_date: str = Field(..., description="تاریخ پایان شمسی با فرمت 1403/09/30")
    holding_days: str = Field(..., min_length=2, max_length=200, description="روزهای برگزاری مثل: شنبه - چهارشنبه")
    start_time: str = Field(..., description="ساعت شروع با فرمت HH:MM مثلاً 16:30")
    end_time: str = Field(..., description="ساعت پایان با فرمت HH:MM مثلاً 18:00")
    capacity: int = Field(..., gt=0, description="ظرفیت کلاس")
    tuition: int = Field(..., ge=0, description="شهریه به تومان")
    sessions_count: int = Field(..., gt=0, description="تعداد جلسات")
    duration_hours: int = Field(..., gt=0, description="مدت زمان به ساعت")
    created_by: str = Field(..., min_length=2, max_length=100, description="نام یا شناسه شخص ثبت‌کننده")

    # اعتبارسنجی تاریخ شروع شمسی
    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ شروع باید شمسی و به صورت YYYY/MM/DD باشد (مثال: 1403/07/01)")
        return v

    # اعتبارسنجی تاریخ پایان شمسی
    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ پایان باید شمسی و به صورت YYYY/MM/DD باشد (مثال: 1403/09/30)")
        return v

    # اعتبارسنجی ساعت شروع
    @field_validator("start_time")
    @classmethod
    def validate_start_time(cls, v: str) -> str:
        if not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت شروع باید به صورت HH:MM باشد (مثال: 17:30)")
        return v

    # اعتبارسنجی ساعت پایان
    @field_validator("end_time")
    @classmethod
    def validate_end_time(cls, v: str) -> str:
        if not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت پایان باید به صورت HH:MM باشد (مثال: 19:30)")
        return v


# اسکیمای ثبت کلاس جدید
class ClassRoomCreate(ClassRoomBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class ClassRoomUpdate(ClassRoomBase):
    pass


# اسکیمای ویرایش جزئی (PATCH)
class ClassRoomPatch(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    course_id: Optional[int] = Field(None, gt=0)
    teacher_id: Optional[int] = Field(None, gt=0)
    holding_type: Optional[Literal["حضوری", "آنلاین", "آفلاین"]] = None
    class_link: Optional[str] = Field(None, min_length=3, max_length=500)
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    holding_days: Optional[str] = Field(None, min_length=2, max_length=200)
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    capacity: Optional[int] = Field(None, gt=0)
    tuition: Optional[int] = Field(None, ge=0)
    sessions_count: Optional[int] = Field(None, gt=0)
    duration_hours: Optional[int] = Field(None, gt=0)
    created_by: Optional[str] = Field(None, min_length=2, max_length=100)

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ شروع باید شمسی و به صورت YYYY/MM/DD باشد")
        return v

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ پایان باید شمسی و به صورت YYYY/MM/DD باشد")
        return v

    @field_validator("start_time")
    @classmethod
    def validate_start_time(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت شروع باید HH:MM باشد")
        return v

    @field_validator("end_time")
    @classmethod
    def validate_end_time(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(TIME_REGEX, v):
            raise ValueError("فرمت ساعت پایان باید HH:MM باشد")
        return v


# اسکیمای خروجی با جزئیات کامل دوره و دبیر
class ClassRoomResponse(ClassRoomBase):
    id: int
    created_at: datetime
    course: Optional[CourseResponse] = None
    teacher: Optional[StaffOut] = None

    class Config:
        from_attributes = True


