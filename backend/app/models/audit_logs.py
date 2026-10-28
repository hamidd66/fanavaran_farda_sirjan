from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON, func, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.audit_logs import ActionTypes


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)

    entity_type = Column(String(50), nullable=False)
    action = Column(Enum(ActionTypes), nullable=False)
    changed_fields = Column(MutableList.as_mutable(JSON), nullable=True, default=list)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="audit_log_creator")
