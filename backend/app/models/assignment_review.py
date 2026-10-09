from sqlalchemy import Column, Float, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.assignment import ReviewStatus

# enum ها رو به ai نشون بده

class AssignmentReview(Base):
    __tablename__ = "assignment_reviews"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    submission_id = Column(String, ForeignKey("assignment_submissions.id", ondelete="CASCADE"), nullable=False, index=True)
    staff_id = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    status = Column(Enum(ReviewStatus), nullable=False)
    grade = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    file = Column(String(500), nullable=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    assignment_submissions = relationship("AssignmentSubmission", back_populates="reviews")
    staff = relationship("Staff", foreign_keys=[staff_id], back_populates="assignment_reviews")