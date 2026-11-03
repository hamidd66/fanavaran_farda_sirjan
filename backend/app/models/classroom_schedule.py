from sqlalchemy import Column, DateTime, Time, ForeignKey, Enum, Index, CheckConstraint, UniqueConstraint, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import WeekDay


class ClassroomSchedule(Base):
    __tablename__ = "classroom_schedules"

    __table_args__ = (
        Index(None, "classroom_id", "day"),
        Index(None, "location_id", "day", "start_time", postgresql_where=text("location_id IS NOT NULL")),

        CheckConstraint("end_time > start_time", name="classroom_schedules_time"),
        UniqueConstraint("classroom_id", "day", "start_time"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    classroom_id = Column(UUID(as_uuid=True), ForeignKey("classrooms.id", ondelete="RESTRICT"), nullable=False, index=True)
    location_id = Column(UUID(as_uuid=True), ForeignKey("classroom_locations.id", ondelete="SET NULL"), nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    day = Column(Enum(WeekDay), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    classroom = relationship("Classroom", back_populates="classroom_schedules")
    classroom_location = relationship("ClassroomLocation", back_populates="classroom_schedules")
    user = relationship("User", foreign_keys=[created_by], back_populates="classroom_schedules")
