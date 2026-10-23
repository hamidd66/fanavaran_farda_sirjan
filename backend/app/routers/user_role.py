from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data
from app.config.settings import settings

from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.schemas.user_role import BatchRolesAssignSchema, BatchRoleAccessSchema


router = APIRouter(prefix="/user-roles", tags=["User Roles"])


@router.patch("/{user_id}/batch-roles")
def batch_update_user_roles(
    user_id: str,
    data: BatchRolesAssignSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        if admin_id == user_id:
            raise HTTPException(status_code=400, detail="You cannot change your roles")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not db_user.person:
            raise HTTPException(status_code=404, detail="Person profile not found for this user")

        if not data.roles:
            raise HTTPException(status_code=400, detail="Roles list cannot be empty")

        assign_role_ids = {item.role_id for item in data.roles if item.action == "assign"}
        remove_role_ids = {item.role_id for item in data.roles if item.action == "remove"}
        all_incoming_role_ids = list(assign_role_ids | remove_role_ids)

        existing_roles = db.query(Role).filter(
            Role.id.in_(all_incoming_role_ids),
            Role.is_active == True
        ).all()
        name_roles = {r.name for r in existing_roles}

        if bool(name_roles & settings.STAFF_ROLES):
            if not db_user.person.staff_profile:
                raise HTTPException(status_code=400, detail="The user must first be added to the staff_profile table.")

        if bool(name_roles & settings.STUDENT_ROLES):
            if not db_user.person.student_profile:
                raise HTTPException(status_code=400, detail="The user must first be added to the student_profile table.")
    
        valid_role_ids = {r.id for r in existing_roles}
        for r_id in all_incoming_role_ids:
            if r_id not in valid_role_ids:
                raise HTTPException(status_code=400, detail=f"Role with ID '{r_id}' not found or inactive")

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

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_user.id,
            entity_type="UserRole",
            action=ActionTypes.update,
            changed_fields=["batch_roles_update", list(name_roles), "token_version"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message="User roles updated successfully in batch",
            data={"user_id": user_id, "processed_count": len(data.roles)},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update user roles")


@router.patch("/{user_id}/batch-roles-access")
def batch_update_role_access(
    user_id: str,
    data: BatchRoleAccessSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")
        
        if admin_id == user_id:
            raise HTTPException(status_code=400, detail="You cannot change your roles access status")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not data.access_items:
            raise HTTPException(status_code=400, detail="Access items list cannot be empty")

        role_ids = [item.role_id for item in data.access_items]

        user_roles = db.query(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.role_id.in_(role_ids)
        ).all()
        name_roles = {r.role.name for r in user_roles}

        user_roles_map = {ur.role_id: ur for ur in user_roles}

        for r_id in role_ids:
            if r_id not in user_roles_map:
                raise HTTPException(status_code=404, detail=f"Role with ID '{r_id}' is not assigned to this user")

        updated_count = 0

        access_dict = {item.role_id: item.is_access for item in data.access_items}

        for r_id, ur_obj in user_roles_map.items():
            new_access_status = access_dict[r_id]
            if ur_obj.is_access != new_access_status:
                ur_obj.is_access = new_access_status
                updated_count += 1

        if updated_count > 0:
            db_user.token_version += 1

            log = AuditLog(
                user_id=admin_id,
                entity_id=db_user.id,
                entity_type="UserRole",
                action=ActionTypes.update,
                changed_fields=["is_access", list(name_roles), "token_version"],
            )
            db.add(log)

            db.commit()

        return response_handler(
            status=True,
            message="Role access statuses successfully updated in batch",
            data={"user_id": user_id, "updated_items_count": updated_count},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update role access status")

