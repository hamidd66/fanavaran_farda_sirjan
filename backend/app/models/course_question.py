# from sqlalchemy import Boolean, Column, String, Text, DateTime, ForeignKey, func, text
# from sqlalchemy.orm import relationship
# from sqlalchemy.dialects.postgresql import UUID

# from app.db.base import Base


# class CourseFAQ(Base):
#     __tablename__ = "course_faqs"

#     id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

#     course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
#     sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
#     parent_id = Column(UUID(as_uuid=True), ForeignKey("course_faqs.id", ondelete="CASCADE"), nullable=True)

#     message = Column(Text, nullable=False)
#     is_approved = Column(Boolean, nullable=False, default=False)

#     updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
#     created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

#     course = relationship("Course", back_populates="faqs")
#     user = relationship("User", back_populates="course_faqs")

#     parent = relationship("CourseFAQ", remote_side="CourseFAQ.id", back_populates="replies")
#     replies = relationship("CourseFAQ", back_populates="parent")

#     @property
#     def sender(self):
#         profile = self.user.student or self.user.staff
#         return {
#             "id": profile.id,
#             "full_name": profile.full_name,
#             "avatar": getattr(profile, "avatar", None),
#             "role": self.user.role.value
#         }


from sqlalchemy import Column, Text, Boolean, DateTime, ForeignKey, func, text, Enum, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.enums.user import UserRoleEnum

from app.db.base import Base


class CourseQuestion(Base):
    __tablename__ = "course_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    term_id = Column(UUID(as_uuid=True), ForeignKey("terms.id", ondelete="CASCADE"), nullable=True, index=True)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("course_questions.id", ondelete="CASCADE"), nullable=True, index=True)

    sender_role = Column(Enum(UserRoleEnum), nullable=False)

    message = Column(Text, nullable=False)
    is_approved = Column(Boolean, nullable=False, server_default=false())
    is_deleted = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    course = relationship("Course", back_populates="course_questions")
    term = relationship("Term", back_populates="course_questions")
    sender = relationship("User", back_populates="course_questions", foreign_keys=[sender_id])

    parent = relationship("CourseQuestion", remote_side=[id], back_populates="replies")
    replies = relationship("CourseQuestion", back_populates="parent", cascade="all, delete-orphan")
