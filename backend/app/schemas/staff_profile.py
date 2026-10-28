from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

# from app.schemas.user import UserOut
from app.enums.user import ReferralSources
from app.enums.person import Gender, EducationLevel
from app.enums.staff_profile import StaffEmploymentStatus, EmploymentType




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



# class StaffOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: str

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
    
#     description: str | None = None
#     avatar: str | None = None

#     referral_source: ReferralSources

#     created_at: datetime

#     user: UserOut


# class StaffUpdate(BaseModel):
#     model_config = ConfigDict(str_strip_whitespace=True)

#     full_name: Optional[str] = Field(None, min_length=3, max_length=100)
#     father_name: Optional[str] = Field(None, min_length=3, max_length=50)
    
#     phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")
#     email: Optional[EmailStr] = None
    
#     education: Optional[str] = Field(None, max_length=50)
#     job_title: Optional[str] = Field(None, max_length=120)
#     specialties: Optional[str] = Field(None, max_length=255)
    
#     card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
#     sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")
    
#     birth_date: Optional[str] = Field(None, pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
#     address: Optional[str] = Field(None, min_length=3)
    
#     description: Optional[str] = None
#     avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")

#     referral_source: Optional[ReferralSources] = None


# &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


class StaffCreateByAdmin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    # User fields
    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)
    is_active: bool = True

    # Person fields
    full_name: str = Field(..., min_length=3, max_length=120)
    father_name: str = Field(..., min_length=3, max_length=80)
    birth_date: str = Field(..., pattern=r"^\d{4}[/-]\d{2}[/-]\d{2}$")
    gender: Gender
    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr
    address: str = Field(..., min_length=3, max_length=300)
    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    field_of_study: Optional[str] = Field(None, max_length=255)
    education_level: EducationLevel
    referral_source: Optional[ReferralSources] = None

    # Staff profile fields
    employment_status: StaffEmploymentStatus
    employment_type: EmploymentType
    job_title: str = Field(..., max_length=120)
    card_number: str = Field(..., pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: str = Field(..., pattern=r"^(IR)?\d{24}$")
    hire_date: date = Field(...)

    # Roles and specialties
    role_ids: List[UUID] = Field(..., min_length=1)
    specialty_ids: Optional[List[UUID]] = None


class StaffUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    employment_status: Optional[StaffEmploymentStatus] = None
    employment_type: Optional[EmploymentType] = None
    job_title: Optional[str] = Field(None, max_length=120)
    card_number: Optional[str] = Field(None, pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: Optional[str] = Field(None, pattern=r"^(IR)?\d{24}$")
    hire_date: Optional[date] = Field(None)


class RegisterStaffProfileSchema(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    employment_status: StaffEmploymentStatus
    employment_type: EmploymentType
    job_title: str = Field(..., max_length=120)
    card_number: str = Field(..., pattern=r"^\d{4}-\d{4}-\d{4}-\d{4}$")
    sheba_number: str = Field(..., pattern=r"^(IR)?\d{24}$")
    hire_date: date = Field(...)


class StaffProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    employment_status: StaffEmploymentStatus
    employment_type: EmploymentType
    job_title: str
    card_number: str
    sheba_number: str
    hire_date: date
    updated_at: Optional[datetime]
    created_at: datetime