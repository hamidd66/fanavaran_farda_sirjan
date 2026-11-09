from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

from app.enums.term import ContentType
from app.schemas.user import UserOut
from app.schemas.file_attachment import FileAttachmentOut

NULLABLE_FIELDS = {
    "description",
    "body"
}

class SessionContentCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    content_type: ContentType
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None)
    body: Optional[str] = Field(None)
    is_free_preview: Optional[bool] = Field(False)
    is_active: Optional[bool] = Field(True)

class SessionContentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    content_type: Optional[ContentType] = Field(None)
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None)
    body: Optional[str] = Field(None)
    is_free_preview: Optional[bool] = Field(None)
    deleted_file_ids: Optional[List[UUID]] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            if field == "deleted_file_ids": continue
            value = getattr(self, field)
            if value is None and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip() and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be an empty string")
        return self

class ToggleSessionContentActiveStatus(BaseModel):
    is_active: bool

class ToggleSessionContentDeleteStatus(BaseModel):
    is_deleted: bool

class SessionContentOrderItem(BaseModel):
    id: UUID = Field(...)
    display_order: int = Field(...)

class SessionContentOrderItemUpdate(BaseModel):
    items: List[SessionContentOrderItem] = Field(..., min_length=1)

class SessionContentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    term_session_id: UUID
    created_by: Optional[UUID] = None
    title: str
    description: Optional[str] = None
    body: Optional[str] = None
    content_type: ContentType
    display_order: int
    is_free_preview: bool
    is_active: bool
    deleted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    user: Optional[UserOut] = None
    file_attachments: Optional[List[FileAttachmentOut]] = None