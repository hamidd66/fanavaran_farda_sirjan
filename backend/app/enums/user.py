import enum

class UserRole(enum.Enum):
    admin = "admin"
    user = "user"
    teacher = "teacher"
    # owner = "owner"

class UserSort(enum.Enum):
    newest = "newest"                       # جدید ترین
    oldest = "oldest"                       # جدید ترین
