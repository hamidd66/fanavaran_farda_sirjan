# from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.db.base import Base
# from app.enums.user import UserRole
# import uuid


# class User(Base):
#     __tablename__ = "users"

#     id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

#     national_code = Column(String(10), unique=True, index=True, nullable=False)

#     role = Column(Enum(UserRole), nullable=False)

#     password = Column(String(255), nullable=False)
#     token_version = Column(Integer, nullable=False)
#     is_active = Column(Boolean, nullable=False)

#     locked_until = Column(DateTime(timezone=True), nullable=True)
#     failed_login_count = Column(Integer, default=0, nullable=False)

#     created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
#     last_login = Column(DateTime(timezone=True), nullable=True)

#     student = relationship("Student", back_populates="user", uselist=False)
#     staff = relationship("Staff", back_populates="user", uselist=False)
#     course_faqs = relationship("CourseFAQ", back_populates="user")
#     audit_log = relationship("AuditLog", back_populates="user")


from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship, foreign
from sqlalchemy.sql import func
from sqlalchemy import and_
from app.db.base import Base
import uuid

from app.models.audit_logs import AuditLog


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

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

    audit_log_creator = relationship("AuditLog", back_populates="user")

    audit_logs = relationship(
        "AuditLog",
        primaryjoin=lambda: and_(
            User.id == foreign(AuditLog.entity_id),
            AuditLog.entity_type == "user",
        ),
        viewonly=True,
    )
