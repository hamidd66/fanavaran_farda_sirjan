import React, { useMemo, useState } from 'react';
import {
  FiArrowRight,
  FiSearch,
  FiPlus,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiX,
  FiRotateCcw,
  FiEye,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiFilter,
  FiTag,
  FiEdit2,
  FiTrash2,
  FiLayers,
  FiShoppingBag
} from 'react-icons/fi';
import '../style/AdminExpenseManagement.css';

// دسته‌بندی‌های استاندارد هزینه‌های آموزشگاه
const EXPENSE_CATEGORIES = [
  'اجاره و رهن ساختمان',
  'قبوض و انرژی (برق، آب، گاز)',
  'اینترنت و تجهیزات شبکه',
  'تجهیزات و سخت‌افزار کارگاه',
  'تبلیغات و مارکتینگ',
  'پذیرایی و ملزومات مصرفی',
  'نرم‌افزار، لایسنس و اشتراک‌ها',
  'تعمیرات و نگهداری',
  'متفرقه و امور اداری'
];

const PAYMENT_METHODS = [
  'انتقال پایا / ساتنا',
  'کارت به کارت',
  'کارت‌خوان (POS)',
  'نقدی',
  'چک صیادی'
];

// داده‌های اولیه نمونه
const initialExpensesData = [
  {
    id: 'EXP-101',
    title: 'خرید ۵ عدد مانیتور و رم برای کارگاه AI',
    category: 'تجهیزات و سخت‌افزار کارگاه',
    amount: 38500000,
    date: '1404/06/15',
    time: '11:30',
    paymentMethod: 'انتقال پایا / ساتنا',
    trackingCode: 'TR-8812903',
    status: 'paid',
    payer: 'مدیریت - حمید پورفریدونی',
    description: 'ارتقای سیستم‌های سایت تخصصی برنامه‌نویسی و یادگیری ماشین.'
  },
  {
    id: 'EXP-102',
    title: 'تمدید اینترنت فیبر نوری اختصاصی ۶ ماهه',
    category: 'اینترنت و تجهیزات شبکه',
    amount: 7200000,
    date: '1404/06/10',
    time: '16:45',
    paymentMethod: 'کارت به کارت',
    trackingCode: 'TR-443211',
    status: 'paid',
    payer: 'مسئول IT',
    description: 'اینترنت اختصاصی با پهنای باند اختصاصی جهت وبینارها و آپلود.'
  },
  {
    id: 'EXP-103',
    title: 'کمپین تبلیغاتی تابستانه در اینستاگرام و استند شهری',
    category: 'تبلیغات و مارکتینگ',
    amount: 14500000,
    date: '1404/06/02',
    time: '10:00',
    paymentMethod: 'انتقال پایا / ساتنا',
    trackingCode: 'TR-990812',
    status: 'paid',
    payer: 'واحد مارکتینگ',
    description: 'کمپین ثبت‌نام دوره‌های تخصصی پایتون و طراحی وب.'
  },
  {
    id: 'EXP-104',
    title: 'شارژ پذیرایی، چای، نسکافه و لوازم بهداشتی',
    category: 'پذیرایی و ملزومات مصرفی',
    amount: 3400000,
    date: '1404/05/28',
    time: '18:20',
    paymentMethod: 'کارت‌خوان (POS)',
    trackingCode: 'POS-77610',
    status: 'paid',
    payer: 'امور دفتری',
    description: 'خرید اقلام مصرفی پذیرایی اساتید و هنرجویان آموزشگاه.'
  },
  {
    id: 'EXP-105',
    title: 'سرویس دوره‌ای کولرهای گازی و تأسیسات سایت',
    category: 'تعمیرات و نگهداری',
    amount: 4800000,
    date: '1404/05/18',
    time: '14:00',
    paymentMethod: 'کارت به کارت',
    trackingCode: 'TR-10293',
    status: 'paid',
    payer: 'پشتیبانی',
    description: 'سرویس و شستشوی پنل‌های برودتی کلاس‌های آموزشگاه.'
  }
];

