import React, { useState, useMemo } from "react";
import {
  FiBookOpen,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiX,
  FiAward,FiRotateCcw,FiLayers,
  FiTrendingUp,   // <-- اضافه شود
  FiStar,         // <-- اضافه شود
  FiDollarSign    // <-- اضافه شود
} from "react-icons/fi";
import "../../styles/teacher-courses.css";

// داده‌های نمونه مرتبط با سرفصل‌های تخصصی آموزشگاه فناوران فردا
const INITIAL_COURSES = [
  {
    id: "CRS-101",
    title: "توسعه وب Full-Stack با React و Node.js",
    category: "برنامه‌نویسی وب",
    type: "حضوری",
    room: "سایت شماره ۱ (سیرجان)",
    schedule: "شنبه و چهارشنبه - ۱۶:۰۰ الی ۱۸:۳۰",
    studentsCount: 18,
    capacity: 20,
    progress: 75,
    status: "active", // active | upcoming | completed
    startDate: "۱۴۰۳/۰۴/۱۵",
    endDate: "۱۴۰۳/۰۷/۳۰",
    description: "آموزش صفر تا صد معماری فرانت‌اند و بک‌اند به همراه اجرای پروژه واقعی فروشگاهی."
  },
  {
    id: "CRS-102",
    title: "هوش مصنوعی و یادگیری ماشین با Python",
    category: "هوش مصنوعی و داده",
    type: "آنلاین",
    room: "استودیو آنلاین فردا",
    schedule: "یکشنبه و سه‌شنبه - ۱۸:۳۰ الی ۲۰:۳۰",
    studentsCount: 25,
    capacity: 25,
    progress: 40,
    status: "active",
    startDate: "۱۴۰۳/۰۵/۰۱",
    endDate: "۱۴۰۳/۰۸/۱۵",
    description: "مفاهیم ماتریس‌ها، پایتون پیشرفته، کار با کتابخانه‌های Scikit-Learn و شبکه‌های عصبی."
  },
  {
    id: "CRS-103",
    title: "طراحی و توسعه با C# و ASP.NET Core",
    category: "بک‌اند سازمانی",
    type: "حضوری",
    room: "سایت شماره ۲",
    schedule: "دوشنبه و پنج‌شنبه - ۱۵:۰۰ الی ۱۷:۳۰",
    studentsCount: 14,
    capacity: 15,
    progress: 100,
    status: "completed",
    startDate: "۱۴۰۳/۰۱/۲۰",
    endDate: "۱۴۰۳/۰۴/۱۰",
    description: "پیاده‌سازی معماری تمیز (Clean Architecture)، میکروسرویس‌ها و بانک‌های اطلاعاتی SQL Server."
  },
  {
    id: "CRS-104",
    title: "الگوریتم‌ها و آمادگی مسابقات برنامه‌نویسی",
    category: "المپیاد و مسابقات",
    type: "ترکیبی",
    room: "سالن سمینار و دیسکورد",
    schedule: "جمعه‌ها - ۰۹:۰۰ الی ۱۳:۰۰",
    studentsCount: 12,
    capacity: 15,
    progress: 15,
    status: "upcoming",
    startDate: "۱۴۰۳/۰۷/۰۱",
    endDate: "۱۴۰۳/۱۰/۱۵",
    description: "حل مسئله پیشرفته، ساختمان داده‌ها، گراف و برنامه‌ریزی پویا ویژه آمادگی مسابقات کشوری."
  }
];

