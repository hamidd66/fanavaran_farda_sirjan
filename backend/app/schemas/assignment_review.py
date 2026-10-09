from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.enums.assignment import ReviewStatus


class AssignmentReviewCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    status: ReviewStatus
    grade: float = Field(..., ge=0, le=100)
    description: Optional[str] = Field(None, max_length=5000)
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/reviews/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png)$")


class AssignmentReviewUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    status: Optional[ReviewStatus] = None
    grade: float = Field(..., ge=0, le=100)
    description: Optional[str] = Field(None, max_length=5000)
    file: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/reviews/[A-Za-z0-9_\-./]+\.(pdf|docx|zip|rar|mp4|mp3|txt|jpg|png)$")


class SubmissionBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    attempt_number: int
    status: str
    file: Optional[str] = None


class StaffBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    job_title: Optional[str] = None


class AssignmentReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    submission_id: str
    staff_id: Optional[str] = None
    status: str
    grade: float
    description: Optional[str] = None
    file: Optional[str] = None
    is_latest: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    submission: Optional[SubmissionBrief] = None
    staff: Optional[StaffBrief] = None