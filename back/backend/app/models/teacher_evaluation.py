from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class TeacherEvaluation(Base):
    __tablename__ = "teacher_evaluations"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی کلاس (کلید خارجی به classrooms)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)

    # ۲. آیدی استاد/پرسنل (کلید خارجی به staff)
    teacher_id = Column(Integer, ForeignKey("staff.id", ondelete="CASCADE"), nullable=False)

    # ۳. آیدی هنرجو (کلید خارجی به students)
    student_id = Column(Integer, ForeignKey("student.id", ondelete="CASCADE"), nullable=False)

    # ۴. امتیاز تسلط استاد بر سرفصل‌ها (۱ تا ۵)
    mastery_rating = Column(Integer, nullable=False)

    # ۵. امتیاز پشتیبانی و پاسخگویی به سوالات (۱ تا ۵)
    support_rating = Column(Integer, nullable=False)

    # ۶. امتیاز کاربردی و پروژه‌محور بودن تدریس (۱ تا ۵)
    practical_rating = Column(Integer, nullable=False)

    # ۷. امتیاز نظم و آنتایم بودن در جلسات (۱ تا ۵)
    discipline_rating = Column(Integer, nullable=False)

    # ۸. توضیحات / متن بازخورد هنرجو (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۹. تاریخ ثبت شمسی (فرمت 14xx/xx/xx)
    submission_date = Column(String(10), nullable=False)

    # ۱۰. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط دیتابیسی
    classroom = relationship("ClassRoom")
    teacher = relationship("Staff")
    student = relationship("Student")
