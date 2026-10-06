from sqlalchemy import Column, Integer, Text, Boolean, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی کلاس (کلید خارجی به جدول classrooms)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)

    # ۲. آیدی هنرجو (کلید خارجی به جدول students)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)

    # ۳. امتیاز امکانات (۱ تا ۵)
    facilities_rating = Column(Integer, nullable=False)

    # ۴. امتیاز برخورد و رفتار پرسنل/استاد (۱ تا ۵)
    behavior_rating = Column(Integer, nullable=False)

    # ۵. امتیاز کیفیت دوره و تدریس (۱ تا ۵)
    course_quality_rating = Column(Integer, nullable=False)

    # ۶. امتیاز مناسب بودن ساعت و زمان‌بندی (۱ تا ۵)
    timing_rating = Column(Integer, nullable=False)

    # ۷. توضیحات / متن نظر (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۸. وضعیت نمایش نظر در سایت (پیش‌فرض: False)
    is_published = Column(Boolean, default=False, nullable=False)

    # ۹. تاریخ ثبت شمسی (فرمت 14xx/xx/xx)
    submission_date = Column(String(10), nullable=False)

    # ۱۰. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط با جدول‌های مرتبط
    classroom = relationship("Classroom")
    student = relationship("Student")
