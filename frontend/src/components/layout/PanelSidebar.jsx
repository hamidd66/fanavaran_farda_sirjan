import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { BsBoxArrowRight, BsChevronDown, BsChevronUp, BsFillGearFill, BsFillPatchCheckFill, BsGrid1X2Fill, BsPerson } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import toast from "react-hot-toast";

import { setStorage } from "utils/storage";
import { accessibleItems } from "constants/ui";
import { roles } from "constants/enums";
import { logoutCurrent } from "services/user";
import "./panelSidebar.css"

function PanelSidebar({ user, refetch, sidebarOpen, setSidebarOpen }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const panelName = location.pathname.split("/")[2];
    const itemAccessible = accessibleItems.find(r => r.role == panelName);
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = groupName => {
        setOpenMenu(prev => prev === groupName ? null : groupName);
    };

    const openGroupList = itemAccessible?.groups.find(group => (
        group.items.some(item => item.path == location.pathname.split("/").at(-1))
    ))?.name

    useEffect(() => {
        setOpenMenu(openGroupList ?? null);
    }, [location.pathname, openGroupList]);

    useEffect(() => {
        setStorage("lastPanel", panelName);
    }, [location.pathname]);

    const handleMobileNavClick = () => {
        if (window.innerWidth < 992) {
            setSidebarOpen(false);
        }
    };

    const { mutate } = useMutation({
        mutationFn: logoutCurrent,
        onSuccess: () => {
            queryClient.setQueryData(['currentUser'], null);
            navigate("/");
            refetch();
        },
        onError: () => toast.error('خروج از حساب شما با مشکل مواجه شد', { id: 'logOutError' }),
        meta: { skipGlobalError: true },
    })

    return (
        <section className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
            <div className="admin-brand">
                <Link to="/" className="d-flex gap-2">
                    <div className="admin-brand-logo">
                        <img src="/images/logo.png" alt="لوگوی فناوران فردا" />
                    </div>
                    <div className="admin-brand-text">
                        <strong>فناوران <span>فردا</span></strong>
                        <small>پنل {roles[panelName]}</small>
                    </div>
                </Link>
                <button type="button" className="admin-close-sidebar" onClick={() => setSidebarOpen(false)}>
                    <FaXmark />
                </button>
            </div>

            <div className="admin-user-card">
                <img src={user.files[0]?.url} alt={user.person.first_name} className="admin-user-avatar" />
                <div>
                    <strong>{user.person.first_name + " " + user.person.last_name}</strong>
                </div>

                <BsFillPatchCheckFill />
            </div>

            {user.roles.length > 1 && (
                <nav className="admin-nav pb-0 nav-role">
                    <p className="admin-nav-label">نقش ها</p>
                    <div className="admin-nav-dropdown-group">
                        <div className="admin-submenu">
                            {user.roles.map(role => (
                                <Link
                                    key={role.name}
                                    to={`/panel/${role.name}/dashboard`}
                                    className={`admin-nav-item ${panelName == role.name ? "active" : ""}`}
                                    onClick={handleMobileNavClick}
                                    style={{ fontSize: "13px", padding: "8px 12px" }}
                                >
                                    <span>{role.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>
            )}

            <nav className="admin-nav">
                <p className="admin-nav-label">دسترسی ها</p>

                <NavLink
                    to={`/panel/${panelName}/dashboard`} end
                    className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
                    onClick={handleMobileNavClick}
                >
                    <BsGrid1X2Fill />
                    <span>داشبورد</span>
                </NavLink>

                {itemAccessible?.groups.map((item, index) => (
                    <div key={index} className="admin-nav-dropdown-group" style={{ margin: "2px 0" }}>
                        <button
                            type="button"
                            onClick={() => toggleMenu(item.name)}
                            className={`admin-nav-item justify-content-between w-100 ${openMenu === item.name ? "active" : ""}`}
                            style={{ background: openMenu === item.name ? "rgba(13, 110, 253, 0.08)" : "transparent" }}
                        >
                            <div className="d-flex align-items-center gap-3">
                                {<item.icon />}
                                <span>{item.title}</span>
                            </div>
                            {openMenu === item.name ? <BsChevronUp fontSize="12px" /> : <BsChevronDown fontSize="12px" />}
                        </button>

                        {openMenu === item.name && (
                            <div className="admin-submenu">
                                {item.items.map(sub => (
                                    <NavLink
                                        key={sub.path}
                                        to={`/panel/${panelName}/${sub.path}`}
                                        className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
                                        onClick={handleMobileNavClick}
                                        style={{ fontSize: "13px", padding: "8px 12px" }}
                                    >
                                        {<sub.icon fontSize="14px" />}
                                        <span>{sub.label}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <p className="admin-nav-label admin-nav-label-bottom">سیستم</p>

                <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`} onClick={handleMobileNavClick}>
                    <BsFillGearFill />
                    <span>تنظیمات</span>
                </NavLink>
                <button type="button" className="admin-nav-item admin-logout" onClick={mutate}>
                    <BsBoxArrowRight />
                    <span>خروج از حساب</span>
                </button>
            </nav>

            <div className="admin-sidebar-footer">
                <span>فناوران فردا</span>
                <small>نسخه 1.0.0</small>
            </div>
        </section>
    )
}

export default PanelSidebar