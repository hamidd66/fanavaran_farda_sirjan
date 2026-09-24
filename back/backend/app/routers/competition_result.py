from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.competition_result import CompetitionResult
from app.models.competition import Competition
from app.schemas.competition_result import (
    CompetitionResultCreate,
    CompetitionResultUpdate,
    CompetitionResultPatch,
    CompetitionResultResponse,
)

router = APIRouter(
    prefix="/competition-results",
    tags=["Competition Results"]
)


@router.get("", response_model=List[CompetitionResultResponse])
def get_competition_results(
    competition_id: Optional[int] = None,
    student_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CompetitionResult)
    if competition_id:
        query = query.filter(CompetitionResult.competition_id == competition_id)
    if student_name:
        query = query.filter(CompetitionResult.student_name.ilike(f"%{student_name}%"))
    return query.order_by(CompetitionResult.id.desc()).all()


@router.post("", response_model=CompetitionResultResponse, status_code=status.HTTP_201_CREATED)
def create_competition_result(
    payload: CompetitionResultCreate,
    db: Session = Depends(get_db)
):
    # چک کردن وجود مسابقه
    if not db.query(Competition).filter(Competition.id == payload.competition_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="مسابقه یافت نشد")

    new_record = CompetitionResult(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{result_id}", response_model=CompetitionResultResponse)
def update_competition_result(
    result_id: int,
    payload: CompetitionResultUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionResult).filter(CompetitionResult.id == result_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نتیجه مسابقه یافت نشد")
    
    # اگر ID مسابقه تغییر کرد، اعتبار سنجی جدید انجام شود
    if payload.competition_id != record.competition_id:
        if not db.query(Competition).filter(Competition.id == payload.competition_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="مسابقه جدید یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_competition_result(
    result_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(CompetitionResult).filter(CompetitionResult.id == result_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="نتیجه مسابقه یافت نشد")
    db.delete(record)
    db.commit()
    return None
