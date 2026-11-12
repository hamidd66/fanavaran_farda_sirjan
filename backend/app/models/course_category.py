from sqlalchemy import CheckConstraint, Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index, UniqueConstraint, and_, func, text, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class CourseCategory(Base):
    __tablename__ = "course_categories"
    __table_args__ = (
        CheckConstraint("name = btrim(name) AND length(name) > 0", name="name_trimmed"),
        CheckConstraint("slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'", name="slug_format"),
        # CheckConstraint("display_order >= 0", name="display_order_nonneg"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),

        Index("uq_course_categories_display_order_alive", "display_order", unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    name = Column(String(100), unique=True, nullable=False, index=True)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)

    display_order = Column(Integer, server_default=text("0"), nullable=False)
    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    courses = relationship("Course", back_populates="category")
    user = relationship("User", back_populates="course_category", foreign_keys=[created_by])

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            CourseCategory.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "course_categories",
        ),
        viewonly=True,
    )
