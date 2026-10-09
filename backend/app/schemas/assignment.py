from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional, List
from datetime import datetime
import re

from app.schemas.course import CourseResponse
from app.enums.assignment import AssignmentType


class AssignmentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_number: int = Field(..., ge=1)

    title: str = Field(..., min_length=3, max_length=200)
    assignment_type: AssignmentType
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/assignments/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png)$")
    description: Optional[str] = Field(None, max_length=5000)


class AssignmentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_number: Optional[int] = Field(None, ge=1)

    title: Optional[str] = Field(None, min_length=3, max_length=200)
    assignment_type: Optional[AssignmentType] = None
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/assignments/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png)$")
    description: Optional[str] = Field(None, max_length=5000)


class CourseBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    image: str


class StaffBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    job_title: Optional[str] = None


class AssignmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    session_number: int
    title: str
    assignment_type: str
    file: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    course: Optional[CourseBrief] = None
    staff: Optional[StaffBrief] = None
    submissions_count: int = 0
















# اعتبارسنجی تاریخ شمسی (1400/01/01 تا 1499/12/29)
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class AssignmentBase(BaseModel):
    course_id: int = Field(..., gt=0, description="شناسه دوره")
    session_number: int = Field(..., gt=0, description="شماره جلسه")
    assignment_type: str = Field(..., min_length=2, max_length=50, description="نوع تکلیف (تمرین، پروژه و...)")
    title: str = Field(..., min_length=2, max_length=200, description="عنوان تکلیف")
    file_type: str = Field(..., min_length=2, max_length=50, description="نوع فایل (مانند pdf, zip, rar)")
    attachment_file: str = Field(..., min_length=2, max_length=500, description="لینک یا مسیر فایل پیوست")
    description: Optional[str] = Field(None, description="توضیحات تکلیف (اختیاری)")
    submission_date: str = Field(..., description="تاریخ ثبت شمسی مانند 1403/08/10")
    created_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت‌کننده")

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی و معتبر باشد (مثال: 1403/08/10)")
        return v


# # اسکیمای ایجاد تکلیف
# class AssignmentCreate(AssignmentBase):
#     pass


# # اسکیمای ویرایش کامل (PUT)
# class AssignmentUpdate(AssignmentBase):
#     pass


# اسکیمای ویرایش جزئی (PATCH)
class AssignmentPatch(BaseModel):
    course_id: Optional[int] = Field(None, gt=0)
    session_number: Optional[int] = Field(None, gt=0)
    assignment_type: Optional[str] = Field(None, min_length=2, max_length=50)
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    file_type: Optional[str] = Field(None, min_length=2, max_length=50)
    attachment_file: Optional[str] = Field(None, min_length=2, max_length=500)
    description: Optional[str] = None
    submission_date: Optional[str] = None
    created_by: Optional[str] = Field(None, min_length=2, max_length=100)

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی معتبر باشد (مثال: 1403/08/10)")
        return v


# اسکیمای نمایش خروجی با مشخصات دوره
class AssignmentResponse(AssignmentBase):
    id: int
    created_at: datetime
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True
