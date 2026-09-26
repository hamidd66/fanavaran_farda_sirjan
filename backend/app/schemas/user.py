from datetime import datetime
from pydantic import BaseModel

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
