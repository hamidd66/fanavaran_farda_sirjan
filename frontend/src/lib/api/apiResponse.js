class ApiError extends Error {
    constructor({
        code,
        message,
        statusCode = null,
        data = null,
    }) {
        super(message);

        this.name = "ApiError";
        this.code = code;
        this.statusCode = statusCode;
        this.data = data;
    }
}

function normalizeApiError(error) {
    if (error instanceof ApiError) {
        return error;
    }

    const response = error?.response;

    if (!response) {
        return new ApiError({
            code: "NETWORK_ERROR",
            message: "Network request failed.",
            statusCode: null,
        });
    }

    const body = response.data || {};

    return new ApiError({
        code: body.code || "UNKNOWN_ERROR",
        message: body.message || "Request failed.",
        statusCode: response.status,
        data: body.data ?? null,
    });
}

function normalizeApiResponse(response) {
    const body = response.data;

    if (
        !body ||
        typeof body !== "object" ||
        !("code" in body) ||
        !("data" in body)
    ) {
        return response;
    }

    return {
        // ...response,
        // data: {
            ...body,
            status: body.status ?? null,
            code: body.code ?? null,
            message: body.message ?? null,
            data: body.data ?? null,
            status_code: body.status_code ?? response.status,
        // },
    };
}

export { normalizeApiError, normalizeApiResponse }
