import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./style/AdminLayout.css";

// زیرمنوی ۱: کاربران و اعضا
const userSubItems = [
  { label: "کاربران سیستم", icon: "bi-person-gear", path: "/admin/users" },
  { label: "هنرجویان", icon: "bi-mortarboard-fill", path: "/admin/students" },
  { label: "مدرسین", icon: "bi-person-workspace", path: "/admin/teachers" },
];

// زیرمنوی ۲: دوره‌ها، کلاس‌ها و ثبت‌نام
const coursesClassesSubItems = [
  { label: "دوره‌ها", icon: "bi-journal-code", path: "/admin/courses" },
  { label: "کلاس‌ها و تقویم", icon: "bi-calendar-week-fill", path: "/admin/classes" },
  { label: "ثبت‌نام‌ها", icon: "bi-clipboard-check-fill", path: "/admin/enrollments" },
];

// زیرمنوی ۳: مدیریت آموزشی (نمرات و حضور و غیاب)
const eduAcademicSubItems = [
  { label: "نمرات و کارنامه", icon: "bi-award-fill", path: "/admin/grades" },
  { label: "حضور و غیاب", icon: "bi-person-check-fill", path: "/admin/attendance" },
  { label: "تحلیل غیبت و نمرات", icon: "bi-person-check-fill", path: "/admin/academicanalytics" },
];

