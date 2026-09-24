import React, { useState, useMemo, useRef } from 'react';
import {
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiPrinter,
  FiFileText,
  FiLayers,
  FiBriefcase,
  FiCalendar,
  FiTrendingUp,
  FiX,
  FiCreditCard,
  FiHash,
  FiRefreshCw,
  FiCode,
  FiUser,
  FiActivity,
  FiInfo,
  FiExternalLink,
  FiAlertCircle,FiChevronDown 
} from 'react-icons/fi';
import '../../styles/IndustrialProjects.css';


// توابع فرمت‌بندی مبالغ و اعداد با گارد محافظ در برابر null / undefined
const formatToman = (amount) => {
  if (amount === undefined || amount === null) return '۰ تومان';
  return `${amount.toLocaleString('fa-IR')} تومان`;
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return '۰';
  return num.toLocaleString('fa-IR');
};

// داده‌های اولیه نمونه پروژه‌های صنعتی
const INITIAL_PROJECTS_DATA = [
  {
    id: 'prj-101',
    projectCode: 'PRJ-WEB-401',
    projectTitle: 'طراحی و پیاده‌سازی پورتال جامع مشتریان فولاد سیرجان',
    projectCategory: 'توسعه وب و پرتال سازمانی',
    teacherName: 'استاد حمید پورفریدونی',
    clientName: 'مجتمع جهان فولاد سیرجان',
    totalBudget: 45000000,
    paidAmount: 45000000,
    paymentStatus: 'paid', // 'paid' | 'partially_paid' | 'unpaid'
    projectStatus: 'completed', // 'completed' | 'in_progress'
    paymentDate: '۱۴۰۳/۰۴/۱۵',
    paymentMethod: 'پایا / شبا',
    trackingCode: 'PAY-893421509',
    progress: 100,
    description: 'تحویل فاز پایانی به همراه داکیومنت کامل API و برگزاری دوره آموزشی پرسنل IT.',
    milestones: [
      { id: 1, title: 'تحلیل نیازمندی‌ها و معماری دیتابیس', status: 'completed', date: '۱۴۰۳/۰۲/۰۱', amount: 15000000 },
      { id: 2, title: 'توسعه Back-end با ASP.NET Core و APIها', status: 'completed', date: '۱۴۰۳/۰۳/۱۰', amount: 15000000 },
      { id: 3, title: 'طراحی Front-end با React و تست نهایی', status: 'completed', date: '۱۴۰۳/۰۴/۱۰', amount: 15000000 }
    ]
  },
  {
    id: 'prj-102',
    projectCode: 'PRJ-AI-102',
    projectTitle: 'سیستم بینایی ماشین و مانیتورینگ خط تولید کنسانتره',
    projectCategory: 'هوش مصنوعی و پردازش تصویر',
    teacherName: 'استاد حمید پورفریدونی',
    clientName: 'شرکت معدنی و صنعتی گل‌گهر',
    totalBudget: 80000000,
    paidAmount: 50000000,
    paymentStatus: 'partially_paid',
    projectStatus: 'in_progress',
    paymentDate: '۱۴۰۳/۰۵/۰۱',
    paymentMethod: 'چک صیادی',
    trackingCode: 'CHK-774129034',
    progress: 65,
    description: 'مدل‌سازی اولیه انجام شده و در حال بهینه‌سازی پردازش بلادرنگ فریم‌های ویدیویی.',
    milestones: [
      { id: 1, title: 'جمع‌آوری دیتاست و پیش‌پردازش تصاویر صنعتی', status: 'completed', date: '۱۴۰۳/۰۳/۱۵', amount: 25000000 },
      { id: 2, title: 'آموزش مدل تشخیص عیوب قطعات با YOLOv8', status: 'completed', date: '۱۴۰۳/۰۴/۲۰', amount: 25000000 },
      { id: 3, title: 'استقرار مدل بر روی سرورهای لبه و مانیتورینگ', status: 'in_progress', date: '۱۴۰۳/۰۶/۳۰', amount: 30000000 }
    ]
  },
  {
    id: 'prj-103',
    projectCode: 'PRJ-APP-508',
    projectTitle: 'اپلیکیشن موبایل مدیریت انبار و رهگیری بارکد',
    projectCategory: 'اپلیکیشن موبایل',
    teacherName: 'استاد حمید پورفریدونی',
    clientName: 'شرکت لجستیک امید سیرجان',
    totalBudget: 32000000,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    projectStatus: 'in_progress',
    paymentDate: 'در انتظار تایید فاز ۱',
    paymentMethod: 'ساتنا',
    trackingCode: 'TRX-PENDING-09',
    progress: 30,
    description: 'طراحی رابط کاربری UI/UX تایید شده و کدنویسی فریم‌ورک React Native آغاز گردیده است.',
    milestones: [
      { id: 1, title: 'طراحی Wireframe و پروتوتایپ در Figma', status: 'completed', date: '۱۴۰۳/۰۵/۱۰', amount: 10000000 },
      { id: 2, title: 'پیاده‌سازی ماژول اسکن بارکد و آفلاین مود', status: 'in_progress', date: '۱۴۰۳/۰۶/۱۵', amount: 12000000 },
      { id: 3, title: 'یکپارچه‌سازی با ERP مرکزی و تحویل نهایی', status: 'pending', date: '۱۴۰۳/۰۷/۱۵', amount: 10000000 }
    ]
  },
  {
    id: 'prj-104',
    projectCode: 'PRJ-SEC-303',
    projectTitle: 'تست نفوذ و امن‌سازی زیرساخت شبکه و سرورها',
    projectCategory: 'امنیت سایبری و شبکه',
    teacherName: 'استاد حمید پورفریدونی',
    clientName: 'سازمان عمران شهری',
    totalBudget: 28000000,
    paidAmount: 28000000,
    paymentStatus: 'paid',
    projectStatus: 'completed',
    paymentDate: '۱۴۰۳/۰۳/۲۵',
    paymentMethod: 'پایا / شبا',
    trackingCode: 'PAY-119845620',
    progress: 100,
    description: 'گزارش کامل آسیب‌پذیری‌ها تحویل و پچ‌های امنیتی روی روترها و فایروال‌ها اعمال گردید.',
    milestones: [
      { id: 1, title: 'اسکن آسیب‌پذیری و ارزیابی ریسک', status: 'completed', date: '۱۴۰۳/۰۲/۲۰', amount: 14000000 },
      { id: 2, title: 'Hardening سرورها و تنظیم Firewall', status: 'completed', date: '۱۴۰۳/۰۳/۲۰', amount: 14000000 }
    ]
  }
];

