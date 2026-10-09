from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data
from app.utils.delete_file import delete_file

from app.models.classroom import Classroom
from app.models.classroom_session import ClassroomSession
from app.models.assignment_submission import AssignmentSubmission
from app.models.assignment_review import AssignmentReview
from app.models.user import User
from app.schemas.assignment_review import AssignmentReviewCreate, AssignmentReviewOut, AssignmentReviewUpdate
from app.enums.user import UserRole
from app.enums.assignment import SubmissionStatus, AssignmentReviewSort, ReviewStatus


router = APIRouter(prefix="/assignment_reviews", tags=["Assignment reviews"])


@router.post("/{submission_id}")
def create_assignment_review(
    submission_id: str,
    data: AssignmentReviewCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_submission = db.query(AssignmentSubmission).options(
            joinedload(AssignmentSubmission.classroom_session).joinedload(ClassroomSession.classroom),
            joinedload(AssignmentSubmission.assignment),
        ).filter(AssignmentSubmission.id == submission_id).first()
        if not db_submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        db_classroom = db_submission.classroom_session.classroom

        reviewer_id = None
        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only review submissions of your own classrooms")
            
            reviewer_id = db_user.staff.id
        else:
            if db_user and db_user.staff:
                reviewer_id = db_user.staff.id

        db.query(AssignmentReview).filter(
            AssignmentReview.submission_id == submission_id,
            AssignmentReview.is_latest == True
        ).update({"is_latest": False})

        db_review = AssignmentReview(
            submission_id = submission_id,
            staff_id = reviewer_id,
            status = data.status,
            grade = data.grade,
            description = data.description,
            file = data.file,
            is_latest = True,
        )

        db.add(db_review)

        db_submission.status = SubmissionStatus.reviewed.value

        db.commit()
        db.refresh(db_review)

        return response_handler(
            status=True,
            message="Review created successfully",
            data=AssignmentReviewOut.model_validate(db_review).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create review")


@router.get("/")
def get_assignment_reviews(
    db: Session = Depends(get_db),
    payload = Depends(get_payload),
    submission_id: Optional[str] = Query(None),
    staff_id: Optional[str] = Query(None),
    status: Optional[ReviewStatus] = Query(None),
    is_latest: Optional[bool] = Query(None),
    sort: Optional[AssignmentReviewSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        query = db.query(AssignmentReview).options(
            joinedload(AssignmentReview.assignment_submission),
            joinedload(AssignmentReview.staff),
        )

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")

            teacher_staff_id = db_user.staff.id

            query = query.join(AssignmentSubmission).join(ClassroomSession).join(Classroom).filter(
                Classroom.teacher_id == teacher_staff_id
            )

        elif current_role == UserRole.user.value:
            
            if not db_user or not db_user.student:
                raise HTTPException(status_code=403, detail="Access denied")
            
            query = query.join(AssignmentSubmission).filter(
                AssignmentSubmission.student_id == db_user.student.id
            )

        else:
            raise HTTPException(status_code=403, detail="Access denied")

        if submission_id:
            query = query.filter(AssignmentReview.submission_id == submission_id)

        if staff_id:
            query = query.filter(AssignmentReview.staff_id == staff_id)

        if status is not None:
            query = query.filter(AssignmentReview.status == status.value)

        if is_latest is not None:
            query = query.filter(AssignmentReview.is_latest == is_latest)

        if sort == AssignmentReviewSort.newest:
            query = query.order_by(AssignmentReview.created_at.desc())
        elif sort == AssignmentReviewSort.oldest:
            query = query.order_by(AssignmentReview.created_at.asc())
        elif sort == AssignmentReviewSort.grade_desc:
            query = query.order_by(AssignmentReview.grade.desc().nullslast())
        elif sort == AssignmentReviewSort.grade_asc:
            query = query.order_by(AssignmentReview.grade.asc().nullsfirst())
        else:
            query = query.order_by(AssignmentReview.created_at.desc())

        total_count = query.count()
        db_reviews = query.offset((page - 1) * limit).limit(limit).all()

        reviews_data = [
            AssignmentReviewOut.model_validate(review).model_dump()
            for review in db_reviews
        ]

        return response_handler(
            status=True,
            message="Reviews retrieved successfully",
            data={
                "reviews": reviews_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch reviews")


@router.get("/{review_id}")
def get_assignment_review(
    review_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_review = db.query(AssignmentReview).options(
            joinedload(AssignmentReview.assignment_submission)
                .joinedload(AssignmentSubmission.classroom_session)
                .joinedload(ClassroomSession.classroom),
            joinedload(AssignmentReview.staff),
        ).filter(AssignmentReview.id == review_id).first()
        if not db_review:
            raise HTTPException(status_code=404, detail="Review not found")

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            db_classroom = db_review.assignment_submission.classroom_session.classroom
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")
            
        elif current_role == UserRole.user.value:

            if not db_user or not db_user.student:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_review.assignment_submission.student_id != db_user.student.id:
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        return response_handler(
            status=True,
            message="Review retrieved successfully",
            data=AssignmentReviewOut.model_validate(db_review).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch review")


@router.patch("/{review_id}")
def update_assignment_review(
    review_id: str,
    data: AssignmentReviewUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_review = db.query(AssignmentReview).options(
            joinedload(AssignmentReview.assignment_submission)
                .joinedload(AssignmentSubmission.classroom_session)
                .joinedload(ClassroomSession.classroom),
        ).filter(AssignmentReview.id == review_id).first()

        if not db_review:
            raise HTTPException(status_code=404, detail="Review not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            db_classroom = db_review.assignment_submission.classroom_session.classroom
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        old_file = None
        if "file" in update_data and db_review.file and db_review.file != update_data["file"]:
            old_file = db_review.file

        if "status" in update_data and update_data["status"] is not None:
            update_data["status"] = update_data["status"].value

        for key, value in update_data.items():
            setattr(db_review, key, value)

        db.commit()
        db.refresh(db_review)

        if old_file:
            delete_file(old_file)

        return response_handler(
            status=True,
            message="Review updated successfully",
            data=AssignmentReviewOut.model_validate(db_review).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update review")

# این روت باید برداشته بشه
@router.delete("/{review_id}")
def delete_assignment_review(
    review_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_review = db.query(AssignmentReview).options(
            joinedload(AssignmentReview.assignment_submission)
                .joinedload(AssignmentSubmission.classroom_session)
                .joinedload(ClassroomSession.classroom),
        ).filter(AssignmentReview.id == review_id).first()
        if not db_review:
            raise HTTPException(status_code=404, detail="Review not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)
            
            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            db_classroom = db_review.assignment_submission.classroom_session.classroom
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")

        file_to_delete = db_review.file
        
        submission_id = db_review.submission_id
        created_at = db_review.created_at
        is_latest = db_review.is_latest
        db_submission = db_review.assignment_submission
        
        assignment_id = db_submission.assignment_id
        student_id = db_submission.student_id
        classroom_session_id = db_submission.classroom_session_id

        db.delete(db_review)

        db_submission.status = SubmissionStatus.pending_review.value

        if is_latest:
            previous_review = db.query(AssignmentReview).join(AssignmentSubmission).filter(
                and_(
                    AssignmentSubmission.student_id == student_id,
                    AssignmentSubmission.assignment_id == assignment_id,
                    AssignmentSubmission.classroom_session_id == classroom_session_id,
                    AssignmentReview.id != review_id,
                )
            ).order_by(AssignmentReview.created_at.desc()).first()

            if previous_review:
                db.query(AssignmentReview).filter(
                    AssignmentReview.submission_id.in_(
                        db.query(AssignmentSubmission.id).filter(
                            and_(
                                AssignmentSubmission.student_id == student_id,
                                AssignmentSubmission.assignment_id == assignment_id,
                                AssignmentSubmission.classroom_session_id == classroom_session_id,
                            )
                        )
                    ),
                    AssignmentReview.id != review_id,
                ).update({"is_latest": False})
                
                previous_review.is_latest = True
            else:
                db.query(AssignmentSubmission).filter(
                    and_(
                        AssignmentSubmission.student_id == student_id,
                        AssignmentSubmission.assignment_id == assignment_id,
                        AssignmentSubmission.classroom_session_id == classroom_session_id,
                    )
                ).update({"status": SubmissionStatus.pending_review.value})

                
        db.commit()

        if file_to_delete:
            delete_file(file_to_delete)

        return response_handler(
            status=True,
            message="Review deleted successfully",
            data={"id": review_id},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete review")
