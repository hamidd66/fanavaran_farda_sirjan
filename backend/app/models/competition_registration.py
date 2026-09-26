from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class CompetitionRegistration(Base):
    __tablename__ = "competition_registrations"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"), nullable=False)  # کلید خارجی به مسابقه
    full_name = Column(String(100), nullable=False)  # نام و نام خانوادگی
    phone_number = Column(String(11), nullable=False)  # شماره همراه
    national_id = Column(String(10), nullable=False)  # کد ملی
    skill = Column(String(150), nullable=False)  # مهارت
    email = Column(String(100), nullable=True)  # ایمیل (اختیاری)
    motivation = Column(Text, nullable=False)  # انگیزه شرکت در مسابقه
    recorded_by = Column(String(100), nullable=False)  # ثبت کننده
    record_date = Column(String(10), nullable=False)  # تاریخ ثبت شمسی (140X/XX/XX)

    # رابطه با جدول مسابقات
    competition = relationship("Competition", backref="registrations")
