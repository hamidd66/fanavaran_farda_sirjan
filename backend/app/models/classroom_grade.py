from sqlalchemy import Column, Text, Boolean, DateTime, Integer, ForeignKey, CheckConstraint, UniqueConstraint, Index, func, text, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class ClassroomGrade(Base):
    __tablename__ = "classroom_grades"

    __table_args__ = (
        CheckConstraint("grade >= 0 AND grade <= 100", name="grade_nonneg"),
        UniqueConstraint("enrollment_id", "classroom_session_id"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_session_id = Column(UUID(as_uuid=True), ForeignKey("classroom_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    grade = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    is_finalized = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    enrollment = relationship("Enrollment", back_populates="classroom_grades")
    classroom_session = relationship("ClassroomSession", back_populates="classroom_grades")
    user = relationship("User", foreign_keys=[created_by], back_populates="classroom_grades")
