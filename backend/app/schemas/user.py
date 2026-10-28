from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from app.enums.user import ReferralSources, UserRoleEnum
from app.schemas.user_role import UserRoleOut
from app.schemas.person import PersonOut

class ToggleActiveStatus(BaseModel):
    is_active: bool

class ToggleDeleteStatus(BaseModel):
    is_deleted: bool

class ChangePassword(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    old_password: Optional[str] = Field(None, min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)

class UserCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    role: UserRoleEnum

    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)

    full_name: str = Field(..., min_length=3, max_length=100)
    father_name: str = Field(..., min_length=3, max_length=50)

    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr

    birth_date: str = Field(..., pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    education: str = Field(..., max_length=50)
    address: str = Field(..., min_length=3)

    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")

    referral_source: Optional[ReferralSources] = Field(None)
    
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    
    job_title: Optional[str] = Field(None, max_length=120)
    specialties: Optional[str] = Field(None, max_length=255)

    card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")
    

# class UserUpdate(BaseModel):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     national_code: Optional[str] = Field(None, pattern=r"^\d{10}$")

#     full_name: Optional[str] = Field(None, min_length=3, max_length=100)
#     father_name: Optional[str] = Field(None, min_length=3, max_length=50)

#     phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
#     email: Optional[EmailStr] = None

#     birth_date: Optional[str] = Field(None, pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
#     education: Optional[str] = Field(None, max_length=50)
#     address: Optional[str] = Field(None, min_length=3)

#     description: Optional[str] = None
#     avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")

#     referral_source: Optional[ReferralSources] = Field(None)
    
#     parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    
#     job_title: Optional[str] = Field(None, max_length=120)
#     specialties: Optional[str] = Field(None, max_length=255)
    
#     card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
#     sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")


class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)


# class UserOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: str
#     role: UserRoleEnum
#     national_code: str
#     is_active: bool
#     created_at: datetime
#     last_login: Optional[datetime] = None

# &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


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
    national_code: str
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    user_roles: List[UserRoleOut]
    person: Optional[PersonOut]

class UserUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: Optional[str] = Field(None, pattern=r"^\d{10}$")
