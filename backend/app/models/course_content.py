from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class CourseContent(Base):
    __tablename__ = "course_contents"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    session_number = Column(Integer, nullable=False)
    
    content_type = Column(String(50), nullable=False)
    file = Column(String(500), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="contents")
    staff = relationship("Staff", back_populates="courses_contents")
