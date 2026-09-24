import React, { useState, useMemo } from "react";
import {
  FiBookOpen,
  FiUsers,
  FiClock,
  FiSearch,
  FiFilter,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiX,
  FiAward,
  FiRotateCcw,
  FiCheckCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiPhone,
  FiDownloadCloud,
  FiUserCheck,
  FiStar
} from "react-icons/fi";
import "../../styles/StudentsList.css";

// ۱. لیست دوره‌ها به همراه داده‌های کامل هنرجویان ثبت‌نام‌شده
const COURSES_WITH_STUDENTS = [
  {
    id: "CRS-101",
    title: "توسعه وب Full-Stack با React و Node.js",
    category: "برنامه‌نویسی وب",
    type: "حضوری",
    room: "سایت شماره ۱ (سیرجان)",
    schedule: "شنبه و چهارشنبه - ۱۶:۰۰ الی ۱۸:۳۰",
    capacity: 20,
    progress: 75,
    status: "active",
    startDate: "۱۴۰۳/۰۴/۱۵",
    endDate: "۱۴۰۳/۰۷/۳۰",
    avgGpa: "۱۸.۴",
    attendanceAvg: "۹۲٪",
    students: [
      {
        id: "STD-4011",
        name: "علی رضایی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        attendance: 95,
        classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "ممتاز",
        financialStatus: "تسویه کامل",
        lastActivity: "دیروز ۱۸:۳۰"
      },
      {
        id: "STD-4012",
        name: "فاطمه حسینی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        attendance: 90,
        classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "ممتاز",
        financialStatus: "تسویه کامل",
        lastActivity: "۲ ساعت قبل"
      },
      {
        id: "STD-4013",
        name: "محمد امین پورمهدی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        attendance: 78,
        classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "نیازمند تمرین",
        financialStatus: "قسط دوم مانده",
        lastActivity: "۳ روز قبل"
      },
      {
        id: "STD-4014",
        name: "زهرا صادقی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
        attendance: 88,
       classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "در حال پیشرفت",
        financialStatus: "تسویه کامل",
        lastActivity: "امروز ۱۰:۱۵"
      }
    ]
  },
  {
    id: "CRS-102",
    title: "هوش مصنوعی و یادگیری ماشین با Python",
    category: "هوش مصنوعی و داده",
    type: "آنلاین",
    room: "استودیو آنلاین فردا",
    schedule: "یکشنبه و سه‌شنبه - ۱۸:۳۰ الی ۲۰:۳۰",
    capacity: 25,
    progress: 40,
    status: "active",
    startDate: "۱۴۰۳/۰۵/۰۱",
    endDate: "۱۴۰۳/۰۸/۱۵",
    avgGpa: "۱۸.۹",
    attendanceAvg: "۹۶٪",
    students: [
      {
        id: "STD-5021",
        name: "امیرحسین ابراهیمی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
        attendance: 98,
       classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "ممتاز",
        financialStatus: "تسویه کامل",
        lastActivity: "آنلاین"
      },
      {
        id: "STD-5022",
        name: "سارا معتمدی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
        attendance: 92,
        classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "در حال پیشرفت",
        financialStatus: "تسویه کامل",
        lastActivity: "دیروز"
      }
    ]
  },
  {
    id: "CRS-103",
    title: "طراحی و توسعه با C# و ASP.NET Core",
    category: "بک‌اند سازمانی",
    type: "حضوری",
    room: "سایت شماره ۲",
    schedule: "دوشنبه و پنج‌شنبه - ۱۵:۰۰ الی ۱۷:۳۰",
    capacity: 15,
    progress: 100,
    status: "completed",
    startDate: "۱۴۰۳/۰۱/۲۰",
    endDate: "۱۴۰۳/۰۴/۱۰",
    avgGpa: "۱۷.۹",
    attendanceAvg: "۸۹٪",
    students: [
      {
        id: "STD-3011",
        name: "نوید شجاعی",
        melli: "3071873468",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        attendance: 94,
        classscore:20,
        midtermScore: 19.5,
        finalscore: 18.75,
        finalGpa: 19.1,
        status: "ممتاز",
        financialStatus: "تسویه کامل",
        lastActivity: "فارغ‌التحصیل"
      }
    ]
  },
  {
    id: "CRS-104",
    title: "الگوریتم‌ها و آمادگی مسابقات برنامه‌نویسی",
    category: "المپیاد و مسابقات",
    type: "ترکیبی",
    room: "سالن سمینار و دیسکورد",
    schedule: "جمعه‌ها - ۰۹:۰۰ الی ۱۳:۰۰",
    capacity: 15,
    progress: 15,
    status: "upcoming",
    startDate: "۱۴۰۳/۰۷/۰۱",
    endDate: "۱۴۰۳/۱۰/۱۵",
    avgGpa: "---",
    attendanceAvg: "۱۰۰٪",
    students: []
  }
];







