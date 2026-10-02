from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True, default=lambda: uuid.uuid4().hex)

    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    full_name = Column(String(100), nullable=False, index=True)
    father_name = Column(String(50), nullable=False)
    
    phone = Column(String(11), index=True, nullable=False)
    parent_phone = Column(String(11), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    
    birth_date = Column(String(10), nullable=False)
    education = Column(String(50), nullable=False)
    address = Column(Text, nullable=False)
    
    description = Column(Text, nullable=True)
    avatar = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    user = relationship("User", back_populates="student")