from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, Form, File
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.file_repo import add_files, remove_files
from app.utils.delete_file import delete_files

from app.models.specialty import Specialty
from app.models.user_specialty import UserSpecialty
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.schemas.specialty import BatchSpecialtiesStatus, SpecialtyCreate, SpecialtyUpdate, SpecialtyOut


router = APIRouter(prefix="/specialties", tags=["Specialties"])


@router.post("/")
async def create_specialty(
    data: str = Form(..., description='{"name": "", "description": "", "is_active": true}'),
    image: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(payload.get("sub"))

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        specialty_data = SpecialtyCreate.model_validate_json(data)

        existing_specialty = db.query(Specialty).filter(Specialty.name == specialty_data.name).first()
        if existing_specialty:
            raise HTTPException(status_code=409, detail="Specialty with this name already exists")

        new_specialty = Specialty(
            name=specialty_data.name,
            description=specialty_data.description,
            is_active=specialty_data.is_active,
            created_by=admin_id
        )
        db.add(new_specialty)
        db.flush()

        log = AuditLog(
            user_id=admin_id,
            entity_id=new_specialty.id,
            entity_type="Specialty",
            action=ActionTypes.create,
            changed_fields=["name", "description", "is_active"],
        )
        db.add(log)

        if image:
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_specialty.id,
                entity_type="specialties",
                purpose="image",
                files=[image],
                display_order=[1]
            )

        db.commit()
        db.refresh(new_specialty)

        return response_handler(
            status=True,
            message="Specialty successfully created",
            data=SpecialtyOut.model_validate(new_specialty).model_dump(),
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Specialty data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create specialty")


@router.get("/")
def get_specialties_list(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    is_active: Optional[bool] = None,
):
    try:
        query = db.query(Specialty)

        if is_active is not None:
            query = query.filter(Specialty.is_active == is_active)

        total_count = query.count()
        specialties = query.offset((page - 1) * limit).limit(limit).all()

        return response_handler(
            status=True,
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
            status_code=200
        )

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve specialties list")


@router.patch("/batch-active")
def batch_update_specialties_status(
    data: BatchSpecialtiesStatus,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(payload.get("sub"))

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        if not data.items:
            raise HTTPException(status_code=400, detail="Items list cannot be empty")

        specialty_ids = [item.specialty_id for item in data.items]

        specialties = db.query(Specialty).filter(Specialty.id.in_(specialty_ids)).all()
        specialties_map = {s.id: s for s in specialties}
        name_specialties = {s.name for s in specialties}

        for s_id in specialty_ids:
            if s_id not in specialties_map:
                raise HTTPException(status_code=404, detail=f"Specialty with ID '{s_id}' not found")

        updated_count = 0
        status_dict = {item.specialty_id: item.is_active for item in data.items}

        for s_id, specialty_obj in specialties_map.items():
            new_status = status_dict[s_id]
            if specialty_obj.is_active != new_status:
                specialty_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            log = AuditLog(
                user_id=admin_id,
                entity_id=0,
                entity_type="Specialty",
                action=ActionTypes.update,
                changed_fields=["batch_is_active_update", list(name_specialties)],
            )
            db.add(log)
            db.commit()

        return response_handler(
            status=True,
            message="Specialties status successfully updated in batch",
            data={"updated_count": updated_count},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update specialties status")


@router.patch("/{specialty_id}")
async def update_specialty(
    specialty_id: UUID,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
        if not db_specialty:
            raise HTTPException(status_code=404, detail="Specialty not found")

        specialty_data = SpecialtyUpdate.model_validate_json(data).model_dump(exclude_unset=True)

        if not specialty_data and not image:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "name" in specialty_data and specialty_data["name"] != db_specialty.name:
            existing = db.query(Specialty).filter(Specialty.name == specialty_data["name"]).first()
            if existing:
                raise HTTPException(status_code=409, detail="Specialty with this name already exists")

        changed_fields = []

        for field, value in specialty_data.items():
            setattr(db_specialty, field, value)
            changed_fields.append(field)

        deleted_paths = []

        if image:
            changed_fields.append("image")

            deleted_attachment_ids = [file_att.id for file_att in db_specialty.file_attachments if file_att.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=specialty_id,
                entity_type="specialties",
                purpose="image",
                files=[image],
                display_order=[1]
            )

        if changed_fields:
            log = AuditLog(
                user_id=admin_id,
                entity_id=db_specialty.id,
                entity_type="Specialty",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_specialty)

        if image and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Specialty successfully updated",
            data=SpecialtyOut.model_validate(db_specialty).model_dump(),
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
        raise HTTPException(status_code=409, detail="Specialty data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update specialty")


@router.delete("/{specialty_id}")
def delete_specialty(
    specialty_id: UUID,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_specialty = db.query(Specialty).filter(Specialty.id == specialty_id).first()
        if not db_specialty:
            raise HTTPException(status_code=404, detail="Specialty not found")

        is_assigned = db.query(UserSpecialty).filter(UserSpecialty.specialty_id == specialty_id).first()
        if is_assigned:
            raise HTTPException(status_code=400, detail="Cannot delete specialty because it is assigned to one or more users.")

        is_image = False
        deleted_paths = []

        if db_specialty.file_attachments:
            is_image = True
            
            deleted_attachment_ids = [file_att.id for file_att in db_specialty.file_attachments if file_att.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        db.delete(db_specialty)

        log = AuditLog(
            user_id=admin_id,
            entity_id=specialty_id,
            entity_type="Specialty",
            action=ActionTypes.delete,
            changed_fields=["deleted", db_specialty.name],
        )
        db.add(log)

        db.commit()

        if is_image and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Specialty successfully deleted",
            data={"id": specialty_id},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete specialty")

