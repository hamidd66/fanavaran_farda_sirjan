from collections import defaultdict, deque
from time import monotonic
from fastapi import HTTPException, Request
# import asyncio
from threading import Lock

from app.config.settings import settings


class IpLimiter:
    def __init__(
        self,
        max_attempts = settings.MAX_IP_ATTEMPTS,           # (تعداد دفعات درخواست)
        window_seconds = settings.IP_WINDOW_MINUTES * 60,       # (بازه زمانی بررسی درخواست ها)
        lockout_seconds = settings.IP_LOCKOUT_MINUTES * 60,     # (مدت زمان قفل شدن پس از رسیدن به حد مجاز)
    ):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.lockout_seconds = lockout_seconds
        
        self.requests = defaultdict(lambda: {
            "timestamps": deque(),
            "locked_until": 0.0
        })
        
        # self.lock = asyncio.Lock()
        self.lock = Lock()

    def check(self, ip_address: str) -> None:
        now = monotonic()

        with self.lock:
            data = self.requests[ip_address]
            timestamps = data["timestamps"]
            locked_until = data["locked_until"]

            if now < locked_until:
                retry_after = int(locked_until - now) + 1
                raise HTTPException(
                    status_code=429,
                    detail="Account temporarily locked due to too many attempts.",
                    headers={"Retry-After": str(retry_after)},
                )

            while timestamps and now - timestamps[0] >= self.window_seconds:
                timestamps.popleft()

            if len(timestamps) >= self.max_attempts:
                data["locked_until"] = now + self.lockout_seconds
                timestamps.clear()
                
                raise HTTPException(
                    status_code=429,
                    detail="Too many login attempts. You are locked out.",
                    headers={"Retry-After": str(self.lockout_seconds)},
                )

            timestamps.append(now)

login_rate_limiter = IpLimiter()

def check_ip_limit(request: Request) -> str:
    # نکته مهم: اگر پشت Nginx/Cloudflare هستید، باید IP واقعی را از هدرها بخوانید.
    # این یک روش ساده است، اما در پروداکشن حتماً از Middleware برای استخراج IP واقعی استفاده کنید.
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        ip_address = forwarded_for.split(",")[0].strip()
    else:
        client = request.client
        ip_address = client.host if client else "unknown"

    login_rate_limiter.check(ip_address)

    return ip_address
