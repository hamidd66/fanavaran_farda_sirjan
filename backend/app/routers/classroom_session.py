from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import not_, select, func, and_, exists, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload
from datetime import date
from typing import Optional
import math

from app.db.session import get_db
from app.enums.user import UserRole
from app.models.enrollment import Enrollment
from app.models.user import User
from app.services.jwt_bearer import get_payload
from app.middleware.exception_handler import response_handler
from app.repositories.user_repo import get_user_data

from app.models.classroom import Classroom
from app.models.student import Student


router = APIRouter(prefix="/classroom_sessions", tags=["Classroom sessions"])


