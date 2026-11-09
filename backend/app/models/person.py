from sqlalchemy import CheckConstraint, Column, Index, String, Date, DateTime, ForeignKey, Text, Enum, and_, func, text
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.person import Gender, EducationLevel
from app.enums.user import ReferralSources
from app.enums.file import EntityType
from app.models.file_attachment import FileAttachment


class Person(Base):
    __tablename__ = "persons"
    __table_args__ = (
        Index(None, "full_name"),

        CheckConstraint("length(btrim(full_name)) > 0", name="persons_full_name_not_blank"),
        CheckConstraint("length(btrim(father_name)) > 0", name="persons_father_name_not_blank"),
        CheckConstraint("length(btrim(address)) > 0", name="persons_address_not_blank"),
        CheckConstraint("field_of_study IS NULL OR length(btrim(field_of_study)) > 0", name="persons_field_of_study_not_blank"),
        CheckConstraint("phone ~ '^09[0-9]{9}$'", name="persons_phone_format"),
        CheckConstraint(r"email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'", name="persons_email_format"),
        CheckConstraint("birth_date >= '1900-01-01' AND birth_date <= CURRENT_DATE", name="persons_birth_date_range"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="persons_updated_after_created"),
        CheckConstraint(r"full_name !~ '[\u064A\u0643]' AND father_name !~ '[\u064A\u0643]'", name="persons_name_persian_chars"),

        Index("uq_persons_email_lower", text("lower(email)"), unique=True),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    full_name = Column(String(120), nullable=False)
    father_name = Column(String(80), nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    phone = Column(String(11), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    address = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    field_of_study = Column(String(255), nullable=True)
    education_level = Column(Enum(EducationLevel), nullable=False)
    referral_source = Column(Enum(ReferralSources), nullable=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user = relationship("User", back_populates="person")
    staff_profile = relationship("StaffProfile", back_populates="person", uselist=False, cascade="all, delete-orphan")
    student_profile = relationship("StudentProfile", back_populates="person", uselist=False, cascade="all, delete-orphan")
    user_specialties = relationship("UserSpecialty", back_populates="person", cascade="all, delete-orphan")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Person.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == EntityType.persons,
        ),
        viewonly=True,
    )

