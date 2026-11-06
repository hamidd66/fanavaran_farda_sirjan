from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text, Enum, UniqueConstraint, Index, CheckConstraint, false, func, text, true
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.file import EntityType


class FileAttachment(Base):
    __tablename__ = "file_attachments"

    __table_args__ = (
        Index(None, "file_id"),
        Index(None, "attached_by", postgresql_where=text("attached_by IS NOT NULL")),
        Index(None, "deleted_at", postgresql_where=text("deleted_at IS NOT NULL")),

        CheckConstraint("length(btrim(entity_type)) > 0", name="file_attachments_entity_type_not_blank"),
        CheckConstraint("length(btrim(purpose)) > 0", name="file_attachments_purpose_not_blank"),
        CheckConstraint("display_order >= 0", name="file_attachments_display_order_nonneg"),
        # CheckConstraint("NOT is_primary OR is_active", name="file_attachments_primary_active"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="file_attachments_updated_after_created"),

        UniqueConstraint("entity_id", "entity_type", "purpose", "display_order", deferrable=True, initially="DEFERRED"),

        Index("uq_file_attachments_entity_purpose_file_alive", "entity_type", "entity_id", "purpose", "file_id", unique=True, postgresql_where=text("deleted_at IS NULL")),
        Index("uq_file_attachments_primary_alive", "entity_type", "entity_id", "purpose", unique=True, postgresql_where=text("is_primary = true AND is_active = true AND deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    file_id = Column(UUID(as_uuid=True), ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    attached_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    entity_type = Column(Enum(EntityType), nullable=False)
    
    purpose = Column(String(100), nullable=False)
    display_order = Column(Integer, nullable=False, server_default=text("1"))
    is_primary = Column(Boolean, nullable=False, server_default=false())
    
    is_active = Column(Boolean, nullable=False, server_default=true())
    description = Column(Text, nullable=True)
    
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    
    file = relationship("File", back_populates="file_attachments")
    user = relationship("User", foreign_keys=[attached_by], back_populates="file_attachments")
