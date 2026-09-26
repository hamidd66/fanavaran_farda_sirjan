from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.poll_question import PollQuestion
from app.schemas.poll_question import (
    PollQuestionCreate,
    PollQuestionUpdate,
    PollQuestionPatch,
    PollQuestionResponse,
)

router = APIRouter(
    prefix="/poll-questions",
    tags=["Poll Questions"]
)


@router.get("", response_model=List[PollQuestionResponse])
def get_poll_questions(
    subject: Optional[str] = None,
    poll_type: Optional[str] = None,
    is_published: Optional[bool] = None,
    record_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PollQuestion)

    if subject:
        query = query.filter(PollQuestion.subject.ilike(f"%{subject}%"))
    if poll_type:
        query = query.filter(PollQuestion.poll_type == poll_type)
    if is_published is not None:
        query = query.filter(PollQuestion.is_published == is_published)
    if record_date:
        query = query.filter(PollQuestion.record_date == record_date)

    return query.order_by(PollQuestion.id.desc()).all()


@router.get("/{question_id}", response_model=PollQuestionResponse)
def get_poll_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(PollQuestion).filter(PollQuestion.id == question_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="سوال نظرسنجی یافت نشد")
    return record


@router.post("", response_model=PollQuestionResponse, status_code=status.HTTP_201_CREATED)
def create_poll_question(
    payload: PollQuestionCreate,
    db: Session = Depends(get_db)
):
    new_record = PollQuestion(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{question_id}", response_model=PollQuestionResponse)
def update_poll_question(
    question_id: int,
    payload: PollQuestionUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(PollQuestion).filter(PollQuestion.id == question_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="سوال نظرسنجی یافت نشد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{question_id}", response_model=PollQuestionResponse)
def patch_poll_question(
    question_id: int,
    payload: PollQuestionPatch,
    db: Session = Depends(get_db)
):
    record = db.query(PollQuestion).filter(PollQuestion.id == question_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="سوال نظرسنجی یافت نشد")

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_poll_question(
    question_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(PollQuestion).filter(PollQuestion.id == question_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="سوال نظرسنجی یافت نشد")

    db.delete(record)
    db.commit()
    return None
