from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from sqlalchemy import or_
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.file_repo import add_files, remove_files
from app.utils.delete_file import delete_files

from app.models.role import Role
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.schemas.role import BatchRolesStatusSchema, UpdateRoleSchema, RoleOut


router = APIRouter(prefix="/roles", tags=["Roles"])


@router.patch("/batch-status")
def batch_update_roles_status(
    data: BatchRolesStatusSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        if not data.items:
            raise HTTPException(status_code=400, detail="Items list cannot be empty")

        role_ids = [item.role_id for item in data.items]

        roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
        roles_map = {r.id: r for r in roles}

        for r_id in role_ids:
            if r_id not in roles_map:
                raise HTTPException(status_code=404, detail=f"Role with ID '{r_id}' not found")

        updated_count = 0
        status_dict = {item.role_id: item.is_active for item in data.items}

        for r_id, role_obj in roles_map.items():
            new_status = status_dict[r_id]
            if role_obj.is_active != new_status:
                role_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            log = AuditLog(
                user_id=admin_id,
                entity_id=0,
                entity_type="Role",
                action=ActionTypes.update,
                changed_fields=["batch_is_active_update"],
            )
            db.add(log)

            db.commit()

        return response_handler(
            status=True,
            message="Roles status successfully updated in batch",
            data={"updated_count": updated_count},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update roles status")


@router.patch("/{role_id}")
async def update_role_info(
    role_id: str,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_role = db.query(Role).filter(Role.id == role_id).first()
        if not db_role:
            raise HTTPException(status_code=404, detail="Role not found")

        update_data = UpdateRoleSchema.model_validate_json(data).model_dump(exclude_unset=True)

        if not update_data and not image:
            raise HTTPException(status_code=400, detail="No fields to update")

        changed_fields = []

        for field, value in update_data.items():
            if hasattr(db_role, field):
                setattr(db_role, field, value)
                changed_fields.append(field)

        deleted_paths = []

        if image:
            changed_fields.append("image")

            deleted_attachment_ids = [file_att.id for file_att in db_role.file_attachments if file_att.purpose == "image"]
            if deleted_attachment_ids:
                _, _, deleted_paths = remove_files(
                    db=db,
                    attachment_ids=deleted_attachment_ids
                )

            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=role_id,
                entity_type="roles",
                purpose="image",
                files=[image],
                display_order=[1]
            )

        if changed_fields:
            log = AuditLog(
                user_id=admin_id,
                entity_id=db_role.id,
                entity_type="Role",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_role)

        if image and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Role successfully updated",
            data=RoleOut.model_validate(db_role).model_dump(),
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Role data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update role")


@router.get("/")
def get_roles(
    db: Session = Depends(get_db),
    payload: dict = Depends(get_payload),
    is_active: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")
        
        query = db.query(Role)
        
        if is_active is not None:
            query = query.filter(Role.is_active == is_active)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Role.name.ilike(search_term),
                    Role.title.ilike(search_term),
                )
            )
        
        query = query.order_by(Role.created_at.desc())
        
        total_count = query.count()
        roles = query.offset((page - 1) * limit).limit(limit).all()
        
        roles_list = [RoleOut.model_validate(r).model_dump() for r in roles]
        
        return response_handler(
            status=True,
            message="Roles retrieved successfully",
            data={
                "roles": roles_list,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch roles")

