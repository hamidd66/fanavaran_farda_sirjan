from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, List
from datetime import datetime

from app.schemas.file_attachment import FileAttachmentOut
from app.schemas.course_category import CourseCategoryOut
from app.schemas.user import UserOut


class CourseCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    category_id: str = Field(...)
    title: str = Field(..., min_length=3, max_length=200)
    prerequisites: str = Field(..., min_length=1, max_length=300)
    short_description: str = Field(..., min_length=10, max_length=500)
    long_description: str = Field(..., min_length=20)
    has_certificate: bool = Field(False)
    is_active: bool = Field(True)


class CourseUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    category_id: Optional[str] = None
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    prerequisites: Optional[str] = Field(None, min_length=1, max_length=300)
    short_description: Optional[str] = Field(None, min_length=10, max_length=500)
    long_description: Optional[str] = Field(None, min_length=20)
    has_certificate: Optional[bool] = None
    deleted_image_ids: Optional[list[str]] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            value = getattr(self, field)
            if value is None: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip(): raise ValueError(f"{field} cannot be an empty string")
        return self


class ToggleCourseActiveStatus(BaseModel):
    is_active: bool

class ToggleCourseDeleteStatus(BaseModel):
    is_deleted: bool


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_by: str
    title: str
    prerequisites: str
    short_description: str
    long_description: str
    has_certificate: bool
    is_active: bool
    is_deleted: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    terms_count: int = 0
    faqs_count: int = 0

    category: CourseCategoryOut
    user: Optional[UserOut] = None
    file_attachments: Optional[List[FileAttachmentOut]] = None

