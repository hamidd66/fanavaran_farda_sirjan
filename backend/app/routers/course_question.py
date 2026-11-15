from uuid import UUID
from fastapi import APIRouter, Depends, Query, Header
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone
from typing import Optional
import math
import logging

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.core.exceptions.custom_exceptions import AppException
from app.core.responses.response_builder import success_response
from app.enums.response_codes import ResponseCode

from app.models.term import Term
from app.models.course import Course
from app.models.course_question import CourseQuestion
from app.schemas.course_question import QuestionCreate, QuestionUpdate, ToggleQuestionApproveStatus, QuestionOut, ToggleQuestionDeleteStatus
from app.enums.course import QuestionSort
from app.enums.user import UserRoleEnum

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/course-questions", tags=["Course Questions"])


@router.post("/{course_id}")
def create_question(
    course_id: UUID,
    data: QuestionCreate,
    x_active_role: str = Header(..., alias="X-Active-Role"),
    auth: dict = Depends(require_roles()),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        user_roles = auth["roles"]
        is_staff = x_active_role in {UserRoleEnum.admin.value, UserRoleEnum.teacher.value}

        if x_active_role not in user_roles:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message=f"You do not have the active role '{x_active_role}' or it is not assigned/enabled for you.")

        course = db.query(Course).filter(Course.id == course_id, Course.deleted_at.is_(None)).first()
        if not course:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course not found")

        if data.term_id:
            term = db.query(Term).filter(Term.id == data.term_id, Term.deleted_at.is_(None)).first()
            if not term:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found or inactive")

        if data.parent_id:
            if not is_staff:
                raise AppException(code=ResponseCode.ACCESS_DENIED, message="Only staff can reply to questions.")

            parent_question = db.query(CourseQuestion).filter(
                CourseQuestion.id == data.parent_id,
                CourseQuestion.course_id == course_id,
                CourseQuestion.is_approved == True,
                CourseQuestion.deleted_at.is_(None)
            ).options(
                selectinload(CourseQuestion.replies)
            ).first()

            if not parent_question:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Parent question not found in this course.")
            if parent_question.parent_id is not None:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Cannot reply to a reply.")
            
            if parent_question.sender_role != UserRoleEnum.student:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Only student questions can receive replies.")
          
            if parent_question.replies:
                raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="This question already has a reply.")
                
            if parent_question.sender_id == user_id:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="You cannot reply to your own question.")

        new_question = CourseQuestion(
            course_id=course_id,
            sender_id=user_id,
            parent_id=data.parent_id,
            term_id=data.term_id,
            sender_role=UserRoleEnum[x_active_role],
            message=data.message,
            is_approved=is_staff,
            deleted_at=None
        )
        db.add(new_question)
        db.commit()
        db.refresh(new_question)

        return success_response(
            code=ResponseCode.CREATED,
            message="Question created successfully",
            data=QuestionOut.model_validate(new_question).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except ValueError as e:
        db.rollback()
        raise AppException(code=ResponseCode.VALIDATION_ERROR, message="Invalid active role") from e
    except IntegrityError as e:
        db.rollback()
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Data conflict occurred") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to create question")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to create question") from e


