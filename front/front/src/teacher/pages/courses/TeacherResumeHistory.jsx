import React, { useState, useMemo } from "react";
import {
  FiAward,
  FiBookOpen,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiStar,
  FiBriefcase,
  FiCheckCircle,
  FiCalendar,
  FiSearch,
  FiFilter,
  FiRotateCcw,
  FiEye,
  FiX
} from "react-icons/fi";
import "../../styles/TeacherResumeHistory.css";

// ۱. اطلاعات پایه و شناسنامه استاد در آموزشگاه فناوران فردا
const TEACHER_INFO = {
  name: "مهندس حمید پورفریدونی",
  title: "مدرس ارشد هوش مصنوعی و فول‌استک",
  rankText: "رتبه ۱ از ۳۲ استاد آموزشگاه",
  rankPercentile: "جزو ۳٪ برتر اساتید",
  experience: "۵ سال همکاری مستمر",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  totalStudents: 854,
  totalCoursesHeld: 24,
  activeCourses: 3,
  totalHours: 1420,
  csatScore: "۴.۹",
  retentionRate: "۹۶٪",
  financials: {
    totalEarnings: "۴۸۵,۰۰۰,۰۰۰",
    teachingSalary: "۳۱۰,۰۰۰,۰۰۰",
    projectShares: "۱۷۵,۰۰۰,۰۰۰",
    pendingSettlement: "۲۸,۵۰۰,۰۰۰",
    lastSettlementDate: "۱۴۰۳/۰۶/۱۵"
  }
};

// ۲. تاریخچه و سوابق تمام دوره‌های تدریس شده
const COURSE_HISTORY = [
  {
    id: "CRS-101",
    title: "توسعه وب Full-Stack با React و Node.js",
    category: "فرانت‌اند و وب",
    studentsCount: 22,
    hours: 80,
    gpa: "۱۸.۶",
    csat: "۴.۹",
    earnings: "۲۲,۰۰۰,۰۰۰",
    status: "active",
    type: "تدریس حضوری",
    term: "تابستان ۱۴۰۳"
  },
  {
    id: "CRS-102",
    title: "هوش مصنوعی، یادگیری ماشین و شبکه‌های عصبی با پایتون",
    category: "هوش مصنوعی و داده",
    studentsCount: 28,
    hours: 100,
    gpa: "۱۸.۹",
    csat: "۵.۰",
    earnings: "۳۵,۰۰۰,۰۰۰",
    status: "active",
    type: "تدریس آنلاین",
    term: "تابستان ۱۴۰۳"
  },
  {
    id: "CRS-089",
    title: "پیاده‌سازی پلتفرم مدیریت سفارشات صنعتی (پروژه برون‌سپاری)",
    category: "مشارکت در پروژه",
    studentsCount: 5,
    hours: 120,
    gpa: "۱۹.۲",
    csat: "۴.۸",
    earnings: "۵۵,۰۰۰,۰۰۰",
    status: "completed",
    type: "سهم از پروژه تجاری",
    term: "بهار ۱۴۰۳"
  },
  {
    id: "CRS-074",
    title: "الگوریتم‌های پیشرفته و آمادگی المپیاد و مسابقات کدنویسی",
    category: "المپیاد و مسابقات",
    studentsCount: 16,
    hours: 60,
    gpa: "۱۷.۸",
    csat: "۴.۷",
    earnings: "۱۸,۰۰۰,۰۰۰",
    status: "completed",
    type: "تدریس ترکیبی",
    term: "زمستان ۱۴۰۲"
  },
  {
    id: "CRS-055",
    title: "معماری میکروسرویس و بک‌اند با C# ASP.NET Core",
    category: "بک‌اند سازمانی",
    studentsCount: 19,
    hours: 90,
    gpa: "۱۸.۱",
    csat: "۴.۹",
    earnings: "۲۶,۰۰۰,۰۰۰",
    status: "completed",
    type: "تدریس حضوری",
    term: "پاییز ۱۴۰۲"
  }
];

