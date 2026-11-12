from sqlalchemy import CheckConstraint, Column, Index, String, Text, Boolean, DateTime, ForeignKey, and_, func, text, false, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class Course(Base):
    __tablename__ = "courses"

    __table_args__ = (
        Index(None, "category_id", text("created_at DESC")),
        Index(None, text("created_at DESC"), postgresql_where=text("deleted_at IS NULL AND is_active = true")),

        CheckConstraint("title = btrim(title) AND length(title) > 0", name="title_trimmed"),
        CheckConstraint("length(btrim(short_description)) > 0", name="short_description_not_blank"),
        CheckConstraint("length(btrim(long_description)) > 0", name="long_description_not_blank"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="updated_after_created"),
        # CheckConstraint("NOT deleted_at IS NULL OR NOT is_active", name="deleted_not_active"),

        Index("uq_courses_category_title_alive", "category_id", text("lower(title)"), unique=True, postgresql_where=text("deleted_at IS NULL AND is_active = true")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    category_id = Column(UUID(as_uuid=True), ForeignKey("course_categories.id", ondelete="RESTRICT"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False, index=True)
    short_description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=False)

    prerequisites = Column(String(300), nullable=False)

    has_certificate = Column(Boolean, nullable=False, server_default=false())
    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    category = relationship("CourseCategory", back_populates="courses")
    user = relationship("User", back_populates="courses", foreign_keys=[created_by])
    
    course_questions = relationship("CourseQuestion", back_populates="course", cascade="all, delete-orphan")
    terms = relationship("Term", back_populates="course")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Course.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "courses",
        ),
        viewonly=True,
    )
