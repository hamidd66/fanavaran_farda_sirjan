from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.classroom import ClassRoomResponse
from app.schemas.student import StudentResponse

# اعتبارسنجی تاریخ شمسی (1400/01/01 تا 1499/12/29)
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class FeedbackBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس مربوطه")
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")
    facilities_rating: int = Field(..., ge=1, le=5, description="امتیاز امکانات از ۱ تا ۵")
    behavior_rating: int = Field(..., ge=1, le=5, description="امتیاز برخورد از ۱ تا ۵")
    course_quality_rating: int = Field(..., ge=1, le=5, description="امتیاز کیفیت دوره از ۱ تا ۵")
    timing_rating: int = Field(..., ge=1, le=5, description="امتیاز مناسب بودن ساعت از ۱ تا ۵")
    description: Optional[str] = Field(None, description="متن یا توضیحات نظر (اختیاری)")
    is_published: bool = Field(default=False, description="وضعیت انتشار و نمایش نظر در سایت")
    submission_date: str = Field(..., description="تاریخ ثبت شمسی مانند 1403/08/20")

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی و معتبر باشد (مثال: 1403/08/20)")
        return v


# اسکیمای ایجاد بازخورد / نظرسنجی
class FeedbackCreate(FeedbackBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class FeedbackUpdate(FeedbackBase):
    pass


# اسکیمای ویرایش جزئی (PATCH - مثلاً تایید انتشار توسط ادمین)
class FeedbackPatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    student_id: Optional[int] = Field(None, gt=0)
    facilities_rating: Optional[int] = Field(None, ge=1, le=5)
    behavior_rating: Optional[int] = Field(None, ge=1, le=5)
    course_quality_rating: Optional[int] = Field(None, ge=1, le=5)
    timing_rating: Optional[int] = Field(None, ge=1, le=5)
    description: Optional[str] = None
    is_published: Optional[bool] = None
    submission_date: Optional[str] = None

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی معتبر باشد (مثال: 1403/08/20)")
        return v


# اسکیمای نمایش خروجی با جزئیات کلاس و دانشجو
class FeedbackResponse(FeedbackBase):
    id: int
    created_at: datetime
    classroom: Optional[ClassRoomResponse] = None
    student: Optional[StudentResponse] = None

    class Config:
        from_attributes = True
