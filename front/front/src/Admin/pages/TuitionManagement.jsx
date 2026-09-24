import React, { useState, useMemo } from 'react';
import {
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiPlus,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiTrendingUp,
  FiPercent,
  FiCalendar,
  FiPrinter,
  FiBookOpen,
  FiX,
  FiCheck,
  FiRotateCcw,
  FiRefreshCw,
  FiEye,
  FiFileText,
  FiCreditCard,
  FiSmartphone,FiEdit
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import '../style/TuitionManagement.css';

// داده‌های نمونه مقایسه ماهانه و سالانه شهریه (میلیون تومان)
const monthlyTuitionComparison = [
  { month: 'فروردین', thisYear: 45, lastYear: 32 },
  { month: 'اردیبهشت', thisYear: 58, lastYear: 40 },
  { month: 'خرداد', thisYear: 72, lastYear: 48 },
  { month: 'تیر', thisYear: 90, lastYear: 62 },
  { month: 'مرداد', thisYear: 85, lastYear: 58 },
  { month: 'شهریور', thisYear: 110, lastYear: 75 },
];

// داده‌های وضعیت وصولی در دوره‌ها
const courseTuitionStats = [
  { id: 1, course: 'برنامه‌نویسی پایتون', total: 65, received: 52, pending: 13, progress: 80, color: '#6366f1' },
  { id: 2, course: 'فرانت‌اند (React)', total: 58, received: 49, pending: 9, progress: 85, color: '#06b6d4' },
  { id: 3, course: 'هوش مصنوعی و ML', total: 80, received: 56, pending: 24, progress: 70, color: '#ec4899' },
  { id: 4, course: 'طراحی سایت وردپرس', total: 35, received: 32, pending: 3, progress: 91, color: '#10b981' },
  { id: 5, course: 'علم داده (Data Science)', total: 50, received: 35, pending: 15, progress: 70, color: '#f59e0b' },
];

// لیست اولیه هنرجویان
const initialStudents = [
  {
    id: 'STU-101',
    name: 'علی حسینی',
    nationalCode: '3071234567',
    phone: '09131234567',
    course: 'برنامه‌نویسی پایتون',
    totalFee: 6500000,
    paidFee: 6500000,
    status: 'settled',
    lastPaymentDate: '1403/06/15',
    dueDate: '-',
  },
  {
    id: 'STU-102',
    name: 'سارا رضایی',
    nationalCode: '3069876543',
    phone: '09359876543',
    course: 'فرانت‌اند (React)',
    totalFee: 7200000,
    paidFee: 4000000,
    status: 'debtor',
    lastPaymentDate: '1403/05/20',
    dueDate: '1403/06/30',
  },
  {
    id: 'STU-103',
    name: 'امیرحسین مرادی',
    nationalCode: '3074561234',
    phone: '09124567890',
    course: 'هوش مصنوعی و ML',
    totalFee: 8500000,
    paidFee: 3000000,
    status: 'overdue',
    lastPaymentDate: '1403/04/10',
    dueDate: '1403/05/25',
  },
  {
    id: 'STU-104',
    name: 'فاطمه پورطاهری',
    nationalCode: '3061122334',
    phone: '09051239876',
    course: 'طراحی سایت وردپرس',
    totalFee: 4200000,
    paidFee: 4200000,
    status: 'settled',
    lastPaymentDate: '1403/06/02',
    dueDate: '-',
  },
  {
    id: 'STU-105',
    name: 'محمد صادقی',
    nationalCode: '3078899001',
    phone: '09135554433',
    course: 'علم داده (Data Science)',
    totalFee: 7800000,
    paidFee: 4500000,
    status: 'debtor',
    lastPaymentDate: '1403/05/28',
    dueDate: '1403/07/05',
  },
  {
    id: 'STU-106',
    name: 'نیلوفر کریمی',
    nationalCode: '3060011223',
    phone: '09378889900',
    course: 'برنامه‌نویسی پایتون',
    totalFee: 6500000,
    paidFee: 2000000,
    status: 'debtor',
    lastPaymentDate: '1403/06/01',
    dueDate: '1403/07/15',
  },
  {
    id: 'STU-107',
    name: 'مهدی بهرامی',
    nationalCode: '3079988776',
    phone: '09137776655',
    course: 'فرانت‌اند (React)',
    totalFee: 7200000,
    paidFee: 0,
    status: 'overdue',
    lastPaymentDate: '-',
    dueDate: '1403/06/10',
  }
];

export default function TuitionManagement({ onBack }) {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // دریافت پیش‌فرض تاریخ شمسی و ساعت
  const getInitialJalaliDateTime = () => {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return {
      date: dateStr,
      time: `${hours}:${minutes}`
    };
  };



    // State برای تشخیص حالت ویرایش
  const [isEditMode, setIsEditMode] = useState(false);

  // تابع باز کردن مودال در حالت ویرایش
  const handleOpenEditModal = (student) => {
    setSelectedStudentForPay(student);
    setIsQuickPayFromRow(true);
    setIsEditMode(true); // فعال‌سازی حالت ویرایش
    setPayAmount(student.paidFee.toString()); // بارگذاری مبلغ پرداختی فعلی
    setDiscountAmount('');
    setPaymentMethod('cash');
    setPayNote('');
    setPayDate(getInitialJalaliDateTime().date);
    setPayTime(getInitialJalaliDateTime().time);
    setIsPayModalOpen(true);
  };


  // Stateهای مودال صورت‌حساب
  const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Stateهای مودال پرداخت مدرن
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isQuickPayFromRow, setIsQuickPayFromRow] = useState(false);
  const [selectedStudentForPay, setSelectedStudentForPay] = useState(null);
  const [headerModalSearch, setHeaderModalSearch] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [payDate, setPayDate] = useState(() => getInitialJalaliDateTime().date);
  const [payTime, setPayTime] = useState(() => getInitialJalaliDateTime().time);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [payNote, setPayNote] = useState('');

  // ۱. باز کردن مودال از ردیف جدول
  const handleOpenRowPayModal = (student) => {
    setSelectedStudentForPay(student);
    setIsQuickPayFromRow(true);
    const remaining = Math.max(0, student.totalFee - student.paidFee);
    setPayAmount(remaining.toString());
    setDiscountAmount('');
    setPaymentMethod('cash');
    setPayNote('');
    setPayDate(getInitialJalaliDateTime().date);
    setPayTime(getInitialJalaliDateTime().time);
    setIsPayModalOpen(true);
    setIsEditMode(false);

  };

  // ۲. باز کردن مودال از هدر (حل مشکل دکمه)
  const handleOpenHeaderPayModal = () => {
    setSelectedStudentForPay(null);
    setIsQuickPayFromRow(false);
    setHeaderModalSearch('');
    setPayAmount('');
    setDiscountAmount('');
    setPaymentMethod('cash');
    setPayNote('');
    setPayDate(getInitialJalaliDateTime().date);
    setPayTime(getInitialJalaliDateTime().time);
    setIsPayModalOpen(true);
    setIsEditMode(false);

  };

  // ۳. بستن مودال پرداخت
  const handleClosePayModal = () => {
    setIsPayModalOpen(false);
    setSelectedStudentForPay(null);
    setHeaderModalSearch('');
    setPayAmount('');
    setDiscountAmount('');
    setPayNote('');
    setPaymentMethod('cash');
  };

  // ۴. ثبت نهایی پرداخت با اعمال تخفیف و زمان
    const handleConfirmPayment = () => {
    if (!selectedStudentForPay) {
      alert('لطفاً ابتدا هنرجو را مشخص کنید.');
      return;
    }

    const enteredAmount = Number(payAmount) || 0;
    const discount = Number(discountAmount) || 0;

    if (enteredAmount < 0) {
      alert('لطفاً مبلغ معتبری وارد کنید.');
      return;
    }

    setStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === selectedStudentForPay.id) {
          // اگر حالت ویرایش بود، مبلغ جایگزین می‌شود؛ در غیر این صورت جمع می‌شود
          const newPaid = isEditMode ? enteredAmount : stu.paidFee + enteredAmount;
          const newTotal = Math.max(newPaid, stu.totalFee - discount);
          const remaining = Math.max(0, newTotal - newPaid);

          return {
            ...stu,
            paidFee: newPaid,
            totalFee: newTotal,
            lastPaymentDate: `${payDate} ${payTime}`,
            status: remaining === 0 ? 'settled' : 'debtor'
          };
        }
        return stu;
      })
    );

    handleClosePayModal();
  };


  // باز کردن مودال تاریخچه
  const handleOpenHistoryModal = (student) => {
    const allCoursesOfStudent = students.filter(
      (s) => s.nationalCode === student.nationalCode
    );

    setSelectedStudentHistory({
      student,
      courses: allCoursesOfStudent,
    });
    setIsHistoryModalOpen(true);
  };

  // فیلتر جستجوی هنرجو داخل مودال هدر
  const headerSearchResults = useMemo(() => {
    const term = headerModalSearch.trim().toLowerCase();
    if (!term) return [];
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(term) ||
        s.nationalCode?.includes(term) ||
        s.phone?.includes(term)
    );
  }, [students, headerModalSearch]);

  // فیلترهای جدول اصلی
  const isFilterActive = searchQuery !== '' || courseFilter !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCourseFilter('all');
    setStatusFilter('all');
  };

  const filteredStudentsTable = useMemo(() => {
    return students.filter((stu) => {
      const term = searchQuery.trim().toLowerCase();
      const matchSearch =
        !term ||
        stu.name?.toLowerCase().includes(term) ||
        stu.nationalCode?.includes(term) ||
        stu.phone?.includes(term);

      const matchCourse = courseFilter === 'all' || stu.course === courseFilter;
      const matchStatus = statusFilter === 'all' || stu.status === statusFilter;

      return matchSearch && matchCourse && matchStatus;
    });
  }, [students, searchQuery, courseFilter, statusFilter]);

  return (
    <div className="tuition-container">
      {/* ================= ۱. هدر اختصاصی صفحه شهریه ================= */}
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
      <h1 className="admin-page-title">مدیریت و وصول شهریه هنرجویان</h1>
      <p className="admin-page-subtitle">مشاهده وضعیت پرداخت‌ها، مطالبات، تسویه‌حساب و آمار مقایسه‌ای</p>
    </div>
  </div>

  <div className="admin-page-header-actions">
    {/* دکمه ثبت پرداخت جدید با استایل یکپارچه */}
    <button
      className="admin-btn-primary"
      onClick={handleOpenHeaderPayModal}
    >
      <FiPlus size={18} />
      <span>ثبت پرداخت جدید</span>
    </button>
  </div>
</header>


      {/* ================= ۲. سکشن آماری و تحلیلی ================= */}
      <section className="tuition-analytics-grid">
        <div className="tuition-card tuition-chart-box">
          <div className="tuition-card-header">
            <div>
              <h3>نمودار مقایسه پرداخت شهریه</h3>
              <span className="subtitle">مقایسه ماه به ماه (سال جاری در برابر سال قبل) - میلیون تومان</span>
            </div>
            <span className="analytics-tag"><FiTrendingUp /> رشد ۲۸٪</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyTuitionComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tuitionThisYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tuitionLastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  direction: 'rtl'
                }}
              />
              <Legend verticalAlign="top" align="left" wrapperStyle={{ paddingBottom: 10, fontSize: 13 }} />
              <Area type="monotone" dataKey="thisYear" name="سال جاری (۱۴۰۳)" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#tuitionThisYear)" />
              <Area type="monotone" dataKey="lastYear" name="سال قبل (۱۴۰۲)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#tuitionLastYear)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="tuition-card tuition-courses-box">
          <div className="tuition-card-header">
            <h3>وصولی شهریه به تفکیک دوره</h3>
            <span className="subtitle">بر اساس مبلغ کل و مانده</span>
          </div>

          <div className="course-progress-list">
            {courseTuitionStats.map((c) => (
              <div key={c.id} className="course-stat-item">
                <div className="course-stat-info">
                  <span className="course-name">{c.course}</span>
                  <span className="course-amounts">
                    <strong>{c.received}</strong> از {c.total} م.ت ({c.progress}٪)
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${c.progress}%`,
                      backgroundColor: c.color,
                      boxShadow: `0 2px 8px ${c.color}66`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ۳. جدول و فیلترها ================= */}
      <section className="tuition-table-card">
        <section className="tuition-filters-card">
          <div className="filter-input-group search-box">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="جستجو با نام، کدملی یا شماره موبایل هنرجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="پاک کردن متن">
                <FiX />
              </button>
            )}
          </div>

          <div className="filter-secondary-group">
            <div className="filter-input-group select-box">
              <FiBookOpen className="filter-icon" />
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">همه دوره‌ها</option>
                <option value="برنامه‌نویسی پایتون">برنامه‌نویسی پایتون</option>
                <option value="فرانت‌اند (React)">فرانت‌اند (React)</option>
                <option value="هوش مصنوعی و ML">هوش مصنوعی و ML</option>
                <option value="طراحی سایت وردپرس">طراحی سایت وردپرس</option>
                <option value="علم داده (Data Science)">علم داده (Data Science)</option>
              </select>
            </div>

            <div className="filter-input-group select-box">
              <FiFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="settled">تسویه شده</option>
                <option value="debtor">دارای بدهی</option>
                <option value="overdue">سررسید گذشته</option>
              </select>
            </div>

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

        <div className="table-top-bar">
          <div className="result-counter">
            <strong>{filteredStudentsTable.length}</strong> هنرجو
          </div>
        </div>

        <div className="tuition-table-wrapper">
          <table className="tuition-table">
            <thead>
              <tr>
                <th>هنرجو</th>
                <th>کد ملی / موبایل</th>
                <th>کلاس / دوره</th>
                <th>کل شهریه</th>
                <th>پرداخت شده</th>
                <th>مانده بدهی</th>
                <th>وضعیت</th>
                <th>تاریخ پرداخت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudentsTable.length > 0 ? (
                filteredStudentsTable.map((stu) => {
                  const remaining = Math.max(0, stu.totalFee - stu.paidFee);
                  const isSettled = remaining === 0 || stu.status === 'settled';

                  return (
                    <tr key={stu.id}>
                      <td>
                        <div className="student-profile">
                          <div className="student-avatar">{stu.name[0]}</div>
                          <div>
                            <span className="student-name">{stu.name}</span>
                            <span className="student-id">{stu.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span>{stu.nationalCode}</span>
                          <small>{stu.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className="course-badge">{stu.course}</span>
                      </td>
                      <td className="amount-cell">{stu.totalFee.toLocaleString('fa-IR')} ت</td>
                      <td className="amount-cell text-success">{stu.paidFee.toLocaleString('fa-IR')} ت</td>
                      <td className="amount-cell text-danger">
                        {remaining > 0 ? `${remaining.toLocaleString('fa-IR')} ت` : '۰'}
                      </td>
                      <td>
                        {isSettled ? (
                          <span className="badge badge-success">
                            <FiCheckCircle /> تسویه
                          </span>
                        ) : (
                          <span className="badge badge-danger">
                            <FiAlertCircle /> بدهکار
                          </span>
                        )}
                      </td>
                      <td className="text-muted">
                        {isSettled ? (stu.lastPaymentDate || 'ثبت شده') : '-'}
                      </td>
                      <td>
                        <div className="row-actions">
                          {!isSettled && (
                            <button
                              className="btn-action pay"
                              onClick={() => handleOpenRowPayModal(stu)}
                              title="ثبت واریزی این هنرجو"
                            >
                              <FiDollarSign /> پرداخت
                            </button>
                          )}
                          {/* دکمه ویرایش اضافه شده */}
  <button
    className="btn-action edit"
    onClick={() => handleOpenEditModal(stu)}
    title="ویرایش شهریه پرداختی"
  >
    <FiEdit /> ویرایش
  </button>
                          <button
                            className="btn-action details"
                            onClick={() => handleOpenHistoryModal(stu)}
                            title="صورت‌حساب و دوره‌های هنرجو"
                          >
                            <FiEye /> جزئیات
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    هنرجویی با این مشخصات یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= مودال ثبت پرداخت مدرن ================= */}
      {isPayModalOpen && (
        <div className="modal-backdrop pay-backdrop" onClick={handleClosePayModal}>
          <div className="tuition-modal pay-modal-card-premium" onClick={(e) => e.stopPropagation()}>
            
            <div className="pay-modal-header">
              <div className="header-title-box">
                <div className="header-icon-badge">
                  <FiCreditCard />
                </div>
                <div>
<h3>
  {isEditMode 
    ? 'ویرایش شهریه پرداختی' 
    : (isQuickPayFromRow ? 'ثبت واریزی و دریافت شهریه' : 'دریافت شهریه هنرجو')}
</h3>
                  <p className="header-sub">
                    {isQuickPayFromRow
                      ? 'رسید پرداخت به صورت خودکار به نام هنرجو ثبت و صادر می‌شود.'
                      : 'جستجو و ثبت پرداخت جدید برای هنرجویان'}
                  </p>
                </div>
              </div>
              <button className="btn-close-pay-modal" onClick={handleClosePayModal}>
                <FiX />
              </button>
            </div>

            <div className="pay-modal-body">
              {/* کادر جستجوی زنده هنرجو در صورت باز شدن از هدر */}
              {!isQuickPayFromRow && !selectedStudentForPay && (
                <div className="search-student-box-pro">
                  <label className="input-label-pro">هنرجوی مورد نظر را جستجو و انتخاب کنید:</label>
                  <div className="search-input-field">
                    <FiSearch className="search-icon-field" />
                    <input
                      type="text"
                      placeholder="نام، کد ملی یا شماره همراه هنرجو..."
                      autoFocus
                      value={headerModalSearch}
                      onChange={(e) => setHeaderModalSearch(e.target.value)}
                    />
                  </div>

                  {headerSearchResults.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                      {headerSearchResults.map((stu) => {
                        const rem = Math.max(0, stu.totalFee - stu.paidFee);
                        return (
                          <div
                            key={stu.id}
                            onClick={() => {
                              setSelectedStudentForPay(stu);
                              setPayAmount(rem.toString());
                            }}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px 14px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e0e7ff'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                          >
                            <div>
                              <strong style={{ fontSize: '13.5px', color: '#1e293b' }}>{stu.name}</strong>
                              <span style={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>({stu.course})</span>
                            </div>
                            <span style={{ fontSize: '12.5px', color: rem > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                              {rem > 0 ? `بدهی: ${rem.toLocaleString('fa-IR')} ت` : 'تسویه'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* کارت مشخصات هنرجو */}
              {selectedStudentForPay && (
                <div className="student-profile-glass-card">
                  <div className="glass-card-top">
                    <div className="avatar-ring">
                      {selectedStudentForPay.name[0]}
                    </div>
                    <div className="student-titles">
                      <h4>{selectedStudentForPay.name}</h4>
                      <div className="meta-tags">
                        <span className="tag-item">کد ملی: <b>{selectedStudentForPay.nationalCode}</b></span>
                        <span className="tag-item">دوره: <b>{selectedStudentForPay.course}</b></span>
                        <span className="tag-item">تماس: <b>{selectedStudentForPay.phone}</b></span>
                      </div>
                    </div>
                    {!isQuickPayFromRow && (
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForPay(null)}
                        style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '12px' }}
                      >
                        تغییر هنرجو
                      </button>
                    )}
                  </div>

                  <div className="glass-card-debt">
                    <div className="debt-indicator">
                      <span className="debt-title">مانده کل بدهی دوره:</span>
                      <span className="debt-num">
                        {Math.max(0, selectedStudentForPay.totalFee - selectedStudentForPay.paidFee).toLocaleString('fa-IR')}
                        <small> تومان</small>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* فرم ورود مبلغ و جزئیات پرداخت */}
              {selectedStudentForPay && (
                <div className="pay-interactive-form">
                  <div className="form-two-cols">
                    <div className="form-group-pro">
                      <div className="field-header-row">
<label className="input-label-pro">مبلغ دریافتی (تومان):</label>
                        <button
                          type="button"
                          className="btn-pill-action"
                          onClick={() => {
                            const currentDebt = Math.max(0, selectedStudentForPay.totalFee - selectedStudentForPay.paidFee);
                            const discount = Number(discountAmount) || 0;
                            const netPayable = Math.max(0, currentDebt - discount);
                            setPayAmount(netPayable.toString());
                          }}
                        >
                          ⚡ تسویه مانده
                        </button>
                      </div>

                      <div className="amount-input-container">
                        <input
                          type="number"
                          className="amount-input-styled"
                          placeholder="۰"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                        />
                        <span className="amount-currency-suffix">تومان</span>
                      </div>

                      {payAmount && Number(payAmount) > 0 && (
                        <div className="amount-in-words-preview">
                          {Number(payAmount).toLocaleString('fa-IR')} تومان
                        </div>
                      )}
                    </div>

                    <div className="form-group-pro">
                      <label className="input-label-pro">تخفیف ویژه دوره (اختیاری):</label>
                      <div className="discount-input-container">
                        <FiPercent className="discount-icon" />
                        <input
                          type="number"
                          className="amount-input-styled discount-input"
                          placeholder="۰"
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(e.target.value)}
                        />
                        <span className="amount-currency-suffix">تومان</span>
                      </div>
                      {discountAmount && Number(discountAmount) > 0 && (
                        <span className="discount-badge-hint">
                          کسر تخفیف: {Number(discountAmount).toLocaleString('fa-IR')} تومان
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group-pro">
                    <label className="input-label-pro">زمان دقیق پرداخت (شمسی و ساعت):</label>
                    <div className="datetime-picker-row">
                      <div className="datetime-sub-field">
                        <FiCalendar className="dt-icon" />
                        <input
                          type="text"
                          className="dt-input"
                          placeholder="۱۴۰۳/۰۶/۲۰"
                          value={payDate}
                          onChange={(e) => setPayDate(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-now-tag"
                          onClick={() => setPayDate(getInitialJalaliDateTime().date)}
                        >
                          امروز
                        </button>
                      </div>

                      <div className="datetime-sub-field time-sub-field">
                        <FiClock className="dt-icon" />
                        <input
                          type="time"
                          className="dt-input"
                          value={payTime}
                          onChange={(e) => setPayTime(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn-now-tag"
                          onClick={() => setPayTime(getInitialJalaliDateTime().time)}
                        >
                          الان
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-group-pro">
                    <label className="input-label-pro">شیوه پرداخت:</label>
                    <div className="payment-options-row">
                      <div
                        className={`pay-option-card ${paymentMethod === 'pos' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('pos')}
                      >
                        <div className="option-icon pos-icon">
                          <FiCreditCard />
                        </div>
                        <div className="option-text">
                          <strong>دستگاه پوز (POS)</strong>
                          <small>کارتخوان آموزشگاه</small>
                        </div>
                        {paymentMethod === 'pos' && <div className="selected-check"><FiCheck /></div>}
                      </div>

                      <div
                        className={`pay-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <div className="option-icon card-icon">
                          <FiSmartphone />
                        </div>
                        <div className="option-text">
                          <strong>کارت به کارت</strong>
                          <small>فیش واریزی / پایا</small>
                        </div>
                        {paymentMethod === 'card' && <div className="selected-check"><FiCheck /></div>}
                      </div>

                      <div
                        className={`pay-option-card ${paymentMethod === 'cash' ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <div className="option-icon cash-icon">
                          <FiDollarSign />
                        </div>
                        <div className="option-text">
                          <strong>وجه نقد</strong>
                          <small>تحویل حضوری</small>
                        </div>
                        {paymentMethod === 'cash' && <div className="selected-check"><FiCheck /></div>}
                      </div>
                    </div>
                  </div>

                  <div className="form-group-pro">
                    <label className="input-label-pro">توضیحات یا شماره پیگیری (اختیاری):</label>
                    <div className="note-input-container">
                      <FiFileText className="note-icon" />
                      <input
                        type="text"
                        className="note-input-styled"
                        placeholder="مثال: شماره پیگیری ۱۲ رقمی، فیش پوز یا یادداشت..."
                        value={payNote}
                        onChange={(e) => setPayNote(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pay-modal-footer">
              <button className="btn-modern-cancel" onClick={handleClosePayModal}>
                انصراف
              </button>
              {selectedStudentForPay && (
                <button className="btn-modern-submit" onClick={handleConfirmPayment}>
  <span>{isEditMode ? 'ذخیره و اصلاح پرداختی' : 'تأیید و ثبت نهایی پرداخت'}</span>
</button>

              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= مودال جزئیات و پرونده مالی هنرجو ================= */}
      {isHistoryModalOpen && selectedStudentHistory && (
        <div className="modal-backdrop" onClick={() => setIsHistoryModalOpen(false)}>
          <div className="tuition-modal modern-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-header">
              <div className="history-user-info">
                <div className="user-big-avatar">
                  {selectedStudentHistory.student.name[0]}
                </div>
                <div>
                  <h2>{selectedStudentHistory.student.name}</h2>
                  <div className="user-chips">
                    <span className="chip">کد ملی: {selectedStudentHistory.student.nationalCode}</span>
                    <span className="chip">همراه: {selectedStudentHistory.student.phone}</span>
                    <span className="chip chip-accent">کد پرونده: {selectedStudentHistory.student.id}</span>
                  </div>
                </div>
              </div>
              <button className="btn-close-modal white-close" onClick={() => setIsHistoryModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <div className="modal-body modern-body">
              <div className="analytics-ribbon">
                <div className="ribbon-card total-courses">
                  <span className="ribbon-title">دوره‌های ثبت‌نامی</span>
                  <span className="ribbon-value">{selectedStudentHistory.courses.length} <small>دوره</small></span>
                </div>
                <div className="ribbon-card total-cost">
                  <span className="ribbon-title">مجموع کل شهریه‌ها</span>
                  <span className="ribbon-value">
                    {selectedStudentHistory.courses
                      .reduce((sum, c) => sum + c.totalFee, 0)
                      .toLocaleString('fa-IR')}
                    <small>تومان</small>
                  </span>
                </div>
                <div className="ribbon-card total-paid">
                  <span className="ribbon-title">مجموع پرداختی‌ها</span>
                  <span className="ribbon-value text-emerald">
                    {selectedStudentHistory.courses
                      .reduce((sum, c) => sum + c.paidFee, 0)
                      .toLocaleString('fa-IR')}
                    <small>تومان</small>
                  </span>
                </div>
                <div className="ribbon-card total-debt">
                  <span className="ribbon-title">کل مانده بدهکاری</span>
                  <span className="ribbon-value text-rose">
                    {selectedStudentHistory.courses
                      .reduce((sum, c) => sum + Math.max(0, c.totalFee - c.paidFee), 0)
                      .toLocaleString('fa-IR')}
                    <small>تومان</small>
                  </span>
                </div>
              </div>

              <div className="courses-timeline-section">
                <h3 className="section-title">ریز وضعیت مالی به تفکیک دوره‌ها</h3>
                <div className="course-cards-list">
                  {selectedStudentHistory.courses.map((item, idx) => {
                    const rem = Math.max(0, item.totalFee - item.paidFee);
                    const isSettled = rem === 0;
                    const percent = Math.round((item.paidFee / item.totalFee) * 100);

                    return (
                      <div key={idx} className={`course-detail-card ${isSettled ? 'settled-border' : 'debt-border'}`}>
                        <div className="course-card-top">
                          <div className="course-title-group">
                            <span className="course-index">دوره {idx + 1}</span>
                            <h4>{item.course}</h4>
                          </div>
                          <span className={`status-pill ${isSettled ? 'pill-success' : 'pill-danger'}`}>
                            {isSettled ? 'تسویه کامل' : 'دارای مانده بدهی'}
                          </span>
                        </div>

                        <div className="payment-progress-bar-container">
                          <div className="progress-bar-header">
                            <span>پیشرفت پرداخت: {percent}%</span>
                            <span>{item.paidFee.toLocaleString('fa-IR')} از {item.totalFee.toLocaleString('fa-IR')} تومان</span>
                          </div>
                          <div className="progress-track">
                            <div
                              className={`progress-fill ${isSettled ? 'fill-green' : 'fill-blue'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        <div className="course-card-footer">
                          <div className="footer-item">
                            <span>مانده بدهی:</span>
                            <strong className={rem > 0 ? 'text-rose' : 'text-emerald'}>
                              {rem > 0 ? `${rem.toLocaleString('fa-IR')} تومان` : 'تسویه شده'}
                            </strong>
                          </div>
                          <div className="footer-item">
                            <span>تاریخ آخرین واریز:</span>
                            <strong>{isSettled ? (item.lastPaymentDate || 'ثبت شده') : 'در انتظار پرداخت'}</strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="modal-footer m-2">
              <button className="btn-cancel" onClick={() => setIsHistoryModalOpen(false)}>
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
