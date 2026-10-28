from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Enum, func, text
from sqlalchemy.orm import relationship
from app.enums.staff_profile import StaffEmploymentStatus, EmploymentType
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class StaffProfile(Base):
    __tablename__ = "staff_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    employment_status = Column(Enum(StaffEmploymentStatus), nullable=False)
    employment_type = Column(Enum(EmploymentType), nullable=False)
    job_title = Column(String(120), nullable=False)
    card_number = Column(String(19), nullable=False)
    sheba_number = Column(String(26), nullable=False)
    hire_date = Column(Date, nullable=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    person = relationship("Person", back_populates="staff_profile")

    