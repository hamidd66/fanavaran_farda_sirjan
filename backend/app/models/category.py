from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class CourseCategory(Base):
    __tablename__ = "course_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)  # نام دسته‌بندی
    image_url = Column(String(500), nullable=True)                      # آدرس تصویر
    display_order = Column(Integer, default=0, nullable=False)          # ترتیب نمایش (عددی)
    description = Column(Text, nullable=True)                           # توضیح مختصر
