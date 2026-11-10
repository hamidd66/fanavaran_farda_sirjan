from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, computed_field

from app.config.settings import settings
from app.enums.file import StorageProvider, StorageType

class FileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    uploaded_by: Optional[UUID] = None
    original_name: str
    stored_name: str
    extension: str
    mime_type: str
    file_size: int
    storage_type: StorageType
    storage_provider: StorageProvider
    bucket_name: Optional[str]
    storage_path: str
    checksum: str
    checksum_algorithm: str
    category: str
    description: Optional[str] = None
    is_public: bool
    is_active: bool
    deleted_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_at: datetime

    @computed_field
    @property
    def file_url(self) -> str:
        return f"{settings.media_url}/{self.storage_path}"


# class FileSummary(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: UUID
#     is_public: bool
#     storage_path: str = Field(exclude=True)

#     @computed_field
#     @property
#     def file_url(self) -> str:
#         return f"{settings.media_url}/{self.storage_path}"
