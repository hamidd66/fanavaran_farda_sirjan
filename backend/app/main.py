from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles

# from .db.database import engine
# from .db.base import Base
from .middleware.exception_handler import http_exception_handler, general_exception_handler, validation_exception_handler
from .middleware.cors import setup_cors
from .config import logging_config
from .utils.file_upload import cleanup_temp_files

from app.routers import (
    user,
    role,
    user_role,
    specialty,
    user_specialty,
    course_category, 
    course, 
    course_question,
    term,
    term_session, 
    session_content,
)

# Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fanavaran farda")

setup_cors(app)

app.include_router(user.router)
app.include_router(role.router)
app.include_router(user_role.router)
app.include_router(specialty.router)
app.include_router(user_specialty.router)
app.include_router(course_category.router) 
app.include_router(course.router)
app.include_router(course_question.router)
app.include_router(term.router)
app.include_router(term_session.router)
app.include_router(session_content.router)


@app.on_event("startup")
async def startup_event(): 
    cleanup_temp_files()

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.mount("/media", StaticFiles(directory="media"), name="media")

@app.get("/")
def root():
    return {"message": "Server is running successfully"}
