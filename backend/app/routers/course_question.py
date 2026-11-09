from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session, selectinload, joinedload
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from datetime import datetime, timezone
from typing import Optional
import math

from app.db.session import get_db
from app.dependencies.permissions import require_roles
from app.middleware.exception_handler import response_handler

from app.models.term import Term
from app.models.course import Course
from app.models.course_question import CourseQuestion
from app.models.audit_logs import AuditLog
from app.schemas.course_question import QuestionCreate, QuestionUpdate, ToggleQuestionApproveStatus, QuestionOut, ToggleQuestionDeleteStatus
from app.enums.course import QuestionSort
from app.enums.audit_logs import ActionTypes
from app.enums.user import UserRoleEnum


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
            raise HTTPException(status_code=403, detail=f"You do not have the active role '{x_active_role}' or it is not assigned/enabled for you.")

        course = db.query(Course).filter(Course.id == course_id, Course.deleted_at.is_(None)).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        if data.term_id:
            term = db.query(Term).filter(Term.id == data.term_id, Term.deleted_at.is_(None)).first()
            if not term:
                raise HTTPException(status_code=404, detail="Term not found or inactive")

        if data.parent_id:
            if not is_staff:
                raise HTTPException(status_code=403, detail="Only staff can reply to questions.")

            parent_question = db.query(CourseQuestion).filter(
                CourseQuestion.id == data.parent_id,
                CourseQuestion.course_id == course_id,
                CourseQuestion.is_approved == True,
                CourseQuestion.deleted_at.is_(None)
            ).options(
                selectinload(CourseQuestion.replies)
            ).first()

            if not parent_question:
                raise HTTPException(status_code=404, detail="Parent question not found in this course.")
            if parent_question.parent_id is not None:
                raise HTTPException(status_code=400, detail="Cannot reply to a reply.")
            
            if parent_question.sender_role != UserRoleEnum.student:
                raise HTTPException(status_code=400, detail="Only student questions can receive replies.")
          
            if parent_question.replies:
                raise HTTPException(status_code=409, detail="This question already has a reply.")
                
            if parent_question.sender_id == user_id:
                raise HTTPException(status_code=400, detail="You cannot reply to your own question.")

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
        db.flush()

        new_log = AuditLog(
            user_id=user_id, 
            entity_id=new_question.id, 
            entity_type="course_questions",
            action=ActionTypes.create, 
            changed_fields=["message"]
        )
        db.add(new_log)

        db.commit()
        db.refresh(new_question)

        return response_handler(
            status=True, 
            message="Question created successfully",
            data=QuestionOut.model_validate(new_question).model_dump(), 
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback(); 
        raise http_error
    except ValueError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Invalid active role")
    except IntegrityError:
        db.rollback(); 
        raise HTTPException(status_code=409, detail="Data conflict occurred")
    except Exception:
        db.rollback(); 
        raise HTTPException(status_code=500, detail="Failed to create question")


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
            raise HTTPException(status_code=404, detail="Course not found")

        if term_id:
            db_term = db.query(Term).filter(Term.id == term_id, Term.deleted_at.is_(None)).first()
            if not db_term:
                raise HTTPException(status_code=404, detail="Term not found")

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

        return response_handler(
            status=True, 
            message="Questions retrieved successfully",
            data={
                "questions": question_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch questions")


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
            raise HTTPException(status_code=403, detail=f"You do not have the active role '{x_active_role}' or it is not assigned/enabled for you.")

        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id, CourseQuestion.deleted_at.is_(None)).options(
            selectinload(CourseQuestion.replies)
        ).first()
        if not db_question:
            raise HTTPException(status_code=404, detail="Question not found.")

        if db_question.sender_id != user_id and not is_staff:
            raise HTTPException(status_code=403, detail="You can only edit your own questions.")

        if db_question.replies and len(db_question.replies) > 0:
            raise HTTPException(status_code=400, detail="Cannot edit question that has received replies.")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        for key, value in update_data.items():
            setattr(db_question, key, value)

        if not is_staff:
            db_question.is_approved = False

        new_log = AuditLog(
            user_id=user_id,
            entity_id=db_question.id,
            entity_type="course_questions",
            action=ActionTypes.update,
            changed_fields=list(update_data.keys())
        )
        db.add(new_log)

        db.commit()
        db.refresh(db_question)

        return response_handler(
            status=True,
            message="Question updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValueError:
        db.rollback()
        raise HTTPException(status_code=422, detail="Invalid active role")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update question")


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
            raise HTTPException(status_code=404, detail="Question not found")

        if db_question.is_approved == data.is_approved:
            raise HTTPException(status_code=409, detail=f"Question is already {"approved" if data.is_approved else "unapproved"}")

        db_question.is_approved = data.is_approved

        new_log = AuditLog(
            user_id=user_id,
            entity_id=db_question.id,
            entity_type="course_questions",
            action=ActionTypes.update,
            changed_fields=["is_approved"]
        )
        db.add(new_log)

        db.commit()
        db.refresh(db_question)

        return response_handler(
            status=True,
            message="Question approval status updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update approval status")


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
            raise HTTPException(status_code=404, detail="Question not found")

        if (db_question.deleted_at is not None) == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"Question is already {"deleted" if data.is_deleted else "restored"}")

        db_question.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None

        new_log = AuditLog(
            user_id=user_id,
            entity_id=db_question.id,
            entity_type="course_questions",
            action=ActionTypes.update,
            changed_fields=["deleted_at"]
        )
        db.add(new_log)

        db.commit()
        db.refresh(db_question)

        return response_handler(
            status=True,
            message="Question delete status updated successfully",
            data=QuestionOut.model_validate(db_question).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update delete status")


@router.delete("/{question_id}")
def delete_question(
    question_id: UUID,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        db_question = db.query(CourseQuestion).filter(CourseQuestion.id == question_id).options(
            selectinload(CourseQuestion.replies)
        ).first()
        if not db_question:
            raise HTTPException(status_code=404, detail="Question not found")

        replies_count = len(db_question.replies)

        db.delete(db_question)

        new_log = AuditLog(
            user_id=user_id,
            entity_id=question_id,
            entity_type="course_questions",
            action=ActionTypes.delete,
            changed_fields=["deleted"]
        )
        db.add(new_log)

        db.commit()

        return response_handler(
            status=True,
            message="Question deleted successfully",
            data={"deleted_replies_count": replies_count},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete question")

