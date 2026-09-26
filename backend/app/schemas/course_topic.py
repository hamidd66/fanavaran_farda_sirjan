from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.course import CourseResponse

# اعتبارسنجی تاریخ شمسی (1400/01/01 تا 1499/12/29)
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class CourseTopicBase(BaseModel):
    course_id: int = Field(..., gt=0, description="شناسه دوره مربوطه")
    title: str = Field(..., min_length=2, max_length=200, description="عنوان سرفصل")
    description: str = Field(..., min_length=3, description="توضیح مختصر سرفصل")
    subtopics: str = Field(..., min_length=2, description="عناوین زیرفصل‌ها")
    submission_date: str = Field(..., description="تاریخ ثبت شمسی مانند 1403/08/15")
    created_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت‌کننده")

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی و معتبر باشد (مثال: 1403/08/15)")
        return v


# اسکیمای ایجاد سرفصل
class CourseTopicCreate(CourseTopicBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class CourseTopicUpdate(CourseTopicBase):
    pass


# اسکیمای ویرایش جزئی (PATCH)
class CourseTopicPatch(BaseModel):
    course_id: Optional[int] = Field(None, gt=0)
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=3)
    subtopics: Optional[str] = Field(None, min_length=2)
    submission_date: Optional[str] = None
    created_by: Optional[str] = Field(None, min_length=2, max_length=100)

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی معتبر باشد (مثال: 1403/08/15)")
        return v


# اسکیمای نمایش خروجی با مشخصات دوره
class CourseTopicResponse(CourseTopicBase):
    id: int
    created_at: datetime
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True
