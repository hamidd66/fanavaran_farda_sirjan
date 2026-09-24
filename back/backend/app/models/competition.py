from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)  # عنوان مسابقه
    specialty = Column(String(100), nullable=False)  # تخصص مسابقه (مثل: الگوریتم، وب، پایتون، هوش مصنوعی)
    event_date = Column(String(10), nullable=False)  # تاریخ برگزاری (فرمت شمسی 140X/XX/XX)
    location = Column(String(200), nullable=False)  # محل برگزاری
    awards = Column(String(255), nullable=False)  # جوایز مسابقه
    description = Column(Text, nullable=True)  # توضیحات (اختیاری)
    recorded_by = Column(String(100), nullable=False)  # ثبت کننده
    record_date = Column(String(10), nullable=False)  # تاریخ ثبت (فرمت شمسی 140X/XX/XX)
