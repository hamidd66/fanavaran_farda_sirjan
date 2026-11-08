from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.file import FileOut
from app.enums.file import FilePurpose, EntityType

# {"items": [{"file_index": 0, "purpose": "avatar", "display_order": 2, "is_primary": false, "is_active": true}]}
class FileAttachmentOrderItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    file_index: int = Field(..., ge=0)
    purpose: FilePurpose
    display_order: int = Field(..., ge=1)
    is_primary: bool = Field(...)
    is_active: bool = Field(True)


class FileAttachmentCreate(BaseModel):
    items: List[FileAttachmentOrderItem] = Field(..., min_length=1)

class FileAttachmentUpdate(BaseModel):
    items: Optional[List[FileAttachmentOrderItem]] = Field(None, min_length=1)


class FileAttachmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_id: UUID
    entity_id: UUID
    attached_by: UUID
    entity_type: EntityType
    purpose: FilePurpose
    display_order: int
    is_primary: bool
    is_active: bool
    description: Optional[str] = None
    deleted_at: Optional[datetime]
    updated_at: Optional[datetime]
    created_at: datetime

    file: FileOut

# class FileAttachmentSummary(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: UUID
#     purpose: FilePurpose
#     display_order: int
#     is_primary: bool

#     file: FileSummary
