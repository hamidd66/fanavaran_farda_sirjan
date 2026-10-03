from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional


from app.db.session import get_db
from app.models.course import Course
from app.models.course_category import CourseCategory
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CoursePatch,
    CourseResponse,
)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)

# ۱. دریافت تمام دوره‌ها (همراه با قابلیت فیلتر بر اساس دسته‌بندی)
@router.get("", response_model=List[CourseResponse])
def get_courses(category_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Course)
    if category_id is not None:
        query = query.filter(Course.category_id == category_id)
    return query.order_by(Course.id.desc()).all()


# ۲. دریافت یک دوره بر اساس ID
@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد"
        )
    return course


# ۳. ایجاد دوره جدید
@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    # بررسی وجود دسته‌بندی مرتبط
    category = db.query(CourseCategory).filter(CourseCategory.id == payload.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="دسته‌بندی با این شناسه وجود ندارد"
        )

    new_course = Course(**payload.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course


# ۴. ویرایش کامل دوره (PUT)
@router.put("/{course_id}", response_model=CourseResponse)
def update_course(course_id: int, payload: CourseUpdate, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد"
        )

    # اگر دسته‌بندی تغییر کرده، از وجود شناسه جدید مطمئن شویم
    if payload.category_id != course.category_id:
        category = db.query(CourseCategory).filter(CourseCategory.id == payload.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="دسته‌بندی انتخاب‌شده نامعتبر است"
            )

    for key, value in payload.model_dump().items():
        setattr(course, key, value)

    db.commit()
    db.refresh(course)
    return course


# ۵. ویرایش جزئی دوره (PATCH)
@router.patch("/{course_id}", response_model=CourseResponse)
def patch_course(course_id: int, payload: CoursePatch, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد"
        )

    update_data = payload.model_dump(exclude_unset=True)

    # اگر فیلد دسته‌بندی ارسال شده باشد، بررسی وجود آن
    if "category_id" in update_data and update_data["category_id"] != course.category_id:
        category = db.query(CourseCategory).filter(CourseCategory.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="دسته‌بندی انتخاب‌شده نامعتبر است"
            )

    for key, value in update_data.items():
        setattr(course, key, value)

    db.commit()
    db.refresh(course)
    return course


# ۶. حذف دوره (DELETE)
@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد"
        )

    db.delete(course)
    db.commit()
    return None
