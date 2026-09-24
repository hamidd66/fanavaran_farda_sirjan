from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    # ۲. شماره جلسه (۱، ۲، ۳ و ...)
    session_number = Column(Integer, nullable=False)

    # ۳. نوع تکلیف (تمرین کلاسی، تکلیف منزل، مینی پروژه، پروژه نهایی و ...)
    assignment_type = Column(String(50), nullable=False)

    # ۴. عنوان تکلیف
    title = Column(String(200), nullable=False)

    # ۵. نوع فایل مجاز یا نوع فایل پیوست (مانند: zip, pdf, py, docx و ...)
    file_type = Column(String(50), nullable=False)

    # ۶. فایل یا لینک پیوست تکلیف (مسیر فایل صورت تمرین یا تمپلیت)
    attachment_file = Column(String(500), nullable=False)

    # ۷. توضیحات (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۸. تاریخ ثبت شمسی (مثلاً: 1403/07/20)
    submission_date = Column(String(10), nullable=False)

    # ۹. شخص ثبت‌کننده (مدرس یا ادمین ثبت‌کننده)
    created_by = Column(String(100), nullable=False)

    # ۱۰. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # رابطه با دوره
    course = relationship("Course")