const TeacherCourses = () => {
  const [courses] = useState(INITIAL_COURSES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);

  // محاسبات کارت‌های آماری (KPIs)
  const stats = useMemo(() => {
    const total = courses.length;
    const active = courses.filter((c) => c.status === "active").length;
    const totalStudents = courses.reduce((acc, c) => acc + c.studentsCount, 0);
    const completed = courses.filter((c) => c.status === "completed").length;
    return { total, active, totalStudents, completed };
  }, [courses]);


  // بررسی اینکه آیا فیلتری اعمال شده یا خیر
const isFiltered = searchTerm !== "" || statusFilter !== "all" || typeFilter !== "all";

// تابع پاک‌سازی و ریست کردن همه فیلترها
const handleResetFilters = () => {
  setSearchTerm("");
  setStatusFilter("all");
  setTypeFilter("all");
};

  // فیلتر کردن هوشمند
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchType = typeFilter === "all" || c.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [courses, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge badge-active">در حال برگزاری</span>;
      case "upcoming":
        return <span className="badge badge-upcoming">به‌زودی</span>;
      case "completed":
        return <span className="badge badge-completed">تکمیل شده</span>;
      default:
        return null;
    }
  };

  return (
    <div className="teacher-courses-container">
      {/* ۱. هدر صفحه */}
      <div className="courses-header">
        <div className="courses-header-content">
          <h1 className="courses-title">کلاس‌های من</h1>
          <p className="courses-subtitle">
            مدیریت جلسات، نظارت بر پیشرفت سرفصل‌ها و مشاهده مشخصات هنرجویان کلاس‌های فعال و پیشین
          </p>
        </div>
      </div>

           {/* ۲. سکشن کارت‌های آماری */}
      <div className="courses-kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon kpi-icon-blue">
            <FiBookOpen size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">کل کلاس‌ها</span>
            <span className="kpi-value">{stats.total} <small>دوره</small></span>
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-icon kpi-icon-green">
            <FiClock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">کلاس‌های در جریان</span>
            <span className="kpi-value">{stats.active} <small>کلاس فعال</small></span>
          </div>
        </div>

        <div className="kpi-card card-purple">
          <div className="kpi-icon kpi-icon-purple">
            <FiUsers size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">مجموع هنرجویان</span>
            <span className="kpi-value">{stats.totalStudents} <small>نفر</small></span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon kpi-icon-amber">
            <FiUsers size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">دوره‌های تکمیل‌شده</span>
            <span className="kpi-value">{stats.completed} <small>دوره</small></span>
          </div>
        </div>
      </div>


      {/* ۳. سکشن تحلیل عملکرد و کلاس‌های نیازمند توجه */}
      <div className="courses-analytics-grid">
        {/* ستون راست: نرخ قبولی و عملکرد کلاس‌ها */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-title">درصد قبولی و پیشرفت دوره‌ها</h3>
              <p className="analytics-subtitle">میانگین قبولی و بازدهی هنرجویان بر اساس ارزیابی‌ها</p>
            </div>
            <span className="analytics-badge success-badge">میانگین کل: ۸۸٪</span>
          </div>

          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">برنامه‌نویسی پایتون و جنگو (کد ۱۰۲)</span>
                <span className="course-rate success-text">۹۴٪ قبولی</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-emerald" style={{ width: "94%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">فرانت‌اند جامع و React (کد ۱۱۵)</span>
                <span className="course-rate info-text">۸۶٪ قبولی</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-blue" style={{ width: "86%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">الگوریتم و حل مسئله مسابقات (کد ۹۸)</span>
                <span className="course-rate warning-text">۷۲٪ قبولی</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-amber" style={{ width: "72%" }}></div>
              </div>
            </div>

            <div className="progress-item">
              <div className="progress-info">
                <span className="course-name">هوش مصنوعی و یادگیری ماشین (کد ۱۰۸)</span>
                <span className="course-rate primary-text">۹۰٪ قبولی</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill fill-purple" style={{ width: "90%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* ستون چپ: کلاس‌های نیازمند تمرکز و کار بیشتر */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div>
              <h3 className="analytics-title">کلاس‌های نیازمند تمرکز بیشتر</h3>
              <p className="analytics-subtitle">کلاس‌هایی که میانگین نمرات یا حضور پایینی دارند</p>
            </div>
            <span className="analytics-badge alert-badge">۲ مورد اولویت‌دار</span>
          </div>

          <div className="attention-list">
            <div className="attention-item alert-border">
              <div className="attention-details">
                <div className="attention-header">
                  <span className="attention-title">الگوریتم و حل مسئله مسابقات (کد ۹۸)</span>
                  <span className="attention-tag tag-danger">افت نمرات کوییز</span>
                </div>
                <p className="attention-desc">
                  ۳۸٪ از هنرجویان در مبحث داینامیک پروگرمینگ نیاز به جلسه جبرانی و حل تمرین بیشتر دارند.
                </p>
              </div>
            </div>

            <div className="attention-item warning-border">
              <div className="attention-details">
                <div className="attention-header">
                  <span className="attention-title">سی‌شارپ و پایگاه داده ASP.NET (کد ۸۴)</span>
                  <span className="attention-tag tag-warning">تاخیر در ارسال پروژه</span>
                </div>
                <p className="attention-desc">
                  مهلت ارسال پروژه فاز اول پایان یافته و ۵ هنرجو هنوز تمرین پایگاه‌داده را تحویل نداده‌اند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>








            {/* ۳. سکشن فیلتر و جستجو */}
      <div className="courses-filter-panel">
        <div className="search-box">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="جستجو در عنوان دوره، دسته و کد کلاس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setSearchTerm("")}
              title="پاک کردن جستجو"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-selects">
          <div className="select-wrapper">
            <FiFilter className="select-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">در حال برگزاری</option>
              <option value="upcoming">به‌زودی</option>
              <option value="completed">پایان‌یافته</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">همه شیوه‌ها</option>
              <option value="حضوری">حضوری</option>
              <option value="آنلاین">آنلاین</option>
              <option value="ترکیبی">ترکیبی</option>
            </select>
          </div>

          {/* دکمه بازنشانی - فقط زمانی که فیلتری تغییر کرده باشد ظاهر می‌شود */}
          {isFiltered && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={handleResetFilters}
              title="بازنشانی تمام فیلترها"
            >
              <FiRotateCcw size={15} />
              <span>بازنشانی فیلترها</span>
            </button>
          )}
        </div>
      </div>


      {/* ۴. جدول مدرن دوره‌ها */}
      <div className="courses-table-card">
        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th>کد و مشخصات دوره</th>
                <th>دسته‌بندی</th>
                <th>نوع برگزاری</th>
                <th>هنرجویان</th>
                <th>پیشرفت دوره</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <div className="course-cell-title">
                        <span className="course-id">{course.id}</span>
                        <span className="course-name">{course.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{course.category}</span>
                    </td>
                    <td>
                      <span className="type-tag">{course.type}</span>
                    </td>
                    <td>
                      <div className="students-tag">
                        <FiUsers size={14} />
                        <span>
                          {course.studentsCount} از {course.capacity}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{course.progress}٪</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(course.status)}</td>
                    <td>
                      <button
                        type="button"
                        className="details-btn"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <FiEye size={15} />
                        <span>جزئیات</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    کلاسی با این مشخصات یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

           {/* ۵. مودال پاپ‌آپ جامع و تحلیلی جزئیات کلاس */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-card modal-analytics-card" onClick={(e) => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="modal-header">
              <div className="modal-header-text">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>{selectedCourse.title}</h3>
                  <span className="modal-id">{selectedCourse.id}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  شناسنامه آموزشی و گزارش عملکرد کلاس
                </span>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedCourse(null)}
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* بخش ۱: اطلاعات پایه و مشخصات برگزاری (ساختار اصلی شما) */}
              <div className="modal-grid">
                <div className="modal-info-item">
                  <FiMapPin className="info-icon" />
                  <div>
                    <span className="info-title">محل برگزاری:</span>
                    <span className="info-desc">{selectedCourse.room || 'سایت آموزشگاه'}</span>
                  </div>
                </div>

                <div className="modal-info-item">
                  <FiClock className="info-icon" />
                  <div>
                    <span className="info-title">زمان‌بندی جلسات:</span>
                    <span className="info-desc">{selectedCourse.schedule}</span>
                  </div>
                </div>

                <div className="modal-info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <span className="info-title">بازه برگزاری:</span>
                    <span className="info-desc">
                      {selectedCourse.startDate} تا {selectedCourse.endDate}
                    </span>
                  </div>
                </div>

                <div className="modal-info-item">
                  <FiAward className="info-icon" />
                  <div>
                    <span className="info-title">نوع و وضعیت:</span>
                    <span className="info-desc">
                      {selectedCourse.type || 'پروژه‌محور'} | {getStatusBadge && getStatusBadge(selectedCourse.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* نوار پیشرفت دوره شما */}
              <div className="modal-footer-progress" style={{ margin: '14px 0', padding: '12px 16px', background: '#131d35', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem' }}>پیشرفت کلی سرفصل‌های تدریس شده:</span>
                <div className="progress-bar-bg modal-bar" style={{ flex: 1, margin: '0 12px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${selectedCourse.progress || 0}%`, background: '#38bdf8' }}
                  ></div>
                </div>
                <strong style={{ color: '#38bdf8' }}>{selectedCourse.progress || 0}٪</strong>
              </div>

              {/* بخش ۲: شاخص‌های تحلیلی ۴ گانه کلاس */}
              <div className="analytics-metrics-grid">
                
                {/* کارت ۱: عملکرد آموزشی */}
                <div className="metric-box">
                  <div className="metric-header">
                    <FiTrendingUp className="text-cyan" />
                    <span>عملکرد آموزشی</span>
                  </div>
                  <div className="metric-stat">
                    <strong>{selectedCourse.metrics?.gpa || '۱۸.۴'}</strong>
                    <span>معدل کل (GPA)</span>
                  </div>
                  <div className="metric-sub">
                    <span>تحویل پروژه‌ها: <strong>{selectedCourse.metrics?.projectCompletion || 88}٪</strong></span>
                    <span className="metric-tag success">{selectedCourse.metrics?.pacing || '+۲ جلسه جلوتر'}</span>
                  </div>
                </div>

                {/* کارت ۲: تعامل و مشارکت */}
                <div className="metric-box">
                  <div className="metric-header">
                    <FiUsers className="text-emerald" />
                    <span>مشارکت و حضور</span>
                  </div>
                  <div className="metric-stat">
                    <strong style={{ color: '#34d399' }}>{selectedCourse.metrics?.attendanceRate || 94}٪</strong>
                    <span>حضور منظم</span>
                  </div>
                  <div className="metric-sub">
                    <span>رفع اشکال Q&A: <strong>{selectedCourse.metrics?.qaResolvedCount || 138} سوال</strong></span>
                    <span>پاسخگویی سریع</span>
                  </div>
                </div>

                {/* کارت ۳: رضایت هنرجویان */}
                <div className="metric-box">
                  <div className="metric-header">
                    <FiStar className="text-amber" />
                    <span>کیفیت و رضایت (CSAT)</span>
                  </div>
                  <div className="metric-stat">
                    <strong style={{ color: '#fbbf24' }}>★ {selectedCourse.metrics?.csatScore || '۴.۸'}</strong>
                    <span>از ۵.۰</span>
                  </div>
                  <div className="metric-sub">
                    <span>نرخ ریزش: <strong>{selectedCourse.metrics?.dropoutRate || 5}٪</strong></span>
                    <span className="metric-tag gold">وفاداری بالا</span>
                  </div>
                </div>

                                {/* کارت ۴: مقایسه با کل کلاس‌های این تخصص */}
                <div className="metric-box">
                  <div className="metric-header">
                    <FiLayers className="text-cyan" />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>رتبه در کل دوره‌ها:</span>
                  </div>

                  {/* آیتم ۱: رتبه این کلاس در بین همه دوره‌ها */}
                  <div className="metric-stat" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ fontSize: '1.25rem', color: '#38bdf8' }}>
                        {selectedCourse.metrics?.rankInSpecialty || 'رتبه ۲ از ۱۲'}
                      </strong>
                    </div>
                    <span className="metric-tag info" style={{ fontSize: '0.7rem' }}>
                      {selectedCourse.metrics?.percentileRank || 'جزو ۱۰٪ برتر'}
                    </span>
                  </div>

                  {/* آیتم ۲: وضعیت نسبت به میانگین نمرات */}
                  <div className="metric-sub" style={{ marginTop: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>نسبت به میانگین نمرات:</span>
                      <span className="metric-tag success" style={{ fontWeight: '600' }}>
                        {selectedCourse.metrics?.vsHistoryGpa || '↑ ۱.۴ نمره بالاتر'}
                      </span>
                    </div>
                  </div>
                </div>



              </div>

              {/* بخش ۳: نمودار میله‌ای توزیع نمرات */}
              <div className="modal-chart-section">
                <div className="chart-title-row">
                  <span>📊 نمودار توزیع نمرات هنرجویان</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ظرفیت: {selectedCourse.enrolledCount || 20} نفر</span>
                </div>
                <div className="mini-histogram">
                  {[
                    { range: '۰ - ۱۰', count: 1, percent: 5, color: '#ef4444' },
                    { range: '۱۰ - ۱۴', count: 2, percent: 12, color: '#f59e0b' },
                    { range: '۱۴ - ۱۷', count: 8, percent: 45, color: '#38bdf8' },
                    { range: '۱۷ - ۲۰', count: 9, percent: 50, color: '#10b981' },
                  ].map((bar, idx) => (
                    <div className="hist-col" key={idx}>
                      <span className="hist-num">{bar.count} نفر</span>
                      <div className="hist-bar-track">
                        <div className="hist-bar-fill" style={{ height: `${bar.percent * 1.3 + 8}px`, backgroundColor: bar.color }}></div>
                      </div>
                      <span className="hist-lbl">{bar.range}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* توضیحات و اهداف دوره (بخش اصلی شما) */}
              {selectedCourse.description && (
                <div className="modal-desc-box" style={{ marginTop: '16px' }}>
                  <h4>توضیحات و اهداف دوره:</h4>
                  <p>{selectedCourse.description}</p>
                </div>
              )}

            </div>

            {/* فوتر دکمه‌ها */}
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setSelectedCourse(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherCourses;
