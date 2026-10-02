from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.config.settings import settings


def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "sub": str(data["sub"]),
        "role": data["role"],
        "token_version": data["token_version"],
        "type": "access",
        "exp": expire,
    }

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(days = settings.REFRESH_TOKEN_EXPIRE_DAYS)

    to_encode = {
        "sub": str(data["sub"]),
        "role": data["role"],
        "token_version": data["token_version"],
        "type": "refresh",
        "exp": expire,
    }

    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def verify_token(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def generate_access_token(user):
    return create_access_token({
        "sub": user.id,
        "role": user.role.value,
        "token_version": user.token_version,
    })

def generate_refresh_token(user):
    return create_refresh_token({
        "sub": user.id,
        "role": user.role.value,
        "token_version": user.token_version,
    })