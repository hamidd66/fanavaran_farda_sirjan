from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from typing import Optional
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.classroom_record import ClassroomRecord
from app.models.classroom import Classroom
from app.models.enrollment import Enrollment
from app.models.classroom_session import ClassroomSession
from app.models.user import User
from app.models.student import Student
from app.schemas.classroom_record import ClassroomRecordBatchCreate, ClassroomRecordSingleCreate, ClassroomRecordUpdate, ClassroomRecordOut, ClassroomRecordFinalizeUpdate
from app.enums.classroom import AttendanceStatus, ClassroomRecordSort
from app.enums.user import UserRole


router = APIRouter(prefix="/classroom_records", tags=["Classroom records"])


@router.post("/batch/{classroom_session_id}")
def create_classroom_record_batch(
    classroom_session_id: str,
    data: ClassroomRecordBatchCreate,
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
        ).filter(ClassroomSession.id == classroom_session_id).first()
        
        if not db_session:
            raise HTTPException(status_code=404, detail="Classroom session not found")

        db_classroom = db_session.classroom

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="You can only record for your own classrooms")
            
            recorder_id = db_user.staff.id

        elif current_role == UserRole.admin.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=400, detail="Admin must have staff profile")
            
            recorder_id = db_user.staff.id

        student_ids = [item.student_id for item in data.items]
        if len(student_ids) != len(set(student_ids)):
            raise HTTPException(status_code=400, detail="Duplicate student IDs in request")

        enrolled_students = db.query(Enrollment.student_id).filter(
            Enrollment.classroom_id == db_classroom.id,
            Enrollment.student_id.in_(student_ids)
        ).all()
        enrolled_ids = {e.student_id for e in enrolled_students}
        
        missing_ids = set(student_ids) - enrolled_ids
        if missing_ids:
            raise HTTPException(status_code=400, detail=f"These students are not enrolled: {list(missing_ids)}")

        existing_records = db.query(ClassroomRecord.student_id).filter(
            and_(
                ClassroomRecord.classroom_session_id == classroom_session_id,
                ClassroomRecord.student_id.in_(student_ids)
            )
        ).all()
        if existing_records:
            existing_ids = [r.student_id for r in existing_records]
            raise HTTPException(status_code=409, detail=f"Records already exist for: {existing_ids}")

        new_records = []
        for item in data.items:
            if item.attendance_status != AttendanceStatus.late and item.late_minutes > 0:
                raise HTTPException(status_code=400, detail=f"late_minutes only valid when status is 'late' (student: {item.student_id})")

            if item.attendance_status == AttendanceStatus.absent and item.grade > 0:
                raise HTTPException(status_code=400, detail=f"An absent trainee cannot receive a grade (student: {item.student_id})")

            record = ClassroomRecord(**item, classroom_session_id = classroom_session_id, created_by = recorder_id)
            db.add(record)
            new_records.append(record)

        db.commit()
        
        for rec in new_records:
            db.refresh(rec)

        return response_handler(
            status=True,
            message=f"Records created successfully for {len(new_records)} student(s)",
            data={
                "records": [
                    ClassroomRecordOut.model_validate(rec).model_dump()
                    for rec in new_records
                ]
            },
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Duplicate record for this session")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create records")


@router.post("/{classroom_session_id}")
def create_classroom_record(
    classroom_session_id: str,
    data: ClassroomRecordSingleCreate,
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
        ).filter(ClassroomSession.id == classroom_session_id).first()
        if not db_session:
            raise HTTPException(status_code=404, detail="Classroom session not found")

        db_classroom = db_session.classroom

        db_user = get_user_data(db, User.id == current_user_id, first=True)

        if current_role == UserRole.teacher.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")
            
            recorder_id = db_user.staff.id

        elif current_role == UserRole.admin.value:

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=400, detail="Admin must have staff profile")
            
            recorder_id = db_user.staff.id

        is_enrolled = db.query(Enrollment).filter(
            and_(
                Enrollment.classroom_id == db_classroom.id,
                Enrollment.student_id == data.student_id
            )
        ).first()
        if not is_enrolled:
            raise HTTPException(status_code=400, detail="Student is not enrolled in this classroom")

        if data.attendance_status != AttendanceStatus.late and data.late_minutes > 0:
            raise HTTPException(status_code=400, detail="late_minutes only valid when status is 'late'")
        
        if data.attendance_status == AttendanceStatus.absent and data.grade > 0:
            raise HTTPException(status_code=400, detail=f"An absent trainee cannot receive a grade")

        db_record = ClassroomRecord(**data, classroom_session_id = classroom_session_id, created_by = recorder_id)

        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return response_handler(
            status=True,
            message="Record created successfully",
            data=ClassroomRecordOut.model_validate(db_record).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Record already exists for this student in this session")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create record")


