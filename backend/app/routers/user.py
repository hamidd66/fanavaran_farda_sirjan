from fastapi import APIRouter, Depends, HTTPException, Query, Response, Cookie, Request, File, UploadFile, Form
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import ValidationError
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.services.cookies import set_auth_cookie, delete_auth_cookie
from app.services.tokens import verify_token, generate_access_token, generate_refresh_token
from app.middleware.exception_handler import response_handler
from app.utils.hashing import hash_password, verify_password
from app.utils.delete_file import delete_files
from app.core.rate_limiters.ip_limiter import check_ip_limit
from app.core.rate_limiters.login_limiter import is_account_locked, register_failed_login, register_successful_login
from app.repositories.user_repo import get_user_data
from app.repositories.user_role_repo import get_role_by_name
from app.repositories.file_repo import add_files, remove_files

from app.models.audit_logs import AuditLog
from app.models.person import Person
from app.models.staff_profile import StaffProfile
from app.models.user import User
from app.models.user_role import UserRole
from app.models.role import Role
from app.models.student_profile import StudentProfile
from app.models.specialty import Specialty
from app.models.user_specialty import UserSpecialty
from app.schemas.user import UserLogin, UserUpdate, ToggleActiveStatus, ChangePassword, UserOut, ToggleDeleteStatus
from app.schemas.staff_profile import StaffCreateByAdmin, StaffUpdate, RegisterStaffProfileSchema
from app.schemas.person import PersonUpdate
from app.schemas.student_profile import StudentRegister, StudentCreateByAdmin, StudentUpdate, RegisterStudentProfileSchema
from app.enums.audit_logs import ActionTypes
from app.enums.student_profile import StudentEducationalStatus
from app.enums.user import UserRoleEnum, UserSort


router = APIRouter(prefix="/user", tags=["Users"])


