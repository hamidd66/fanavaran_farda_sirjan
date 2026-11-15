from uuid import UUID
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from sqlalchemy import or_
from typing import Optional
import math
import logging

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.repositories.file_repo import add_files, remove_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files
from app.enums.response_codes import ResponseCode

from app.models.role import Role
from app.enums.file import FilePurpose, EntityType
from app.schemas.role import BatchRolesStatusSchema, UpdateRoleSchema, RoleOut
from app.schemas.file_attachment import FileAttachmentCreate

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/roles", tags=["Roles"])


@router.patch("/batch-status")
def batch_update_roles_status(
    data: BatchRolesStatusSchema,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        if not data.items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list cannot be empty")

        role_ids = [item.role_id for item in data.items]

        roles = db.query(Role).filter(Role.id.in_(role_ids)).all()
        roles_map = {r.id: r for r in roles}

        for r_id in role_ids:
            if r_id not in roles_map:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message=f"Role with ID '{r_id}' not found")

        updated_count = 0
        status_dict = {item.role_id: item.is_active for item in data.items}

        for r_id, role_obj in roles_map.items():
            new_status = status_dict[r_id]
            if role_obj.is_active != new_status:
                role_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="Roles status successfully updated in batch",
            data={"updated_count": updated_count},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to batch update roles status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to batch update roles status") from e


@router.patch("/{role_id}")
async def update_role_info(
    role_id: UUID,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = auth["payload"]["sub"]

        db_role = db.query(Role).filter(Role.id == role_id).first()
        if not db_role:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Role not found")

        update_data = UpdateRoleSchema.model_validate_json(data).model_dump(exclude_unset=True)

        if not update_data and not image:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")


        for field, value in update_data.items():
            if hasattr(db_role, field):
                setattr(db_role, field, value)

        deleted_paths = []

        if image:
            deleted_attachment_ids = [file_att.id for file_att in db_role.file_attachments if file_att.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.thumbnail,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=role_id,
                entity_type=EntityType.roles,
                folder_name="roles",
                files=[image],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(db_role)
        confirm_pending_uploads(db)

        if image and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Role successfully updated",
            data=RoleOut.model_validate(db_role).model_dump(),
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Role data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to update role")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update role") from e


@router.get("/")
def get_roles(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles("admin")),
    is_active: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
):
    try:
        
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
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Roles retrieved successfully",
            data={
                "roles": roles_list,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch roles")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch roles") from e

