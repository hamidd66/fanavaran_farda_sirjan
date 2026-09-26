from sqlalchemy import Column, Integer, String, Text, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class ClassRoom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)

    # ۱. عنوان کلاس
    title = Column(String(200), nullable=False, index=True)

    # ۲. آیدی دوره (کلید خارجی به جدول courses)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)

    # ۳. آیدی دبیر (کلید خارجی به جدول staffs)
    teacher_id = Column(Integer, ForeignKey("staff.id", ondelete="RESTRICT"), nullable=False)

    # ۴. نوع برگزاری (حضوری، آنلاین، آفلاین)
    holding_type = Column(String(50), nullable=False)

    # ۵. لینک کلاس (برای آنلاین/آفلاین یا لینک گروه کلاسی)
    class_link = Column(String(500), nullable=False)

    # ۶. توضیحات (تنها فیلد اختیاری)
    description = Column(Text, nullable=True)

    # ۷. تاریخ شروع کلاس (شمسی مثل 1403/07/01)
    start_date = Column(String(10), nullable=False)

    # ۸. تاریخ پایان کلاس (شمسی مثل 1403/09/30)
    end_date = Column(String(10), nullable=False)

    # ۹. روزهای برگزاری (مثلاً: شنبه - دوشنبه - چهارشنبه)
    holding_days = Column(String(200), nullable=False)

    # ۱۰. ساعت شروع (فرمت HH:MM مثلاً 17:30)
    start_time = Column(String(5), nullable=False)

    # ۱۱. ساعت پایان (فرمت HH:MM مثلاً 19:30)
    end_time = Column(String(5), nullable=False)

    # ۱۲. ظرفیت کلاس (عددی)
    capacity = Column(Integer, nullable=False)

    # ۱۳. شهریه کلاس به تومان (عددی بزرگ)
    tuition = Column(BigInteger, nullable=False)

    # ۱۴. تعداد جلسات (عددی)
    sessions_count = Column(Integer, nullable=False)

    # ۱۵. مدت زمان کلاس (بر اساس ساعت - مثلاً ۲ ساعت در هر جلسه یا کل دوره)
    duration_hours = Column(Integer, nullable=False)

    # ۱۶. ثبت‌کننده (نام یا کد ملی کاربر ایجادکننده)
    created_by = Column(String(100), nullable=False)

    # ۱۷. تاریخ ایجاد کلاس (خودکار)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط جهت دریافت اطلاعات دوره و دبیر در خروجی
    course = relationship("Course")
    teacher = relationship("Staff")
