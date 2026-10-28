from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.file import FileOut


class FileAttachmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_id: UUID
    entity_id: UUID
    entity_type: str
    purpose: str
    display_order: int
    created_at: datetime

    file: FileOut