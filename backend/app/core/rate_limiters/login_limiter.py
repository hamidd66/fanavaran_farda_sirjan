from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.models.user import User
from app.helpers.normalize_datetime import normalize_datetime


def is_account_locked(user: User) -> bool:
    if user.locked_until is None:
        return False

    now = datetime.now(timezone.utc)
    locked_until = normalize_datetime(user.locked_until)

    if now < locked_until:
        return True
    
    else:
        user.locked_until = None
        user.failed_login_count = 0

        return False


def register_failed_login(db: Session, user: User) -> None:
    user.failed_login_count += 1

    if user.failed_login_count >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
        user.locked_until = (
            datetime.now(timezone.utc)
            + timedelta(minutes = settings.LOGIN_LOCKOUT_DURATION_MINUTES)
        )

    db.commit()


def register_successful_login(db: Session, user: User) -> None:
    user.failed_login_count = 0
    user.locked_until = None

    db.commit()
