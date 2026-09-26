from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.competition import Competition
from app.schemas.competition import (
    CompetitionCreate,
    CompetitionUpdate,
    CompetitionPatch,
    CompetitionResponse,
)

router = APIRouter(
    prefix="/competitions",
    tags=["Competitions"]
)


@router.get("", response_model=List[CompetitionResponse])
def get_competitions(
    title: Optional[str] = None,
    specialty: Optional[str] = None,
    event_date: Optional[str] = None,
    recorded_by: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Competition)

    if title:
        query = query.filter(Competition.title.ilike(f"%{title}%"))
    if specialty:
        query = query.filter(Competition.specialty.ilike(f"%{specialty}%"))
    if event_date:
        query = query.filter(Competition.event_date == event_date)
    if recorded_by:
        query = query.filter(Competition.recorded_by.ilike(f"%{recorded_by}%"))

    return query.order_by(Competition.id.desc()).all()


@router.get("/{competition_id}", response_model=CompetitionResponse)
def get_competition(
    competition_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Competition).filter(Competition.id == competition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="مسابقه مورد نظر یافت نشد")
    return record


@router.post("", response_model=CompetitionResponse, status_code=status.HTTP_201_CREATED)
def create_competition(
    payload: CompetitionCreate,
    db: Session = Depends(get_db)
):
    new_record = Competition(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{competition_id}", response_model=CompetitionResponse)
def update_competition(
    competition_id: int,
    payload: CompetitionUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(Competition).filter(Competition.id == competition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="مسابقه مورد نظر یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{competition_id}", response_model=CompetitionResponse)
def patch_competition(
    competition_id: int,
    payload: CompetitionPatch,
    db: Session = Depends(get_db)
):
    record = db.query(Competition).filter(Competition.id == competition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="مسابقه مورد نظر یافت نشد")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{competition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_competition(
    competition_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Competition).filter(Competition.id == competition_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="مسابقه مورد نظر یافت نشد")

    db.delete(record)
    db.commit()
    return None
