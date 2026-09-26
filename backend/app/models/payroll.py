from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db.base import Base


class Payroll(Base):
    __tablename__ = "payrolls"

    id = Column(Integer, primary_key=True, index=True)

    # ۱) کلیدهای خارجی به کلاس و کادر/استاد
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    staff_id = Column(Integer, ForeignKey("staff.id", ondelete="CASCADE"), nullable=False)

    # ۲) محاسبات جلسات و مبالغ (به تومان)
    session_count = Column(Integer, nullable=False)        # تعداد جلسات
    session_rate = Column(Integer, nullable=False)         # مبلغ هر جلسه (تومان)
    total_amount = Column(Integer, nullable=False)         # مبلغ پرداختی کل (تومان)

    # ۳) مشخصات پرداخت و حساب
    account = Column(String(100), nullable=False)          # حسابی که پرداخت از آن انجام شده
    payment_date = Column(String(10), nullable=False)      # تاریخ پرداخت شمسی (مثال: 1403/09/01)
    payment_time = Column(String(5), nullable=False)       # ساعت پرداخت (مثال: 11:30)
    payment_method = Column(String(50), nullable=False)    # روش پرداخت (کارت به کارت، پایا، نقدی و...)
    settlement_status = Column(String(50), nullable=False) # وضعیت تسویه (تسویه کامل، علی‌الحساب و...)

    # ۴) ثبت در سیستم و توضیحات
    record_date = Column(String(10), nullable=False)       # تاریخ ثبت شمسی
    recorded_by = Column(String(120), nullable=False)      # ثبت کننده
    description = Column(Text, nullable=True)              # توضیحات (تنها فیلد اختیاری)

    # ۵) زمان سیستمی لاگ
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط (Relationships)
    classroom = relationship("ClassRoom")
    staff = relationship("Staff")