// سایر آیتم‌های اصلی سایدبار
const otherNavItems = [
  {
    label: "امور مالی",
    icon: "bi-wallet2",
    path: "/admin/finance",
  },
  {
    label: "نظرسنجی‌ها",
    icon: "bi-bar-chart-fill",
    path: "/admin/feedbackmanagement",
  },
  {
    label: "مسابقات",
    icon: "bi-window-stack",
    path: "/admin/competitionmanagement",
  },
   {
    label: "پیام رسان",
    icon: "bi-window-stack",
    path: "/admin/messages",
  },
  {
    label: "گزارش‌ها",
    icon: "bi-graph-up-arrow",
    path: "/admin/reports",
  },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // بررسی فعال بودن مسیرهای زیرمنوی کاربران
  const isUsersRouteActive = userSubItems.some((item) =>
    location.pathname.startsWith(item.path)
  );

  // بررسی فعال بودن مسیرهای دوره‌ها و کلاس‌ها
  const isCoursesClassesRouteActive = coursesClassesSubItems.some((item) =>
    location.pathname.startsWith(item.path)
  );

  // بررسی فعال بودن مسیرهای مدیریت آموزشی (نمرات و حضور و غیاب)
  const isEduAcademicRouteActive = eduAcademicSubItems.some((item) =>
    location.pathname.startsWith(item.path)
  );

  // وضعیت باز/بسته بودن آکاردئون‌ها
  const [usersMenuOpen, setUsersMenuOpen] = useState(isUsersRouteActive);
  const [coursesClassesMenuOpen, setCoursesClassesMenuOpen] = useState(isCoursesClassesRouteActive);
  const [eduAcademicMenuOpen, setEduAcademicMenuOpen] = useState(isEduAcademicRouteActive);

  // همگام‌سازی وضعیت باز بودن هنگام جابه‌جایی بین صفحات
  useEffect(() => {
    if (isUsersRouteActive) setUsersMenuOpen(true);
  }, [location.pathname, isUsersRouteActive]);

  useEffect(() => {
    if (isCoursesClassesRouteActive) setCoursesClassesMenuOpen(true);
  }, [location.pathname, isCoursesClassesRouteActive]);

  useEffect(() => {
    if (isEduAcademicRouteActive) setEduAcademicMenuOpen(true);
  }, [location.pathname, isEduAcademicRouteActive]);

  const handleMobileNavClick = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-panel" dir="rtl">
      {/* پس‌زمینه تیره موبایل */}
      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          type="button"
          aria-label="بستن منو"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-logo">
            <img src="/image/logo.png" alt="لوگوی فناوران فردا" />
          </div>

          <div className="admin-brand-text">
            <strong>
              فناوران <span>فردا</span>
            </strong>
            <small>پنل مدیریت آموزشگاه</small>
          </div>

          <button
            type="button"
            className="admin-close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="بستن منو"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="admin-user-card">
          <img
            src="/image/student1.jpg"
            alt="مدیر آموزشگاه"
            className="admin-user-avatar"
          />

          <div>
            <strong>حمید پورفریدونی</strong>
            <span>مدیر آموزشگاه</span>
          </div>

          <i className="bi bi-patch-check-fill"></i>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">مدیریت آموزشگاه</p>

          {/* داشبورد */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={handleMobileNavClick}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>داشبورد</span>
          </NavLink>

          {/* ۱. آکاردئون مدیریت کاربران و اعضا */}
          <div className="admin-nav-dropdown-group" style={{ margin: "2px 0" }}>
            <button
              type="button"
              className={`admin-nav-item w-100 ${
                isUsersRouteActive ? "active" : ""
              }`}
              onClick={() => setUsersMenuOpen((prev) => !prev)}
              style={{
                background: isUsersRouteActive
                  ? "rgba(13, 110, 253, 0.08)"
                  : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                textAlign: "right",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="bi bi-people-fill"></i>
                <span>مدیریت کاربران و اعضا</span>
              </div>
              <i
                className={`bi bi-chevron-${usersMenuOpen ? "up" : "down"}`}
                style={{
                  fontSize: "12px",
                  transition: "transform 0.2s ease",
                  opacity: 0.7,
                }}
              ></i>
            </button>

            {usersMenuOpen && (
              <div
                className="admin-submenu"
                style={{
                  paddingRight: "20px",
                  marginTop: "4px",
                  marginBottom: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  borderRight: "2px solid #e2e8f0",
                  marginRight: "14px",
                }}
              >
                {userSubItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? "active" : ""}`
                    }
                    onClick={handleMobileNavClick}
                    style={{
                      fontSize: "13px",
                      padding: "8px 12px",
                    }}
                  >
                    <i className={`bi ${sub.icon}`} style={{ fontSize: "14px" }}></i>
                    <span>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ۲. آکاردئون مدیریت دوره‌ها و کلاس‌ها */}
          <div className="admin-nav-dropdown-group" style={{ margin: "2px 0" }}>
            <button
              type="button"
              className={`admin-nav-item w-100 ${
                isCoursesClassesRouteActive ? "active" : ""
              }`}
              onClick={() => setCoursesClassesMenuOpen((prev) => !prev)}
              style={{
                background: isCoursesClassesRouteActive
                  ? "rgba(13, 110, 253, 0.08)"
                  : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                textAlign: "right",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <i className="bi bi-journal-code"></i>
                <span>دوره‌ها و کلاس‌ها</span>
              </div>
              <i
                className={`bi bi-chevron-${coursesClassesMenuOpen ? "up" : "down"}`}
                style={{
                  fontSize: "12px",
                  transition: "transform 0.2s ease",
                  opacity: 0.7,
                }}
              ></i>
            </button>

            {coursesClassesMenuOpen && (
              <div
                className="admin-submenu"
                style={{
                  paddingRight: "20px",
                  marginTop: "4px",
                  marginBottom: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  borderRight: "2px solid #e2e8f0",
                  marginRight: "14px",
                }}
              >
                {coursesClassesSubItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? "active" : ""}`
                    }
                    onClick={handleMobileNavClick}
                    style={{
                      fontSize: "13px",
                      padding: "8px 12px",
                    }}
                  >
                    <i className={`bi ${sub.icon}`} style={{ fontSize: "14px" }}></i>
                    <span>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ۳. آکاردئون مدیریت آموزشی (نمرات و حضور و غیاب) */}
          <div className="admin-nav-dropdown-group" style={{ margin: "2px 0" }}>
            <button
              type="button"
              className={`admin-nav-item w-100 ${
                isEduAcademicRouteActive ? "active" : ""
              }`}
              onClick={() => setEduAcademicMenuOpen((prev) => !prev)}
              style={{
                background: isEduAcademicRouteActive
                  ? "rgba(13, 110, 253, 0.08)"
                  : "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "10px 14px",
                textAlign: "right",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px",fontSize: "15px" }}>
                <i className="bi bi-mortarboard"></i>
                <span>مدیریت آموزشی</span>
              </div>
              <i
                className={`bi bi-chevron-${eduAcademicMenuOpen ? "up" : "down"}`}
                style={{
                  fontSize: "12px",
                  transition: "transform 0.2s ease",
                  opacity: 0.7,
                }}
              ></i>
            </button>

            {eduAcademicMenuOpen && (
              <div
                className="admin-submenu"
                style={{
                  paddingRight: "20px",
                  marginTop: "4px",
                  marginBottom: "4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  borderRight: "2px solid #e2e8f0",
                  marginRight: "14px",
                }}
              >
                {eduAcademicSubItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? "active" : ""}`
                    }
                    onClick={handleMobileNavClick}
                    style={{
                      fontSize: "13px",
                      padding: "8px 12px",
                    }}
                  >
                    <i className={`bi ${sub.icon}`} style={{ fontSize: "14px" }}></i>
                    <span>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* سایر آیتم‌های اصلی سایدبار */}
          {otherNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
              onClick={handleMobileNavClick}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>

              {item.badge && <b className="admin-nav-badge">{item.badge}</b>}
            </NavLink>

          ))}

          <p className="admin-nav-label admin-nav-label-bottom">سیستم</p>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
            onClick={handleMobileNavClick}
          >
            <i className="bi bi-gear-fill"></i>
            <span>تنظیمات</span>
          </NavLink>

          <button type="button" className="admin-nav-item admin-logout">
            <i className="bi bi-box-arrow-right"></i>
            <span>خروج از حساب</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <span>فناوران فردا</span>
          <small>نسخه 1.0.0</small>
        </div>
      </aside>

      {/* محتوای اصلی */}
      <main className={`admin-main ${sidebarOpen ? "sidebar-is-open" : ""}`}>
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-right">
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="باز و بسته کردن منو"
            >
              <i className="bi bi-list"></i>
            </button>

            {/* <div className="admin-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="جستجو در هنرجویان، دوره‌ها و..."
              />
              <kbd>Ctrl K</kbd>
            </div> */}
          </div>

          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-icon-button"
              aria-label="حالت شب"
            >
              <i className="bi bi-moon-stars"></i>
            </button>

            <button
              type="button"
              className="admin-icon-button admin-notification"
              aria-label="اعلان‌ها"
            >
              <i className="bi bi-bell"></i>
              <span></span>
            </button>

            <div className="admin-profile-mini">
              <img src="/image/student1.jpg" alt="حمید پورفریدونی" />
              <div>
                <strong>حمید پورفریدونی</strong>
                <span>مدیر کل</span>
              </div>
              <i className="bi bi-chevron-down"></i>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
