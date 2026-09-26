from pydantic import BaseModel
from typing import List, Optional

# مدل‌های قبلی
class ActiveStudentItem(BaseModel):
    student_id: int
    full_name: str
    national_code: Optional[str] = None
    classroom_id: int

class ActiveStudentsResponse(BaseModel):
    total_active_students: int
    students: List[ActiveStudentItem]

# مدل‌های جدید برای کلاس‌های در حال برگزاری
class OngoingClassItem(BaseModel):
    classroom_id: int
    course_name: Optional[str] = None
    class_code: Optional[str] = None

class OngoingClassesResponse(BaseModel):
    total_ongoing: int
    classes: List[OngoingClassItem]
