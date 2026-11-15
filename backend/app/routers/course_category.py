from uuid import UUID
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, selectinload
from sqlalchemy.exc import IntegrityError
from pydantic import ValidationError
from sqlalchemy import or_, func, update, case
from typing import Optional
import math
import logging

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode
from app.repositories.file_repo import add_files, remove_files, confirm_pending_uploads, cleanup_pending_uploads
from app.utils.delete_file import delete_files
from app.utils.ordering import reorder_items

from app.models.course_category import CourseCategory
from app.models.course import Course
from app.enums.file import EntityType, FilePurpose
from app.enums.course import CategorySort
from app.schemas.file_attachment import FileAttachmentCreate
from app.schemas.course_category import CourseCategoryCreate, CourseCategoryUpdate, CourseCategoryOut, CourseCategoryOrderItemUpdate, BatchCategoriesStatus

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/course-categories", tags=["Course Categories"])


@router.post("/")
async def create_course_category(
    data: str = Form(..., description='{"name": "", "slug": "", "description": "", "is_active": true}'),
    image: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = auth["payload"]["sub"]

        category_data = CourseCategoryCreate.model_validate_json(data)

        existing_data = db.query(CourseCategory).filter(
            or_(
                CourseCategory.name == category_data.name,
                CourseCategory.slug == category_data.slug
            ),
            CourseCategory.deleted_at.is_(None)
        ).first()
        if existing_data:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Course category already exists")

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

        if image:
            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.thumbnail,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_category.id,
                entity_type=EntityType.course_categories,
                folder_name="course_categories",
                files=[image],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(new_category)
        confirm_pending_uploads(db)

        category_dict = CourseCategoryOut.model_validate(new_category).model_dump()
        category_dict["courses_count"] = 0

        return success_response(
            code=ResponseCode.CREATED,
            message="Course category successfully created",
            data=category_dict,
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Course category data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to create course category")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to create course category") from e


@router.get("/")
def get_course_categories(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles(auth_optional=True)),
    is_active: Optional[bool] = Query(None),
    sort: Optional[CategorySort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
):
    try:
        viewer_is_admin = bool(auth["payload"]) and "admin" in auth["roles"]

        query = db.query(CourseCategory).filter(CourseCategory.deleted_at.is_(None)).options(selectinload(CourseCategory.file_attachments))

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

        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Course categories retrieved successfully",
            data={
                "categories": categories_data,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch course categories")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch course categories") from e


@router.get("/{category_id}")
def get_course_category_by_id(
    category_id: UUID,
    auth: dict = Depends(require_roles(auth_optional=True)),
    db: Session = Depends(get_db)
):
    try:
        viewer_is_admin = bool(auth["payload"]) and "admin" in auth["roles"]

        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(
                or_(
                    CourseCategory.id == category_id,
                    CourseCategory.slug == category_id
                ),
                CourseCategory.deleted_at.is_(None)
            )
            .first()
        )

        if not db_category:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course category not found")

        if not viewer_is_admin and not db_category.is_active:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course category not found")

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == db_category.id).scalar() or 0

        category_dict = CourseCategoryOut.model_validate(db_category).model_dump()
        category_dict["courses_count"] = courses_count

        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Course category retrieved successfully",
            data=category_dict,
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to retrieve course category")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to retrieve course category") from e


@router.patch("/reorder")
def reorder_course_categories(
    data: CourseCategoryOrderItemUpdate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        items = data.items
        
        if not items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list is empty")

        new_orders = {
            item.id: item.display_order
            for item in items
        }

        if len(new_orders) != len(items):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Duplicate category IDs in request")

        if sorted(new_orders.values()) != list(range(1, len(items) + 1)):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Display orders must be unique and consecutive starting from 1")

        current = dict(
            db.query(
                CourseCategory.id,
                CourseCategory.display_order
            )
            .order_by(CourseCategory.id)
            .with_for_update()
            .all()
        )

        unknown_ids = new_orders.keys() - current.keys()

        if unknown_ids:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message=f"Categories not found: {sorted(map(str, unknown_ids))}")

        if len(current) != len(new_orders):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="All active categories must be included")

        changes = {
            cid: order
            for cid, order in new_orders.items()
            if current[cid] != order
        }

        if changes:
            changed_ids = list(changes)

            temp_shift = (
                max(current.values())
                + len(current)
            )

            db.execute(
                update(CourseCategory)
                .where(CourseCategory.id.in_(changed_ids))
                .values(
                    display_order=(
                        CourseCategory.display_order + temp_shift
                    )
                )
                .execution_options(
                    synchronize_session=False
                )
            )

            db.execute(
                update(CourseCategory)
                .where(CourseCategory.id.in_(changed_ids))
                .values(
                    display_order=case(
                        changes,
                        value=CourseCategory.id
                    )
                )
                .execution_options(
                    synchronize_session=False
                )
            )

        categories = (
            db.query(CourseCategory)
            .filter(
                CourseCategory.id.in_(new_orders)
            )
            .order_by(CourseCategory.display_order)
            .all()
        )

        result = [
            CourseCategoryOut.model_validate(category).model_dump()
            for category in categories
        ]

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="Course categories reordered successfully",
            data=result,
        )

    except AppException:
        db.rollback()
        raise
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Conflict while reordering course categories") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to reorder course categories")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to reorder course categories") from e


