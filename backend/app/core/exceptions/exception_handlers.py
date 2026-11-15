from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing import Any
import logging

from app.core.exceptions.custom_exceptions import AppException
from app.enums.response_codes import ResponseCode, RESPONSE_STATUS_CODES


logger = logging.getLogger(__name__)


def error_response(
    code: ResponseCode,
    message: str,
    data: Any = None,
    headers: dict | None = None,
):
    status_code = RESPONSE_STATUS_CODES[code]

    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder({
            "status": False,
            "code": code.value,
            "message": message,
            "data": data,
            "status_code": status_code,
        }),
        headers=headers,
    )



async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    return error_response(
        code=exc.code,
        message=exc.message,
        data=exc.data,
    )



async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    status_code = exc.status_code

    error_codes = {
        400: ResponseCode.BAD_REQUEST,
        401: ResponseCode.AUTHENTICATION_REQUIRED,
        403: ResponseCode.ACCESS_DENIED,
        404: ResponseCode.RESOURCE_NOT_FOUND,
        409: ResponseCode.RESOURCE_CONFLICT,
        413: ResponseCode.FILE_TOO_LARGE,
        415: ResponseCode.INVALID_FILE_TYPE,
        422: ResponseCode.VALIDATION_ERROR,
        429: ResponseCode.RATE_LIMIT_EXCEEDED,
        500: ResponseCode.INTERNAL_SERVER_ERROR,
    }

    code = error_codes.get(
        status_code,
        ResponseCode.INTERNAL_SERVER_ERROR
        if status_code >= 500
        else ResponseCode.BAD_REQUEST,
    )

    if status_code >= 500:
        message = "An internal server error has occurred."
        data = None

    elif isinstance(exc.detail, list) and exc.detail and all(isinstance(item, dict) for item in exc.detail):
        message = "The submitted information is not valid."
        data = [
            {
                "field": ".".join(
                    str(part) for part in item.get("loc", [])
                    if part != "body"
                ),
                "message": item.get("msg", ""),
                "type": item.get("type", ""),
            }
            for item in exc.detail
            if isinstance(item, dict)
        ]

    elif isinstance(exc.detail, (list, dict)):
        message = "The request is invalid."
        data = exc.detail

    else:
        message = (
            exc.detail
            if isinstance(exc.detail, str)
            else "The request is invalid."
        )
        data = None

    return error_response(
        code=code,
        message=message,
        data=data,
        headers=exc.headers,
    )



async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    errors = []

    for error in exc.errors():
        errors.append({
            "field": ".".join(
                str(part)
                for part in error.get("loc", [])
                if part != "body"
            ),
            "message": error.get("msg", ""),
            "type": error.get("type", ""),
        })

    return error_response(
        code=ResponseCode.VALIDATION_ERROR,
        message="The submitted information is not valid.",
        data=errors,
    )



async def unexpected_exception_handler(
    request: Request, 
    exc: Exception
):
    logger.error(
        "Unhandled exception: %s %s",
        request.method,
        request.url.path,
        exc_info=(type(exc), exc, exc.__traceback__),
    )

    return error_response(
        code=ResponseCode.INTERNAL_SERVER_ERROR,
        message="Internal server error.",
    )