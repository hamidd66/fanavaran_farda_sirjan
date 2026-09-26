from pydantic import BaseModel, Field
from typing import Optional, Literal

# الگوی تاریخ شمسی: 14xx/xx/xx
DATE_REGEX = r"^14\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

# انواع مجاز نظرسنجی
PollTypeEnum = Literal["4 گزینه ای", "نمره از 5", "توضیحی"]


class PollQuestionBase(BaseModel):
    subject: str = Field(..., min_length=2, max_length=200, description="موضوع نظرسنجی")
    poll_type: PollTypeEnum = Field(..., description="نوع نظرسنجی: 4 گزینه ای، نمره از 5، توضیحی")
    question_text: str = Field(..., min_length=3, description="متن سوال نظرسنجی")
    option_1: Optional[str] = Field(None, max_length=255, description="گزینه اول")
    option_2: Optional[str] = Field(None, max_length=255, description="گزینه دوم")
    option_3: Optional[str] = Field(None, max_length=255, description="گزینه سوم")
    option_4: Optional[str] = Field(None, max_length=255, description="گزینه چهارم")
    score: Optional[int] = Field(None, ge=1, le=5, description="نمره (از 1 تا 5)")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی")
    is_published: bool = Field(default=True, description="وضعیت نمایش (پیش‌فرض True)")
    record_date: str = Field(..., pattern=DATE_REGEX, description="تاریخ ثبت (14xx/xx/xx)")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="ثبت‌کننده")


class PollQuestionCreate(PollQuestionBase):
    pass


class PollQuestionUpdate(PollQuestionBase):
    pass


class PollQuestionPatch(BaseModel):
    subject: Optional[str] = Field(None, min_length=2, max_length=200)
    poll_type: Optional[PollTypeEnum] = None
    question_text: Optional[str] = Field(None, min_length=3)
    option_1: Optional[str] = Field(None, max_length=255)
    option_2: Optional[str] = Field(None, max_length=255)
    option_3: Optional[str] = Field(None, max_length=255)
    option_4: Optional[str] = Field(None, max_length=255)
    score: Optional[int] = Field(None, ge=1, le=5)
    description: Optional[str] = None
    is_published: Optional[bool] = None
    record_date: Optional[str] = Field(None, pattern=DATE_REGEX)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)


class PollQuestionResponse(PollQuestionBase):
    id: int

    class Config:
        from_attributes = True
