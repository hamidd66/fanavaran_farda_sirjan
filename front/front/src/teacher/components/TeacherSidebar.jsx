import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiGrid,
  FiBookOpen,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiCreditCard,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiLogOut,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import "../styles/TeacherSidebar.css";

const TeacherSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({
    courses: false,
    students: false,
    assignments: false,
    analytics: false,
    finance: false,
    communications: false,
  });

  // باز شدن خودکار زیرمنو متناسب با آدرس صفحه فعال
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/teacher/courses") || path.includes("/teacher/resume")) {
      setOpenMenus((p) => ({ ...p, courses: true }));
    } else if (
      path.includes("/teacher/students") ||
      path.includes("/teacher/attendance") ||
      path.includes("/teacher/grades")
    ) {
      setOpenMenus((p) => ({ ...p, students: true }));
    } else if (path.includes("/teacher/assignments") || path.includes("/teacher/quizzes")) {
      setOpenMenus((p) => ({ ...p, assignments: true }));
    } else if (path.includes("/teacher/salary") || path.includes("/teacher/settlements")) {
      setOpenMenus((p) => ({ ...p, finance: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  const handleMobileNavClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* در موبایل، اگر سایدبار باز بود پس‌زمینه تیره شود؛ در دسکتاپ با CSS کاملاً پنهان است */}
      {isOpen && (
        <div
          className="dark-sidebar-mobile-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`dark-main-sidebar ${isOpen ? "is-open" : "is-closed"}`}>
        <div className="dark-sidebar-inner">
          {/* هدر برندینگ */}
          <div className="dark-sidebar-brand">
            <div className="brand-logo-wrap">
              <img
                src="/image/logo.png"
                alt="فناوران فردا"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              <span className="brand-fallback-icon">FF</span>
            </div>
            <div className="brand-title-wrap">
              <h2 className="brand-name">
                فناوران <span>فردا</span>
              </h2>
              <span className="brand-desc">پنل اساتید محترم</span>
            </div>
            <button
              type="button"
              className="dark-sidebar-close-btn"
              onClick={onClose}
              aria-label="بستن منو"
            >
              <FiX />
            </button>
          </div>

         

          <div className="dark-nav-section-label">میز کار اساتید</div>

          {/* لیست ناوبری */}
          <nav className="dark-nav-container">
            <ul className="dark-nav-list">
              <li className="dark-nav-item">
                <Link
                  to="/teacher/dashboard"
                  className={`dark-link-btn ${isActive("/teacher/dashboard") ? "active" : ""}`}
                  onClick={handleMobileNavClick}
                >
                  <div className="dark-link-content">
                    <FiGrid className="dark-nav-icon" />
                    <span className="dark-nav-text">داشبورد</span>
                  </div>
                </Link>
              </li>

              {/* مدیریت کاربران */}
              <li className="dark-nav-item">
                <button
                  type="button"
                  className={`dark-link-btn has-dropdown ${openMenus.students ? "open" : ""}`}
                  onClick={() => toggleMenu("students")}
                >
                  <div className="dark-link-content">
                    <FiUsers className="dark-nav-icon" />
                    <span className="dark-nav-text">مدیریت کاربران و اعضا</span>
                  </div>
                  <span className="dark-chevron-icon">
                    {openMenus.students ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                {openMenus.students && (
                  <ul className="dark-subnav-list">
                    <li>
                      <Link
                        to="/teacher/students"
                        className={`dark-sublink ${isActive("/teacher/students") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        لیست هنرجویان
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/attendance"
                        className={`dark-sublink ${isActive("/teacher/attendance") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        حضور و غیاب جلسات
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/grades"
                        className={`dark-sublink ${isActive("/teacher/grades") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        ثبت نمرات و کارنامه
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* دوره‌ها و کلاس‌ها */}
              <li className="dark-nav-item">
                <button
                  type="button"
                  className={`dark-link-btn has-dropdown ${openMenus.courses ? "open" : ""}`}
                  onClick={() => toggleMenu("courses")}
                >
                  <div className="dark-link-content">
                    <FiBookOpen className="dark-nav-icon" />
                    <span className="dark-nav-text">دوره‌ها و کلاس‌ها</span>
                  </div>
                  <span className="dark-chevron-icon">
                    {openMenus.courses ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                {openMenus.courses && (
                  <ul className="dark-subnav-list">
                    <li>
                      <Link
                        to="/teacher/courses"
                        className={`dark-sublink ${isActive("/teacher/courses") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        دوره‌ها و کلاس‌های من
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/resume"
                        className={`dark-sublink ${isActive("/teacher/resume") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        پرونده و سوابق استاد
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* امور آموزشی و تکالیف */}
              <li className="dark-nav-item">
                <button
                  type="button"
                  className={`dark-link-btn has-dropdown ${openMenus.assignments ? "open" : ""}`}
                  onClick={() => toggleMenu("assignments")}
                >
                  <div className="dark-link-content">
                    <FiCheckSquare className="dark-nav-icon" />
                    <span className="dark-nav-text">مدیریت آموزشی</span>
                  </div>
                  <span className="dark-chevron-icon">
                    {openMenus.assignments ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                {openMenus.assignments && (
                  <ul className="dark-subnav-list">
                    <li>
                      <Link
                        to="/teacher/assignments"
                        className={`dark-sublink ${isActive("/teacher/assignments") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        بارگذاری تکالیف و پروژه
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/quizzes"
                        className={`dark-sublink ${isActive("/teacher/quizzes") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        آزمون‌ساز و کوئیزها
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* امور مالی */}
              <li className="dark-nav-item">
                <button
                  type="button"
                  className={`dark-link-btn has-dropdown ${openMenus.finance ? "open" : ""}`}
                  onClick={() => toggleMenu("finance")}
                >
                  <div className="dark-link-content">
                    <FiCreditCard className="dark-nav-icon" />
                    <span className="dark-nav-text">امور مالی</span>
                  </div>
                  <span className="dark-chevron-icon">
                    {openMenus.finance ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                {openMenus.finance && (
                  <ul className="dark-subnav-list">
                    <li>
                      <Link
                        to="/teacher/salary"
                        className={`dark-sublink ${isActive("/teacher/salary") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        حقوق و دستمزد جلسات
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/projects"
                        className={`dark-sublink ${isActive("/teacher/projects") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        پروژه‌های صنعتی
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/teacher/settlements"
                        className={`dark-sublink ${isActive("/teacher/settlements") ? "active" : ""}`}
                        onClick={handleMobileNavClick}
                      >
                        تسویه‌حساب و واریزی‌ها
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* نظرسنجی‌ها */}
              <li className="dark-nav-item">
                <Link
                  to="/teacher/surveys"
                  className={`dark-link-btn ${isActive("/teacher/surveys") ? "active" : ""}`}
                  onClick={handleMobileNavClick}
                >
                  <div className="dark-link-content">
                    <FiBarChart2 className="dark-nav-icon" />
                    <span className="dark-nav-text">نظرسنجی‌ها</span>
                  </div>
                </Link>
              </li>

              {/* تقویم کلاسها */}
              <li className="dark-nav-item">
                <Link
                  to="/teacher/calendar"
                  className={`dark-link-btn ${isActive("/teacher/calendar") ? "active" : ""}`}
                  onClick={handleMobileNavClick}
                >
                  <div className="dark-link-content">
                    <FiBarChart2 className="dark-nav-icon" />
                    <span className="dark-nav-text">تقویم کلاسها</span>
                  </div>
                </Link>
              </li>



              {/* پیام‌ها */}
              <li className="dark-nav-item">
                <Link
                  to="/teacher/messages"
                  className={`dark-link-btn ${isActive("/teacher/messages") ? "active" : ""}`}
                  onClick={handleMobileNavClick}
                >
                  <div className="dark-link-content">
                    <FiMessageSquare className="dark-nav-icon" />
                    <span className="dark-nav-text">پیام‌رسان و گفتگو</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>

          {/* فوتر سایدبار */}
          <div className="dark-sidebar-footer">
            <span className="footer-title">فناوران فردا</span>
            <span className="footer-version">نسخه 1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TeacherSidebar;
