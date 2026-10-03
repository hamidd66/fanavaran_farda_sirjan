from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.utils.delete_file import delete_file

from app.models.course_category import CourseCategory
from app.schemas.course_category import CourseCategoryCreate, CourseCategoryOut, CourseCategoryUpdate, CourseCategoryOrderItemUpdate
from app.enums.user import UserRole
from app.enums.course import CategorySort


router = APIRouter(prefix="/course-categories", tags=["Course Categories"])


@router.post("/")
def create_course_category(data: CourseCategoryCreate, payload = Depends(get_payload), db: Session = Depends(get_db)):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        existing_category = db.query(CourseCategory).filter(CourseCategory.name == data.name).first()
        if existing_category:
            raise HTTPException(status_code=409,  detail="Category with this name already exists")

        display_order = (db.query(func.max(CourseCategory.display_order)).scalar() or 0) + 1

        new_category = CourseCategory(
            name = data.name,
            image = data.image,
            description = data.description,
            display_order = display_order
        )

        db.add(new_category)
        db.commit()
        db.refresh(new_category)

        return response_handler(
            status=True,
            message="Course category created successfully",
            data=CourseCategoryOut.model_validate(new_category).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Category with this name already exists")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create course category")


@router.get("/")
def get_course_categories(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort: Optional[CategorySort] = Query(None),
):
    try:
        query = db.query(CourseCategory)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    CourseCategory.name.ilike(search_term),
                    CourseCategory.description.ilike(search_term)
                )
            )

        if sort == CategorySort.order_asc:
            query = query.order_by(CourseCategory.display_order.asc())
        elif sort == CategorySort.order_desc:
            query = query.order_by(CourseCategory.display_order.desc())
        elif sort == CategorySort.newest:
            query = query.order_by(CourseCategory.created_at.desc())
        elif sort == CategorySort.oldest:
            query = query.order_by(CourseCategory.created_at.asc())
        else:
            query = query.order_by(CourseCategory.display_order.asc())

        total_count = query.count()
        categories = query.offset((page - 1) * limit).limit(limit).all()

        categories_data = []
        for cat in categories:
            cat_dict = CourseCategoryOut.model_validate(cat).model_dump()
            cat_dict["courses_count"] = len(cat.courses) if cat.courses else 0
            categories_data.append(cat_dict)

        return response_handler(
            status=True,
            message="Course categories retrieved successfully",
            data={
                "categories": categories_data,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch course categories")


@router.patch("/reorder")
def reorder_course_categories(
    data: CourseCategoryOrderItemUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        item_ids = [item.id for item in data.items]

        if len(item_ids) != len(set(item_ids)):
            raise HTTPException(status_code=400, detail="Duplicate category IDs in request")

        categories = db.query(CourseCategory).filter(CourseCategory.id.in_(item_ids)).all()

        found_ids = {cat.id for cat in categories}
        missing_ids = set(item_ids) - found_ids
        
        if missing_ids:
            raise HTTPException(status_code=404, detail=f"Categories not found: {list(missing_ids)}")

        category_map = {cat.id: cat for cat in categories}

        for item in data.items:
            category_map[item.id].display_order = -item.display_order

        db.flush()

        for item in data.items:
            category_map[item.id].display_order = item.display_order

        db.commit()

        updated_categories = [
            CourseCategoryOut.model_validate(category_map[item.id]).model_dump()
            for item in sorted(data.items, key=lambda x: x.display_order)
        ]

        return response_handler(
            status=True,
            message="Categories reordered successfully",
            data={"categories": updated_categories},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Conflict while reordering categories")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reorder categories")


@router.patch("/{category_id}")
def update_course_category(
    category_id: str,
    data: CourseCategoryUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Course category not found")

        update_data = data.model_dump(exclude_unset=True)

        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "name" in update_data and update_data["name"] != category.name:
            existing = db.query(CourseCategory).filter(
                CourseCategory.name == update_data["name"],
                CourseCategory.id != category_id
            ).first()
            if existing:
                raise HTTPException(status_code=409, detail="Category with this name already exists")

        old_image = None
        if "image" in update_data and category.image and category.image != update_data["image"]:
            old_image = category.image

        for key, value in update_data.items():
            setattr(category, key, value)

        db.commit()
        db.refresh(category)

        if old_image:
            delete_file(old_image)

        return response_handler(
            status=True,
            message="Course category updated successfully",
            data=CourseCategoryOut.model_validate(category).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Category with this name already exists")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course category")


@router.delete("/{category_id}")
def delete_course_category(
    category_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        category = db.query(CourseCategory).filter(CourseCategory.id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Course category not found")

        if category.courses and len(category.courses) > 0:
            raise HTTPException(status_code=409, detail=f"Cannot delete category with {len(category.courses)} associated course(s). Reassign or delete the courses first.")

        image_to_delete = category.image

        db.delete(category)
        db.commit()

        if image_to_delete:
            delete_file(image_to_delete)

        return response_handler(
            status=True,
            message="Course category deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete category because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete course category")
