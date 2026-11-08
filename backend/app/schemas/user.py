from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.user_role import UserRoleOut
from app.schemas.person import PersonOut


class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)

class ToggleDeleteStatus(BaseModel):
    is_deleted: bool

class ToggleActiveStatus(BaseModel):
    is_active: bool

class ChangePassword(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    old_password: Optional[str] = Field(None, min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)

class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)

class UserUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    national_code: Optional[str] = Field(None, pattern=r"^\d{10}$")

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    national_code: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    user_roles: List[UserRoleOut]
    person: Optional[PersonOut] = None

# class UserSummary(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: UUID
#     user_roles: List[UserRoleOut]
#     person: Optional[PersonOut] = None
#     avatars: Optional[list] = None
