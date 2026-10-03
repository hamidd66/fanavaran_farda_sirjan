from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class CourseFAQ(Base):
    __tablename__ = "course_faqs"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=False)
    parent_id = Column(String, ForeignKey("course_faqs.id", ondelete="CASCADE"), nullable=True)

    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="faqs")
    user = relationship("User", back_populates="course_faqs")

    parent = relationship("CourseFAQ", remote_side="CourseFAQ.id", back_populates="replies")
    replies = relationship("CourseFAQ", back_populates="parent", cascade="all, delete-orphan")
