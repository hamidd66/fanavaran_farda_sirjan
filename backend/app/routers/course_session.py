from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, func, and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload, get_optional_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.course import Course
from app.models.classroom import Classroom
from app.models.enrollment import Enrollment
from app.models.course_session import CourseSession
from app.models.user import User
from app.schemas.course_session import CourseSessionCreate, CourseSessionOut, CourseSessionUpdate, CourseSessionBrief
from app.enums.user import UserRole
from app.enums.course import SessionType, CourseSessionSort


router = APIRouter(prefix="/course_sessions", tags=["Course sessions"])


@router.post("/{course_id}")
def create_course_session(
    course_id: str,
    data: CourseSessionCreate,
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

        db_user = get_user_data(db, User.id == current_user_id, first=True)
        if not db_user or not db_user.staff:
            raise HTTPException(status_code=403, detail="Access denied")

        creator_id = db_user.staff.id

        if data.session_number is None:
            max_session = db.query(func.max(CourseSession.session_number)).filter(
                CourseSession.course_id == course_id
            ).scalar()
            session_number = (max_session or 0) + 1

        else:
            session_number = data.session_number
            existing = db.query(CourseSession).filter(
                and_(
                    CourseSession.course_id == course_id,
                    CourseSession.session_number == session_number
                )
            ).first()
            if existing:
                raise HTTPException(status_code=409, detail=f"Session number {session_number} already exists in this course")

        if session_number > db_course.sessions_count:
            raise HTTPException(status_code=400, detail=f"Session number cannot exceed course sessions_count ({db_course.sessions_count})")

        session_data = data.model_dump(exclude={"session_number"})

        db_session = CourseSession(
            **session_data,
            course_id = course_id,
            session_number = session_number,
            created_by = creator_id,
        )

        db.add(db_session)
        db.commit()
        db.refresh(db_session)

        return response_handler(
            status=True,
            message="Course session created successfully",
            data=CourseSessionOut.model_validate(db_session).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Session number already exists in this course")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create course session")


@router.get("/")
def get_course_sessions(
    db: Session = Depends(get_db),
    payload = Depends(get_optional_payload),
    course_id: Optional[str] = Query(None),
    session_type: Optional[SessionType] = Query(None),
    is_free_preview: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[CourseSessionSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        current_user_id = payload.get("sub") if payload else None
        current_role = payload.get("role") if payload else None

        query = db.query(CourseSession).options(
            joinedload(CourseSession.course),
            joinedload(CourseSession.staff),
        )

        if course_id:
            db_course = db.query(Course).filter(Course.id == course_id).first()
            if not db_course:
                raise HTTPException(status_code=404, detail="Course not found")
            
            query = query.filter(CourseSession.course_id == course_id)

        if session_type is not None:
            query = query.filter(CourseSession.session_type == session_type.value)

        if is_free_preview is not None:
            query = query.filter(CourseSession.is_free_preview == is_free_preview)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    CourseSession.title.ilike(search_term),
                    CourseSession.description.ilike(search_term)
                )
            )

        db_user = get_user_data(db, User.id == current_user_id, first=True)
        enrolled_course_ids = set()

        if current_role == UserRole.user.value and current_user_id:
            enrolled_results = db.query(Classroom.course_id).join(
                Enrollment, Enrollment.classroom_id == Classroom.id
            ).filter(
                Enrollment.student_id == db_user.student.id
            ).all()
            enrolled_course_ids = {r.course_id for r in enrolled_results}

        if sort == CourseSessionSort.session_asc:
            query = query.order_by(CourseSession.session_number.asc())
        elif sort == CourseSessionSort.session_desc:
            query = query.order_by(CourseSession.session_number.desc())
        elif sort == CourseSessionSort.newest:
            query = query.order_by(CourseSession.created_at.desc())
        elif sort == CourseSessionSort.oldest:
            query = query.order_by(CourseSession.created_at.asc())
        elif sort == CourseSessionSort.title_asc:
            query = query.order_by(CourseSession.title.asc())
        elif sort == CourseSessionSort.title_desc:
            query = query.order_by(CourseSession.title.desc())
        else:
            query = query.order_by(CourseSession.session_number.asc())

        total_count = query.count()
        db_sessions = query.offset((page - 1) * limit).limit(limit).all()

        sessions_data = []
        for session in db_sessions:

            if session.is_free_preview:
                session_dict = CourseSessionOut.model_validate(session).model_dump()

            elif current_role in {UserRole.admin.value, UserRole.teacher.value}:
                session_dict = CourseSessionOut.model_validate(session).model_dump()

            elif current_role == UserRole.user.value and session.course_id in enrolled_course_ids:
                session_dict = CourseSessionOut.model_validate(session).model_dump()
                
            else:
                session_dict = CourseSessionBrief.model_validate(session).model_dump()

            sessions_data.append(session_dict)

        return response_handler(
            status=True,
            message="Course sessions retrieved successfully",
            data={
                "sessions": sessions_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch course sessions")


@router.get("/{session_id}")
def get_course_session(
    session_id: str,
    payload = Depends(get_optional_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub") if payload else None
        current_role = payload.get("role") if payload else None

        db_session = db.query(CourseSession).options(
            joinedload(CourseSession.course),
            joinedload(CourseSession.staff),
        ).filter(CourseSession.id == session_id).first()
        if not db_session:
            raise HTTPException(status_code=404, detail="Course session not found")

        has_full_access = False

        if db_session.is_free_preview:
            has_full_access = True

        elif current_role in {UserRole.admin.value, UserRole.teacher.value}:
            has_full_access = True

        elif current_role == UserRole.user.value and current_user_id:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            is_enrolled = db.query(Enrollment).join(Classroom).filter(
                and_(
                    Classroom.course_id == db_session.course_id,
                    Enrollment.student_id == db_user.student.id
                )
            ).first()
            
            if is_enrolled:
                has_full_access = True
            else:
                has_full_access = False
        else:
            has_full_access = False

        if has_full_access:
            session_data = CourseSessionOut.model_validate(db_session).model_dump()
        else:
            session_data = CourseSessionBrief.model_validate(db_session).model_dump()

        return response_handler(
            status=True,
            message="Course session retrieved successfully",
            data=session_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch course session")

    
@router.patch("/{session_id}")
def update_course_session(
    session_id: str,
    data: CourseSessionUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_session = db.query(CourseSession).options(
            joinedload(CourseSession.course)
        ).filter(CourseSession.id == session_id).first()

        if not db_session:
            raise HTTPException(status_code=404, detail="Course session not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_session.created_by != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only edit your own course sessions")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        db_course = db_session.course

        if "session_number" in update_data:
            new_session_number = update_data["session_number"]

            if new_session_number != db_session.session_number:
                if new_session_number > db_course.sessions_count:
                    raise HTTPException(status_code=400, detail=f"Session number cannot exceed {db_course.sessions_count}")

                existing = db.query(CourseSession).filter(
                    and_(
                        CourseSession.course_id == db_course.id,
                        CourseSession.session_number == new_session_number,
                        CourseSession.id != session_id
                    )
                ).first()
                if existing:
                    raise HTTPException(status_code=409, detail=f"Session number {new_session_number} already exists")

        if "session_type" in update_data and update_data["session_type"] is not None:
            update_data["session_type"] = update_data["session_type"].value

        for key, value in update_data.items():
            setattr(db_session, key, value)

        db.commit()
        db.refresh(db_session)

        return response_handler(
            status=True,
            message="Course session updated successfully",
            data=CourseSessionOut.model_validate(db_session).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Session number already exists in this course")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update course session")


@router.delete("/{session_id}")
def delete_course_session(
    session_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_session = db.query(CourseSession).filter(CourseSession.id == session_id).first()
        if not db_session:
            raise HTTPException(status_code=404, detail="Course session not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_session.created_by != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only delete your own course sessions")

        db.delete(db_session)
        db.commit()

        return response_handler(
            status=True,
            message="Course session deleted successfully",
            data={"id": session_id},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete course session")
