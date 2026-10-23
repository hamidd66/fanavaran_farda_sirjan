from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.role import Role
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
        # db.rollback()
        raise
    except Exception:
        # db.rollback()
        raise HTTPException(status_code=500, detail="An unexpected error occurred while retrieving the role")