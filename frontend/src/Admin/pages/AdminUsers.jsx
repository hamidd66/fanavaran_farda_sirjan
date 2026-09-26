import React, { useState, useMemo } from 'react';
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiSearch,
  FiRotateCcw,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiKey,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSmartphone,
  FiMail,
  FiLock,
  FiCalendar,
  FiClock,
  FiBriefcase
} from 'react-icons/fi';
import '../style/AdminGlobal.css';

export default function AdminUsers() {
  // دیتای تستی اولیه کاربران
  const [users, setUsers] = useState([
    {
      id: 101,
      nationalCode: '3071234567',
      fullName: 'حمید پورفریدونی',
      password: 'Pass@1234Admin',
      role: 'admin',
      isActive: true,
      accessLevel: 'دسترسی کامل',
      lastLoginDate: '۱۴۰۳/۰۶/۰۸',
      lastLoginTime: '۱۸:۴۵',
      createdAt: '۱۴۰۲/۰۱/۱۵',
      gender: 'مرد'
    },
    {
      id: 102,
      nationalCode: '3079876543',
      fullName: 'علی رضایی',
      password: 'Teacher#2024!a',
      role: 'teacher',
      isActive: true,
      accessLevel: 'مدرس',
      lastLoginDate: '۱۴۰۳/۰۶/۰۷',
      lastLoginTime: '۱۱:۲۰',
      createdAt: '۱۴۰۲/۰۵/۲۰',
      gender: 'مرد'
    },
    {
      id: 103,
      nationalCode: '3064567890',
      fullName: 'زهرا حسینی',
      password: 'Student*9876z',
      role: 'student',
      isActive: false,
      accessLevel: 'هنرجو',
      lastLoginDate: '۱۴۰۳/۰۵/۲۸',
      lastLoginTime: '۰۹:۱۵',
      createdAt: '۱۴۰۲/۰۹/۱۰',
      gender: 'زن'
    },
    {
      id: 104,
      nationalCode: '3076543219',
      fullName: 'محمد امینی',
      password: 'Mohammad@2024',
      role: 'student',
      isActive: true,
      accessLevel: 'هنرجو',
      lastLoginDate: '۱۴۰۳/۰۶/۰۸',
      lastLoginTime: '۱۶:۰۵',
      createdAt: '۱۴۰۳/۰۱/۱۸',
      gender: 'مرد'
    }
  ]);

  // فیلترها و مقادیر جستجو
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // وضعیت نمایش رمز عبور در جزئیات
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // استیت‌های مودال‌ها
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // استیت‌های فرم تغییر رمز
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // آمار کارت‌های بالا
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const inactive = total - active;
    const admins = users.filter((u) => u.role === 'admin').length;
    return { total, active, inactive, admins };
  }, [users]);

  // فیلتر کردن کاربران
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        user.fullName.toLowerCase().includes(q) ||
        user.nationalCode.includes(q) ||
        (user.phone && user.phone.includes(q)) ||
        (user.email && user.email.toLowerCase().includes(q));

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      const matchRole = roleFilter === 'all' || user.role === roleFilter;

      return matchSearch && matchStatus && matchRole;
    });
  }, [users, searchQuery, statusFilter, roleFilter]);

  // بازنشانی همه فیلترها
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoleFilter('all');
  };

  // تاگل نمایش رمز در مودال جزئیات
  const togglePasswordVisibility = (id) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // باز کردن مودال جزئیات
  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // باز کردن مودال تغییر رمز
  const handleOpenPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  // ثبت رمز عبور جدید
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('رمز عبور جدید با تکرار آن مطابقت ندارد.');
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? { ...user, password: newPassword } : user
      )
    );

    alert(`رمز عبور کاربر «${selectedUser.fullName}» با موفقیت تغییر یافت.`);
    setIsPasswordModalOpen(false);
  };

  // بج نقش
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="admin-badge admin-badge-primary">مدیر سیستم</span>;
      case 'teacher':
        return <span className="admin-badge admin-badge-info">مدرس</span>;
      case 'student':
        return <span className="admin-badge admin-badge-secondary">هنرجو / دانشجو</span>;
      default:
        return <span className="admin-badge admin-badge-light">{role}</span>;
    }
  };

  return (
    <div className="admin-page-container">
      {/* ۱. هدر صفحه */}
      
<header className="admin-page-header d-flex justify-content-start align-items-center gap-3">
  <div className="admin-page-header-icon">
    <FiBookOpen size={26} />
  </div>
  <div className="admin-page-header-text">
    <h1 className="admin-page-title">مدیریت کاربران</h1>
    <p className="admin-page-subtitle">
      مشاهده، جستجو و مدیریت حساب‌های کاربری و دسترسی‌های سامانه
    </p>
  </div>
</header>














      {/* ۲. کارت‌های آماری */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiUsers size={22} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل کاربران</span>
            <span className="stat-card-value">{stats.total}</span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiUserCheck size={22} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کاربران فعال</span>
            <span className="stat-card-value">{stats.active}</span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#ef4444' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <FiUserX size={22} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کاربران غیرفعال</span>
            <span className="stat-card-value">{stats.inactive}</span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiShield size={22} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">مدیران سیستم</span>
            <span className="stat-card-value">{stats.admins}</span>
          </div>
        </div>
      </div>




      {/* ۴. جدول لیست کاربران */}
      <div className="admin-table-container">


      {/* ۳. نوار جستجو و فیلترها */}
      {/* نوار فیلترها — یک نوار واحد */}
<div className="admin-filters-bar d-flex flex-column gap-3">
  {/* سطر بالا: باکس جستجو + ۲ عدد سلکت */}
  <div className="row g-2 align-items-center w-100">
    {/* تکست‌باکس جستجو (فضای بیشتر) */}
    <div className="col-12 col-md-6">
      <div className="admin-search-box w-100">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="جستجو بر اساس نام، کدملی، شماره همراه یا ایمیل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button type="button" className="clear-search-btn" onClick={() => setSearchQuery("")}>
            <FiX />
          </button>
        )}
      </div>
    </div>

    {/* لیست‌باکس وضعیت */}
    <div className="col-12 col-sm-6 col-md-3">
      <select
        className="admin-filter-select w-100"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">همه وضعیت‌ها</option>
        <option value="active">فعال</option>
        <option value="inactive">غیرفعال</option>
      </select>
    </div>

    {/* لیست‌باکس نقش‌ها */}
    <div className="col-12 col-sm-6 col-md-3">
      <select
        className="admin-filter-select w-100"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="all">همه نقش‌ها</option>
        <option value="admin">مدیر سیستم</option>
        <option value="teacher">مدرس</option>
        <option value="student">هنرجو</option>
      </select>
    </div>
  </div>

  {/* سطر پایین: دکمه بازنشانی سمت چپ (در حالت RTL با justify-content-end به سمت چپ می‌رود) */}
  <div className="d-flex justify-content-end w-100">
    <button
      type="button"
      className="btn-action-base reset-filters-btn-full"
      onClick={handleResetFilters}
      title="بازنشانی تمام فیلترها و نمایش لیست کامل"
    >
      <FiRotateCcw className="reset-icon" />
      <span>بازنشانی فیلترها</span>
    </button>
  </div>
