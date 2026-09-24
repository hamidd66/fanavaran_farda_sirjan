import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";
import StudentSidebar from "./StudentSidebar";
import "../styles/student-layout.css";

const StudentLayout = () => {
  // در ابعاد دسکتاپ به طور پیش‌فرض باز، در موبایل بسته
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="student-layout-container" dir="rtl">
      {/* سایدبار هنرجو */}
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* بخش اصلی که با باز و بسته شدن سایدبار در دسکتاپ جابجا می‌شود */}
      <div className={`student-main-wrapper ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        {/* هدر بالای پنل */}
        <header className="student-top-header">
          <div className="header-right-tools">
            <button
              type="button"
              className="std-hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="تغییر وضعیت منو"
              aria-label="تغییر منو"
            >
              <FiMenu />
            </button>
            <span className="header-institute-title">
              آموزشگاه فناوری و برنامه‌نویسی فناوران فردا
            </span>
          </div>

          <div className="header-left-tools">
            <button type="button" className="std-header-icon-btn" title="اعلان‌ها و رویدادها">
              <FiBell />
              <span className="std-notif-dot"></span>
            </button>

            <div className="std-profile-pill">
              <div className="std-avatar-circle">
                <FiUser />
              </div>
              <div className="std-pill-text">
                <span className="std-user-fullname">علیرضا محمدی</span>
              </div>
            </div>
          </div>
        </header>

        {/* محل رندر صفحات داخلی هنرجو */}
        <main className="student-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
