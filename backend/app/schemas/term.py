from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Optional, List
from datetime import datetime

from app.schemas.file_attachment import FileAttachmentOut
from app.schemas.user import UserOut


class TermCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=3, max_length=200)
    short_description: str = Field(..., min_length=10, max_length=500)
    long_description: str = Field(..., min_length=20)

    prerequisites: str = Field(..., min_length=1, max_length=300)

    tuition: int = Field(..., ge=0)

    is_active: Optional[bool] = Field(True)

class TermUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: Optional[str] = Field(None, min_length=3, max_length=200)
    short_description: Optional[str] = Field(None, min_length=10, max_length=500)
    long_description: Optional[str] = Field(None, min_length=20)
    prerequisites: Optional[str] = Field(None, min_length=1, max_length=300)
    tuition: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = Field(None)
    
    deleted_image_ids: Optional[List[UUID]] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            if field == "deleted_image_ids": continue
            value = getattr(self, field)
            if value is None: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip(): raise ValueError(f"{field} cannot be an empty string")
        return self


class ToggleTermActiveStatus(BaseModel):
    is_active: bool

class ToggleTermDeleteStatus(BaseModel):
    is_deleted: bool


class TermOrderItem(BaseModel):
    id: UUID = Field(...)
    term_number: int = Field(...)

class TermOrderItemUpdate(BaseModel):
    items: List[TermOrderItem] = Field(..., min_length=1)


class TermOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    course_id: UUID
    created_by: Optional[UUID] = None
    title: str
    short_description: str
    long_description: str
    term_number: int
    prerequisites: str
    tuition: int
    is_active: bool
    is_deleted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    sessions_count: int = 0
    duration_hours: int = 0
    questions_count: int = 0

    user: Optional[UserOut] = None
    file_attachments: Optional[List[FileAttachmentOut]] = None