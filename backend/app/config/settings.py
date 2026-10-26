from pydantic_settings import BaseSettings
from typing import ClassVar

from app.schemas.user import UserRoleEnum


class Settings(BaseSettings):
    DATABASE_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    MAX_FAILED_LOGIN_ATTEMPTS: int
    LOGIN_LOCKOUT_DURATION_MINUTES: int

    MAX_IP_ATTEMPTS: int
    IP_WINDOW_MINUTES: int
    IP_LOCKOUT_MINUTES: int

    ALLOWED_FOLDERS: list = ["course", "classroom", "person", "specialties", "roles", "courses", "course_categories"]
    ALLOWED_EXTENSIONS: list = ["jpg", "jpeg", "png", "webp"]
    ALLOWED_CONTENT_TYPES: list = ["image/jpg", "image/jpeg", "image/png", "image/webp"]
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB

    STAFF_ROLES: ClassVar[set[str]] = {UserRoleEnum.admin.value, UserRoleEnum.teacher.value, UserRoleEnum.owner.value}
    STUDENT_ROLES: ClassVar[set[str]] = {UserRoleEnum.student.value, UserRoleEnum.user.value}


    class Config:
        env_file = ".env"

settings = Settings()