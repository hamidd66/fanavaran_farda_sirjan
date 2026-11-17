import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "context/UserProvider";
import { getCurrentUser } from "services/user";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used inside <UserProvider>');
    return context;
};
