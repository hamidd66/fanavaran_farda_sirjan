from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class CourseContent(Base):
    __tablename__ = "course_contents"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    # ۲. شماره جلسه (مثلاً ۱، ۲، ۳ ...)
    session_number = Column(Integer, nullable=False)

    # ۳. نوع محتوا (مثلاً: ویدئو، جزوه، سورس کد، تمرین، آزمون)
    content_type = Column(String(50), nullable=False)

    # ۴. عنوان محتوا
    title = Column(String(200), nullable=False)

    # ۵. فایل/لینک محتوا (مسیر فایل یا URL دانلود)
    file_path = Column(String(500), nullable=False)

    # ۶. توضیحات (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۷. شخص ثبت‌کننده (کاربری که فایل/محتوا را آپلود کرده)
    created_by = Column(String(100), nullable=False)

    # ۸. تاریخ و زمان ثبت رکورد (خودکار)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # رابطه با جدول دوره
    course = relationship("Course")
