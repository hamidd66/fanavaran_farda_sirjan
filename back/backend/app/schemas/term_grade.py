from pydantic import BaseModel, Field
from typing import Optional

class TermGradeBase(BaseModel):
    classroom_id: int
    student_id: int
    grade_title: str = Field(..., min_length=2, max_length=50)
    grade: float = Field(..., ge=0, le=100) # اصلاح بازه نمره بر اساس نیاز شما
    is_finalized: bool = False # فیلد جدید
    description: Optional[str] = None
    record_date: str = Field(..., pattern=r"1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])")
    recorded_by: str = Field(..., min_length=2, max_length=100)

class TermGradeCreate(TermGradeBase):
    pass

class TermGradeUpdate(TermGradeBase):
    pass

class TermGradeResponse(TermGradeBase):
    id: int
    class Config:
        from_attributes = True
