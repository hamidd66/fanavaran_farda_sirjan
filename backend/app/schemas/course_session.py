from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

from app.enums.course import SessionType

class CourseSessionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    course_id: str

    session_type: SessionType
    session_number: Optional[int] = Field(None, ge=1)
    estimated_duration: int = Field(..., ge=1)
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=5000)
    is_free_preview: bool = Field(False)


class CourseSessionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_type: Optional[SessionType] = None
    session_number: Optional[int] = Field(None, ge=1)
    estimated_duration: Optional[int] = Field(None, ge=1)
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, max_length=5000)
    is_free_preview: Optional[bool] = None


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


class CourseSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    session_type: str
    session_number: int
    estimated_duration: int
    title: str
    description: Optional[str] = None
    is_free_preview: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    course: Optional[CourseBrief] = None
    staff: Optional[StaffBrief] = None


class CourseSessionBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    course_id: str
    session_number: int
    title: str
    is_free_preview: bool

