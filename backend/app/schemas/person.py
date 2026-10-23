from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, EmailStr, model_validator
from app.enums.user import ReferralSources, UserRoleEnum
from app.enums.person import Gender, EducationLevel
from app.enums.user import ReferralSources

from app.schemas.student_profile import StudentProfileOut
from app.schemas.staff_profile import StaffProfileOut
from app.schemas.user_specialty import UserSpecialtyOut
from app.schemas.file_attachment import FileAttachmentOut

NULLABLE_FIELDS = {
    "description",
    "field_of_study"
}

class PersonUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    full_name: Optional[str] = Field(None, min_length=1)
    father_name: Optional[str] = Field(None, min_length=1)
    birth_date: Optional[date] = None
    gender: Optional[Gender] = None
    phone: Optional[str] = Field(None, min_length=1)
    email: Optional[EmailStr] = None
    address: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = Field(None, min_length=1)
    field_of_study: Optional[str] = Field(None, min_length=1)
    education_level: Optional[EducationLevel] = None
    referral_source: Optional[ReferralSources] = None

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            value = getattr(self, field)
            if value is None and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip(): raise ValueError(f"{field} cannot be an empty string")
        return self


class PersonOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    full_name: str
    father_name: str
    birth_date: date
    gender: Gender
    phone: str
    email: EmailStr
    address: str
    description: Optional[str] = None
    field_of_study: Optional[str] = None
    education_level: EducationLevel
    referral_source: ReferralSources
    updated_at: Optional[datetime] = None
    created_at: datetime

    staff_profile: Optional[StaffProfileOut] = None
    student_profile: Optional[StudentProfileOut] = None
    user_specialties: Optional[List[UserSpecialtyOut]] = None
    file_attachments: Optional[List[FileAttachmentOut]] = None
