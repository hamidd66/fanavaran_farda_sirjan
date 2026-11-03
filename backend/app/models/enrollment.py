# from sqlalchemy import Column, Enum, String, Text, DateTime, ForeignKey, UniqueConstraint
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# import uuid
# from app.db.base import Base
# from app.enums.enrollment import RegistrationMethod

# class Enrollment(Base):
#     __tablename__ = "enrollments"
#     __table_args__ = (UniqueConstraint('student_id', 'classroom_id', name='uq_student_Classroom'),)

#     id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

#     student_id = Column(String, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
#     classroom_id = Column(String, ForeignKey("classrooms.id", ondelete="RESTRICT"), nullable=False, index=True)

#     registration_method = Column(Enum(RegistrationMethod), nullable=False)
#     description = Column(Text, nullable=True)

#     created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

#     student = relationship("Student", back_populates="enrollments")
#     classroom = relationship("Classroom", back_populates="enrollments")


from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Enum, Index, CheckConstraint, UniqueConstraint, func, text, false
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.enums.classroom import EnrollmentStatus

# در روت بررسی شود: ثبت‌نام مبدأ و مقصد باید متعلق به یک student_id باشند
class Enrollment(Base):
    __tablename__ = "enrollments"

    __table_args__ = (
        Index(None, "classroom_id", "status", postgresql_where=text("is_deleted = false")),
        Index(None, "student_id", postgresql_where=text("is_deleted = false")),

        CheckConstraint("(status = 'transferred') = (transferred_to_id IS NOT NULL)", name="enrollments_transfer_target"),
        CheckConstraint("transferred_to_id IS NULL OR transferred_to_id <> id", name="enrollments_no_self_transfer"),

        Index("uq_enrollments_student_classroom_live", "student_id", "classroom_id", unique=True, postgresql_where=text("is_deleted = false AND status IN ('pending','active','waitlisted')")),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    classroom_id = Column(UUID(as_uuid=True), ForeignKey("classrooms.id", ondelete="RESTRICT"), nullable=False)
    transferred_to_id = Column(UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="RESTRICT"), nullable=True, unique=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    status = Column(Enum(EnrollmentStatus), nullable=False, server_default="'pending'")
    status_changed_at = Column(DateTime(timezone=True), nullable=True)
    status_change_reason = Column(String(255), nullable=True)

    registration_method = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

    is_deleted = Column(Boolean, nullable=False, server_default=false())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    transferred_to = relationship("Enrollment", foreign_keys=[transferred_to_id], remote_side=[id], back_populates="transferred_from", uselist=False)
    transferred_from = relationship("Enrollment", foreign_keys=[transferred_to_id], back_populates="transferred_to", uselist=False)

    student = relationship("User", back_populates="student_enrollments")
    classroom = relationship("Classroom", back_populates="enrollments")
    creator = relationship("User", foreign_keys=[created_by], back_populates="creator_enrollments")

    classroom_attendances = relationship("ClassroomAttendance", back_populates="enrollment", cascade="all, delete-orphan")
    classroom_grades = relationship("ClassroomGrade", back_populates="enrollment", cascade="all, delete-orphan")
