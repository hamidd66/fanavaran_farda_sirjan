import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCurrentUser } from "hooks/user";

function DefaultPanelRedirect() {
    const { data: user, isPending, isError } = useCurrentUser();

    useEffect(() => {
        if (!isPending && user && !firstRole) {
            toast.error("شما به هیچ پنلی دسترسی ندارید", { id: "no-access-to-panel" });
        }
    }, [isPending, user, firstRole]);
    
    if (isPending) return null

    const firstRole = user?.user_roles?.find(
        userRole => userRole.is_access && userRole.is_active
    );

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