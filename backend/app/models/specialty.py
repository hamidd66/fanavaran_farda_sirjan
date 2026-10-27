from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class Specialty(Base):
    __tablename__ = "specialties"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    created_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user_specialties = relationship("UserSpecialty", back_populates="specialty")
    user = relationship("User", back_populates="specialty", foreign_keys=[created_by])

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Specialty.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "specialties",
        ),
        viewonly=True,
    )