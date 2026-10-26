from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class CourseCategory(Base):
    __tablename__ = "course_categories"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    created_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    courses = relationship("Course", back_populates="category")
    user = relationship("User", back_populates="course_category", foreign_keys=[created_by])

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            CourseCategory.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "course_categories",
        ),
        viewonly=True,
    )
