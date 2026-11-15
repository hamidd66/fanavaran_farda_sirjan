from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request, Depends
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.session import get_db
from app.services.tokens import verify_token
from app.models.user import User
from app.core.exceptions.custom_exceptions import AppException
from app.enums.response_codes import ResponseCode


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> dict | None:
        token = request.cookies.get("access_token")

        if not token:
            auth: HTTPAuthorizationCredentials | None = await super().__call__(request)

            if auth is None: return None

            token = auth.credentials

        payload = verify_token(token)

        if payload is None:
            if self.auto_error:
                raise AppException(code=ResponseCode.INVALID_TOKEN, message="Invalid or expired access token")
            return None

        return payload


def get_payload(payload: dict = Depends(JWTBearer()), db: Session = Depends(get_db)) -> dict:
    if not _validate_user(payload, db):
        raise AppException(code=ResponseCode.INVALID_CREDENTIALS, message="Invalid authentication")

    return payload


def get_optional_payload(payload: dict | None = Depends(JWTBearer(auto_error=False)), db: Session = Depends(get_db)) -> dict | None:
    if not _validate_user(payload, db):
        return None

    return payload


def _validate_user(payload: dict | None, db: Session) -> bool:
    if not isinstance(payload, dict):
        return False

    try:
        user_id = UUID(str(payload["sub"]))
    except (KeyError, ValueError, TypeError, AttributeError):
        return False

    token_version = payload.get("token_version")
    if token_version is None: return False

    if payload.get("type") != "access":
        return False

    user_exists = db.query(User.id).filter(
        User.id == user_id,
        User.is_active.is_(True),
        User.deleted_at.is_(None),
        User.token_version == token_version
    ).first()

    if user_exists is None: return False

    return True