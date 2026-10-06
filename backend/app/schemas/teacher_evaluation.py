from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

from app.schemas.classroom import ClassroomResponse
from app.schemas.staff import StaffOut
from app.schemas.student import StudentResponse

# اعتبارسنجی تاریخ شمسی (1400/01/01 تا 1499/12/29)
SHAMSI_DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class TeacherEvaluationBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    teacher_id: int = Field(..., gt=0, description="شناسه استاد (پرسنل)")
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")
    mastery_rating: int = Field(..., ge=1, le=5, description="امتیاز تسلط علمی از ۱ تا ۵")
    support_rating: int = Field(..., ge=1, le=5, description="امتیاز پشتیبانی و رفع اشکال از ۱ تا ۵")
    practical_rating: int = Field(..., ge=1, le=5, description="امتیاز کاربردی بودن تدریس از ۱ تا ۵")
    discipline_rating: int = Field(..., ge=1, le=5, description="امتیاز نظم و مدیریت زمان از ۱ تا ۵")
    description: Optional[str] = Field(None, description="توضیحات و بازخورد هنرجو (اختیاری)")
    submission_date: str = Field(..., description="تاریخ ثبت شمسی مانند 1403/08/22")

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: str) -> str:
        if not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی و معتبر باشد (مثال: 1403/08/22)")
        return v


# اسکیمای ایجاد ارزیابی استاد
class TeacherEvaluationCreate(TeacherEvaluationBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class TeacherEvaluationUpdate(TeacherEvaluationBase):
    pass


# اسکیمای ویرایش جزئی (PATCH)
class TeacherEvaluationPatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    teacher_id: Optional[int] = Field(None, gt=0)
    student_id: Optional[int] = Field(None, gt=0)
    mastery_rating: Optional[int] = Field(None, ge=1, le=5)
    support_rating: Optional[int] = Field(None, ge=1, le=5)
    practical_rating: Optional[int] = Field(None, ge=1, le=5)
    discipline_rating: Optional[int] = Field(None, ge=1, le=5)
    description: Optional[str] = None
    submission_date: Optional[str] = None

    @field_validator("submission_date")
    @classmethod
    def validate_shamsi_date(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(SHAMSI_DATE_REGEX, v):
            raise ValueError("فرمت تاریخ باید به صورت شمسی معتبر باشد (مثال: 1403/08/22)")
        return v


# اسکیمای نمایش خروجی با جزئیات کلاس، استاد و هنرجو
class TeacherEvaluationResponse(TeacherEvaluationBase):
    id: int
    created_at: datetime
    Classroom: Optional[ClassroomResponse] = None
    teacher: Optional[StaffOut] = None
    student: Optional[StudentResponse] = None

    class Config:
        from_attributes = True
