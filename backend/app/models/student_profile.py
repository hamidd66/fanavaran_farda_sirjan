# from sqlalchemy import Column, Enum, String, DateTime, Text, ForeignKey
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# import uuid

# from app.db.base import Base
# from app.enums.user import ReferralSources

# class Student(Base):
#     __tablename__ = "students"

#     id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)

#     user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

#     full_name = Column(String(100), nullable=False, index=True)
#     father_name = Column(String(50), nullable=False)
    
#     phone = Column(String(11), index=True, nullable=False)
#     parent_phone = Column(String(11), nullable=False)
#     email = Column(String(100), nullable=False, unique=True)
    
#     birth_date = Column(String(10), nullable=False)
#     education = Column(String(50), nullable=False)
#     address = Column(Text, nullable=False)
    
#     description = Column(Text, nullable=True)
#     avatar = Column(String(255), nullable=True)

#     referral_source = Column(Enum(ReferralSources), nullable=False)
    
#     created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
#     user = relationship("User", back_populates="student")
    
#     enrollments = relationship("Enrollment", back_populates="student")
#     classroom_records = relationship("ClassroomRecord", back_populates="student", cascade="all, delete-orphan")

#     assignment_submissions = relationship("AssignmentSubmission", back_populates="student", cascade="all, delete-orphan")


from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
from app.enums.student_profile import StudentEducationalStatus
import uuid


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(String, primary_key=True, index=True, nullable=False, unique=True, default=lambda: uuid.uuid4().hex)
    person_id = Column(String, ForeignKey("persons.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    educational_status = Column(Enum(StudentEducationalStatus), nullable=False)
    parent_phone = Column(String(11), nullable=False)

    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    person = relationship("Person", back_populates="student_profile")