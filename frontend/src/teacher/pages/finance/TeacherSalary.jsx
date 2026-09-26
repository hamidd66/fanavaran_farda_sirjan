import React, { useState, useMemo, useRef } from "react";
import {
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiFilter,
  FiRotateCcw,
  FiPrinter,
  FiEye,
  FiX,
  FiFileText,
  FiTrendingUp,
  FiAlertCircle,
  FiCreditCard,
  FiLayers,
  FiChevronDown
} from "react-icons/fi";
import "../../styles/TeacherSalary.css";

// فرمت‌کننده اعداد و ارقام به تومان فارسی
const formatToman = (amount) => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("fa-IR").format(num);
};

// داده‌های اولیه کارکرد و دوره‌های استاد
const INITIAL_COURSES_DATA = [
  {
    id: "c-101",
    courseCode: "FE-201",
    courseTitle: "توسعه فرانت‌اند با React و Tailwind",
    term: "تابستان ۱۴۰۵",
    teacherName: "حمید پورفریدونی",
    ratePerSession: 450000, // نرخ هر جلسه به تومان
    totalSessions: 20, // کل جلسات تعریف شده
    heldSessions: 20, // جلسات برگزار شده (حضور و غیاب شده)
    status: "finalized", // 'active' | 'finalized'
    paymentStatus: "unpaid", // 'paid' | 'unpaid'
    lastSessionDate: "۱۴۰۵/۰۶/۱۰",
    startDate: "۱۴۰۵/۰۴/۰۱",
    endDate: "۱۴۰۵/۰۶/۱۰",
    sessionLogs: [
      { sessionNum: 1, date: "۱۴۰۵/۰۴/۰۱", topic: "مقدمات کامپوننت‌ها و JSX", status: "held" },
      { sessionNum: 2, date: "۱۴۰۵/۰۴/۰۵", topic: "هوک useState و مدیریت فرم‌ها", status: "held" },
      { sessionNum: 3, date: "۱۴۰۵/۰۴/۰۹", topic: "مدیریت اثرات با useEffect", status: "held" },
      { sessionNum: 4, date: "۱۴۰۵/۰۴/۱۴", topic: "آشنایی با هوک‌های بهینه‌سازی useMemo", status: "held" },
      { sessionNum: 20, date: "۱۴۰۵/۰۶/۱۰", topic: "پروژه جامع پایانی و ارزیابی نهایی", status: "held" }
    ]
  },
  {
    id: "c-102",
    courseCode: "PY-301",
    courseTitle: "برنامه‌نویسی پایتون و جنگو (Django)",
    term: "تابستان ۱۴۰۵",
    teacherName: "حمید پورفریدونی",
    ratePerSession: 500000,
    totalSessions: 24,
    heldSessions: 14,
    status: "active",
    paymentStatus: "in_progress",
    lastSessionDate: "۱۴۰۵/۰۶/۲۰",
    startDate: "۱۴۰۵/۰۵/۰۱",
    endDate: "۱۴۰۵/۰۷/۱۵",
    sessionLogs: [
      { sessionNum: 1, date: "۱۴۰۵/۰۵/۰۱", topic: "راه‌اندازی محیط و معماری MVT", status: "held" },
      { sessionNum: 2, date: "۱۴۰۵/۰۵/۰۶", topic: "مدل‌ها و پایگاه‌داده ORM", status: "held" },
      { sessionNum: 14, date: "۱۴۰۵/۰۶/۲۰", topic: "سیستم احراز هویت کاربران", status: "held" }
    ]
  },
  {
    id: "c-103",
    courseCode: "NET-401",
    courseTitle: "توسعه وب با C# و ASP.NET Core",
    term: "بهار ۱۴۰۵",
    teacherName: "حمید پورفریدونی",
    ratePerSession: 550000,
    totalSessions: 22,
    heldSessions: 22,
    status: "finalized",
    paymentStatus: "paid",
    settlementDate: "۱۴۰۵/۰۴/۱۵",
    trackingCode: "TRX-884219",
    startDate: "۱۴۰۵/۰۱/۲۰",
    endDate: "۱۴۰۵/۰۳/۳۰",
    sessionLogs: [
      { sessionNum: 1, date: "۱۴۰۵/۰۱/۲۰", topic: "اصول C# پیشرفته و LINQ", status: "held" },
      { sessionNum: 22, date: "۱۴۰۵/۰۳/۳۰", topic: "استقرار و پیاده‌سازی Web API", status: "held" }
    ]
  },
  {
    id: "c-104",
    courseCode: "AI-105",
    courseTitle: "مبانی هوش مصنوعی و یادگیری ماشین",
    term: "تابستان ۱۴۰۵",
    teacherName: "حمید پورفریدونی",
    ratePerSession: 600000,
    totalSessions: 18,
    heldSessions: 8,
    status: "active",
    paymentStatus: "in_progress",
    lastSessionDate: "۱۴۰۵/۰۶/۱۸",
    startDate: "۱۴۰۵/۰۵/۱۰",
    endDate: "۱۴۰۵/۰۷/۲۵",
    sessionLogs: [
      { sessionNum: 1, date: "۱۴۰۵/۰۵/۱۰", topic: "مفاهیم ماتریس‌ها در NumPy", status: "held" },
      { sessionNum: 8, date: "۱۴۰۵/۰۶/۱۸", topic: "رگرسیون خطی و پیش‌بینی داده‌ها", status: "held" }
    ]
  }
];

