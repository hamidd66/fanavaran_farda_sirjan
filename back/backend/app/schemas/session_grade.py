from pydantic import BaseModel, Field
from typing import Optional

# فرمت تاریخ شمسی 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class SessionGradeBase(BaseModel):
    classroom_id: int = Field(..., gt=0, description="شناسه کلاس")
    student_id: int = Field(..., gt=0, description="شناسه هنرجو")
    session_number: int = Field(..., gt=0, description="شماره جلسه (عدد مثبت)")
    grade: float = Field(..., ge=1.0, le=20.0, description="نمره جلسه (بین 1 تا 20)")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی نمره (اختیاری)")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت (14xx/xx/xx)")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت‌کننده")


class SessionGradeCreate(SessionGradeBase):
    pass


class SessionGradeUpdate(SessionGradeBase):
    pass


class SessionGradePatch(BaseModel):
    classroom_id: Optional[int] = Field(None, gt=0)
    student_id: Optional[int] = Field(None, gt=0)
    session_number: Optional[int] = Field(None, gt=0)
    grade: Optional[float] = Field(None, ge=1.0, le=20.0)
    description: Optional[str] = None
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)


class SessionGradeResponse(SessionGradeBase):
    id: int

    class Config:
        from_attributes = True
