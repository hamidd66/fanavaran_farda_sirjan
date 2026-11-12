from pydantic_settings import BaseSettings
from typing import ClassVar
from pydantic import computed_field

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    BASE_URL: str

    JWT_SECRET: str
    JWT_ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int

    MAX_FAILED_LOGIN_ATTEMPTS: int
    LOGIN_LOCKOUT_DURATION_MINUTES: int

    MAX_IP_ATTEMPTS: int
    IP_WINDOW_MINUTES: int
    IP_LOCKOUT_MINUTES: int

    ALLOWED_FOLDERS: list[str] = ["course", "classroom", "person", "specialties", "roles", "courses", "course_categories", "terms", "session_contents"]

    PROJECT_TABLES: ClassVar[set[str]] = {"users", "persons", "staff_profiles", "student_profiles", "roles", "user_roles", "specialties", "user_specialties", "files", "file_attachments", "course_categories", "courses", "course_questions", "terms", "term_sessions", "session_contents", "classroom_locations", "classrooms", "classroom_schedules", "enrollments", "classroom_sessions", "classroom_attendances", "classroom_grades"}

    @computed_field
    @property
    def media_url(self) -> str:
        return f"{self.BASE_URL}/media/uploads"

    model_config = SettingsConfigDict(
        env_file = ".env"
    )
settings = Settings()
