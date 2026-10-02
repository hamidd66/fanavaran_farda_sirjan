from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator, EmailStr
from app.enums.user import UserRole
from app.core.validators import validate_iran_national_code



class ToggleActiveStatus(BaseModel):
    is_active: bool

class ChangePassword(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    old_password: Optional[str] = Field(None, min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)

class UserCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    role: UserRole

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
    
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    
    job_title: Optional[str] = Field(None, max_length=120)
    specialties: Optional[str] = Field(None, max_length=255)

    card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")
    

class UserUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: Optional[str] = Field(None, pattern=r"^\d{10}$")

    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    father_name: Optional[str] = Field(None, min_length=3, max_length=50)

    phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    email: Optional[EmailStr] = None

    birth_date: Optional[str] = Field(None, pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    education: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, min_length=3)

    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    
    job_title: Optional[str] = Field(None, max_length=120)
    specialties: Optional[str] = Field(None, max_length=255)
    
    card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")


class UserLogin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    role: UserRole
    national_code: str
    is_active: bool
    created_at: datetime
    last_login: datetime | None = None


# -----------------------------------------------------

# class UserCreate(BaseModel):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     national_code: str = Field(..., min_length=10, max_length=10)
#     full_name: str = Field(..., min_length=3, max_length=120)
#     role: UserRole = Field(default=UserRole.user)
#     password: str = Field(..., min_length=8, max_length=128)

#     @field_validator("national_code")
#     @classmethod
#     def validate_national_code(cls, v: str):
#         if not validate_iran_national_code(v):
#             raise ValueError("کد ملی معتبر نیست.")
#         return v


# Backward compatibility alias
# RegisterUser = UserCreate


class LoginUser(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    national_code: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    password: str = Field(..., min_length=8, max_length=128)


# class UserUpdate(BaseModel):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     full_name: Optional[str] = Field(None, min_length=3, max_length=120)
#     role: Optional[UserRole] = None
#     password: Optional[str] = Field(None, min_length=8, max_length=128)
#     is_active: Optional[bool] = None


# class UserOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: str
#     national_code: str
#     full_name: str
#     role: UserRole
#     token_version: int = 1
#     is_active: bool = True
#     last_login: Optional[datetime] = None
#     created_at: Optional[datetime] = None
