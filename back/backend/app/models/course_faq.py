from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class CourseFAQ(Base):
    __tablename__ = "course_faqs"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    # ۲. متن پرسش
    question = Column(Text, nullable=False)

    # ۳. متن پاسخ
    answer = Column(Text, nullable=False)

    # ۴. تاریخ ثبت شمسی (فرمت 14xx/xx/xx)
    submission_date = Column(String(10), nullable=False)

    # ۵. شخص ثبت‌کننده
    created_by = Column(String(100), nullable=False)

    # ۶. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # رابطه با جدول دوره
    course = relationship("Course")
