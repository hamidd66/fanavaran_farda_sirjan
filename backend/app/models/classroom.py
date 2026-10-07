from sqlalchemy import Column, String, Text, Integer, BigInteger, Date, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.mutable import MutableList
import uuid
from app.db.base import Base
from app.enums.classroom import HoldingType

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    course_id = Column(String, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False, index=True)
    teacher_id = Column(String, ForeignKey("staff.id", ondelete="RESTRICT"), nullable=False, index=True) # باید قبل از حذف استاد، استاد تغییر کند
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    holding_type = Column(Enum(HoldingType), nullable=False)
    class_link = Column(String(500), nullable=False)

    capacity = Column(Integer, nullable=False)
    tuition = Column(BigInteger, nullable=False)
    sessions_count = Column(Integer, nullable=False)
    duration_hours = Column(Integer, nullable=False)

    schedule = Column(MutableList.as_mutable(JSON), nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="classrooms")
    teacher = relationship("Staff", foreign_keys=[teacher_id], back_populates="teaching_classrooms")
    creator = relationship("Staff", foreign_keys=[created_by], back_populates="created_classrooms")
    enrollments = relationship("Enrollment", back_populates="classroom")
    classroom_sessions = relationship("ClassroomSession", back_populates="classroom", cascade="all, delete-orphan")