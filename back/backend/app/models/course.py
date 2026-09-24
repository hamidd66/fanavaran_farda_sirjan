from sqlalchemy import Column, Integer, String, Text, Boolean, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    
    # ۱. آیدی دسته‌بندی دوره (کلید خارجی متصل به جدول course_categories)
    category_id = Column(Integer, ForeignKey("course_categories.id", ondelete="RESTRICT"), nullable=False)
    
    # ۲. عنوان دوره
    title = Column(String(200), nullable=False, index=True)
    
    # ۳. پیش‌نیازهای دوره
    prerequisites = Column(String(300), nullable=False)
    
    # ۴. توضیح کوتاه
    short_description = Column(String(500), nullable=False)
    
    # ۵. توضیح بلند
    long_description = Column(Text, nullable=False)
    
    # ۶. شهریه به تومان (عددی - BigInteger برای مبالغ بزرگ)
    tuition = Column(BigInteger, nullable=False)
    
    # ۷. تعداد جلسات (عددی)
    sessions_count = Column(Integer, nullable=False)
    
    # ۸. ساعت دوره (مجموع ساعات آموزشی دوره - عددی)
    total_hours = Column(Integer, nullable=False)
    
    # ۹. عکس دوره (آدرس تصویر)
    image_url = Column(String(500), nullable=False)
    
    # ۱۰. محتوای آموزشی (دارد / ندارد)
    has_learning_content = Column(Boolean, nullable=False, default=False)
    
    # ۱۱. گواهینامه (دارد / ندارد)
    has_certificate = Column(Boolean, nullable=False, default=False)
    
    # ۱۲. توضیح کامل
    full_description = Column(Text, nullable=False)
    
    # ۱۳. تاریخ ثبت دوره (خودکار بر اساس تاریخ و زمان جاری)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # ارتباط با دسته‌بندی برای واکشی اطلاعات دسته‌بندی به همراه دوره
    category = relationship("CourseCategory")
