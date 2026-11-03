from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, BigInteger, Integer, UniqueConstraint, CheckConstraint, Index, and_, func, text, false, true
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.file_attachment import FileAttachment


class Term(Base):
    __tablename__ = "terms"

    __table_args__ = (
        UniqueConstraint("course_id", "term_number"),
        CheckConstraint("tuition >= 0", name="terms_tuition_nonnegative"),
        CheckConstraint("sessions_count >= 0", name="terms_sessions_count_nonnegative"),
        CheckConstraint("duration_hours >= 0", name="terms_duration_nonnegative"),
        Index(None, "course_id", "is_active", "is_deleted"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="RESTRICT"), nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    title = Column(String(200), nullable=False)
    short_description = Column(String(500), nullable=False)
    long_description = Column(Text, nullable=False)

    term_number = Column(Integer, nullable=False)
    prerequisites = Column(String(300), nullable=False)

    tuition = Column(BigInteger, nullable=False, default=0)

    is_active = Column(Boolean, nullable=False, server_default=true())
    is_deleted = Column(Boolean, nullable=False, server_default=false())

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
