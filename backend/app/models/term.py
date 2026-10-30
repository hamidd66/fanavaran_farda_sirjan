from sqlalchemy import Column, Text, Boolean, DateTime, ForeignKey, func, text, true, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class Term(Base):
    __tablename__ = "terms"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    course_questions = relationship("CourseQuestion", back_populates="term")

    is_active = Column(Boolean, nullable=False, server_default=true())
    is_deleted = Column(Boolean, nullable=False, server_default=false())
