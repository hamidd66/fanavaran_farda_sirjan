from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class CourseCategory(Base):
    __tablename__ = "course_categories"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    name = Column(String(100), unique=True, nullable=False, index=True)
    image = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, unique=True, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    courses = relationship("Course", back_populates="category")
