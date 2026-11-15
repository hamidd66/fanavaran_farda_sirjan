from uuid import UUID
from fastapi import APIRouter, Depends, Query, Response, Cookie, Request, File, UploadFile, Form
from sqlalchemy import or_, exists
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import Optional, List
from pydantic import ValidationError
import math
import json
import logging

from app.core.exceptions.custom_exceptions import AppException
from app.db.session import get_db
from app.services.cookies import set_auth_cookie, delete_auth_cookie
from app.services.tokens import verify_token, generate_access_token, generate_refresh_token

from app.core.responses.response_builder import success_response
from app.utils.hashing import hash_password, verify_password
from app.utils.delete_file import delete_files
from app.core.rate_limiters.ip_limiter import check_ip_limit
from app.core.rate_limiters.login_limiter import is_account_locked, register_failed_login, register_successful_login
from app.repositories.user_repo import get_user_data
from app.repositories.role_repo import get_role_by_name
from app.repositories.file_repo import add_files, remove_files, confirm_pending_uploads, cleanup_pending_uploads
from app.dependencies.permissions import require_roles

from app.enums.response_codes import ResponseCode
from app.models.person import Person
from app.models.staff_profile import StaffProfile
from app.models.user import User
from app.models.user_role import UserRole
from app.models.role import Role
from app.models.student_profile import StudentProfile
from app.schemas.user import UserLogin, UserUpdate, ToggleActiveStatus, ChangePassword, UserOut, ToggleDeleteStatus, UserCreate
from app.schemas.staff_profile import StaffUpdate, StaffCreate
from app.schemas.person import PersonSelfCreate, PersonUpdate, PersonAdminCreate
from app.schemas.student_profile import StudentCreate, StudentUpdate
from app.schemas.file_attachment import FileAttachmentCreate
from app.enums.student_profile import StudentEducationalStatus
from app.enums.staff_profile import StaffEmploymentStatus
from app.enums.user import UserRoleEnum, UserSort
from app.enums.file import EntityType, FilePurpose

logger = logging.getLogger(__name__)


router = APIRouter(prefix="/user", tags=["Users"])


@router.post("/register/student")
async def register_student(
    response: Response,
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    try:
        full_data = json.loads(data)

        user_data = UserCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        filters = [
            getattr(User, field) == user_data.get(field)
            for field in ["username", "national_code", "phone", "email"]
            if user_data.get(field)
        ]
        if filters:
            user_exists = db.query(exists().where(or_(*filters))).scalar()
            if user_exists:
                raise AppException(code=ResponseCode.USER_ALREADY_EXISTS, message="User already exists")

        user_data["password"] = hash_password(user_data["password"])
        new_user = User(
            **user_data,
            is_active=True,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
        )
        db.add(new_user)
        db.flush()

        person_data = PersonSelfCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_person = Person(
            **person_data,
            user_id=new_user.id,
        )
        db.add(new_person)
        db.flush()

        student_profile_data = StudentCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_student_profile = StudentProfile(
            **student_profile_data,
            person_id=new_person.id,
            educational_status=StudentEducationalStatus.suspended,
        )
        db.add(new_student_profile)
        db.flush()

        db_role_student = get_role_by_name(db, UserRoleEnum.student)
        if not db_role_student:
            raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Student role not found")
        
        user_role = UserRole(
            user_id=new_user.id,
            role_id=db_role_student.id,
            assigned_by=new_user.id,
            is_access=True
        )
        db.add(user_role)

        if avatar:
            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.avatar,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=new_user.id,
                entity_id=new_person.id,
                entity_type=EntityType.persons,
                folder_name="person",
                files=[avatar],
                attachments=attachments_data
            )

        db.commit()
        confirm_pending_uploads(db)

        access_token = generate_access_token(new_user)
        refresh_token = generate_refresh_token(new_user)

        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
        set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return success_response(
            code=ResponseCode.CREATED,
            message="Student registered successfully and logged in",
            data=UserOut.model_validate(new_user).model_dump(),
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="User data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Student registration failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Student registration failed") from e


