import enum


class SessionType(enum.Enum):
    session = "session"
    midterm = "midterm"
    final = "final"

class ContentType(enum.Enum):
    image = "image"                 # تصویر، نمودار و اینفوگرافیک
    video = "video"                 # ویدئوی آموزشی
    audio = "audio"                 # فایل صوتی یا پادکست
    text = "text"                   # محتوای متنی و مقاله آموزشی
    document = "document"           # جزوه، PDF و سایر اسناد
    presentation = "presentation"   # اسلاید و ارائه آموزشی
    link = "link"                   # لینک منابع خارجی
    code = "code"                   # کد یا نمونه برنامه‌نویسی
    exercise = "exercise"           # تمرین آموزشی
    quiz = "quiz"                   # آزمون کوتاه
    interactive = "interactive"     # محتوای تعاملی
    downloadable = "downloadable"   # فایل یا بسته قابل دانلود
    other = "other"                 # سایر انواع محتوا

class TermSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    term_number_asc = "term_number_asc"
    term_number_desc = "term_number_desc"

class TermSessionSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    session_number_asc = "session_number_asc"
    session_number_desc = "session_number_desc"

class SessionContentSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    display_order_asc = "display_order_asc"
    display_order_desc = "display_order_desc"