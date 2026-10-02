from fastapi import APIRouter, Depends, HTTPException, Query, Response, Cookie
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import Optional, List
import math

from app.db.session import get_db
from app.services.jwt_bearer import get_payload
from app.services.cookies import set_auth_cookie, delete_auth_cookie
from app.services.tokens import verify_token, generate_access_token, generate_refresh_token
from app.middleware.exception_handler import response_handler
from app.utils.hashing import hash_password, verify_password
from app.utils.delete_file import delete_file

from app.models.user import User
from app.models.staff import Staff
from app.models.student import Student
from app.schemas.user import UserCreate, UserLogin, UserUpdate, ToggleActiveStatus, ChangePassword
from app.schemas.staff import StaffOut, StaffUpdate, StaffCreate
from app.schemas.student import StudentOut, StudentUpdate, StudentCreate
from app.enums.user import UserRole, UserSort
from app.repositories.user_repo import get_user_data


router = APIRouter(prefix="/user", tags=["Users"])


@router.post("/register")
def register_user(response: Response, data: UserCreate, db: Session = Depends(get_db)):
    try:
        existing_user = get_user_data(db, User.national_code == data.national_code)
        if existing_user:
            raise HTTPException(status_code=409, detail="User with this national code already exists")

        is_active_status = True if data.role == UserRole.user else False

        new_user = User(
            role = data.role,
            national_code = data.national_code,
            password = hash_password(data.password),
            token_version = 1,
            is_active = is_active_status,
        )
        db.add(new_user)
        db.flush()
        db.refresh(new_user)

        raw_data = data.model_dump(exclude_none=True, exclude={"password", "role"})
        
        if data.role == UserRole.user:

            validated_data = StudentCreate(**raw_data).model_dump(exclude_unset=True)
            new_profile = Student(**validated_data, user_id = new_user.id)
            output_schema = StudentOut
            
        elif data.role in {UserRole.teacher, UserRole.admin}:

            validated_data = StaffCreate(**raw_data).model_dump(exclude_unset=True)
            new_profile = Staff(**validated_data, user_id = new_user.id)
            output_schema = StaffOut
            
        else:
            raise HTTPException(status_code=400, detail="Invalid role")

        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)

        access_token = None
        refresh_token = None
        
        if new_user.is_active:
            
            access_token = generate_access_token(new_user)
            refresh_token = generate_refresh_token(new_user)

            set_auth_cookie(response = response, key = "access_token", value = access_token, path = "/")
            set_auth_cookie(response = response, key = "refresh_token", value = refresh_token, path = "/user/refresh")

        return response_handler(
            status=True,
            message=(
                "User created successfully and logged in" 
                if new_user.is_active 
                else "User registered successfully; awaiting admin approval"
            ),
            data={
                "user": output_schema.model_validate(new_profile).model_dump(),
                "access_token": access_token,
                "refresh_token": refresh_token
            },
            status_code=201
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User or profile data conflicts with existing records")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="User creation failed")


@router.post("/login")
def login_user(response: Response, data: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = get_user_data(db, User.national_code == data.national_code)

        if not db_user or not verify_password(data.password, db_user.password):
            raise HTTPException(status_code=401, detail="Invalid national code or password")

        if not db_user.is_active:
            raise HTTPException(status_code=403, detail="Account is inactive")

        db_user.last_login = datetime.now(timezone.utc)
        
        access_token = generate_access_token(db_user)
        refresh_token = generate_refresh_token(db_user)

        set_auth_cookie(response = response, key = "access_token", value = access_token, path = "/")
        set_auth_cookie(response = response, key = "refresh_token", value = refresh_token, path = "/user/refresh")

        profile_data = None

        if db_user.role == UserRole.user:
            if not db_user.student:
                raise HTTPException(status_code=404, detail="Student profile not found")
            profile_data = StudentOut.model_validate(db_user.student).model_dump()

        elif db_user.role in {UserRole.admin, UserRole.teacher}:
            if not db_user.staff:
                raise HTTPException(status_code=404, detail="Staff profile not found")
            profile_data = StaffOut.model_validate(db_user.staff).model_dump()

        else:
            raise HTTPException(status_code=400, detail="Invalid user role")

        db.commit()

        return response_handler(
            status=True,
            message="Login successful",
            data={
                "user": profile_data,
                "access_token": access_token,
                "refresh_token": refresh_token
            },
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Login failed")


@router.post("/logout")
def logout_user(response: Response, payload = Depends(get_payload), db: Session = Depends(get_db)):
    try:
        user_id = payload.get("sub")

        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db_user.token_version += 1

        delete_auth_cookie(response = response, key = "access_token", path = "/")
        delete_auth_cookie(response = response, key = "refresh_token", path = "/user/refresh")

        db.commit()
        
        return response_handler(
            status=True,
            message="Logged out successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Logout failed")


@router.post("/refresh")
def refresh_token(response: Response, refresh_token: str | None = Cookie(None), db: Session = Depends(get_db)):
    try:
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token cookie missing")

        payload = verify_token(refresh_token)

        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

        user_id = payload.get("sub")

        db_user = get_user_data(db, User.id == user_id)

        if not db_user or not db_user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        if payload.get("token_version") != db_user.token_version:
            raise HTTPException(status_code=401, detail="Token has been revoked")

        access_token = generate_access_token(db_user)
        set_auth_cookie(response = response, key = "access_token", value = access_token, path = "/")

        return response_handler(
            status=True,
            message="Access token refreshed successfully",
            data=access_token,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Refresh failed")


@router.get("/me")
def get_current_user_profile(payload = Depends(get_payload), db: Session = Depends(get_db)):
    try:
        user_id = payload.get("sub")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if db_user.role == UserRole.user:
            if not db_user.student:
                raise HTTPException(status_code=404, detail="Student profile not found")
            
            profile_data = StudentOut.model_validate(db_user.student).model_dump()
            
        elif db_user.role in {UserRole.admin, UserRole.teacher}:
            if not db_user.staff:
                raise HTTPException(status_code=404, detail="Staff profile not found")
            
            profile_data = StaffOut.model_validate(db_user.staff).model_dump()
            
        else:
            raise HTTPException(status_code=403, detail="Invalid user role")
        
        return response_handler(
            status=True,
            message="Profile retrieved successfully",
            data=profile_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    payload = Depends(get_payload),
    roles: Optional[List[UserRole]] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    sort: Optional[UserSort] = Query(None),
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")
        
        query = db.query(User).options(
            joinedload(User.student),
            joinedload(User.staff),
        )

        if roles:
            query = query.filter(User.role.in_(roles))
            
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
            
        if search:
            search_term = f"%{search}%"
            query = query.outerjoin(Student, User.id == Student.user_id)\
                         .outerjoin(Staff, User.id == Staff.user_id)\
                         .filter(
                             or_(
                                 User.national_code.ilike(search_term),
                                 Student.full_name.ilike(search_term),
                                 Student.phone.like(search_term),
                                 Staff.full_name.ilike(search_term),
                                 Staff.phone.like(search_term),
                                 Staff.job_title.ilike(search_term)
                             )
                         )
            
        if sort == UserSort.newest:
            query = query.order_by(User.created_at.desc())
        elif sort == UserSort.oldest:
            query = query.order_by(User.created_at.asc())
            
        total_count = query.distinct().count()
        users = query.distinct().offset((page - 1) * limit).limit(limit).all()
        
        users_list = []
        for u in users:
            profile_data = None
            
            if u.role == UserRole.user and u.student:
                profile_data = StudentOut.model_validate(u.student).model_dump()
            elif u.role in {UserRole.admin, UserRole.teacher} and u.staff:
                profile_data = StaffOut.model_validate(u.staff).model_dump()
                
            if profile_data:
                users_list.append(profile_data)

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
    payload = Depends(get_payload), 
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if db_user.role == UserRole.user:
            if not db_user.student:
                raise HTTPException(status_code=404, detail="Student profile not found")
            out_data = StudentOut.model_validate(db_user.student).model_dump()
            entity_name = "Student"

        elif db_user.role in {UserRole.admin, UserRole.teacher}:
            if not db_user.staff:
                raise HTTPException(status_code=404, detail="Staff profile not found")
            out_data = StaffOut.model_validate(db_user.staff).model_dump()
            entity_name = "Staff"

        else:
            raise HTTPException(status_code=400, detail="Invalid user role")
        
        return response_handler(
            status=True,
            message=f"{entity_name} retrieved successfully",
            data=out_data,
            status_code=200
        )
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to retrieve user profile")


@router.patch("/{user_id}")
def update_user(
    user_id: str,
    raw_data: UserUpdate,
    payload = Depends(get_payload),
    db: Session = Depends(get_db)
):
    try:
        if payload.get("role") != UserRole.admin.value and payload.get("sub") != user_id:
            raise HTTPException(status_code=403, detail="Access denied")

        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        raw_dict = raw_data.model_dump(exclude_unset=True)

        if not raw_dict:
            raise HTTPException(status_code=400, detail="No fields to update")

        if "national_code" in raw_dict:
            db_user.national_code = raw_dict["national_code"]
        
        if db_user.role == UserRole.user:
            if not db_user.student:
                raise HTTPException(status_code=404, detail="Student profile not found")
            
            profile = db_user.student
            validated_data = StudentUpdate(**raw_dict).model_dump(exclude_unset=True)
            output_schema = StudentOut

        elif db_user.role in {UserRole.admin, UserRole.teacher}:
            if not db_user.staff:
                raise HTTPException(status_code=404, detail="Staff profile not found")
            
            profile = db_user.staff
            validated_data = StaffUpdate(**raw_dict).model_dump(exclude_unset=True)
            output_schema = StaffOut

        else:
            raise HTTPException(status_code=400, detail="Invalid user role for profile update")

        old_avatar = None
        if "avatar" in validated_data and profile.avatar and profile.avatar != validated_data["avatar"]:
            old_avatar = profile.avatar

        for key, value in validated_data.items():
            setattr(profile, key, value)

        db.commit()
        db.refresh(profile)

        if old_avatar:
            delete_file(old_avatar)

        return response_handler(
            status=True,
            message="User updated successfully",
            data=output_schema.model_validate(profile).model_dump(),
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Input data is problematic")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update user")


@router.patch("/{user_id}/toggle-active")
def toggle_active_status(
    user_id: str,
    data: ToggleActiveStatus,
    payload = Depends(get_payload),
    db: Session = Depends(get_db),
):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")

        if payload.get("sub") == user_id:
            raise HTTPException(status_code=400, detail="You cannot change your active status")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if db_user.is_active == data.is_active:
            raise HTTPException(status_code=409, detail=f"User status is already set to {data.is_active}")

        db_user.is_active = data.is_active
        db_user.token_version += 1  

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
        is_admin = (payload.get("role") == UserRole.admin.value)

        if not is_admin and current_user_id != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if not is_admin:
            if not data.old_password:
                raise HTTPException(status_code=400, detail="Old password is required")
            
            if not verify_password(data.old_password, db_user.password):
                raise HTTPException(status_code=400, detail="Incorrect old password")

        if verify_password(data.new_password, db_user.password):
            raise HTTPException(status_code=400, detail="New password cannot be the same as the old password")

        db_user.password = hash_password(data.new_password)
        db_user.token_version += 1

        db.commit()
        db.refresh(db_user)

        if current_user_id == user_id:
            
            access_token = generate_access_token(db_user)
            refresh_token = generate_refresh_token(db_user)
            
            set_auth_cookie(response = response, key = "access_token", value = access_token, path = "/")
            set_auth_cookie(response = response, key = "refresh_token", value = refresh_token, path = "/user/refresh")

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


@router.delete("/{user_id}")
def delete_user(user_id: str, payload = Depends(get_payload), db: Session = Depends(get_db)):
    try:
        if payload.get("role") != UserRole.admin.value:
            raise HTTPException(status_code=403, detail="Access denied")
        
        if payload.get("sub") == user_id:
            raise HTTPException(status_code=400, detail="You cannot delete your own admin account")
        
        db_user = get_user_data(db, User.id == user_id)
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(db_user)
        db.commit()

        return response_handler(
            status=True,
            message="User deleted successfully",
            data=None,
            status_code=200
        )
    except HTTPException as http_error:
        db.rollback()
        raise http_error
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="User Delete failed")
