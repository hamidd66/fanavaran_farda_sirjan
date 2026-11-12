from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, CheckConstraint, Index, and_, func, text, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment
from app.enums.file import EntityType


class Specialty(Base):
    __tablename__ = "specialties"
    __table_args__ = (
        CheckConstraint("name = btrim(name) AND length(name) > 0", name="name_trimmed"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),

        Index("uq_specialties_name_lower", text("lower(name)"), unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user_specialties = relationship("UserSpecialty", back_populates="specialty")
    user = relationship("User", back_populates="specialty", foreign_keys=[created_by])

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Specialty.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == EntityType.specialties,
        ),
        viewonly=True,
    )

    