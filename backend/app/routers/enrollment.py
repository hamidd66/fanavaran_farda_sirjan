from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import date
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.enrollment import Enrollment
from app.models.classroom import Classroom
from app.models.user import User
from app.models.student import Student
from app.schemas.enrollment import EnrollmentCreate, EnrollmentOut, EnrollmentUpdate
from app.enums.enrollment import EnrollmentSort, RegistrationMethod
from app.enums.user import UserRole


router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


@router.post("/{classroom_id}")
def create_enrollment(
    classroom_id: str,
    data: EnrollmentCreate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        db_student = db.query(Student).filter(Student.id == data.student_id).first()
        if not db_student:
            raise HTTPException(status_code=404, detail="Student not found")

        existing = db.query(Enrollment).filter(
            and_(
                Enrollment.student_id == data.student_id,
                Enrollment.classroom_id == classroom_id
            )
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="Student is already enrolled in this classroom")

        enrolled_count = db.query(func.count(Enrollment.id)).filter(
            Enrollment.classroom_id == classroom_id
        ).scalar()
        if enrolled_count >= db_classroom.capacity:
            raise HTTPException(status_code=409, detail="Classroom is full. No more registrations allowed.")

        today = date.today()
        if db_classroom.end_date and today > db_classroom.end_date:
            raise HTTPException(status_code=400, detail="Classroom has ended. Registration is not allowed.")

        if payload.get("sub") == data.student_id:
            registration_method = RegistrationMethod.online
        elif payload.get("role") in {UserRole.admin.value, UserRole.teacher.value}:
            registration_method = RegistrationMethod.offline
        else:
            raise HTTPException(status_code=403, detail="You only register yourself or as an admin/teacher")

        db_enrollment = Enrollment(
            student_id = data.student_id,
            classroom_id = classroom_id,
            registration_method = registration_method,
            description = data.description,
        )

        db.add(db_enrollment)
        db.commit()
        db.refresh(db_enrollment)

        return response_handler(
            status=True,
            message="Enrollment created successfully",
            data=EnrollmentOut.model_validate(db_enrollment).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Input data is problematic")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create enrollment")


@router.get("/{classroom_id}")
def get_classroom_enrollments(
    classroom_id: str,
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    registration_method: Optional[RegistrationMethod] = Query(None),
    sort: Optional[EnrollmentSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not db_classroom:
            raise HTTPException(status_code=404, detail="Classroom not found")

        query = db.query(Enrollment).options(
            joinedload(Enrollment.student),
            joinedload(Enrollment.classroom),
        ).filter(Enrollment.classroom_id == classroom_id)

        if registration_method is not None:
            query = query.filter(Enrollment.registration_method == registration_method.value)

        if search:
            search_term = f"%{search}%"
            query = query.join(Student).filter(
                or_(
                    Student.full_name.ilike(search_term),
                    Student.phone.like(search_term),
                )
            )

        if sort == EnrollmentSort.newest:
            query = query.order_by(Enrollment.created_at.desc())
        elif sort == EnrollmentSort.oldest:
            query = query.order_by(Enrollment.created_at.asc())
        elif sort == EnrollmentSort.name_asc:
            query = query.join(Student).order_by(Student.full_name.asc())
        elif sort == EnrollmentSort.name_desc:
            query = query.join(Student).order_by(Student.full_name.desc())
        else:
            query = query.order_by(Enrollment.created_at.desc())

        total_count = query.count()
        db_enrollments = query.offset((page - 1) * limit).limit(limit).all()

        enrollments_data = [
            EnrollmentOut.model_validate(enrollment).model_dump()
            for enrollment in db_enrollments
        ]

        return response_handler(
            status=True,
            message="Enrollments retrieved successfully",
            data={
                "enrollments": enrollments_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch enrollments")


@router.patch("/{enrollment_id}")
def update_enrollment(
    enrollment_id: str,
    data: EnrollmentUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        db_enrollment = db.query(Enrollment).filter(
            Enrollment.id == enrollment_id
        ).first()

        if not db_enrollment:
            raise HTTPException(status_code=404, detail="Enrollment not found")

        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.admin.value:
            pass
        
        elif current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_enrollment.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only edit enrollments of your own classrooms")
            
        elif current_role == UserRole.user.value:

            if db_enrollment.student_id != db_user.student.id:
                raise HTTPException(status_code=403, detail="You can only edit your own enrollments")

        else:
            raise HTTPException(status_code=403, detail="Access denied")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        for key, value in update_data.items():
            setattr(db_enrollment, key, value)

        db.commit()
        db.refresh(db_enrollment)

        return response_handler(
            status=True,
            message="Enrollment updated successfully",
            data=EnrollmentOut.model_validate(db_enrollment).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update enrollment")


@router.delete("/{enrollment_id}")
def delete_enrollment(
    enrollment_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        db_enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
        if not db_enrollment:
            raise HTTPException(status_code=404, detail="Enrollment not found")

        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_enrollment.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only delete enrollments of your own classrooms")
            
        elif current_role == UserRole.user.value:

            if db_enrollment.student_id != db_user.student.id:
                raise HTTPException(status_code=403, detail="You can only delete your own enrollments")
            
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        db.delete(db_enrollment)
        db.commit()

        return response_handler(
            status=True,
            message="Enrollment deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cannot delete enrollment because it is referenced by other records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to delete enrollment")

