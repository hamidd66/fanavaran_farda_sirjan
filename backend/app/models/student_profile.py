from sqlalchemy import CheckConstraint, Column, Index, String, DateTime, ForeignKey, Enum, func, text
from sqlalchemy.orm import relationship
from app.enums.student_profile import StudentEducationalStatus
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    __table_args__ = (
        Index(None, "parent_phone"),

        CheckConstraint("parent_phone ~ '^09[0-9]{9}$'", name="student_profiles_parent_phone_format"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="student_profiles_updated_after_created"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    educational_status = Column(Enum(StudentEducationalStatus), nullable=False)
    parent_phone = Column(String(11), nullable=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    person = relationship("Person", back_populates="student_profile")

    