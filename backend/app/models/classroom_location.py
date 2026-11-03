from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer, ForeignKey, CheckConstraint, Index, func, text, false, true, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class ClassroomLocation(Base):
    __tablename__ = "classroom_locations"

    __table_args__ = (
        CheckConstraint("capacity > 0", name="classroom_locations_capacity_positive"),
        Index(None, "is_active", "is_deleted"),
        Index("uq_classroom_locations_name_alive", "name", unique=True, postgresql_where=text("is_deleted = false")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(150), nullable=False)
    capacity = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String(300), nullable=False)

    is_active = Column(Boolean, nullable=False, server_default=true())
    is_deleted = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user = relationship("User", foreign_keys=[created_by], back_populates="classroom_locations")
    
    classrooms = relationship("Classroom", back_populates="classroom_location")
    classroom_schedules = relationship("ClassroomSchedule", back_populates="classroom_location")
    classroom_sessions = relationship("ClassroomSession", back_populates="classroom_location")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            ClassroomLocation.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "classroom_locations",
        ),
        viewonly=True,
    )
