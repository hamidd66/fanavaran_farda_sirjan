from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

def create_user_for_entity(
    db: Session,
    national_code: str,
    full_name: str,
    role: str,
    access_level: str = "user"
) -> User:
    """ایجاد اکانت کاربری با نام‌کاربری و پسورد پیش‌فرض (کد ملی)"""
    new_user = User(
        username=national_code,
        full_name=full_name,
        role=role,
        access_level=access_level,
        password_hash=get_password_hash(national_code), # رمز پیش‌فرض = کد ملی هش‌شده
        is_active=True
    )
    db.add(new_user)
    return new_user
