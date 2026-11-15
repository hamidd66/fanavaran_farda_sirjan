import axios from "axios";
import { normalizeApiError, normalizeApiResponse } from "lib/api/apiResponse";

const axiosConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 15000,
    headers: {
        Accept: "application/json",
    },
};

const api = axios.create(axiosConfig);
const refreshApi = axios.create(axiosConfig);

let refreshPromise = null;
let isRedirecting = false;

const isExcludedFromRefresh = (url = "") => {
    const requestPath = url.split("?")[0].replace(/\/+$/, "");

    const excludedEndpoints = [
        "/user/login/national-code-password",
        "/user/refresh",
    ];

    return excludedEndpoints.some(endpoint =>
        requestPath.endsWith(endpoint)
    );
};

api.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.skipAuthRefresh ||
            isExcludedFromRefresh(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshApi
                    .post("/user/refresh")
                    .finally(() => refreshPromise = null);
            }
            await refreshPromise;
            return api(originalRequest);

        } catch (refreshError) {
            if ([401, 403].includes(refreshError.response?.status) && !isRedirecting) {
                isRedirecting = true;
                // window.location.replace("/login");
            }
            return Promise.reject(refreshError);
        }
    }
);

api.interceptors.response.use(

    response => {
        return normalizeApiResponse(response);
    },

    error => {
        return Promise.reject(normalizeApiError(error));
    }
);

export default api;

