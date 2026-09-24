from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.assignment_feedback import AssignmentFeedback
from app.schemas.assignment_feedback import (
    AssignmentFeedbackCreate,
    AssignmentFeedbackUpdate,
    AssignmentFeedbackResponse,
)

router = APIRouter(
    prefix="/assignment-feedbacks",
    tags=["Assignment Feedbacks"]
)


@router.get("", response_model=List[AssignmentFeedbackResponse])
def get_all(
    student_id: Optional[int] = None,
    assignment_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AssignmentFeedback)
    if student_id:
        query = query.filter(AssignmentFeedback.student_id == student_id)
    if assignment_id:
        query = query.filter(AssignmentFeedback.assignment_id == assignment_id)
    return query.order_by(AssignmentFeedback.id.desc()).all()


@router.get("/{id}", response_model=AssignmentFeedbackResponse)
def get_by_id(
    id: int,
    db: Session = Depends(get_db)
):
    record = db.query(AssignmentFeedback).filter(AssignmentFeedback.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="بازخورد تکلیف یافت نشد"
        )
    return record


@router.post("", response_model=AssignmentFeedbackResponse, status_code=status.HTTP_201_CREATED)
def create(
    payload: AssignmentFeedbackCreate,
    db: Session = Depends(get_db)
):
    new_record = AssignmentFeedback(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.put("/{id}", response_model=AssignmentFeedbackResponse)
def update(
    id: int,
    payload: AssignmentFeedbackUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(AssignmentFeedback).filter(AssignmentFeedback.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="بازخورد تکلیف یافت نشد"
        )

    for key, value in payload.model_dump().items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    id: int,
    db: Session = Depends(get_db)
):
    record = db.query(AssignmentFeedback).filter(AssignmentFeedback.id == id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="بازخورد تکلیف یافت نشد"
        )

    db.delete(record)
    db.commit()
    return None
