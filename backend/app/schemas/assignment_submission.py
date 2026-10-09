from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class AssignmentSubmissionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    assignment_id: str
    classroom_session_id: str

    description: Optional[str] = Field(None, max_length=5000)
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/submissions/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png|py|js|html|css)$")


class AssignmentSubmissionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    description: Optional[str] = Field(None, max_length=5000)
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/submissions/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png|py|js|html|css)$")


class AssignmentBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    assignment_type: str
    session_number: int


class StudentBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    phone: str
    avatar: Optional[str] = None


class AssignmentSubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    assignment_id: str
    classroom_session_id: str
    student_id: str
    status: str
    attempt_number: int
    description: Optional[str] = None
    file: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    assignment: Optional[AssignmentBrief] = None
    student: Optional[StudentBrief] = None
    reviews_count: int = 0
    latest_grade: Optional[int] = None




















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

# class AssignmentFeedbackCreate(AssignmentFeedbackBase):
#     pass

# class AssignmentFeedbackUpdate(AssignmentFeedbackBase):
#     pass

class AssignmentFeedbackResponse(AssignmentFeedbackBase):
    id: int
    class Config:
        from_attributes = True
