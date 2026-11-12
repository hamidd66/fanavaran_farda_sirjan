from sqlalchemy import CheckConstraint, Column, String, Date, DateTime, ForeignKey, Enum, func, text
from sqlalchemy.orm import relationship
from app.enums.staff_profile import StaffEmploymentStatus, EmploymentType
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class StaffProfile(Base):
    __tablename__ = "staff_profiles"
    __table_args__ = (
        CheckConstraint("length(btrim(job_title)) > 0", name="job_title_not_blank"),
        CheckConstraint("card_number ~ '^[0-9]{16}$'", name="card_number_format"),
        CheckConstraint("sheba_number ~ '^[0-9]{24}$'", name="sheba_format"),
        CheckConstraint("hire_date >= DATE '1900-01-01' AND hire_date <= CURRENT_DATE", name="hire_date_range"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),
    )

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

    