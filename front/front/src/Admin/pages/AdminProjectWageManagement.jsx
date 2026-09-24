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
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiEye,
  FiFileText,
  FiCreditCard,
  FiUser,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiBriefcase
} from 'react-icons/fi';
import '../style/AdminProjectWageManagement.css';

// داده‌های نمونه کامل و سازگار برای دستمزد پروژه‌ها
const initialWagesData = [
  {
    id: 'WAG-101',
    projectTitle: 'توسعه بک‌اند پورتال سازمانی (Django & REST)',
    recipientName: 'مهندس رضا کریمی',
    role: 'برنامه‌نویس بک‌اند',
    phone: '09351234567',
    totalAgreedWage: 35000000,
    totalPaid: 25000000,
    balance: 10000000,
    payDate: '1404/06/12',
    payTime: '15:30',
    payMethod: 'پایا / ساتنا',
    trackingCode: 'TR-881290',
    status: 'partial', // partial: ناقص | settled: تسویه شده
    notes: 'تسویه فاز پیاده‌سازی سرویس احراز هویت و API گزارشات مالی',
    logs: [
      {
        date: '1404/06/12 15:30',
        stage: 'تحویل سرویس گزارش‌گیری',
        amount: 15000000,
        method: 'پایا',
        tracking: 'TR-881290',
        status: 'موفق'
      },
      {
        date: '1404/05/18 11:15',
        stage: 'پیش‌پرداخت شروع کدنویسی',
        amount: 10000000,
        method: 'کارت به کارت',
        tracking: 'TR-554210',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'WAG-102',
    projectTitle: 'طراحی رابط کاربری و تجربه کاربری (UI/UX Figma)',
    recipientName: 'مهندس سارا محمدی',
    role: 'طراح رابط کاربری',
    phone: '09121112233',
    totalAgreedWage: 18000000,
    totalPaid: 18000000,
    balance: 0,
    payDate: '1404/06/05',
    payTime: '10:00',
    payMethod: 'کارت به کارت',
    trackingCode: 'SH-443219',
    status: 'settled',
    notes: 'تسویه کامل پس از تحویل دیزاین سیستم و پروتوتایپ نهایی',
    logs: [
      {
        date: '1404/06/05 10:00',
        stage: 'تسویه نهایی تحویل طرح',
        amount: 18000000,
        method: 'کارت به کارت',
        tracking: 'SH-443219',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'WAG-103',
    projectTitle: 'طراحی و پیاده‌سازی مدل یادگیری عمیق (AI Model)',
    recipientName: 'دکتر علیرضا احمدی',
    role: 'متخصص هوش مصنوعی',
    phone: '09123456789',
    totalAgreedWage: 50000000,
    totalPaid: 30000000,
    balance: 20000000,
    payDate: '1404/05/28',
    payTime: '17:20',
    payMethod: 'پایا / ساتنا',
    trackingCode: 'TR-998811',
    status: 'partial',
    notes: 'حق‌الزحمه فاز اول آموزش شبکه عصبی با مجموعه داده‌های صنعتی',
    logs: [
      {
        date: '1404/05/28 17:20',
        stage: 'آموزش و آزمون مدل فاز اول',
        amount: 30000000,
        method: 'پایا',
        tracking: 'TR-998811',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'WAG-104',
    projectTitle: 'بهینه‌سازی سئو و بازنویسی متون لندینگ پیج‌ها',
    recipientName: 'استاد مریم حسینی',
    role: 'کارشناس سئو و محتوا',
    phone: '09901234567',
    totalAgreedWage: 12000000,
    totalPaid: 12000000,
    balance: 0,
    payDate: '1404/04/22',
    payTime: '12:45',
    payMethod: 'واریز به حساب',
    trackingCode: 'TR-110098',
    status: 'settled',
    notes: 'تسویه نهایی پس از ایندکس صفحات و گزارش سرچ‌کنسول',
    logs: [
      {
        date: '1404/04/22 12:45',
        stage: 'تسویه کامل پروژه سئو',
        amount: 12000000,
        method: 'واریز به حساب',
        tracking: 'TR-110098',
        status: 'موفق'
      }
    ]
  }
];

export default function AdminProjectWageManagement({ onBack }) {
  const [wages, setWages] = useState(initialWagesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // استیت‌های مودال فرم (ثبت / ویرایش)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingWage, setEditingWage] = useState(null);

  // استیت مودال مشاهده جزئیات
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedWage, setSelectedWage] = useState(null);

  // استیت مودال تایید حذف فیزیکی
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wageToDelete, setWageToDelete] = useState(null);

  // استیت فیلدهای فرم ثبت / ویرایش دستمزد
  const [formData, setFormData] = useState({
    projectTitle: '',
    recipientName: '',
    totalAgreedWage: '',
    paidAmount: '',
    payDate: new Date().toLocaleDateString('fa-IR'),
    payTime: '14:30',
    payMethod: 'پایا / ساتنا',
    trackingCode: '',
    notes: ''
  });

  // محاسبات کارت‌های آماری
  const stats = useMemo(() => {
    const totalPaid = wages.reduce((acc, w) => acc + (w.totalPaid || 0), 0);
    const totalPending = wages.reduce((acc, w) => acc + (w.balance || 0), 0);
    const settledCount = wages.filter((w) => (w.balance || 0) === 0).length;
    const totalCount = wages.length;

    return { totalPaid, totalPending, settledCount, totalCount };
  }, [wages]);

  // فیلتر جستجو و وضعیت
  const filteredWages = useMemo(() => {
    return wages.filter((w) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        w.projectTitle.toLowerCase().includes(q) ||
        w.recipientName.toLowerCase().includes(q) ||
        (w.phone && w.phone.includes(q)) ||
        (w.trackingCode && w.trackingCode.toLowerCase().includes(q));

      const wageStatus = w.balance > 0 ? 'debtor' : 'settled';
      const matchStatus = statusFilter === 'all' || wageStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [wages, searchQuery, statusFilter]);

  const isFilterActive = searchQuery !== '' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // باز کردن مودال برای ثبت دستمزد جدید
  const handleOpenNewWageModal = () => {
    setEditingWage(null);
    setFormData({
      projectTitle: '',
      recipientName: '',
      totalAgreedWage: '',
      paidAmount: '',
      payDate: new Date().toLocaleDateString('fa-IR'),
      payTime: '14:30',
      payMethod: 'پایا / ساتنا',
      trackingCode: '',
      notes: ''
    });
    setIsFormModalOpen(true);
  };

  // باز کردن مودال برای ویرایش
  const handleOpenEditModal = (wage) => {
    setEditingWage(wage);
    setFormData({
      projectTitle: wage.projectTitle,
      recipientName: wage.recipientName,
      totalAgreedWage: wage.totalAgreedWage || '',
      paidAmount: wage.totalPaid || '',
      payDate: wage.payDate || new Date().toLocaleDateString('fa-IR'),
      payTime: wage.payTime || '14:30',
      payMethod: wage.payMethod || 'پایا / ساتنا',
      trackingCode: wage.trackingCode || '',
      notes: wage.notes || ''
    });
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingWage(null);
  };

  // مودال جزئیات
  const handleOpenDetailsModal = (wage) => {
    setSelectedWage(wage);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedWage(null);
  };

  // مودال حذف فیزیکی
  const handleOpenDeleteModal = (wage) => {
    setWageToDelete(wage);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setWageToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!wageToDelete) return;
    setWages((prev) => prev.filter((w) => w.id !== wageToDelete.id));
    handleCloseDeleteModal();
  };

  // ثبت و ذخیره فرم (افزودن یا ویرایش)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.projectTitle || !formData.recipientName || !formData.paidAmount) {
      alert('لطفاً فیلدهای ستاره‌دار (عنوان پروژه، دریافت‌کننده و مبلغ پرداختی) را تکمیل نمایید.');
      return;
    }

    const paidNum = Number(formData.paidAmount) || 0;
    const agreedNum = Number(formData.totalAgreedWage) || paidNum;
    const calculatedBalance = Math.max(agreedNum - paidNum, 0);

    if (editingWage) {
      // ویرایش رکورد قبلی
      setWages((prev) =>
        prev.map((item) => {
          if (item.id !== editingWage.id) return item;
          return {
            ...item,
            projectTitle: formData.projectTitle,
            recipientName: formData.recipientName,
            totalAgreedWage: agreedNum,
            totalPaid: paidNum,
            balance: calculatedBalance,
            payDate: formData.payDate,
            payTime: formData.payTime,
            payMethod: formData.payMethod,
            trackingCode: formData.trackingCode,
            status: calculatedBalance === 0 ? 'settled' : 'partial',
            notes: formData.notes
          };
        })
      );
    } else {
      // ایجاد رکورد جدید
      const newWageId = `WAG-${Date.now().toString().slice(-4)}`;
      const newRecord = {
        id: newWageId,
        projectTitle: formData.projectTitle,
        recipientName: formData.recipientName,
        role: 'مجری / پیمانکار پروژه',
        phone: '---',
        totalAgreedWage: agreedNum,
        totalPaid: paidNum,
        balance: calculatedBalance,
        payDate: formData.payDate,
        payTime: formData.payTime,
        payMethod: formData.payMethod,
        trackingCode: formData.trackingCode,
        status: calculatedBalance === 0 ? 'settled' : 'partial',
        notes: formData.notes,
        logs: [
          {
            date: `${formData.payDate} ${formData.payTime}`,
            stage: 'ثبت دستمزد پروژه',
            amount: paidNum,
            method: formData.payMethod,
            tracking: formData.trackingCode || 'ثبت دستی دستمزد',
            status: 'موفق'
          }
        ]
      };
      setWages((prev) => [newRecord, ...prev]);
    }

    handleCloseFormModal();
  };

  return (
    <div className="page-wrapper">
      {/* هدر صفحه */}
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
            <h1 className="admin-page-title">مدیریت و پرداخت دستمزد پروژه‌ها</h1>
            <p className="admin-page-subtitle">
              رسیدگی به حق‌الزحمه فریلنسرها، برنامه‌نویسان و تسویه‌حساب مجریان پروژه‌ها
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button className="admin-btn-primary" onClick={handleOpenNewWageModal}>
            <FiPlus size={18} />
            <span>ثبت دستمزد جدید</span>
          </button>
        </div>
      </header>

      {/* بخش آمارها (KPI Cards) */}
      <div className="admin-stats-grid">
        {[
          {
            title: 'مجموع دستمزدهای پرداختی',
            val: stats.totalPaid.toLocaleString(),
            unit: 'تومان',
            icon: <FiCheckCircle size={24} />,
            color: '#10b981',
            trend: 'تسویه‌شده با مجریان',
            isPositive: true
          },
          {
            title: 'مانده تعهدات دستمزد (معوق)',
            val: stats.totalPending.toLocaleString(),
            unit: 'تومان',
            icon: <FiAlertCircle size={24} />,
            color: '#ef4444',
            trend: 'در انتظار پرداخت نهایی',
            isPositive: false
          },
          {
            title: 'پروژه‌های کاملاً تسویه‌شده',
            val: stats.settledCount,
            unit: 'مورد',
            icon: <FiDollarSign size={24} />,
            color: '#3b82f6',
            trend: 'تسویه کامل این دوره',
            isPositive: true
          },
          {
            title: 'کل پرونده‌های فعال دستمزد',
            val: stats.totalCount,
            unit: 'مورد',
            icon: <FiBriefcase size={24} />,
            color: '#6366f1',
            trend: 'پروژه‌های در حال اقدام',
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

      {/* بخش کارت جدول و فیلترها */}
      <section className="modern-table-card">
        {/* نوار فیلترها و جستجو */}
        <section className="tuition-filters-card">
          <div className="filter-input-group search-box">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="جستجوی عنوان پروژه، دریافت‌کننده، شماره تماس یا کد پیگیری..."
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
            {/* فیلتر وضعیت تسویه */}
            <div className="filter-input-group select-box">
              <FiFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="settled">تسویه کامل شده</option>
                <option value="debtor">دارای مانده طلبکاری</option>
              </select>
            </div>

            {/* دکمه بازنشانی هوشمند فیلترها */}
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

        {/* جدول اصلی دستمزدها */}
        <div className="table-responsive">
          <table className="admin-modern-table">
            <thead>
              <tr>
                <th>پروژه و عنوان قرارداد</th>
                <th>دریافت‌کننده (مجری / همکار)</th>
                <th>کل دستمزد توافقی</th>
                <th>مبلغ پرداخت‌شده</th>
                <th>طلب معوق مجری</th>
                <th>روش و تاریخ پرداخت</th>
                <th>وضعیت حساب</th>
                <th style={{ textAlign: 'center' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredWages.map((wage) => (
                <tr key={wage.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="profile-avatar project-avatar">
                        <FiBriefcase size={18} />
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">{wage.projectTitle}</span>
                        <span className="profile-sub">
                          شناسه: {wage.id} | کد: {wage.trackingCode || '---'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="user-profile-cell">
                      <div className="profile-avatar">{wage.recipientName[0]}</div>
                      <div className="profile-info">
                        <span className="profile-name">{wage.recipientName}</span>
                        <span className="profile-sub">{wage.role || 'همکار پروژه'}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <strong>{(wage.totalAgreedWage || 0).toLocaleString()}</strong> تومان
                  </td>

                  <td>
                    <span className="paid-wage-text">
                      {(wage.totalPaid || 0).toLocaleString()} تومان
                    </span>
                  </td>

                  <td>
                    <strong className={wage.balance > 0 ? 'debt-text' : 'settled-text'}>
                      {(wage.balance || 0).toLocaleString()} تومان
                    </strong>
                  </td>

                  <td>
                    <div className="payment-meta-cell">
                      <span>{wage.payMethod}</span>
                      <small className="date-badge">{wage.payDate}</small>
                    </div>
                  </td>

                  <td>
                    {wage.balance > 0 ? (
                      <span className="status-pill warning">
                        <FiAlertCircle size={12} /> در انتظار تسویه
                      </span>
                    ) : (
                      <span className="status-pill success">
                        <FiCheckCircle size={12} /> تسویه شده
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="table-action-buttons">
                      {/* دکمه مشاهده جزئیات */}
                      <button
                        className="table-btn-details"
                        title="مشاهده جزئیات کامل پرداخت دستمزد"
                        onClick={() => handleOpenDetailsModal(wage)}
                      >
                        <FiEye size={15} />
                        <span>جزئیات</span>
                      </button>

                      {/* دکمه ویرایش */}
                      <button
                        className="table-btn-edit"
                        title="ویرایش اطلاعات دستمزد"
                        onClick={() => handleOpenEditModal(wage)}
                      >
                        <FiEdit size={15} />
                        <span>ویرایش</span>
                      </button>

                      {/* دکمه حذف فیزیکی */}
                      <button
                        className="table-btn-delete"
                        title="حذف کامل این رکورد"
                        onClick={() => handleOpenDeleteModal(wage)}
                      >
                        <FiTrash2 size={15} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredWages.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '28px' }}>
                    موردی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== مودال ثبت و ویرایش دستمزد ===================== */}
      {isFormModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleCloseFormModal}>
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
                  <h3>{editingWage ? 'ویرایش دستمزد پروژه' : 'ثبت دستمزد جدید پروژه'}</h3>
                  <p className="modal-subtitle">
                    ثبت مشخصات پروژه، مجری، مبالغ پرداختی، روش واریز و اسناد پیگیری
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseFormModal}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="admin-modal-body">
                {/* عنوان پروژه */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiBriefcase /> عنوان پروژه <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="modal-form-input"
                    placeholder="مثال: توسعه اپلیکیشن موبایل، طراحی سایت سازمانی..."
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTitle: e.target.value })
                    }
                  />
                </div>

                {/* دریافت‌کننده */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiUser /> دریافت‌کننده (نام مجری یا همکار){' '}
                    <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="modal-form-input"
                    placeholder="مثال: مهندس رضا کریمی، شرکت طراحان آینده..."
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                  />
                </div>

                {/* مبالغ: کل دستمزد توافقی و مبلغ پرداختی */}
                <div className="form-row-2">
                  <div className="form-group-block">
                    <label className="field-label">کل دستمزد توافقی پروژه (تومان)</label>
                    <div className="amount-input-box">
                      <input
                        type="number"
                        className="modal-form-input"
                        placeholder="اختیاری - کل مبلغ قرارداد"
                        value={formData.totalAgreedWage}
                        onChange={(e) =>
                          setFormData({ ...formData, totalAgreedWage: e.target.value })
                        }
                      />
                      <span className="currency-tag">تومان</span>
                    </div>
                  </div>

                  <div className="form-group-block highlighted-amount">
                    <label className="field-label">
                      مبلغ پرداختی (تومان) <span className="req-star">*</span>
                    </label>
                    <div className="amount-input-box">
                      <input
                        type="number"
                        required
                        className="modal-form-input bold-amount"
                        placeholder="مبلغ واریزی"
                        value={formData.paidAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, paidAmount: e.target.value })
                        }
                      />
                      <span className="currency-tag">تومان</span>
                    </div>
                  </div>
                </div>

                {/* تاریخ پرداخت شمسی، ساعت و روش پرداخت */}
                <div className="form-row-3">
                  <div className="form-group-block">
                    <label className="field-label">
                      <FiCalendar /> تاریخ پرداخت (تقویم فارسی)
                    </label>
                    <input
                      type="text"
                      className="modal-form-input text-center"
                      value={formData.payDate}
                      placeholder="۱۴۰۴/۰۶/۲۰"
                      onChange={(e) =>
                        setFormData({ ...formData, payDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">
                      <FiClock /> ساعت
                    </label>
                    <input
                      type="time"
                      className="modal-form-input text-center"
                      value={formData.payTime}
                      onChange={(e) =>
                        setFormData({ ...formData, payTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">روش پرداخت</label>
                    <select
                      className="modal-form-select"
                      value={formData.payMethod}
                      onChange={(e) =>
                        setFormData({ ...formData, payMethod: e.target.value })
                      }
                    >
                      <option value="پایا / ساتنا">پایا / ساتنا (حواله بانکی)</option>
                      <option value="کارت به کارت">کارت به کارت</option>
                      <option value="واریز مستقیم به حساب">واریز مستقیم به حساب</option>
                      <option value="چک صیادی">چک صیادی</option>
                      <option value="نقدی">پرداخت نقدی</option>
                    </select>
                  </div>
                </div>

                {/* شماره پیگیری */}
                <div className="form-group-block">
                  <label className="field-label">شماره پیگیری / شماره شبا / سند</label>
                  <input
                    type="text"
                    className="modal-form-input"
                    placeholder="مثال: TR-998124 یا شماره ارجاع شتاب"
                    value={formData.trackingCode}
                    onChange={(e) =>
                      setFormData({ ...formData, trackingCode: e.target.value })
                    }
                  />
                </div>

                {/* توضیحات */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiFileText /> توضیحات
                  </label>
                  <textarea
                    className="modal-form-textarea"
                    rows={2}
                    placeholder="بابت تسویه فاز، نام ماژول توسعه داده‌شده، پیشرفت کار و توضیحات سند..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={handleCloseFormModal}
                >
                  انصراف
                </button>
                <button type="submit" className="admin-btn-primary">
                  <FiCheckCircle />{' '}
                  {editingWage ? 'ذخیره تغییرات' : 'ثبت قطعی پرداخت دستمزد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== مودال مشاهده جزئیات ===================== */}
      {isDetailsModalOpen && selectedWage && (
        <div className="admin-modal-backdrop" onClick={handleCloseDetailsModal}>
          <div
            className="admin-modal-card details-history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <div className="teacher-avatar-large project-avatar-large">
                  <FiBriefcase size={24} />
                </div>
                <div>
                  <h3>پرونده دستمزد: {selectedWage.projectTitle}</h3>
                  <p className="modal-subtitle">
                    دریافت‌کننده: {selectedWage.recipientName} ({selectedWage.role || 'مجری پروژه'})
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
                  <span>کل دستمزد توافقی:</span>
                  <strong>
                    {(selectedWage.totalAgreedWage || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>مجموع پرداختی تا کنون:</span>
                  <strong style={{ color: '#10b981' }}>
                    {(selectedWage.totalPaid || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>مانده معوقه مجری:</span>
                  <strong className={selectedWage.balance > 0 ? 'text-warning' : ''}>
                    {(selectedWage.balance || 0).toLocaleString()} تومان
                  </strong>
                </div>
              </div>

              <div className="project-detail-meta-box">
                <p>
                  <strong>روش پرداخت:</strong> {selectedWage.payMethod}
                </p>
                <p>
                  <strong>شماره پیگیری:</strong> {selectedWage.trackingCode || 'ثبت نشده'}
                </p>
                <p>
                  <strong>تاریخ آخرین پرداخت:</strong> {selectedWage.payDate} - ساعت {selectedWage.payTime}
                </p>
                {selectedWage.notes && (
                  <p>
                    <strong>توضیحات:</strong> {selectedWage.notes}
                  </p>
                )}
              </div>

              <h4 className="section-mini-title">
                <FiFileText /> سوابق پرداختی و واریزهای این دستمزد
              </h4>

              <div className="history-table-container">
                <table className="modern-history-table">
                  <thead>
                    <tr>
                      <th>تاریخ و ساعت</th>
                      <th>مرحله / بابت</th>
                      <th>روش واریز</th>
                      <th>مبلغ پرداختی</th>
                      <th>شماره پیگیری</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedWage.logs || []).map((log, idx) => (
                      <tr key={idx}>
                        <td>
                          <span className="date-badge">{log.date}</span>
                        </td>
                        <td>
                          <strong>{log.stage}</strong>
                        </td>
                        <td>{log.method}</td>
                        <td className="amount-col">
                          {log.amount.toLocaleString()} تومان
                        </td>
                        <td className="note-col">{log.tracking}</td>
                        <td>
                          <span className="status-pill success">{log.status}</span>
                        </td>
                      </tr>
                    ))}

                    {(!selectedWage.logs || selectedWage.logs.length === 0) && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>
                          سابقه پرداخت تفکیکی دیگری ثبت نشده است.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn-secondary"
                onClick={handleCloseDetailsModal}
              >
                بستن
              </button>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  handleCloseDetailsModal();
                  handleOpenEditModal(selectedWage);
                }}
              >
                <FiEdit /> ویرایش این دستمزد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== مودال تایید حذف فیزیکی ===================== */}
      {isDeleteModalOpen && wageToDelete && (
        <div className="admin-modal-backdrop" onClick={handleCloseDeleteModal}>
          <div
            className="admin-modal-card confirm-delete-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            <div className="admin-modal-header" style={{ borderBottomColor: '#fee2e2' }}>
              <div className="modal-title-wrap">
                <span
                  className="modal-icon-badge"
                  style={{ background: '#fef2f2', color: '#ef4444' }}
                >
                  <FiTrash2 size={20} />
                </span>
                <div>
                  <h3 style={{ color: '#b91c1c' }}>تایید حذف فیزیکی دستمزد</h3>
                  <p className="modal-subtitle">این عملیات غیرقابل بازگشت است</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDeleteModal}>
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: '20px 0' }}>
              <p style={{ lineHeight: '1.7', color: '#334155', fontSize: '0.95rem' }}>
                آیا از حذف کامل و فیزیکی دستمزد پروژه{' '}
                <strong>«{wageToDelete.projectTitle}»</strong> به نام دریافت‌کننده{' '}
                <strong>«{wageToDelete.recipientName}»</strong> به مبلغ{' '}
                <strong style={{ color: '#ef4444' }}>
                  {(wageToDelete.totalPaid || 0).toLocaleString()} تومان
                </strong>{' '}
                اطمینان دارید؟
              </p>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={handleCloseDeleteModal}>
                انصراف
              </button>
              <button
                className="admin-btn-primary"
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                onClick={handleConfirmDelete}
              >
                <FiTrash2 /> حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
