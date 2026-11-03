from sqlalchemy import Column, Text, Boolean, DateTime, Integer, ForeignKey, Enum, CheckConstraint, UniqueConstraint, Index, func, text, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import AttendanceStatus


class ClassroomAttendance(Base):
    __tablename__ = "classroom_attendances"

    __table_args__ = (
        Index(None, "classroom_session_id"),

        CheckConstraint("late_minutes >= 0", name="classroom_attendances_late_nonneg"),
        CheckConstraint("left_early_minutes >= 0", name="classroom_attendances_left_early_nonneg"),
        CheckConstraint("status NOT IN ('absent', 'excused') OR (late_minutes = 0 AND left_early_minutes = 0)", name="attendance_absent_minutes_zero"),
        
        UniqueConstraint("enrollment_id", "classroom_session_id"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_session_id = Column(UUID(as_uuid=True), ForeignKey("classroom_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    status = Column(Enum(AttendanceStatus), nullable=False, default=AttendanceStatus.present)
    late_minutes = Column(Integer, nullable=False, server_default=text("0"))
    left_early_minutes = Column(Integer, nullable=False, server_default=text("0"))
    description = Column(Text, nullable=True)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    enrollment = relationship("Enrollment", back_populates="classroom_attendances")
    classroom_session = relationship("ClassroomSession", back_populates="classroom_attendances")
    user = relationship("User", foreign_keys=[created_by], back_populates="classroom_attendances")
