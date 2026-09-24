from datetime import date, datetime
from pydantic import BaseModel, Field, field_validator
from app.core.validators import (
    validate_iran_national_code,
    validate_iran_mobile,
    validate_card_number_16,
    validate_sheba_24_digits,
)


class StaffBase(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=120)
    father_name: str = Field(..., min_length=2, max_length=80)
    national_code: str = Field(..., min_length=10, max_length=10)

    birth_date: date

    phone: str = Field(..., min_length=11, max_length=11)

    education_degree: str = Field(..., min_length=2, max_length=80)
    job_title: str = Field(..., min_length=2, max_length=120)

    specialties: str = Field(..., min_length=1, max_length=255)

    card_number: str = Field(..., min_length=16, max_length=16)
    sheba_number: str = Field(..., min_length=24, max_length=24)

    address: str = Field(..., min_length=5, max_length=300)

    description: str | None = None  # تنها اختیاری

    photo: str = Field(..., min_length=1, max_length=500)

    is_active: bool = True

    created_by: str = Field(..., min_length=2, max_length=120)

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
        if not validate_sheba_24_digits(v):
            raise ValueError("شماره شبا/شناسه 24 رقمی معتبر نیست.")
        return v


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    # همه فیلدها اختیاری برای آپدیت
    full_name: str | None = Field(None, min_length=3, max_length=120)
    father_name: str | None = Field(None, min_length=2, max_length=80)
    national_code: str | None = Field(None, min_length=10, max_length=10)

    birth_date: date | None = None

    phone: str | None = Field(None, min_length=11, max_length=11)

    education_degree: str | None = Field(None, min_length=2, max_length=80)
    job_title: str | None = Field(None, min_length=2, max_length=120)

    specialties: str | None = Field(None, min_length=1, max_length=255)

    card_number: str | None = Field(None, min_length=16, max_length=16)
    sheba_number: str | None = Field(None, min_length=24, max_length=24)

    address: str | None = Field(None, min_length=5, max_length=300)

    description: str | None = None

    photo: str | None = Field(None, min_length=1, max_length=500)

    is_active: bool | None = None

    created_by: str | None = Field(None, min_length=2, max_length=120)

    @field_validator("national_code")
    @classmethod
    def validate_national_code(cls, v: str | None):
        if v is None:
            return v
        if not validate_iran_national_code(v):
            raise ValueError("کد ملی معتبر نیست.")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str | None):
        if v is None:
            return v
        if not validate_iran_mobile(v):
            raise ValueError("شماره موبایل معتبر نیست.")
        return v

    @field_validator("card_number")
    @classmethod
    def validate_card(cls, v: str | None):
        if v is None:
            return v
        if not validate_card_number_16(v):
            raise ValueError("شماره کارت معتبر نیست.")
        return v

    @field_validator("sheba_number")
    @classmethod
    def validate_sheba(cls, v: str | None):
        if v is None:
            return v
        if not validate_sheba_24_digits(v):
            raise ValueError("شماره شبا/شناسه 24 رقمی معتبر نیست.")
        return v


class StaffOut(StaffBase):
    id: int
    created_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True
