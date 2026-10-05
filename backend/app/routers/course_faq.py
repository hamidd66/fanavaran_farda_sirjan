from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload, get_optional_payload
from app.middleware.exception_handler import response_handler

from app.models.course_faq import CourseFAQ
from app.models.course import Course
from app.models.user import User
from app.schemas.course_faq import CourseFAQCreate, CourseFAQUpdate, CourseFAQOut, CourseFAQApprovalUpdate
from app.enums.user import UserRole
from app.enums.course import FaqSort


router = APIRouter(prefix="/course-faqs", tags=["Course FAQs"])


@router.post("/{course_id}")
def create_course_faq(
    course_id: str,
    data: CourseFAQCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        is_staff = payload.get("role") in {UserRole.admin.value, UserRole.teacher.value}
        parent_id = data.parent_id or None

        db_parent = None
        if parent_id:
            db_parent = db.query(CourseFAQ).filter(
                CourseFAQ.id == parent_id,
                CourseFAQ.course_id == course_id,
            ).first()
            if not db_parent:
                raise HTTPException(status_code=404, detail="Parent FAQ not found in this course.")

            if not is_staff:
                raise HTTPException(status_code=403, detail="Only staff can reply to FAQs.")

            if db_parent.parent_id is not None:
                raise HTTPException(status_code=400, detail="Cannot reply to a reply.")

            if db_parent.user.role != UserRole.user:
                raise HTTPException(status_code=400, detail="Only student questions can receive replies.")

            if not db_parent.is_approved:
                raise HTTPException(status_code=400, detail="Only approved questions can receive replies.")

            if db_parent.replies:
                raise HTTPException(status_code=409, detail="This question already has a reply.")

            if db_parent.sender_id == payload.get("sub"):
                raise HTTPException(status_code=400, detail="You cannot reply to your own question.")
            
        db_faq = CourseFAQ(
            message=data.message,
            parent_id=parent_id,
            course_id=course_id,
            sender_id=payload.get("sub"),
            is_approved=is_staff,
        )

        db.add(db_faq)
        db.commit()
        db.refresh(db_faq)

        return response_handler(
            status=True,
            message="FAQ created successfully",
            data=CourseFAQOut.model_validate(db_faq).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="FAQ data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create FAQ")


@router.get("/{course_id}")
def get_course_faqs(
    course_id: str,
    db: Session = Depends(get_db),
    payload = Depends(get_optional_payload),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_approved: Optional[bool] = Query(None),
    sort: Optional[FaqSort] = Query(None),
):
    try:
        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        user_role = payload.get("role") if payload else None
        is_staff = user_role in {UserRole.admin.value, UserRole.teacher.value}

        query = db.query(CourseFAQ).options(
            joinedload(CourseFAQ.user).joinedload(User.student),
            joinedload(CourseFAQ.user).joinedload(User.staff),
            joinedload(CourseFAQ.replies).joinedload(CourseFAQ.user).joinedload(User.student),
            joinedload(CourseFAQ.replies).joinedload(CourseFAQ.user).joinedload(User.staff),
        ).filter(
            CourseFAQ.course_id == course_id,
            CourseFAQ.parent_id == None
        )

        if is_approved is not None:
            query = query.filter(CourseFAQ.is_approved == is_approved)

        if not is_staff:
            query = query.filter(CourseFAQ.is_approved == True)

        if sort == FaqSort.oldest:
            query = query.order_by(CourseFAQ.created_at.asc())
        elif sort == FaqSort.newest:
            query = query.order_by(CourseFAQ.created_at.desc())

        total_count = query.count()
        db_faqs = query.offset((page - 1) * limit).limit(limit).all()

        faqs_data = []
        for faq in db_faqs:
            faq_obj = CourseFAQOut.model_validate(faq)
            if not is_staff:
                faq_obj.replies = [r for r in faq_obj.replies if r.is_approved]
            faqs_data.append(faq_obj.model_dump())

        return response_handler(
            status=True,
            message="Course FAQs retrieved successfully",
            data={
                "faqs": faqs_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch course FAQs")


@router.patch("/{faq_id}")
def update_course_faq_message(
    faq_id: str,
    data: CourseFAQUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        db_faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()
        
        if not db_faq:
            raise HTTPException(status_code=404, detail="FAQ not found in this course.")

        if db_faq.sender_id != payload.get("sub"):
            raise HTTPException(status_code=403, detail="You can only edit your own FAQs.")

        if db_faq.replies and len(db_faq.replies) > 0:
            raise HTTPException(status_code=400, detail="Cannot edit FAQ that has received replies.")

        db_faq.message = data.message

        is_staff = payload.get("role") in {UserRole.admin.value, UserRole.teacher.value}
        if not is_staff:
            db_faq.is_approved = False

        db.commit()
        db.refresh(db_faq)

        return response_handler(
            status=True,
            message="FAQ message updated successfully",
            data=CourseFAQOut.model_validate(db_faq).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update FAQ message")


@router.patch("/approve/{faq_id}")
def approve_course_faq(
    faq_id: str,
    data: CourseFAQApprovalUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()

        if not db_faq:
            raise HTTPException(status_code=404, detail="FAQ not found in this course")

        if db_faq.is_approved == data.is_approved:
            raise HTTPException(status_code=409, detail=f"FAQ is already {'approved' if data.is_approved else 'unapproved'}")

        db_faq.is_approved = data.is_approved

        db.commit()
        db.refresh(db_faq)

        return response_handler(
            status=True,
            message=f"FAQ {'approved' if data.is_approved else 'unapproved'} successfully",
            data=CourseFAQOut.model_validate(db_faq).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update FAQ approval status")


@router.delete("/{faq_id}")
def delete_course_faq(
    faq_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")
        
        db_faq = db.query(CourseFAQ).filter(CourseFAQ.id == faq_id).first()

        if not db_faq:
            raise HTTPException(status_code=404, detail="FAQ not found in this course")

        replies_count = len(db_faq.replies) if db_faq.replies else 0

        db.delete(db_faq)
        db.commit()

        return response_handler(
            status=True,
            message="FAQ deleted successfully",
            data={
                "id": faq_id,
                "replies_deleted": replies_count
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete FAQ")
