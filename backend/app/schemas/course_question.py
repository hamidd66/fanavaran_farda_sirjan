from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.user import UserOut

class QuestionCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(..., min_length=1)
    parent_id: Optional[UUID] = Field(None)
    term_id: Optional[UUID] = Field(None)

class QuestionUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    message: str = Field(..., min_length=1)

class ToggleQuestionApproveStatus(BaseModel):
    is_approved: bool

class ToggleQuestionDeleteStatus(BaseModel):
    is_deleted: bool

class QuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    course_id: UUID
    sender_id: UUID
    parent_id: Optional[UUID] = None
    message: str
    is_approved: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    sender: Optional[UserOut] = None
    replies: Optional[List["QuestionOut"]] = None

QuestionOut.model_rebuild()
