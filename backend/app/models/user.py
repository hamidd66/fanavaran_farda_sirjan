from sqlalchemy import Column, Integer, String, Boolean, DateTime, text, func, and_
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base
from app.models.audit_logs import AuditLog


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))

    national_code = Column(String(10), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    token_version = Column(Integer, nullable=False, default=1)
    locked_until = Column(DateTime(timezone=True), nullable=True)
    failed_login_count = Column(Integer, nullable=False, default=0)
    is_deleted = Column(Boolean, nullable=False, default=False)

    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    person = relationship("Person", back_populates="user", uselist=False, cascade="all, delete-orphan")

    user_roles = relationship("UserRole", back_populates="user", foreign_keys="UserRole.user_id", cascade="all, delete-orphan")
    assigned_roles = relationship("UserRole", back_populates="assigned_by_user", foreign_keys="UserRole.assigned_by")
    role = relationship("Role", back_populates="user", foreign_keys="Role.created_by")
    
    assigned_specialties = relationship("UserSpecialty", back_populates="assigned_by_user", foreign_keys="UserSpecialty.assigned_by")
    specialty = relationship("Specialty", back_populates="user", foreign_keys="Specialty.created_by")

    course_category = relationship("CourseCategory", back_populates="user", foreign_keys="CourseCategory.created_by")
    course = relationship("Course", back_populates="user", foreign_keys="Course.created_by")

    audit_log_creator = relationship("AuditLog", back_populates="user")

    audit_logs = relationship(
        "AuditLog",
        primaryjoin=lambda: and_(
            User.id == foreign(AuditLog.entity_id),
            AuditLog.entity_type == "users",
        ),
        viewonly=True,
    )
