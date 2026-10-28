from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.file_attachment import FileAttachmentOut


class SpecialtyCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    
    name: str = Field(...)
    description: Optional[str] = Field(None)
    is_active: bool = Field(...)


class SpecialtyUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    is_active: Optional[bool] = Field(None)


class SpecialtyStatusItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    specialty_id: UUID
    is_active: bool

class BatchSpecialtiesStatus(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    items: List[SpecialtyStatusItem]


class SpecialtyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_by: UUID
    name: str
    description: Optional[str] = None
    is_active: bool
    updated_at: Optional[datetime] = None
    created_at: datetime

    file_attachments: Optional[List[FileAttachmentOut]] = None
