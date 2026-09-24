from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.student_assignment_upload import StudentAssignmentUpload
from app.models.assignment import Assignment # فرض بر وجود مدل Assignment
from app.schemas.student_assignment_upload import (
    StudentAssignmentUploadCreate,
    StudentAssignmentUploadUpdate,
    StudentAssignmentUploadResponse,
)

router = APIRouter(
    prefix="/student-assignment-uploads",
    tags=["Student Assignment Uploads"]
)

@router.get("", response_model=List[StudentAssignmentUploadResponse])
def get_all(db: Session = Depends(get_db)):
    return db.query(StudentAssignmentUpload).all()

@router.post("", response_model=StudentAssignmentUploadResponse, status_code=status.HTTP_201_CREATED)
def create(payload: StudentAssignmentUploadCreate, db: Session = Depends(get_db)):
    # بررسی وجود تکلیف
    if not db.query(Assignment).filter(Assignment.id == payload.assignment_id).first():
        raise HTTPException(status_code=400, detail="تکلیف یافت نشد")
        
    new_record = StudentAssignmentUpload(**payload.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db)):
    record = db.query(StudentAssignmentUpload).filter(StudentAssignmentUpload.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="رکورد یافت نشد")
    db.delete(record)
    db.commit()
    return None
