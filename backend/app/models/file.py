from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class File(Base):
    __tablename__ = "files"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)

    file_path = Column(String(500), nullable=False)
    extension = Column(String(20), nullable=False)
    size_bytes = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    attachments = relationship("FileAttachment", back_populates="file", cascade="all, delete-orphan")
