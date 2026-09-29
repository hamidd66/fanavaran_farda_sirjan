from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class SessionGrade(Base):
    __tablename__ = "session_grades"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    session_number = Column(Integer, nullable=False)
    grade = Column(Float, nullable=False)  # نمره بین 1 تا 20
    description = Column(Text, nullable=True)  # اختیاری
    record_date = Column(String(10), nullable=False)
    recorded_by = Column(String(100), nullable=False)

    # روابط
    classroom = relationship("ClassRoom", backref="session_grades")
    student = relationship("Student", backref="session_grades")
