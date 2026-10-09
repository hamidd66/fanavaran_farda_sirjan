from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import date
from typing import Optional
import math

from app.db.session import get_db
from app.enums.user import UserRole
from app.models.enrollment import Enrollment
from app.models.user import User
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.classroom import Classroom
from app.models.enrollment import Enrollment
from app.models.classroom_session import ClassroomSession
from app.models.classroom_record import ClassroomRecord
from app.models.user import User
from app.schemas.classroom_session import ClassroomSessionCreate, ClassroomSessionOut, ClassroomSessionUpdate
from app.enums.user import UserRole
from app.enums.classroom import ClassroomSessionSort
from app.enums.course import SessionType


router = APIRouter(prefix="/classroom_sessions", tags=["Classroom sessions"])


@router.post("/{classroom_id}")
def create_classroom_session(
    classroom_id: str,
    data: ClassroomSessionCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        recorder_id = None
        db_user = get_user_data(db, User.id == current_user_id, first=True)
        
        if current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only add sessions to your own classrooms")
            
            recorder_id = db_user.staff.id

        else:
            if db_user and db_user.staff:
                recorder_id = db_user.staff.id

        if data.start_time >= data.end_time:
            raise HTTPException(status_code=400, detail="start_time must be before end_time")

        if data.session_date < db_classroom.start_date or data.session_date > db_classroom.end_date:
            raise HTTPException(status_code=400, detail=f"session_date must be between {db_classroom.start_date} and {db_classroom.end_date}")

        if data.assignment_deadline:
            if data.session_type not in {SessionType.midterm, SessionType.final}:
                raise HTTPException(status_code=400, detail="assignment_deadline is only valid for midterm/final sessions")
            if data.assignment_deadline <= data.end_time:
                raise HTTPException(status_code=400, detail="assignment_deadline must be after end_time")

        max_session = db.query(func.max(ClassroomSession.session_number)).filter(
            ClassroomSession.classroom_id == classroom_id
        ).scalar()
        session_number = (max_session or 0) + 1

        if session_number > db_classroom.sessions_count:
            db_classroom.sessions_count = session_number

        db_session = ClassroomSession(**data, created_by = recorder_id, session_number = session_number, is_completed = False)

        db.add(db_session)
        db.commit()
        db.refresh(db_session)

        return response_handler(
            status=True,
            message="Classroom session created successfully",
            data=ClassroomSessionOut.model_validate(db_session).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Session number already exists in this classroom")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create session")


@router.get("/")
def get_classroom_sessions(
    db: Session = Depends(get_db),
    payload = Depends(get_payload),
    classroom_id: Optional[str] = Query(None),
    session_type: Optional[SessionType] = Query(None),
    is_completed: Optional[bool] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    sort: Optional[ClassroomSessionSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        records_count_subq = (
            select(func.count(ClassroomRecord.id))
            .where(ClassroomRecord.classroom_session_id == ClassroomSession.id)
            .correlate(ClassroomSession)
            .scalar_subquery()
        )

        query = db.query(
            ClassroomSession,
            records_count_subq.label("records_count")
        ).options(
            joinedload(ClassroomSession.staff),
            joinedload(ClassroomSession.classroom),
        )

        if classroom_id:
            db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
            if not db_classroom:
                raise HTTPException(status_code=404, detail="Classroom not found")
            
            query = query.filter(ClassroomSession.classroom_id == classroom_id)

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.admin.value:
            pass
            
        elif current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            teacher_staff_id = db_user.staff.id
            
            if not classroom_id:
                query = query.join(Classroom).filter(Classroom.teacher_id == teacher_staff_id)

            else:
                if db_classroom.teacher_id != teacher_staff_id:
                    raise HTTPException(status_code=403, detail="Access denied")
            
        elif current_role == UserRole.user.value:
            
            if not db_user or not db_user.student:
                raise HTTPException(status_code=403, detail="Access denied")

            student_id = db_user.student.id
            
            query = query.filter(ClassroomSession.is_completed == True)
            
            if classroom_id:
                is_enrolled = db.query(Enrollment).filter(
                    and_(
                        Enrollment.classroom_id == classroom_id,
                        Enrollment.student_id == student_id
                    )
                ).first()
                if not is_enrolled:
                    raise HTTPException(status_code=403, detail="You are not enrolled in this classroom")
                
            else:
                enrolled_classroom_ids = (
                    select(Enrollment.classroom_id)
                    .where(Enrollment.student_id == student_id)
                    .scalar_subquery()
                )
                query = query.filter(
                    ClassroomSession.classroom_id.in_(enrolled_classroom_ids)
                )
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        if session_type is not None:
            query = query.filter(ClassroomSession.session_type == session_type.value)

        if is_completed is not None and current_role != UserRole.user.value:
            query = query.filter(ClassroomSession.is_completed == is_completed)

        if date_from:
            query = query.filter(ClassroomSession.session_date >= date_from)
        if date_to:
            query = query.filter(ClassroomSession.session_date <= date_to)

        if sort == ClassroomSessionSort.session_asc:
            query = query.order_by(ClassroomSession.session_number.asc())
        elif sort == ClassroomSessionSort.session_desc:
            query = query.order_by(ClassroomSession.session_number.desc())
        elif sort == ClassroomSessionSort.date_asc:
            query = query.order_by(ClassroomSession.session_date.asc(), ClassroomSession.start_time.asc())
        elif sort == ClassroomSessionSort.date_desc:
            query = query.order_by(ClassroomSession.session_date.desc(), ClassroomSession.start_time.desc())
        elif sort == ClassroomSessionSort.newest:
            query = query.order_by(ClassroomSession.created_at.desc())
        elif sort == ClassroomSessionSort.oldest:
            query = query.order_by(ClassroomSession.created_at.asc())
        else:
            query = query.order_by(ClassroomSession.session_date.asc(), ClassroomSession.start_time.asc())

        total_count = query.count()
        results = query.offset((page - 1) * limit).limit(limit).all()

        sessions_data = []
        for row in results:
            db_session = row[0]
            records_count = row[1]

            session_dict = ClassroomSessionOut.model_validate(db_session).model_dump()
            session_dict["records_count"] = records_count
            sessions_data.append(session_dict)

        return response_handler(
            status=True,
            message="Classroom sessions retrieved successfully",
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
        raise HTTPException(status_code=500, detail="Failed to fetch sessions")


@router.get("/{session_id}")
def get_classroom_session(
    session_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_session = db.query(ClassroomSession).options(
            joinedload(ClassroomSession.staff),
            joinedload(ClassroomSession.classroom),
        ).filter(ClassroomSession.id == session_id).first()

        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")
            
        elif current_role == UserRole.user.value:
            if not db_session.is_completed:
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        records_count = db.query(func.count(ClassroomRecord.id)).filter(
            ClassroomRecord.classroom_session_id == session_id
        ).scalar()

        session_dict = ClassroomSessionOut.model_validate(db_session).model_dump()
        session_dict["records_count"] = records_count

        return response_handler(
            status=True,
            message="Session retrieved successfully",
            data=session_dict,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch session")


@router.patch("/{session_id}")
def update_classroom_session(
    session_id: str,
    data: ClassroomSessionUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_session = db.query(ClassroomSession).options(
            joinedload(ClassroomSession.classroom)
        ).filter(ClassroomSession.id == session_id).first()

        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        db_classroom = db_session.classroom

        new_date = update_data.get("session_date", db_session.session_date)
        new_start = update_data.get("start_time", db_session.start_time)
        new_end = update_data.get("end_time", db_session.end_time)

        if new_date < db_classroom.start_date or new_date > db_classroom.end_date:
            raise HTTPException(status_code=400, detail=f"session_date must be between {db_classroom.start_date} and {db_classroom.end_date}")
        
        if new_start >= new_end:
            raise HTTPException(status_code=400, detail="start_time must be before end_time")

        if "session_type" in update_data and update_data["session_type"] is not None:
            update_data["session_type"] = update_data["session_type"].value

        for key, value in update_data.items():
            setattr(db_session, key, value)

        db.commit()
        db.refresh(db_session)

        return response_handler(
            status=True,
            message="Session updated successfully",
            data=ClassroomSessionOut.model_validate(db_session).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Session number already exists in this classroom"
        )
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update session")


@router.delete("/{session_id}")
def delete_classroom_session(
    session_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_session = db.query(ClassroomSession).options(
            joinedload(ClassroomSession.classroom)
        ).filter(ClassroomSession.id == session_id).first()

        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")

        if db_session.is_completed:
            raise HTTPException(status_code=400, detail="Cannot delete a completed session")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")

        db_classroom = db_session.classroom

        max_session_number = db.query(func.max(ClassroomSession.session_number)).filter(
            ClassroomSession.classroom_id == db_classroom.id
        ).scalar()
        if db_session.session_number != max_session_number:
            raise HTTPException(status_code=400, detail=f"Can only delete the last session (session {max_session_number}). " f"Current session is {db_session.session_number}.")

        records_count = db.query(func.count(ClassroomRecord.id)).filter(
            ClassroomRecord.classroom_session_id == session_id
        ).scalar()

        db.delete(db_session)

        db_classroom.sessions_count -= 1

        db.commit()

        return response_handler(
            status=True,
            message="Session deleted successfully",
            data={
                "id": session_id,
                "deleted_session_number": db_session.session_number,
                "new_sessions_count": db_classroom.sessions_count,
                "records_deleted": records_count
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete session")
    
