from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class StudentAssignmentUpload(Base):
    __tablename__ = "student_assignment_uploads"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False) # فرض بر وجود جدول assignments
    course_title = Column(String(100), nullable=False)
    session_number = Column(Integer, nullable=False)
    student_id = Column(Integer, nullable=False) # فرض بر وجود جدول دانشجویان
    instructor_id = Column(Integer, nullable=False) # فرض بر وجود جدول اساتید
    file_path = Column(String(255), nullable=False) # ذخیره مسیر فایل
    assignment_title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    record_date = Column(String(10), nullable=False) # تاریخ شمسی
    recorded_by = Column(String(100), nullable=False)

    # رابطه با جدول تکالیف (در صورت نیاز)
    assignment = relationship("Assignment", backref="uploads")