@router.post("/admin/register/student")
async def register_student_by_admin(
    data: str = Form(...),
    auth: dict = Depends(require_roles("admin")),
    avatar: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])
        full_data = json.loads(data)

        user_data = UserCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        filters = [
            getattr(User, field) == user_data.get(field)
            for field in ["username", "national_code", "phone", "email"]
            if user_data.get(field)
        ]
        if filters:
            user_exists = db.query(exists().where(or_(*filters))).scalar()
            if user_exists:
                raise AppException(code=ResponseCode.USER_ALREADY_EXISTS, message="User already exists")

        user_data["password"] = hash_password(user_data["password"])
        new_user = User(
            **user_data,
            is_active=True,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
        )
        db.add(new_user)
        db.flush()

        person_data = PersonAdminCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_person = Person(
            **person_data,
            user_id=new_user.id,
        )
        db.add(new_person)
        db.flush()

        student_profile_data = StudentCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_student_profile = StudentProfile(
            **student_profile_data,
            person_id=new_person.id,
            educational_status=StudentEducationalStatus.suspended,
        )
        db.add(new_student_profile)
        db.flush()

        db_role_student = get_role_by_name(db, UserRoleEnum.student)
        if not db_role_student:
            raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Student role not found")
        
        user_role = UserRole(
            user_id=new_user.id,
            role_id=db_role_student.id,
            assigned_by=admin_id,
            is_access=True
        )
        db.add(user_role)

        if avatar:
            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.avatar,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_person.id,
                entity_type=EntityType.persons,
                folder_name="person",
                files=[avatar],
                attachments=attachments_data
            )

        db.commit()
        confirm_pending_uploads(db)

        return success_response(
            code=ResponseCode.CREATED,
            message="Student registered successfully by admin",
            data={"user_id": new_user.id},
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="User data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Student registration failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Student registration failed") from e


