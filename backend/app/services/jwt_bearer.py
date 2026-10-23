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
        token = request.cookies.get("access_token")

        if not token:
            auth: HTTPAuthorizationCredentials | None = await super().__call__(request)

            if auth is None: return None

            token = auth.credentials

        payload = verify_token(token)

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

    user_id = payload.get("sub")
    if user_id is None: return False

    token_version = payload.get("token_version")
    if token_version is None: return False

    user_exists = db.query(User.id).filter(
        User.id == user_id,
        User.is_active.is_(True),
        User.is_deleted.is_(False),
        User.token_version == token_version
    ).first()

    if user_exists is None: return False

    return True