from sqlalchemy import Column, String, Integer, Date, DateTime, Boolean, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.db.base import Base
from app.enums.classroom import SessionType


class ClassroomSession(Base):
    __tablename__ = "classroom_sessions"
    __table_args__ = (UniqueConstraint('classroom_id', 'session_number', name='uq_session_number'),)

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)

    classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

    session_type = Column(Enum(SessionType), nullable=False)
    session_number = Column(Integer, nullable=False)
    
    session_date = Column(Date, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)

    assignment_deadline = Column(DateTime(timezone=True), nullable=True)

    topic = Column(String(200), nullable=True)

    is_completed = Column(Boolean, nullable=False, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    classroom = relationship("Classroom", back_populates="classroom_sessions")
    staff = relationship("Staff", foreign_keys=[created_by], back_populates="classroom_sessions")
    classroom_records = relationship("ClassroomRecord", back_populates="classroom_session", cascade="all, delete-orphan")