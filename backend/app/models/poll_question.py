from sqlalchemy import Column, Integer, String, Text, Boolean
from app.db.base import Base


class PollQuestion(Base):
    __tablename__ = "poll_questions"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(200), nullable=False)
    poll_type = Column(String(50), nullable=False)  # 4 گزینه ای، نمره از 5، توضیحی
    question_text = Column(Text, nullable=False)
    option_1 = Column(String(255), nullable=True)
    option_2 = Column(String(255), nullable=True)
    option_3 = Column(String(255), nullable=True)
    option_4 = Column(String(255), nullable=True)
    score = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    record_date = Column(String(10), nullable=False)
    recorded_by = Column(String(100), nullable=False)
