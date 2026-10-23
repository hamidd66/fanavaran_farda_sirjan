from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.file import FileOut


class FileAttachmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    file_id: str
    entity_id: str
    entity_type: str
    purpose: str
    display_order: int
    created_at: datetime

    file: FileOut