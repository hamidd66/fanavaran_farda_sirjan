from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.user import User
from app.models.specialty import Specialty
from app.models.user_specialty import UserSpecialty
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.schemas.user_specialty import BatchSpecialtiesAssignSchema


router = APIRouter(prefix="/user-specialties", tags=["User Specialties"])


@router.patch("/{user_id}")
def batch_update_user_specialties(
    user_id: UUID,
    data: BatchSpecialtiesAssignSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = UUID(payload.get("sub"))

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not db_user.person:
            raise HTTPException(status_code=404, detail="Person profile not found for this user")

        person_id = db_user.person.id

        if not data.specialties:
            raise HTTPException(status_code=400, detail="Specialties list cannot be empty")

        assign_specialty_ids = {item.specialty_id for item in data.specialties if item.action == "assign"}
        remove_specialty_ids = {item.specialty_id for item in data.specialties if item.action == "remove"}
        all_incoming_specialty_ids = list(assign_specialty_ids | remove_specialty_ids)

        existing_specialties = db.query(Specialty).filter(
            Specialty.id.in_(all_incoming_specialty_ids),
            Specialty.is_active == True
        ).all()
        name_specialties = {r.name for r in existing_specialties}
        
        valid_specialty_ids = {s.id for s in existing_specialties}
        for s_id in all_incoming_specialty_ids:
            if s_id not in valid_specialty_ids:
                raise HTTPException(status_code=400, detail=f"Specialty with ID '{s_id}' not found or inactive")

        current_user_specialties = db.query(UserSpecialty).filter(
            UserSpecialty.person_id == person_id,
            UserSpecialty.specialty_id.in_(all_incoming_specialty_ids)
        ).all()
        
        existing_specialties_map = {us.specialty_id: us for us in current_user_specialties}

        specialties_to_add = []
        specialty_ids_to_remove = []

        for item in data.specialties:
            s_id = item.specialty_id
            us_obj = existing_specialties_map.get(s_id)

            if item.action == "assign":
                if not us_obj:
                    specialties_to_add.append(
                        UserSpecialty(
                            person_id=person_id,
                            specialty_id=s_id,
                            assigned_by=admin_id
                        )
                    )
            elif item.action == "remove":
                if us_obj:
                    specialty_ids_to_remove.append(s_id)

        if specialties_to_add:
            db.add_all(specialties_to_add)

        if specialty_ids_to_remove:
            db.query(UserSpecialty).filter(
                UserSpecialty.person_id == person_id,
                UserSpecialty.specialty_id.in_(specialty_ids_to_remove)
            ).delete(synchronize_session=False)

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_user.id,
            entity_type="UserSpecialty",
            action=ActionTypes.update,
            changed_fields=["batch_specialties_update", list(name_specialties)],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message="User specialties updated successfully in batch",
            data={"user_id": user_id, "processed_count": len(data.specialties)},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update user specialties")

