from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, EmailStr, model_validator
from app.schemas.user_role import UserRoleOut
from app.schemas.person import PersonOut

NULLABLE_FIELDS = {
    "username",
    "email"
}

class UserCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    username: Optional[str] = Field(None, min_length=5, max_length=50, pattern=r"^[A-Za-z][A-Za-z0-9_]{4,}$")
    national_code: str = Field(..., pattern=r"^\d{10}$")
    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: Optional[EmailStr] = None
    password: str = Field(..., min_length=8, max_length=128)

class UserUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    username: Optional[str] = Field(None, min_length=5, max_length=50)
    national_code: Optional[str] = Field(None, pattern=r"^\d{10}$")
    phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    email: Optional[EmailStr] = None

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            value = getattr(self, field)
            if value is None and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip() and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be an empty string")
        return self

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

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    is_active: bool
    username: Optional[str] = None
    national_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    deleted_at: Optional[datetime] = None
    update_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    created_at: datetime

    user_roles: list[UserRoleOut]
    person: Optional[PersonOut] = None

# class UserSummary(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: UUID
#     user_roles: list[UserRoleOut]
#     person: Optional[PersonOut] = None
#     avatars: Optional[list] = None
