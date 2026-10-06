from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class TermGrade(Base):
    __tablename__ = "term_grades"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    grade_title = Column(String(50), nullable=False)  # "میانترم" یا "پایان ترم"
    grade = Column(Float, nullable=False)  # نمره
    is_finalized = Column(Boolean, default=False, nullable=False) # فیلد جدید
    description = Column(Text, nullable=True)  # اختیاری
    record_date = Column(String(10), nullable=False)  # تاریخ ثبت (10 کاراکتر)
    recorded_by = Column(String(100), nullable=False)  # ثبت کننده

    # روابط (Relationships)
    classroom = relationship("Classroom", backref="term_grades")
    student = relationship("Student", backref="term_grades")
