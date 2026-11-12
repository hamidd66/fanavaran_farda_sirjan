from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, CheckConstraint, Index, func, text, false, true
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.term import SessionType


class TermSession(Base):
    __tablename__ = "term_sessions"
    __table_args__ = (
        Index(None, "term_id", "session_type", postgresql_where=text("deleted_at IS NULL")),

        # CheckConstraint("session_number > 0", name="number_positive"),
        CheckConstraint("estimated_duration >= 0", name="duration_nonnegative"),
        CheckConstraint("length(btrim(title)) > 0", name="title_not_empty"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),
        # CheckConstraint("deleted_at IS NULL OR is_active = false", name="deleted_not_active"),

        Index("uq_term_sessions_term_session_number_alive", "term_id", "session_number", unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id", ondelete="RESTRICT"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    session_type = Column(Enum(SessionType), nullable=False)
    session_number = Column(Integer, nullable=False)
    estimated_duration = Column(Integer, nullable=False, server_default=text("0"))

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    is_free_preview = Column(Boolean, nullable=False, server_default=false())
    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    term = relationship("Term", back_populates="term_sessions")
    user = relationship("User", back_populates="term_sessions", foreign_keys=[created_by])
    
    session_contents = relationship("SessionContent", back_populates="term_session")
