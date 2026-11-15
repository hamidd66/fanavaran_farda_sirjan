from typing import Any
from app.enums.response_codes import ResponseCode, RESPONSE_STATUS_CODES


def success_response(
    code: ResponseCode,
    message: str | None = None,
    data: Any = None,
):
    status_code = RESPONSE_STATUS_CODES[code]
    
    return {
        "status": True,
        "code": code.value,
        "message": message,
        "data": data,
        "status_code": status_code,
    }
