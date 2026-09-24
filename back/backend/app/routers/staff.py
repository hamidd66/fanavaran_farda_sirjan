from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.staff import Staff
from app.schemas.staff import StaffCreate, StaffUpdate, StaffOut
from app.core.user_service import create_user_for_entity

router = APIRouter(prefix="/api/staff", tags=["کادر"])


@router.get("", response_model=list[StaffOut])
def get_staff(db: Session = Depends(get_db)):
    return db.query(Staff).filter(Staff.is_deleted == False).order_by(Staff.id.desc()).all()  # noqa: E712


@router.post("", response_model=StaffOut, status_code=status.HTTP_201_CREATED)
def create_staff(payload: StaffCreate, db: Session = Depends(get_db)):
    # ۱. ساخت شیء کادر
    staff = Staff(**payload.model_dump())
    db.add(staff)

    # ۲. ساخت خودکار حساب کاربری (نقش = عنوان شغلی کادر)
    create_user_for_entity(
        db=db,
        national_code=staff.national_code,
        full_name=staff.full_name,
        role=staff.job_title,
        access_level="staff"
    )

    # ۳. ذخیره هر دو در دیتابیس
    db.commit()
    db.refresh(staff)
    return staff

@router.get("/{staff_id}", response_model=StaffOut)
def get_staff_by_id(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="کادر پیدا نشد.")
    return staff


@router.put("/{staff_id}", response_model=StaffOut)
def update_staff(staff_id: int, payload: StaffUpdate, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="کادر پیدا نشد.")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(staff, k, v)
    db.commit()
    db.refresh(staff)
    return staff


@router.delete("/{staff_id}", response_model=StaffOut)
def soft_delete_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="کادر پیدا نشد.")
    staff.is_deleted = True
    staff.deleted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(staff)
    return staff


@router.patch("/{staff_id}/restore", response_model=StaffOut)
def restore_staff(staff_id: int, db: Session = Depends(get_db)):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="کادر پیدا نشد.")
    staff.is_deleted = False
    staff.deleted_at = None
    db.commit()
    db.refresh(staff)
    return staff
