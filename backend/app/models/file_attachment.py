from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class FileAttachment(Base):
    __tablename__ = "file_attachments"
    __table_args__ = (
        UniqueConstraint(
            "entity_id",
            "entity_type",
            "purpose",
            "display_order",
            name="uq_attachment_display_order",
            deferrable=True,
            initially="DEFERRED"
        ),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    file_id = Column(UUID(as_uuid=True), ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    
    entity_type = Column(String(100), nullable=False)
    purpose = Column(String(100), nullable=False)
    display_order = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    file = relationship("File", back_populates="attachments")
