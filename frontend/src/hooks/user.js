import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "services/user";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
    });
};
