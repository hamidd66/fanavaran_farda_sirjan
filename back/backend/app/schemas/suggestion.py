from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# الگوی تاریخ شمسی: 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"
# الگوی موبایل ایران: 09123456789
PHONE_REGEX = r"^09\d{9}$"


class SuggestionBase(BaseModel):
    subject: str = Field(..., min_length=2, max_length=200, description="موضوع نظر یا پیشنهاد")
    content: str = Field(..., min_length=2, description="توضیحات و نظر")
    email: Optional[EmailStr] = Field(None, description="ایمیل (اختیاری)")
    phone_number: Optional[str] = Field(None, pattern=PHONE_REGEX, description="شماره همراه 11 رقمی با 09 (اختیاری)")
    is_published: bool = Field(default=False, description="وضعیت نمایش (پیش‌فرض False)")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت (14xx/xx/xx)")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="ثبت‌کننده")


class SuggestionCreate(SuggestionBase):
    pass


class SuggestionUpdate(SuggestionBase):
    pass


class SuggestionPatch(BaseModel):
    subject: Optional[str] = Field(None, min_length=2, max_length=200)
    content: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, pattern=PHONE_REGEX)
    is_published: Optional[bool] = None
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)


class SuggestionResponse(SuggestionBase):
    id: int

    class Config:
        from_attributes = True
