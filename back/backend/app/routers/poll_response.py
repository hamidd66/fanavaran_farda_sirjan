from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.poll_response import PollResponse
from app.models.poll_question import PollQuestion
from app.schemas.poll_response import (
    PollResponseCreate,
    PollResponseUpdate,
    PollResponsePatch,
    PollResponseOut,
)

router = APIRouter(
    prefix="/poll-responses",
    tags=["Poll Responses"]
)


@router.get("", response_model=List[PollResponseOut])
def get_poll_responses(
    poll_question_id: Optional[int] = None,
    user_name: Optional[str] = None,
    record_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(PollResponse)

    if poll_question_id:
        query = query.filter(PollResponse.poll_question_id == poll_question_id)
    if user_name:
        query = query.filter(PollResponse.user_name.ilike(f"%{user_name}%"))
    if record_date:
        query = query.filter(PollResponse.record_date == record_date)

    return query.order_by(PollResponse.id.desc()).all()


@router.get("/{response_id}", response_model=PollResponseOut)
def get_poll_response(
    response_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(PollResponse).filter(PollResponse.id == response_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پاسخ نظرسنجی یافت نشد")
    return record


@router.post("", response_model=PollResponseOut, status_code=status.HTTP_201_CREATED)
def create_poll_response(
    payload: PollResponseCreate,
    db: Session = Depends(get_db)
):
    # بررسی وجود سوال نظرسنجی
    question = db.query(PollQuestion).filter(PollQuestion.id == payload.poll_question_id).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="سوال نظرسنجی با این شناسه وجود ندارد")

    new_record = PollResponse(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{response_id}", response_model=PollResponseOut)
def update_poll_response(
    response_id: int,
    payload: PollResponseUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(PollResponse).filter(PollResponse.id == response_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پاسخ نظرسنجی یافت نشد")

    if payload.poll_question_id != record.poll_question_id:
        question = db.query(PollQuestion).filter(PollQuestion.id == payload.poll_question_id).first()
        if not question:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="سوال نظرسنجی با این شناسه وجود ندارد")

    for field, value in payload.model_dump().items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.patch("/{response_id}", response_model=PollResponseOut)
def patch_poll_response(
    response_id: int,
    payload: PollResponsePatch,
    db: Session = Depends(get_db)
):
    record = db.query(PollResponse).filter(PollResponse.id == response_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پاسخ نظرسنجی یافت نشد")

    data = payload.model_dump(exclude_unset=True)

    if "poll_question_id" in data and data["poll_question_id"] != record.poll_question_id:
        question = db.query(PollQuestion).filter(PollQuestion.id == data["poll_question_id"]).first()
        if not question:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="سوال نظرسنجی با این شناسه وجود ندارد")

    for field, value in data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{response_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_poll_response(
    response_id: int,
    db: Session = Depends(get_db)
):
    record = db.query(PollResponse).filter(PollResponse.id == response_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="پاسخ نظرسنجی یافت نشد")

    db.delete(record)
    db.commit()
    return None
