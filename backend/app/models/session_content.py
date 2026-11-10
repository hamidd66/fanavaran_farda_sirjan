from sqlalchemy import CheckConstraint, Column, String, Text, Integer, DateTime, ForeignKey, Boolean, Enum, Index, and_, func, text, false, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.term import ContentType
from app.models.file_attachment import FileAttachment


class SessionContent(Base):
    __tablename__ = "session_contents"
    __table_args__ = (
        Index(None, "term_session_id", "content_type", postgresql_where=text("deleted_at IS NULL")),
        Index(None, "term_session_id", "is_active", "display_order", postgresql_where=text("deleted_at IS NULL")),

        # CheckConstraint("display_order >= 0", name="session_contents_display_order_nonnegative"),
        CheckConstraint("length(btrim(title)) > 0", name="session_contents_title_not_empty"),
        CheckConstraint("content_type <> 'text' OR body IS NOT NULL", name="session_contents_text_has_body"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="session_contents_updated_after_created"),
        # CheckConstraint("deleted_at IS NULL OR is_active = false", name="session_contents_deleted_not_active"),

        Index("uq_session_contents_term_session_display_order_alive", "term_session_id", "display_order", unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    term_session_id = Column(UUID(as_uuid=True), ForeignKey("term_sessions.id", ondelete="RESTRICT"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    body = Column(Text, nullable=True)

    content_type = Column(Enum(ContentType), nullable=False)
    display_order = Column(Integer, server_default=text("0"), nullable=False)

    is_free_preview = Column(Boolean, nullable=False, server_default=false())
    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user = relationship("User", back_populates="session_contents", foreign_keys=[created_by])
    term_session = relationship("TermSession", back_populates="session_contents")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            SessionContent.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "session_contents",
        ),
        viewonly=True,
    )
