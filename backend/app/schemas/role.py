from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.file_attachment import FileAttachmentOut


class RoleStatusItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    role_id: str
    is_active: bool


class BatchRolesStatusSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    items: List[RoleStatusItem]


class UpdateRoleSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: Optional[str] = Field(None)
    description: Optional[str] = Field(None)
    is_active: Optional[bool] = Field(None)


class RoleOut (BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_by: Optional[str] = None
    name: str
    title: str
    description: Optional[str] = None 
    is_active: bool
    updated_at: Optional[datetime] = None
    created_at: datetime

    file_attachments: Optional[List[FileAttachmentOut]] = None
