from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.suggestion import Suggestion
from app.schemas.suggestion import (
    SuggestionCreate,
    SuggestionUpdate,
    SuggestionPatch,
    SuggestionResponse,
)

router = APIRouter(
    prefix="/suggestions",
    tags=["Suggestions"]
)


@router.get("", response_model=List[SuggestionResponse])
def get_suggestions(
    subject: Optional[str] = None,
    is_published: Optional[bool] = None,
    phone_number: Optional[str] = None,
    record_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Suggestion)

    if subject:
        query = query.filter(Suggestion.subject.ilike(f"%{subject}%"))
    if is_published is not None:
        query = query.filter(Suggestion.is_published == is_published)
    if phone_number:
        query = query.filter(Suggestion.phone_number == phone_number)
    if record_date:
        query = query.filter(Suggestion.record_date == record_date)

    return query.order_by(Suggestion.id.desc()).all()


@router.get("/{suggestion_id}", response_model=SuggestionResponse)
def get_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پیشنهاد/نظر مورد نظر یافت نشد")
    return record


@router.post("", response_model=SuggestionResponse, status_code=status.HTTP_201_CREATED)
def create_suggestion(
    payload: SuggestionCreate,
    db: Session = Depends(get_db)
):
    new_record = Suggestion(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{suggestion_id}", response_model=SuggestionResponse)
def update_suggestion(
    suggestion_id: int,
    payload: SuggestionUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پیشنهاد/نظر مورد نظر یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{suggestion_id}", response_model=SuggestionResponse)
def patch_suggestion(
    suggestion_id: int,
    payload: SuggestionPatch,
    db: Session = Depends(get_db)
):
    record = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پیشنهاد/نظر مورد نظر یافت نشد")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{suggestion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_suggestion(
    suggestion_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(Suggestion).filter(Suggestion.id == suggestion_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پیشنهاد/نظر مورد نظر یافت نشد")

    db.delete(record)
    db.commit()
    return None
