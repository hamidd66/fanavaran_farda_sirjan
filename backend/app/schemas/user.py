from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from app.enums.user import UserRole


class RegisterUser(BaseModel):
    national_code: str = Field(..., min_length=10, max_length=10)
    full_name: str = Field(..., min_length=3, max_length=125)
    role: UserRole = Field(default=UserRole.user)
    password: str = Field(..., min_length=8, max_length=128)

class LoginUser(BaseModel):
    phone: str = Field(..., pattern=r"^09\d{9}$")
    password: str = Field(..., min_length=8, max_length=128)

# --------------------------------------------

class UserOut(BaseModel):
    id: int
    username: str
    full_name: str
    role: str
    access_level: str
    last_login: datetime | None = None
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
