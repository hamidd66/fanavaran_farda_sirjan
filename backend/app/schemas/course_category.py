from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from typing import List


class CourseCategoryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=2, max_length=100)
    image: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/categories/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    description: Optional[str] = Field(None)


class CourseCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    image: Optional[str] = None
    description: Optional[str] = None
    display_order: int
    created_at: datetime


class CourseCategoryUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(None, min_length=2, max_length=100)
    image: Optional[str] = Field(None, max_length=500, pattern=r"^/media/uploads/categories/[A-Za-z0-9_\-./]+\.(jpg|jpeg|png|webp)$")
    description: Optional[str] = Field(None, max_length=2000)


class CourseCategoryOrderItem(BaseModel):
    id: str = Field(...)
    display_order: int = Field(..., ge=0)


class CourseCategoryOrderItemUpdate(BaseModel):
    items: List[CourseCategoryOrderItem] = Field(..., min_length=1)





# --------------------------------------------

# فیلدهای مشترک
class CourseCategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="نام دسته‌بندی")
    image_url: Optional[str] = Field(None, max_length=500, description="آدرس اینترنتی یا مسیر تصویر")
    display_order: int = Field(default=0, ge=0, description="ترتیب نمایش (عدد صحیح نامنفی)")
    description: Optional[str] = Field(None, description="توضیح مختصر درباره دسته‌بندی")

# # اسکیمای ایجاد رکورد جدید
# class CourseCategoryCreate(CourseCategoryBase):
#     pass

# # اسکیمای ویرایش کامل (PUT)
# class CourseCategoryUpdate(CourseCategoryBase):
#     pass

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
