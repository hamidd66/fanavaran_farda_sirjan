from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data
from app.utils.delete_file import delete_file

from app.models.classroom import Classroom
from app.models.classroom_session import ClassroomSession
from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission
from app.models.assignment_review import AssignmentReview
from app.models.enrollment import Enrollment
from app.models.user import User
from app.models.student import Student
from app.schemas.assignment_submission import AssignmentSubmissionCreate, AssignmentSubmissionOut, AssignmentSubmissionUpdate
from app.enums.user import UserRole
from app.enums.assignment import SubmissionStatus, AssignmentSubmissionSort, ReviewStatus


router = APIRouter(prefix="/assignment_submissions", tags=["Assignment submissions"])


@router.post("assignment/{assignment_id}/session/{classroom_session_id}")
def create_assignment_submission(
    assignment_id: str,
    classroom_session_id: str,
    data: AssignmentSubmissionCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role != UserRole.user.value:
            raise HTTPException(status_code=403, detail="Only students can submit assignments")

        db_assignment = db.query(Assignment).options(
            joinedload(Assignment.course)
        ).filter(Assignment.id == assignment_id).first()
        if not db_assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        db_session = db.query(ClassroomSession).filter(ClassroomSession.id == classroom_session_id).first()
        if not db_session:
            raise HTTPException(status_code=404, detail="Classroom session not found")

        now = datetime.now(timezone.utc)
        session_end_datetime = datetime.combine(db_session.session_date, db_session.end_time.time())
        if now > session_end_datetime:
            raise HTTPException(status_code=400, detail=f"Cannot submit assignment after session has ended. Session ended at {session_end_datetime}")

        is_enrolled = db.query(Enrollment).filter(
            and_(
                Enrollment.classroom_id == db_session.classroom_id,
                Enrollment.student_id == current_user_id
            )
        ).first()
        if not is_enrolled:
            raise HTTPException(status_code=403, detail="You are not enrolled in this classroom")

        max_attempt = db.query(func.max(AssignmentSubmission.attempt_number)).filter(
            and_(
                AssignmentSubmission.assignment_id == assignment_id,
                AssignmentSubmission.student_id == current_user_id
            )
        ).scalar()

        attempt_number = (max_attempt or 0) + 1

        db_submission = AssignmentSubmission(
            assignment_id = assignment_id,
            classroom_session_id = classroom_session_id,
            student_id = current_user_id,
            status = SubmissionStatus.pending_review.value,
            attempt_number = attempt_number,
            description = data.description,
            file = data.file,
        )

        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)

        return response_handler(
            status=True,
            message="Assignment submitted successfully",
            data=AssignmentSubmissionOut.model_validate(db_submission).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Duplicate submission for this assignment"
        )
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to submit assignment")


