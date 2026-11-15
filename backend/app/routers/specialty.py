from uuid import UUID
from fastapi import APIRouter, Depends, Query, UploadFile, Form, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from typing import Optional
import math
import logging

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode
from app.repositories.file_repo import add_files, remove_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files

from app.models.specialty import Specialty
from app.models.user_specialty import UserSpecialty
from app.schemas.specialty import BatchSpecialtiesStatus, SpecialtyCreate, SpecialtyUpdate, SpecialtyOut
from app.enums.file import EntityType, FilePurpose
from app.schemas.file_attachment import FileAttachmentCreate

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/specialties", tags=["Specialties"])


@router.post("/")
async def create_specialty(
    data: str = Form(..., description='{"name": "", "description": "", "is_active": true}'),
    image: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(auth["payload"]["sub"])

        specialty_data = SpecialtyCreate.model_validate_json(data)

        existing_specialty = db.query(Specialty).filter(Specialty.name == specialty_data.name, Specialty.deleted_at.is_(None)).first()
        if existing_specialty:
            raise AppException(code=ResponseCode.RESOURCE_ALREADY_EXISTS, message="Specialty with this name already exists")

        new_specialty = Specialty(
            name=specialty_data.name,
            description=specialty_data.description,
            is_active=specialty_data.is_active,
            created_by=admin_id
        )
        db.add(new_specialty)
        db.flush()

        if image:
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
                entity_id=new_specialty.id,
                entity_type=EntityType.specialties,
                folder_name="specialties",
                files=[image],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(new_specialty)
        confirm_pending_uploads(db)

        return success_response(
            code=ResponseCode.CREATED,
            message="Specialty successfully created",
            data=SpecialtyOut.model_validate(new_specialty).model_dump(),
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
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Specialty data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to create specialty")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to create specialty") from e


@router.get("/")
def get_specialties_list(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    is_active: Optional[bool] = None,
):
    try:
        query = db.query(Specialty).filter(Specialty.deleted_at.is_(None))

        if is_active is not None:
            query = query.filter(Specialty.is_active == is_active)

        total_count = query.count()
        specialties = query.offset((page - 1) * limit).limit(limit).all()

        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Specialties retrieved successfully",
            data={
                "items": [
                    SpecialtyOut.model_validate(s).model_dump()
                    for s in specialties
                ],
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )

    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to retrieve specialties list")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to retrieve specialties list") from e


@router.patch("/batch-active")
def batch_update_specialties_status(
    data: BatchSpecialtiesStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        if not data.items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list cannot be empty")

        specialty_ids = [item.specialty_id for item in data.items]

        specialties = db.query(Specialty).filter(Specialty.id.in_(specialty_ids)).all()
        specialties_map = {s.id: s for s in specialties}

        for s_id in specialty_ids:
            if s_id not in specialties_map:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message=f"Specialty with ID '{s_id}' not found")

        updated_count = 0
        status_dict = {item.specialty_id: item.is_active for item in data.items}

        for s_id, specialty_obj in specialties_map.items():
            new_status = status_dict[s_id]
            if specialty_obj.is_active != new_status:
                specialty_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="Specialties status successfully updated in batch",
            data={"updated_count": updated_count},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to batch update specialties status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="") from e


@router.patch("/{specialty_id}")
async def update_specialty(
    specialty_id: UUID,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = auth["payload"]["sub"]

        db_specialty = db.query(Specialty).filter(Specialty.id == specialty_id, Specialty.deleted_at.is_(None)).first()
        if not db_specialty:
            raise AppException(code=ResponseCode.SPECIALTY_NOT_FOUND, message="Specialty not found")


        specialty_data = SpecialtyUpdate.model_validate_json(data).model_dump(exclude_unset=True)

        if not specialty_data and not image:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")

        if "name" in specialty_data and specialty_data["name"] != db_specialty.name:
            existing = db.query(Specialty).filter(Specialty.name == specialty_data["name"], Specialty.deleted_at.is_(None)).first()
            if existing:
                raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Specialty with this name already exists")

        for field, value in specialty_data.items():
            setattr(db_specialty, field, value)

        deleted_paths = []

        if image:
            deleted_attachment_ids = [file_att.id for file_att in db_specialty.file_attachments if file_att.purpose == "image"]
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
                entity_id=specialty_id,
                entity_type=EntityType.specialties,
                folder_name="specialties",
                files=[image],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(db_specialty)
        confirm_pending_uploads(db)

        if image and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Specialty successfully updated",
            data=SpecialtyOut.model_validate(db_specialty).model_dump(),
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
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Specialty data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to update specialty")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update specialty") from e


@router.delete("/{specialty_id}")
def delete_specialty(
    specialty_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        db_specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
        if not db_specialty:
            raise AppException(code=ResponseCode.SPECIALTY_NOT_FOUND, message="Specialty not found")

        is_assigned = db.query(UserSpecialty).filter(UserSpecialty.specialty_id == specialty_id).first()
        if is_assigned:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Cannot delete specialty because it is assigned to one or more users.")

        is_image = False
        deleted_paths = []

        if db_specialty.file_attachments:
            is_image = True
            
            deleted_attachment_ids = [file_att.id for file_att in db_specialty.file_attachments if file_att.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        db.delete(db_specialty)
        db.commit()

        if is_image and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.DELETED,
            message="Specialty successfully deleted",
            data={"id": specialty_id},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete specialty")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to delete specialty") from e

