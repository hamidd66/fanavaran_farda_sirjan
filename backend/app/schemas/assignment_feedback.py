from pydantic import BaseModel, Field
from typing import Optional

SHAMSI_DATE_REGEX = r"^1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

class AssignmentFeedbackBase(BaseModel):
    assignment_id: int = Field(..., gt=0, description="آیدی تکلیف")
    course_id: int = Field(..., gt=0, description="آیدی دوره")
    session_number: int = Field(..., gt=0, description="شماره جلسه")
    student_id: int = Field(..., gt=0, description="آیدی هنرجو")
    staff_id: int = Field(..., gt=0, description="آیدی کادر/استاد")
    assignment_title: str = Field(..., min_length=3, max_length=150)
    instructor_feedback: str = Field(..., min_length=5, description="بازخورد استاد")
    grade: float = Field(..., ge=0, le=20, description="نمره (0-20)")
    delivery_status: str = Field(..., min_length=2, max_length=50, description="وضعیت تحویل")
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    record_date: str = Field(..., pattern=SHAMSI_DATE_REGEX, description="تاریخ ثبت (140X/XX/XX)")
    recorded_by: str = Field(..., min_length=2, max_length=100)

class AssignmentFeedbackCreate(AssignmentFeedbackBase):
    pass

class AssignmentFeedbackUpdate(AssignmentFeedbackBase):
    pass

class AssignmentFeedbackResponse(AssignmentFeedbackBase):
    id: int
    class Config:
        from_attributes = True
