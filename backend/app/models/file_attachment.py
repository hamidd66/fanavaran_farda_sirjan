from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base


class FileAttachment(Base):
    __tablename__ = "file_attachments"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

    file_id = Column(String, ForeignKey("files.id", ondelete="CASCADE"), nullable=False)
    entity_id = Column(String, nullable=False)
    
    entity_type = Column(String(100), nullable=False)
    purpose = Column(String(100), nullable=False)
    display_order = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    file = relationship("File", back_populates="attachments")
