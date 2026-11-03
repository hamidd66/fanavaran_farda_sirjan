# from sqlalchemy import Column, String, Integer, Date, DateTime, Time, Boolean, ForeignKey, UniqueConstraint, Enum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# import uuid
# from app.db.base import Base
# from app.enums.course import SessionType


# class ClassroomSession(Base):
#     __tablename__ = "classroom_sessions"
#     __table_args__ = (UniqueConstraint('classroom_id', 'session_number', name='uq_session_number'),)

#     id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

#     classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
#     created_by = Column(String, ForeignKey("staff.id", ondelete="SET NULL"), nullable=True)

#     session_type = Column(Enum(SessionType), nullable=False)
#     session_number = Column(Integer, nullable=False)
    
#     # session_date = Column(Date, nullable=False)
#     start_time = Column(Time(timezone=True), nullable=False) #DateTime
#     end_time = Column(Time(timezone=True), nullable=False) #DateTime

#     assignment_deadline = Column(DateTime(timezone=True), nullable=True)

#     topic = Column(String(200), nullable=True) #title

#     # is_completed = Column(Boolean, nullable=False, default=False)

#     created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

#     classroom = relationship("Classroom", back_populates="classroom_sessions")
#     staff = relationship("Staff", foreign_keys=[created_by], back_populates="classroom_sessions")
#     classroom_records = relationship("ClassroomRecord", back_populates="classroom_session", cascade="all, delete-orphan")
   
#     assignment_submissions = relationship("AssignmentSubmission", back_populates="classroom_session", cascade="all, delete-orphan")
    



from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum, Index, CheckConstraint, func, text, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import ClassroomSessionStatus


class ClassroomSession(Base):
    __tablename__ = "classroom_sessions"

    __table_args__ = (
        Index(None, "classroom_id", "status"),
        Index(None, "classroom_id", "start_at", postgresql_where=text("is_deleted = false")),
        Index(None, "teacher_id", "start_at", postgresql_where=text("is_deleted = false")),
        Index(None, "location_id", "start_at", postgresql_where=text("is_deleted = false AND location_id IS NOT NULL")),
        Index(None, "start_at", postgresql_where=text("is_deleted = false")),

        CheckConstraint("end_at > start_at", name="classroom_sessions_time"),
        CheckConstraint("assignment_deadline IS NULL OR assignment_deadline >= start_at", name="classroom_sessions_deadline"),
        CheckConstraint("status <> 'cancelled' OR status_change_reason IS NOT NULL", name="classroom_sessions_cancel_reason"),

        Index("uq_classroom_sessions_classroom_start", "classroom_id", "start_at", unique=True, postgresql_where=text("is_deleted = false AND status IN ('scheduled','in_progress','held')")),
        Index("uq_classroom_sessions_classroom_term_session", "classroom_id", "term_session_id", unique=True, postgresql_where=text("is_deleted = false AND term_session_id IS NOT NULL " "AND status IN ('scheduled','in_progress','held')")),
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

    is_deleted = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    classroom = relationship("Classroom", back_populates="classroom_sessions")
    term_session = relationship("TermSession", backref="classroom_sessions")
    classroom_location = relationship("ClassroomLocation", back_populates="classroom_sessions")
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="teacher_classroom_sessions")
    creator = relationship("User", foreign_keys=[created_by], back_populates="creator_classroom_sessions")

    classroom_attendances = relationship("ClassroomAttendance", back_populates="classroom_session", cascade="all, delete-orphan")
    classroom_grades = relationship("ClassroomGrade", back_populates="classroom_session", cascade="all, delete-orphan")