const TeacherProfile = () => {
  const [courses] = useState(COURSE_HISTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const isFiltered = searchTerm !== "" || categoryFilter !== "all";

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
  };

  const filteredHistory = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === "all" || c.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [courses, searchTerm, categoryFilter]);

  return (
    <div className="teacher-profile-container">
      
      {/* ۱. هدر پروفایل و کارت هویت استاد */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          <div className="profile-avatar-wrapper">
            <img src={TEACHER_INFO.avatarUrl} alt={TEACHER_INFO.name} className="profile-avatar" />
            <span className="profile-badge-icon" title="استاد برتر"><FiAward /></span>
          </div>

          <div className="profile-hero-info">
            <div className="profile-title-row">
              <h2>{TEACHER_INFO.name}</h2>
              <span className="rank-pill gold-pill">{TEACHER_INFO.rankText}</span>
              <span className="rank-pill cyan-pill">{TEACHER_INFO.rankPercentile}</span>
            </div>
            <p className="profile-role-text">{TEACHER_INFO.title} • <span style={{ color: '#94a3b8' }}>{TEACHER_INFO.experience}</span></p>

            <div className="profile-tags-row">
              <span className="honor-tag"><FiStar className="text-amber" /> رضایت هنرجویان: {TEACHER_INFO.csatScore} از ۵.۰</span>
              <span className="honor-tag"><FiCheckCircle className="text-emerald" /> ماندگاری هنرجو: {TEACHER_INFO.retentionRate}</span>
              <span className="honor-tag"><FiClock className="text-cyan" /> مجموع ساعات تدریس: {TEACHER_INFO.totalHours} ساعت</span>
            </div>
          </div>
        </div>

        {/* جعبه مالی سریع در هدر */}
        <div className="profile-hero-finance">
          <span className="finance-lead-label">مجموع کارکرد مالی (تدریس + پروژه‌ها)</span>
          <strong className="finance-lead-amount">{TEACHER_INFO.financials.totalEarnings} <small>تومان</small></strong>
          <div className="finance-mini-status">
            <span>در انتظار تسویه: <strong>{TEACHER_INFO.financials.pendingSettlement} تومان</strong></span>
          </div>
        </div>
      </div>

      {/* ۲. کارت‌های آماری KPI */}
      <div className="profile-kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon kpi-icon-blue">
            <FiBookOpen size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">کل دوره‌ها و پروژه‌ها</span>
            <span className="kpi-value">{TEACHER_INFO.totalCoursesHeld} <small>دوره موفق</small></span>
          </div>
        </div>

        <div className="kpi-card card-purple">
          <div className="kpi-icon kpi-icon-purple">
            <FiUsers size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">مجموع دانش‌آموختگان</span>
            <span className="kpi-value">{TEACHER_INFO.totalStudents} <small>هنرجو</small></span>
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-icon kpi-icon-green">
            <FiDollarSign size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">درآمد از تدریس</span>
            <span className="kpi-value">{TEACHER_INFO.financials.teachingSalary} <small>تومان</small></span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon kpi-icon-amber">
            <FiBriefcase size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">سهم مشارکت پروژه‌ها</span>
            <span className="kpi-value">{TEACHER_INFO.financials.projectShares} <small>تومان</small></span>
          </div>
        </div>
      </div>

      {/* ۳. مقایسه جایگاه استاد در آموزشگاه */}
      <div className="profile-standing-grid">
        {/* کارت مقایسه عملکردی با سایر اساتید */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-title">شاخص‌های مقایسه‌ای در میان ۳۲ استاد آموزشگاه</h3>
              <p className="analytics-subtitle">جایگاه کیفی و انضباطی استاد نسبت به میانگین کل مجموعه</p>
            </div>
            <span className="analytics-badge success-badge">سطح: Senior Master</span>
          </div>

          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">امتیاز رضایت‌مندی هنرجویان (CSAT)</span>
                <span className="course-rate success-text">۴.۹ (بالاتر از میانگین ۴.۲)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-emerald" style={{ width: "98%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">درصد اشتغال به کار هنرجویان در صنعت</span>
                <span className="course-rate info-text">۸۲٪ (میانگین آموزشگاه: ۶۱٪)</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-blue" style={{ width: "82%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">تسریع در سرفصل و تحویل پروژه‌های عملی</span>
                <span className="course-rate primary-text">۹۴٪ پایبندی به تقویم آموزشی</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-purple" style={{ width: "94%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">نرخ ثبت‌نام مجدد هنرجویان در دوره‌های بعدی</span>
                <span className="course-rate success-text">۷۶٪ وفاداری هنرجویان</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-emerald" style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* کارت تفکیک مالی و تسویه‌حساب */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-title">تفکیک منابع درآمدی و تسویه</h3>
              <p className="analytics-subtitle">سهم حق‌التدریس در برابر درآمدهای پروژه‌ای</p>
            </div>
          </div>

          <div className="finance-split-chart">
            <div className="split-visual-bar">
              <div className="seg-teaching" style={{ width: "64%" }} title="حق‌التدریس: ۶۴٪"></div>
              <div className="seg-projects" style={{ width: "36%" }} title="سهم پروژه: ۳۶٪"></div>
            </div>

            <div className="split-legend">
              <div className="legend-item">
                <span className="dot dot-emerald"></span>
                <div className="legend-text">
                  <span>حق‌التدریس دوره‌ها (۶۴٪)</span>
                  <strong>{TEACHER_INFO.financials.teachingSalary} تومان</strong>
                </div>
              </div>

              <div className="legend-item">
                <span className="dot dot-cyan"></span>
                <div className="legend-text">
                  <span>پروژه‌ها و منتورینگ تجاری (۳۶٪)</span>
                  <strong>{TEACHER_INFO.financials.projectShares} تومان</strong>
                </div>
              </div>
            </div>

            <div className="settlement-box">
              <div className="settlement-row">
                <span>آخرین تسویه‌حساب مالی:</span>
                <strong>{TEACHER_INFO.financials.lastSettlementDate}</strong>
              </div>
              <div className="settlement-row">
                <span>وضعیت حسابداری:</span>
                <span className="text-emerald" style={{ fontWeight: 'bold' }}>تسویه منظم بدون تاخیر ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ۴. جستجو و فیلتر سوابق تدریس */}
      <div className="courses-header" style={{ marginTop: '24px' }}>
        <div className="courses-header-content">
          <h3 className="courses-title" style={{ fontSize: '1.25rem' }}>کارنامه و تاریخچه تمام کلاس‌ها و پروژه‌ها</h3>
          <p className="courses-subtitle">سوابق دقیق دوره‌های برگزار شده، نمرات، رضایت و درآمد هر دوره</p>
        </div>
      </div>

      <div className="courses-filter-panel">
        <div className="search-box">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="جستجو در عنوان دوره، کد دوره و..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-btn" onClick={() => setSearchTerm("")}>✕</button>
          )}
        </div>

        <div className="filter-selects">
          <div className="select-wrapper">
            <FiFilter className="select-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">همه حوزه‌ها</option>
              <option value="هوش مصنوعی و داده">هوش مصنوعی و داده</option>
              <option value="فرانت‌اند و وب">فرانت‌اند و وب</option>
              <option value="بک‌اند سازمانی">بک‌اند سازمانی</option>
              <option value="المپیاد و مسابقات">المپیاد و مسابقات</option>
              <option value="مشارکت در پروژه">مشارکت در پروژه</option>
            </select>
          </div>

          {isFiltered && (
            <button type="button" className="reset-filters-btn" onClick={handleResetFilters}>
              <FiRotateCcw size={15} />
              <span>بازنشانی فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* ۵. جدول جامع سوابق استاد */}
      <div className="courses-table-card">
        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th>کد و نام دوره / پروژه</th>
                <th>دسته‌بندی و نوع</th>
                <th>ترم / بازه</th>
                <th>هنرجویان</th>
                <th>ساعات</th>
                <th>معدل هنرجویان</th>
                <th>امتیاز CSAT</th>
                <th>کارکرد مالی</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="course-cell-title">
                        <span className="course-id">{item.id}</span>
                        <span className="course-name">{item.title}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="category-tag">{item.category}</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.type}</span>
                      </div>
                    </td>
                    <td className="text-center"><span className="term-tag">{item.term}</span></td>
                    <td>
                      <div className="students-tag">
                        <FiUsers size={14} />
                        <span>{item.studentsCount} نفر</span>
                      </div>
                    </td>
                    <td>{item.hours} ساعت</td>
                    <td><strong style={{ color: '#38bdf8' }}>{item.gpa}</strong></td>
                    <td>
                      <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>★ {item.csat}</span>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399', fontSize: '0.88rem' }}>{item.earnings} <small>تومان</small></strong>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="details-btn"
                        onClick={() => setSelectedItem(item)}
                      >
                        <FiEye size={15} />
                        <span>پرونده</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">
                    موردی با این مشخصات در سوابق استاد یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ۶. مودال نمایش پرونده جزئیات هر دوره یا پروژه */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-card modal-analytics-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-text">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3>{selectedItem.title}</h3>
                  <span className="modal-id">{selectedItem.id}</span>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px", display: "block" }}>
                  سوابق تفصیلی آموزشی و مالی این عنوان
                </span>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedItem(null)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <span className="info-title">دوره / ترم:</span>
                    <span className="info-desc">{selectedItem.term}</span>
                  </div>
                </div>
                <div className="modal-info-item">
                  <FiClock className="info-icon" />
                  <div>
                    <span className="info-title">مدت زمان:</span>
                    <span className="info-desc">{selectedItem.hours} ساعت تدریس</span>
                  </div>
                </div>
                <div className="modal-info-item">
                  <FiStar className="info-icon" />
                  <div>
                    <span className="info-title">رضایت‌سنجی:</span>
                    <span className="info-desc">★ {selectedItem.csat} از ۵.۰</span>
                  </div>
                </div>
                <div className="modal-info-item">
                  <FiDollarSign className="info-icon" />
                  <div>
                    <span className="info-title">درآمد خالص این مورد:</span>
                    <span className="info-desc" style={{ color: '#34d399', fontWeight: 'bold' }}>{selectedItem.earnings} تومان</span>
                  </div>
                </div>
              </div>

              <div className="modal-desc-box" style={{ marginTop: "16px" }}>
                <h4>گزارش بازخورد و ارزیابی کیفیت:</h4>
                <p>
                  این کلاس با نرخ قبولی ۹۵٪ به پایان رسیده و تمام هنرجویان پروژه‌های پایانی خود را در موعد مقرر تحویل داده‌اند. بازخورد کلاسی حاکی از تسلط بالای مدرس بر مفاهیم و شیوه انتقال روان مباحث بوده است.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedItem(null)}>
                بستن پرونده
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherProfile;
