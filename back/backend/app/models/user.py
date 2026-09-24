from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(10), unique=True, index=True, nullable=False)  # کد ملی
    full_name = Column(String(120), nullable=False)                         # نام و نام خانوادگی
    role = Column(String(80), nullable=False)                               # نقش (هنرجو یا عنوان شغلی کادر)
    access_level = Column(String(50), nullable=False, default="user")       # سطح دسترسی
    last_login = Column(DateTime(timezone=True), nullable=True)             # آخرین ورود
    password_hash = Column(String(255), nullable=False)                     # هش رمز پیش‌فرض (کد ملی)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
