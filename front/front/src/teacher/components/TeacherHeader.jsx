import React from 'react';
import { FiMenu, FiBell, FiSearch, FiCalendar, FiUser } from 'react-icons/fi';

export default function TeacherHeader({ onToggleSidebar }) {
  return (
    <header className="teacher-header">
      <div className="header-right-side">
        <button type="button" className="sidebar-toggle-trigger" onClick={onToggleSidebar}>
          <FiMenu size={22} />
        </button>

        <div className="teacher-search-box">
          <FiSearch className="search-icon" size={17} />
          <input
            type="text"
            placeholder="جستجوی دانشجو، کلاس یا مبحث..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-left-side">
        {/* نشانگر ترم جاری */}
        <div className="term-indicator-pill">
          <FiCalendar size={15} />
          <span>ترم پاییز ۱۴۰۳</span>
        </div>

        {/* دکمه اعلانات */}
        <button type="button" className="header-notification-btn" title="اعلانات">
          <FiBell size={19} />
          <span className="notification-dot" />
        </button>

        {/* پروفایل استاد */}
        <div className="teacher-profile-chip">
          <div className="teacher-avatar">
            <FiUser size={18} />
          </div>
          <div className="teacher-info">
            <span className="teacher-name">استاد محترم</span>
            <span className="teacher-role">مدرس هوش مصنوعی و پایتون</span>
          </div>
        </div>
      </div>
    </header>
  );
}
