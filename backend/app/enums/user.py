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