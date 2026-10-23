from datetime import datetime, date
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.specialty import SpecialtyOut


class UserSpecialtyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    person_id: str
    specialty_id: str
    assigned_by: str
    assigned_at: datetime

    specialty: SpecialtyOut


class SpecialtyActionItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    specialty_id: str
    action: Literal["assign", "remove"]

class BatchSpecialtiesAssignSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    specialties: List[SpecialtyActionItem]