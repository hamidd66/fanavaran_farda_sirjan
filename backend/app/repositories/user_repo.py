from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.tokens import create_access_token, create_refresh_token
from app.utils.hashing import hash_password

from app.models.user import User
from app.schemas.student import StudentCreate
from app.enums.user import UserRole


def create_user(data: StudentCreate, db: Session, role: UserRole) -> dict:
    try:
        db_user = db.query(User).filter(User.national_code == data.national_code).first()
        if db_user:
            raise HTTPException(status_code=409, detail="National code already exists")

        new_user = User(
            national_code = data.national_code,
            full_name = data.full_name,
            role = role,
            password = hash_password(data.password),
            token_version = "1",
            is_active = True,
        )
        db.add(new_user)
        db.flush()
        db.refresh(new_user)
        
        access_token = create_access_token({
            "sub": new_user.id,
            "role": new_user.role.value,
            "token_version": new_user.token_version,
        })
        refresh_token = create_refresh_token({
            "sub": new_user.id,
            "role": new_user.role.value,
        })

        return {
            "user": new_user,
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    
    except HTTPException as http_error:
        raise http_error
    except Exception:
        raise HTTPException(status_code=500, detail="User create failed")

