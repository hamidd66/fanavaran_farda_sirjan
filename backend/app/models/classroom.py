from sqlalchemy import Column, String, Text, DateTime, Integer, BigInteger, Date, ForeignKey, Enum, CheckConstraint, Index, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import HoldingType, ClassroomStatus


class Classroom(Base):
    __tablename__ = "classrooms"
    __table_args__ = (
        Index(None, "status", postgresql_where=text("deleted_at IS NULL")),
        Index(None, "start_date", postgresql_where=text("deleted_at IS NULL")),

        CheckConstraint("capacity > 0", name="capacity_pos"),
        CheckConstraint("min_capacity IS NULL OR (min_capacity > 0 AND min_capacity <= capacity)", name="min_capacity"),
        CheckConstraint("tuition >= 0", name="tuition_nonneg"),
        CheckConstraint("sessions_count >= 0", name="sessions_count_pos"),
        CheckConstraint("duration_hours >= 0", name="duration_pos"),
        CheckConstraint("end_date >= start_date", name="dates"),
        CheckConstraint("registration_end >= registration_start", name="reg_dates"),
        CheckConstraint("registration_end <= end_date", name="reg_end_before_end"),
        CheckConstraint("holding_type <> 'in_person' OR location_id IS NOT NULL", name="inperson_location"),
        CheckConstraint("holding_type <> 'online' OR meeting_link IS NOT NULL", name="online_meeting_link"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id", ondelete="RESTRICT"), nullable=False, index=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("classroom_locations.id", ondelete="SET NULL"), nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    status = Column(Enum(ClassroomStatus), nullable=False, server_default=text("'draft'"))
    holding_type = Column(Enum(HoldingType), nullable=False)
    class_link = Column(String(500), nullable=True)
    meeting_link = Column(String(500), nullable=True)

    capacity = Column(Integer, nullable=False)
    min_capacity = Column(Integer, nullable=True)
    tuition = Column(BigInteger, nullable=False, server_default=text("0"))

    sessions_count = Column(Integer, nullable=False)
    duration_hours = Column(Integer, nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    registration_start = Column(Date, nullable=False)
    registration_end = Column(Date, nullable=False)

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    term = relationship("Term", back_populates="classrooms")
    classroom_location = relationship("ClassroomLocation", back_populates="classrooms")
    teacher = relationship("User", foreign_keys=[teacher_id], back_populates="teacher_classrooms")
    creator = relationship("User", foreign_keys=[created_by], back_populates="creator_classrooms")

    classroom_schedules = relationship("ClassroomSchedule", back_populates="classroom")
    enrollments = relationship("Enrollment", back_populates="classroom")
    classroom_sessions = relationship("ClassroomSession", back_populates="classroom", cascade="all, delete-orphan")
