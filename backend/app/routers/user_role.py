from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode
from app.repositories.user_repo import get_user_data

from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.enums.user import UserRoleEnum
from app.schemas.user_role import UserRolesActionUpdate, UserRolesAccessUpdate

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/user-roles", tags=["User Roles"])


@router.patch("/{user_id}/batch-roles")
def batch_update_user_roles(
    user_id: UUID,
    data: UserRolesActionUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        if admin_id == user_id:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="You cannot change your roles")

        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if not db_user.person:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Person profile not found for this user")

        if not data.roles:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Roles list cannot be empty")

        assign_role_ids = {item.role_id for item in data.roles if item.action == "assign"}
        remove_role_ids = {item.role_id for item in data.roles if item.action == "remove"}
        all_incoming_role_ids = list(assign_role_ids | remove_role_ids)

        existing_roles = db.query(Role).filter(
            Role.id.in_(all_incoming_role_ids),
            Role.is_active.is_(True)
        ).all()
        name_roles = {r.name for r in existing_roles}

        if name_roles & {UserRoleEnum.admin.value, UserRoleEnum.teacher.value}:
            if not db_user.person.staff_profile:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="The user must first be added to the staff_profile table.")

        if UserRoleEnum.student.value in name_roles:
            if not db_user.person.student_profile:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="The user must first be added to the student_profile table.")
    
        valid_role_ids = {r.id for r in existing_roles}
        for r_id in all_incoming_role_ids:
            if r_id not in valid_role_ids:
                raise AppException(code=ResponseCode.BAD_REQUEST, message=f"Role with ID '{r_id}' not found or inactive")

        current_user_roles = db.query(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.role_id.in_(all_incoming_role_ids)
        ).all()
        
        existing_roles_map = {ur.role_id: ur for ur in current_user_roles}

        roles_to_add = []
        role_ids_to_remove = []

        for item in data.roles:
            r_id = item.role_id
            ur_obj = existing_roles_map.get(r_id)

            if item.action == "assign":
                if not ur_obj:
                    roles_to_add.append(
                        UserRole(
                            user_id=user_id,
                            role_id=r_id,
                            assigned_by=admin_id,
                            is_access=True
                        )
                    )

            elif item.action == "remove":
                if ur_obj:
                    role_ids_to_remove.append(r_id)

        if roles_to_add:
            db.add_all(roles_to_add)

        if role_ids_to_remove:
            db.query(UserRole).filter(
                UserRole.user_id == user_id,
                UserRole.role_id.in_(role_ids_to_remove)
            ).delete(synchronize_session=False)

        db_user.token_version += 1

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="User roles updated successfully in batch",
            data={"user_id": user_id, "processed_count": len(data.roles)},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to batch update user roles")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to batch update user roles") from e


@router.patch("/{user_id}/batch-roles-access")
def batch_update_role_access(
    user_id: UUID,
    data: UserRolesAccessUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(auth["payload"]["sub"])
        
        if admin_id == user_id:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="You cannot change your roles access status")

        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if not data.access_items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Access items list cannot be empty")

        role_ids = [item.role_id for item in data.access_items]

        user_roles = db.query(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.role_id.in_(role_ids)
        ).all()

        user_roles_map = {ur.role_id: ur for ur in user_roles}

        for r_id in role_ids:
            if r_id not in user_roles_map:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message=f"Role with ID '{r_id}' is not assigned to this user")

        updated_count = 0

        access_dict = {item.role_id: item.is_access for item in data.access_items}

        for r_id, ur_obj in user_roles_map.items():
            new_access_status = access_dict[r_id]
            if ur_obj.is_access != new_access_status:
                ur_obj.is_access = new_access_status
                updated_count += 1

        if updated_count > 0:
            db_user.token_version += 1

            db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="Role access statuses successfully updated in batch",
            data={"user_id": user_id, "updated_items_count": updated_count},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to batch update role access status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to batch update role access status") from e