export default function TeacherFinance() {
  const [coursesList] = useState(INITIAL_COURSES_DATA);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'finalized'
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all' | 'unpaid' | 'paid' | 'in_progress'
  const [selectedCourseForReceipt, setSelectedCourseForReceipt] = useState(null);
  const [selectedCourseForLogs, setSelectedCourseForLogs] = useState(null);

  const printAreaRef = useRef(null);

  // فیلتر کردن هوشمند لیست کلاس‌ها
  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      const matchSearch =
        c.courseTitle.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        c.courseCode.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        c.term.toLowerCase().includes(searchTerm.trim().toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : c.status === statusFilter;

      const matchPayment =
        paymentFilter === "all"
          ? true
          : paymentFilter === "unpaid"
          ? c.status === "finalized" && c.paymentStatus === "unpaid"
          : paymentFilter === "paid"
          ? c.status === "finalized" && c.paymentStatus === "paid"
          : c.paymentStatus === "in_progress";

      return matchSearch && matchStatus && matchPayment;
    });
  }, [coursesList, searchTerm, statusFilter, paymentFilter]);

  // شاخص‌های کلیدی آماری (KPIs)
  const stats = useMemo(() => {
    let totalHeldSessions = 0;
    let pendingClaimAmount = 0;
    let totalSettledAmount = 0;
    let finalizedCoursesCount = 0;
    let activeCoursesCount = 0;

    coursesList.forEach((c) => {
      totalHeldSessions += c.heldSessions;
      const courseEarned = c.heldSessions * c.ratePerSession;

      if (c.status === "finalized") {
        finalizedCoursesCount += 1;
        if (c.paymentStatus === "unpaid") {
          pendingClaimAmount += courseEarned;
        } else if (c.paymentStatus === "paid") {
          totalSettledAmount += courseEarned;
        }
      } else {
        activeCoursesCount += 1;
      }
    });

    return {
      totalHeldSessions,
      pendingClaimAmount,
      totalSettledAmount,
      finalizedCoursesCount,
      activeCoursesCount,
      totalCourses: coursesList.length
    };
  }, [coursesList]);

  // ریست فیلترها
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  // دستور چاپ
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="teacher-finance-wrapper" dir="rtl">
      {/* هدر صفحه */}
      <header className="page-header">
        <div className="header-info">
          <div className="header-title-badge ">
            <h1 className="text-white">مدیریت مالی و کارکرد اساتید</h1>
          </div>
          <p className="header-subtitle">
            محاسبه خودکار دستمزد جلسات بر اساس حضور و غیاب ثبت‌شده، پیگیری مطالبات و فیش‌های تسویه
          </p>
        </div>
      </header>

      {/* کارت‌های شاخص عملکرد (KPI Cards) */}
      <div className="kpi-grid">
        <div className="kpi-card highlight-orange">
          <div className="kpi-icon-box">
            <FiAlertCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">مجموع مطالبات (طلبکار)</span>
            <strong className="kpi-value text-orange">
              {formatToman(stats.pendingClaimAmount)}
            </strong>
            <span className="kpi-subtext">از دوره‌های پایان‌یافته تسویه‌نشده</span>
          </div>
        </div>

        <div className="kpi-card highlight-green">
          <div className="kpi-icon-box">
            <FiCheckCircle />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">مجموع تسویه‌شده</span>
            <strong className="kpi-value text-green">
              {formatToman(stats.totalSettledAmount)}
            </strong>
            <span className="kpi-subtext">واریز شده به حساب استاد</span>
          </div>
        </div>

        <div className="kpi-card highlight-blue">
          <div className="kpi-icon-box">
            <FiCalendar />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">کل جلسات برگزار شده</span>
            <strong className="kpi-value">
              {formatNumber(stats.totalHeldSessions)} جلسه
            </strong>
            <span className="kpi-subtext">مبنای حضور و غیاب‌های قطعی</span>
          </div>
        </div>

        <div className="kpi-card highlight-purple">
          <div className="kpi-icon-box">
            <FiLayers />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">وضعیت دوره‌ها</span>
            <strong className="kpi-value">
              {formatNumber(stats.activeCoursesCount)} جاری / {formatNumber(stats.finalizedCoursesCount)} اتمام
            </strong>
            <span className="kpi-subtext">از مجموع {formatNumber(stats.totalCourses)} دوره آموزشی</span>
          </div>
        </div>
      </div>

      {/* نوار فیلتر و جستجو */}
      <div className="filter-toolbar">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="جستجو در عنوان دوره، کد کلاس یا ترم تحصیلی..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
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
            >
              <option value="all">تمام وضعیت‌های دوره</option>
              <option value="active">در حال برگزاری</option>
              <option value="finalized">پایان‌یافته</option>
            </select>
            <FiChevronDown className="arrow-icon" />
          </div>

          <div className="select-wrapper">
            <FiCreditCard className="select-icon" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">تمام وضعیت‌های مالی</option>
              <option value="unpaid">طلبکار (تسویه‌نشده)</option>
              <option value="paid">تسویه شده</option>
              <option value="in_progress">در جریان (دوره‌های جاری)</option>
            </select>
            <FiChevronDown className="arrow-icon" />
          </div>

          {(searchTerm || statusFilter !== "all" || paymentFilter !== "all") && (
            <button
              className="btn-reset-filter"
              onClick={handleResetFilters}
              title="بازنشانی فیلترها"
            >
              <FiRotateCcw />
              <span>پاکسازی</span>
            </button>
          )}
        </div>
      </div>

      {/* جدول داده‌ها */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="finance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>مشخصات دوره و ترم</th>
                <th>نرخ هر جلسه</th>
                <th>جلسات برگزار شده</th>
                <th>وضعیت دوره</th>
                <th>وضعیت مالی</th>
                <th>مبلغ کارکرد / طلبکاری</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c, index) => {
                  const isFinalized = c.status === "finalized";
                  const totalEarned = c.heldSessions * c.ratePerSession;
                  const isPaid = c.paymentStatus === "paid";

                  return (
                    <tr key={c.id} className={!isFinalized ? "row-active-course" : ""}>
                      <td className="col-idx">{formatNumber(index + 1)}</td>
                      <td>
                        <div className="course-title-cell">
                          <strong>{c.courseTitle}</strong>
                          <div className="course-badges">
                            <span className="code-tag">{c.courseCode}</span>
                            <span className="term-tag">{c.term}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="rate-text">{formatToman(c.ratePerSession)}</span>
                      </td>
                      <td>
                        <div className="sessions-progress-cell">
                          <div className="sessions-count-text">
                            <strong>{formatNumber(c.heldSessions)}</strong> از {formatNumber(c.totalSessions)} جلسه
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className={`progress-bar-fill ${
                                isFinalized ? "fill-green" : "fill-blue"
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  (c.heldSessions / c.totalSessions) * 100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {isFinalized ? (
                          <span className="status-badge finalized">
                            <FiCheckCircle /> پایان‌یافته
                          </span>
                        ) : (
                          <span className="status-badge in-progress">
                            <FiClock /> در حال برگزاری
                          </span>
                        )}
                      </td>
                      <td>
                        {!isFinalized ? (
                          <span className="finance-badge pending-calc">
                            در جریان (محاسبه پس از اتمام)
                          </span>
                        ) : isPaid ? (
                          <span className="finance-badge settled">
                            <FiCheckCircle /> تسویه شده
                          </span>
                        ) : (
                          <span className="finance-badge creditor">
                            <FiAlertCircle /> طلبکار
                          </span>
                        )}
                      </td>
                      <td>
                        {isFinalized ? (
                          <div className="amount-cell">
                            <strong
                              className={`amount-text ${
                                isPaid ? "text-green" : "text-orange"
                              }`}
                            >
                              {formatToman(totalEarned)}
                            </strong>
                            {isPaid && (
                              <span className="settle-meta">
                                پیگیری: {c.trackingCode}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="in-progress-note">
                            {formatToman(totalEarned)} (تاکنون)
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="action-btn view-logs"
                            title="مشاهده ریز جلسات ثبت‌شده"
                            onClick={() => setSelectedCourseForLogs(c)}
                          >
                            <FiEye />
                            <span>ریز جلسات</span>
                          </button>

                          {isFinalized && (
                            <button
                              className="action-btn view-receipt"
                              title="مشاهده و چاپ فیش کارکرد"
                              onClick={() => setSelectedCourseForReceipt(c)}
                            >
                              <FiFileText />
                              <span>فیش کارکرد</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state-cell">
                    <div className="empty-state">
                      <FiSearch className="empty-icon" />
                      <p>هیچ کلاسی با معیارهای انتخابی پیدا نشد.</p>
                      <button
                        className="btn-outline"
                        onClick={handleResetFilters}
                      >
                        پاکسازی فیلترها
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال مشاهده ریز جلسات حضور و غیاب */}
      {selectedCourseForLogs && (
        <div className="modal-backdrop">
          <div className="modal-box modal-medium">
            <div className="modal-header">
              <div className="modal-header-title">
                <FiCalendar className="modal-icon text-blue" />
                <div>
                  <h3>ریز جلسات برگزار شده</h3>
                  <span className="modal-sub">
                    {selectedCourseForLogs.courseTitle} ({selectedCourseForLogs.courseCode})
                  </span>
                </div>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedCourseForLogs(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body">
              <div className="course-quick-info">
                <div>
                  <span>نرخ هر جلسه:</span>{" "}
                  <strong>{formatToman(selectedCourseForLogs.ratePerSession)}</strong>
                </div>
                <div>
                  <span>جلسات ثبت‌شده:</span>{" "}
                  <strong>
                    {formatNumber(selectedCourseForLogs.heldSessions)} از{" "}
                    {formatNumber(selectedCourseForLogs.totalSessions)} جلسه
                  </strong>
                </div>
                <div>
                  <span>کارکرد محاسبه‌شده:</span>{" "}
                  <strong>
                    {formatToman(
                      selectedCourseForLogs.heldSessions *
                        selectedCourseForLogs.ratePerSession
                    )}
                  </strong>
                </div>
              </div>

              <div className="logs-list">
                {selectedCourseForLogs.sessionLogs.map((log) => (
                  <div key={log.sessionNum} className="log-item">
                    <div className="log-idx">جلسه {formatNumber(log.sessionNum)}</div>
                    <div className="log-details">
                      <span className="log-topic">{log.topic}</span>
                      <span className="log-date">{log.date}</span>
                    </div>
                    <span className="log-status held">
                      <FiCheckCircle /> برگزار شده
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setSelectedCourseForLogs(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال فیش کارکرد و تسویه مالی با قابلیت پرینت */}
      {selectedCourseForReceipt && (
        <div className="modal-backdrop">
          <div className="modal-box modal-receipt">
            <div className="modal-header no-print">
              <div className="modal-header-title">
                <FiFileText className="modal-icon text-green" />
                <div>
                  <h3>فیش رسمی کارکرد و تسویه دوره</h3>
                  <span className="modal-sub">آموزشگاه کامپیوتر فناوران فردا سیرجان</span>
                </div>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedCourseForReceipt(null)}
              >
                <FiX />
              </button>
            </div>

            {/* بخش قابل پرینت فیش */}
            <div className="modal-body print-area" ref={printAreaRef}>
              <div className="receipt-paper">
                <div className="receipt-header">
                  <div className="receipt-org">
                    <h2>آموزشگاه فناوری اطلاعات و کامپیوتر فناوران فردا</h2>
                    <p>سیرجان، بلوار سیدجمال، جنب بازار صدف — تلفن: ۰۹۰۵۰۹۵۸۷۱۵</p>
                  </div>
                  <div className="receipt-badge">
                    <span>فیش کارکرد دوره آموزشی</span>
                    <small>تاریخ صدور: {new Date().toLocaleDateString("fa-IR")}</small>
                  </div>
                </div>

                <hr className="receipt-divider" />

                <div className="receipt-grid">
                  <div className="receipt-item">
                    <label>نام مدرس:</label>
                    <span>{selectedCourseForReceipt.teacherName}</span>
                  </div>
                  <div className="receipt-item">
                    <label>عنوان دوره:</label>
                    <span>{selectedCourseForReceipt.courseTitle}</span>
                  </div>
                  <div className="receipt-item">
                    <label>کد استاندارد دوره:</label>
                    <span>{selectedCourseForReceipt.courseCode}</span>
                  </div>
                  <div className="receipt-item">
                    <label>ترم تحصیلی:</label>
                    <span>{selectedCourseForReceipt.term}</span>
                  </div>
                  <div className="receipt-item">
                    <label>تاریخ پایان کلاس:</label>
                    <span>{selectedCourseForReceipt.endDate}</span>
                  </div>
                  <div className="receipt-item">
                    <label>وضعیت تسویه مالی:</label>
                    <strong
                      className={
                        selectedCourseForReceipt.paymentStatus === "paid"
                          ? "text-green"
                          : "text-orange"
                      }
                    >
                      {selectedCourseForReceipt.paymentStatus === "paid"
                        ? "تسویه شده"
                        : "طلبکار (در نوبت واریز)"}
                    </strong>
                  </div>
                </div>

                <div className="receipt-calc-box">
                  <table className="receipt-calc-table">
                    <thead>
                      <tr>
                        <th>شرح محاسبه</th>
                        <th>تعداد جلسات</th>
                        <th>نرخ مصوب هر جلسه</th>
                        <th>مبلغ کل (تومان)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>کارکرد حق‌التدریس بر اساس حضور و غیاب قطعی</td>
                        <td>{formatNumber(selectedCourseForReceipt.heldSessions)} جلسه</td>
                        <td>{formatToman(selectedCourseForReceipt.ratePerSession)}</td>
                        <td>
                          <strong>
                            {formatToman(
                              selectedCourseForReceipt.heldSessions *
                                selectedCourseForReceipt.ratePerSession
                            )}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="receipt-total-bar">
                  <span>مبلغ قابل پرداخت نهایی:</span>
                  <strong>
                    {formatToman(
                      selectedCourseForReceipt.heldSessions *
                        selectedCourseForReceipt.ratePerSession
                    )}
                  </strong>
                </div>

                <div className="receipt-signatures">
                  <div className="sign-box">
                    <span>امضاء و تایید امور مالی</span>
                    <div className="sign-line"></div>
                  </div>
                  <div className="sign-box">
                    <span>امضاء مدیریت آموزشگاه (حمید پورفریدونی)</span>
                    <div className="sign-line"></div>
                  </div>
                  <div className="sign-box">
                    <span>امضاء و رویت استاد</span>
                    <div className="sign-line"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer no-print">
              <button className="btn-primary" onClick={handlePrint}>
                <FiPrinter />
                <span>چاپ فیش رسمی</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => setSelectedCourseForReceipt(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
