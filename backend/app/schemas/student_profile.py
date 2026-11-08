from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.enums.user import ReferralSources
from app.enums.person import Gender, EducationLevel
from app.enums.student_profile import StudentEducationalStatus


class StudentRegister(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    # User fields
    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)

    # Person fields
    full_name: str = Field(..., min_length=3, max_length=120)
    father_name: str = Field(..., min_length=3, max_length=80)
    birth_date: date = Field(...)
    gender: Gender
    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr
    address: str = Field(..., min_length=3, max_length=300)
    description: Optional[str] = None
    field_of_study: Optional[str] = Field(None, max_length=255)
    education_level: EducationLevel
    referral_source: Optional[ReferralSources] = None

    # Student profile fields
    parent_phone: str = Field(..., pattern=r"^09\d{9}$")


class StudentCreateByAdmin(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    # User fields
    national_code: str = Field(..., pattern=r"^\d{10}$")
    password: str = Field(..., min_length=8, max_length=128)
    is_active: bool = True

    # Person fields
    full_name: str = Field(..., min_length=3, max_length=120)
    father_name: str = Field(..., min_length=3, max_length=80)
    birth_date: date = Field(...)
    gender: Gender
    phone: str = Field(..., pattern=r"^09\d{9}$")
    email: EmailStr
    address: str = Field(..., min_length=3, max_length=300)
    description: Optional[str] = None
    avatar: Optional[str] = Field(None, pattern=r"^/media/uploads/profile/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    field_of_study: Optional[str] = Field(None, max_length=255)
    education_level: EducationLevel
    referral_source: Optional[ReferralSources] = None

    # Student profile fields
    educational_status: StudentEducationalStatus = StudentEducationalStatus.active
    parent_phone: str = Field(..., pattern=r"^09\d{9}$")

    # Roles and specialties
    specialty_ids: Optional[List[UUID]] = None


class StudentUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    educational_status: Optional[StudentEducationalStatus] = None
    parent_phone: Optional[str] = Field(None, pattern=r"^09\d{9}$")


class RegisterStudentProfile(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    educational_status: StudentEducationalStatus = StudentEducationalStatus.active
    parent_phone: str = Field(..., pattern=r"^09\d{9}$")


class StudentProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    person_id: UUID
    educational_status: StudentEducationalStatus
    parent_phone: str
    updated_at: Optional[datetime] = None
    created_at: datetime
