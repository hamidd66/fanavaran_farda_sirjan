from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base import Base
from app.enums.attendance import StatusType

class Attendance(Base):
    __tablename__ = "attendances"
    __table_args__ = (UniqueConstraint('classroom_id', 'student_id', 'session_number', name='uq_attendance_session'),)
    
    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    session_number = Column(Integer, nullable=False)
    status = Column(Enum(StatusType), nullable=False)
    late_minutes = Column(Integer, nullable=False, default=0)
    description = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    classroom = relationship("Classroom", back_populates="attendances")
    student = relationship("Student", back_populates="attendances")
    staff = relationship("Staff", foreign_keys=[created_by], back_populates="attendances")