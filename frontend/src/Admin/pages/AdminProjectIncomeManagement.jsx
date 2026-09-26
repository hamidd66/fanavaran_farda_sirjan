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
  FiEdit,
  FiTrash2,
  FiBriefcase,
  FiFilter,
  FiUserCheck
} from 'react-icons/fi';
import '../style/AdminProjectIncomeManagement.css';

// داده‌های اولیه نمونه برای درآمدهای پروژه
const initialProjectsData = [
  {
    id: 'PRJ-101',
    projectTitle: 'طراحی و پیاده‌سازی وب‌سایت شرکتی و پورتال مشتریان',
    payerName: 'شرکت فناوران سیرجان',
    clientType: 'corporate', // corporate: حقوقی | personal: حقیقی
    nationalId: '14008923412',
    totalContract: 65000000,
    amountReceived: 50000000,
    balance: 15000000,
    receiveDate: '1404/06/15',
    receiveTime: '11:30',
    paymentMethod: 'پایا / ساتنا',
    trackingCode: 'TR-9982341',
    status: 'partial', // partial: تسویه ناقص | completed: تسویه کامل
    description: 'قسط دوم پیشرفت پروژه به همراه تاییدیه فاز دوم تحویل بک‌اند',
    logs: [
      {
        date: '1404/06/15 11:30',
        stage: 'پیشرفت فاز ۲',
        amount: 30000000,
        method: 'پایا',
        tracking: 'TR-9982341',
        status: 'موفق'
      },
      {
        date: '1404/05/10 14:00',
        stage: 'پیش‌پرداخت اولیه قرارداد',
        amount: 20000000,
        method: 'کارت به کارت',
        tracking: 'TR-7782109',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'PRJ-102',
    projectTitle: 'توسعه اپلیکیشن موبایل فروشگاهی (React Native)',
    payerName: 'دکتر علیرضا کاظمی',
    clientType: 'personal',
    nationalId: '3071239845',
    totalContract: 48000000,
    amountReceived: 48000000,
    balance: 0,
    receiveDate: '1404/06/02',
    receiveTime: '17:45',
    paymentMethod: 'واریز به حساب',
    trackingCode: 'SH-5544321',
    status: 'completed',
    description: 'تسویه نهایی قرارداد همزمان با تحویل نسخه آزمایشی اپلیکیشن',
    logs: [
      {
        date: '1404/06/02 17:45',
        stage: 'تسویه کامل پروژه',
        amount: 48000000,
        method: 'واریز به حساب',
        tracking: 'SH-5544321',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'PRJ-103',
    projectTitle: 'پیاده‌سازی مدل یادگیری ماشین و پیش‌بینی داده‌ها',
    payerName: 'مجتمع صنایع معدنی گل‌گهر',
    clientType: 'corporate',
    nationalId: '10860124500',
    totalContract: 120000000,
    amountReceived: 70000000,
    balance: 50000000,
    receiveDate: '1404/05/25',
    receiveTime: '09:20',
    paymentMethod: 'پایا / ساتنا',
    trackingCode: 'BK-1029384',
    status: 'partial',
    description: 'قسط اول قرارداد پردازش داده و توسعه مدل هوش مصنوعی',
    logs: [
      {
        date: '1404/05/25 09:20',
        stage: 'قسط اول قرارداد',
        amount: 70000000,
        method: 'پایا',
        tracking: 'BK-1029384',
        status: 'موفق'
      }
    ]
  },
  {
    id: 'PRJ-104',
    projectTitle: 'اتوماسیون حسابداری و انبارداری اختصاصی',
    payerName: 'مهندس محمدرضا شجاعی',
    clientType: 'personal',
    nationalId: '2987654321',
    totalContract: 35000000,
    amountReceived: 35000000,
    balance: 0,
    receiveDate: '1404/04/18',
    receiveTime: '13:10',
    paymentMethod: 'کارت به کارت',
    trackingCode: 'TR-3322110',
    status: 'completed',
    description: 'تسویه حساب کامل قرارداد اتوماسیون داخلی',
    logs: [
      {
        date: '1404/04/18 13:10',
        stage: 'تسویه نهایی قرارداد',
        amount: 35000000,
        method: 'کارت به کارت',
        tracking: 'TR-3322110',
        status: 'موفق'
      }
    ]
  }
];

export default function AdminProjectIncomeManagement({ onBack }) {
  const [projects, setProjects] = useState(initialProjectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // استیت مودال ثبت/ویرایش درآمد
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // استیت مودال مشاهده جزئیات
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // استیت مودال تایید حذف فیزیکی
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // فیلدهای فرم درآمد
  const [formData, setFormData] = useState({
    projectTitle: '',
    payerName: '',
    clientType: 'corporate', // 'corporate' (حقوقی) یا 'personal' (حقیقی)
    totalContract: '',
    amountReceived: '',
    receiveDate: new Date().toLocaleDateString('fa-IR'),
    receiveTime: '12:00',
    paymentMethod: 'پایا / ساتنا',
    trackingCode: '',
    description: ''
  });

  // محاسبات کارت‌های آماری
  const stats = useMemo(() => {
    const totalReceived = projects.reduce((acc, p) => acc + (p.amountReceived || 0), 0);
    const totalPending = projects.reduce((acc, p) => acc + (p.balance || 0), 0);
    const completedCount = projects.filter((p) => (p.balance || 0) === 0).length;
    const totalCount = projects.length;

    return { totalReceived, totalPending, completedCount, totalCount };
  }, [projects]);

  // فیلتر هوشمند داده‌ها
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.projectTitle.toLowerCase().includes(q) ||
        item.payerName.toLowerCase().includes(q) ||
        (item.nationalId && item.nationalId.includes(q)) ||
        (item.trackingCode && item.trackingCode.toLowerCase().includes(q));

      const matchClient =
        clientTypeFilter === 'all' || item.clientType === clientTypeFilter;

      const projectStatus = item.balance > 0 ? 'debtor' : 'settled';
      const matchStatus =
        statusFilter === 'all' || projectStatus === statusFilter;

      return matchSearch && matchClient && matchStatus;
    });
  }, [projects, searchQuery, clientTypeFilter, statusFilter]);

  const isFilterActive =
    searchQuery !== '' || clientTypeFilter !== 'all' || statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setClientTypeFilter('all');
    setStatusFilter('all');
  };

  // باز کردن مودال برای ثبت جدید
  const handleOpenNewIncomeModal = () => {
    setEditingProject(null);
    setFormData({
      projectTitle: '',
      payerName: '',
      clientType: 'corporate',
      totalContract: '',
      amountReceived: '',
      receiveDate: new Date().toLocaleDateString('fa-IR'),
      receiveTime: '12:00',
      paymentMethod: 'پایا / ساتنا',
      trackingCode: '',
      description: ''
    });
    setIsFormModalOpen(true);
  };

  // باز کردن مودال برای ویرایش
  const handleOpenEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      projectTitle: project.projectTitle,
      payerName: project.payerName,
      clientType: project.clientType || 'corporate',
      totalContract: project.totalContract || '',
      amountReceived: project.amountReceived || '',
      receiveDate: project.receiveDate || new Date().toLocaleDateString('fa-IR'),
      receiveTime: project.receiveTime || '12:00',
      paymentMethod: project.paymentMethod || 'پایا / ساتنا',
      trackingCode: project.trackingCode || '',
      description: project.description || ''
    });
    setIsFormModalOpen(true);
  };

  // بستن مودال فرم
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProject(null);
  };

  // باز و بست مودال جزئیات
  const handleOpenDetailsModal = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProject(null);
  };

  // باز و بست مودال حذف
  const handleOpenDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  // تایید و انجام حذف فیزیکی
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
    handleCloseDeleteModal();
  };

  // ذخیره فرم (افزودن یا ویرایش)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.projectTitle || !formData.payerName || !formData.amountReceived) {
      alert('لطفاً فیلدهای ستاره‌دار (عنوان پروژه، پرداخت‌کننده و مبلغ) را کامل کنید.');
      return;
    }

    const receivedNum = Number(formData.amountReceived) || 0;
    const contractNum = Number(formData.totalContract) || receivedNum;
    const calcBalance = Math.max(contractNum - receivedNum, 0);

    if (editingProject) {
      // ویرایش پروژه موجود
      setProjects((prev) =>
        prev.map((item) => {
          if (item.id !== editingProject.id) return item;
          return {
            ...item,
            projectTitle: formData.projectTitle,
            payerName: formData.payerName,
            clientType: formData.clientType,
            totalContract: contractNum,
            amountReceived: receivedNum,
            balance: calcBalance,
            receiveDate: formData.receiveDate,
            receiveTime: formData.receiveTime,
            paymentMethod: formData.paymentMethod,
            trackingCode: formData.trackingCode,
            status: calcBalance === 0 ? 'completed' : 'partial',
            description: formData.description
          };
        })
      );
    } else {
      // ثبت پروژه و درآمد جدید
      const newId = `PRJ-${Date.now().toString().slice(-4)}`;
      const newEntry = {
        id: newId,
        projectTitle: formData.projectTitle,
        payerName: formData.payerName,
        clientType: formData.clientType,
        totalContract: contractNum,
        amountReceived: receivedNum,
        balance: calcBalance,
        receiveDate: formData.receiveDate,
        receiveTime: formData.receiveTime,
        paymentMethod: formData.paymentMethod,
        trackingCode: formData.trackingCode,
        status: calcBalance === 0 ? 'completed' : 'partial',
        description: formData.description,
        logs: [
          {
            date: `${formData.receiveDate} ${formData.receiveTime}`,
            stage: 'ثبت اولیه دریافت',
            amount: receivedNum,
            method: formData.paymentMethod,
            tracking: formData.trackingCode || 'ثبت دستی',
            status: 'موفق'
          }
        ]
      };
      setProjects((prev) => [newEntry, ...prev]);
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
            <h1 className="admin-page-title">مدیریت درآمدهای پروژه‌ها</h1>
            <p className="admin-page-subtitle">
              پیگیری قراردادها، مطالبات و ثبت وصولی‌های پروژه‌های نرم‌افزاری و صنعتی
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button className="admin-btn-primary" onClick={handleOpenNewIncomeModal}>
            <FiPlus size={18} />
            <span>ثبت درآمد جدید</span>
          </button>
        </div>
      </header>

      {/* بخش آمارها (KPI Cards) */}
      <div className="admin-stats-grid">
        {[
          {
            title: 'کل درآمدهای وصول‌شده',
            val: stats.totalReceived.toLocaleString(),
            unit: 'تومان',
            icon: <FiCheckCircle size={24} />,
            color: '#10b981',
            trend: 'درآمد نقد شده',
            isPositive: true
          },
          {
            title: 'مانده مطالبات معوق',
            val: stats.totalPending.toLocaleString(),
            unit: 'تومان',
            icon: <FiAlertCircle size={24} />,
            color: '#ef4444',
            trend: 'در انتظار تسویه مشتری',
            isPositive: false
          },
          {
            title: 'قراردادهای تسویه کامل',
            val: stats.completedCount,
            unit: 'پروژه',
            icon: <FiDollarSign size={24} />,
            color: '#3b82f6',
            trend: 'تسویه‌شده قطعی',
            isPositive: true
          },
          {
            title: 'کل پروژه‌های فعال',
            val: stats.totalCount,
            unit: 'مورد',
            icon: <FiBriefcase size={24} />,
            color: '#6366f1',
            trend: 'پروژه‌های در جریان',
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
        {/* نوار فیلترها و جستجو */}
        <section className="tuition-filters-card">
          <div className="filter-input-group search-box">
            <FiSearch className="filter-icon" />
            <input
              type="text"
              placeholder="جستجوی عنوان پروژه، کارفرما، شماره پیگیری..."
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
            {/* فیلتر نوع مشتری (حقیقی / حقوقی) */}
            <div className="filter-input-group select-box">
              <FiUserCheck className="filter-icon" />
              <select
                value={clientTypeFilter}
                onChange={(e) => setClientTypeFilter(e.target.value)}
              >
                <option value="all">همه اشخاص (حقیقی/حقوقی)</option>
                <option value="corporate">شخص حقوقی (شرکت‌ها)</option>
                <option value="personal">شخص حقیقی</option>
              </select>
            </div>

            {/* فیلتر وضعیت تسویه */}
            <div className="filter-input-group select-box">
              <FiFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="settled">تسویه کامل</option>
                <option value="debtor">دارای مانده معوق</option>
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

        {/* جدول اصلی درآمدها */}
        <div className="table-responsive">
          <table className="admin-modern-table">
            <thead>
              <tr>
                <th>پروژه و عنوان قرارداد</th>
                <th>پرداخت‌کننده / کارفرما</th>
                <th>مبلغ کل قرارداد</th>
                <th>درآمد وصول‌شده</th>
                <th>مانده معوقه</th>
                <th>روش دریافت و تاریخ</th>
                <th>وضعیت</th>
                <th style={{ textAlign: 'center' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div className="user-profile-cell">
                      <div className="profile-avatar project-avatar">
                        <FiBriefcase size={18} />
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">{project.projectTitle}</span>
                        <span className="profile-sub">
                          شناسه: {project.id} | کد رهگیری: {project.trackingCode || '---'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="badge-tag-wrap">
                      <span className="badge-tag">
                        {project.payerName}
                      </span>
                      <span
                        className={`sub-tag-type ${
                          project.clientType === 'corporate' ? 'corporate' : 'personal'
                        }`}
                      >
                        {project.clientType === 'corporate' ? 'حقوقی' : 'حقیقی'}
                      </span>
                    </div>
                  </td>

                  <td>
                    <strong>{(project.totalContract || 0).toLocaleString()}</strong> تومان
                  </td>

                  <td>
                    <span className="received-income-text">
                      {(project.amountReceived || 0).toLocaleString()} تومان
                    </span>
                  </td>

                  <td>
                    <strong className={project.balance > 0 ? 'debt-text' : 'settled-text'}>
                      {(project.balance || 0).toLocaleString()} تومان
                    </strong>
                  </td>

                  <td>
                    <div className="payment-meta-cell">
                      <span>{project.paymentMethod}</span>
                      <small className="date-badge">{project.receiveDate}</small>
                    </div>
                  </td>

                  <td>
                    {project.balance > 0 ? (
                      <span className="status-pill warning">
                        <FiAlertCircle size={12} /> دارای مانده
                      </span>
                    ) : (
                      <span className="status-pill success">
                        <FiCheckCircle size={12} /> تسویه کامل
                      </span>
                    )}
                  </td>

                  <td>
                    <div className="table-action-buttons">
                      {/* دکمه مشاهده جزئیات */}
                      <button
                        className="table-btn-details"
                        title="مشاهده جزئیات کامل درآمد"
                        onClick={() => handleOpenDetailsModal(project)}
                      >
                        <FiEye size={15} />
                        <span>جزئیات</span>
                      </button>

                      {/* دکمه ویرایش */}
                      <button
                        className="table-btn-edit"
                        title="ویرایش سند درآمد"
                        onClick={() => handleOpenEditModal(project)}
                      >
                        <FiEdit size={15} />
                        <span>ویرایش</span>
                      </button>

                      {/* دکمه حذف فیزیکی */}
                      <button
                        className="table-btn-delete"
                        title="حذف فیزیکی سند"
                        onClick={() => handleOpenDeleteModal(project)}
                      >
                        <FiTrash2 size={15} />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '28px' }}>
                    هیچ رکورد درآمدی متناسب با جستجوی شما یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== مودال ثبت / ویرایش درآمد ===================== */}
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
                  <h3>
                    {editingProject ? 'ویرایش سند درآمد پروژه' : 'ثبت درآمد جدید پروژه'}
                  </h3>
                  <p className="modal-subtitle">
                    ثبت مشخصات قرارداد، کارفرما، مبالغ وصولی و روش واریز
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseFormModal}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="admin-modal-body">
                {/* ردیف اول: عنوان پروژه */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiBriefcase /> عنوان کامل پروژه <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="modal-form-input"
                    placeholder="مثال: طراحی وب‌سایت فروشگاهی، توسعه سیستم هوش مصنوعی..."
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTitle: e.target.value })
                    }
                  />
                </div>

                {/* ردیف دوم: پرداخت‌کننده و نوع شخص (حقیقی / حقوقی) */}
                <div className="form-row-2">
                  <div className="form-group-block">
                    <label className="field-label">
                      <FiUserCheck /> پرداخت‌کننده (کارفرما / شرکت){' '}
                      <span className="req-star">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      className="modal-form-input"
                      placeholder="نام شرکت یا نام و نام خانوادگی کارفرما"
                      value={formData.payerName}
                      onChange={(e) =>
                        setFormData({ ...formData, payerName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">نوع پرداخت‌کننده</label>
                    <select
                      className="modal-form-select"
                      value={formData.clientType}
                      onChange={(e) =>
                        setFormData({ ...formData, clientType: e.target.value })
                      }
                    >
                      <option value="corporate">شخصیت حقوقی (شرکت / سازمان)</option>
                      <option value="personal">شخصیت حقیقی</option>
                    </select>
                  </div>
                </div>

                {/* ردیف سوم: مبالغ (کل قرارداد و درآمد وصول‌شده) */}
                <div className="form-row-2">
                  <div className="form-group-block">
                    <label className="field-label">مبلغ کل قرارداد (تومان)</label>
                    <div className="amount-input-box">
                      <input
                        type="number"
                        className="modal-form-input"
                        placeholder="اختیاری - کل مبلغ قرارداد"
                        value={formData.totalContract}
                        onChange={(e) =>
                          setFormData({ ...formData, totalContract: e.target.value })
                        }
                      />
                      <span className="currency-tag">تومان</span>
                    </div>
                  </div>

                  <div className="form-group-block highlighted-amount">
                    <label className="field-label">
                      مبلغ درآمد وصول‌شده (تومان) <span className="req-star">*</span>
                    </label>
                    <div className="amount-input-box">
                      <input
                        type="number"
                        required
                        className="modal-form-input bold-amount"
                        placeholder="مبلغ واریزی"
                        value={formData.amountReceived}
                        onChange={(e) =>
                          setFormData({ ...formData, amountReceived: e.target.value })
                        }
                      />
                      <span className="currency-tag">تومان</span>
                    </div>
                  </div>
                </div>

                {/* ردیف چهارم: تاریخ تقویم فارسی، ساعت، روش دریافت */}
                <div className="form-row-3">
                  <div className="form-group-block">
                    <label className="field-label">
                      <FiCalendar /> تاریخ درآمد (شمسی)
                    </label>
                    <input
                      type="text"
                      className="modal-form-input text-center"
                      value={formData.receiveDate}
                      placeholder="۱۴۰۴/۰۶/۲۰"
                      onChange={(e) =>
                        setFormData({ ...formData, receiveDate: e.target.value })
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
                      value={formData.receiveTime}
                      onChange={(e) =>
                        setFormData({ ...formData, receiveTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group-block">
                    <label className="field-label">روش دریافت</label>
                    <select
                      className="modal-form-select"
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value })
                      }
                    >
                      <option value="پایا / ساتنا">پایا / ساتنا (انتقال بانکی)</option>
                      <option value="کارت به کارت">کارت به کارت</option>
                      <option value="واریز به حساب">واریز مستقیم به حساب</option>
                      <option value="چک صیادی">چک صیادی</option>
                      <option value="درگاه پرداخت آنلاین">درگاه پرداخت آنلاین</option>
                      <option value="نقدی">نقدی</option>
                    </select>
                  </div>
                </div>

                {/* ردیف پنجم: کد پیگیری */}
                <div className="form-group-block">
                  <label className="field-label">شماره پیگیری / ارجاع بانکی</label>
                  <input
                    type="text"
                    className="modal-form-input"
                    placeholder="مثال: TR-9988210 یا شماره صیاد چک"
                    value={formData.trackingCode}
                    onChange={(e) =>
                      setFormData({ ...formData, trackingCode: e.target.value })
                    }
                  />
                </div>

                {/* ردیف ششم: توضیحات */}
                <div className="form-group-block">
                  <label className="field-label">
                    <FiFileText /> توضیحات و بابت
                  </label>
                  <textarea
                    className="modal-form-textarea"
                    rows={2}
                    placeholder="توضیحات مربوط به فاز پروژه، شماره قرارداد، نحوه محاسبه و..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
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
                  {editingProject ? 'ذخیره تغییرات' : 'ثبت قطعی سند درآمد'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== مودال مشاهده جزئیات ===================== */}
      {isDetailsModalOpen && selectedProject && (
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
                  <h3>جزئیات درآمد: {selectedProject.projectTitle}</h3>
                  <p className="modal-subtitle">
                    کارفرما: {selectedProject.payerName} ({selectedProject.clientType === 'corporate' ? 'حقوقی' : 'حقیقی'})
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
                  <span>مبلغ کل قرارداد:</span>
                  <strong>
                    {(selectedProject.totalContract || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>درآمد وصول‌شده:</span>
                  <strong style={{ color: '#10b981' }}>
                    {(selectedProject.amountReceived || 0).toLocaleString()} تومان
                  </strong>
                </div>
                <div className="summary-pill-box">
                  <span>مانده معوقه:</span>
                  <strong className={selectedProject.balance > 0 ? 'text-warning' : ''}>
                    {(selectedProject.balance || 0).toLocaleString()} تومان
                  </strong>
                </div>
              </div>

              <div className="project-detail-meta-box">
                <p>
                  <strong>روش دریافت:</strong> {selectedProject.paymentMethod}
                </p>
                <p>
                  <strong>شماره پیگیری:</strong> {selectedProject.trackingCode || 'ثبت نشده'}
                </p>
                <p>
                  <strong>تاریخ ثبت:</strong> {selectedProject.receiveDate} - ساعت {selectedProject.receiveTime}
                </p>
                {selectedProject.description && (
                  <p>
                    <strong>توضیحات سند:</strong> {selectedProject.description}
                  </p>
                )}
              </div>

              <h4 className="section-mini-title">
                <FiFileText /> سوابق و اسناد واریزی به این پروژه
              </h4>

              <div className="history-table-container">
                <table className="modern-history-table">
                  <thead>
                    <tr>
                      <th>تاریخ و ساعت</th>
                      <th>مرحله / بابت</th>
                      <th>روش واریز</th>
                      <th>مبلغ دریافتی</th>
                      <th>کد پیگیری</th>
                      <th>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedProject.logs || []).map((log, idx) => (
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

                    {(!selectedProject.logs || selectedProject.logs.length === 0) && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>
                          سابقه پرداخت ثبت‌شده‌ای یافت نشد.
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
                  handleOpenEditModal(selectedProject);
                }}
              >
                <FiEdit /> ویرایش این سند
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== مودال تایید حذف فیزیکی ===================== */}
      {isDeleteModalOpen && projectToDelete && (
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
                  <h3 style={{ color: '#b91c1c' }}>تایید حذف فیزیکی سند</h3>
                  <p className="modal-subtitle">این عملیات غیرقابل بازگشت است</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={handleCloseDeleteModal}>
                <FiX size={20} />
              </button>
            </div>

            <div className="admin-modal-body" style={{ padding: '20px 0' }}>
              <p style={{ lineHeight: '1.7', color: '#334155', fontSize: '0.95rem' }}>
                آیا از حذف کامل سند درآمد پروژه{' '}
                <strong>«{projectToDelete.projectTitle}»</strong> به مبلغ{' '}
                <strong style={{ color: '#ef4444' }}>
                  {(projectToDelete.amountReceived || 0).toLocaleString()} تومان
                </strong>{' '}
                اطمینان دارید؟ تمامی لاگ‌ها و سوابق این سند از دیتابیس پاک خواهد شد.
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
                <FiTrash2 /> حذف قطعی و فیزیکی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
