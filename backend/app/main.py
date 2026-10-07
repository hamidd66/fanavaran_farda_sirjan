# from fastapi import FastAPI
# from app.core.database import Base, 
#   engine






from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
# from fastapi.staticfiles import StaticFiles
# from contextlib import asynccontextmanager
# import asyncio
# import logging

from .db.database import engine
from .db.base import Base
# from .db.session import SessionLocal
# from .config.settings import settings
from .middleware.exception_handler import http_exception_handler, general_exception_handler, validation_exception_handler
# from .middleware.cors import setup_cors
# from .utils.get_site_info import get_settings
# from .config import logging_config






















# ۱. ایمپورت تمام مدل‌ها برای ساخته شدن جداول
# from app.models.student import Student
# from app.models.staff import Staff
# from app.models.user import User
# from app.models.course_category import CourseCategory
# from app.models.course import Course
# from app.models.classroom import Classroom
# from app.models.enrollment import Enrollment
# from app.models.course_content import CourseContent
# from app.models.assignment import Assignment
# from app.models.course_faq import CourseFAQ
# from app.models.feedback import Feedback
# from app.models.teacher_evaluation import TeacherEvaluation
# from app.models.classroom_record import ClassroomRecords
# from app.models.classroom_sessions import ClassroomSessions
# from app.models.tuition import Tuition
# from app.models.payroll import Payroll
# from app.models.expense import Expense
# from app.models.project_income import ProjectIncome
# from app.models.project_expense import ProjectExpense
# from app.models.suggestion import Suggestion
# from app.models.poll_question import PollQuestion
# from app.models.poll_response import PollResponse
# from app.models.session_grade import SessionGrade
# from app.models import term_grade
# from app.models import competition
# from app.models import competition_registration
# from app.models import competition_result
# from app.models import student_assignment_upload
# from app.models import assignment_feedback












# # ۲. ساخت جداول دیتابیس
Base.metadata.create_all(bind=engine)

# ۳. ایمپورت روترها
from app.routers import (
    user, 
    course_category, 
    course, 
    course_content, 
    course_faq, 
    classroom, 
    classroom_record, 
    classroom_session,
    enrollment, 
    assignment, 
    feedback, 
    teacher_evaluation, 
    tuition, 
    payroll, 
    expense, 
    project_income, 
    project_expense, 
    suggestion, 
    poll_question, 
    poll_response, 
    session_grade, 
    term_grade, 
    competition, 
    competition_registration, 
    competition_result, 
    student_assignment_upload, 
    assignment_feedback, 
    dashboard
)

# ۴. ساخت نمونه FastAPI (این خط حتماً باید قبل از include_router باشد)
app = FastAPI(title="Fanavaran farda")

# ۵. اضافه کردن روترها به app
app.include_router(user.router)
# app.include_router(student.router)
# app.include_router(staff.router)
app.include_router(course_category.router) 
app.include_router(course.router)
app.include_router(course_content.router)
app.include_router(course_faq.router)
app.include_router(classroom.router)
app.include_router(enrollment.router)
app.include_router(classroom_record.router)
app.include_router(classroom_session.router)
app.include_router(assignment.router)
app.include_router(feedback.router)
app.include_router(teacher_evaluation.router)
app.include_router(tuition.router)
app.include_router(payroll.router)
app.include_router(expense.router)
app.include_router(project_income.router)
app.include_router(project_expense.router)
app.include_router(suggestion.router)
app.include_router(poll_question.router)
app.include_router(poll_response.router)
app.include_router(session_grade.router)
app.include_router(term_grade.router)
app.include_router(competition.router)
app.include_router(competition_registration.router)
app.include_router(competition_result.router)
app.include_router(student_assignment_upload.router)
app.include_router(assignment_feedback.router)
app.include_router(dashboard.router)









app.add_exception_handler(HTTPException, 
    http_exception_handler)
app.add_exception_handler(Exception, 
    general_exception_handler)
app.add_exception_handler(RequestValidationError, 
    validation_exception_handler)

@app.get("/")
def root():
    return {"message": "Server is running successfully"}
