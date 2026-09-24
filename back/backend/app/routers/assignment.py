from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.assignment import Assignment
from app.models.course import Course
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentUpdate,
    AssignmentPatch,
    AssignmentResponse,
)

router = APIRouter(
    prefix="/assignments",
    tags=["Assignments & Projects"]
)


# ۱. لیست تکالیف با امکان فیلتر بر اساس دوره و شماره جلسه
@router.get("", response_model=List[AssignmentResponse])
def get_assignments(
    course_id: Optional[int] = None,
    session_number: Optional[int] = None,
    assignment_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)
    if course_id:
        query = query.filter(Assignment.course_id == course_id)
    if session_number:
        query = query.filter(Assignment.session_number == session_number)
    if assignment_type:
        query = query.filter(Assignment.assignment_type == assignment_type)

    return query.order_by(Assignment.session_number.asc(), Assignment.id.desc()).all()


# ۲. دریافت یک تکلیف بر اساس ID
@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تکلیف مورد نظر یافت نشد"
        )
    return assignment


# ۳. ثبت تکلیف یا پروژه جدید
@router.post("", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db)):
    # بررسی وجود دوره
    course = db.query(Course).filter(Course.id == payload.course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دوره انتخاب‌شده وجود ندارد"
        )

    new_assignment = Assignment(**payload.model_dump())
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment


# ۴. ویرایش کامل تکلیف (PUT)
@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update_assignment(assignment_id: int, payload: AssignmentUpdate, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تکلیف مورد نظر یافت نشد"
        )

    if payload.course_id != assignment.course_id:
        if not db.query(Course).filter(Course.id == payload.course_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)
    return assignment


# ۵. ویرایش جزئی تکلیف (PATCH)
@router.patch("/{assignment_id}", response_model=AssignmentResponse)
def patch_assignment(assignment_id: int, payload: AssignmentPatch, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تکلیف مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "course_id" in update_data and update_data["course_id"] != assignment.course_id:
        if not db.query(Course).filter(Course.id == update_data["course_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دوره انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(assignment, key, value)

    db.commit()
    db.refresh(assignment)
    return assignment


# ۶. حذف تکلیف (DELETE)
@router.delete("/{assignment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تکلیف مورد نظر یافت نشد"
        )

    db.delete(assignment)
    db.commit()
    return None