export default function IndustrialProjects() {
  const [projectsList] = useState(INITIAL_PROJECTS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // استیت‌های مودال
  const [selectedProjectForReceipt, setSelectedProjectForReceipt] = useState(null);

  const printAreaRef = useRef(null);

  // فیلتر کردن پروژه‌ها بر اساس جستجو و فیلترها
  const filteredProjects = useMemo(() => {
    return projectsList.filter((item) => {
      const matchesSearch =
        item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectCategory.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.projectStatus === statusFilter;

      let matchesPayment = true;
      if (paymentFilter === 'paid') {
        matchesPayment = item.paymentStatus === 'paid';
      } else if (paymentFilter === 'unpaid') {
        matchesPayment = item.paymentStatus === 'unpaid' || item.paymentStatus === 'partially_paid';
      }

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [projectsList, searchTerm, statusFilter, paymentFilter]);

  // محاسبه آمارهای KPI
  const stats = useMemo(() => {
    let totalCreditor = 0;
    let totalSettled = 0;
    let completedCount = 0;
    let inProgressCount = 0;

    projectsList.forEach((item) => {
      const remaining = item.totalBudget - item.paidAmount;
      if (remaining > 0) {
        totalCreditor += remaining;
      }
      totalSettled += item.paidAmount;

      if (item.projectStatus === 'completed') {
        completedCount += 1;
      } else {
        inProgressCount += 1;
      }
    });

    return {
      totalCreditor,
      totalSettled,
      completedCount,
      inProgressCount,
      totalCount: projectsList.length
    };
  }, [projectsList]);

  // پرینت فیش صورت‌حساب
  const handlePrint = () => {
    window.print();
  };

  // بررسی فعال بودن فیلترها
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || paymentFilter !== 'all';

  // ریست فیلترها
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
  };

  return (
    <div className="teacher-finance-wrapper" dir="rtl">
      {/* هدر صفحه - دقیقاً شبیه TeacherSalary */}
      <header className="page-header">
        <div className="header-info">
          <div className="header-title-badge">
            <h1 className="text-white">پروژه‌های صنعتی و برون‌سازمانی</h1>
          </div>
          <p className="header-subtitle">
            مدیریت قراردادها، فازهای اجرایی، درآمدها و صورت‌حساب پروژه‌های صنعتی مدرس
          </p>
        </div>
      </header>

      {/* ۱. بخش کارت‌های آماری (KPI) */}
      <section className="kpi-grid mt-4">
        {/* ۱. مجموع مطالبات */}
        <div className="kpi-card highlight-orange">
          <div className="kpi-icon-wrapper orange">
            <FiDollarSign />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">مجموع مطالبات (طلبکار)</span>
            <span className="kpi-value text-orange">{formatToman(stats.totalCreditor)}</span>
            <span className="kpi-subtext">سهم تسویه‌نشده از پروژه‌های فنی</span>
          </div>
        </div>

        {/* ۲. مجموع واریز شده */}
        <div className="kpi-card highlight-green">
          <div className="kpi-icon-wrapper green">
            <FiCheckCircle />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">مجموع تسویه‌شده</span>
            <span className="kpi-value text-green">{formatToman(stats.totalSettled)}</span>
            <span className="kpi-subtext">تسویه‌شده از پیش‌پرداخت‌ها و فازها</span>
          </div>
        </div>

        {/* ۳. پروژه‌های تکمیل‌شده */}
        <div className="kpi-card highlight-purple">
          <div className="kpi-icon-wrapper purple">
            <FiLayers />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">پروژه‌های تکمیل‌شده</span>
            <span className="kpi-value text-purple">
              {formatNumber(stats.completedCount)} از {formatNumber(stats.totalCount)} پروژه
            </span>
            <span className="kpi-subtext">تحویل نهایی شده به کارفرما</span>
          </div>
        </div>

        {/* ۴. در حال اجرا */}
        <div className="kpi-card highlight-blue">
          <div className="kpi-icon-wrapper blue">
            <FiActivity />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">پروژه‌های در حال اجرا</span>
            <span className="kpi-value text-blue">
              {formatNumber(stats.inProgressCount)} پروژه
            </span>
            <span className="kpi-subtext">فازبندی و در حال کدنویسی</span>
          </div>
        </div>
      </section>

      {/* ۲. نوار ابزار فیلتر و جستجو */}
<section className="filter-toolbar">
  <div className="search-box">
    <FiSearch className="search-icon" />
    <input
      type="text"
      placeholder="جستجو در عنوان پروژه، کد، کارفرما یا حوزه..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchTerm && (
      <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="پاک کردن جستجو">
        <FiX />
      </button>
    )}
  </div>

  <div className="filter-select-group">
    <div className="select-wrapper">
      <FiFilter className="select-icon" />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="styled-select"
      >
        <option value="all">همه وضعیت‌های پروژه</option>
        <option value="completed">تکمیل و تحویل شده</option>
        <option value="in_progress">در حال اجرا</option>
      </select>
      <FiChevronDown className="arrow-icon" />
    </div>

    <div className="select-wrapper">
      <FiCreditCard className="select-icon" />
      <select
        value={paymentFilter}
        onChange={(e) => setPaymentFilter(e.target.value)}
        className="styled-select"
      >
        <option value="all">همه وضعیت‌های مالی</option>
        <option value="paid">تسویه کامل شده</option>
        <option value="unpaid">دارای مطالبات / پرداخت مرحله‌ای</option>
      </select>
      <FiChevronDown className="arrow-icon" />
    </div>

    {hasActiveFilters && (
      <button 
        className="btn-reset-filter active" 
        onClick={handleResetFilters} 
        title="پاک کردن فیلترها"
      >
        <FiRefreshCw className="reset-icon" />
        <span>بازنشانی</span>
      </button>
    )}
  </div>
</section>


      {/* ۳. جدول لیست پروژه‌های صنعتی */}
      <section className="table-card">
        

        <div className="table-responsive">
          <table className="finance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان پروژه و شناسه</th>
                <th>کارفرما / سازمان</th>
                <th>بودجه کل پروژه</th>
                <th>پیشرفت فازها</th>
                <th>وضعیت پروژه</th>
                <th>وضعیت تسویه</th>
                <th>مبلغ واریز / مانده</th>
                <th className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((item, index) => {
                  const remaining = item.totalBudget - item.paidAmount;
                  return (
                    <tr key={item.id}>
                      <td className="row-index">{formatNumber(index + 1)}</td>
                      <td>
                        <div className="course-main-info">
                          <span className="course-title-text font-bold">{item.projectTitle}</span>
                          <div className="course-tags-row">
                            <span className="code-tag">{item.projectCode}</span>
                            <span className="term-tag">{item.projectCategory}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="client-cell">
                          <span className="client-name">{item.clientName}</span>
                          <span className="client-sub">{item.teacherName}</span>
                        </div>
                      </td>
                      <td className="font-bold text-gray-800">
                        {formatToman(item.totalBudget)}
                      </td>
                      <td>
                        <div className="progress-cell">
                          <div className="progress-info-text">
                            <span>{formatNumber(item.progress)}٪</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className={`progress-bar-fill ${
                                item.progress === 100 ? 'fill-green' : 'fill-blue'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {item.projectStatus === 'completed' ? (
                          <span className="status-badge finalized">
                            <FiCheckCircle className="badge-icon" /> تکمیل شده
                          </span>
                        ) : (
                          <span className="status-badge in-progress">
                            <FiClock className="badge-icon" /> در حال اجرا
                          </span>
                        )}
                      </td>
                      <td>
                        {item.paymentStatus === 'paid' && (
                          <span className="finance-badge settled">
                            <FiCheckCircle className="badge-icon" /> تسویه کامل
                          </span>
                        )}
                        {item.paymentStatus === 'partially_paid' && (
                          <span className="finance-badge creditor">
                            <FiClock className="badge-icon" /> پرداخت مرحله‌ای
                          </span>
                        )}
                        {item.paymentStatus === 'unpaid' && (
                          <span className="finance-badge creditor">
                            <FiAlertCircle className="badge-icon" /> طلبکار
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="amount-cell">
                          {item.paymentStatus === 'paid' ? (
                            <>
                              <span className="amount-text text-green font-bold">
                                {formatToman(item.paidAmount)}
                              </span>
                              <span className="settle-meta">{item.paymentDate}</span>
                            </>
                          ) : (
                            <>
                              <span className="amount-text text-orange font-bold">
                                مانده: {formatToman(remaining)}
                              </span>
                              <span className="settle-meta text-gray-500">
                                واریز شده: {formatToman(item.paidAmount)}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                        
                          <button
                            className="action-btn view-receipt"
                            onClick={() => setSelectedProjectForReceipt(item)}
                            title="مشاهده فیش و صورت‌حساب"
                          >
                            <FiFileText />
                            <span>صورت‌حساب</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">
                    <FiSearch className="empty-icon" />
                    <p>هیچ پروژه‌ای با معیارهای انتخابی شما یافت نشد.</p>
                    <button className="btn-empty-reset btn btn-danger" onClick={handleResetFilters}>
                      پاک کردن فیلترها
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

     

    {/* ۵. مودال چاپ فیش و صورت‌حساب رسمی مدرن */}
{selectedProjectForReceipt && (
  <div className="modal-backdrop" onClick={() => setSelectedProjectForReceipt(null)}>
    <div
      className="modal-box modal-receipt modern-receipt-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* سربرگ مودال */}
      <div className="modal-header">
        <div className="modal-header-title">
          <div className="modal-icon-badge">
            <FiFileText />
          </div>
          <div>
            <h3>صورت‌حساب رسمی مشارکت در پروژه</h3>
            <span className="modal-sub">
              کد ارجاع قرارداد: <strong className="text-dark">{selectedProjectForReceipt.projectCode}</strong>
            </span>
          </div>
        </div>
        <button
          className="btn btn-danger"
          onClick={() => setSelectedProjectForReceipt(null)}
          title="بستن"
        >
          <FiX />
        </button>
      </div>

      {/* بدنه مودال و سند چاپی */}
      <div className="modal-body print-area" ref={printAreaRef}>
        <div className="receipt-paper modern-sheet">
          {/* هدر رسمی فاکتور */}
          <div className="receipt-brand-header">
            <div className="brand-title-area">
              <div className="brand-logo-mark">FF</div>
              <div>
                <h2>آموزشگاه تخصصی و فناورانه فناوران فردا</h2>
                <span className="brand-department">دپارتمان فناوری اطلاعات و پروژه‌های صنعتی</span>
              </div>
            </div>

            <div className="receipt-badge-info">
              <div className="badge-row">
                <span className="b-label">شماره سند:</span>
                <span className="b-val ltr-text font-bold">{selectedProjectForReceipt.projectCode}-FIN</span>
              </div>
              <div className="badge-row">
                <span className="b-label">تاریخ صدور:</span>
                <span className="b-val">{selectedProjectForReceipt.paymentDate}</span>
              </div>
              <div className="badge-row">
                <span className="b-label">وضعیت:</span>
                <span className={`status-pill ${selectedProjectForReceipt.totalBudget === selectedProjectForReceipt.paidAmount ? 'pill-success' : 'pill-warning'}`}>
                  {selectedProjectForReceipt.totalBudget === selectedProjectForReceipt.paidAmount ? 'تسویه نهایی' : 'پرداخت مرحله‌ای'}
                </span>
              </div>
            </div>
          </div>

          <div className="receipt-glow-divider"></div>

          {/* کارت‌بندی ۳گانه اطلاعات */}
          <div className="receipt-cards-container">
            {/* کارت ۱: مشخصات قرارداد */}
            <div className="info-card">
              <div className="card-top-title">
                <span className="card-dot dot-blue"></span>
                اطلاعات پروژه و قرارداد
              </div>
              <div className="card-item-row">
                <span className="c-label">عنوان پروژه:</span>
                <span className="c-val font-semibold">{selectedProjectForReceipt.projectTitle}</span>
              </div>
              <div className="card-item-row">
                <span className="c-label">حوزه تخصصی:</span>
                <span className="c-val tag-category">{selectedProjectForReceipt.projectCategory}</span>
              </div>
            </div>

            {/* کارت ۲: طرفین قرارداد */}
            <div className="info-card">
              <div className="card-top-title">
                <span className="card-dot dot-purple"></span>
                طرفین قرارداد
              </div>
              <div className="card-item-row">
                <span className="c-label">مدرس و مجری:</span>
                <span className="c-val font-semibold">{selectedProjectForReceipt.teacherName}</span>
              </div>
              <div className="card-item-row">
                <span className="c-label">کارفرما / سفارش‌دهنده:</span>
                <span className="c-val">{selectedProjectForReceipt.clientName}</span>
              </div>
            </div>

            {/* کارت ۳: اطلاعات تراکنش */}
            <div className="info-card">
              <div className="card-top-title">
                <span className="card-dot dot-green"></span>
                اطلاعات پرداخت بانکی
              </div>
              <div className="card-item-row">
                <span className="c-label">روش پرداخت:</span>
                <span className="c-val">{selectedProjectForReceipt.paymentMethod}</span>
              </div>
              <div className="card-item-row">
                <span className="c-label">کد رهگیری بانکی:</span>
                <span className="c-val ltr-text font-bold text-dark">{selectedProjectForReceipt.trackingCode}</span>
              </div>
            </div>
          </div>

          {/* خلاصه محاسبات و جدول تراز مالی شیک */}
          <div className="financial-summary-card">
            <div className="fin-card-header">
              <span>خلاصه وضعیت مالی و تسویه‌حساب</span>
              <span className="fin-percentage">
                {Math.round((selectedProjectForReceipt.paidAmount / selectedProjectForReceipt.totalBudget) * 100)}٪ تسویه شده
              </span>
            </div>

            <div className="fin-metric-grid">
              <div className="fin-metric-item">
                <span className="f-title">کل مبلغ قرارداد</span>
                <span className="f-amount">{formatToman(selectedProjectForReceipt.totalBudget)}</span>
              </div>

              <div className="fin-metric-item highlight-green">
                <span className="f-title">واریز شده به حساب</span>
                <span className="f-amount text-success">
                  {formatToman(selectedProjectForReceipt.paidAmount)}
                </span>
              </div>

              <div className="fin-metric-item highlight-balance">
                <span className="f-title">مانده مطالبات</span>
                <span className={`f-amount ${selectedProjectForReceipt.totalBudget - selectedProjectForReceipt.paidAmount === 0 ? 'text-complete' : 'text-danger'}`}>
                  {selectedProjectForReceipt.totalBudget - selectedProjectForReceipt.paidAmount === 0
                    ? 'تسویه کامل'
                    : formatToman(selectedProjectForReceipt.totalBudget - selectedProjectForReceipt.paidAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* تبصره رسمی */}
          <div className="receipt-legal-note">
            <div className="legal-icon">ℹ</div>
            <p>
              این صورت‌حساب الکترونیکی بر اساس مصوبات کمیته آموزش و پروژه‌های صنعتی آموزشگاه فناوران فردا تنظیم گردیده و به منزله تاییدیه معتبر قطعی خدمات و پرداخت فازهای اجرایی می‌باشد.
            </p>
          </div>

          {/* محل مهر و امضای رسمی */}
          <div className="receipt-signatures-block">
            <div className="sign-unit">
              <span className="sign-role">امضاء و تایید مجری پروژه</span>
              <div className="sign-signature-area">
                <span className="sign-teacher-name">{selectedProjectForReceipt.teacherName}</span>
              </div>
            </div>

            <div className="seal-center-unit">
              <div className="official-stamp-sim">
                <span>آموزشگاه فناوران فردا</span>
                <small>دپارتمان مالی و صنعتی</small>
                <strong>تایید گردید</strong>
              </div>
            </div>

            <div className="sign-unit">
              <span className="sign-role">مهر و امضاء مدیریت دپارتمان</span>
              <div className="sign-signature-area"></div>
            </div>
          </div>
        </div>
      </div>

      {/* فوتر دکمه‌ها */}
      <div className="modal-footer">
        <button className="btn btn-info" onClick={handlePrint}>
          <FiPrinter />
          <span>چاپ صورت‌حساب / دانلود PDF</span>
        </button>
        <button
          className="btn btn-danger"
          onClick={() => setSelectedProjectForReceipt(null)}
        >
          انصراف و بازگشت
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