@router.post("/admin/register/staff")
async def register_staff_by_admin(
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        admin_id = UUID(auth["payload"]["sub"])
        full_data = json.loads(data)

        user_data = UserCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        filters = [
            getattr(User, field) == user_data.get(field)
            for field in ["username", "national_code", "phone", "email"]
            if user_data.get(field)
        ]
        if filters:
            user_exists = db.query(exists().where(or_(*filters))).scalar()
            if user_exists:
                raise AppException(code=ResponseCode.USER_ALREADY_EXISTS, message="User already exists")

        user_data["password"] = hash_password(user_data["password"])
        new_user = User(
            **user_data,
            is_active=True,
            token_version=1,
            failed_login_count=0,
            locked_until=None,
        )
        db.add(new_user)
        db.flush()

        person_data = PersonAdminCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_person = Person(
            **person_data,
            user_id=new_user.id,
        )
        db.add(new_person)
        db.flush()

        staff_profile_data = StaffCreate.model_validate(full_data).model_dump(exclude_unset=True, exclude_none=True)
        new_staff_profile = StaffProfile(
            **staff_profile_data,
            person_id=new_person.id,
            employment_status=StaffEmploymentStatus.suspended,
        )
        db.add(new_staff_profile)
        db.flush()

        if avatar:
            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.avatar,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()
            await add_files(
                db=db,
                uploaded_by=admin_id,
                entity_id=new_person.id,
                entity_type=EntityType.persons,
                folder_name="person",
                files=[avatar],
                attachments=attachments_data
            )

        db.commit()
        confirm_pending_uploads(db)

        return success_response(
            code=ResponseCode.CREATED,
            message="Staff registered successfully by admin",
            data={"user_id": new_user.id},
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="User data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Staff registration failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Staff registration failed") from e


@router.post("/login/national-code-password")
def login_national_code_password(
    request: Request,
    response: Response,
    data: UserLogin,
    db: Session = Depends(get_db),
):
    try:
        check_ip_limit(request)

        db_user = get_user_data(db, User.national_code == data.national_code)

        if not db_user:
            raise AppException(code=ResponseCode.INVALID_CREDENTIALS, message="Invalid national code or password")

        if is_account_locked(db_user):
            raise AppException(code=ResponseCode.RATE_LIMIT_EXCEEDED, message="You cannot submit a request due to too many attempts")

        if not verify_password(data.password, db_user.password):
            register_failed_login(db, db_user)
            raise AppException(code=ResponseCode.INVALID_CREDENTIALS, message="Invalid national code or password")

        if not db_user.is_active:
            raise AppException(code=ResponseCode.ACCOUNT_INACTIVE, message="Account is inactive")

        if db_user.deleted_at is not None:
            db_user.deleted_at = None

        register_successful_login(db, db_user)
        
        db_user.last_login = datetime.now(timezone.utc)

        db.commit()

        access_token = generate_access_token(db_user)
        refresh_token = generate_refresh_token(db_user)

        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
        set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return success_response(
            code=ResponseCode.AUTHENTICATED,
            message="Login successful",
            data=UserOut.model_validate(db_user).model_dump(),
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Login failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Login failed") from e


@router.post("/logout")
def logout_user(
    response: Response,
    auth: dict = Depends(require_roles()),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(auth["payload"]["sub"])

        updated_rows = (
            db.query(User)
            .filter(User.id == user_id)
            .update(
                {User.token_version: User.token_version + 1},
                synchronize_session="evaluate",
            )
        )

        if updated_rows == 0:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        db.commit()

        delete_auth_cookie(response=response, key="access_token", path="/")
        delete_auth_cookie(response=response, key="refresh_token", path="/user/refresh")

        return success_response(
            code=ResponseCode.LOGGED_OUT,
            message="Logged out successfully",
            data=None,
        )

    except AppException:
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Logout failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Logout failed") from e


@router.post("/logout-current")
def logout_current_device(
    response: Response,
    auth: dict = Depends(require_roles()),
):
    try:
        delete_auth_cookie(response=response, key="access_token", path="/")
        delete_auth_cookie(response=response, key="refresh_token", path="/user/refresh")

        return success_response(
            code=ResponseCode.LOGGED_OUT,
            message="Logged out from current device successfully",
            data=None,
        )

    except AppException:
        raise
    except Exception as e:
        logger.exception("Logout failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Logout failed") from e


@router.post("/refresh")
def refresh_token(
    response: Response,
    refresh_token: str | None = Cookie(None),
    db: Session = Depends(get_db)
):
    try:
        if not refresh_token:
            raise AppException(code=ResponseCode.AUTHENTICATION_REQUIRED, message="Refresh token cookie missing")

        payload = verify_token(refresh_token)

        if not payload or payload.get("type") != "refresh":
            raise AppException(code=ResponseCode.INVALID_TOKEN, message="Invalid or expired refresh token")

        user_id = payload.get("sub")
        token_version = payload.get("token_version")

        db_user = get_user_data(
            db,
            User.id == user_id,
            User.deleted_at.is_(None),
            User.is_active.is_(True)
        )

        if not db_user:
            raise AppException(code=ResponseCode.AUTHENTICATION_REQUIRED, message="User not found or inactive")

        if token_version != db_user.token_version:
            raise AppException(code=ResponseCode.TOKEN_REVOKED, message="Token has been revoked")

        access_token = generate_access_token(db_user)
        set_auth_cookie(response=response, key="access_token", value=access_token, path="/")

        return success_response(
            code=ResponseCode.TOKEN_REFRESHED,
            message="Access token refreshed successfully",
            data=None,
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Refresh failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Refresh failed") from e


@router.post("/{user_id}/staff-profile")
def register_user_as_staff(
    user_id: UUID,
    data: StaffCreate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if not db_user.person:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="User must have a person profile before registering as staff")

        person_id = db_user.person.id

        if db_user.person.staff_profile:
            raise AppException(code=ResponseCode.RESOURCE_ALREADY_EXISTS, message="User is already registered as staff")

        create_data = data.model_dump(exclude_none=True)

        new_staff_profile = StaffProfile(
            **create_data, 
            person_id=person_id,
            employment_status=StaffEmploymentStatus.suspended,
        )
        db.add(new_staff_profile)
        db.commit()

        return success_response(
            code=ResponseCode.CREATED,
            message="User successfully registered as staff",
            data=UserOut.model_validate(db_user).model_dump(),
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to register user as staff")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to register user as staff") from e


@router.post("/{user_id}/student-profile")
def register_user_as_student(
    user_id: UUID,
    data: StudentCreate,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if not db_user.person:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="User must have a person profile before registering as a student")

        person_id = db_user.person.id

        if db_user.person.student_profile:
            raise AppException(code=ResponseCode.RESOURCE_ALREADY_EXISTS, message="User is already registered as a student")

        create_data = data.model_dump(exclude_none=True)
        new_student_profile = StudentProfile(
            **create_data, 
            person_id=person_id,
            educational_status=StudentEducationalStatus.suspended
        )
        db.add(new_student_profile)
        db.commit()

        return success_response(
            code=ResponseCode.CREATED,
            message="User successfully registered as a student",
            data=UserOut.model_validate(db_user).model_dump(),
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to register user as a student")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to register user as a student") from e


@router.get("/me")
def get_current_user_profile(
    auth: dict = Depends(require_roles()),
    db: Session = Depends(get_db)
):
    try:
        user_id = UUID(auth["payload"]["sub"])
        
        db_user = get_user_data(db, User.id == user_id)
        
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Profile retrieved successfully",
            data=UserOut.model_validate(db_user).model_dump(),
        )

    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch profile")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch profile") from e


@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    auth: dict = Depends(require_roles("admin")),
    roles: Optional[List[str]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(True),
    is_deleted: Optional[bool] = Query(None),
    sort: Optional[UserSort] = Query(None),
):
    try:
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
            if is_deleted:
                query = query.filter(User.deleted_at.is_not(None))
            else:
                query = query.filter(User.deleted_at.is_(None))
            
        if search:
            search_term = f"%{search}%"
            query = query.join(User.person).filter(
                or_(
                    User.national_code.ilike(search_term),
                    User.username.ilike(search_term),
                    User.phone.ilike(search_term),
                    User.email.ilike(search_term),
                    Person.first_name.ilike(search_term),
                    Person.last_name.ilike(search_term),
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

        return success_response(
            code=ResponseCode.RETRIEVED,
            message="Users retrieved successfully",
            data={
                "users": users_list,
                "page": page,
                "limit": limit,
                "total": total_count,
                "pages": math.ceil(total_count / limit)
            },
        )
        
    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to fetch users")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to fetch users") from e


@router.get("/{user_id}")
def get_user_by_id(
    user_id: UUID, 
    auth: dict = Depends(require_roles("admin")), 
    db: Session = Depends(get_db)
):
    try:
        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))

        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")
        
        return success_response(
            code=ResponseCode.RETRIEVED,
            message="User retrieved successfully",
            data=UserOut.model_validate(db_user).model_dump(),
        )

    except AppException:
        raise
    except Exception as e:
        logger.exception("Failed to retrieve user profile")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to retrieve user profile") from e


@router.patch("/{user_id}")
async def update_user(
    user_id: UUID,
    data: str = Form(...),
    avatar: UploadFile | None = File(None),
    auth: dict = Depends(require_roles()),
    db: Session = Depends(get_db)
):
    try:
        user_roles = auth["roles"]
        current_user_id = UUID(auth["payload"]["sub"])
        is_admin = "admin" in user_roles

        if not is_admin and current_user_id != user_id:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="Access denied")

        db_user = get_user_data(db, User.id == user_id, User.deleted_at.is_(None))

        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")
        if not db_user.person:
            raise AppException(code=ResponseCode.RESOURCE_NOT_FOUND, message="Person information not defined")

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
                changed_keys.append(key)
                setattr(db_user.person.student_profile, key, value)

        if db_user.person.staff_profile:
            staff_profile_data = StaffUpdate.model_validate_json(data).model_dump(exclude_unset=True)
            for key, value in staff_profile_data.items():
                if key in ["employment_type", "hire_date"] and not is_admin:
                    raise AppException(code=ResponseCode.ACCESS_DENIED, message="Access denied")
                changed_keys.append(key)
                setattr(db_user.person.staff_profile, key, value)

        if not changed_keys and not avatar:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="No fields to update")

        deleted_paths = []
        if avatar:
            changed_keys.append("avatar")

            deleted_attachment_ids = [file_att.id for file_att in db_user.person.file_attachments if file_att.purpose == "avatar"]
            if deleted_attachment_ids:
                result = remove_files(db=db, attachment_ids=deleted_attachment_ids)
                deleted_paths = result["deleted_paths"]

            attachments_data = FileAttachmentCreate(
                items=[{
                    "file_index": 0,
                    "purpose": FilePurpose.avatar,
                    "display_order": 1,
                    "is_primary": True,
                    "is_active": True
                }]
            ).model_dump()

            await add_files(
                db=db,
                uploaded_by=current_user_id,
                entity_id=db_user.person.id,
                entity_type=EntityType.persons,
                folder_name="person",
                files=[avatar],
                attachments=attachments_data
            )

        db.commit()
        db.refresh(db_user)
        confirm_pending_uploads(db)

        if avatar and deleted_paths:
            delete_files(deleted_paths)

        return success_response(
            code=ResponseCode.UPDATED,
            message="User updated successfully",
            data=UserOut.model_validate(db_user).model_dump(),
        )

    except AppException:
        db.rollback()
        cleanup_pending_uploads(db)
        raise
    except ValidationError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.VALIDATION_ERROR, data=e.errors()) from e
    except IntegrityError as e:
        db.rollback()
        cleanup_pending_uploads(db)
        raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message="Input data conflicts with existing records") from e
    except Exception as e:
        db.rollback()
        cleanup_pending_uploads(db)
        logger.exception("Failed to update user")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update user") from e


