from app.schemas.course_category import CourseCategoryResponse
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime


class OutlineItem(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    subheading: Optional[str] = Field(None, max_length=300)


class CourseCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    category_id: str = Field(...)

    title: str = Field(..., min_length=3, max_length=200)
    prerequisites: str = Field(..., min_length=1, max_length=300)

    short_description: str = Field(..., min_length=10, max_length=500)
    long_description: str = Field(..., min_length=20)

    tuition: int = Field(..., ge=0)
    has_certificate: bool = Field(False)

    sessions_count: int = Field(..., ge=1)
    total_hours: int = Field(..., ge=1)

    image: str = Field(..., max_length=500, pattern=r"^/media/uploads/courses/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    outline: List[OutlineItem] = Field(..., min_length=1)


class CourseUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    category_id: Optional[str] = None

    title: Optional[str] = Field(None, min_length=3, max_length=200)
    prerequisites: Optional[str] = Field(None, min_length=1, max_length=300)

    short_description: Optional[str] = Field(None, min_length=10, max_length=500)
    long_description: Optional[str] = Field(None, min_length=20)
    
    tuition: Optional[int] = Field(None, ge=0)
    has_certificate: Optional[bool] = None

    sessions_count: Optional[int] = Field(None, ge=1)
    total_hours: Optional[int] = Field(None, ge=1)

    image: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/courses/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    outline: Optional[List[OutlineItem]] = Field(None, min_length=1)


class CategoryBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str


class StaffBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    full_name: str
    job_title: Optional[str] = None


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    prerequisites: str
    short_description: str
    long_description: str
    tuition: int
    has_certificate: bool
    sessions_count: int
    total_hours: int
    image: str
    outline: list
    created_at: datetime

    category: Optional[CategoryBrief] = None
    staff: Optional[StaffBrief] = None
    contents_count: int = 0
    faqs_count: int = 0











# ----------------------------------

# فیلدهای پایه و اجباری
class CourseBase(BaseModel):
    category_id: int = Field(..., description="شناسه دسته‌بندی دوره")
    title: str = Field(..., min_length=2, max_length=200, description="عنوان دوره")
    prerequisites: str = Field(..., min_length=2, max_length=300, description="پیش‌نیازهای دوره")
    short_description: str = Field(..., min_length=5, max_length=500, description="توضیح کوتاه")
    long_description: str = Field(..., min_length=10, description="توضیح بلند")
    tuition: int = Field(..., ge=0, description="شهریه به تومان (عدد نامنفی)")
    sessions_count: int = Field(..., gt=0, description="تعداد جلسات (حداقل ۱ جلسه)")
    total_hours: int = Field(..., gt=0, description="مجموع ساعت دوره (حداقل ۱ ساعت)")
    image_url: str = Field(..., min_length=3, max_length=500, description="آدرس تصویر دوره")
    has_learning_content: bool = Field(..., description="محتوای آموزشی دارد / ندارد")
    has_certificate: bool = Field(..., description="گواهینامه دارد / ندارد")
    full_description: str = Field(..., min_length=10, description="توضیح کامل دوره")


# # اسکیمای ایجاد دوره جدید
# class CourseCreate(CourseBase):
#     pass


# # اسکیمای ویرایش کامل دوره (PUT)
# class CourseUpdate(CourseBase):
#     pass


# اسکیمای ویرایش جزئی دوره (PATCH)
class CoursePatch(BaseModel):
    category_id: Optional[int] = None
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    prerequisites: Optional[str] = Field(None, min_length=2, max_length=300)
    short_description: Optional[str] = Field(None, min_length=5, max_length=500)
    long_description: Optional[str] = Field(None, min_length=10)
    tuition: Optional[int] = Field(None, ge=0)
    sessions_count: Optional[int] = Field(None, gt=0)
    total_hours: Optional[int] = Field(None, gt=0)
    image_url: Optional[str] = Field(None, min_length=3, max_length=500)
    has_learning_content: Optional[bool] = None
    has_certificate: Optional[bool] = None
    full_description: Optional[str] = Field(None, min_length=10)


# اسکیمای خروجی (Response) همراه با جزئیات دسته‌بندی
class CourseResponse(CourseBase):
    id: int
    created_at: datetime
    category: Optional[CourseCategoryResponse] = None

    class Config:
        from_attributes = True
