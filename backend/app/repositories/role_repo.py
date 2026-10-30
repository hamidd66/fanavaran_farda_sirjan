from fastapi import HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.models.role import Role
from app.models.user_role import UserRole
from app.enums.user import UserRoleEnum

def get_role_by_name(db: Session, role: UserRoleEnum) -> Role:
    try:
        db_role = db.query(Role).filter(Role.name == role.value).first()

        if not db_role:
            raise HTTPException(status_code=404, detail="Role not found")

        if not db_role.is_active:
            raise HTTPException(status_code=403, detail="Role is inactive")

        return db_role

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving the role")


def get_active_roles(db: Session, user_id: UUID) -> list[str]:
    try:
        active_roles = (
            db.query(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(
                UserRole.user_id == user_id,
                UserRole.is_access.is_(True),
                Role.is_active.is_(True),
            )
            .distinct()
            .all()
        )

        return [role.name for role in active_roles]

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving the role")
