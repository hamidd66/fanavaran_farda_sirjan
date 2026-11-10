from uuid import UUID
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.enums.staff_profile import StaffEmploymentStatus, EmploymentType


class StaffCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    employment_type: EmploymentType
    job_title: str = Field(..., max_length=120)
    card_number: str = Field(..., pattern=r"^[0-9]{16}$")
    sheba_number: str = Field(..., pattern=r"^[0-9]{24}$")
    hire_date: date = Field(...)

class StaffUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    employment_type: Optional[EmploymentType] = None
    job_title: Optional[str] = Field(None, max_length=120)
    card_number: Optional[str] = Field(None, pattern=r"^[0-9]{16}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^[0-9]{24}$")
    hire_date: Optional[date] = Field(None)

class StaffProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    employment_status: StaffEmploymentStatus
    employment_type: EmploymentType
    job_title: str
    card_number: str
    sheba_number: str
    hire_date: date
    updated_at: Optional[datetime]
    created_at: datetime
