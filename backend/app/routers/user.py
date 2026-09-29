from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut
from app.services.tokens import create_access_token, create_refresh_token, verify_token
from app.schemas.user import RegisterUser, LoginUser
from app.middleware.exception_handler import response_handler
from app.utils.hashing import hash_password, verify_password
from app.services.jwt_bearer import get_payload



# router = APIRouter(prefix="/api/users", tags=["مدیریت کاربران"])

router = APIRouter(prefix="/user", tags=["Users"])


@router.get("", response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    """دریافت لیست تمام کاربران سامانه"""
    return db.query(User).order_by(User.id.desc()).all()

@router.get("/{national_code}", response_model=UserOut)
def get_user_by_national_code(national_code: str, db: Session = Depends(get_db)):
    """دریافت اطلاعات کاربر با کد ملی"""
    user = db.query(User).filter(User.username == national_code).first()
    if not user:
        raise HTTPException(status_code=404, detail="کاربری با این مشخصات یافت نشد.")
    return user

@router.patch("/{national_code}/toggle-active", response_model=UserOut)
def toggle_user_active(national_code: str, db: Session = Depends(get_db)):
    """فعال یا غیرفعال کردن دسترسی کاربر"""
    user = db.query(User).filter(User.username == national_code).first()
    if not user:
        raise HTTPException(status_code=404, detail="کاربری با این مشخصات یافت نشد.")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return user