@router.get("/")
def get_classroom_records(
    db: Session = Depends(get_db),
    payload = Depends(get_payload),
    classroom_id: Optional[str] = Query(None),
    classroom_session_id: Optional[str] = Query(None),
    student_id: Optional[str] = Query(None),
    attendance_status: Optional[AttendanceStatus] = Query(None),
    is_finalized: Optional[bool] = Query(None),
    sort: Optional[ClassroomRecordSort] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        query = db.query(ClassroomRecord).options(
            joinedload(ClassroomRecord.student),
            joinedload(ClassroomRecord.classroom_session).joinedload(ClassroomSession.classroom),
        )

        if classroom_id:
            query = query.join(ClassroomSession).filter(ClassroomSession.classroom_id == classroom_id)

        if classroom_session_id:
            query = query.filter(ClassroomRecord.classroom_session_id == classroom_session_id)

        if student_id:
            query = query.filter(ClassroomRecord.student_id == student_id)

        if attendance_status is not None:
            query = query.filter(ClassroomRecord.attendance_status == attendance_status.value)

        if is_finalized is not None:
            query = query.filter(ClassroomRecord.is_finalized == is_finalized)

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")

            if not classroom_id and not classroom_session_id:
                raise HTTPException(status_code=400, detail="Teacher must specify classroom_id or classroom_session_id")

            if classroom_id:
                db_classroom = db.query(Classroom).filter(Classroom.id == classroom_id).first()

                if not db_classroom or db_classroom.teacher_id != db_user.staff.id:
                    raise HTTPException(status_code=403, detail="Access denied")
                
            elif classroom_session_id:
                
                db_session = db.query(ClassroomSession).options(
                    joinedload(ClassroomSession.classroom)
                ).filter(ClassroomSession.id == classroom_session_id).first()

                if not db_session or db_session.classroom.teacher_id != db_user.staff.id:
                    raise HTTPException(status_code=403, detail="Access denied")
                
        elif current_role == UserRole.user.value:

            if student_id and student_id != current_user_id:
                raise HTTPException(status_code=403, detail="Access denied")
            
            student_id = current_user_id
            query = query.filter(ClassroomRecord.student_id == student_id)

        else:
            raise HTTPException(status_code=403, detail="Access denied")

        if sort == ClassroomRecordSort.newest:
            query = query.order_by(ClassroomRecord.created_at.desc())
        elif sort == ClassroomRecordSort.oldest:
            query = query.order_by(ClassroomRecord.created_at.asc())
        elif sort == ClassroomRecordSort.session_asc:
            query = query.join(ClassroomSession).order_by(ClassroomSession.session_number.asc())
        elif sort == ClassroomRecordSort.session_desc:
            query = query.join(ClassroomSession).order_by(ClassroomSession.session_number.desc())
        elif sort == ClassroomRecordSort.name_asc:
            query = query.join(Student).order_by(Student.full_name.asc())
        elif sort == ClassroomRecordSort.name_desc:
            query = query.join(Student).order_by(Student.full_name.desc())
        elif sort == ClassroomRecordSort.grade_desc:
            query = query.order_by(ClassroomRecord.grade.desc().nullslast())
        elif sort == ClassroomRecordSort.grade_asc:
            query = query.order_by(ClassroomRecord.grade.asc().nullsfirst())
        else:
            query = query.order_by(ClassroomRecord.created_at.desc())

        total_count = query.count()
        db_records = query.offset((page - 1) * limit).limit(limit).all()

        records_data = [
            ClassroomRecordOut.model_validate(rec).model_dump()
            for rec in db_records
        ]

        return response_handler(
            status=True,
            message="Records retrieved successfully",
            data={
                "records": records_data,
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
        raise HTTPException(status_code=500, detail="Failed to fetch records")    


@router.get("/{record_id}")
def get_classroom_record(
    record_id: str,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        db_record = db.query(ClassroomRecord).options(
            joinedload(ClassroomRecord.student),
            joinedload(ClassroomRecord.classroom_session).joinedload(ClassroomSession.classroom),
        ).filter(ClassroomRecord.id == record_id).first()
        if not db_record:
            raise HTTPException(status_code=404, detail="Record not found")

        if current_role == UserRole.admin.value:
            pass

        elif current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_record.classroom_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")
            
        elif current_role == UserRole.user.value:

            if db_record.student_id != current_user_id:
                raise HTTPException(status_code=403, detail="Access denied")
            
        else:
            raise HTTPException(status_code=403, detail="Access denied")

        return response_handler(
            status=True,
            message="Record retrieved successfully",
            data=ClassroomRecordOut.model_validate(db_record).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch record")


@router.patch("/{record_id}")
def update_classroom_record(
    record_id: str,
    data: ClassroomRecordUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        db_record = db.query(ClassroomRecord).options(
            joinedload(ClassroomRecord.classroom_session).joinedload(ClassroomSession.classroom)
        ).filter(ClassroomRecord.id == record_id).first()

        if not db_record:
            raise HTTPException(status_code=404, detail="Record not found")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            if db_record.classroom_session.classroom.teacher_id != db_user.staff.id:
                raise HTTPException(status_code=403, detail="Access denied")

            if db_record.is_finalized:
                raise HTTPException(status_code=400, detail="Cannot edit finalized record. Unfinalize it first.")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        new_status = update_data.get("attendance_status", db_record.attendance_status)
        new_late = update_data.get("late_minutes", db_record.late_minutes)
        new_grade = update_data.get("grade", db_record.grade)
        
        if hasattr(new_status, 'value'): new_status_value = new_status.value
        else: new_status_value = new_status

        if new_status_value != AttendanceStatus.late.value and new_late > 0:
            raise HTTPException(status_code=400, detail="late_minutes only valid when status is 'late'")
        
        if new_status_value == AttendanceStatus.absent and new_grade > 0:
            raise HTTPException(status_code=400, detail=f"An absent trainee cannot receive a grade")

        if "attendance_status" in update_data and update_data["attendance_status"] is not None:
            update_data["attendance_status"] = update_data["attendance_status"].value

        for key, value in update_data.items():
            setattr(db_record, key, value)

        db.commit()
        db.refresh(db_record)

        return response_handler(
            status=True,
            message="Record updated successfully",
            data=ClassroomRecordOut.model_validate(db_record).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update record")


@router.patch("/change-finalize")
def finalize_classroom_records(
    data: ClassroomRecordFinalizeUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        current_role = payload.get("role")

        if current_role not in {UserRole.admin.value, UserRole.teacher.value}:
            raise HTTPException(status_code=403, detail="Access denied")

        if len(data.record_ids) != len(set(data.record_ids)):
            raise HTTPException(status_code=400, detail="Duplicate record IDs in request")

        db_records = db.query(ClassroomRecord).options(
            joinedload(ClassroomRecord.classroom_session).joinedload(ClassroomSession.classroom)
        ).filter(
            ClassroomRecord.id.in_(data.record_ids)
        ).all()

        found_ids = {rec.id for rec in db_records}
        missing_ids = set(data.record_ids) - found_ids
        if missing_ids:
            raise HTTPException(status_code=404, detail=f"Records not found: {list(missing_ids)}")

        if current_role == UserRole.teacher.value:
            db_user = get_user_data(db, User.id == current_user_id, first=True)

            if not db_user or not db_user.staff:
                raise HTTPException(status_code=403, detail="Access denied")
            
            teacher_staff_id = db_user.staff.id
            
            if not data.is_finalized:
                raise HTTPException(status_code=403, detail="Teachers can only finalize records, not unfinalize them")
            
            for rec in db_records:
                if rec.classroom_session.classroom.teacher_id != teacher_staff_id:
                    raise HTTPException(status_code=403,detail=f"You can only finalize records of your own classrooms (record: {rec.id})")

        finalized_count = 0
        skipped_count = 0

        for rec in db_records:
            if rec.is_finalized == data.is_finalized:
                skipped_count += 1
                continue
            
            rec.is_finalized = data.is_finalized
            finalized_count += 1

        db.commit()

        for rec in db_records:
            db.refresh(rec)

        return response_handler(
            status=True,
            message=f"Batch finalized completed",
            data={
                "total": len(db_records),
                "finalized_count": finalized_count,
                "skipped_count": skipped_count,
                "records": [
                    ClassroomRecordOut.model_validate(rec).model_dump()
                    for rec in db_records
                ]
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to batch finalize records")

