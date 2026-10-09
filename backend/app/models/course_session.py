from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.course import SessionType


class CourseSession(Base):
    __tablename__ = "course_sessions"
    __table_args__ = (UniqueConstraint('course_id', 'session_number', name='uq_course_session_number'),)

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    session_type = Column(Enum(SessionType), nullable=False)
    session_number = Column(Integer, nullable=False)
    estimated_duration = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    is_free_preview = Column(Boolean, nullable=False, default=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="course_sessions")
    staff = relationship("Staff", foreign_keys=[created_by], back_populates="course_sessions")
