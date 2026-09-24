from pydantic import BaseModel, Field
from typing import Optional

SHAMSI_DATE_REGEX = r"^1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"
NATIONAL_ID_REGEX = r"^\d{10}$"


class CompetitionResultBase(BaseModel):
    competition_id: int = Field(..., gt=0, description="شناسه مسابقه")
    student_name: str = Field(..., min_length=3, max_length=100, description="نام و نام خانوادگی هنرجو")
    national_id: str = Field(..., pattern=NATIONAL_ID_REGEX, description="کد ملی 10 رقمی")
    score: float = Field(..., ge=0, description="نمره (مثبت)")
    rank: int = Field(..., gt=0, description="رتبه (عدد مثبت)")
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    judging_duration: str = Field(..., min_length=2, max_length=50, description="مدت زمان داوری")
    record_date: str = Field(..., pattern=SHAMSI_DATE_REGEX, description="تاریخ ثبت (140X/XX/XX)")
    recorded_by: str = Field(..., min_length=2, max_length=100, description="ثبت کننده")


class CompetitionResultCreate(CompetitionResultBase):
    pass


class CompetitionResultUpdate(CompetitionResultBase):
    pass


class CompetitionResultPatch(BaseModel):
    competition_id: Optional[int] = Field(None, gt=0)
    student_name: Optional[str] = Field(None, min_length=3, max_length=100)
    national_id: Optional[str] = Field(None, pattern=NATIONAL_ID_REGEX)
    score: Optional[float] = Field(None, ge=0)
    rank: Optional[int] = Field(None, gt=0)
    description: Optional[str] = None
    judging_duration: Optional[str] = Field(None, min_length=2, max_length=50)
    record_date: Optional[str] = Field(None, pattern=SHAMSI_DATE_REGEX)
    recorded_by: Optional[str] = Field(None, min_length=2, max_length=100)


class CompetitionResultResponse(BaseModel):
    id: int
    competition_id: int
    student_name: str
    national_id: str
    score: float
    rank: int
    description: Optional[str]
    judging_duration: str
    record_date: str
    recorded_by: str

    class Config:
        from_attributes = True