const CourseStudentsManager = () => {


 const [selectedCourse, setSelectedCourse] = useState(null);

  // ۲. تعریف Stateهای فیلتر و جستجوی داخل مودال (در صورت نیاز)
  const [modalSearch, setModalSearch] = useState("");
  const [modalStatusFilter, setModalStatusFilter] = useState("all");
    
  const [courses] = useState(COURSES_WITH_STUDENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // دوره‌ای که مودال لیست هنرجویان آن باز شده است
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  // جستجو و فیلتر درون مودال هنرجویان
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");

  // کارت‌های آماری کلی
  const totalStats = useMemo(() => {
    const totalCourses = courses.length;
    const activeCount = courses.filter((c) => c.status === "active").length;
    const totalEnrolled = courses.reduce((acc, c) => acc + c.students.length, 0);
    return { totalCourses, activeCount, totalEnrolled };
  }, [courses]);

  // فیلتر دوره‌ها
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

  // فیلتر هنرجویان درون مودال فعال
  const modalStudents = useMemo(() => {
    if (!activeCourseModal) return [];
    return activeCourseModal.students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.melli.includes(studentSearch);
      const matchStatus = studentFilter === "all" || s.status === studentFilter;
      return matchSearch && matchStatus;
    });
  }, [activeCourseModal, studentSearch, studentFilter]);

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

  const getStudentStatusTag = (status) => {
    switch (status) {
      case "ممتاز":
        return <span className="tag-badge tag-success">⭐ ممتاز</span>;
      case "در حال پیشرفت":
        return <span className="tag-badge tag-info">در حال پیشرفت</span>;
      case "نیازمند تمرین":
        return <span className="tag-badge tag-warning">نیازمند تمرین</span>;
      default:
        return <span className="tag-badge">{status}</span>;
    }
  };


