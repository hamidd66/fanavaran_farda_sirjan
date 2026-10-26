from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from sqlalchemy import or_, func
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload, get_optional_payload
from app.middleware.exception_handler import response_handler
from app.repositories.file_repo import add_files, remove_files
from app.utils.delete_file import delete_files

from app.models.course_category import CourseCategory
from app.models.course import Course
from app.models.audit_logs import AuditLog
from app.enums.audit_logs import ActionTypes
from app.enums.course import CategorySort
from app.schemas.course_category import CourseCategoryCreate, CourseCategoryUpdate, CourseCategoryOut, CourseCategoryOrderItemUpdate, BatchCategoriesStatus


router = APIRouter(prefix="/course-categories", tags=["Course Categories"])


@router.post("/")
async def create_course_category(
    data: str = Form(...),
    image: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        category_data = CourseCategoryCreate.model_validate_json(data)

        existing_data = db.query(CourseCategory).filter(
            or_(
                CourseCategory.name == category_data.name,
                CourseCategory.slug == category_data.slug
            )
        ).first()
        if existing_data:
            raise HTTPException(status_code=409, detail="Course category already exists")

        display_order = (db.query(func.max(CourseCategory.display_order)).scalar() or 0) + 1

        new_category = CourseCategory(
            name=category_data.name,
            slug=category_data.slug,
            description=category_data.description,
            display_order=display_order,
            is_active=category_data.is_active,
            created_by=admin_id
        )
        db.add(new_category)
        db.flush()

        log = AuditLog(
            user_id=admin_id,
            entity_id=new_category.id,
            entity_type="CourseCategory",
            action=ActionTypes.create,
            changed_fields=["name", "slug", "description", "is_active"],
        )
        db.add(log)

        if image:
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_category.id,
                entity_type="course_categories",
                purpose="image",
                files=[image],
                display_order=[1]
            )

        db.commit()
        db.refresh(new_category)

        category_dict = CourseCategoryOut.model_validate(new_category).model_dump()
        category_dict["courses_count"] = 0

        return response_handler(
            status=True,
            message="Course category successfully created",
            data=category_dict,
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Course category data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create course category")


@router.get("/")
def get_course_categories(
    db: Session = Depends(get_db),
    payload: dict | None = Depends(get_optional_payload),
    is_active: Optional[bool] = Query(None),
    sort: Optional[CategorySort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
):
    try:
        viewer_is_admin = bool(payload) and "admin" in payload.get("role", [])

        query = db.query(CourseCategory).options(selectinload(CourseCategory.file_attachments))

        if viewer_is_admin:
            if is_active is not None:
                query = query.filter(CourseCategory.is_active == is_active)
        else:
            query = query.filter(CourseCategory.is_active.is_(True))

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    CourseCategory.name.ilike(search_term),
                    CourseCategory.slug.ilike(search_term),
                    CourseCategory.description.ilike(search_term)
                )
            )

        if sort == CategorySort.order_desc:
            query = query.order_by(CourseCategory.display_order.desc())
        elif sort == CategorySort.order_asc:
            query = query.order_by(CourseCategory.display_order.asc())
        elif sort == CategorySort.newest:
            query = query.order_by(CourseCategory.created_at.desc())
        elif sort == CategorySort.oldest:
            query = query.order_by(CourseCategory.created_at.asc())
        else:
            query = query.order_by(CourseCategory.display_order.asc())

        total_count = query.count()
        categories = query.offset((page - 1) * limit).limit(limit).all()

        category_ids = [category.id for category in categories]

        courses_count_map = {}
        if category_ids:
            courses_count_map = dict(
                db.query(Course.category_id, func.count(Course.id))
                .filter(Course.category_id.in_(category_ids))
                .group_by(Course.category_id)
                .all()
            )

        categories_data = []
        for category in categories:
            category_dict = CourseCategoryOut.model_validate(category).model_dump()
            category_dict["courses_count"] = courses_count_map.get(category.id, 0)
            categories_data.append(category_dict)

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


