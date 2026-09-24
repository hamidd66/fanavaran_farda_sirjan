import React, { useState, useMemo } from "react";
import {
  FaWallet,
  FaChalkboardTeacher,
  FaIndustry,
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaFileInvoiceDollar,
  FaPrint,
  FaTimes,
  FaCalendarAlt,
  FaArrowUp,
  FaExchangeAlt,
} from "react-icons/fa";
import "../../styles/TeacherSettlement.css";

const formatToman = (amount) => {
  if (amount === undefined || amount === null) return "۰ تومان";
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

const formatNumber = (num) => {
  if (num === undefined || num === null) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
};

const MOCK_SETTLEMENTS = [
  {
    id: "SET-101",
    trackingCode: "TRK-980412",
    title: "حقوق دوره React پیشرفته",
    category: "teaching",
    sourceName: "دوره جامع React (کد RE-208)",
    amount: 14400000,
    date: "۱۴۰۲/۰۶/۱۸",
    month: "شهریور",
    status: "settled",
    paymentMethod: "پایا",
    bankName: "بانک سامان",
    accountNumber: "IR6205600000000123456789",
    description: "تسویه ۱۶ جلسه دوره شهریور",
  },
  {
    id: "SET-102",
    trackingCode: "TRK-980399",
    title: "تسویه فاز اول سامانه فروشگاهی",
    category: "project",
    sourceName: "پروژه فروشگاه اینترنتی صنعتی",
    amount: 25000000,
    date: "۱۴۰۲/۰۶/۱۲",
    month: "شهریور",
    status: "settled",
    paymentMethod: "حواله ساتنا",
    bankName: "بانک ملت",
    accountNumber: "IR6205600000000123456789",
    description: "پرداخت فاز اول پس از تحویل و تایید کارفرما",
  },
  {
    id: "SET-103",
    trackingCode: "TRK-980255",
    title: "حقوق دوره جامع پایتون",
    category: "teaching",
    sourceName: "دوره جامع پایتون (کد PY-109)",
    amount: 10800000,
    date: "۱۴۰۲/۰۵/۲۸",
    month: "مرداد",
    status: "settled",
    paymentMethod: "پایا",
    bankName: "بانک سامان",
    accountNumber: "IR6205600000000123456789",
    description: "تسویه ۱۲ جلسه نهایی دوره تابستان",
  },
  {
    id: "SET-104",
    trackingCode: "TRK-980201",
    title: "حقوق دوره C# & ASP.NET Core",
    category: "teaching",
    sourceName: "دوره سازمانی C# (کد CS-301)",
    amount: 9600000,
    date: "۱۴۰۲/۰۵/۱۰",
    month: "مرداد",
    status: "pending",
    paymentMethod: "در انتظار واریز",
    bankName: "بانک سامان",
    accountNumber: "IR6205600000000123456789",
    description: "تایید شده توسط مدیریت مالی - در صف واریزی بانک",
  },
  {
    id: "SET-105",
    trackingCode: "TRK-980188",
    title: "تسویه فاز دوم پروژه هوش مصنوعی",
    category: "project",
    sourceName: "پروژه پردازش تصویر و پلاک‌خوان",
    amount: 30000000,
    date: "۱۴۰۲/۰۴/۲۰",
    month: "تیر",
    status: "settled",
    paymentMethod: "حواله ساتنا",
    bankName: "بانک ملت",
    accountNumber: "IR6205600000000123456789",
    description: "تسویه کامل فاز ۲ پس از تایید ناظر فنی",
  },
  {
    id: "SET-106",
    trackingCode: "TRK-979950",
    title: "حقوق کارگاه الگوریتم و ساختار داده",
    category: "teaching",
    sourceName: "کارگاه فشرده الگوریتم",
    amount: 4500000,
    date: "۱۴۰۲/۰۴/۰۵",
    month: "تیر",
    status: "settled",
    paymentMethod: "پایا",
    bankName: "بانک سامان",
    accountNumber: "IR6205600000000123456789",
    description: "حق‌الزحمه برگزاری کارگاه تک‌روز",
  },
  {
    id: "SET-107",
    trackingCode: "TRK-980166",
    title: "پیش‌پرداخت پروژه داشبورد صنعتی",
    category: "project",
    sourceName: "پروژه داشبورد مانیتورینگ خط تولید",
    amount: 10000000,
    date: "۱۴۰۲/۰۵/۱۵",
    month: "مرداد",
    status: "settled",
    paymentMethod: "پایا",
    bankName: "بانک ملت",
    accountNumber: "IR6205600000000123456789",
    description: "پیش‌پرداخت شروع فاز طراحی و پیاده‌سازی",
  },
];

const MONTHLY_CHART_DATA = [
  { month: "مهر", teaching: 7200000, project: 8000000 },
  { month: "آبان", teaching: 9000000, project: 5000000 },
  { month: "آذر", teaching: 10500000, project: 18000000 },
  { month: "دی", teaching: 8000000, project: 0 },
  { month: "بهمن", teaching: 12500000, project: 22000000 },
  { month: "اسفند", teaching: 15000000, project: 16000000 },
  { month: "فروردین", teaching: 8500000, project: 12000000 },
  { month: "اردیبهشت", teaching: 11000000, project: 15000000 },
  { month: "خرداد", teaching: 9500000, project: 0 },
  { month: "تیر", teaching: 4500000, project: 30000000 },
  { month: "مرداد", teaching: 20400000, project: 10000000 },
  { month: "شهریور", teaching: 14400000, project: 25000000 },
];

export default function TeacherSettlement() {
  const [settlements] = useState(MOCK_SETTLEMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState("6months");

  const stats = useMemo(() => {
    let totalSettled = 0;
    let totalPending = 0;
    let teachingEarned = 0;
    let projectEarned = 0;

    settlements.forEach((item) => {
      if (item.status === "settled") {
        totalSettled += item.amount;
        if (item.category === "teaching") teachingEarned += item.amount;
        if (item.category === "project") projectEarned += item.amount;
      } else if (item.status === "pending") {
        totalPending += item.amount;
      }
    });

    const grandTotal = totalSettled + totalPending;
    const settlementRate =
      grandTotal > 0 ? Math.round((totalSettled / grandTotal) * 100) : 0;

    return {
      totalSettled,
      totalPending,
      teachingEarned,
      projectEarned,
      grandTotal,
      settlementRate,
      count: settlements.length,
    };
  }, [settlements]);

  const filteredSettlements = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return settlements.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.sourceName.toLowerCase().includes(query) ||
        item.trackingCode.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [settlements, searchTerm, categoryFilter, statusFilter]);

  const visibleChartData = useMemo(() => {
    if (chartTimeframe === "6months") {
      return MONTHLY_CHART_DATA.slice(-6);
    }
    return MONTHLY_CHART_DATA;
  }, [chartTimeframe]);

  const maxChartValue = useMemo(() => {
    return Math.max(
      ...visibleChartData.map((d) => d.teaching + d.project),
      1
    );
  }, [visibleChartData]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="teacher-settlement-wrapper">
      <header className="page-header">
  <div className="header-info">
    <div className="header-title-badge">
      <FaWallet className="header-icon" />
      <h1 className="text-white">تسویه حساب و واریزی‌ها</h1>
    </div>
    <p className="header-subtitle">
      مدیریت یکپارچه دریافتی‌ها، مطالبات دوره‌های آموزشی، دستمزد پروژه‌ها و مقایسه روند درآمدی
    </p>
  </div>
</header>


      <div className="kpi-grid">
        <div className="kpi-card highlight-green">
          <div className="kpi-icon-wrapper">
            <FaCheckCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">مجموع دریافتی‌های تسویه‌شده</span>
            <span className="kpi-value text-green">
              {formatToman(stats.totalSettled)}
            </span>
            <span className="kpi-subtext positive">
              <FaArrowUp style={{ marginLeft: "4px" }} />
              {formatNumber(stats.settlementRate)}٪ از کل مطالبات واریز شده
            </span>
          </div>
        </div>

        <div className="kpi-card highlight-orange">
          <div className="kpi-icon-wrapper">
            <FaClock />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">مطالبات در انتظار تسویه</span>
            <span className="kpi-value text-orange">
              {formatToman(stats.totalPending)}
            </span>
            <span className="kpi-subtext warning">
              در صف پردازش مالی آموزشگاه
            </span>
          </div>
        </div>

        <div className="kpi-card highlight-blue">
          <div className="kpi-icon-wrapper">
            <FaChalkboardTeacher />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">دریافتی از کلاس‌های آموزشی</span>
            <span className="kpi-value text-blue">
              {formatToman(stats.teachingEarned)}
            </span>
            <span className="kpi-subtext neutral">حق‌الزحمه برگزاری جلسات</span>
          </div>
        </div>

        <div className="kpi-card highlight-purple">
          <div className="kpi-icon-wrapper">
            <FaIndustry />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">دریافتی از پروژه‌های صنعتی</span>
            <span className="kpi-value text-purple">
              {formatToman(stats.projectEarned)}
            </span>
            <span className="kpi-subtext neutral">
              مشارکت در پروژه‌ها و فازها
            </span>
          </div>
        </div>
      </div>

      <div className="chart-section-card">
        <div className="chart-header">
          <div className="chart-title">
            <FaCalendarAlt className="chart-icon" />
            <div>
              <h3>مقایسه درآمد ماهانه (تدریس در برابر پروژه)</h3>
              <span className="chart-subtitle">
                {chartTimeframe === "6months"
                  ? "روند واریزی‌ها در ۶ ماه گذشته"
                  : "روند واریزی‌ها در ۱۲ ماه گذشته"}
              </span>
            </div>
          </div>
          <div className="chart-actions">
            <div className="chart-legend">
              <span className="legend-item legend-teaching">
                <span className="dot"></span> دریافتی تدریس
              </span>
              <span className="legend-item legend-project">
                <span className="dot"></span> دریافتی پروژه
              </span>
            </div>
            <select
              value={chartTimeframe}
              onChange={(e) => setChartTimeframe(e.target.value)}
              className="chart-time-select"
            >
              <option value="6months">۶ ماه اخیر</option>
              <option value="12months">سال جاری (۱۴۰۲)</option>
            </select>
          </div>
        </div>

        <div className="chart-container">
          <div className="bars-wrapper">
            {visibleChartData.map((item) => {
              const totalMonth = item.teaching + item.project;
              const heightPercent = Math.round(
                (totalMonth / maxChartValue) * 100
              );
              const teachingRatio =
                totalMonth > 0 ? (item.teaching / totalMonth) * 100 : 0;
              const projectRatio =
                totalMonth > 0 ? (item.project / totalMonth) * 100 : 0;

              return (
                <div key={item.month} className="bar-column">
                  <div className="bar-tooltip">
                    <strong>{item.month}</strong>
                    <div>تدریس: {formatToman(item.teaching)}</div>
                    <div>پروژه: {formatToman(item.project)}</div>
                    <div className="tooltip-total">
                      جمع: {formatToman(totalMonth)}
                    </div>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill-group"
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    >
                      {item.project > 0 && (
                        <div
                          className="bar-segment project"
                          style={{ height: `${projectRatio}%` }}
                        ></div>
                      )}
                      {item.teaching > 0 && (
                        <div
                          className="bar-segment teaching"
                          style={{ height: `${teachingRatio}%` }}
                        ></div>
                      )}
                    </div>
                  </div>
                  <span className="bar-label">{item.month}</span>
                  <span className="bar-amount-short">
                    {(totalMonth / 1000000).toFixed(1)} م
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="filter-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="جستجو در عنوان تراکنش، نام دوره یا کد پیگیری..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm("")}
            >
              <FaTimes />
            </button>
          )}
        </div>

        <div className="filter-select-group">
          <div className="select-wrapper">
            <FaFilter className="select-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">همه دسته‌ها (تدریس و پروژه)</option>
              <option value="teaching">فقط کلاس‌های آموزشی</option>
              <option value="project">فقط پروژه‌های صنعتی</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="settled">تسویه شده (واریز نهایی)</option>
              <option value="pending">در انتظار واریز</option>
            </select>
          </div>

          {(searchTerm ||
            categoryFilter !== "all" ||
            statusFilter !== "all") && (
            <button className="btn-reset-filter" onClick={handleResetFilters}>
              <FaTimes /> حذف فیلترها
            </button>
          )}
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="settlement-table">
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان و شرح تراکنش</th>
                <th>دسته / مبدأ</th>
                <th>مبلغ (تومان)</th>
                <th>تاریخ واریز</th>
                <th>شناسه پیگیری</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((item, index) => (
                  <tr key={item.id}>
                    <td className="col-idx">{formatNumber(index + 1)}</td>
                    <td className="transaction-title-cell">
                      <strong>{item.title}</strong>
                      <span className="desc-sub">{item.description}</span>
                    </td>
                    <td>
                      {item.category === "teaching" ? (
                        <span className="category-badge teaching">
                          <FaChalkboardTeacher /> آموزش
                        </span>
                      ) : (
                        <span className="category-badge project">
                          <FaIndustry /> پروژه صنعتی
                        </span>
                      )}
                      <div className="source-name-text">{item.sourceName}</div>
                    </td>
                    <td>
                      <span className="amount-text">
                        {formatToman(item.amount)}
                      </span>
                    </td>
                    <td className="date-cell">
                      <FaCalendarAlt className="inline-icon" />
                      {item.date}
                    </td>
                    <td>
                      <code className="tracking-code">{item.trackingCode}</code>
                    </td>
                    <td>
                      {item.status === "settled" ? (
                        <span className="status-badge settled">
                          <FaCheckCircle /> تسویه شده
                        </span>
                      ) : (
                        <span className="status-badge pending">
                          <FaClock /> در انتظار واریز
                        </span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn view-receipt"
                        onClick={() => setSelectedReceipt(item)}
                        title="مشاهده فیش واریز"
                      >
                        <FaFileInvoiceDollar /> فیش واریزی
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state">
                      <FaExchangeAlt className="empty-icon" />
                      <p>
                        هیچ تراکنش یا تسویه حسابی با مشخصات انتخابی یافت نشد.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceipt && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="modal-box modal-receipt"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header no-print">
              <div className="modal-header-title">
                <FaFileInvoiceDollar className="header-icon" />
                <div>
                  <h3>فیش واریز و تسویه حساب مالی</h3>
                  <span className="modal-sub">
                    کد پیگیری: {selectedReceipt.trackingCode}
                  </span>
                </div>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedReceipt(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body print-area">
              <div className="receipt-paper">
                <div className="receipt-header">
                  <div className="receipt-org">
                    <h2>آموزشگاه فناوران فردا سیرجان</h2>
                    <p>مجتمع تخصصی آموزش نرم‌افزار و پروژه‌های صنعتی</p>
                  </div>
                  <div className="receipt-badge">
                    <span>رسید واریزی رسمی</span>
                    <small>تاریخ: {selectedReceipt.date}</small>
                  </div>
                </div>

                <hr className="receipt-divider" />

                <div className="receipt-grid">
                  <div className="receipt-item">
                    <label>عنوان تراکنش:</label>
                    <strong>{selectedReceipt.title}</strong>
                  </div>
                  <div className="receipt-item">
                    <label>مبدأ درآمد:</label>
                    <span>{selectedReceipt.sourceName}</span>
                  </div>
                  <div className="receipt-item">
                    <label>شناسه پیگیری:</label>
                    <code>{selectedReceipt.trackingCode}</code>
                  </div>
                  <div className="receipt-item">
                    <label>روش پرداخت:</label>
                    <span>{selectedReceipt.paymentMethod}</span>
                  </div>
                  <div className="receipt-item">
                    <label>بانک مقصد:</label>
                    <span>{selectedReceipt.bankName}</span>
                  </div>
                  <div className="receipt-item">
                    <label>شماره شبای ذینفع:</label>
                    <span dir="ltr">{selectedReceipt.accountNumber}</span>
                  </div>
                </div>

                <div className="receipt-total-bar">
                  <span>مبلغ کل تسویه شده:</span>
                  <strong>{formatToman(selectedReceipt.amount)}</strong>
                </div>

                <div className="receipt-note">
                  <label>بابت / توضیحات:</label>
                  <p>{selectedReceipt.description}</p>
                </div>

                <div className="receipt-signatures">
                  <div className="sign-box">
                    <span>امضاء استاد / دریافت کننده</span>
                    <div className="sign-line"></div>
                  </div>
                  <div className="sign-box">
                    <span>مهر و امضاء امور مالی فناوران فردا</span>
                    <div className="sign-line"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer no-print">
              <button
                className="btn-secondary"
                onClick={() => setSelectedReceipt(null)}
              >
                بستن
              </button>
              <button className="btn-primary" onClick={handlePrintReceipt}>
                <FaPrint /> چاپ فیش واریز
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
