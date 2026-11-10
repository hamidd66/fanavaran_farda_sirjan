from sqlalchemy import CheckConstraint, Column, ForeignKeyConstraint, Index, Text, Boolean, DateTime, ForeignKey, UniqueConstraint, func, text, Enum, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.enums.user import UserRoleEnum

from app.db.base import Base


class CourseQuestion(Base):
    __tablename__ = "course_questions"
    __table_args__ = (
        Index(None, "course_id", text("created_at DESC")),
        Index(None, "term_id", text("created_at DESC"), postgresql_where=text("term_id IS NOT NULL")),
        Index(None, "sender_id", text("created_at DESC")),
        Index(None, "parent_id", "created_at", postgresql_where=text("parent_id IS NOT NULL")),
        Index(None, "created_at", postgresql_where=text("is_approved = false AND deleted_at IS NULL")),

        CheckConstraint("length(btrim(message)) > 0 AND length(message) <= 5000", name="course_questions_message_length"),
        CheckConstraint("parent_id IS NULL OR parent_id <> id", name="course_questions_no_self_parent"),
        CheckConstraint("updated_at IS NULL OR updated_at >= created_at", name="course_questions_updated_after_created"),

        UniqueConstraint("id", "course_id", name="uq_course_questions_id_course"),
        ForeignKeyConstraint(
            ["parent_id", "course_id"],
            ["course_questions.id", "course_questions.course_id"],
            ondelete="CASCADE",
        ),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id", ondelete="CASCADE"), nullable=True)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(UUID(as_uuid=True), nullable=True)
    # parent_id = Column(UUID(as_uuid=True), ForeignKey("course_questions.id", ondelete="CASCADE"), nullable=True, index=True)

    sender_role = Column(Enum(UserRoleEnum), nullable=False)

    message = Column(Text, nullable=False)
    is_approved = Column(Boolean, nullable=False, server_default=false())

    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    course = relationship("Course", back_populates="course_questions")
    term = relationship("Term", back_populates="course_questions")
    sender = relationship("User", back_populates="course_questions", foreign_keys=[sender_id])

    parent = relationship("CourseQuestion", remote_side=[id], back_populates="replies", overlaps="course,course_questions")
    replies = relationship("CourseQuestion", back_populates="parent", cascade="all, delete-orphan", overlaps="course,course_questions")
