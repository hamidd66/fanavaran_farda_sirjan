from enum import Enum


class CategorySort(str, Enum):
    order_asc = "order_asc"      # بر اساس display_order صعودی
    order_desc = "order_desc"    # بر اساس display_order نزولی
    newest = "newest"            # جدیدترین
    oldest = "oldest"            # قدیمی‌ترین
