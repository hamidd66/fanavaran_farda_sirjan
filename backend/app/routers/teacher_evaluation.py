from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.models.teacher_evaluation import TeacherEvaluation
from app.models.classroom import ClassRoom
from app.models.staff import Staff
from app.models.student import Student
from app.schemas.teacher_evaluation import (
    TeacherEvaluationCreate,
    TeacherEvaluationUpdate,
    TeacherEvaluationPatch,
    TeacherEvaluationResponse,
)

router = APIRouter(
    prefix="/teacher-evaluations",
    tags=["Teacher Evaluations"]
)


# ۱. دریافت لیست نظرسنجی‌های اساتید
@router.get("", response_model=List[TeacherEvaluationResponse])
def get_teacher_evaluations(
    classroom_id: Optional[int] = None,
    teacher_id: Optional[int] = None,
    student_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(TeacherEvaluation)
    if classroom_id:
        query = query.filter(TeacherEvaluation.classroom_id == classroom_id)
    if teacher_id:
        query = query.filter(TeacherEvaluation.teacher_id == teacher_id)
    if student_id:
        query = query.filter(TeacherEvaluation.student_id == student_id)

    return query.order_by(TeacherEvaluation.id.desc()).all()


# ۲. دریافت یک نظر ارزیابی با ID
@router.get("/{evaluation_id}", response_model=TeacherEvaluationResponse)
def get_teacher_evaluation(evaluation_id: int, db: Session = Depends(get_db)):

    eval_record = db.query(TeacherEvaluation).filter(TeacherEvaluation.id == evaluation_id).first()
    if not eval_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ارزیابی مورد نظر یافت نشد"
        )
    return eval_record


# ۳. ثبت نظر ارزیابی استاد
@router.post("", response_model=TeacherEvaluationResponse, status_code=status.HTTP_201_CREATED)
def create_teacher_evaluation(payload: TeacherEvaluationCreate, db: Session = Depends(get_db)):


    # ۱. اعتبارسنجی وجود کلاس
    if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    # ۲. اعتبارسنجی وجود استاد
    if not db.query(Staff).filter(Staff.id == payload.teacher_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="استاد انتخاب‌شده وجود ندارد")

    # ۳. اعتبارسنجی وجود هنرجو
    if not db.query(Student).filter(Student.id == payload.student_id).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    new_evaluation = TeacherEvaluation(**payload.model_dump())
    db.add(new_evaluation)
    db.commit()
    db.refresh(new_evaluation)
    return new_evaluation


# ۴. ویرایش کامل ارزیابی (PUT)
@router.put("/{evaluation_id}", response_model=TeacherEvaluationResponse)
def update_teacher_evaluation(evaluation_id: int, payload: TeacherEvaluationUpdate, db: Session = Depends(get_db)):
    eval_record = db.query(TeacherEvaluation).filter(TeacherEvaluation.id == evaluation_id).first()
    if not eval_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ارزیابی مورد نظر یافت نشد"
        )

    # بررسی صحت شناسه‌ها در صورت تغییر
    if payload.classroom_id != eval_record.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == payload.classroom_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    if payload.teacher_id != eval_record.teacher_id:
        if not db.query(Staff).filter(Staff.id == payload.teacher_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="استاد انتخاب‌شده وجود ندارد")

    if payload.student_id != eval_record.student_id:
        if not db.query(Student).filter(Student.id == payload.student_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    for key, value in payload.model_dump().items():
        setattr(eval_record, key, value)

    db.commit()
    db.refresh(eval_record)
    return eval_record


# ۵. ویرایش جزئی ارزیابی (PATCH)
@router.patch("/{evaluation_id}", response_model=TeacherEvaluationResponse)
def patch_teacher_evaluation(evaluation_id: int, payload: TeacherEvaluationPatch, db: Session = Depends(get_db)):
    eval_record = db.query(TeacherEvaluation).filter(TeacherEvaluation.id == evaluation_id).first()
    if not eval_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ارزیابی مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "classroom_id" in update_data and update_data["classroom_id"] != eval_record.classroom_id:
        if not db.query(ClassRoom).filter(ClassRoom.id == update_data["classroom_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="کلاس انتخاب‌شده وجود ندارد")

    if "teacher_id" in update_data and update_data["teacher_id"] != eval_record.teacher_id:
        if not db.query(Staff).filter(Staff.id == update_data["teacher_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="استاد انتخاب‌شده وجود ندارد")

    if "student_id" in update_data and update_data["student_id"] != eval_record.student_id:
        if not db.query(Student).filter(Student.id == update_data["student_id"]).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="هنرجوی انتخاب‌شده وجود ندارد")

    for key, value in update_data.items():
        setattr(eval_record, key, value)

    db.commit()
    db.refresh(eval_record)
    return eval_record


# ۶. حذف ارزیابی (DELETE)
@router.delete("/{evaluation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_teacher_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    eval_record = db.query(TeacherEvaluation).filter(TeacherEvaluation.id == evaluation_id).first()
    if not eval_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ارزیابی مورد نظر یافت نشد"
        )

    db.delete(eval_record)
    db.commit()
    return None