@router.patch("/{user_id}/toggle-active")
def toggle_active_status(
    user_id: UUID,
    data: ToggleActiveStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        current_user_id = UUID(auth["payload"]["sub"])

        if current_user_id == user_id:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="You cannot change your active status")
        
        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")
        
        if db_user.is_active == data.is_active:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"User status is already set to {data.is_active}")

        db_user.is_active = data.is_active
        db_user.token_version += 1

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message=f"User active status successfully set to {data.is_active}",
            data={"user_id": db_user.id, "is_active": data.is_active},
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to toggle user status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to toggle user status") from e


@router.patch("/{user_id}/change-password")
def change_password(
    response: Response, 
    user_id: UUID, 
    data: ChangePassword, 
    auth: dict = Depends(require_roles()), 
    db: Session = Depends(get_db)
):
    try:
        current_user_id = UUID(auth["payload"]["sub"])
        is_admin = "admin" in auth["roles"]

        if not is_admin and current_user_id != user_id:
            raise AppException(code=ResponseCode.ACCESS_DENIED, message="Access denied")
        
        db_user = get_user_data(db, User.id == user_id, User.is_deleted.is_(False))
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if not is_admin or (is_admin and current_user_id == user_id):
            if not data.old_password:
                raise AppException(code=ResponseCode.BAD_REQUEST, message="Old password is required")
            
            if not verify_password(data.old_password, db_user.password):
                raise AppException(code=ResponseCode.INVALID_CREDENTIALS, message="Incorrect old password")

        if verify_password(data.new_password, db_user.password):
            raise AppException(code=ResponseCode.BAD_REQUEST, message="New password cannot be the same as the old password")

        db_user.password = hash_password(data.new_password)
        db_user.token_version += 1

        db.commit()
        db.refresh(db_user)

        if current_user_id == user_id:
            access_token = generate_access_token(db_user)
            refresh_token = generate_refresh_token(db_user)
            
            set_auth_cookie(response=response, key="access_token", value=access_token, path="/")
            set_auth_cookie(response=response, key="refresh_token", value=refresh_token, path="/user/refresh")

        return success_response(
            code=ResponseCode.UPDATED,
            message="Password changed successfully and active sessions on other devices were terminated",
            data=None,
        )
    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Change password failed")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Change password failed") from e


@router.patch("/{user_id}/delete")
def toggle_user_soft_delete(
    user_id: UUID,
    data: ToggleDeleteStatus,
    auth: dict = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    try:
        current_admin_id = UUID(auth["payload"]["sub"])
        
        if current_admin_id == user_id:
            raise AppException(code=ResponseCode.BAD_REQUEST, message="You cannot delete your own admin account")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise AppException(code=ResponseCode.USER_NOT_FOUND, message="User not found")

        if (db_user.deleted_at is not None) == data.is_deleted:
            raise AppException(code=ResponseCode.RESOURCE_CONFLICT, message=f"User is already {'deleted' if data.is_deleted else 'restored'}")

        db_user.deleted_at = datetime.now(timezone.utc) if data.is_deleted else None        
        db_user.token_version += 1

        db.commit()

        return success_response(
            code=ResponseCode.UPDATED,
            message="User soft-deleted successfully" if data.is_deleted else "User restored successfully",
            data={"user_id": user_id, "deleted_at": data.is_deleted},
        )

    except AppException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        logger.exception("Failed to update user deletion status")
        raise AppException(code=ResponseCode.INTERNAL_SERVER_ERROR, message="Failed to update user deletion status") from e

