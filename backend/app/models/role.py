from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, CheckConstraint, and_, func, text, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment
from app.enums.file import EntityType


class Role(Base):
    __tablename__ = "roles"
    __table_args__ = (
        CheckConstraint("name ~ '^[a-z][a-z0-9_]{1,49}$'", name="name_format"),
        CheckConstraint("length(btrim(title)) > 0", name="title_not_blank"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(50), unique=True, nullable=False)
    title = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, server_default=true())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user_roles = relationship("UserRole", back_populates="role", cascade="all, delete-orphan")
    user = relationship("User", back_populates="role", foreign_keys=[created_by])

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Role.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == EntityType.roles,
        ),
        viewonly=True,
    )
