from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

from app.enums.term import SessionType
from app.schemas.user import UserOut

NULLABLE_FIELDS = {
    "description"
}

class TermSessionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_type: SessionType
    estimated_duration: int = Field(0, ge=0)
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = Field(None)
    is_free_preview: Optional[bool] = Field(False)
    is_active: Optional[bool] = Field(True)


class TermSessionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    session_type: Optional[SessionType] = Field(None)
    estimated_duration: Optional[int] = Field(None, ge=0)
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None)
    is_free_preview: Optional[bool] = Field(None)
    is_active: Optional[bool] = Field(None)
    
    @model_validator(mode="after")
    def validate_update_data(self):
        for field in self.model_fields_set:
            value = getattr(self, field)
            if value is None and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be null")
            if isinstance(value, str) and not value.strip() and field not in NULLABLE_FIELDS: raise ValueError(f"{field} cannot be an empty string")
        return self

class ToggleTermSessionActiveStatus(BaseModel):
    is_active: bool

class ToggleTermSessionDeleteStatus(BaseModel):
    is_deleted: bool

class TermSessionOrderItem(BaseModel):
    id: UUID = Field(...)
    session_number: int = Field(...)

class TermSessionOrderItemUpdate(BaseModel):
    items: List[TermSessionOrderItem] = Field(..., min_length=1)

class TermSessionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    term_id: UUID
    created_by: Optional[UUID] = None
    session_type: SessionType
    session_number: int
    estimated_duration: int
    title: str
    description: Optional[str] = None
    is_free_preview: bool
    is_active: bool
    deleted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    contents_count: int = 0
    user: Optional[UserOut] = None