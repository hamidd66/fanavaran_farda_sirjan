from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum, Index, CheckConstraint, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import ClassroomSessionStatus


class ClassroomSession(Base):
    __tablename__ = "classroom_sessions"

    __table_args__ = (
        Index(None, "classroom_id", "status"),
        Index(None, "classroom_id", "start_at", postgresql_where=text("deleted_at IS NULL")),
        Index(None, "teacher_id", "start_at", postgresql_where=text("deleted_at IS NULL")),
        Index(None, "location_id", "start_at", postgresql_where=text("deleted_at IS NULL AND location_id IS NOT NULL")),
        Index(None, "start_at", postgresql_where=text("deleted_at IS NULL")),

        CheckConstraint("end_at > start_at", name="classroom_sessions_time"),
        CheckConstraint("assignment_deadline IS NULL OR assignment_deadline >= start_at", name="classroom_sessions_deadline"),
        CheckConstraint("status <> 'cancelled' OR status_change_reason IS NOT NULL", name="classroom_sessions_cancel_reason"),

        Index("uq_classroom_sessions_classroom_start", "classroom_id", "start_at", unique=True, postgresql_where=text("deleted_at IS NULL AND status IN ('scheduled','in_progress','held')")),
        Index("uq_classroom_sessions_classroom_term_session", "classroom_id", "term_session_id", unique=True, postgresql_where=text("deleted_at IS NULL AND term_session_id IS NOT NULL " "AND status IN ('scheduled','in_progress','held')")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    classroom_id = Column(UUID(as_uuid=True), ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    term_session_id = Column(UUID(as_uuid=True), ForeignKey("term_sessions.id", ondelete="SET NULL"), nullable=True, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("classroom_locations.id", ondelete="SET NULL"), nullable=True, index=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    status = Column(Enum(ClassroomSessionStatus), nullable=False, server_default=text("'scheduled'"))
    status_changed_at = Column(DateTime(timezone=True), nullable=True)
    status_change_reason = Column(String(255), nullable=True)

    start_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True), nullable=False)

    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    assignment_deadline = Column(DateTime(timezone=True), nullable=True)
    meeting_link = Column(String(500), nullable=True)

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    classroom = relationship("Classroom", back_populates="classroom_sessions")
    term_session = relationship("TermSession", backref="classroom_sessions")
    classroom_location = relationship("ClassroomLocation", back_populates="classroom_sessions")
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="teacher_classroom_sessions")
    creator = relationship("User", foreign_keys=[created_by], back_populates="creator_classroom_sessions")

    classroom_attendances = relationship("ClassroomAttendance", back_populates="classroom_session", cascade="all, delete-orphan")
    classroom_grades = relationship("ClassroomGrade", back_populates="classroom_session", cascade="all, delete-orphan")
