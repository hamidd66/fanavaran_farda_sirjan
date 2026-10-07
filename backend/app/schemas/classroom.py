from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List, Literal
from datetime import datetime, date, time
import re

from app.schemas.course import CourseResponse
from app.schemas.staff import StaffOut
from app.enums.classroom import HoldingType
from app.enums.global_enum import WeekDay


class ScheduleItem(BaseModel):
    day: WeekDay
    start_time: time
    end_time: time


class ClassroomCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    teacher_id: str
    
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=5000)
    holding_type: HoldingType
    class_link: str = Field(..., max_length=500)

    capacity: int = Field(..., ge=1, le=1000)

    schedule: List[ScheduleItem] = Field(..., min_length=1)

    start_date: date
    end_date: date


class ClassroomUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    teacher_id: Optional[str] = None
    course_id: Optional[str] = None

    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=5000)
    holding_type: Optional[HoldingType] = None
    class_link: Optional[str] = Field(None, max_length=500)
    
    capacity: Optional[int] = Field(None, ge=1, le=1000)

    schedule: Optional[List[ScheduleItem]] = Field(None, min_length=1)
    
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CourseBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    image: str


class TeacherBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    full_name: str
    job_title: Optional[str] = None
    avatar: Optional[str] = None


class ClassroomOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    teacher_id: str

    title: str
    description: Optional[str] = None
    holding_type: HoldingType
    class_link: str

    capacity: int
    tuition: int
    sessions_count: int
    duration_hours: int

    schedule: List[ScheduleItem]

    start_date: date
    end_date: date
    created_at: datetime

    course: Optional[CourseBrief] = None
    teacher: Optional[TeacherBrief] = None
    enrolled_count: int = 0














# ---------------------------------------------------------

# الگوی اعتبارسنجی تاریخ شمسی: 1400/01/01 تا 1499/12/29
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

# الگوی اعتبارسنجی ساعت: 00:00 تا 23:59
TIME_REGEX = r"^([01]\d|2[0-3]):([0-5]\d)$"


class ClassroomBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200, description="عنوان کلاس")
    course_id: int = Field(..., gt=0, description="شناسه دوره")
    teacher_id: int = Field(..., gt=0, description="شناسه دبیر")
    holding_type: HoldingType = Field(..., description="نوع برگزاری")
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


# # اسکیمای ثبت کلاس جدید
# class ClassroomCreate(ClassroomBase):
#     pass


# # اسکیمای ویرایش کامل (PUT)
# class ClassroomUpdate(ClassroomBase):
#     pass


# اسکیمای ویرایش جزئی (PATCH)
class ClassroomPatch(BaseModel):
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
class ClassroomResponse(ClassroomBase):
    id: int
    created_at: datetime
    course: Optional[CourseResponse] = None
    teacher: Optional[StaffOut] = None

    class Config:
        from_attributes = True


