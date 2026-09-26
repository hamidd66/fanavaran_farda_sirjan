from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.term_grade import TermGrade
from app.schemas.term_grade import (
    TermGradeCreate,
    TermGradeUpdate,
    TermGradeResponse,
)

router = APIRouter(
    prefix="/term-grades",
    tags=["Term Grades"]
)


@router.get("", response_model=List[TermGradeResponse])
def get_all(
    classroom_id: Optional[int] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TermGrade)
    if classroom_id:
        query = query.filter(TermGrade.classroom_id == classroom_id)
    if student_id:
        query = query.filter(TermGrade.student_id == student_id)
    return query.order_by(TermGrade.id.desc()).all()


@router.get("/{id}", response_model=TermGradeResponse)
def get_by_id(
    id: int,
    db: Session = Depends(get_db)
):
    grade = db.query(TermGrade).filter(TermGrade.id == id).first()
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نمره یافت نشد"
        )
    return grade


@router.post("", response_model=TermGradeResponse, status_code=status.HTTP_201_CREATED)
def create(
    payload: TermGradeCreate,
    db: Session = Depends(get_db)
):
    new_grade = TermGrade(**payload.model_dump())
    db.add(new_grade)
    db.commit()
    db.refresh(new_grade)
    return new_grade


@router.put("/{id}", response_model=TermGradeResponse)
def update(
    id: int,
    payload: TermGradeUpdate,
    db: Session = Depends(get_db)
):
    grade = db.query(TermGrade).filter(TermGrade.id == id).first()
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نمره یافت نشد"
        )

    for key, value in payload.model_dump().items():
        setattr(grade, key, value)

    db.commit()
    db.refresh(grade)
    return grade


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    id: int,
    db: Session = Depends(get_db)
):
    grade = db.query(TermGrade).filter(TermGrade.id == id).first()
    if not grade:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="نمره یافت نشد"
        )

    db.delete(grade)
    db.commit()
    return None