// فیلتر کردن هوشمند هنرجویان دوره انتخاب شده
const filteredModalStudents = (selectedCourse?.students || []).filter((std) => {
  // ۱. بررسی شرط جستجو (نام یا شماره تلفن)
  const matchesSearch = modalSearch.trim() === "" ||
    std.name?.toLowerCase().includes(modalSearch.trim().toLowerCase()) ||
    std.melli?.includes(modalSearch.trim()) ||
    std.id?.toLowerCase().includes(modalSearch.trim().toLowerCase());

  // ۲. بررسی شرط وضعیت تحصیلی
  const matchesStatus =
    modalStatusFilter === "all" ||
    (modalStatusFilter === "excellent" && std.status === "ممتاز") ||
    (modalStatusFilter === "progress" && std.status === "در حال پیشرفت") ||
    (modalStatusFilter === "needs_work" && std.status === "نیازمند تمرین") ||
    std.status === modalStatusFilter;

  return matchesSearch && matchesStatus;
});



  return (
    <div className="teacher-courses-container">
      {/* ۱. هدر صفحه */}
      <div className="courses-header">
        <div className="">
          <h1 className="courses-title">فهرست کلاس‌ها و هنرجویان</h1>
          <p className="courses-subtitle">
            مشاهده سریع دوره‌ها، مشخصات ثبت‌نام، و دسترسی کامل به پرونده آموزشی و نمرات هنرجویان هر کلاس
          </p>
        </div>
      </div>

      {/* ۲. کارت‌های آماری بالای صفحه */}
      <div className="courses-kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon kpi-icon-blue">
            <FiBookOpen size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">دوره‌های تعریف‌شده</span>
            <span className="kpi-value">{totalStats.totalCourses} <small>کلاس</small></span>
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-icon kpi-icon-green">
            <FiClock size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">کلاس‌های فعال</span>
            <span className="kpi-value">{totalStats.activeCount} <small>کلاس در جریان</small></span>
          </div>
        </div>

        <div className="kpi-card card-purple">
          <div className="kpi-icon kpi-icon-purple">
            <FiUsers size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">کل هنرجویان ثبت‌شده</span>
            <span className="kpi-value">{totalStats.totalEnrolled} <small>هنرجو</small></span>
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-icon kpi-icon-amber">
            <FiAward size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">میانگین رضایت عمومی</span>
            <span className="kpi-value">۴.۹ <small>از ۵.۰</small></span>
          </div>
        </div>
      </div>

      {/* ۳. جعبه فیلتر و جستجوی کلاس‌ها */}
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

          {(searchTerm !== "" || statusFilter !== "all" || typeFilter !== "all") && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}
            >
              <FiRotateCcw size={15} />
              <span>بازنشانی</span>
            </button>
          )}
        </div>
      </div>







      {/* ۴. جدول فهرست کلاس‌ها */}
      <div className="courses-table-card">
        <div className="table-responsive">
          <table className="courses-table">
            <thead>
              <tr>
                <th>کد و مشخصات دوره</th>
                <th>دسته‌بندی</th>
                <th>نوع برگزاری</th>
                <th style={{ textAlign: "center" }}>تعداد هنرجو</th>
                <th>پیشرفت دوره</th>
                <th>وضعیت</th>
                <th style={{ textAlign: "center" }}>لیست هنرجویان</th>
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
                    <td><span className="category-tag">{course.category}</span></td>
                    <td><span className="type-tag">{course.type}</span></td>
                    <td style={{ textAlign: "center" }}>
                      <div className="students-tag" style={{ justifyContent: "center" }}>
                        <FiUsers size={14} />
                        <span>{course.students.length} از {course.capacity} نفر</span>
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
                    <td style={{ textAlign: "center" }}>
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








