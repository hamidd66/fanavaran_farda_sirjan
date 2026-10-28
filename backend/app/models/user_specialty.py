from sqlalchemy import Column, String, ForeignKey, DateTime, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class UserSpecialty(Base):
    __tablename__ = "user_specialties"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, index=True)
    specialty_id = Column(UUID(as_uuid=True), ForeignKey("specialties.id", ondelete="RESTRICT"), nullable=False, index=True)
    assigned_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    person = relationship("Person", back_populates="user_specialties")
    specialty = relationship("Specialty", back_populates="user_specialties")
    assigned_by_user = relationship("User", back_populates="assigned_specialties", foreign_keys=[assigned_by])
    