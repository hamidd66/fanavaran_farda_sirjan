from fastapi import Response
from app.config.settings import settings

def get_cookie_max_age(key: str) -> int:

    if key == "access_token":
        return settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    if key == "refresh_token":
        return settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60

    raise ValueError(f"Unsupported authentication cookie: {key}")


def set_auth_cookie(response: Response, key: str, value: str, path: str = "/") -> None:

    response.set_cookie(
        key=key,
        value=value,
        httponly=True,                                  # غیرفعال کردن دسترسی جاوااسکریپت (ارتقای امنیت)
        secure=settings.COOKIE_SECURE,                  # فقط روی HTTPS کار می‌کند (در localhost می‌توانید False بگذارید)
        samesite=settings.COOKIE_SAMESITE,              # جلوگیری از حملات CSRF (در دامنه‌های کاملاً متفاوت باید none باشه)
        max_age=get_cookie_max_age(key),                # مدت اعتبار به ثانیه
        path=path,                                      # کوکی فقط به این endpoint ارسال شود
    )


def delete_auth_cookie(response: Response, key: str, path: str = "/") -> None:

    get_cookie_max_age(key)

    response.delete_cookie(
        key=key,
        path=path,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
    )
