from app.enums.response_codes import ResponseCode, RESPONSE_STATUS_CODES


class AppException(Exception):
    def __init__(
        self,
        code: ResponseCode,
        message: str | None = None,
        data: dict | list | None = None,
        status_code: int | None = None,
    ):
        self.code = code

        self.status_code = (
            status_code
            if status_code is not None
            else RESPONSE_STATUS_CODES[code]
        )

        self.message = message or code.value
        self.data = data

        super().__init__(self.message)