@router.get("/")
def get_assignment_submissions(
    db: Session = Depends(get_db),
    payload = Depends(get_payload),
    assignment_id: Optional[str] = Query(None),
    classroom_session_id: Optional[str] = Query(None),
    student_id: Optional[str] = Query(None),
    status: Optional[SubmissionStatus] = Query(None),
    sort: Optional[AssignmentSubmissionSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        reviews_count_subq = (
            select(func.count(AssignmentReview.id))
            .where(AssignmentReview.submission_id == AssignmentSubmission.id)
            .correlate(AssignmentSubmission)
            .scalar_subquery()
        )

        latest_grade_subq = (
            select(AssignmentReview.grade)
            .where(
                and_(
                    AssignmentReview.submission_id == AssignmentSubmission.id,
                    AssignmentReview.status == ReviewStatus.approved
                )
            )
            .correlate(AssignmentSubmission)
            .scalar_subquery()
        )

        query = db.query(
            AssignmentSubmission,
            reviews_count_subq.label("reviews_count"),
            latest_grade_subq.label("latest_grade")
        ).options(
            joinedload(AssignmentSubmission.assignment),
            joinedload(AssignmentSubmission.student),
        )

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)
            
            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")

            teacher_staff_id = db_user.staff.id

            query = query.join(ClassroomSession).join(Classroom).filter(
                Classroom.teacher_id == teacher_staff_id
            )

        elif current_role == UserRole.user.value:
            if not student_id or student_id != current_user_id:
                raise HTTPException(status_code=403, detail="Access denied")
                
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        if assignment_id:
            query = query.filter(AssignmentSubmission.assignment_id == assignment_id)

        if classroom_session_id:
            query = query.filter(AssignmentSubmission.classroom_session_id == classroom_session_id)

        if student_id:
            query = query.filter(AssignmentSubmission.student_id == student_id)

        if status is not None:
            query = query.filter(AssignmentSubmission.status == status.value)

        if sort == AssignmentSubmissionSort.newest:
            query = query.order_by(AssignmentSubmission.created_at.desc())
        elif sort == AssignmentSubmissionSort.oldest:
            query = query.order_by(AssignmentSubmission.created_at.asc())
        elif sort == AssignmentSubmissionSort.attempt_asc:
            query = query.order_by(AssignmentSubmission.attempt_number.asc())
        elif sort == AssignmentSubmissionSort.attempt_desc:
            query = query.order_by(AssignmentSubmission.attempt_number.desc())
        elif sort == AssignmentSubmissionSort.name_asc:
            query = query.join(Student).order_by(Student.full_name.asc())
        elif sort == AssignmentSubmissionSort.name_desc:
            query = query.join(Student).order_by(Student.full_name.desc())
        else:
            query = query.order_by(AssignmentSubmission.created_at.desc())

        total_count = query.count()
        results = query.offset((page - 1) * limit).limit(limit).all()

        submissions_data = []
        for row in results:
            db_submission = row[0]
            reviews_count = row[1]
            latest_grade = row[2]

            submission_dict = AssignmentSubmissionOut.model_validate(db_submission).model_dump()
            submission_dict["reviews_count"] = reviews_count
            submission_dict["latest_grade"] = latest_grade
            submissions_data.append(submission_dict)

        return response_handler(
            status=True,
            message="Submissions retrieved successfully",
            data={
                "submissions": submissions_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch submissions")


@router.get("/{submission_id}")
def get_assignment_submission(
    submission_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_submission = db.query(AssignmentSubmission).options(
            joinedload(AssignmentSubmission.assignment),
            joinedload(AssignmentSubmission.student),
        ).filter(AssignmentSubmission.id == submission_id).first()

        if not db_submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            db_classroom_session = db.query(ClassroomSession).options(
                joinedload(ClassroomSession.classroom)
            ).filter(ClassroomSession.id == db_submission.classroom_session_id).first()

            if not db_classroom_session or db_classroom_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")
            
        elif current_role == UserRole.user.value:
            if db_submission.student_id != current_user_id:
                raise HTTPException(status_code=403, detail="Access denied")
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        reviews_count = db.query(func.count(AssignmentReview.id)).filter(
            AssignmentReview.submission_id == submission_id
        ).scalar()

        latest_grade = db.query(AssignmentReview.grade).filter(
            and_(
                AssignmentReview.submission_id == submission_id,
                AssignmentReview.status == ReviewStatus.approved
            )
        ).scalar()

        submission_dict = AssignmentSubmissionOut.model_validate(db_submission).model_dump()
        submission_dict["reviews_count"] = reviews_count
        submission_dict["latest_grade"] = latest_grade

        return response_handler(
            status=True,
            message="Submission retrieved successfully",
            data=submission_dict,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch submission")


@router.patch("/{submission_id}")
def update_assignment_submission(
    submission_id: str,
    data: AssignmentSubmissionUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")
        
        if current_role != UserRole.user.value:
            raise HTTPException(status_code=403, detail="Only students can edit the assignments")

        db_submission = db.query(AssignmentSubmission).filter(
            AssignmentSubmission.id == submission_id
        ).first()
        if not db_submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        if db_submission.student_id != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        if db_submission.status == SubmissionStatus.reviewed:
            raise HTTPException(status_code=400, detail="Cannot edit submission after it has been reviewed")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        old_file = None
        if "file" in update_data and db_submission.file and db_submission.file != update_data["file"]:
            old_file = db_submission.file

        for key, value in update_data.items():
            setattr(db_submission, key, value)

        db.commit()
        db.refresh(db_submission)

        if old_file:
            delete_file(old_file)

        return response_handler(
            status=True,
            message="Submission updated successfully",
            data=AssignmentSubmissionOut.model_validate(db_submission).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update submission")


@router.delete("/{submission_id}")
def delete_assignment_submission(
    submission_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")
        
        if current_role != UserRole.user.value:
            raise HTTPException(status_code=403, detail="Only students can delete assignments")

        db_submission = db.query(AssignmentSubmission).filter(
            AssignmentSubmission.id == submission_id
        ).first()
        if not db_submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        if db_submission.student_id != current_user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        if db_submission.status == SubmissionStatus.reviewed:
            raise HTTPException(status_code=400, detail="Cannot delete submission after it has been reviewed")
            
        reviews_count = db.query(func.count(AssignmentReview.id)).filter(
            AssignmentReview.submission_id == submission_id
        ).scalar()

        file_to_delete = db_submission.file

        db.delete(db_submission)
        db.commit()

        if file_to_delete:
            delete_file(file_to_delete)

        return response_handler(
            status=True,
            message="Submission deleted successfully",
            data={
                "id": submission_id,
                "reviews_deleted": reviews_count
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete submission")

