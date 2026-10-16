from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.ext.mutable import MutableList
import uuid

from app.db.base import Base
from app.enums.audit_logs import ActionTypes


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True, unique=True, default=lambda: uuid.uuid4().hex)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    entity_id = Column(String, nullable=True)

    entity_type = Column(String(50), nullable=False)
    action = Column(Enum(ActionTypes), nullable=False)
    changed_fields = Column(MutableList.as_mutable(JSON), nullable=True, default=[])

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="audit_log")
