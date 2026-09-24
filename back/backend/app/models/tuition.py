from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.core.database import Base


class Tuition(Base):
    __tablename__ = "tuitions"

    id = Column(Integer, primary_key=True, index=True)

    # ۱) آیدی کلاس و هنرجو (کلیدهای خارجی)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student.id", ondelete="CASCADE"), nullable=False)

    # ۲) اطلاعات پرداخت
    payment_type = Column(String(50), nullable=False)          # نقدی، کارتخوان، کارت به کارت و ...
    amount = Column(Integer, nullable=False)                   # مبلغ
    account = Column(String(100), nullable=False)  # حسابی که شهریه به آن واریز شده
    discount_percent = Column(Float, default=0.0, nullable=False) # درصد تخفیف (0 تا 100)

    

    # ۳) زمان‌بندی واریز
    payment_date = Column(String(10), nullable=False)          # تاریخ واریز شمسی (مثال: 1403/08/25)
    payment_time = Column(String(5), nullable=False)           # زمان واریز (مثال: 14:30)

    # ۴) وضعیت تراکنش
    transaction_status = Column(String(50), nullable=False)    # موفق، ناموفق، در انتظار و ...

    # ۵) تاریخ و زمان ثبت در سیستم
    record_date = Column(String(10), nullable=False)           # تاریخ ثبت شمسی
    record_time = Column(String(5), nullable=False)            # زمان ثبت (HH:MM)

    # ۶) توضیحات و ثبت کننده
    description = Column(Text, nullable=True)                  # تنها فیلد اختیاری
    recorded_by = Column(String(120), nullable=False)          # ثبت کننده (الزامی)

    # ۷) زمان سیستمی جهت لاگ
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # روابط (Relationships)
    classroom = relationship("ClassRoom")
    student = relationship("Student")
