import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiBell, FiUser } from "react-icons/fi";
import TeacherSidebar from "./TeacherSidebar";
import "../styles/teacher-layout.css";

const TeacherLayout = () => {
  // در دسکتاپ به صورت پیش‌فرض باز، در صفحات کوچک‌تر بسته
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // ریسپانسیو بودن هوشمند با تغییر سایز مرورگر
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
    <div className="teacher-layout-container" dir="rtl">
      {/* سایدبار تیره */}
      <TeacherSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* بخش اصلی محتوا که با باز/بسته شدن سایدبار در دسکتاپ هل داده می‌شود */}
      <div className={`teacher-main-wrapper ${!sidebarOpen ? "sidebar-collapsed" : ""}`}>
        {/* هدر بالای صفحه */}
        <header className="teacher-top-header py-5">
          <div className="header-right-section">
            <button
              type="button"
              className="hamburger-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="تغییر وضعیت منو"
              aria-label="تغییر منو"
            >
              <FiMenu />
            </button>
            <span className="institute-name">
              آموزشگاه فناوری و برنامه‌نویسی فناوران فردا
            </span>
          </div>

          <div className="header-left-section">
            <button type="button" className="header-action-btn" title="اعلان‌ها">
              <FiBell />
              <span className="notif-badge"></span>
            </button>

            <div className="teacher-profile-chip">
              <div className="teacher-avatar">
                <FiUser />
              </div>
              <div className="teacher-info">
                <span className="teacher-name">حمید پورفریدونی</span>
              </div>
            </div>
          </div>
        </header>

        {/* خروجی صفحات داخلی */}
        <main className="teacher-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
