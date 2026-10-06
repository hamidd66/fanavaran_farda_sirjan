from sqlalchemy import Column, Enum, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.base import Base
from app.enums.user import ReferralSources

class Staff(Base):
    __tablename__ = "staff"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    full_name = Column(String(100), nullable=False, index=True)
    father_name = Column(String(50), nullable=False)

    phone = Column(String(11), unique=True, index=True, nullable=False)
    email = Column(String(100), nullable=False, unique=True)

    education = Column(String(50), nullable=False)
    job_title = Column(String(120), nullable=False)
    specialties = Column(String(255), nullable=False)

    card_number = Column(String(16), unique=True, index=True, nullable=False)
    sheba_number = Column(String(24), unique=True, index=True, nullable=False)

    birth_date = Column(String(10), nullable=False)
    address = Column(Text, nullable=False)

    description = Column(Text, nullable=True)
    avatar = Column(String(255), nullable=True)

    referral_source = Column(Enum(ReferralSources), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="staff")
    
    courses = relationship("Course", back_populates="staff")
    courses_contents = relationship("CourseContent", back_populates="staff")

    teaching_classrooms = relationship("Classroom", foreign_keys="Classroom.teacher_id", back_populates="teacher")
    created_classrooms = relationship("Classroom", foreign_keys="Classroom.created_by", back_populates="creator")
    attendances = relationship("Attendance", foreign_keys="Attendance.created_by", back_populates="staff")
