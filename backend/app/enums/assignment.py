import enum


class AssignmentType(enum.Enum):
    exercise = "exercise"       # تمرین
    project = "project"         # پروژه
    quiz = "quiz"               # کوییز
    assignment = "assignment"   # تکلیف


class SubmissionStatus(enum.Enum):
    pending_review = "pending_review"     # در انتظار بررسی
    reviewed = "reviewed"                 # بررسی شد


class ReviewStatus(enum.Enum):
    needs_revision = "needs_revision"     # نیاز به اصلاح
    approved = "approved"                 # تایید و نهایی شد


class AssignmentSort(enum.Enum):
    newest = "newest"
    oldest = "oldest"
    session_asc = "session_asc"
    session_desc = "session_desc"
    title_asc = "title_asc"
    title_desc = "title_desc"