{/* ======================= شروع مودال جزئیات دوره ======================= */}
{selectedCourse && (
  <div className="tc-modal-backdrop" onClick={() => setSelectedCourse(null)}>
    <div
      className="tc-modal-dialog"
      onClick={(e) => e.stopPropagation()}
      dir="rtl"
    >
      {/* هدر مودال */}
      <div className="tc-modal-header">
        <div className="tc-modal-title-wrap">
          <h2 className="tc-modal-title">
            {selectedCourse?.title || selectedCourse?.courseName || "جزئیات دوره"}
          </h2>
          <span className="tc-modal-subtitle">
            کد دوره: {selectedCourse?.code || selectedCourse?.id || "---"} | 
            بازه زمانی: {selectedCourse?.dateRange || "۱۴۰۳/۰۴/۱۵ الی ۱۴۰۳/۰۷/۳۰"}
          </span>
        </div>
        <button
          type="button"
          className="tc-modal-close-btn"
          onClick={() => setSelectedCourse(null)}
          title="بستن پنجره"
        >
          ✕
        </button>
      </div>

      {/* بدنه مودال */}
      <div className="tc-modal-body">
        {/* ۱. کارت‌های کوچک آمار بالای مودال */}
        <div className="tc-modal-kpi-grid">
          <div className="tc-modal-kpi-card">
            <div className="tc-modal-kpi-icon icon-blue">👥</div>
            <div className="tc-modal-kpi-info">
              <span className="kpi-title">تعداد هنرجویان</span>
              <span className="kpi-number">
                {selectedCourse?.studentsCount || selectedCourse?.students?.length || 4} نفر
              </span>
            </div>
          </div>

          <div className="tc-modal-kpi-card">
            <div className="tc-modal-kpi-icon icon-emerald">📈</div>
            <div className="tc-modal-kpi-info">
              <span className="kpi-title">میانگین نمرات کلاس</span>
              <span className="kpi-number text-emerald">
                {selectedCourse?.averageScore || "۱۸.۴"}
              </span>
            </div>
          </div>

          <div className="tc-modal-kpi-card">
            <div className="tc-modal-kpi-icon icon-purple">🎯</div>
            <div className="tc-modal-kpi-info">
              <span className="kpi-title">میانگین حضور</span>
              <span className="kpi-number text-purple">
                {selectedCourse?.attendanceRate || "۹۲٪"}
              </span>
            </div>
          </div>
        </div>

        {/* ۲. فیلتر و جستجوی داخل مودال */}
        <div className="tc-modal-filter-row">
          <div className="tc-modal-search">
            <input
              type="text"
              placeholder="جستجو بر اساس نام هنرجو، شماره تلفن..."
              value={modalSearch}
              onChange={(e) => setModalSearch(e.target.value)}
            />
          </div>

          <div className="tc-modal-select">
            <select
              value={modalStatusFilter}
              onChange={(e) => setModalStatusFilter(e.target.value)}
            >
              <option value="all">همه وضعیت‌های تحصیلی</option>
              <option value="excellent">ممتاز</option>
              <option value="progress">در حال پیشرفت</option>
              <option value="needs_work">نیازمند تمرین</option>
            </select>
          </div>
        </div>

        {/* ۳. جدول اطلاعات هنرجویان */}
        {/* ۳. جدول اطلاعات هنرجویان */}
<div className="tc-modal-table-container">
  <table className="tc-modal-table">
    <thead>
      <tr>
        <th>هنرجو</th>
        <th>شماره ملی</th>
        <th>درصد حضور</th>
        <th>کلاسی</th>
        <th>میان‌ترم</th>
        <th>پایان ترم</th>
        <th>معدل کل</th>
        <th>وضعیت تحصیلی</th>
      </tr>
    </thead>
    <tbody>
      {filteredModalStudents.length > 0 ? (
        filteredModalStudents.map((std) => (
          <tr key={std.id}>
            {/* ستون هنرجو با عکس و آیدی */}
            <td>
              <div className="std-cell" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {std.avatar && (
                  <img
                    src={std.avatar}
                    alt={std.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <div>
                  <span className="std-name" style={{ display: 'block', fontWeight: 600 }}>{std.name}</span>
                </div>
              </div>
            </td>

            {/* شماره تماس */}
            <td className="ltr-text">{std.melli}</td>

            {/* درصد حضور */}
            <td>
              <span className="tag-rate">{std.attendance}%</span>
            </td>

            {/* نمره کلاسی */}
            <td className="score-val blue-score">{std.classscore ?? "-"}</td>

            {/* نمره میان‌ترم */}
            <td className="score-val blue-score">{std.midtermScore ?? "-"}</td>

            {/* نمره پایان‌ترم */}
            <td className="score-val purple-score">{std.finalscore ?? "-"}</td>

            {/* معدل کل */}
            <td className="score-val total-score">{std.finalGpa ?? "-"}</td>

            {/* برچسب وضعیت تحصیلی */}
            <td>
              <span
                className={`status-pill ${
                  std.status === "ممتاز"
                    ? "status-excellent"
                    : std.status === "نیازمند تمرین"
                    ? "status-warning"
                    : "status-progress"
                }`}
              >
                {std.status === "ممتاز" && "⭐ "}
                {std.status}
              </span>
            </td>
          </tr>
        ))
      ) : (
        /* وضعیت زمانی که دوره‌ای هنرجو ندارد یا نتیجه‌ای در فیلتر یافت نشد */
        <tr>
          <td colSpan="8" style={{ textAlign: "center", padding: "32px", color: "#64748b" }}>
            {selectedCourse?.students?.length === 0
              ? "هنوز هیچ هنرجویی در این دوره ثبت‌نام نکرده است."
              : "هنرجویی با این مشخصات یافت نشد."}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

      {/* فوتر مودال */}
      <div className="tc-modal-footer">
        <button
          type="button"
          className="tc-modal-btn-secondary"
          onClick={() => setSelectedCourse(null)}
        >
          بستن پنجره
        </button>
      </div>
    </div>
  </div>
)}
{/* ======================= پایان مودال جزئیات دوره ======================= */}


    </div>
  );
};

export default CourseStudentsManager;
