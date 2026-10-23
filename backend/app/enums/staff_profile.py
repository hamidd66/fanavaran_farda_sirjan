import enum


class StaffEmploymentStatus(enum.Enum):
    active = "active"              # مشغول به همکاری
    inactive = "inactive"          # غیرفعال / پایان همکاری
    suspended = "suspended"        # تعلیق موقت

class EmploymentType(enum.Enum):
    full_time = "full_time"          # تمام‌وقت
    part_time = "part_time"          # پاره‌وقت
    contractual = "contractual"      # قراردادی
    hourly = "hourly"                # ساعتی
    project_based = "project_based"  # پروژه‌ای
    volunteer = "volunteer"          # داوطلبانه
