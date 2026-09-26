import React, { useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiSearch,
  FiPlus,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
  FiBookOpen,
  FiLayers,
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiEye,
  FiFileText,
  FiCreditCard,
  FiUser,FiFilter,
  FiEdit
} from 'react-icons/fi';
import '../style/AdminTeacherSalaryManagement.css';

// داده‌های نمونه کامل و سازگار با کل صفحه
const initialTeachersData = [
  {
    id: 'TCH-001',
    name: 'دکتر علیرضا احمدی',
    specialty: 'هوش مصنوعی',
    phone: '09123456789',
    nationalCode: '3061234567',
    totalPaid: 45000000,
    pending: 5000000,
    balance: 5000000,
    totalEarnings: 50000000,
    pendingSessions: 10,
    sessionRate: 500000,
    totalSessions: 90,
    mainCourse: 'هوش مصنوعی',
    status: 'partial',
    courses: ['یادگیری ماشین', 'هوش مصنوعی پیشرفته'],
    paymentLogs: [
      {
        date: '1404/05/28 12:40',
        course: 'یادگیری ماشین',
        sessions: 8,
        amount: 4000000,
        tracking: 'TR-98214 - پایا',
        status: 'موفق'
      },
      {
        date: '1404/04/30 18:15',
        course: 'هوش مصنوعی پیشرفته',
        sessions: 12,
        amount: 6000000,
        tracking: 'TR-77123 - کارت به کارت',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'TCH-002',
    name: 'مهندس سارا محمدی',
    specialty: 'فرانت‌اند (React)',
    phone: '09121112233',
    nationalCode: '3079876543',
    totalPaid: 32000000,
    pending: 0,
    balance: 0,
    totalEarnings: 32000000,
    pendingSessions: 0,
    sessionRate: 400000,
    totalSessions: 80,
    mainCourse: 'React',
    status: 'settled',
    courses: ['ری‌اکت مقدماتی', 'فرانت‌اند پیشرفته'],
    paymentLogs: [
      {
        date: '1404/05/01 09:10',
        course: 'ری‌اکت مقدماتی',
        sessions: 10,
        amount: 4000000,
        tracking: 'TR-11122 - پایا',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'TCH-003',
    name: 'مهندس رضا کریمی',
    specialty: 'پایتون و جنگو',
    phone: '09351234567',
    nationalCode: '2984561230',
    totalPaid: 28000000,
    pending: 12000000,
    balance: 12000000,
    totalEarnings: 40000000,
    pendingSessions: 24,
    sessionRate: 500000,
    totalSessions: 96,
    mainCourse: 'Python & Django',
    status: 'overdue',
    courses: ['پایتون پیشرفته', 'جنگو پروژه‌محور'],
    paymentLogs: [
      {
        date: '1404/03/31 10:05',
        course: 'پایتون پیشرفته',
        sessions: 14,
        amount: 7000000,
        tracking: 'TR-45610 - شتاب',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'TCH-004',
    name: 'استاد مریم حسینی',
    specialty: 'طراحی سایت',
    phone: '09901234567',
    nationalCode: '3057654321',
    totalPaid: 15000000,
    pending: 0,
    balance: 0,
    totalEarnings: 15000000,
    pendingSessions: 0,
    sessionRate: 350000,
    totalSessions: 48,
    mainCourse: 'طراحی سایت',
    status: 'settled',
    courses: ['HTML/CSS', 'Bootstrap'],
    paymentLogs: [
      {
        date: '1404/02/20 15:45',
        course: 'HTML/CSS',
        sessions: 10,
        amount: 3500000,
        tracking: 'TR-22098 - پایا',
        status: 'موفق'
      }
    ]
  }
];

export default function TeacherSalaryManagement({ onBack }) {
  const [teachers, setTeachers] = useState(initialTeachersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');

  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(() => new Date().toLocaleDateString('fa-IR'));
  const [payTime, setPayTime] = useState('14:30');
  const [sessionCount, setSessionCount] = useState(1);
  const [sessionRate, setSessionRate] = useState(350000);
  const [payNote, setPayNote] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const stats = useMemo(() => {
    return {
      totalPaid: teachers.reduce((acc, t) => acc + (t.totalPaid || 0), 0),
      totalPending: teachers.reduce((acc, t) => acc + (t.balance || 0), 0),
      settledCount: teachers.filter((t) => (t.balance || 0) === 0).length,
      totalCount: teachers.length
    };
  }, [teachers]);



    const [isEditMode, setIsEditMode] = useState(false);
      const handleOpenEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherSearchQuery(teacher.name);
    setIsEditMode(true);
    // لود کردن آخرین وضعیت یا مبلغ پرداخت‌شده
    setPayAmount(teacher.totalPaid || 0);
    setSessionCount(teacher.totalSessions || 0);
    setSessionRate(teacher.sessionRate || 350000);
    setSelectedCourse(teacher.mainCourse || teacher.courses?.[0] || '');
    setPayNote('ویرایش و اصلاح دستی اطلاعات مالی');
    setPayDate(new Date().toLocaleDateString('fa-IR'));
    setPayTime('14:30');
    setIsPayModalOpen(true);
  };




  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.trim();
      const matchSearch =
        !q ||
        t.name.includes(q) ||
        t.specialty.includes(q) ||
        t.phone.includes(q) ||
        t.nationalCode.includes(q);

      const matchSpec =
        specialtyFilter === 'all' || t.specialty === specialtyFilter;

      const teacherStatus =
        t.balance > 0 ? 'debtor' : 'settled';

      const matchStatus =
        statusFilter === 'all' || teacherStatus === statusFilter;

      return matchSearch && matchSpec && matchStatus;
    });
  }, [teachers, searchQuery, specialtyFilter, statusFilter]);

  const searchResults = useMemo(() => {
    if (!teacherSearchQuery.trim() || selectedTeacher) return [];
    const q = teacherSearchQuery.trim().toLowerCase();

    return teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.nationalCode?.includes(q) ||
        t.phone?.includes(q)
    );
  }, [teacherSearchQuery, teachers, selectedTeacher]);

  const handleOpenGeneralPayModal = () => {
        setIsEditMode(false);

    setSelectedTeacher(null);
    setTeacherSearchQuery('');
    setPayAmount('');
    setSessionCount(1);
    setSessionRate(350000);
    setPayNote('');
    setSelectedCourse('');
    setPayDate(new Date().toLocaleDateString('fa-IR'));
    setPayTime('14:30');
    setIsPayModalOpen(true);
  };

  const handleOpenRowPayModal = (teacher) => {
        setIsEditMode(false);

    const rate = teacher.sessionRate || 350000;
    const sessions = teacher.pendingSessions || 1;
    const calculated = sessions * rate;

    setSelectedTeacher(teacher);
    setTeacherSearchQuery(teacher.name);
    setSessionRate(rate);
    setSessionCount(sessions);
    setPayAmount(calculated);
    setSelectedCourse(teacher.courses?.[0] || '');
    setPayNote('');
    setIsPayModalOpen(true);
  };

  const handleOpenDetailsModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsModalOpen(true);
  };

  const handleClosePayModal = () => {
        setIsEditMode(false);

    setIsPayModalOpen(false);
    setSelectedTeacher(null);
    setTeacherSearchQuery('');
    setPayAmount('');
    setPayNote('');
    setSelectedCourse('');
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  const handleSelectTeacherFromSearch = (teacher) => {
    const rate = teacher.sessionRate || 350000;
    const sessions = teacher.pendingSessions || 1;
    const calculated = sessions * rate;

    setSelectedTeacher(teacher);
    setTeacherSearchQuery(teacher.name);
    setSessionRate(rate);
    setSessionCount(sessions);
    setPayAmount(calculated);
    setSelectedCourse(teacher.courses?.[0] || '');
  };

  const handleSessionsChange = (sessions, rate = sessionRate) => {
    const numericSessions = Number(sessions) || 0;
    const numericRate = Number(rate) || 0;
    setSessionCount(numericSessions);
    setPayAmount(numericSessions * numericRate);
  };

   const handleSubmitPayment = () => {
    if (!selectedTeacher || !payAmount) return;

    const amount = Number(payAmount) || 0;

    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id !== selectedTeacher.id) return teacher;

        if (isEditMode) {
          // در حالت ویرایش: مبلغ پرداختی جدید جایگزین کل پرداختی قبلی می‌شود
          const newTotalPaid = amount;
          const totalEarnings = teacher.totalEarnings || 0;
          const newBalance = Math.max(totalEarnings - newTotalPaid, 0);

          return {
            ...teacher,
            totalPaid: newTotalPaid,
            balance: newBalance,
            pending: newBalance,
            sessionRate: Number(sessionRate) || teacher.sessionRate,
            totalSessions: Number(sessionCount) || teacher.totalSessions,
            status: newBalance === 0 ? 'settled' : 'partial'
          };
        }

        // حالت عادی (ثبت واریز جدید)
        const newBalance = Math.max((teacher.balance || 0) - amount, 0);
        const newPendingSessions =
          teacher.sessionRate > 0
            ? Math.max(
                (teacher.pendingSessions || 0) - Math.floor(amount / (teacher.sessionRate || 1)),
                0
              )
            : teacher.pendingSessions || 0;

        const newLog = {
          date: `${payDate} ${payTime}`,
          course: selectedCourse || teacher.mainCourse || 'بدون عنوان',
          sessions: Number(sessionCount) || 0,
          amount,
          tracking: payNote || 'ثبت دستی پرداخت',
          status: 'موفق'
        };

        return {
          ...teacher,
          totalPaid: (teacher.totalPaid || 0) + amount,
          balance: newBalance,
          pending: newBalance,
          pendingSessions: newPendingSessions,
          status: newBalance === 0 ? 'settled' : 'partial',
          paymentLogs: [newLog, ...(teacher.paymentLogs || [])]
        };
      })
    );

    handleClosePayModal();
  };


  // تشخیص اینکه آیا فیلتری فعال است یا خیر
