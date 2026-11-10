from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums.student_profile import StudentEducationalStatus

class StudentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    parent_phone: str = Field(..., pattern=r"^09\d{9}$")

class StudentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")

class StudentProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    person_id: UUID
    educational_status: StudentEducationalStatus
    parent_phone: str
    updated_at: Optional[datetime] = None
    created_at: datetime
