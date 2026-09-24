from pydantic import BaseModel, Field
from typing import Optional

# الگوی تاریخ شمسی: 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class PollResponseBase(BaseModel):
    poll_question_id: int = Field(..., gt=0, description="شناسه سوال نظرسنجی")
    answer_value: str = Field(..., min_length=1, max_length=255, description="پاسخ، گزینه یا نمره انتخابی")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی پاسخ (اختیاری)")
    user_name: str = Field(..., min_length=2, max_length=100, description="نام کاربر پاسخ‌دهنده")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت (14xx/xx/xx)")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="ثبت‌کننده")


class PollResponseCreate(PollResponseBase):
    pass


class PollResponseUpdate(PollResponseBase):
    pass


class PollResponsePatch(BaseModel):
    poll_question_id: Optional[int] = Field(None, gt=0)
    answer_value: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    user_name: Optional[str] = Field(None, min_length=2, max_length=100)
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)


class PollResponseOut(PollResponseBase):
    id: int

    class Config:
        from_attributes = True
