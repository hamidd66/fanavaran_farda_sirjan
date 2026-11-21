import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

import { getActiveRole } from "utils/user";
import { useGetUser } from "hooks/user";
import { roles } from "constants/enums";

function RoleGuard({ role }) {
    const { user, isPending, isError } = useGetUser();
    const { roleTitle, isPossibility, isExist, isAccess, isActive } = getActiveRole(user, role);

    useEffect(() => {
        if (isPending || isError || isPossibility || !user) {
            return;
        }
        if (!isExist) {
            const errorMessage = roles[role] ? `شما نقش ${roles[role]} را ندارید` : "شما این نقش را ندارید"
            toast.error(errorMessage, { id: "no-access-to-panel" })
        }
        else if (!isAccess)
            toast.error(`شما به نقش ${roleTitle} دسترسی ندارید`, { id: "no-access-to-role" })
        else if (!isActive)
            toast.error(`نقش ${roleTitle} غیر فعال شده است`, { id: "no-access-to-role" })

    }, [isPending, isPossibility, user]);

    if (isPending || isError) return null
    if (!isPossibility || !isExist) return <Navigate to="/panel" replace />
    return <Outlet />
}

export default RoleGuard