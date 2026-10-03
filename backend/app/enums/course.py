import enum


class CategorySort(enum.Enum):
    order_asc = "order_asc"      # بر اساس display_order صعودی
    order_desc = "order_desc"    # بر اساس display_order نزولی
    newest = "newest"            # جدیدترین
    oldest = "oldest"            # قدیمی‌ترین


class CourseSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    tuition_asc = "tuition_asc"
    tuition_desc = "tuition_desc"
    title_asc = "title_asc"
    title_desc = "title_desc"


class ContentType(enum.Enum):
    video = "video"
    image = "image"
    audio = "audio"
    pdf = "pdf"
    document = "document"
    source_code = "source_code"
    link = "link"

class ContentSort(enum.Enum):
    session_asc = "session_asc"
    session_desc = "session_desc"
    newest = "newest"
    oldest = "oldest"