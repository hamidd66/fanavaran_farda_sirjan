from pydantic import BaseModel, Field
from typing import Optional

# فیلدهای مشترک
class CourseCategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="نام دسته‌بندی")
    image_url: Optional[str] = Field(None, max_length=500, description="آدرس اینترنتی یا مسیر تصویر")
    display_order: int = Field(default=0, ge=0, description="ترتیب نمایش (عدد صحیح نامنفی)")
    description: Optional[str] = Field(None, description="توضیح مختصر درباره دسته‌بندی")

# اسکیمای ایجاد رکورد جدید
class CourseCategoryCreate(CourseCategoryBase):
    pass

# اسکیمای ویرایش کامل (PUT)
class CourseCategoryUpdate(CourseCategoryBase):
    pass

# اسکیمای ویرایش جزئی (PATCH)
class CourseCategoryPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    image_url: Optional[str] = Field(None, max_length=500)
    display_order: Optional[int] = Field(None, ge=0)
    description: Optional[str] = None

# اسکیمای خروجی (Response)
class CourseCategoryResponse(CourseCategoryBase):
    id: int

    class Config:
        from_attributes = True
