from sqlalchemy import Column, Integer, String, Text, Boolean, BigInteger, DateTime, ForeignKey, JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    category_id = Column(String, ForeignKey("course_categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(200), nullable=False, index=True)
    prerequisites = Column(String(300), nullable=False)

    short_description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=False)

    tuition = Column(BigInteger, nullable=False)
    has_certificate = Column(Boolean, default=False, nullable=False)

    sessions_count = Column(Integer, nullable=False)
    duration_hours = Column(Integer, nullable=False)

    image = Column(String(500), nullable=False)
    outline = Column(MutableList.as_mutable(JSON), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    category = relationship("CourseCategory", back_populates="courses")
    staff = relationship("Staff", back_populates="courses")
    
    contents = relationship("CourseContent", back_populates="course")
    faqs = relationship("CourseFAQ", back_populates="course")
    
    classrooms = relationship("Classroom", back_populates="course")
