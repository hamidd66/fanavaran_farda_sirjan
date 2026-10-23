from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import uuid


class UserSpecialty(Base):
    __tablename__ = "user_specialties"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    person_id = Column(String, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, index=True)
    specialty_id = Column(String, ForeignKey("specialties.id", ondelete="RESTRICT"), nullable=False, index=True)
    assigned_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=False, index=True)

    assigned_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    person = relationship("Person", back_populates="user_specialties")
    specialty = relationship("Specialty", back_populates="user_specialties")
    assigned_by_user = relationship("User", back_populates="assigned_specialties", foreign_keys=[assigned_by])