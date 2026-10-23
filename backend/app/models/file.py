from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class File(Base):
    __tablename__ = "files"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

    uploaded_by = Column(String, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)

    file_path = Column(String(500), nullable=False)
    extension = Column(String(20), nullable=False)
    size_bytes = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attachments = relationship("FileAttachment", back_populates="file", cascade="all, delete-orphan")
