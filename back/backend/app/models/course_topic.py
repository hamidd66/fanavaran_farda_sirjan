from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class CourseTopic(Base):
    __tablename__ = "course_topics"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    # ۲. عنوان سرفصل
    title = Column(String(200), nullable=False)

    # ۳. توضیح مختصر
    description = Column(Text, nullable=False)

    # ۴. زیر فصل‌ها (می‌تواند متنی یا ساختاریافته مثل لیست نگهداری شود)
    subtopics = Column(Text, nullable=False)

    # ۵. تاریخ ثبت شمسی (فرمت 14xx/xx/xx)
    submission_date = Column(String(10), nullable=False)

    # ۶. شخص ثبت‌کننده
    created_by = Column(String(100), nullable=False)

    # ۷. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # رابطه با جدول دوره
    course = relationship("Course")
