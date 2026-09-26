# app/models/student.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from app.db.base import Base

class Student(Base):
    __tablename__ = "student"

    id = Column(Integer, primary_key=True, index=True)
    
    # ۱. نام و نام خانوادگی (اجباری)
    full_name = Column(String(100), nullable=False, index=True)
    
    # ۲. نام پدر (اجباری)
    father_name = Column(String(50), nullable=False)
    
    # ۳. شماره ملی (اجباری، ۱۰ رقم یکتا)
    national_code = Column(String(10), unique=True, index=True, nullable=False)
    
    # ۴. تاریخ تولد (اجباری)
    birth_date = Column(String(10), nullable=False)  # مثلا 1382/04/15
    
    # ۵. شماره تماس اصلی (اجباری)
    phone = Column(String(11), index=True, nullable=False)
    
    # ۶. شماره تماس والدین (اجباری)
    parent_phone = Column(String(11), nullable=False)
    
    # ۷. تحصیلات (اجباری)
    education = Column(String(50), nullable=False)
    
    # ۸. پست الکترونیک (اجباری)
    email = Column(String(100), nullable=False)
    
    # ۹. آدرس (اجباری)
    address = Column(Text, nullable=False)
    
    # ۱۰. توضیحات (تنها فیلد اختیاری)
    description = Column(Text, nullable=True, default="")
    
    # ۱۱. عکس (اجباری - مسیر یا نام فایل)
    avatar = Column(String(255), nullable=False)
    
    # ۱۲. وضعیت (پیش‌فرض True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # ۱۳. تاریخ ثبت (خودکار در دیتابیس)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # ۱۴. ثبت‌کننده (اجباری)
    registered_by = Column(String(50), nullable=False)
