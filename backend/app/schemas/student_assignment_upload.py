from pydantic import BaseModel, Field
from typing import Optional

SHAMSI_DATE_REGEX = r"^1[34]\d{2}/(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])$"

class StudentAssignmentUploadBase(BaseModel):
    assignment_id: int = Field(..., gt=0, description="شناسه تکلیف")
    course_title: str = Field(..., min_length=2, max_length=100)
    session_number: int = Field(..., gt=0)
    student_id: int = Field(..., gt=0)
    instructor_id: int = Field(..., gt=0)
    file_path: str = Field(..., min_length=5, max_length=255, description="مسیر فایل")
    assignment_title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, description="توضیحات (اختیاری)")
    record_date: str = Field(..., pattern=SHAMSI_DATE_REGEX, description="تاریخ ثبت (140X/XX/XX)")
    recorded_by: str = Field(..., min_length=2, max_length=100)

class StudentAssignmentUploadCreate(StudentAssignmentUploadBase):
    pass

class StudentAssignmentUploadUpdate(StudentAssignmentUploadBase):
    pass

class StudentAssignmentUploadResponse(StudentAssignmentUploadBase):
    id: int

    class Config:
        from_attributes = True