const isFilterActive = searchQuery !== '' || specialtyFilter !== 'all' || statusFilter !== 'all';

// تابع بازنشانی فیلترها
const handleResetFilters = () => {
  setSearchQuery('');
  setSpecialtyFilter('all');
  setStatusFilter('all');
};


  const specialties = [...new Set(teachers.map((t) => t.specialty))];

  return (
    <div className="page-wrapper">
      <header className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {onBack && (
            <button
              className="admin-btn-secondary"
              onClick={onBack}
              title="بازگشت به داشبورد"
              style={{ padding: '8px 12px', minWidth: 'auto' }}
            >
              <FiArrowRight size={20} />
            </button>
          )}

          <div>
            <h1 className="admin-page-title">مدیریت و پرداخت حقوق اساتید</h1>
            <p className="admin-page-subtitle">
              رسیدگی به حق‌التدریس، تسویه‌حساب و امور مالی کادر آموزشی
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button className="admin-btn-primary" onClick={handleOpenGeneralPayModal}>
            <FiPlus size={18} />
            <span>ثبت پرداخت جدید</span>
          </button>
        </div>
      </header>

      <div className="admin-stats-grid">
        {[
          {
            title: 'مجموع پرداختی‌های تسویه',
            val: stats.totalPaid.toLocaleString(),
            unit: 'تومان',
            icon: <FiCheckCircle size={24} />,
            color: '#10b981',
            trend: 'تسویه‌شده با اساتید',
            isPositive: true
          },
          {
            title: 'مجموع معوقات پرداختی',
            val: stats.totalPending.toLocaleString(),
            unit: 'تومان',
            icon: <FiAlertCircle size={24} />,
            color: '#ef4444',
            trend: 'در انتظار واریز',
            isPositive: false
          },
          {
            title: 'تعداد پرونده‌های تسویه شده',
            val: stats.settledCount,
            unit: 'مورد',
            icon: <FiDollarSign size={24} />,
            color: '#3b82f6',
            trend: 'تسویه کامل این دوره',
            isPositive: true
          },
          {
            title: 'کل اساتید فعال',
            val: stats.totalCount,
            unit: 'نفر',
            icon: <FiUser size={24} />,
            color: '#6366f1',
            trend: 'کادر فعال آموزشی',
            isPositive: true
          }
        ].map((item, idx) => (
          <div
            key={idx}
            className="admin-stat-card"
            style={{ '--card-color': item.color }}
          >
            <div
              className="stat-card-icon"
              style={{
                backgroundColor: `${item.color}1f`,
                color: item.color
              }}
            >
              {item.icon}
            </div>

            <div className="stat-card-info">
              <span className="stat-card-title">{item.title}</span>
              <span className="stat-card-value">
                {item.val} {item.unit}
              </span>
              <span
                className={`stat-trend-badge ${
                  item.isPositive ? 'positive' : 'warning'
                }`}
              >
                <FiTrendingUp size={12} /> {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="modern-table-card">
        
        


        <section className="tuition-filters-card">
  {/* بخش جستجو با دکمه پاک‌سازی */}
  <div className="filter-input-group search-box">
    <FiSearch className="filter-icon" />
    <input
      type="text"
      placeholder="جستجوی استاد، تخصص، شماره تماس یا کدملی..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    {searchQuery && (
      <button 
        className="clear-search-btn" 
        onClick={() => setSearchQuery('')} 
        title="پاک کردن متن"
      >
        <FiX />
      </button>
    )}
  </div>

  <div className="filter-secondary-group">
    {/* فیلتر تخصص (با آیکون) */}
    <div className="filter-input-group select-box">
      <FiBookOpen className="filter-icon" />
      <select
        value={specialtyFilter}
        onChange={(e) => setSpecialtyFilter(e.target.value)}
      >
        <option value="all">همه تخصص‌ها</option>
        {specialties.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>

    {/* فیلتر وضعیت (با آیکون) */}
    <div className="filter-input-group select-box">
      <FiFilter className="filter-icon" />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">همه وضعیت‌ها</option>
        <option value="settled">تسویه شده</option>
        <option value="debtor">در انتظار پرداخت</option>
      </select>
    </div>

    {/* دکمه بازنشانی (فقط وقتی فیلتری فعال است نمایش داده می‌شود) */}
    {isFilterActive && (
      <button
        className="tuition-btn-reset-icon"
        onClick={handleResetFilters}
        title="بازنشانی فیلترها"
        aria-label="بازنشانی فیلترها"
      >
        <FiRotateCcw size={18} />
      </button>
    )}
  </div>
</section>






        <div className="table-responsive">
          <table className="admin-modern-table">
            <thead>
              <tr>
                <th>مدرس و اطلاعات پرسنلی</th>
                <th>دپارتمان / دوره‌ها</th>
                <th>جلسات طلبکار</th>
                <th>مجموع کارکرد</th>
                <th>طلب معوق</th>
                <th>وضعیت حساب</th>
                <th style={{ textAlign: 'center' }}>عملیات تسویه</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="profile-avatar">{teacher.name[0]}</div>
                      <div className="profile-info">
                        <span className="profile-name">{teacher.name}</span>
                        <span className="profile-sub">
                          {teacher.phone} | کد: {teacher.nationalCode || '---'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="badge-tag-wrap">
                      <span className="badge-tag">
                        {teacher.mainCourse || teacher.specialty}
                      </span>
                    </div>
                  </td>

                  <td>
                    <strong>{teacher.pendingSessions || 0}</strong> جلسه
                  </td>

                  <td>{(teacher.totalEarnings || 0).toLocaleString()} تومان</td>

                  <td>
                    <strong
                      className={teacher.balance > 0 ? 'debt-text' : 'settled-text'}
                    >
                      {(teacher.balance || 0).toLocaleString()} تومان
                    </strong>
                  </td>

                  <td>
                    {teacher.balance > 0 ? (
                      <span className="status-pill warning">
                        <FiAlertCircle size={12} /> در انتظار پرداخت
                      </span>
                    ) : (
                      <span className="status-pill success">
                        <FiCheckCircle size={12} /> تسویه شده
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="table-action-buttons">
                      <button
                        className="table-btn-pay"
                        title="ثبت واریز حقوق"
                        onClick={() => handleOpenRowPayModal(teacher)}
                      >
                        <FiDollarSign size={15} />
                        <span>تسویه</span>
                      </button>


                     {/* دکمه جدید ویرایش */}
                      <button
                        className="table-btn-edit"
                        title="ویرایش وضعیت و مبالغ پرداختی"
                        onClick={() => handleOpenEditModal(teacher)}
                      >
                        <FiEdit size={15} />
                        <span>ویرایش</span>
                      </button>



                      <button
                        className="table-btn-details"
                        title="مشاهده سوابق و جزئیات مالی"
                        onClick={() => handleOpenDetailsModal(teacher)}
                      >
                        <FiEye size={15} />
                        <span>کارنامه مالی</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>
                    موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isPayModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleClosePayModal}>
          <div
            className="admin-modal-card modern-pay-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon-badge">
                  <FiCreditCard size={20} />
                </span>
                                <div>
                  <h3>{isEditMode ? 'ویرایش اطلاعات پرداختی استاد' : 'ثبت واریزی و تسویه کادر آموزشی'}</h3>
                  <p className="modal-subtitle">
                    {isEditMode 
                      ? 'اصلاح کل مبالغ دریافتی و تعداد جلسات ثبت‌شده'
                      : 'ثبت صورتحساب و پرداخت کارکرد جلسات مدرسین'}
                  </p>
                </div>

              </div>
              <button className="modal-close-btn" onClick={handleClosePayModal}>
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {!selectedTeacher ? (
                <div className="form-group-block search-teacher-block">
                  <label className="field-label">
                    <FiSearch /> جستجوی مدرس (نام، کدملی یا شماره تماس)
                  </label>

                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="modal-form-input"
                      placeholder="مثال: علیرضا احمدی، 306...، 0912..."
                      value={teacherSearchQuery}
                      onChange={(e) => setTeacherSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <FiSearch className="input-inner-icon" />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="teacher-live-dropdown">
                      {searchResults.map((teacher) => (
                        <div
                          key={teacher.id}
                          className="teacher-live-item"
                          onClick={() => handleSelectTeacherFromSearch(teacher)}
                        >
                          <div className="teacher-avatar-tiny">{teacher.name[0]}</div>
                          <div className="teacher-meta-tiny">
                            <strong>{teacher.name}</strong>
                            <span>
                              کدملی: {teacher.nationalCode || '---'} | تماس:{' '}
                              {teacher.phone}
                            </span>
                          </div>
                          <div
                            className={`status-pill ${
                              teacher.balance > 0 ? 'warning' : 'success'
                            }`}
                          >
                            {teacher.balance > 0
                              ? `طلبکار: ${teacher.balance.toLocaleString()} ت`
                              : 'تسویه کامل'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="selected-teacher-badge-card">
                  <div className="teacher-identity">
                    <div className="teacher-avatar-large">{selectedTeacher.name[0]}</div>
                    <div>
                      <h4>{selectedTeacher.name}</h4>
                      <span>
                        {selectedTeacher.phone} | کدملی:{' '}
                        {selectedTeacher.nationalCode || '---'}
                      </span>
                    </div>
                  </div>

                  <div className="teacher-balance-state">
                    {selectedTeacher.balance > 0 ? (
                      <div className="balance-indicator warning">
                        <FiAlertCircle />
                        <span>
                          طلبکار:
                          <strong>
                            {' '}
                            {selectedTeacher.balance?.toLocaleString()}
                          </strong>{' '}
                          تومان
                        </span>
                      </div>
                    ) : (
                      <div className="balance-indicator success">
                        <FiCheckCircle />
                        <span>تسویه است (فاقد بدهی معوق)</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="change-teacher-btn"
                      onClick={() => {
                        setSelectedTeacher(null);
                        setTeacherSearchQuery('');
                        setSelectedCourse('');
                        setPayAmount('');
                      }}
                    >
                      تغییر کادر
                    </button>
                  </div>
                </div>
              )}

              {selectedTeacher && (
                <>
                  <div className="form-row-2">
                    <div className="form-group-block">
                      <label className="field-label">
                        <FiBookOpen /> دوره و کلاس مربوطه
                      </label>
                      <select
                        className="modal-form-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                      >
                        <option value="">انتخاب دوره تدریس شده...</option>
                        {(selectedTeacher.courses || []).map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-row-inner-calc">
                      <div className="form-group-block">
                        <label className="field-label">
                          <FiLayers /> تعداد جلسات
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="modal-form-input"
                          value={sessionCount}
                          onChange={(e) => handleSessionsChange(e.target.value)}
                        />
                      </div>

                      <div className="form-group-block">
                        <label className="field-label">
                          <FiDollarSign /> نرخ هر جلسه (تومان)
                        </label>
                        <input
                          type="number"
                          className="modal-form-input"
                          value={sessionRate}
                          onChange={(e) => {
                            setSessionRate(Number(e.target.value) || 0);
                            handleSessionsChange(sessionCount, e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-group-block highlighted-amount">
                                            <label className="field-label">
                        {isEditMode ? 'مجموع کل دریافتی‌های اصلاح‌شده (تومان)' : 'مبلغ پرداختی نهایی (تومان)'}
                      </label>

                      <div className="amount-input-box">
                        <input
                          type="number"
                          className="modal-form-input bold-amount"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                        />
                        <span className="currency-tag">تومان</span>
                      </div>
                    </div>

                    <div className="form-group-block">
                      <label className="field-label">
                        <FiCalendar /> تاریخ پرداخت
                      </label>
                      <input
                        type="text"
                        className="modal-form-input text-center"
                        value={payDate}
                        placeholder="۱۴۰۴/۰۶/۲۰"
                        onChange={(e) => setPayDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group-block">
                      <label className="field-label">
                        <FiClock /> ساعت پرداخت
                      </label>
                      <input
                        type="time"
                        className="modal-form-input text-center"
                        value={payTime}
                        onChange={(e) => setPayTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">
                      <FiFileText /> شماره پیگیری، شبا یا توضیحات سند
                    </label>
                    <textarea
                      className="modal-form-textarea"
                      rows={2}
                      placeholder="مثال: واریز پایا به شماره شبا IR... به همراه تسویه حق‌التدریس"
                      value={payNote}
                      onChange={(e) => setPayNote(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={handleClosePayModal}>
                انصراف
              </button>
                            <button
                className="admin-btn-primary"
                disabled={!selectedTeacher || !payAmount}
                onClick={handleSubmitPayment}
              >
                <FiCheckCircle /> {isEditMode ? 'ذخیره تغییرات و اصلاح حساب' : 'ثبت نهایی و صدور سند واریزی'}
              </button>

            </div>
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedTeacher && (
        <div className="admin-modal-backdrop" onClick={handleCloseDetailsModal}>
          <div
            className="admin-modal-card details-history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <div className="teacher-avatar-large">{selectedTeacher.name[0]}</div>
                <div>
                  <h3>پرونده مالی: {selectedTeacher.name}</h3>
                  <p className="modal-subtitle">
                    تاریخچه کلیه کارکردها، کلاس‌ها و صورتحساب‌های واریزی
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDetailsModal}>
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="teacher-summary-row">
                <div className="summary-pill-box">
                  <span>مجموع دریافتی‌ها:</span>
                  <strong>
                    {(selectedTeacher.totalPaid || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>مانده معوقه (طلب):</span>
                  <strong className="text-warning">
                    {(selectedTeacher.balance || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>کل جلسات برگزارشده:</span>
                  <strong>{selectedTeacher.totalSessions || 0} جلسه</strong>
                </div>
              </div>

              <h4 className="section-mini-title">
                <FiFileText /> لیست اسناد واریز شده به استاد
              </h4>

              <div className="history-table-container">
                <table className="modern-history-table">
                  <thead>
                    <tr>
                      <th>تاریخ و ساعت</th>
                      <th>کلاس / دوره</th>
                      <th>جلسات</th>
                      <th>مبلغ پرداختی</th>
                      <th>کد پیگیری / توضیحات</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedTeacher.paymentLogs || []).map((log, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="date-badge">{log.date}</span>
                        </td>
                        <td>
                          <strong>{log.course}</strong>
                        </td>
                        <td>{log.sessions} جلسه</td>
                        <td className="amount-col">
                          {log.amount.toLocaleString()} تومان
                        </td>
                        <td className="note-col">{log.tracking}</td>
                        <td>
                          <span className="status-pill success">{log.status}</span>
                        </td>
                      </tr>
                    ))}

                    {(!selectedTeacher.paymentLogs ||
                      selectedTeacher.paymentLogs.length === 0) && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>
                          هنوز سابقه پرداختی ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn-primary"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleOpenRowPayModal(selectedTeacher);
                }}
              >
                <FiDollarSign /> ثبت واریزی جدید برای این استاد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
