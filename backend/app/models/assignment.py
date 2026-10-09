from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.assignment import AssignmentType

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    session_number = Column(Integer, nullable=False)

    title = Column(String(200), nullable=False)
    assignment_type = Column(Enum(AssignmentType), nullable=False)

    file = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="assignments")
    staff = relationship("Staff", foreign_keys=[created_by], back_populates="assignments")
    assignment_submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")