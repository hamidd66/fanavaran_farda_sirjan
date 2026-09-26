from sqlalchemy import Column, Integer, String, Text, Boolean
from app.db.base import Base


class Suggestion(Base):
    __tablename__ = "suggestions"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    email = Column(String(150), nullable=True)
    phone_number = Column(String(11), nullable=True)
    is_published = Column(Boolean, default=False, nullable=False)
    record_date = Column(String(10), nullable=False)
    recorded_by = Column(String(100), nullable=False)
