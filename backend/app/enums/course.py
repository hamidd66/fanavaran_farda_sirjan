from enum import Enum


class CategorySort(str, Enum):
    order_asc = "order_asc"      # بر اساس display_order صعودی
    order_desc = "order_desc"    # بر اساس display_order نزولی
    newest = "newest"            # جدیدترین
    oldest = "oldest"            # قدیمی‌ترین


class CourseSort(str, Enum):
    newest = "newest"
    oldest = "oldest"
    tuition_asc = "tuition_asc"
    tuition_desc = "tuition_desc"
    title_asc = "title_asc"
    title_desc = "title_desc"
