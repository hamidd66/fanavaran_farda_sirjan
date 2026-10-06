from sqlalchemy import Column, Enum, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base import Base
from app.enums.enrollment import RegistrationMethod

class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint('student_id', 'classroom_id', name='uq_student_Classroom'),)

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="RESTRICT"), nullable=False, index=True)

    registration_method = Column(Enum(RegistrationMethod), nullable=False)
    description = Column(Text, nullable=True)

    registered_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    student = relationship("Student", back_populates="enrollments")
    classroom = relationship("Classroom", back_populates="enrollments")