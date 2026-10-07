from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import not_, select, func, and_, exists
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import date
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.classroom import Classroom
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.staff import Staff
from app.models.user import User
from app.schemas.classroom import ClassroomCreate, ClassroomUpdate, ClassroomOut
from app.enums.user import UserRole
from app.enums.classroom import ClassroomSort, HoldingType


router = APIRouter(prefix="/classrooms", tags=["Classrooms"])


@router.post("/{course_id}")
def create_classroom(
    course_id: str,
    data: ClassroomCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        if data.start_date >= data.end_date:
            raise HTTPException(status_code=400, detail="Start date must be before end date")

        db_course = db.query(Course).filter(Course.id == course_id).first()
        if not db_course:
            raise HTTPException(status_code=404, detail="Course not found")

        db_teacher = db.query(Staff).join(User).filter(
            Staff.id == data.teacher_id,
            User.role == UserRole.teacher.value
        ).first()
        if not db_teacher:
            raise HTTPException(status_code=404, detail="Teacher not found or invalid role")

        db_user = get_user_data(db, User.id == payload.get("sub"), first=True)
        if not db_user or not db_user.staff:
            raise HTTPException(status_code=400, detail="Only staff members can create classrooms")

        schedule_data = [item.model_dump(mode='json') for item in data.schedule]
        
        Classroom_data = data.model_dump(exclude={"schedule"})

        db_classroom = Classroom(
            **Classroom_data,
            course_id = course_id,
            schedule = schedule_data,
            created_by = db_user.staff.id,
            tuition = db_course.tuition,
            sessions_count = db_course.sessions_count,
            duration_hours = db_course.duration_hours
        )

        db.add(db_classroom)
        db.commit()
        db.refresh(db_classroom)

        return response_handler(
            status=True,
            message="classroom created successfully",
            data=ClassroomOut.model_validate(db_classroom).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="classroom data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create classroom")


@router.get("/")
def get_classrooms(
    db: Session = Depends(get_db),
    course_id: Optional[str] = Query(None),
    teacher_id: Optional[str] = Query(None),
    student_id: Optional[str] = Query(None),
    holding_type: Optional[HoldingType] = Query(None),
    start_date_from: Optional[date] = Query(None),
    start_date_to: Optional[date] = Query(None),
    is_active: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    sort: Optional[ClassroomSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        enrolled_count_subq = (
            select(func.count(Enrollment.id))
            .where(Enrollment.classroom_id == Classroom.id)
            .correlate(Classroom)
            .scalar_subquery()
        )

        query = db.query(
            Classroom,
            enrolled_count_subq.label("enrolled_count")
        ).options(
            joinedload(Classroom.course),
            joinedload(Classroom.teacher),
        )

        if course_id:
            query = query.filter(Classroom.course_id == course_id)

        if teacher_id:
            query = query.filter(Classroom.teacher_id == teacher_id)

        if student_id:
            query = query.filter(
                exists().where(
                    and_(
                        Enrollment.classroom_id == Classroom.id,
                        Enrollment.student_id == student_id
                    )
                )
            )

        if holding_type is not None:
            query = query.filter(Classroom.holding_type == holding_type.value)

        if start_date_from:
            query = query.filter(Classroom.start_date >= start_date_from)
        if start_date_to:
            query = query.filter(Classroom.start_date <= start_date_to)

        if is_active is not None:
            today = date.today()
            
            active_condition = and_(
                Classroom.start_date <= today,
                Classroom.end_date >= today
            )
            query = query.filter(active_condition if is_active else not_(active_condition))

        if search:
            search_term = f"%{search}%"
            query = query.filter(Classroom.title.ilike(search_term))

        if sort == ClassroomSort.newest:
            query = query.order_by(Classroom.created_at.desc())
        elif sort == ClassroomSort.oldest:
            query = query.order_by(Classroom.created_at.asc())
        elif sort == ClassroomSort.start_date_asc:
            query = query.order_by(Classroom.start_date.asc())
        elif sort == ClassroomSort.start_date_desc:
            query = query.order_by(Classroom.start_date.desc())
        elif sort == ClassroomSort.capacity_asc:
            query = query.order_by(Classroom.capacity.asc())
        elif sort == ClassroomSort.capacity_desc:
            query = query.order_by(Classroom.capacity.desc())
        elif sort == ClassroomSort.tuition_asc:
            query = query.order_by(Classroom.tuition.asc())
        elif sort == ClassroomSort.tuition_desc:
            query = query.order_by(Classroom.tuition.desc())
        else:
            query = query.order_by(Classroom.start_date.asc())

        total_count = query.count()
        
        results = query.offset((page - 1) * limit).limit(limit).all()

        Classrooms_data = []
        for row in results:
            db_classroom = row[0]
            enrolled_count = row[1]

            Classroom_dict = ClassroomOut.model_validate(db_classroom).model_dump()
            Classroom_dict["enrolled_count"] = enrolled_count
            Classrooms_data.append(Classroom_dict)

        return response_handler(
            status=True,
            message="Classrooms retrieved successfully",
            data={
                "classrooms": Classrooms_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch classrooms")


@router.get("/{classroom_id}")
def get_classroom(
    classroom_id: str,
    db: Session = Depends(get_db),
):
    try:
        enrolled_count_subq = (
            select(func.count(Enrollment.id))
            .where(Enrollment.classroom_id == Classroom.id)
            .correlate(Classroom)
            .scalar_subquery()
        )

        db_classroom = db.query(
            Classroom,
            enrolled_count_subq.label("enrolled_count")
        ).options(
            joinedload(Classroom.course),
            joinedload(Classroom.teacher),
        ).filter(Classroom.id == classroom_id).first()

        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        Classroom_dict = ClassroomOut.model_validate(db_classroom[0]).model_dump()
        Classroom_dict["enrolled_count"] = db_classroom[1]

        return response_handler(
            status=True,
            message="Classroom retrieved successfully",
            data=Classroom_dict,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch Classroom")


@router.patch("/{classroom_id}")
def update_classroom(
    classroom_id: str,
    data: ClassroomUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        new_start = update_data.get("start_date", db_classroom.start_date)
        new_end = update_data.get("end_date", db_classroom.end_date)
        if new_start >= new_end:
            raise HTTPException(status_code=400, detail="Start date must be before end date")

        if "teacher_id" in update_data:
            db_teacher = db.query(Staff).join(User).filter(
                Staff.id == update_data["teacher_id"],
                User.role == UserRole.teacher.value
            ).first()
            if not db_teacher:
                raise HTTPException(status_code=404, detail="Teacher not found or invalid role")

        if "schedule" in update_data and update_data["schedule"] is not None:
            update_data["schedule"] = [item.model_dump(mode='json') for item in data.schedule]

        if "holding_type" in update_data and update_data["holding_type"] is not None:
            update_data["holding_type"] = update_data["holding_type"].value

        for key, value in update_data.items():
            setattr(db_classroom, key, value)

        db.commit()
        db.refresh(db_classroom)

        return response_handler(
            status=True,
            message="Classroom updated successfully",
            data=ClassroomOut.model_validate(db_classroom).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Classroom data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update Classroom")


@router.delete("/{classroom_id}")
def delete_classroom(
    classroom_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        db.delete(db_classroom)
        db.commit()

        return response_handler(
            status=True,
            message="Classroom deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete Classroom because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete Classroom")
