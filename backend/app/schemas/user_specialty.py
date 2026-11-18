from uuid import UUID
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field, AliasPath
from app.schemas.specialty import SpecialtyOut
from app.schemas.file_attachment import FileAttachmentSummary


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

class UserSpecialtySummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_specialty_id: UUID = Field(validation_alias="id")

    specialty_id: UUID
    name: str = Field(validation_alias=AliasPath("specialty", "name"))
    description: Optional[str] = Field(None, validation_alias=AliasPath("specialty", "description"))
    is_active: bool = Field(validation_alias=AliasPath("specialty", "is_active"))
    files: list[FileAttachmentSummary] = Field(default_factory=list, validation_alias=AliasPath("specialty", "file_attachments"))
