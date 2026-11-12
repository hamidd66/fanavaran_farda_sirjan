from sqlalchemy import Column, Integer, String, Boolean, DateTime, CheckConstraint, Index, text, func, true
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        Index(None, "created_at", postgresql_where=text("deleted_at IS NULL")),

        # CheckConstraint("national_code IS NOT NULL OR email IS NOT NULL OR phone IS NOT NULL", name="users_at_least_one_identifier"),
        CheckConstraint("national_code ~ '^[0-9]{10}$'", name="users_national_code_format"),
        CheckConstraint(r"national_code !~ '^(.)\1{9}$'", name="users_national_code_not_repeated"),
        CheckConstraint(r"email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'", name="users_email_format"),
        CheckConstraint("phone ~ '^09[0-9]{9}$'", name="users_phone_format"),
        CheckConstraint("length(password) >= 20", name="users_password_hash_len"),
        # CheckConstraint("(email IS NOT NULL OR phone IS NOT NULL) OR password IS NOT NULL", name="users_otp_user_or_password_holder"),
        CheckConstraint("username IS NULL OR (username ~ '^[A-Za-z][A-Za-z0-9_]{4,}$' AND username !~ '__')", name="users_username_format"),

        CheckConstraint("token_version >= 1", name="users_token_version_pos"),
        CheckConstraint("failed_login_count >= 0", name="users_failed_login_nonneg"),
        # CheckConstraint("NOT deleted_at IS NULL OR NOT is_active", name="users_deleted_not_active"),

        Index("uq_users_username_lower", text("lower(username)"), unique=True),
        Index("uq_users_email_lower", text("lower(email)"), unique=True),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    username = Column(String(50), nullable=True)
    national_code = Column(String(10), unique=True, nullable=False)
    phone = Column(String(11), unique=True, nullable=False)
    email = Column(String(100), nullable=True)

    password = Column(String(255), nullable=False)

    is_active = Column(Boolean, nullable=False, server_default=true())
    token_version = Column(Integer, nullable=False, server_default=text("1"))
    
    locked_until = Column(DateTime(timezone=True), nullable=True)
    failed_login_count = Column(Integer, nullable=False, server_default=text("0"))

    last_login = Column(DateTime(timezone=True), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


    person = relationship("Person", back_populates="user", uselist=False, cascade="all, delete-orphan")

    user_roles = relationship("UserRole", back_populates="user", foreign_keys="UserRole.user_id", cascade="all, delete-orphan")
    assigned_roles = relationship("UserRole", back_populates="assigned_by_user", foreign_keys="UserRole.assigned_by")
    role = relationship("Role", back_populates="user", foreign_keys="Role.created_by")
    
    assigned_specialties = relationship("UserSpecialty", back_populates="assigned_by_user", foreign_keys="UserSpecialty.assigned_by")
    specialty = relationship("Specialty", back_populates="user", foreign_keys="Specialty.created_by")

    course_category = relationship("CourseCategory", back_populates="user", foreign_keys="CourseCategory.created_by")
    courses = relationship("Course", back_populates="user", foreign_keys="Course.created_by")
    course_questions = relationship("CourseQuestion", back_populates="sender")

    terms = relationship("Term", back_populates="user", foreign_keys="Term.created_by")
    term_sessions = relationship("TermSession", back_populates="user", foreign_keys="TermSession.created_by")
    session_contents = relationship("SessionContent", back_populates="user", foreign_keys="SessionContent.created_by")

    classroom_locations = relationship("ClassroomLocation", back_populates="user", foreign_keys="ClassroomLocation.created_by")
    creator_classrooms = relationship("Classroom", back_populates="creator", foreign_keys="Classroom.created_by")
    teacher_classrooms = relationship("Classroom", back_populates="teacher", foreign_keys="Classroom.teacher_id")
    classroom_schedules = relationship("ClassroomSchedule", back_populates="user", foreign_keys="ClassroomSchedule.created_by")
    student_enrollments = relationship("Enrollment", back_populates="student", foreign_keys="Enrollment.student_id")
    creator_enrollments = relationship("Enrollment", back_populates="creator", foreign_keys="Enrollment.created_by")
    teacher_classroom_sessions = relationship("ClassroomSession", back_populates="teacher", foreign_keys="ClassroomSession.teacher_id")
    creator_classroom_sessions = relationship("ClassroomSession", back_populates="creator", foreign_keys="ClassroomSession.created_by")
    classroom_attendances = relationship("ClassroomAttendance", back_populates="user", foreign_keys="ClassroomAttendance.created_by")
    classroom_grades = relationship("ClassroomGrade", back_populates="user", foreign_keys="ClassroomGrade.created_by")

    files = relationship("File", back_populates="user", foreign_keys="File.uploaded_by")
    file_attachments = relationship("FileAttachment", back_populates="user", foreign_keys="FileAttachment.attached_by")

