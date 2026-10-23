from sqlalchemy.orm import Session, joinedload, selectinload, defaultload
from fastapi import HTTPException
from typing import Union

from app.models.user import User
from app.models.person import Person
from app.models.student_profile import StudentProfile
from app.models.staff_profile import StaffProfile
from app.models.user_role import UserRole
from app.models.role import Role

def get_user_data(db: Session, *filters, first: bool = True):

    query = db.query(User).options(
        joinedload(User.person).joinedload(Person.student_profile),
        joinedload(User.person).joinedload(Person.staff_profile),
        defaultload(User.person).selectinload(Person.file_attachments),
        selectinload(User.user_roles).selectinload(UserRole.role),
    )

    if filters:
        for filter_expr in filters:
            query = query.filter(filter_expr)

    return query.first() if first else query.all()

