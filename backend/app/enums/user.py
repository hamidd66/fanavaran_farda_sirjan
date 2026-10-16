import enum

class UserRole(enum.Enum):
    admin = "admin"
    user = "user"
    teacher = "teacher"
    # owner = "owner"


class UserSort(enum.Enum):
    newest = "newest"                       # جدید ترین
    oldest = "oldest"                       # قدیمی ترین


class ReferralSources(enum.Enum):
    friend_referral = "friend_referral"       # معرفی دوستان یا آشنایان
    school_or_work = "school_or_work"         # مدرسه یا محل کار
    alumni = "alumni"                         # هنرجویان قبلی
    passing_by = "passing_by"                 # عبور از جلوی آموزشگاه
    banner_ads = "banner_ads"                 # تبلیغات یا بنر
    poster = "poster"                         # پوستر
    route_finder = "route_finder"             # جستجوی مسیر
    instagram = "instagram"                   # اینستاگرام
    rubika = "rubika"                         # روبیکا
    google_search = "google_search"           # جست‌وجو در گوگل
    website = "website"                       # سایت آموزشگاه
    ai_suggestion = "ai_suggestion"           # پیشنهاد هوش مصنوعی
    sms_marketing = "sms_marketing"           # بازاریابی پیامکی
    other = "other"                           # سایر



class EducationLevel(enum.Enum):
    # بی‌سواد
    illiterate = "illiterate"

    # ابتدایی
    elementary_1 = "elementary_1"
    elementary_2 = "elementary_2"
    elementary_3 = "elementary_3"
    elementary_4 = "elementary_4"
    elementary_5 = "elementary_5"
    elementary_6 = "elementary_6"

    # متوسطه اول
    middle_school_7 = "middle_school_7"
    middle_school_8 = "middle_school_8"
    middle_school_9 = "middle_school_9"

    # متوسطه دوم
    high_school_10 = "high_school_10"
    high_school_11 = "high_school_11"
    high_school_12 = "high_school_12"

    # دیپلم
    diploma = "diploma"

    # دانشگاه
    associate = "associate"      # کاردانی
    bachelor = "bachelor"        # کارشناسی
    master = "master"            # کارشناسی ارشد
    doctorate = "doctorate"      # دکتری


class StaffEmploymentStatus(enum.Enum):
    ACTIVE = "active"              # مشغول به همکاری
    INACTIVE = "inactive"          # غیرفعال / پایان همکاری
    SUSPENDED = "suspended"        # تعلیق موقت


class StudentEmploymentStatus(enum.Enum):
    ACTIVE = "active"              # فعال
    GRADUATED = "graduated"        # فارغ‌التحصیل
    SUSPENDED = "suspended"        # معلق


class EmploymentType(enum.Enum):
    FULL_TIME = "full_time"          # تمام‌وقت
    PART_TIME = "part_time"          # پاره‌وقت
    CONTRACTUAL = "contractual"      # قراردادی
    HOURLY = "hourly"                # ساعتی
    PROJECT_BASED = "project_based"  # پروژه‌ای
    VOLUNTEER = "volunteer"          # داوطلبانه


class Specialty(enum.Enum):
    COMPUTER_FUNDAMENTALS = "computer_fundamentals"  # مبانی کامپیوتر
    ALGORITHMS = "algorithms"                        # الگوریتم و فلوچارت
    PROGRAMMING = "programming"                      # برنامه‌نویسی
    PYTHON = "python"                                # پایتون
    JAVASCRIPT = "javascript"                        # جاوااسکریپت
    TYPESCRIPT = "typescript"                        # تایپ‌اسکریپت
    JAVA = "java"                                    # جاوا
    C = "c"                                          # زبان C
    CPP = "cpp"                                      # زبان ++C
    CSHARP = "csharp"                                # سی‌شارپ
    PHP = "php"                                      # پی‌اچ‌پی

    FRONTEND = "frontend"                            # توسعه فرانت‌اند
    HTML_CSS = "html_css"                            # طراحی صفحات با HTML و CSS
    REACT = "react"                                  # ری‌اکت
    BACKEND = "backend"                              # توسعه بک‌اند
    FASTAPI = "fastapi"                              # فست‌API
    DJANGO = "django"                                # جنگو
    NODEJS = "nodejs"                                # نود جی‌اس

    DATABASE = "database"                            # پایگاه داده
    SQL = "sql"                                      # زبان SQL
    POSTGRESQL = "postgresql"                        # پستگرس‌کیوال
    MYSQL = "mysql"                                  # مای‌اس‌کیوال
    SQLITE = "sqlite"                                # اس‌کیوال‌لایت

    API_DEVELOPMENT = "api_development"              # طراحی و توسعه API
    SOFTWARE_ARCHITECTURE = "software_architecture"  # معماری نرم‌افزار
    SOFTWARE_TESTING = "software_testing"            # تست نرم‌افزار
    GIT = "git"                                      # گیت و کنترل نسخه
    DOCKER = "docker"                                # داکر و کانتینرسازی
    DEVOPS = "devops"                                # دواپس
    CYBER_SECURITY = "cyber_security"                # امنیت سایبری
    NETWORK = "network"                              # شبکه
    ARTIFICIAL_INTELLIGENCE = "artificial_intelligence"  # هوش مصنوعی
    MACHINE_LEARNING = "machine_learning"            # یادگیری ماشین
    DATA_SCIENCE = "data_science"                    # علم داده

