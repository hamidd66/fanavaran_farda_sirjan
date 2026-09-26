from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class AssignmentFeedback(Base):
    __tablename__ = "assignment_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    
    # کلیدهای خارجی
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False) # فرض: جدول کلاس‌ها
    student_id = Column(Integer, ForeignKey("student.id"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False) # فرض: جدول کادر/استاد
    
    # اطلاعات تکلیف و بازخورد
    session_number = Column(Integer, nullable=False)
    assignment_title = Column(String(150), nullable=False)
    instructor_feedback = Column(Text, nullable=False)
    grade = Column(Float, nullable=False)
    delivery_status = Column(String(50), nullable=False)
    
    # فیلد اختیاری
    description = Column(Text, nullable=True)
    
    # تاریخ شمسی و ثبت کننده
    record_date = Column(String(10), nullable=False) # فرمت 140X/XX/XX
    recorded_by = Column(String(100), nullable=False)

    # روابط (اختیاری برای دسترسی آسان)
    assignment = relationship("Assignment", backref="feedbacks")
    student = relationship("Student", backref="assignment_feedbacks")