@router.get("/{category_id}")
def get_course_category_by_id(
    category_id: str,
    payload: dict | None = Depends(get_optional_payload),
    db: Session = Depends(get_db)
):
    try:
        viewer_is_admin = bool(payload) and "admin" in payload.get("role", [])

        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(
                or_(
                    CourseCategory.id == category_id,
                    CourseCategory.slug == category_id
                )
            )
            .first()
        )

        if not db_category:
            raise HTTPException(status_code=404, detail="Course category not found")

        if not viewer_is_admin and not db_category.is_active:
            raise HTTPException(status_code=404, detail="Course category not found")

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == db_category.id).scalar() or 0

        category_dict = CourseCategoryOut.model_validate(db_category).model_dump()
        category_dict["courses_count"] = courses_count

        return response_handler(
            status=True,
            message="Course category retrieved successfully",
            data=category_dict,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve course category")


@router.patch("/reorder")
def reorder_course_categories(
    data: CourseCategoryOrderItemUpdate,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        item_ids = [item.id for item in data.items]

        if len(item_ids) != len(set(item_ids)):
            raise HTTPException(status_code=400, detail="Duplicate category IDs in request")

        db_categories = db.query(CourseCategory).filter(CourseCategory.id.in_(item_ids)).all()

        found_ids = {category.id for category in db_categories}
        missing_ids = set(item_ids) - found_ids

        if missing_ids:
            raise HTTPException(status_code=404, detail=f"Categories not found: {list(missing_ids)}")

        category_map = {category.id: category for category in db_categories}

        for item in data.items:
            category_map[item.id].display_order = item.display_order

        db.commit()

        updated_categories = [
            CourseCategoryOut.model_validate(category_map[item.id]).model_dump()
            for item in sorted(data.items, key=lambda item: item.display_order)
        ]

        return response_handler(
            status=True,
            message="Course categories reordered successfully",
            data=updated_categories,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Conflict while reordering course categories")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to reorder course categories")


@router.patch("/batch-active")
def batch_update_categories_status(
    data: BatchCategoriesStatus,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        if not data.items:
            raise HTTPException(status_code=400, detail="Items list cannot be empty")

        category_ids = [item.category_id for item in data.items]

        categories = db.query(CourseCategory).filter(CourseCategory.id.in_(category_ids)).all()
        categories_map = {c.id: c for c in categories}
        name_categories = {c.name for c in categories}

        for c_id in category_ids:
            if c_id not in categories_map:
                raise HTTPException(status_code=404, detail=f"Course category with ID '{c_id}' not found")

        updated_count = 0
        status_dict = {item.category_id: item.is_active for item in data.items}

        for c_id, category_obj in categories_map.items():
            new_status = status_dict[c_id]
            if category_obj.is_active != new_status:
                category_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            log = AuditLog(
                user_id=admin_id,
                entity_id=0,
                entity_type="CourseCategory",
                action=ActionTypes.update,
                changed_fields=["batch_is_active_update", list(name_categories)],
            )
            db.add(log)
            db.commit()

        return response_handler(
            status=True,
            message="Course categories status successfully updated in batch",
            data={"updated_count": updated_count},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch update course categories status")


@router.patch("/{category_id}")
async def update_course_category(
    category_id: str,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(CourseCategory.id == category_id)
            .first()
        )
        if not db_category:
            raise HTTPException(status_code=404, detail="Course category not found")

        update_data = CourseCategoryUpdate.model_validate_json(data).model_dump(exclude_unset=True)

        if not update_data and not image:
            raise HTTPException(status_code=400, detail="No fields to update")

        for name_field in ("name", "slug"):
            if name_field in update_data and update_data[name_field] != db_category.name:
                existing_data = db.query(CourseCategory).filter(
                    getattr(CourseCategory, name_field) == update_data[name_field],
                    CourseCategory.id != category_id
                ).first()
                if existing_data:
                    raise HTTPException(status_code=409, detail=f"Course category with this {name_field} already exists")

        changed_fields = []
        for key, value in update_data.items():
            setattr(db_category, key, value)
            changed_fields.append(key)

        deleted_paths = []
        if image:
            changed_fields.append("image")

            deleted_attachment_ids = [attachment.id for attachment in db_category.file_attachments if attachment.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=category_id,
                entity_type="course_categories",
                purpose="image",
                files=[image],
                display_order=[1]
            )

        if changed_fields:
            log = AuditLog(
                user_id=admin_id,
                entity_id=db_category.id,
                entity_type="CourseCategory",
                action=ActionTypes.update,
                changed_fields=changed_fields,
            )
            db.add(log)

        db.commit()
        db.refresh(db_category)

        if image and deleted_paths:
            delete_files(deleted_paths)

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == db_category.id).scalar() or 0
        category_dict = CourseCategoryOut.model_validate(db_category).model_dump()
        category_dict["courses_count"] = courses_count

        return response_handler(
            status=True,
            message="Course category successfully updated",
            data=category_dict,
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Course category data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course category")


@router.delete("/{category_id}")
def delete_course_category(
    category_id: str,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(CourseCategory.id == category_id)
            .first()
        )
        if not db_category:
            raise HTTPException(status_code=404, detail="Course category not found")

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == category_id).scalar() or 0
        if courses_count > 0:
            raise HTTPException(status_code=409, detail=f"Cannot delete course category with {courses_count} associated course(s). Reassign or delete the courses first.")

        is_image = False
        deleted_paths = []

        if db_category.file_attachments:
            is_image = True

            deleted_attachment_ids = [attachment.id for attachment in db_category.file_attachments if attachment.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        db.delete(db_category)

        log = AuditLog(
            user_id=admin_id,
            entity_id=category_id,
            entity_type="CourseCategory",
            action=ActionTypes.delete,
            changed_fields=["deleted", db_category.name],
        )
        db.add(log)

        db.commit()

        if is_image and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="Course category successfully deleted",
            data={"id": category_id},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete course category because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete course category")
