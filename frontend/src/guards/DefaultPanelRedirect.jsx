import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useGetUser } from "hooks/user";
import { getStorage, setStorage } from "utils/storage";
import { getActiveRole, getDefaultPanel } from "utils/user";

function DefaultPanelRedirect() {
    const { user, isPending, isError } = useGetUser();

    const firstRole = user ? getDefaultPanel(user) : null;
    const prevPanel = getStorage("lastPanel", firstRole);

    const prevPanelInfo = user && prevPanel ? getActiveRole(user, prevPanel) : null;
    const isPrevPanelValid =
        prevPanelInfo?.isPossibility &&
        prevPanelInfo?.isExist &&
        prevPanelInfo?.isAccess &&
        prevPanelInfo?.isActive;

    const panelName = isPrevPanelValid ? prevPanel : firstRole;

    useEffect(() => {
        if (user && !firstRole)
            toast.error("شما به هیچ پنلی دسترسی ندارید", { id: "no-access-to-panel" });
    }, [user, firstRole]);

    useEffect(() => {
        if (user && panelName && prevPanel != panelName) 
            setStorage("lastPanel", panelName);
    }, [user, panelName]);


    if (isPending) return null

    if (isError || !user) return <Navigate to="/login" replace />;

    if (!firstRole) return <Navigate to="/" replace />;

    return <Navigate to={`/panel/${panelName}/dashboard`} replace />
};

export default DefaultPanelRedirect;