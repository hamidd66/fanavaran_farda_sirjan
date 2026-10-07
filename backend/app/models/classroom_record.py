from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Enum, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.classroom import AttendanceStatus


class ClassroomRecord(Base):
    __tablename__ = "classroom_records"
    __table_args__ = (UniqueConstraint('student_id', 'classroom_session_id', name='uq_attendance_session'),)

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)
    classroom_session_id = Column(String, ForeignKey("classroom_sessions.id", ondelete="CASCADE"), nullable=False, index=True)

    attendance_status = Column(Enum(AttendanceStatus), nullable=True)
    attendance_description = Column(Text, nullable=True)
    late_minutes = Column(Integer, nullable=False, default=0)

    grade = Column(Integer, nullable=True)
    grade_description = Column(Text, nullable=True)

    is_finalized = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    student = relationship("Student", back_populates="classroom_records")
    staff = relationship("Staff", foreign_keys=[created_by], back_populates="classroom_records")
    classroom_session = relationship("ClassroomSession", back_populates="classroom_records")