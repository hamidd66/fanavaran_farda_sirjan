from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)

    # ۱) آیدی کلاس
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)

    # ۲) آیدی هنرجو
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)

    # ۳) شماره جلسه
    session_number = Column(Integer, nullable=False)

    # ۴) وضعیت حضور و غیاب: present / absent / late
    status = Column(String(10), nullable=False)

    # ۵) مدت تاخیر (دقیقه)
    late_minutes = Column(Integer, nullable=False)

    # ۶) تاریخ ثبت شمسی (مثال: 1403/08/22)
    record_date = Column(String(10), nullable=False)

    # ۷) علت غیبت
    absence_reason = Column(String(255), nullable=False)

    # ۸) علت تاخیر
    late_reason = Column(String(255), nullable=False)

    # ۹) توضیحات (اختیاری)
    description = Column(Text, nullable=True)

    # ۱۰) ثبت کننده
    recorded_by = Column(String(120), nullable=False)

    # ۱۱) زمان سیستمی
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط
    classroom = relationship("ClassRoom")
    student = relationship("Student")