</div>



        <div className="admin-table-responsive">
          <table className="admin-users-table text-center">
            <thead>
              <tr>
                <th className="col-username">نام کاربری</th>
                <th className="col-name">نام کاربر</th>
                <th className="col-role">نقش</th>
                <th className="col-status col-desktop-only">وضعیت</th>
                <th className="col-last-login col-desktop-only">آخرین ورود</th>
                <th className="col-actions">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="col-name font-medium">{user.nationalCode}</td>
                    <td className="col-name font-medium">{user.fullName}</td>
                    <td className="col-role">{getRoleBadge(user.role)}</td>
                    <td className="col-status col-desktop-only">
                      {user.isActive ? (
                        <span className="admin-status-pill status-active">
                          <FiCheckCircle size={13} />
                          فعال
                        </span>
                      ) : (
                        <span className="admin-status-pill status-inactive">
                          <FiXCircle size={13} />
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="col-last-login col-desktop-only">
                      <div className="admin-datetime-cell">
                        <span className="date">{user.lastLoginDate}</span>
                        <span className="time">{user.lastLoginTime}</span>
                      </div>
                    </td>
                    <td className="col-actions">
                      <div className="admin-actions-group">
                        <button
                          type="button"
                          className="admin-icon-btn btn-details"
                          onClick={() => handleOpenDetails(user)}
                          title="مشاهده جزئیات کامل"
                          aria-label="مشاهده جزئیات کامل"
                        >
                          <FiInfo size={16} />
                        </button>
                        <button
                          type="button"
                          className="admin-icon-btn btn-password"
                          onClick={() => handleOpenPasswordModal(user)}
                          title="تغییر کلمه عبور"
                          aria-label="تغییر کلمه عبور"
                        >
                          <FiKey size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-table-empty">
                    هیچ کاربری با مشخصات جستجو شده یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* ۵. مودال جزئیات کاربر */}
      {isDetailModalOpen && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="admin-modal-box user-details-modal" onClick={(e) => e.stopPropagation()}>
            {/* هدر مودال */}
            <div className="modal-header-hero">
              <button
                className="modal-close-btn"
                onClick={() => setIsDetailModalOpen(false)}
                title="بستن پنجره"
                type="button"
              >
                <FiX size={20} />
              </button>
              <div className="user-hero-info">
                <div className="user-avatar-circle">
                  <FiUser size={36} />
                </div>
                <div className="user-hero-texts">
                  <h3 className="user-hero-name">{selectedUser.fullName || selectedUser.name || '—'}</h3>
                  <div className="user-hero-badges">
                    <span className="rounded-3 bg-success-subtle">{getRoleBadge(selectedUser.role)}</span>
                    {selectedUser.isActive ? (
                      <span className="user-status-tag status-active">
                        <span className="status-dot"></span> فعال
                      </span>
                    ) : (
                      <span className="user-status-tag status-inactive">
                        <span className="status-dot"></span> غیرفعال
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* بدنه و کارت‌های اطلاعات */}
            <div className="modal-body-content">
              <div className="details-cards-grid">

                {/* نام کاربری / کد ملی */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-indigo">
                    <FiUser size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">نام کاربری (کد ملی)</span>
                    <span className="detail-value font-mono">{selectedUser.nationalCode || '—'}</span>
                  </div>
                </div>

                {/* رمز عبور */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-amber">
                    <FiLock size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">رمز عبور</span>
                    <div className="password-display-row">
                      <span className="detail-value font-mono">
                        {showPasswordMap && showPasswordMap[selectedUser.id] ? selectedUser.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        className="pw-toggle-btn"
                        onClick={() => togglePasswordVisibility(selectedUser.id)}
                        title={showPasswordMap && showPasswordMap[selectedUser.id] ? 'مخفی کردن' : 'نمایش رمز'}
                      >
                        {showPasswordMap && showPasswordMap[selectedUser.id] ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

              

                {/* سطح دسترسی */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-cyan">
                    <FiShield size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">سطح دسترسی</span>
                    <span className="detail-value text-accent-shield">{selectedUser.accessLevel || '—'}</span>
                  </div>
                </div>

             

          

                {/* تاریخ عضویت */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-teal">
                    <FiCalendar size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">تاریخ عضویت</span>
                    <span className="detail-value">{selectedUser.createdAt || selectedUser.registerDate || '—'}</span>
                  </div>
                </div>

                {/* آخرین ورود */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-slate">
                    <FiClock size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">آخرین ورود</span>
                    <span className="detail-value">
                      {selectedUser.lastLoginDate ? (
                        <>
                          {selectedUser.lastLoginDate}
                          {selectedUser.lastLoginTime && (
                            <span className="time-badge" style={{ marginRight: '6px' }}>
                              {selectedUser.lastLoginTime}
                            </span>
                          )}
                        </>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                </div>



                 {/* تاریخ عضویت */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-blue">
                    <FiUser size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">جنسیت</span>
                    <span className="detail-value">{selectedUser.gender}</span>
                  </div>
                </div>



              </div>
            </div>
          </div>
        </div>
      )}


      {/* ۶. مودال تغییر رمز عبور */}
      {isPasswordModalOpen && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="admin-modal-box user-details-modal password-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-hero password-header-hero">
              <button
                className="modal-close-btn"
                onClick={() => setIsPasswordModalOpen(false)}
                title="بستن پنجره"
                type="button"
              >
                <FiX size={20} />
              </button>

              <div className="user-hero-info">
                <div className="user-avatar-circle password-avatar-circle">
                  <FiKey size={32} />
                </div>
                <div className="user-hero-texts">
                  <h3 className="user-hero-name">تغییر رمز عبور کاربر</h3>
                  <span className="user-hero-subtitle">
                    تنظیم رمز عبور جدید برای <strong>{selectedUser.fullName}</strong> ({selectedUser.nationalCode})
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body-content">
                <div className="password-info-alert">
                  <div className="alert-icon-wrap">
                    <FiShield size={20} />
                  </div>
                  <div className="alert-text">
                    رمز عبور جدید باید حداقل ۸ کاراکتر و ترکیبی از حروف و اعداد باشد.
                  </div>
                </div>

                <div className="password-fields-wrapper">
                  <div className="password-input-group">
                    <label className="password-input-label">
                      <FiLock className="label-icon" /> رمز عبور جدید
                    </label>
                    <div className="custom-password-input-box">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="حداقل ۸ کاراکتر وارد کنید..."
                        className="admin-form-input "
                        required
                      />
                      <button
                        type="button"
                        className="pw-toggle-btn field-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        title={showNewPassword ? "مخفی کردن" : "نمایش رمز"}
                      >
                        {showNewPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                      </button>
                    </div>
                  </div>

                  <div className="password-input-group">
                    <label className="password-input-label">
                      <FiCheckCircle className="label-icon" /> تکرار رمز عبور جدید
                    </label>
                    <div className="custom-password-input-box">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="مجدداً رمز عبور را وارد کنید..."
                        className="admin-form-input "
                        required
                      />
                      <button
                        type="button"
                        className="pw-toggle-btn field-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? "مخفی کردن" : "نمایش رمز"}
                      >
                        {showConfirmPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-custom-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary save-password-btn"
                >
                  <FiKey size={17} />
                  ذخیره رمز جدید
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

 );
}
