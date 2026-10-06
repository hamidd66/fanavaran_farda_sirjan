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
