from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.category import CourseCategory
from app.schemas.category import (
    CourseCategoryCreate,
    CourseCategoryUpdate,
    CourseCategoryPatch,
    CourseCategoryResponse,
)

router = APIRouter(
    prefix="/categories",
    tags=["Course Categories"]
)

# ۱. دریافت تمام دسته‌بندی‌ها (مرتب‌شده بر اساس display_order)
@router.get("", response_model=List[CourseCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(CourseCategory).order_by(CourseCategory.display_order.asc()).all()


# ۲. دریافت یک دسته‌بندی بر اساس ID
@router.get("/{category_id}", response_model=CourseCategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="دسته‌بندی مورد نظر یافت نشد")
    return category


# ۳. ایجاد دسته‌بندی جدید
@router.post("", response_model=CourseCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(payload: CourseCategoryCreate, db: Session = Depends(get_db)):
    # بررسی یکتا بودن نام دسته‌بندی
    existing_cat = db.query(CourseCategory).filter(CourseCategory.name == payload.name).first()
    if existing_cat:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دسته‌بندی با این نام از قبل وجود دارد")

    new_cat = CourseCategory(**payload.model_dump())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


# ۴. ویرایش کامل دسته‌بندی (PUT)
@router.put("/{category_id}", response_model=CourseCategoryResponse)
def update_category(category_id: int, payload: CourseCategoryUpdate, db: Session = Depends(get_db)):
    category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="دسته‌بندی مورد نظر یافت نشد")

    # بررسی تکراری نبودن نام جدید در صورتی که تغییر کرده باشد
    if payload.name != category.name:
        existing = db.query(CourseCategory).filter(CourseCategory.name == payload.name).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دسته‌بندی با این نام از قبل وجود دارد")

    for key, value in payload.model_dump().items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


# ۵. ویرایش جزئی دسته‌بندی (PATCH)
@router.patch("/{category_id}", response_model=CourseCategoryResponse)
def patch_category(category_id: int, payload: CourseCategoryPatch, db: Session = Depends(get_db)):
    category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="دسته‌بندی مورد نظر یافت نشد")

    update_data = payload.model_dump(exclude_unset=True)

    if "name" in update_data and update_data["name"] != category.name:
        existing = db.query(CourseCategory).filter(CourseCategory.name == update_data["name"]).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="دسته‌بندی با این نام از قبل وجود دارد")

    for key, value in update_data.items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


# ۶. حذف دسته‌بندی (DELETE)
@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="دسته‌بندی مورد نظر یافت نشد")

    db.delete(category)
    db.commit()
    return None
