from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, List
from datetime import datetime

from app.schemas.file_attachment import FileAttachmentOut

NULLABLE_FIELDS = {
    "description"
}

class CourseCategoryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=2000)
    is_active: bool = Field(True)


class CourseCategoryUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: Optional[str] = Field(None, min_length=2, max_length=100)
    slug: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = Field(None, max_length=2000)
    display_order: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = Field(None)

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            value = getattr(self, field)
            if value is None and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip() and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be an empty string")
        return self


class CategoryStatusItem(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    category_id: str
    is_active: bool

class BatchCategoriesStatus(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    items: List[CategoryStatusItem]


class CourseCategoryOrderItem(BaseModel):
    id: str = Field(...)
    display_order: int = Field(..., ge=0)


class CourseCategoryOrderItemUpdate(BaseModel):
    items: List[CourseCategoryOrderItem] = Field(..., min_length=1)


class CourseCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_by: Optional[str] = None
    name: str
    slug: str
    description: Optional[str] = None
    display_order: int
    is_active: bool
    updated_at: Optional[datetime] = None
    created_at: datetime

    courses_count: Optional[int] = 0
    file_attachments: Optional[List[FileAttachmentOut]] = None
