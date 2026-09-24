import React from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiCode,
  FiStar,
  FiCalendar,
  FiClock,
  FiVideo,
  FiCheckCircle,
  FiPlusCircle,
  FiAward,
  FiMessageSquare,
  FiArrowLeft,
  FiAlertTriangle,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiFileText,
  FiPhoneCall,
  FiLayers,
  FiBell
} from "react-icons/fi";
// داخل TeacherDashboard.jsx (بدون تغییر در مسیر ایمپورت استایل)
import "../../styles/teacher-dashboard.css";

const TeacherDashboard = () => {
  // ۱. اطلاعات استاد
  const instructor = {
    name: "مهندس حمید پورفریدونی",
    role: "مدرس ارشد هوش مصنوعی و فول‌استک",
    term: "ترم پاییز ۱۴۰۳",
  };

  // ۲. آمار و شاخص‌های کلیدی (KPIs)
  const kpiData = {
    totalStudents: 142,      // تعداد کل هنرجویانی که تا الان کلاس داشته‌اند
    activeStudents: 62,      // تعداد هنرجویان فعال
    attendanceRate: 94.5,    // درصد حضور / فعال بودن
    averageGrade: 18.65,     // میانگین نمرات کل کلاس‌ها (از ۲۰)
    totalCourses: 12,        // تعداد کل دوره‌ها
    activeCourses: 4,        // تعداد دوره‌های فعال
    submittedAssignments: 184, // تکالیف تحویل داده شده
    overdueAssignments: 9,    // تکالیف عقب افتاده
    totalReceived: "۴۸,۵۰۰,۰۰۰", // مقدار دریافتی
    pendingBalance: "۱۲,۴۰۰,۰۰۰", // مبلغ طلبکار از آموزشگاه
    rating: 4.9,             // امتیاز نظرسنجی
    ratingPercent: 98,       // درصد رضایت کل هنرجویان
    totalVotes: 118,         // تعداد شرکت‌کنندگان در نظرسنجی
  };

  // ۳. برنامه کلاس‌های امروز
  const todayClasses = [
    {
      id: 1,
      courseTitle: "توسعه وب فول‌استک (React + Django)",
      time: "۱۶:۰۰ - ۱۸:۰۰",
      room: "کلاس ۲۰۴ - حضوری",
      studentsCount: 18,
      status: "upcoming",
    },
    {
      id: 2,
      courseTitle: "مبانی الگوریتم و هوش مصنوعی با پایتون",
      time: "۱۸:۳۰ - ۲۰:۳۰",
      room: "اتاق مجازی ۱ (Live)",
      studentsCount: 24,
      status: "live-ready",
    },
  ];

  // ۴. لیست هنرجویان وضعیت قرمز (غیبت زیاد یا نمره پایین)
  const redFlagStudents = [
    {
      id: 201,
      name: "رضا کریمی",
      course: "React & Redux",
      issue: "۳ جلسه غیبت متوالی",
      grade: 11.5,
      type: "attendance", // غیبت
    },
    {
      id: 202,
      name: "مریم ابراهیمی",
      course: "پایتون و هوش مصنوعی",
      issue: "افت نمره آزمون (کمتر از ۱۲)",
      grade: 10.0,
      type: "grade", // نمره
    },
    {
      id: 203,
      name: "علی اصغری",
      course: "توسعه وب فول‌استک",
      issue: "عدم تحویل ۳ تکلیف اخیر + ۲ غیبت",
      grade: 12.25,
      type: "both",
    },
  ];

  // ۵. پیام‌های مهم مدیریت
  const adminMessages = [
    {
      id: 301,
      sender: "مدیریت آموزشگاه (مهندس پورفریدونی)",
      title: "جلسه هماهنگی اساتید گروه برنامه‌نویسی",
      date: "امروز - ۱۰:۳۰",
      text: "لطفا نمرات میان‌ترم دوره‌های پایتون و ری‌اکت را تا پایان هفته در سامانه ثبت نهایی فرمایید.",
      priority: "high",
    },
    {
      id: 302,
      sender: "واحد آموزش",
      title: "ارزیابی منتورها و کارگاه تخصصی جمعه",
      date: "دیروز - ۱۶:۰۰",
      text: "لینک روم آنلاین کارگاه الگوریتم پیشرفته در پنل اساتید فعال گردید.",
      priority: "normal",
    },
  ];

  // ۶. تکالیف در انتظار بررسی (Code Review)
  const pendingReviews = [
    {
      id: 101,
      studentName: "امیرحسین رضایی",
      course: "React & Redux",
      assignment: "پروژه فروشگاه با Redux Toolkit",
      date: "۱۰ دقیقه پیش",
      avatar: "AR",
    },
    {
      id: 102,
      studentName: "سارا محمدی",
      course: "Python Backend",
      assignment: "پیاده‌سازی احراز هویت با JWT",
      date: "۱ ساعت پیش",
      avatar: "SM",
    },
  ];

  return (
    <div className="teacher-dashboard-container" dir="rtl">
      {/* ۱. بنر خوش‌آمدگویی استاد */}
      <div className="teacher-welcome-card">
        <div className="welcome-text-side">
          <h2>سلام، {instructor.name} 👋</h2>
          <p>
            امروز <strong>{todayClasses.length} جلسه آموزشی</strong> فعال دارید و{" "}
            <strong>{pendingReviews.length} پروژه و تکلیف</strong> منتظر بررسی شما هستند. همچنین{" "}
            <strong style={{ color: "#ef4444" }}>{redFlagStudents.length} هنرجو در وضعیت هشدار</strong> قرار دارند.
          </p>
        </div>
      </div>

      {/* ۲. ردیف کارت‌های آماری اصلی (اصلی‌ترین KPIs) */}
      <div className="teacher-kpi-grid">
        {/* کارت کل و فعال هنرجویان */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box emerald">
            <FiUsers />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">هنرجویان (کل / فعال)</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.activeStudents}</span>
              <span className="kpi-unit">از {kpiData.totalStudents} نفر کل</span>
            </div>
          </div>
        </div>

        {/* درصد حضور و فعال بودن */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box indigo">
            <FiActivity />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">درصد حضور / فعالیت</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.attendanceRate}٪</span>
              <span className="kpi-unit">میانگین کل</span>
            </div>
          </div>
        </div>

        {/* میانگین نمرات */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box amber">
            <FiAward />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">میانگین نمرات کل</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.averageGrade}</span>
              <span className="kpi-unit">از ۲۰</span>
            </div>
          </div>
        </div>

        {/* وضعیت دوره‌ها */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box purple" style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}>
            <FiLayers />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">دوره‌ها (فعال / کل)</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.activeCourses}</span>
              <span className="kpi-unit">از {kpiData.totalCourses} دوره</span>
            </div>
          </div>
        </div>
      </div>

      {/* ۳. ردیف دوم کارت‌های آماری (تکالیف + مالی + نظرسنجی) */}
      <div className="teacher-kpi-grid" style={{ marginTop: "-8px" }}>
        {/* تکالیف تحویل داده / عقب‌افتاده */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box amber">
            <FiCode />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">تکالیف تحویلی / عقب‌افتاده</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.submittedAssignments}</span>
              <span className="kpi-unit" style={{ color: "#ef4444", fontWeight: 700 }}>
                ({kpiData.overdueAssignments} عقب‌افتاده)
              </span>
            </div>
          </div>
        </div>

        {/* وضعیت مالی اساتید */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box emerald">
            <FiDollarSign />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">دریافتی / طلبکار (تومان)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ fontSize: "1.05rem" }}>{kpiData.pendingBalance}</span>
              <span className="kpi-unit">طلب از آموزشگاه</span>
            </div>
          </div>
        </div>

        {/* نظرسنجی هنرجویان */}
        <div className="teacher-kpi-card">
          <div className="kpi-icon-box rose">
            <FiStar />
          </div>
          <div className="kpi-info-box">
            <span className="kpi-title">رضایت هنرجویان</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{kpiData.rating}</span>
              <span className="kpi-unit">({kpiData.ratingPercent}٪ از {kpiData.totalVotes} نظر)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ۴. بخش اصلی داشبورد (برنامه امروز + پیام مدیریت + وضعیت قرمز) */}
      <div className="dashboard-main-grid">
        {/* ستون راست (کلاس‌های امروز + لیست هنرجویان وضعیت قرمز) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* برنامه کلاس‌های امروز */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <FiCalendar color="#6366f1" /> برنامه کلاس‌های امروز
              </h3>
              <Link to="/teacher/courses" className="card-header-link">
                مشاهده تمام دوره‌ها <FiArrowLeft />
              </Link>
            </div>

            <div className="today-classes-list">
              {todayClasses.map((item) => (
                <div key={item.id} className="class-schedule-item">
                  <div className="class-main-meta">
                    <div className="class-time-tag">{item.time}</div>
                    <div className="class-details">
                      <h4>{item.courseTitle}</h4>
                      <span>
                        <FiClock /> {item.room} • {item.studentsCount} هنرجو
                      </span>
                    </div>
                  </div>
                  <div className="class-action-btns">
                    <Link
                      to="/teacher/attendance"
                      className="btn-class-action btn-attendance"
                    >
                      حضور و غیاب
                    </Link>
                    {item.status === "live-ready" ? (
                      <Link
                        to="/teacher/live-room"
                        className="btn-class-action btn-live"
                      >
                        ورود به کلاس
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* هنرجویان وضعیت قرمز (غیبت زیاد یا نمره پایین) */}
          <div className="dash-card" style={{ borderRight: "4px solid #ef4444" }}>
            <div className="dash-card-header">
              <h3 style={{ color: "#b91c1c" }}>
                <FiAlertTriangle color="#ef4444" /> هنرجویان وضعیت قرمز (نیازمند پیگیری)
              </h3>
              <Link to="/teacher/students" className="card-header-link">
                لیست کل <FiArrowLeft />
              </Link>
            </div>

            <div className="pending-reviews-list">
              {redFlagStudents.map((st) => (
                <div key={st.id} className="review-item" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
                  <div className="review-student-info">
                    <div className="student-avatar-circle" style={{ backgroundColor: "#fee2e2", color: "#dc2626" }}>
                      !
                    </div>
                    <div>
                      <h5 style={{ color: "#991b1b" }}>{st.name} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}>({st.course})</span></h5>
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>{st.issue} • نمره: {st.grade}</span>
                    </div>
                  </div>
                  <Link to="/teacher/grades" className="btn-review-code" style={{ backgroundColor: "#dc2626", color: "#fff", borderColor: "#dc2626" }}>
                    بررسی کارنامه
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ستون چپ (پیام‌های مدیر + تکالیف در انتظار بررسی + عملیات سریع) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* پیام‌های مهم مدیریت */}
          <div className="dash-card" style={{ borderRight: "4px solid #3b82f6" }}>
            <div className="dash-card-header">
              <h3>
                <FiBell color="#2563eb" /> پیام‌های مهم مدیریت
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {adminMessages.map((msg) => (
                <div key={msg.id} style={{
                  padding: "12px",
                  borderRadius: "8px",
                  backgroundColor: msg.priority === "high" ? "#eff6ff" : "#f8fafc",
                  border: "1px solid",
                  borderColor: msg.priority === "high" ? "#bfdbfe" : "#e2e8f0",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "0.875rem", color: "#1e293b" }}>{msg.title}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{msg.date}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                    {msg.text}
                  </p>
                  <div style={{ marginTop: "6px", fontSize: "0.725rem", color: "#2563eb", fontWeight: 600 }}>
                    فرستنده: {msg.sender}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* پروژه‌ها و تکالیف جدید نیازمند بررسی */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <FiCode color="#f59e0b" /> کد ریویو و تمرین‌های ارسالی
              </h3>
              <Link to="/teacher/assignments" className="card-header-link">
                همه <FiArrowLeft />
              </Link>
            </div>

            <div className="pending-reviews-list">
              {pendingReviews.map((rev) => (
                <div key={rev.id} className="review-item">
                  <div className="review-student-info">
                    <div className="student-avatar-circle">{rev.avatar}</div>
                    <div>
                      <h5>{rev.studentName}</h5>
                      <span>{rev.assignment}</span>
                    </div>
                  </div>
                  <Link to="/teacher/assignments" className="btn-review-code">
                    بررسی کد
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* دسترسی‌های سریع */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>
                <FiPlusCircle color="#10b981" /> عملیات سریع
              </h3>
            </div>

            <div className="quick-actions-grid">
              <Link to="/teacher/assignments" className="quick-action-card">
                <FiCode className="qa-icon" />
                <h5>تعریف تکلیف</h5>
                <span>ایجاد پروژه جدید</span>
              </Link>
              <Link to="/teacher/grades" className="quick-action-card">
                <FiAward className="qa-icon" />
                <h5>ثبت نمرات</h5>
                <span>میان‌ترم و پایان‌ترم</span>
              </Link>
              <Link to="/teacher/salary" className="quick-action-card">
                <FiDollarSign className="qa-icon" />
                <h5>صورتحساب مالی</h5>
                <span>مشاهده دریافتی‌ها</span>
              </Link>
              <Link to="/teacher/messages" className="quick-action-card">
                <FiMessageSquare className="qa-icon" />
                <h5>پیام‌ها</h5>
                <span>ارتباط با هنرجویان</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
