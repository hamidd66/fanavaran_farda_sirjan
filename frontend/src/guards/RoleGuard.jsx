import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

import { getActiveRole } from "utils/user";
import { useGetUser } from "hooks/user";

function RoleGuard({ role }) {
    const { user, isPending, isError } = useGetUser();
    const { roleTitle, isPossibility, isExist, isAccess, isActive } = getActiveRole(user, role);

    useEffect(() => {
        if (isPending || isError || isPossibility || !user) {
            return;
        }
        if (!isExist)
            toast.error(`شما این نقش را ندارید`, { id: "no-access-to-panel" })
        else if (!isAccess)
            toast.error(`شما به نقش ${roleTitle} دسترسی ندارید`, { id: "no-access-to-role" })
        else if (!isActive)
            toast.error(`نقش ${roleTitle} غیر فعال شده است`, { id: "no-access-to-role" })

    }, [isPending, isPossibility, user]);

    if (isPending || isError) return null
    if (!isPossibility) return <Navigate to="/panel" replace />
    return <Outlet />
}

export default RoleGuard