import enum


class HoldingType(enum.Enum):
    in_person = "in_person"                            # حضوری
    online = "online"                                  # آنلاین
    offline = "offline"                                # آفلاین

class ClassroomStatus(enum.Enum):
    draft = "draft"                                    # پیش‌نویس؛ کلاس ساخته شده ولی هنوز منتشر نشده.
    open_for_registration = "open_for_registration"    # باز برای ثبت‌نام.
    registration_closed = "registration_closed"        # ثبت‌نام بسته شده و کلاس هنوز شروع نشده.
    in_progress = "in_progress"                        # در حال برگزاری.
    completed = "completed"                            # پایان‌یافته.
    cancelled = "cancelled"                            # لغوشده 

class EnrollmentStatus(enum.Enum):
    pending = "pending"                                # در انتظار تأیید یا پرداخت.
    active = "active"                                  # فعال.
    waitlisted = "waitlisted"                          # در انتظار ظرفیت خالی.
    withdrawn = "withdrawn"                            # انصراف‌داده.
    transferred = "transferred"                        # منتقل‌شده به کلاس دیگر.
    completed = "completed"                            # تکمیل‌شده.
    suspended = "suspended"                            # تعلیق‌شده.

class ClassroomSessionStatus(enum.Enum):
    scheduled = "scheduled"                            # برنامه ریزی شده
    in_progress = "in_progress"                        # درحال انجام
    held = "held"                                      # برگزار شده
    cancelled = "cancelled"                            # لغو شده
    rescheduled = "rescheduled"                        # تغییر زمان یافته

class AttendanceStatus(enum.Enum):
    present = "present"                                # حاضر
    absent = "absent"                                  # غایب
    excused = "excused"                                # غیبت موجه

class WeekDay(enum.Enum):
    saturday = "saturday"
    sunday = "sunday"
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"


class ClassroomSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    start_date_asc = "start_date_asc"
    start_date_desc = "start_date_desc"
    capacity_asc = "capacity_asc"
    capacity_desc = "capacity_desc"
    tuition_asc = "tuition_asc"
    tuition_desc = "tuition_desc"

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
    