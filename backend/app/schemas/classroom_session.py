from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime, date, time

from app.enums.course import SessionType


class ClassroomSessionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_type: SessionType

    session_date: date
    start_time: time
    end_time: time

    assignment_deadline: Optional[datetime] = Field(None)
    topic: Optional[str] = Field(None, max_length=200)


class ClassroomSessionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_type: Optional[SessionType] = None

    session_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

    assignment_deadline: Optional[datetime] = None
    topic: Optional[str] = Field(None, max_length=200)


class StaffBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    job_title: Optional[str] = None

class ClassroomBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str

class ClassroomSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    classroom_id: str
    created_by: Optional[str] = None

    session_type: str
    session_number: int

    session_date: date
    start_time: time
    end_time: time

    assignment_deadline: Optional[datetime] = None
    topic: Optional[str] = None
    is_completed: bool

    created_at: datetime

    staff: Optional[StaffBrief] = None
    classroom: Optional[ClassroomBrief] = None
    records_count: int = 0