from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone

from app.db.base import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)

    # ۱) مشخصات هزینه
    category = Column(String(100), nullable=False)       # دسته‌بندی (مثال: اجاره، قبوض، تبلیغات، تجهیزات، پذیرایی و...)
    title = Column(String(200), nullable=False)          # عنوان هزینه (مثال: خرید ماژیک و تخته‌پاک‌کن)
    amount = Column(Integer, nullable=False)             # مبلغ به تومان (الزامی و بزرگتر از صفر)

    # ۲) مشخصات پرداخت
    expense_date = Column(String(10), nullable=False)    # تاریخ وقوع هزینه شمسی (مثال: 1403/09/01)
    payment_method = Column(String(50), nullable=False)  # روش پرداخت (کارت به کارت، نقدی، پایا، چک و...)
    account = Column(String(100), nullable=False)        # حساب یا صندوق پرداختی (مثال: حساب بانک ملی، صندوق نقدی)

    # ۳) ثبت و توضیحات
    description = Column(Text, nullable=True)            # توضیحات (تنها فیلد اختیاری)
    record_date = Column(String(10), nullable=False)     # تاریخ ثبت شمسی (مثال: 1403/09/01)
    recorded_by = Column(String(120), nullable=False)    # نام ثبت‌کننده

    # ۴) زمان سیستمی لاگ
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