export default function AdminExpenseManagement({ onBack }) {
  const [expenses, setExpenses] = useState(initialExpensesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

  // استیت‌های مودال‌ها
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // داده رکورد انتخابی
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // استیت‌های فرم ثبت / ویرایش هزینه
  const [formData, setFormData] = useState({
    title: '',
    category: EXPENSE_CATEGORIES[0],
    amount: '',
    date: new Date().toLocaleDateString('fa-IR'),
    paymentMethod: PAYMENT_METHODS[0],
    trackingCode: '',
    description: ''
  });

  // محاسبات شاخص‌های مالی (KPI)
  const stats = useMemo(() => {
    const totalAmount = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const categoryCounts = {};
    expenses.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + Number(e.amount);
    });

    let topCategory = '---';
    let maxVal = 0;
    Object.entries(categoryCounts).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCategory = cat;
      }
    });

    const hardwareTechCost = expenses
      .filter((e) => e.category.includes('تجهیزات') || e.category.includes('اینترنت'))
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      totalAmount,
      count: expenses.length,
      topCategory,
      hardwareTechCost
    };
  }, [expenses]);

  // فیلتر کردن لیست هزینه‌ها
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.trackingCode?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const matchCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      const matchMethod =
        paymentMethodFilter === 'all' || item.paymentMethod === paymentMethodFilter;

      return matchSearch && matchCategory && matchMethod;
    });
  }, [expenses, searchQuery, categoryFilter, paymentMethodFilter]);

  const isFilterActive =
    searchQuery !== '' || categoryFilter !== 'all' || paymentMethodFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPaymentMethodFilter('all');
  };

  // باز کردن مودال ثبت جدید
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedExpense(null);
    setFormData({
      title: '',
      category: EXPENSE_CATEGORIES[0],
      amount: '',
      date: new Date().toLocaleDateString('fa-IR'),
      paymentMethod: PAYMENT_METHODS[0],
      trackingCode: '',
      description: ''
    });
    setIsFormModalOpen(true);
  };

  // باز کردن مودال ویرایش
  const handleOpenEditModal = (expense) => {
    setIsEditMode(true);
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      trackingCode: expense.trackingCode || '',
      description: expense.description || ''
    });
    setIsFormModalOpen(true);
  };

  // باز کردن مودال جزئیات
  const handleOpenDetailsModal = (expense) => {
    setSelectedExpense(expense);
    setIsDetailsModalOpen(true);
  };

  // باز کردن تایید حذف فیزیکی
  const handleOpenDeleteModal = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteModalOpen(true);
  };

  // ذخیره فرم (ثبت یا آپدیت)
  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;

    if (isEditMode && selectedExpense) {
      // ویرایش هزینه
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === selectedExpense.id
            ? {
                ...item,
                ...formData,
                amount: Number(formData.amount)
              }
            : item
        )
      );
    } else {
      // ثبت هزینه جدید
      const newExpense = {
        id: `EXP-${Date.now().toString().slice(-4)}`,
        ...formData,
        amount: Number(formData.amount),
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        status: 'paid',
        payer: 'مدیریت آموزشگاه'
      };
      setExpenses([newExpense, ...expenses]);
    }

    setIsFormModalOpen(false);
  };

  // حذف فیزیکی هزینه از لیست
  const handleConfirmDelete = () => {
    if (!selectedExpense) return;
    setExpenses((prev) => prev.filter((item) => item.id !== selectedExpense.id));
    setIsDeleteModalOpen(false);
    setSelectedExpense(null);
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
            <h1 className="admin-page-title">مدیریت و ثبت هزینه‌های آموزشگاه</h1>
            <p className="admin-page-subtitle">
              رسیدگی به تنخواه‌گردان، قبوض، سخت‌افزار، ملزومات و مصارف موسسه
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button className="admin-btn-primary" onClick={handleOpenAddModal}>
            <FiPlus size={18} />
            <span>ثبت هزینه جدید</span>
          </button>
        </div>
      </header>

      {/* کارت‌های آماری شاخص (KPI Cards) */}
      <div className="admin-stats-grid">
        {[
          {
            title: 'مجموع کل هزینه‌های ثبت‌شده',
            val: stats.totalAmount.toLocaleString(),
            unit: 'تومان',
            icon: <FiDollarSign size={24} />,
            color: '#ef4444',
            trend: 'صرف شده در این دوره',
            isPositive: false
          },
          {
            title: 'تعداد کل اسناد و فاکتورها',
            val: stats.count,
            unit: 'فقره سند',
            icon: <FiFileText size={24} />,
            color: '#3b82f6',
            trend: 'فاکتورهای پرداخت‌شده',
            isPositive: true
          },
          {
            title: 'بیشترین سهم مصارف',
            val: stats.topCategory,
            unit: '',
            icon: <FiTag size={24} />,
            color: '#8b5cf6',
            trend: 'بزرگترین سرفصل مخارج',
            isPositive: false
          },
          {
            title: 'توسعه فنی و شبکه و سخت‌افزار',
            val: stats.hardwareTechCost.toLocaleString(),
            unit: 'تومان',
            icon: <FiShoppingBag size={24} />,
            color: '#10b981',
            trend: 'سرمایه‌گذاری روی تجهیزات',
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

      {/* بخش جدول و فیلترها */}
      <section className="modern-table-card">
        {/* فیلترهای یکپارچه */}
        <section className="tuition-filters-card">
          <div className="filter-input-group search-box">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="جستجو بر اساس عنوان، کد پیگیری یا توضیحات سند..."
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
            {/* فیلتر دسته‌بندی */}
            <div className="filter-input-group select-box">
              <FiTag className="filter-icon" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">همه سرفصل‌ها</option>
                {EXPENSE_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* فیلتر روش پرداخت */}
            <div className="filter-input-group select-box">
              <FiCreditCard className="filter-icon" />
              <select
                value={paymentMethodFilter}
                onChange={(e) => setPaymentMethodFilter(e.target.value)}
              >
                <option value="all">همه روش‌های پرداخت</option>
                {PAYMENT_METHODS.map((m, idx) => (
                  <option key={idx} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* دکمه بازنشانی هوشمند فیلتر */}
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

        {/* جدول داده‌ها */}
        <div className="table-responsive">
          <table className="admin-modern-table">
            <thead>
              <tr>
                <th>عنوان و شرح هزینه</th>
                <th>سرفصل / دسته‌بندی</th>
                <th>مبلغ هزینه</th>
                <th>تاریخ پرداخت</th>
                <th>روش پرداخت و پیگیری</th>
                <th style={{ textAlign: 'center' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="profile-avatar expense-avatar">
                        <FiTag />
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">{expense.title}</span>
                        <span className="profile-sub">
                          {expense.id} {expense.description ? `| ${expense.description.slice(0, 35)}...` : ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="badge-tag-wrap">
                      <span className="badge-tag category-badge">{expense.category}</span>
                    </div>
                  </td>

                  <td>
                    <strong className="expense-amount-text">
                      {expense.amount.toLocaleString()} تومان
                    </strong>
                  </td>

                  <td>
                    <span className="date-badge">
                      <FiCalendar size={12} /> {expense.date}
                    </span>
                  </td>

                  <td>
                    <div className="payment-method-cell">
                      <span>{expense.paymentMethod}</span>
                      <small className="tracking-sub">{expense.trackingCode || 'بدون کد پیگیری'}</small>
                    </div>
                  </td>

                  <td>
                    <div className="table-action-buttons">
                      <button
                        className="table-btn-details"
                        title="مشاهده جزئیات کامل سند"
                        onClick={() => handleOpenDetailsModal(expense)}
                      >
                        <FiEye size={15} />
                        <span>جزئیات</span>
                      </button>

                      <button
                        className="table-btn-edit"
                        title="ویرایش هزینه"
                        onClick={() => handleOpenEditModal(expense)}
                      >
                        <FiEdit2 size={15} />
                        <span>ویرایش</span>
                      </button>

                      <button
                        className="table-btn-delete"
                        title="حذف دائمی سند"
                        onClick={() => handleOpenDeleteModal(expense)}
                      >
                        <FiTrash2 size={15} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    <div style={{ color: '#94a3b8', fontSize: '15px' }}>
                      هیچ سند هزینه‌ای با فیلترهای کنونی یافت نشد.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ۱. مودال ثبت / ویرایش هزینه جدید */}
      {isFormModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsFormModalOpen(false)}>
          <div
            className="admin-modal-card modern-pay-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-icon-badge">
                  {isEditMode ? <FiEdit2 size={20} /> : <FiPlus size={20} />}
                </span>
                <div>
                  <h3>{isEditMode ? 'ویرایش سند هزینه' : 'ثبت هزینه جدید آموزشگاه'}</h3>
                  <p className="modal-subtitle">
                    ثبت مشخصات فاکتور، دسته‌بندی مخارج و مشخصات سند پرداختی
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsFormModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveExpense}>
              <div className="admin-modal-body">
                {/* ردیف ۱: دسته‌بندی و عنوان هزینه */}
                <div className="form-row-2">
                  <div className="form-group-block">
                    <label className="field-label">
                      <FiLayers /> دسته‌بندی هزینه
                    </label>
                    <select
                      className="modal-form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {EXPENSE_CATEGORIES.map((cat, i) => (
                        <option key={i} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">
                      <FiTag /> عنوان دقیق هزینه
                    </label>
                    <input
                      type="text"
                      className="modal-form-input"
                      placeholder="مثال: خرید ملزومات چای و پذیرایی یا تجهیزات سرور"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* ردیف ۲: مبلغ، تاریخ و روش پرداخت */}
                <div className="form-row-3">
                  <div className="form-group-block highlighted-amount">
                    <label className="field-label">مبلغ هزینه (تومان)</label>
                    <div className="amount-input-box">
                      <input
                        type="number"
                        className="modal-form-input bold-amount"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                      <span className="currency-tag">تومان</span>
                    </div>
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">
                      <FiCalendar /> تاریخ هزینه (شمسی)
                    </label>
                    <input
                      type="text"
                      className="modal-form-input text-center"
                      value={formData.date}
                      placeholder="۱۴۰۴/۰۶/۲۰"
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">
                      <FiCreditCard /> روش پرداخت
                    </label>
                    <select
                      className="modal-form-select"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      {PAYMENT_METHODS.map((method, i) => (
                        <option key={i} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ردیف ۳: کد پیگیری */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiCheckCircle /> شماره سند / کد رهگیری تراکنش (اختیاری)
                  </label>
                  <input
                    type="text"
                    className="modal-form-input"
                    placeholder="مثال: پایا شماره TR-882103 یا شماره پیگیری فاکتور"
                    value={formData.trackingCode}
                    onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                  />
                </div>

                {/* ردیف ۴: توضیحات کامل */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiFileText /> توضیحات و جزئیات تکمیلی هزینه
                  </label>
                  <textarea
                    className="modal-form-textarea"
                    rows={3}
                    placeholder="توضیحات بیشتر در خصوص ضرورت خرید، نام فروشگاه یا تأمین‌کننده..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="admin-btn-primary">
                  <FiCheckCircle />
                  {isEditMode ? 'ذخیره تغییرات سند' : 'ثبت نهایی هزینه'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۲. مودال مشاهده جزئیات هزینه */}
      {isDetailsModalOpen && selectedExpense && (
        <div className="admin-modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
          <div
            className="admin-modal-card details-history-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <div className="teacher-avatar-large expense-icon-lg">
                  <FiFileText />
                </div>
                <div>
                  <h3>جزئیات فاکتور: {selectedExpense.title}</h3>
                  <p className="modal-subtitle">
                    شناسه سند: {selectedExpense.id} | ثبت‌شده در {selectedExpense.date}
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="teacher-summary-row">
                <div className="summary-pill-box">
                  <span>مبلغ کل پرداختی:</span>
                  <strong className="text-danger">
                    {Number(selectedExpense.amount).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>سرفصل مخارج:</span>
                  <strong>{selectedExpense.category}</strong>
                </div>
                <div className="summary-pill-box">
                  <span>روش پرداخت:</span>
                  <strong>{selectedExpense.paymentMethod}</strong>
                </div>
              </div>

              <div className="expense-details-box">
                <div className="detail-item-grid">
                  <div>
                    <label>شماره پیگیری / ارجاع:</label>
                    <span>{selectedExpense.trackingCode || 'ثبت نشده'}</span>
                  </div>
                  <div>
                    <label>پرداخت‌کننده / متصدی:</label>
                    <span>{selectedExpense.payer || 'مدیریت'}</span>
                  </div>
                  <div>
                    <label>تاریخ و ساعت:</label>
                    <span>{selectedExpense.date} {selectedExpense.time ? `(ساعت ${selectedExpense.time})` : ''}</span>
                  </div>
                  <div>
                    <label>وضعیت سند:</label>
                    <span className="status-pill success">
                      <FiCheckCircle /> تسویه شده
                    </span>
                  </div>
                </div>

                <div className="detail-description-block">
                  <label>شرح کامل هزینه:</label>
                  <p>{selectedExpense.description || 'توضیحات بیشتری برای این سند درج نشده است.'}</p>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn-secondary"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                بستن
              </button>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  handleOpenEditModal(selectedExpense);
                }}
              >
                <FiEdit2 /> ویرایش این فاکتور
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ۳. مودال تایید حذف فیزیکی */}
      {isDeleteModalOpen && selectedExpense && (
        <div className="admin-modal-backdrop" onClick={() => setIsDeleteModalOpen(false)}>
          <div
            className="admin-modal-card delete-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header delete-header">
              <div className="modal-title-wrap">
                <span className="modal-icon-badge danger">
                  <FiAlertCircle size={22} />
                </span>
                <div>
                  <h3 style={{ color: '#ef4444' }}>حذف فیزیکی سند هزینه</h3>
                  <p className="modal-subtitle">این عملیات غیرقابل بازگشت است</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="delete-alert-text">
                آیا از حذف کامل و فیزیکی فاکتور <strong>«{selectedExpense.title}»</strong> به مبلغ{' '}
                <strong className="text-danger">
                  {Number(selectedExpense.amount).toLocaleString()} تومان
                </strong>{' '}
                اطمینان دارید؟ این رکورد برای همیشه از پایگاه داده و گزارشات مالی حذف خواهد شد.
              </p>
            </div>

            <div className="admin-modal-footer">
              <button
                className="admin-btn-secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                انصراف
              </button>
              <button
                className="admin-btn-danger"
                onClick={handleConfirmDelete}
              >
                <FiTrash2 /> بله، حذف فیزیکی شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
