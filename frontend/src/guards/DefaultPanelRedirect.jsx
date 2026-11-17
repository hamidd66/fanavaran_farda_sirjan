import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetUser } from "hooks/user";

function DefaultPanelRedirect() {
    const { user, isPending, isError } = useGetUser();

    const firstRole = user?.user_roles?.find(
        userRole => userRole.is_access && userRole.is_active
    );

    useEffect(() => {
        if (!isPending && user && !firstRole) {
            toast.error("شما به هیچ پنلی دسترسی ندارید", { id: "no-access-to-panel" });
        }
    }, [isPending, user, firstRole]);

    if (isPending) return null

    if (isError || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!firstRole) {
        return <Navigate to="/" replace />;
    }

    return (
        <Navigate to={`/panel/${firstRole.name}/dashboard`} replace />
    )
};

export default DefaultPanelRedirect;