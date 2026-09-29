from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. آیدی هنرجو (کلید خارجی به جدول students)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="RESTRICT"), nullable=False)

    # ۲. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)

    # ۳. آیدی کلاس (کلید خارجی به جدول classrooms)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="RESTRICT"), nullable=False)

    # ۴. آیدی کادر / مشاور (کلید خارجی به جدول staff)
    staff_id = Column(Integer, ForeignKey("staff.id", ondelete="RESTRICT"), nullable=False)

    # ۵. تاریخ ثبت‌نام (شمسی با فرمت 1403/xx/xx)
    registration_date = Column(String(10), nullable=False)

    # ۶. زمان/ساعت ثبت‌نام (فرمت HH:MM مثل 10:30)
    registration_time = Column(String(5), nullable=False)

    # ۷. طریقه ثبت‌نام (مثلاً: حضوری، آنلاین، تلفنی)
    registration_method = Column(String(50), nullable=False)

    # ۸. طریقه آشنایی (مثلاً: اینستاگرام، سایت، دوستان، بنر شهری، تراکت)
    referral_source = Column(String(100), nullable=False)

    # ۹. توضیحات (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۱۰. شخص ثبت‌کننده (کاربری که این رکورد را درج کرده)
    created_by = Column(String(100), nullable=False)

    # ۱۱. زمان سیستمی ثبت رکورد
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط برای آوردن اطلاعات کامل در گزارش‌ها و خروجی API
    student = relationship("Student")
    course = relationship("Course")
    classroom = relationship("ClassRoom")
    staff = relationship("Staff")
