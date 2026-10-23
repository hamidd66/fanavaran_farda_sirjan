from datetime import datetime
from typing import Optional, List, Literal
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.role import RoleOut

class UserRoleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    role_id: str
    assigned_by: str
    is_access: bool
    assigned_at: datetime
    role: RoleOut


class RoleActionItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    role_id: str
    action: Literal["assign", "remove"]


class BatchRolesAssignSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    roles: List[RoleActionItem]


class RoleAccessItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    role_id: str
    is_access: bool


class BatchRoleAccessSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    access_items: List[RoleAccessItem]