@router.patch("/batch-active")
def batch_update_categories_status(
    data: BatchCategoriesStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = auth["payload"]["sub"]

        if not data.items:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Items list cannot be empty")

        category_ids = [item.category_id for item in data.items]

        categories = db.query(CourseCategory).filter(CourseCategory.id.in_(category_ids), CourseCategory.deleted_at.is_(None)).all()
        categories_map = {c.id: c for c in categories}

        for c_id in category_ids:
            if c_id not in categories_map:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message=f"Course category with ID '{c_id}' not found")

        updated_count = 0
        status_dict = {item.category_id: item.is_active for item in data.items}

        for c_id, category_obj in categories_map.items():
            new_status = status_dict[c_id]
            if category_obj.is_active != new_status:
                category_obj.is_active = new_status
                updated_count += 1

        if updated_count > 0:
            db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="Course categories status successfully updated in batch",
            data={"updated_count": updated_count},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to batch update course categories status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to batch update course categories status") from e


@router.patch("/{category_id}")
async def update_course_category(
    category_id: UUID,
    data: str = Form(...),
    image: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        admin_id = auth["payload"]["sub"]

        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(CourseCategory.id == category_id, CourseCategory.deleted_at.is_(None))
            .first()
        )
        if not db_category:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course category not found")

        update_data = CourseCategoryUpdate.model_validate_json(data).model_dump(exclude_unset=True)

        if not update_data and not image:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")

        for name_field in ("name", "slug"):
            if name_field in update_data and update_data[name_field] != db_category.name:
                existing_data = db.query(CourseCategory).filter(
                    getattr(CourseCategory, name_field) == update_data[name_field],
                    CourseCategory.id != category_id
                ).first()
                if existing_data:
                    raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Course category with this {name_field} already exists")

        for key, value in update_data.items():
            setattr(db_category, key, value)

        deleted_paths = []
        if image:
            deleted_attachment_ids = [attachment.id for attachment in db_category.file_attachments if attachment.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.thumbnail,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=category_id,
                entity_type=EntityType.course_categories,
                folder_name="course_categories",
                files=[image],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(db_category)
        confirm_pending_uploads(db)

        if image and deleted_paths:
            delete_files(deleted_paths)

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == db_category.id).scalar() or 0
        category_dict = CourseCategoryOut.model_validate(db_category).model_dump()
        category_dict["courses_count"] = courses_count

        return success_response(
            code=ResponseCode.UPDATED,
            message="Course category successfully updated",
            data=category_dict,
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Course category data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to update course category")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update course category") from e


@router.delete("/{category_id}")
def delete_course_category(
    category_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        db_category = (
            db.query(CourseCategory)
            .options(selectinload(CourseCategory.file_attachments))
            .filter(CourseCategory.id == category_id)
            .first()
        )
        if not db_category:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course category not found")

        courses_count = db.query(func.count(Course.id)).filter(Course.category_id == category_id).scalar() or 0
        if courses_count > 0:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Cannot delete course category with {courses_count} associated course(s). Reassign or delete the courses first.")

        is_image = False
        deleted_paths = []

        if db_category.file_attachments:
            is_image = True

            deleted_attachment_ids = [attachment.id for attachment in db_category.file_attachments if attachment.purpose == "image"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

        db.delete(db_category)
        db.flush()

        reorder_items(
            db=db,
            model=CourseCategory,
            order_field="display_order",
            soft_delete_field="deleted_at"
        )

        db.commit()

        if is_image and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.DELETED,
            message="Course category successfully deleted",
            data={"id": category_id},
        )

    except AppException:
        db.rollback()
        raise
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Cannot delete course category because it is referenced by other records") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete course category")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to delete course category") from e
