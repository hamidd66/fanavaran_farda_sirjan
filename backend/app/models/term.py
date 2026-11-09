from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, BigInteger, Integer, CheckConstraint, Index, and_, func, text, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class Term(Base):
    __tablename__ = "terms"
    __table_args__ = (
        Index(None, "course_id", "is_active", postgresql_where=text("deleted_at IS NULL")),

        # CheckConstraint("term_number > 0", name="terms_term_number_positive"),
        CheckConstraint("tuition >= 0", name="terms_tuition_nonnegative"),
        CheckConstraint("length(btrim(title)) > 0", name="terms_title_not_empty"),

        Index("uq_terms_course_term_number_alive", "course_id", "term_number", unique=True, postgresql_where=text("deleted_at IS NULL")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False)
    short_description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=False)

    term_number = Column(Integer, nullable=False)
    prerequisites = Column(String(300), nullable=False)

    tuition = Column(BigInteger, nullable=False, server_default=text("0"))

    is_active = Column(Boolean, nullable=False, server_default=true())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    user = relationship("User", back_populates="terms", foreign_keys=[created_by])
    course = relationship("Course", back_populates="terms")
    
    term_sessions = relationship("TermSession", back_populates="term")
    course_questions = relationship("CourseQuestion", back_populates="term", cascade="all, delete-orphan")

    classrooms = relationship("Classroom", back_populates="term")

    file_attachments = relationship(
        "FileAttachment",
        primaryjoin=lambda: and_(
            Term.id == foreign(FileAttachment.entity_id),
            FileAttachment.entity_type == "terms",
        ),
        viewonly=True,
    )
