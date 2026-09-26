from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, Text
from sqlalchemy.sql import func
from app.db.base import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(120), nullable=False)
    father_name = Column(String(80), nullable=False)

    national_code = Column(String(10), unique=True, index=True, nullable=False)

    birth_date = Column(Date, nullable=False)

    phone = Column(String(11), unique=True, index=True, nullable=False)

    education_degree = Column(String(80), nullable=False)
    job_title = Column(String(120), nullable=False)

    specialties = Column(String(255), nullable=False)  # می‌تواند CSV باشد: "React, Python, ..."
    card_number = Column(String(16), unique=True, index=True, nullable=False)
    sheba_number = Column(String(24), unique=True, index=True, nullable=False)  # طبق درخواست شما 24 رقم

    address = Column(String(300), nullable=False)

    description = Column(Text, nullable=True)  # تنها فیلد اختیاری

    photo = Column(String(500), nullable=False)  # مسیر/URL عکس

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    created_by = Column(String(120), nullable=False)

    is_deleted = Column(Boolean, nullable=False, default=False, index=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
