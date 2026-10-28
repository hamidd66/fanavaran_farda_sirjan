from sqlalchemy import Column, String, Date, DateTime, ForeignKey, Text, Enum, and_, func, text
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID


from app.db.base import Base
from app.enums.person import Gender, EducationLevel
from app.enums.user import ReferralSources
from app.models.file_attachment import FileAttachment


class Person(Base):
    __tablename__ = "persons"

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
            FileAttachment.entity_type == "persons",
        ),
        viewonly=True,
    )

