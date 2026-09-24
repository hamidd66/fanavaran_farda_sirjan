from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.competition_registration import CompetitionRegistration
from app.models.competition import Competition
from app.schemas.competition_registration import (
    CompetitionRegistrationCreate,
    CompetitionRegistrationUpdate,
    CompetitionRegistrationPatch,
    CompetitionRegistrationResponse,
)

router = APIRouter(
    prefix="/competition-registrations",
    tags=["Competition Registrations"]
)


@router.get("", response_model=List[CompetitionRegistrationResponse])
def get_competition_registrations(
    competition_id: Optional[int] = None,
    national_id: Optional[str] = None,
    phone_number: Optional[str] = None,
    full_name: Optional[str] = None,
    record_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CompetitionRegistration)

    if competition_id:
        query = query.filter(CompetitionRegistration.competition_id == competition_id)
    if national_id:
        query = query.filter(CompetitionRegistration.national_id == national_id)
    if phone_number:
        query = query.filter(CompetitionRegistration.phone_number == phone_number)
    if full_name:
        query = query.filter(CompetitionRegistration.full_name.ilike(f"%{full_name}%"))
    if record_date:
        query = query.filter(CompetitionRegistration.record_date == record_date)

    return query.order_by(CompetitionRegistration.id.desc()).all()


@router.get("/{registration_id}", response_model=CompetitionRegistrationResponse)
def get_competition_registration(
    registration_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionRegistration).filter(CompetitionRegistration.id == registration_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ثبت‌نام مسابقه یافت نشد")
    return record


@router.post("", response_model=CompetitionRegistrationResponse, status_code=status.HTTP_201_CREATED)
def create_competition_registration(
    payload: CompetitionRegistrationCreate,
    db: Session = Depends(get_db)
):
    # بررسی وجود مسابقه در جدول مسابقات
    if not db.query(Competition).filter(Competition.id == payload.competition_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="مسابقه مورد نظر یافت نشد")

    new_record = CompetitionRegistration(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{registration_id}", response_model=CompetitionRegistrationResponse)
def update_competition_registration(
    registration_id: int,
    payload: CompetitionRegistrationUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionRegistration).filter(CompetitionRegistration.id == registration_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ثبت‌نام مسابقه یافت نشد")

    if payload.competition_id != record.competition_id:
        if not db.query(Competition).filter(Competition.id == payload.competition_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="مسابقه مورد نظر یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{registration_id}", response_model=CompetitionRegistrationResponse)
def patch_competition_registration(
    registration_id: int,
    payload: CompetitionRegistrationPatch,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionRegistration).filter(CompetitionRegistration.id == registration_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ثبت‌نام مسابقه یافت نشد")

    data = payload.model_dump(exclude_unset=True)

    if "competition_id" in data and data["competition_id"] != record.competition_id:
        if not db.query(Competition).filter(Competition.id == data["competition_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="مسابقه مورد نظر یافت نشد")

    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{registration_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_competition_registration(
    registration_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionRegistration).filter(CompetitionRegistration.id == registration_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="ثبت‌نام مسابقه یافت نشد")

    db.delete(record)
    db.commit()
    return None
