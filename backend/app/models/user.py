from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from app.enums.user import UserRole
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    national_code = Column(String(10), unique=True, index=True, nullable=False)

    role = Column(Enum(UserRole), nullable=False)

    password = Column(String(255), nullable=False)
    token_version = Column(Integer, nullable=False)
    is_active = Column(Boolean, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_login = Column(DateTime(timezone=True), nullable=True)

    student = relationship("Student", back_populates="user", cascade="all, delete-orphan", uselist=False)
    staff = relationship("Staff", back_populates="user", cascade="all, delete-orphan", uselist=False)
    course_faqs = relationship("CourseFAQ", back_populates="user")
    