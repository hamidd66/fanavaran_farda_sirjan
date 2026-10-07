import enum


class HoldingType(enum.Enum):
    in_person = "in_person"   # حضوری
    online = "online"         # آنلاین
    offline = "offline"       # آفلاین


class ClassroomSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    start_date_asc = "start_date_asc"
    start_date_desc = "start_date_desc"
    capacity_asc = "capacity_asc"
    capacity_desc = "capacity_desc"
    tuition_asc = "tuition_asc"
    tuition_desc = "tuition_desc"


class AttendanceStatus(enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"


class SessionType(enum.Enum):
    session = "session"
    midterm = "midterm"
    final = "final"


class ClassroomRecordSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    session_asc = "session_asc"
    session_desc = "session_desc"
    name_asc = "name_asc"
    name_desc = "name_desc"
    grade_desc = "grade_desc"
    grade_asc = "grade_asc"


class ClassroomSessionSort(enum.Enum):
    session_asc = "session_asc"
    session_desc = "session_desc"
    date_asc = "date_asc"
    date_desc = "date_desc"
    newest = "newest"
    oldest = "oldest"