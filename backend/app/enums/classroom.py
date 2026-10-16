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
    present = "present"                       # حاضر
    excused_absent = "excused_absent"         # غیبت موجه
    unexcused_absent = "unexcused_absent"     # غیبت غیرموجه
    late = "late"                             # تأخیر

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

class ClassroomStatus(enum.Enum):
    open = "open"   # باز برای ثبت‌نام
    in_progress = "in_progress"      # در حال برگزاری
    completed = "completed"          # پایان‌یافته
    cancelled = "cancelled"          # لغوشده

class ClassroomSessionStatus(enum.Enum):
    scheduled = "scheduled"          # برنامه ریزی شده
    in_progress = "in_progress"      # درحال انجام
    held = "held"                    # برگزار شده
    cancelled = "cancelled"          # لغو شده
    rescheduled = "rescheduled"      # تغییر زمان یافته

class EnrollmentStatus(enum.Enum):
    active = "active"                  # فعال
    waitlisted = "waitlisted"          # در انتظار ظرفیت خالی
    withdrawn = "withdrawn"            # انصراف‌داده
    transferred = "transferred"        # منتقل‌شده
    completed = "completed"            # تکمیل‌شده
    deleted = "deleted"                # حذف‌شده