@router.get("/{course_id}")
def get_questions(
    course_id: UUID,
    term_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    auth: Optional[dict] = Depends(require_roles(auth_optional=True)),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_approved: Optional[bool] = Query(None),
    is_deleted: Optional[bool] = Query(None),
    sort: Optional[QuestionSort] = Query(None)
):
    try:
        viewer_is_staff = bool(auth["payload"]) and bool({"admin", 'teacher'} & set(auth["roles"]))

        db_course = db.query(Course).filter(Course.id == course_id, Course.deleted_at.is_(None)).first()
        if not db_course:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Course not found")

        if term_id:
            db_term = db.query(Term).filter(Term.id == term_id, Term.deleted_at.is_(None)).first()
            if not db_term:
                raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Term not found")

        query = db.query(CourseQuestion).filter(
            CourseQuestion.course_id == course_id,
            CourseQuestion.term_id == term_id,
            CourseQuestion.parent_id == None,
        ).options(
            joinedload(CourseQuestion.replies)
        )

        if viewer_is_staff:
            if is_approved is not None:
                query = query.filter(CourseQuestion.is_approved == is_approved)
            if is_deleted is not None:
                if is_deleted:
                    query = query.filter(CourseQuestion.deleted_at.isnot(None))
                else:
                    query = query.filter(CourseQuestion.deleted_at.is_(None))
        else:
            query = query.filter(CourseQuestion.is_approved == True, CourseQuestion.deleted_at.is_(None))

        if sort == QuestionSort.newest:
            query = query.order_by(CourseQuestion.created_at.desc())
        elif sort == QuestionSort.oldest:        
            query = query.order_by(CourseQuestion.created_at.asc())
        else:
            query = query.order_by(CourseQuestion.created_at.desc())

        total_count = query.count()
        db_questions = query.offset((page - 1) * limit).limit(limit).all()

        question_data = []
        for question in db_questions:
            if viewer_is_staff:
                filtered_sql_replies = []
                for q in question.replies:
                    approved_cond = (q.is_approved == is_approved) if is_approved is not None else True
                    
                    if is_deleted is True:
                        deleted_cond = (q.deleted_at is not None)
                    elif is_deleted is False:
                        deleted_cond = (q.deleted_at is None)
                    else:
                        deleted_cond = (q.deleted_at is None)
                    
                    if approved_cond and deleted_cond:
                        filtered_sql_replies.append(q)

                question.replies = filtered_sql_replies
            else:
                question.replies = [q for q in question.replies if q.is_approved and q.deleted_at is None]

            question_data.append(QuestionOut.model_validate(question).model_dump())

        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Questions retrieved successfully",
            data={
                "questions": question_data,
                "page": page, 
                "limit": limit, 
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch questions")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch questions") from e


@router.patch("/{question_id}")
def update_question(
    question_id: UUID,
    data: QuestionUpdate,
    x_active_role: str = Header(..., alias="X-Active-Role"),
    auth: dict = Depends(require_roles()),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        user_roles = auth["roles"]
        is_staff = x_active_role in {UserRoleEnum.admin.value, UserRoleEnum.teacher.value}

        if x_active_role not in user_roles:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message=f"You do not have the active role '{x_active_role}' or it is not assigned/enabled for you.")

        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id, CourseQuestion.deleted_at.is_(None)).options(
            selectinload(CourseQuestion.replies)
        ).first()
        if not db_question:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Question not found.")

        if db_question.sender_id != user_id and not is_staff:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="You can only edit your own questions.")

        if db_question.replies and len(db_question.replies) > 0:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="Cannot edit question that has received replies.")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")

        for key, value in update_data.items():
            setattr(db_question, key, value)

        if not is_staff:
            db_question.is_approved = False

        db.commit()
        db.refresh(db_question)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Question updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except ValueError as e:
        db.rollback()
        raise AppException(code=ResponseCode.VALIDATION_ERROR, message="Invalid active role") from e
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update question")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update question") from e


@router.patch("/approve/{question_id}")
def toggle_approval_question(
    question_id: UUID,
    data: ToggleQuestionApproveStatus,
    auth: dict = Depends(require_roles("admin", "teacher")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id, CourseQuestion.deleted_at.is_(None)).first()
        if not db_question:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Question not found")

        if db_question.is_approved == data.is_approved:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Question is already {'approved' if data.is_approved else 'unapproved'}")

        db_question.is_approved = data.is_approved

        db.commit()
        db.refresh(db_question)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Question approval status updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update approval status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update approval status") from e


@router.patch("/delete-status/{question_id}")
def toggle_delete_status_question(
    question_id: UUID,
    data: ToggleQuestionDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id).first()
        if not db_question:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Question not found")

        if (db_question.deleted_at is not None) == data.is_deleted:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"Question is already {'deleted' if data.is_deleted else 'restored'}")

        db_question.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None

        db.commit()
        db.refresh(db_question)

        return success_response(
            code=ResponseCode.UPDATED,
            message="Question delete status updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update delete status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update delete status") from e


@router.delete("/{question_id}")
def delete_question(
    question_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id).options(
            selectinload(CourseQuestion.replies)
        ).first()
        if not db_question:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Question not found")

        replies_count = len(db_question.replies)

        db.delete(db_question)
        db.commit()

        return success_response(
            code=ResponseCode.DELETED,
            message="Question deleted successfully",
            data={"deleted_replies_count": replies_count},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete question")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to delete question") from e

