from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, UniqueConstraint, CheckConstraint, Index, func, text, false, true
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.term import SessionType


class TermSession(Base):
    __tablename__ = "term_sessions"

    __table_args__ = (
        UniqueConstraint("term_id", "session_number"),
        CheckConstraint("session_number > 0", name="term_sessions_number_positive"),
        CheckConstraint("estimated_duration >= 0", name="term_sessions_duration_nonnegative"),
        Index(None, "term_id", "session_type"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    session_type = Column(Enum(SessionType), nullable=False)
    session_number = Column(Integer, nullable=False)
    estimated_duration = Column(Integer, nullable=False, default=0)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    is_free_preview = Column(Boolean, nullable=False, server_default=false())
    is_active = Column(Boolean, nullable=False, server_default=true())
    is_deleted = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    term = relationship("Term", back_populates="term_sessions")
    user = relationship("User", back_populates="term_sessions", foreign_keys=[created_by])
    
    session_contents = relationship("SessionContent", back_populates="term_session")
