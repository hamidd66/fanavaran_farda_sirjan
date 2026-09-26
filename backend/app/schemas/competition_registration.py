from pydantic import BaseModel, Field, EmailStr
from typing import Optional

SHAMSI_DATE_REGEX = r"^1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"
IRAN_PHONE_REGEX = r"^09\d{9}$"
NATIONAL_ID_REGEX = r"^\d{10}$"


class CompetitionRegistrationBase(BaseModel):
    competition_id: int = Field(..., gt=0, description="شناسه مسابقه")
    full_name: str = Field(..., min_length=3, max_length=100, description="نام و نام خانوادگی")
    phone_number: str = Field(
        ...,
        pattern=IRAN_PHONE_REGEX,
        description="شماره همراه 11 رقمی با شروع 09 (مثال: 09123456789)"
    )
    national_id: str = Field(
        ...,
        pattern=NATIONAL_ID_REGEX,
        description="کد ملی 10 رقمی"
    )
    skill: str = Field(..., min_length=2, max_length=150, description="مهارت")
    email: Optional[EmailStr] = Field(None, description="ایمیل (اختیاری)")
    motivation: str = Field(..., min_length=5, description="انگیزه شرکت در مسابقه")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="نام ثبت کننده")
    record_date: str = Field(
        ...,
        pattern=SHAMSI_DATE_REGEX,
        description="تاریخ ثبت شمسی (مثال: 1403/06/15)"
    )


class CompetitionRegistrationCreate(CompetitionRegistrationBase):
    pass


class CompetitionRegistrationUpdate(CompetitionRegistrationBase):
    pass


class CompetitionRegistrationPatch(BaseModel):
    competition_id: Optional[int] = Field(None, gt=0)
    full_name: Optional[str] = Field(None, min_length=3, max_length=100)
    phone_number: Optional[str] = Field(None, pattern=IRAN_PHONE_REGEX)
    national_id: Optional[str] = Field(None, pattern=NATIONAL_ID_REGEX)
    skill: Optional[str] = Field(None, min_length=2, max_length=150)
    email: Optional[EmailStr] = None
    motivation: Optional[str] = Field(None, min_length=5)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)
    record_date: Optional[str] = Field(None, pattern=SHAMSI_DATE_REGEX)


class CompetitionRegistrationResponse(BaseModel):
    id: int
    competition_id: int
    full_name: str
    phone_number: str
    national_id: str
    skill: str
    email: Optional[str]
    motivation: str
    recorded_by: str
    record_date: str

    class Config:
        from_attributes = True
