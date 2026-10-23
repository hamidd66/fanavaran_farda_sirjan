from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class FileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    uploaded_by: str
    file_path: str
    extension: str
    size_bytes: int
    created_at: datetime