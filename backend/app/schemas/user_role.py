from uuid import UUID
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.role import RoleOut


class UserRoleActionItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    role_id: UUID
    action: Literal["assign", "remove"]

class UserRolesActionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    roles: list[UserRoleActionItem] = Field(..., min_length=1)

class UserRoleAccessItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    role_id: UUID
    is_access: bool

class UserRolesAccessUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    access_items: list[UserRoleAccessItem] = Field(..., min_length=1)


class UserRoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    role_id: UUID
    assigned_by: Optional[UUID]
    is_access: bool
    assigned_at: datetime
    role: RoleOut

