from fastapi import Response
from datetime import timedelta
from app.config.settings import settings


def set_auth_cookie(response: Response, key: str, value: str, path: str = "/") -> None:

    if key == "refresh_token":
        max_age = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600
    elif key == "access_token":
        max_age = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    
    response.set_cookie(
        key = key,
        value = value,
        httponly = True,          # غیرفعال کردن دسترسی جاوااسکریپت (ارتقای امنیت)
        secure = False,           # فقط روی HTTPS کار می‌کند (در localhost می‌توانید False بگذارید)
        samesite = "lax",         # جلوگیری از حملات CSRF
        max_age = max_age,        # مدت اعتبار به ثانیه
        path = path               # کوکی فقط به این endpoint ارسال شود
    )


def delete_auth_cookie(response: Response, key: str, path: str = "/") -> None:

    response.delete_cookie(
        key = key,
        path = path,
        httponly = True,
        secure = True,
        samesite = "lax"
    )