@router.post("/register/student")
async def register_student(
    response: Response,
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    try:
        student_data = StudentRegister.model_validate_json(data)

        existing_user = get_user_data(db, User.national_code == student_data.national_code)
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this national code already exists")

        new_user = User(
            national_code=student_data.national_code,
            password=hash_password(student_data.password),
            is_active=True,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
            is_deleted=False
        )
        db.add(new_user)
        db.flush()

        new_person = Person(
            user_id=new_user.id,
            full_name=student_data.full_name,
            father_name=student_data.father_name,
            birth_date=student_data.birth_date,
            gender=student_data.gender,
            phone=student_data.phone,
            email=student_data.email,
            address=student_data.address,
            description=student_data.description,
            field_of_study=student_data.field_of_study,
            education_level=student_data.education_level,
            referral_source=student_data.referral_source
        )
        db.add(new_person)
        db.flush()

        new_student_profile = StudentProfile(
            person_id=new_person.id,
            educational_status=StudentEducationalStatus.suspended,
            parent_phone=student_data.parent_phone
        )
        db.add(new_student_profile)
        db.flush()

        db_role_student = get_role_by_name(db, UserRoleEnum.student)
        user_role = UserRole(
            user_id=new_user.id,
            role_id=db_role_student.id,
            assigned_by="system",
            is_access=True
        )
        db.add(user_role)

        log = AuditLog(
            user_id=new_user.id,
            entity_id=new_user.id,
            entity_type="User",
            action=ActionTypes.create,
            changed_fields=["national_code", "password"],
        )
        db.add(log)

        if avatar:
            await add_files(
                db=db,
                uploaded_by=new_user.id,
                entity_id=new_person.id,
                entity_type="person",
                purpose="avatar",
                files=[avatar],
                display_order=[1]
            )

        db.commit()

        access_token = generate_access_token(new_user)
        refresh_token = generate_refresh_token(new_user)

        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
        set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return response_handler(
            status=True,
            message="Student registered successfully and logged in",
            data={
                "user": UserOut.model_validate(new_user).model_dump(),
                "access_token": access_token,
                "refresh_token": refresh_token
            },
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Student registration failed")


@router.post("/admin/register/student")
async def register_student_by_admin(
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        admin_id = payload.get("sub")
        student_data = StudentCreateByAdmin.model_validate_json(data)

        existing_user = get_user_data(db, User.national_code == student_data.national_code)
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this national code already exists")

        if student_data.specialty_ids:
            specialties = db.query(Specialty).filter(
                Specialty.id.in_(student_data.specialty_ids),
                Specialty.is_active == True
            ).all()
            if len(specialties) != len(student_data.specialty_ids):
                raise HTTPException(status_code=400, detail="One or more specialties not found")

        new_user = User(
            national_code=student_data.national_code,
            password=hash_password(student_data.password),
            is_active=student_data.is_active,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
            is_deleted=False
        )
        db.add(new_user)
        db.flush()

        new_person = Person(
            user_id=new_user.id,
            full_name=student_data.full_name,
            father_name=student_data.father_name,
            birth_date=student_data.birth_date,
            gender=student_data.gender,
            phone=student_data.phone,
            email=student_data.email,
            address=student_data.address,
            description=student_data.description,
            field_of_study=student_data.field_of_study,
            education_level=student_data.education_level,
            referral_source=student_data.referral_source
        )
        db.add(new_person)
        db.flush()

        new_student_profile = StudentProfile(
            person_id=new_person.id,
            educational_status=StudentEducationalStatus[student_data.educational_status],
            parent_phone=student_data.parent_phone
        )
        db.add(new_student_profile)
        db.flush()

        db_role_student = get_role_by_name(db, UserRoleEnum.student)
        user_role = UserRole(
            user_id=new_user.id,
            role_id=db_role_student.id,
            assigned_by=admin_id,
            is_access=True
        )
        db.add(user_role)

        if student_data.specialty_ids:
            for specialty_id in student_data.specialty_ids:
                user_specialty = UserSpecialty(
                    person_id=new_person.id,
                    specialty_id=specialty_id,
                    assigned_by=admin_id
                )
                db.add(user_specialty)

        log = AuditLog(
            user_id=admin_id,
            entity_id=new_user.id,
            entity_type="User",
            action=ActionTypes.create,
            changed_fields=["national_code", "password", "is_active"],
        )
        db.add(log)

        if avatar:
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_person.id,
                entity_type="person",
                purpose="avatar",
                files=[avatar],
                display_order=[1]
            )

        db.commit()

        return response_handler(
            status=True,
            message="Student registered successfully by admin",
            data={"user_id": new_user.id},
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Student registration failed")


@router.post("/admin/register/staff")
async def register_staff_by_admin(
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        admin_id = payload.get("sub")
        staff_data = StaffCreateByAdmin.model_validate_json(data)

        existing_user = get_user_data(db, User.national_code == staff_data.national_code)
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this national code already exists")

        roles = db.query(Role).filter(
            Role.id.in_(staff_data.role_ids),
            Role.is_active == True
        ).all()
        if len(roles) != len(staff_data.role_ids):
            raise HTTPException(status_code=400, detail="One or more roles not found")

        if staff_data.specialty_ids:
            specialties = db.query(Specialty).filter(
                Specialty.id.in_(staff_data.specialty_ids),
                Specialty.is_active == True
            ).all()
            if len(specialties) != len(staff_data.specialty_ids):
                raise HTTPException(status_code=400, detail="One or more specialties not found")

        new_user = User(
            national_code=staff_data.national_code,
            password=hash_password(staff_data.password),
            is_active=staff_data.is_active,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
            is_deleted=False
        )
        db.add(new_user)
        db.flush()

        new_person = Person(
            user_id=new_user.id,
            full_name=staff_data.full_name,
            father_name=staff_data.father_name,
            birth_date=staff_data.birth_date,
            gender=staff_data.gender,
            phone=staff_data.phone,
            email=staff_data.email,
            address=staff_data.address,
            description=staff_data.description,
            field_of_study=staff_data.field_of_study,
            education_level=staff_data.education_level,
            referral_source=staff_data.referral_source
        )
        db.add(new_person)
        db.flush()

        new_staff_profile = StaffProfile(
            person_id=new_person.id,
            employment_status=staff_data.employment_status,
            employment_type=staff_data.employment_type,
            job_title=staff_data.job_title,
            card_number=staff_data.card_number,
            sheba_number=staff_data.sheba_number,
            hire_date=staff_data.hire_date
        )
        db.add(new_staff_profile)
        db.flush()

        for role in roles:
            user_role = UserRole(
                user_id=new_user.id,
                role_id=role.id,
                assigned_by=admin_id,
                is_access=True
            )
            db.add(user_role)

        if staff_data.specialty_ids:
            for specialty_id in staff_data.specialty_ids:
                user_specialty = UserSpecialty(
                    person_id=new_person.id,
                    specialty_id=specialty_id,
                    assigned_by=admin_id
                )
                db.add(user_specialty)

        log = AuditLog(
            user_id=admin_id,
            entity_id=new_user.id,
            entity_type="User",
            action=ActionTypes.create,
            changed_fields=["national_code", "password", "is_active"],
        )
        db.add(log)

        if avatar:
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_person.id,
                entity_type="person",
                purpose="avatar",
                files=[avatar],
                display_order=[1]
            )

        db.commit()

        return response_handler(
            status=True,
            message="Staff registered successfully by admin",
            data={"user_id": new_user.id},
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Staff registration failed")


@router.post("/login")
def login_user(
    request: Request,
    response: Response,
    data: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        check_ip_limit(request)

        db_user = get_user_data(db, User.national_code == data.national_code)

        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid national code or password")

        if is_account_locked(db_user):
            raise HTTPException(status_code=429, detail="You cannot submit a request due to too many attempts")

        if not verify_password(data.password, db_user.password):
            register_failed_login(db, db_user)
            raise HTTPException(status_code=401, detail="Invalid national code or password")

        if not db_user.is_active:
            raise HTTPException(status_code=403, detail="Account is inactive")

        if db_user.is_deleted:
            db_user.is_deleted = False

        register_successful_login(db, db_user)
        
        db_user.last_login = datetime.now(timezone.utc)

        db.commit()

        access_token = generate_access_token(db_user)
        refresh_token = generate_refresh_token(db_user)

        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
        set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return response_handler(
            status=True,
            message="Login successful",
            data={
                "user": UserOut.model_validate(db_user).model_dump(),
                "access_token": access_token,
                "refresh_token": refresh_token,
            },
            status_code=200,
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/logout")
def logout_user(
    response: Response,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        user_id = payload.get("sub")

        updated_rows = (
            db.query(User)
            .filter(User.id == user_id)
            .update(
                {User.token_version: User.token_version + 1},
                synchronize_session="evaluate",
            )
        )

        if updated_rows == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        log = AuditLog(
            user_id=user_id,
            entity_id=user_id,
            entity_type="User",
            action=ActionTypes.update,
            changed_fields=["token_version"],
        )
        db.add(log)

        db.commit()

        delete_auth_cookie(response=response, key="access_token", path="/")
        delete_auth_cookie(response=response, key="refresh_token", path="/user/refresh")

        return response_handler(
            status=True,
            message="Logged out successfully",
            data=None,
            status_code=200,
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Logout failed")


@router.post("/logout-current")
def logout_current_device(
    response: Response,
    payload: dict = Depends(get_payload),
):
    try:
        delete_auth_cookie(response=response, key="access_token", path="/")
        delete_auth_cookie(response=response, key="refresh_token", path="/user/refresh")

        return response_handler(
            status=True,
            message="Logged out from current device successfully",
            data=None,
            status_code=200,
        )

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Logout failed")


@router.post("/refresh")
def refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db)
):
    try:
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token cookie missing")

        payload = verify_token(refresh_token)

        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

        user_id = payload.get("sub")
        token_version = payload.get("token_version")

        db_user = get_user_data(
            db,
            User.id == user_id,
            User.is_deleted.is_(False),
            User.is_active.is_(True)
        )

        if not db_user:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        if token_version != db_user.token_version:
            raise HTTPException(status_code=401, detail="Token has been revoked")

        access_token = generate_access_token(db_user)
        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")

        return response_handler(
            status=True,
            message="Access token refreshed successfully",
            data={"access_token": access_token},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Refresh failed")


@router.post("/{user_id}/staff-profile")
def register_user_as_staff(
    user_id: str,
    data: RegisterStaffProfileSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not db_user.person:
            raise HTTPException(status_code=400, detail="User must have a person profile before registering as staff.")

        person_id = db_user.person.id

        if db_user.person.staff_profile:
            raise HTTPException(status_code=409, detail="User is already registered as staff.")

        create_data = data.model_dump(exclude_none=True)

        new_staff_profile = StaffProfile(**create_data, person_id=person_id)
        db.add(new_staff_profile)

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_user.id,
            entity_type="StaffProfile",
            action=ActionTypes.create,
            changed_fields=["staff_profile_creation"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message="User successfully registered as staff",
            data=UserOut.model_validate(db_user).model_dump(),
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to register user as staff")


@router.post("/{user_id}/student-profile")
def register_user_as_student(
    user_id: str,
    data: RegisterStudentProfileSchema,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not db_user.person:
            raise HTTPException(status_code=400, detail="User must have a person profile before registering as a student.")

        person_id = db_user.person.id

        if db_user.person.student_profile:
            raise HTTPException(status_code=409, detail="User is already registered as a student.")

        create_data = data.model_dump(exclude_none=True)

        new_student_profile = StudentProfile(**create_data, person_id=person_id)
        db.add(new_student_profile)

        log = AuditLog(
            user_id=admin_id,
            entity_id=db_user.id,
            entity_type="StudentProfile",
            action=ActionTypes.create,
            changed_fields=["student_profile_creation"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message="User successfully registered as a student",
            data=UserOut.model_validate(db_user).model_dump(),
            status_code=201
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to register user as a student")


@router.get("/me")
def get_current_user_profile(
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        user_id = payload.get("sub")
        
        db_user = get_user_data(db, User.id == user_id)
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # roles = [ur.role.name for ur in db_user.user_roles if ur.is_access and ur.role.is_active]
        
        return response_handler(
            status=True,
            message="Profile retrieved successfully",
            data=UserOut.model_validate(db_user).model_dump(),
            status_code=200
        )

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    payload: dict = Depends(get_payload),
    roles: Optional[List[str]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(True),
    is_deleted: Optional[bool] = Query(False),
    sort: Optional[UserSort] = Query(None),
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")
        
        query = db.query(User).options(
            joinedload(User.person).joinedload(Person.student_profile),
            joinedload(User.person).joinedload(Person.staff_profile),
            joinedload(User.user_roles).joinedload(UserRole.role),
        )

        if roles:
            query = query.join(User.user_roles).join(UserRole.role).filter(
                Role.name.in_(roles)
            )
            
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        if is_deleted is not None:
            query = query.filter(User.is_deleted == is_deleted)
            
        if search:
            search_term = f"%{search}%"
            query = query.join(User.person).filter(
                or_(
                    User.national_code.ilike(search_term),
                    Person.full_name.ilike(search_term),
                    Person.phone.ilike(search_term),
                    Person.email.ilike(search_term),
                )
            )
            
        if sort == UserSort.newest:
            query = query.order_by(User.created_at.desc())
        elif sort == UserSort.oldest:
            query = query.order_by(User.created_at.asc())
        else:
            query = query.order_by(User.created_at.desc())
            
        total_count = query.distinct().count()
        users = query.distinct().offset((page - 1) * limit).limit(limit).all()
        
        users_list = []
        for u in users:
            user_data = UserOut.model_validate(u).model_dump()
            users_list.append(user_data)

        return response_handler(
            status=True,
            message="Users retrieved successfully",
            data={
                "users": users_list,
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
        raise HTTPException(status_code=500, detail="Failed to fetch users")


@router.get("/{user_id}")
def get_user_by_id(
    user_id: str, 
    payload: dict = Depends(get_payload), 
    db: Session = Depends(get_db)
):
    try:
        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")
        
        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return response_handler(
            status=True,
            message="User retrieved successfully",
            data=UserOut.model_validate(db_user).model_dump(),
            status_code=200
        )

    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve user profile")


@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        user_roles = payload.get("role", [])
        current_user_id = payload.get("sub")
        is_admin = "admin" in user_roles

        if not is_admin and current_user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        if not db_user.person:
            raise HTTPException(status_code=404, detail="Person information not defined")

        changed_keys = []

        user_data = UserUpdate.model_validate_json(data).model_dump(exclude_unset=True)
        for key, value in user_data.items():
            changed_keys.append(key)
            setattr(db_user, key, value)

        person_data = PersonUpdate.model_validate_json(data).model_dump(exclude_unset=True)
        for key, value in person_data.items():
            changed_keys.append(key)
            setattr(db_user.person, key, value)

        if db_user.person.student_profile:
            student_profile_data = StudentUpdate.model_validate_json(data).model_dump(exclude_unset=True)
            for key, value in student_profile_data.items():
                if key in ["educational_status"] and not is_admin:
                    raise HTTPException(status_code=403, detail="Access denied")
                changed_keys.append(key)
                setattr(db_user.person.student_profile, key, value)

        if db_user.person.staff_profile:
            staff_profile_data = StaffUpdate.model_validate_json(data).model_dump(exclude_unset=True)
            for key, value in staff_profile_data.items():
                if key in ["employment_status", "employment_type", "hire_date"] and not is_admin:
                    raise HTTPException(status_code=403, detail="Access denied")
                changed_keys.append(key)
                setattr(db_user.person.staff_profile, key, value)

        if not changed_keys and not avatar:
            raise HTTPException(status_code=400, detail="No fields to update")

        deleted_paths = []
        if avatar:
            changed_keys.append("avatar")

            deleted_attachment_ids = [file_att.id for file_att in db_user.person.file_attachments if file_att.purpose == "avatar"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            await add_files(
                db=db,
                uploaded_by=current_user_id,
                entity_id=db_user.person.id,
                entity_type="person",
                purpose="avatar",
                files=[avatar],
                display_order=[1]
            )

        if changed_keys:
            log = AuditLog(
                user_id=current_user_id,
                entity_id=db_user.id,
                entity_type="User",
                action=ActionTypes.update,
                changed_fields=changed_keys,
            )
            db.add(log)

        db.commit()
        db.refresh(db_user)

        if avatar and deleted_paths:
            delete_files(deleted_paths)

        return response_handler(
            status=True,
            message="User updated successfully",
            data=UserOut.model_validate(db_user).model_dump(),
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except ValidationError as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=e.errors(include_context=False))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Input data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user")


@router.patch("/{user_id}/toggle-active")
def toggle_active_status(
    user_id: str,
    data: ToggleActiveStatus,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        current_user_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")

        if current_user_id == user_id:
            raise HTTPException(status_code=400, detail="You cannot change your active status")
        
        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if db_user.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"User status is already set to {data.is_active}")

        db_user.is_active = data.is_active
        db_user.token_version += 1

        log = AuditLog(
            user_id=current_user_id,
            entity_id=db_user.id,
            entity_type="User",
            action=ActionTypes.update,
            changed_fields=["is_active", "token_version"],
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message=f"User active status successfully set to {data.is_active}",
            data={"user_id": db_user.id, "is_active": data.is_active},
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to toggle user status")


@router.patch("/{user_id}/change-password")
def change_password(
    response: Response, 
    user_id: str, 
    data: ChangePassword, 
    payload: dict = Depends(get_payload), 
    db: Session = Depends(get_db)
):
    try:
        current_user_id = payload.get("sub")
        is_admin = "admin" in payload.get("role", [])

        if not is_admin and current_user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not is_admin or (is_admin and current_user_id == user_id):
            if not data.old_password:
                raise HTTPException(status_code=400, detail="Old password is required")
            
            if not verify_password(data.old_password, db_user.password):
                raise HTTPException(status_code=400, detail="Incorrect old password")

        if verify_password(data.new_password, db_user.password):
            raise HTTPException(status_code=400, detail="New password cannot be the same as the old password")

        db_user.password = hash_password(data.new_password)
        db_user.token_version += 1

        log = AuditLog(
            user_id=current_user_id,
            entity_id=db_user.id,
            entity_type="User",
            action=ActionTypes.update,
            changed_fields=["password", "token_version"],
        )
        db.add(log)

        db.commit()
        db.refresh(db_user)

        if current_user_id == user_id:
            access_token = generate_access_token(db_user)
            refresh_token = generate_refresh_token(db_user)
            
            set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
            set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return response_handler(
            status=True,
            message="Password changed successfully and active sessions on other devices were terminated.",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Change password failed")


@router.patch("/{user_id}/delete")
def toggle_user_soft_delete(
    user_id: str,
    data: ToggleDeleteStatus,
    payload: dict = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        current_admin_id = payload.get("sub")

        if "admin" not in payload.get("role", []):
            raise HTTPException(status_code=403, detail="Access denied")
        
        if current_admin_id == user_id:
            raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if db_user.is_deleted == data.is_deleted:
            raise HTTPException(status_code=409, detail=f"User is already {"deleted" if data.is_deleted else "restored"}")

        db_user.is_deleted = data.is_deleted
        
        if data.is_deleted:
            db_user.token_version += 1

        log = AuditLog(
            user_id=current_admin_id,
            entity_id=db_user.id,
            entity_type="User",
            action=ActionTypes.update,
            changed_fields=["is_deleted"] + (["token_version"] if data.is_deleted else []),
        )
        db.add(log)

        db.commit()

        return response_handler(
            status=True,
            message="User soft-deleted successfully" if data.is_deleted else "User restored successfully",
            data={"user_id": user_id, "is_deleted": data.is_deleted},
            status_code=200
        )

    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user deletion status")

