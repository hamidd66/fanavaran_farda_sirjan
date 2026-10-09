from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data
from app.utils.delete_file import delete_file

from app.models.course import Course
from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission
from app.models.user import User
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentOut
from app.enums.user import UserRole
from app.enums.assignment import AssignmentType, AssignmentSort


router = APIRouter(prefix="/assignments", tags=["Assignments"])


@router.post("/{course_id}")
def create_assignment(
    course_id: str,
    data: AssignmentCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        if data.session_number > db_course.sessions_count:
            raise HTTPException(status_code=400, detail=f"Session number cannot exceed course sessions_count ({db_course.sessions_count})")

        db_user = get_user_data(db, User.id == current_user_id, first=True)
        if not db_user or not db_user.staff:
            raise HTTPException(status_code=403, detail="Access denied")

        creator_id = db_user.staff.id

        assignment_data = data.model_dump(exclude_unset=True)
        db_assignment = Assignment(**assignment_data, course_id = course_id, created_by = creator_id)

        db.add(db_assignment)
        db.commit()
        db.refresh(db_assignment)

        return response_handler(
            status=True,
            message="Assignment created successfully",
            data=AssignmentOut.model_validate(db_assignment).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Assignment with this title already exists in this session")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create assignment")


@router.get("/")
def get_assignments(
    db: Session = Depends(get_db),
    course_id: Optional[str] = Query(None),
    session_number: Optional[int] = Query(None, ge=1),
    assignment_type: Optional[AssignmentType] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[AssignmentSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        submissions_count_subq = (
            select(func.count(AssignmentSubmission.id))
            .where(AssignmentSubmission.assignment_id == Assignment.id)
            .correlate(Assignment)
            .scalar_subquery()
        )

        query = db.query(
            Assignment,
            submissions_count_subq.label("submissions_count")
        ).options(
            joinedload(Assignment.course),
            joinedload(Assignment.staff),
        )

        if course_id:
            db_course = db.query(Course).filter(Course.id == course_id).first()
            if not db_course:
                raise HTTPException(status_code=404, detail="Course not found")
            query = query.filter(Assignment.course_id == course_id)

        if session_number is not None:
            query = query.filter(Assignment.session_number == session_number)

        if assignment_type is not None:
            query = query.filter(Assignment.assignment_type == assignment_type.value)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Assignment.title.ilike(search_term),
                    Assignment.description.ilike(search_term)
                )
            )

        if sort == AssignmentSort.newest:
            query = query.order_by(Assignment.created_at.desc())
        elif sort == AssignmentSort.oldest:
            query = query.order_by(Assignment.created_at.asc())
        elif sort == AssignmentSort.session_asc:
            query = query.order_by(Assignment.session_number.asc(), Assignment.created_at.asc())
        elif sort == AssignmentSort.session_desc:
            query = query.order_by(Assignment.session_number.desc(), Assignment.created_at.desc())
        elif sort == AssignmentSort.title_asc:
            query = query.order_by(Assignment.title.asc())
        elif sort == AssignmentSort.title_desc:
            query = query.order_by(Assignment.title.desc())
        else:
            query = query.order_by(Assignment.session_number.asc(), Assignment.created_at.asc())

        total_count = query.count()
        results = query.offset((page - 1) * limit).limit(limit).all()

        assignments_data = []
        for row in results:
            db_assignment = row[0]
            submissions_count = row[1]

            assignment_dict = AssignmentOut.model_validate(db_assignment).model_dump()
            assignment_dict["submissions_count"] = submissions_count
            assignments_data.append(assignment_dict)

        return response_handler(
            status=True,
            message="Assignments retrieved successfully",
            data={
                "assignments": assignments_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch assignments")


@router.get("/{assignment_id}")
def get_assignment(
    assignment_id: str,
    db: Session = Depends(get_db)
):
    try:
        db_assignment = db.query(Assignment).options(
            joinedload(Assignment.course),
            joinedload(Assignment.staff),
        ).filter(Assignment.id == assignment_id).first()
        if not db_assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        submissions_count = db.query(func.count(AssignmentSubmission.id)).filter(
            AssignmentSubmission.assignment_id == assignment_id
        ).scalar()

        assignment_dict = AssignmentOut.model_validate(db_assignment).model_dump()
        assignment_dict["submissions_count"] = submissions_count

        return response_handler(
            status=True,
            message="Assignment retrieved successfully",
            data=assignment_dict,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch assignment")


@router.patch("/{assignment_id}")
def update_assignment(
    assignment_id: str,
    data: AssignmentUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_role = payload.get("role")
        current_user_id = payload.get("sub")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_assignment = db.query(Assignment).options(
            joinedload(Assignment.course)
        ).filter(Assignment.id == assignment_id).first()
        if not db_assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_assignment.created_by != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only edit your own assignments")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        db_course = db_assignment.course

        if "session_number" in update_data:
            if update_data["session_number"] > db_course.sessions_count:
                raise HTTPException(status_code=400, detail=f"Session number cannot exceed {db_course.sessions_count}")

        old_file = None
        if "file" in update_data and db_assignment.file and db_assignment.file != update_data["file"]:
            old_file = db_assignment.file

        if "assignment_type" in update_data and update_data["assignment_type"] is not None:
            update_data["assignment_type"] = update_data["assignment_type"].value

        for key, value in update_data.items():
            setattr(db_assignment, key, value)

        db.commit()
        db.refresh(db_assignment)

        if old_file:
            delete_file(old_file)

        return response_handler(
            status=True,
            message="Assignment updated successfully",
            data=AssignmentOut.model_validate(db_assignment).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Assignment with this title already exists in this session")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update assignment")


@router.delete("/{assignment_id}")
def delete_assignment(
    assignment_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
        if not db_assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_assignment.created_by != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only delete your own assignments")

        submissions_count = db.query(func.count(AssignmentSubmission.id)).filter(
            AssignmentSubmission.assignment_id == assignment_id
        ).scalar()

        file_to_delete = db_assignment.file

        db.delete(db_assignment)
        db.commit()

        if file_to_delete:
            delete_file(file_to_delete)

        return response_handler(
            status=True,
            message="Assignment deleted successfully",
            data={
                "id": assignment_id,
                "submissions_deleted": submissions_count
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete assignment")
