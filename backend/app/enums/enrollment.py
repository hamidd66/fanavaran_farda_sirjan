import enum


class RegistrationMethod(enum.Enum):
    online = "online"
    offline = "offline"


class EnrollmentSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    name_asc = "name_asc"
    name_desc = "name_desc"