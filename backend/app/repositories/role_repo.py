from sqlalchemy.orm import Session
from uuid import UUID
import logging

from app.models.role import Role
from app.models.user_role import UserRole
from app.enums.user import UserRoleEnum
from app.core.exceptions.custom_exceptions import AppException
from app.enums.response_codes import ResponseCode

logger = logging.getLogger(__name__)


def get_role_by_name(db: Session, role: UserRoleEnum) -> Role:
    try:
        db_role = db.query(Role).filter(Role.name == role.value).first()

        if not db_role:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Role not found")

        if not db_role.is_active:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="Role is inactive")

        return db_role

    except AppException:
        raise
    except Exception as e:
        logger.exception("An unexpected error occurred while retrieving the role")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="An unexpected error occurred while retrieving the role") from e


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

    except AppException:
        raise
    except Exception as e:
        logger.exception("An unexpected error occurred while retrieving the role")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="An unexpected error occurred while retrieving the role") from e
