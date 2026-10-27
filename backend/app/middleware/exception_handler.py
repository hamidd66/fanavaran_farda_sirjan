from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder



def serialize_validation_errors(errors):
    result = []

    for error in errors:
        error = error.copy()

        if "ctx" in error:
            error["ctx"] = {
                key: str(value) if isinstance(value, Exception) else value
                for key, value in error["ctx"].items()
            }

        if "input" in error:
            try:
                error["input"] = jsonable_encoder(error["input"])
            except (TypeError, ValueError):
                error["input"] = repr(error["input"])

        result.append(error)

    return result

def response_handler(status: bool, message: str = None, data: dict = None, status_code: int = None):
    return {
        "status": status,
        "message": message,
        "data": data,
        "status_code": status_code
    }


async def http_exception_handler(request: Request, exc: HTTPException):
    detail = exc.detail

    if isinstance(detail, list):
        detail = serialize_validation_errors(detail)

    return JSONResponse(
        status_code=exc.status_code,
        content=response_handler(
            status=False,
            message=detail if isinstance(detail, str) else "Request failed",
            data=detail if not isinstance(detail, str) else None,
            status_code=exc.status_code
        )
    )

async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=response_handler(
            status=False,
            message="Internal server error",
            data=None,
            status_code=500
        )
    )

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    errors = serialize_validation_errors(exc.errors())

    return JSONResponse(
        status_code=422,
        content=response_handler(
            status=False,
            message="Validation error",
            data=errors,
            status_code=422
        )
    )
