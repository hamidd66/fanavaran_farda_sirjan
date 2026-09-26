from pydantic import BaseModel, Field
from typing import Optional

# الگوی اعتبارسنجی تاریخ شمسی (مثال: 1403/05/20)
SHAMSI_DATE_REGEX = r"^1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"


class CompetitionBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=150, description="عنوان مسابقه")
    specialty: str = Field(..., min_length=2, max_length=100, description="تخصص مسابقه")
    event_date: str = Field(
        ...,
        pattern=SHAMSI_DATE_REGEX,
        description="تاریخ برگزاری به صورت شمسی (مثال: 1403/06/15)"
    )
    location: str = Field(..., min_length=2, max_length=200, description="محل برگزاری")
    awards: str = Field(..., min_length=2, max_length=255, description="جوایز مسابقه")
    description: Optional[str] = Field(None, description="توضیحات اختیاری")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="ثبت کننده")
    record_date: str = Field(
        ...,
        pattern=SHAMSI_DATE_REGEX,
        description="تاریخ ثبت به صورت شمسی (مثال: 1403/06/01)"
    )


class CompetitionCreate(CompetitionBase):
    pass


class CompetitionUpdate(CompetitionBase):
    pass


class CompetitionPatch(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=150)
    specialty: Optional[str] = Field(None, min_length=2, max_length=100)
    event_date: Optional[str] = Field(None, pattern=SHAMSI_DATE_REGEX)
    location: Optional[str] = Field(None, min_length=2, max_length=200)
    awards: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = None
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)
    record_date: Optional[str] = Field(None, pattern=SHAMSI_DATE_REGEX)


class CompetitionResponse(BaseModel):
    id: int
    title: str
    specialty: str
    event_date: str
    location: str
    awards: str
    description: Optional[str]
    recorded_by: str
    record_date: str

    class Config:
        from_attributes = True
