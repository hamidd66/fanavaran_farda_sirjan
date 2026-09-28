from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.tokens import verify_token
from app.models.user import User


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> dict | None:
        auth: HTTPAuthorizationCredentials | None = await super().__call__(request)

        if auth is None: return None

        payload = verify_token(auth.credentials)

        if payload is None:
            if self.auto_error:
                raise HTTPException(status_code=401, detail="Invalid or expired access token")
            return None

        return payload


def get_payload(payload: dict = Depends(JWTBearer()), db: Session = Depends(get_db)) -> dict:
    if not _validate_user(payload, db):
        raise HTTPException(status_code=401, detail="Invalid authentication")

    return payload


def get_optional_payload(payload: dict | None = Depends(JWTBearer(auto_error=False)), db: Session = Depends(get_db)) -> dict | None:
    if not _validate_user(payload, db):
        return None

    return payload


def _validate_user(payload: dict | None, db: Session) -> bool:
    if payload is None: return False

    # دریافت User ID از JWT
    user_id = payload.get("sub")
    if user_id is None: return False

    # دریافت Token Version از JWT
    token_version = payload.get("token_version")
    if token_version is None: return False

    # پیدا کردن User
    user = db.query(User).filter(
        User.id == user_id
    ).first()
    if user is None: return False

    # بررسی فعال بودن حساب
    if not user.is_active: return False

    # بررسی معتبر بودن نسخه Token
    if user.token_version != token_version: return False

    return True