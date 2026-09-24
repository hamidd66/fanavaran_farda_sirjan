from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.student import StudentResponse
from app.schemas.course import CourseResponse
from app.schemas.classroom import ClassRoomResponse
from app.schemas.staff import StaffOut

# الگوی Regex تاریخ شمسی (1400/01/01 تا 1499/12/29)
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

# الگوی Regex ساعت (00:00 تا 23:59)
TIME_REGEX = r"^([01]\d|2[0-3]):([0-5]\d)$"


class EnrollmentBase(BaseModel):
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")
    course_id: int = Field(..., gt=0, description="شناسه دوره")
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    staff_id: int = Field(..., gt=0, description="شناسه پرسنل/مشاور ثبت‌کننده")
    registration_date: str = Field(..., description="تاریخ ثبت‌نام شمسی مانند 1403/07/15")
    registration_time: str = Field(..., description="زمان ثبت‌نام با فرمت HH:MM مانند 11:45")
    registration_method: str = Field(..., min_length=2, max_length=50, description="طریقه ثبت‌نام (حضوری، آنلاین و ...)")
    referral_source: str = Field(..., min_length=2, max_length=100, description="طریقه آشنایی با آموزشگاه")
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    created_by: str = Field(..., min_length=2, max_length=100, description="نام یا کدملی ثبت‌کننده")

    # اعتبارسنجی تاریخ شمسی
    @field_validator("registration_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی و معتبر باشد (مثال: 1403/07/15)")
        return v

    # اعتبارسنجی فرمت ساعت
    @field_validator("registration_time")
    @classmethod
    def validate_time(cls, v: str) -> str:
        if not re.match(TIME_REGEX, v):
            raise ValueError("فرمت زمان باید معتبر و به صورت HH:MM باشد (مثال: 14:30)")
        return v


# اسکیمای ساخت ثبت‌نام جدید
class EnrollmentCreate(EnrollmentBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class EnrollmentUpdate(EnrollmentBase):
    pass


# اسکیمای ویرایش جزئی (PATCH)
class EnrollmentPatch(BaseModel):
    student_id: Optional[int] = Field(None, gt=0)
    course_id: Optional[int] = Field(None, gt=0)
    classroom_id: Optional[int] = Field(None, gt=0)
    staff_id: Optional[int] = Field(None, gt=0)
    registration_date: Optional[str] = None
    registration_time: Optional[str] = None
    registration_method: Optional[str] = Field(None, min_length=2, max_length=50)
    referral_source: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    created_by: Optional[str] = Field(None, min_length=2, max_length=100)

    @field_validator("registration_date")
    @classmethod
    def validate_shamsi_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید شمسی باشد (مثال: 1403/07/15)")
        return v

    @field_validator("registration_time")
    @classmethod
    def validate_time(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(TIME_REGEX, v):
            raise ValueError("فرمت زمان باید به صورت HH:MM باشد")
        return v


# اسکیمای نمایش خروجی همراه با اطلاعات کامل رابطه ها
class EnrollmentResponse(EnrollmentBase):
    id: int
    created_at: datetime
    student: Optional[StudentResponse] = None
    course: Optional[CourseResponse] = None
    classroom: Optional[ClassRoomResponse] = None
    staff: Optional[StaffOut] = None

    class Config:
        from_attributes = True
