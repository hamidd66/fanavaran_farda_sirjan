import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { getErrorMessage, getSuccessMessage } from "constants/responseMessages";
import toast from "react-hot-toast";

const silentErrorCodes = new Set([
    // "AUTHENTICATION_REQUIRED",
    // "TOKEN_EXPIRED",
]);
const silentSuccessCodes = new Set([
    // "RETRIEVED",
    // "TOKEN_REFRESHED",
]);

function handleGlobalError(code) {
    if (silentErrorCodes.has(code)) return;
    const message = getErrorMessage(code);
    toast.error(message, { id: "global-error" });
}
function handleGlobalSuccess(code) {
    if (silentSuccessCodes.has(code)) return;
    const message = getSuccessMessage(code);
    toast.success(message, { id: "global-response" });
}

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.meta?.skipGlobalError) return;
            handleGlobalError(error.code);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, variables, context, mutation) => {
            if (mutation.meta?.skipGlobalError) return;
            handleGlobalError(error.code);
        },
        onSuccess: (data, variables, context, mutation) => {
            if (mutation.meta?.skipGlobalSuccess) return;
            handleGlobalSuccess(data?.code);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            // retry: 1,
            retry: (failureCount, error) => {
                const status = error.statusCode;

                if ([401, 403].includes(status)) {
                    return false;
                }

                return failureCount < 1;
            },
            refetchOnWindowFocus: false,
            // refetchOnMount: true,
            select: response =>  response.data,
        },
        mutations: {
            retry: false,
        },
    },
});

export default queryClient;
