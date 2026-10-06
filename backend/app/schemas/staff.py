from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator
import re
from app.schemas.user import UserOut

from app.enums.user import ReferralSources
from app.enums.user import UserRole
from app.core.validators import (
    validate_iran_national_code,
    validate_iran_mobile,
    validate_card_number_16,
    validate_sheba_24_digits,
)


class StaffCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: str = Field(..., min_length=3, max_length=100)
    father_name: str = Field(..., min_length=3, max_length=50)
    birth_date: str = Field(..., pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    
    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr
    address: str = Field(..., min_length=5)
    
    education: str = Field(..., min_length=3, max_length=50)
    job_title: str = Field(..., min_length=3, max_length=120)
    specialties: str = Field(..., min_length=3, max_length=255)
    
    card_number: str = Field(..., pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: str = Field(..., pattern=r"^\d{24}$")
    
    description: str | None = Field(None)
    avatar: str | None = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")

    referral_source: ReferralSources



class StaffOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str

    full_name: str
    father_name: str
    
    phone: str
    email: EmailStr
    
    education: str
    job_title: str
    specialties: str
    
    card_number: str
    sheba_number: str
    
    birth_date: str
    address: str
    
    description: str | None = None
    avatar: str | None = None

    referral_source: ReferralSources

    created_at: datetime

    user: UserOut


class StaffUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    father_name: Optional[str] = Field(None, min_length=3, max_length=50)
    
    phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
    email: Optional[EmailStr] = None
    
    education: Optional[str] = Field(None, max_length=50)
    job_title: Optional[str] = Field(None, max_length=120)
    specialties: Optional[str] = Field(None, max_length=255)
    
    card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")
    
    birth_date: Optional[str] = Field(None, pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    address: Optional[str] = Field(None, min_length=3)
    
    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")

    referral_source: Optional[ReferralSources] = None






# --------------------------------------


class StaffBase(BaseModel):
    national_code: str = Field(..., min_length=10, max_length=10)
    full_name: str = Field(..., min_length=3, max_length=100)
    father_name: str = Field(..., min_length=2, max_length=50)

    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr

    education: str = Field(..., min_length=2, max_length=50)
    job_title: str = Field(..., min_length=2, max_length=120)
    specialties: str = Field(..., min_length=1, max_length=255)

    card_number: str = Field(..., min_length=16, max_length=16)
    sheba_number: str = Field(..., min_length=24, max_length=26)

    birth_date: str = Field(..., min_length=10, max_length=10)
    address: str = Field(..., min_length=3)

    description: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True

    @field_validator("national_code")
    @classmethod
    def validate_national_code(cls, v: str):
        if not validate_iran_national_code(v):
            raise ValueError("کد ملی معتبر نیست.")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str):
        if not validate_iran_mobile(v):
            raise ValueError("شماره موبایل معتبر نیست. (فرمت: 09xxxxxxxxx)")
        return v

    @field_validator("card_number")
    @classmethod
    def validate_card(cls, v: str):
        if not validate_card_number_16(v):
            raise ValueError("شماره کارت معتبر نیست.")
        return v

    @field_validator("sheba_number")
    @classmethod
    def validate_sheba(cls, v: str):
        clean_sheba = v.replace("IR", "").strip() if v.startswith("IR") else v.strip()
        if not validate_sheba_24_digits(clean_sheba):
            raise ValueError("شماره شبا معتبر نیست.")
        return v


# class StaffCreate(StaffBase):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     password: str = Field(..., min_length=8, max_length=128)
#     role: Optional[UserRole] = Field(default=UserRole.teacher)


# class StaffUpdate(BaseModel):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     full_name: Optional[str] = Field(None, min_length=3, max_length=100)
#     father_name: Optional[str] = Field(None, min_length=2, max_length=50)
#     phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
#     email: Optional[EmailStr] = None

#     education: Optional[str] = Field(None, min_length=2, max_length=50)
#     job_title: Optional[str] = Field(None, min_length=2, max_length=120)
#     specialties: Optional[str] = Field(None, min_length=1, max_length=255)

#     card_number: Optional[str] = Field(None, min_length=16, max_length=16)
#     sheba_number: Optional[str] = Field(None, min_length=24, max_length=26)

#     birth_date: Optional[str] = Field(None, min_length=10, max_length=10)
#     address: Optional[str] = Field(None, min_length=3)

#     description: Optional[str] = None
#     avatar: Optional[str] = None
#     is_active: Optional[bool] = None

#     @field_validator("phone")
#     @classmethod
#     def validate_optional_phone(cls, v: Optional[str]):
#         if v is not None and not validate_iran_mobile(v):
#             raise ValueError("شماره موبایل معتبر نیست.")
#         return v


# class StaffOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: str
#     user_id: Optional[str] = None
#     national_code: str
#     full_name: str
#     father_name: str
#     phone: str
#     email: EmailStr
#     education: str
#     job_title: str
#     specialties: str
#     card_number: str
#     sheba_number: str
#     birth_date: str
#     address: str
#     description: Optional[str] = None
#     avatar: Optional[str] = None
#     is_active: bool = True
#     created_at: Optional[datetime] = None
