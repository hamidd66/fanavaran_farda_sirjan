import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiClock,
  FiAward,
  FiCheckSquare,
  FiCreditCard,
  FiMessageSquare,
  FiSmile,
  FiFileText,
  FiLogOut,
  FiX,
  FiCheckCircle,FiCalendar
} from "react-icons/fi";
import "../styles/StudentSidebar.css";

const StudentSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { label: "داشبورد اصلی", path: "/student/dashboard", icon: FiGrid },
    { label: "آموزش و دوره ها", path: "/student/courses", icon: FiBookOpen },
    { label: "آزمون‌های فعال", path: "/student/quizzes", icon: FiClock },
    { label: "حضور و غیاب و ارزیابی", path: "/student/attendance", icon: FiCheckSquare },
    { label: "مالی و پرداخت‌ها", path: "/student/finance", icon: FiCreditCard },
    { label: "نظرسنجی و ارزیابی کیفیت", path: "/student/surveys", icon: FiSmile },
    { label: "مسابقات و لیگ برنامه‌نویسی", path: "/student/challenges", icon: FiAward },
    { label: "تقویم آموزشگاه", path: "/student/calendar", icon: FiCalendar },

    { label: "پیام‌رسان و پشتیبانی", path: "/student/messages", icon: FiMessageSquare },
    { label: "گواهینامه‌ها و رزومه‌ساز", path: "/student/certificates", icon: FiFileText },
  ];

  const isActive = (path) => location.pathname === path;

  const handleMobileClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* در موبایل فقط پس‌زمینه شفاف جهت بستن کلیک، بدون هیچ بلوری */}
      {isOpen && (
        <div
          className="std-mobile-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`std-main-sidebar ${isOpen ? "is-open" : "is-closed"}`}>
        <div className="std-sidebar-inner">
          {/* لوگو و عنوان آموزشگاه */}
          <div className="std-sidebar-brand">
            <div className="std-brand-logo">
              <img
                src="/image/logo.png"
                alt="فناوران فردا"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              <span className="std-brand-fallback">FF</span>
            </div>
            <div className="std-brand-info">
              <h2 className="std-brand-title">
                فناوران <span>فردا</span>
              </h2>
              <span className="std-brand-tag">پنل هنرجویان آکادمی</span>
            </div>
            <button
              type="button"
              className="std-sidebar-close-btn"
              onClick={onClose}
              aria-label="بستن منو"
            >
              <FiX />
            </button>
          </div>

        

          <div className="std-nav-category-title">میز کار هنرجو</div>

          {/* آیتم‌های ناوبری اصلی */}
          <nav className="std-nav-menu">
            <ul className="std-nav-list">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path} className="std-nav-item">
                    <Link
                      to={item.path}
                      className={`std-nav-link ${active ? "active" : ""}`}
                      onClick={handleMobileClick}
                    >
                      <div className="std-nav-link-content">
                        <IconComponent className="std-nav-item-icon" />
                        <span className="std-nav-item-text">{item.label}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* فوتر سایدبار */}
          <div className="std-sidebar-footer">
            <span>آموزشگاه فناوران فردا</span>
            <span className="std-ver">v2.1</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
