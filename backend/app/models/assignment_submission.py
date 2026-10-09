from sqlalchemy import Column, Integer, String, Text, ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.assignment import SubmissionStatus


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"
    __table_args__ = (UniqueConstraint('assignment_id', 'student_id', 'attempt_number', name='uq_submission_attempt'),)

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    assignment_id = Column(String, ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_session_id = Column(String, ForeignKey("classroom_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(String(20), nullable=False, default=SubmissionStatus.pending_review.value)
    attempt_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    file = Column(String(500), nullable=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    assignment = relationship("Assignment", back_populates="assignment_submissions")
    classroom_session = relationship("ClassroomSession", back_populates="assignment_submissions")
    student = relationship("Student", back_populates="assignment_submissions")
    assignment_reviews = relationship("AssignmentReview", back_populates="assignment_submissions", cascade="all, delete-orphan")