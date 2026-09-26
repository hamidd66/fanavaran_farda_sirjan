from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class PollResponse(Base):
    __tablename__ = "poll_responses"

    id = Column(Integer, primary_key=True, index=True)
    poll_question_id = Column(Integer, ForeignKey("poll_questions.id"), nullable=False)
    answer_value = Column(String(255), nullable=False)  # می‌تواند متن گزینه، نمره یا جواب کوتاه باشد
    description = Column(Text, nullable=True)  # اختیاری
    user_name = Column(String(100), nullable=False)
    record_date = Column(String(10), nullable=False)
    recorded_by = Column(String(100), nullable=False)

    # ارتباط با سوال نظرسنجی
    poll_question = relationship("PollQuestion", backref="responses")
