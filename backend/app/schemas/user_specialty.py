from uuid import UUID
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.specialty import SpecialtyOut


class UserSpecialtyActionItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    specialty_id: UUID
    action: Literal["assign", "remove"]

class UserSpecialtyUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    specialties: list[UserSpecialtyActionItem] = Field(..., min_length=1)

class UserSpecialtyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    specialty_id: UUID
    assigned_by: UUID
    assigned_at: datetime

    specialty: SpecialtyOut
