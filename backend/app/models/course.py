from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    category_id = Column(String, ForeignKey("course_categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False, index=True)
    prerequisites = Column(String(300), nullable=False)

    short_description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=False)

    has_certificate = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, nullable=False, default=True)
    is_deleted = Column(Boolean, nullable=False, default=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    category = relationship("CourseCategory", back_populates="courses")
    user = relationship("User", back_populates="course", foreign_keys=[created_by])

    # course_sessions = relationship("CourseSession", back_populates="course", cascade="all, delete-orphan")
    # contents = relationship("CourseContent", back_populates="course")
    # faqs = relationship("CourseFAQ", back_populates="course")
    # classrooms = relationship("Classroom", back_populates="course")
    # assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Course.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "courses",
        ),
        viewonly=True,
    )
