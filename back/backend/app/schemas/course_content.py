from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

from app.schemas.course import CourseResponse


class CourseContentBase(BaseModel):
    course_id: int = Field(..., gt=0, description="شناسه دوره مربوطه")
    session_number: int = Field(..., gt=0, description="شماره جلسه (باید مثبت باشد)")
    content_type: str = Field(..., min_length=2, max_length=50, description="نوع محتوا (ویدئو، جزوه، سورس کد و...)")
    title: str = Field(..., min_length=2, max_length=200, description="عنوان محتوا")
    file_path: str = Field(..., min_length=2, max_length=500, description="مسیر یا لینک فایل محتوا")
    description: Optional[str] = Field(None, description="توضیحات تکمیلی محتوا (اختیاری)")
    created_by: str = Field(..., min_length=2, max_length=100, description="نام یا کدملی ثبت‌کننده")


# اسکیمای ساخت محتوای جدید
class CourseContentCreate(CourseContentBase):
    pass


# اسکیمای ویرایش کامل (PUT)
class CourseContentUpdate(CourseContentBase):
    pass


# اسکیمای ویرایش جزئی (PATCH)
class CourseContentPatch(BaseModel):
    course_id: Optional[int] = Field(None, gt=0)
    session_number: Optional[int] = Field(None, gt=0)
    content_type: Optional[str] = Field(None, min_length=2, max_length=50)
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    file_path: Optional[str] = Field(None, min_length=2, max_length=500)
    description: Optional[str] = None
    created_by: Optional[str] = Field(None, min_length=2, max_length=100)


# اسکیمای نمایش خروجی
class CourseContentResponse(CourseContentBase):
    id: int
    created_at: datetime
    course: Optional[CourseResponse] = None

    class Config:
        from_attributes = True
