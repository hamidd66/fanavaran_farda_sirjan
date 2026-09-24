from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class CompetitionResult(Base):
    __tablename__ = "competition_results"

    id = Column(Integer, primary_key=True, index=True)
    competition_id = Column(Integer, ForeignKey("competitions.id"), nullable=False)
    student_name = Column(String(100), nullable=False)  # نام هنرجو
    national_id = Column(String(10), nullable=False)  # کد ملی
    score = Column(Float, nullable=False)  # نمره
    rank = Column(Integer, nullable=False)  # رتبه
    description = Column(Text, nullable=True)  # توضیحات (اختیاری)
    judging_duration = Column(String(50), nullable=False)  # مدت زمان داوری
    record_date = Column(String(10), nullable=False)  # تاریخ ثبت
    recorded_by = Column(String(100), nullable=False)  # ثبت کننده

    # رابطه با جدول مسابقات
    competition = relationship("Competition", backref="results")
