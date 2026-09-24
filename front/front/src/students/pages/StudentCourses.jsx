import React, { useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiHelpCircle,
  FiLayers,
  FiCalendar,
  FiFileText,
  FiUploadCloud,
  FiX,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiLock,
  FiPaperclip,
  FiTrash2,
  FiDownload,
  FiVideo,
  FiCode,
  FiEye
} from "react-icons/fi";
import "../styles/StudentCourses.css";

const StudentCourses = () => {
  const [activeTab, setActiveTab] = useState("all");

  // مودال‌ها
  const [syllabusModalCourse, setSyllabusModalCourse] = useState(null);
  const [faqModalCourse, setFaqModalCourse] = useState(null);
  const [assignmentsModalCourse, setAssignmentsModalCourse] = useState(null);
  const [contentModalCourse, setContentModalCourse] = useState(null);

  // وضعیت باز/بسته بودن جلسات در مودال‌ها
  const [expandedSession, setExpandedSession] = useState(null);

  // استیت بارگذاری تکالیف (تفکیک به ازای هر دوره و جلسه)
  const [assignmentFiles, setAssignmentFiles] = useState({});
  const [assignmentTexts, setAssignmentTexts] = useState({});
  const [submittedStatus, setSubmittedStatus] = useState({});

  // استیت فرم FAQ
  const [faqTab, setFaqTab] = useState("list");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [faqSubmitSuccess, setFaqSubmitSuccess] = useState(false);

  // داده‌های نقشه راه
  const roadmapSteps = [
    { id: 1, title: "مبانی وب و جاوااسکریپت", sub: "HTML5, CSS3, Modern JS", status: "completed" },
    { id: 2, title: "توسعه فرانت‌اند با React", sub: "Hooks, SPA, Redux, Next.js", status: "active" },
    { id: 3, title: "توسعه وب‌سرویس پایتون", sub: "جنگو، REST API و پایگاه داده", status: "active" },
    { id: 4, title: "پروژه صنعتی و ورود به بازار", sub: "پروژه‌های تجاری و گواهینامه معتبر", status: "locked" },
  ];

  // دیتابیس کامل دوره‌ها
  const [coursesData] = useState([
    {
      id: 1,
      title: "متخصص فرانت‌اند مدرن (React & Next.js)",
      instructor: "مهندس پورفریدونی",
      code: "FF-FE-104",
      status: "in-progress",
      level: "پیشرفته",
      progress: 70,
      completedSessions: 17,
      totalSessions: 24,
      days: "یکشنبه و سه‌شنبه",
      time: "۱۸:۳۰ الی ۲۰:۳۰",
      iconBg: "#eff6ff",
      iconColor: "#2563eb",
      syllabus: [
        {
          chapter: "فصل ۱: پایه‌ها و معماری کامپوننت‌محور",
          topics: ["JSX و رندرینگ مجازی", "Props و مدیریت State", "فرم‌ها و اعتبارسنجی"],
        },
        {
          chapter: "فصل ۲: هوک‌های عمیق (Advanced React)",
          topics: ["useEffect و کارایی چرخه حیات", "useMemo و useCallback", "طراحی Custom Hooks"],
        },
      ],
      faqs: [
        {
          q: "آیا ویدیوهای ضبط‌شده هر جلسه بلافاصله در دسترس است؟",
          a: "بله، حداکثر ظرف ۲ ساعت پس از پایان هر جلسه کدهای سورس و ویدیو در بخش محتوای جلسات قرار می‌گیرد.",
        },
      ],
      sessions: [
        {
          num: 1,
          title: "جلسه ۱: راه‌اندازی پروژه با Vite و کامپوننت‌های پایه",
          date: "۱۴۰۳/۰۵/۰۱",
          summary: "نصب و پیکربندی Node.js، آشنایی با محیط Vite، ساختار استاندارد پروژه‌های ری‌اکت و کامپوننت‌های تو در تو.",
          hasAssignment: true,
          assignmentType: "attachment", // 'attachment' یا 'text-only'
          assignmentTitle: "ساخت کامپوننت کارت محصول با Props پویا",
          assignmentDesc: "با توجه به فایل ضمیمه تمرین، یک کامپوننت کارت محصول مدرن بسازید که مشخصات، تخفیف و دکمه خرید را از Props دریافت کند.",
          teacherAttachment: {
            name: "Homework-01-Assets.zip",
            size: "3.2 MB",
            url: "#",
          },
          resources: [
            { type: "video", title: "ویدیوی کامل جلسه (کیفیت 1080p)", size: "۴۲۰ مگابایت" },
            { type: "code", title: "سورس کدهای تدریس‌شده (GitHub / ZIP)", size: "۱.۴ مگابایت" },
            { type: "doc", title: "جزوه و اسلایدهای آموزشی (PDF)", size: "۴.۵ مگابایت" },
          ],
        },
        {
          num: 2,
          title: "جلسه ۲: مدیریت State و کار با useState پیشرفته",
          date: "۱۴۰۳/۰۵/۰۵",
          summary: "مفهوم تغییرناپذیری در استیت‌ها، کار با فرم‌های کنترل‌شده، مدیریت استیت آبجکت‌ها و آرایه‌ها.",
          hasAssignment: true,
          assignmentType: "text-only", // فقط توضیح بدون فایل استاد
          assignmentTitle: "پیاده‌سازی فرم ثبت‌نام پویا همراه با تایید رمز عبور",
          assignmentDesc: "فرمی طراحی کنید که کاربر در لحظه تکرار رمز عبور را تایپ کرده و در صورت عدم تطابق با رمز اصلی، ارور به رنگ قرمز نمایش داده شود. پروژه را در قالب فایل ZIP ارسال کنید.",
          teacherAttachment: null,
          resources: [
            { type: "video", title: "ویدیوی جلسه دوم", size: "۳۸۰ مگابایت" },
            { type: "code", title: "پروژه تمرینی کلاس (ZIP)", size: "۸۵۰ کیلوبایت" },
          ],
        },
        {
          num: 3,
          title: "جلسه ۳: درک عمیق هوک useEffect و واکشی داده از API",
          date: "۱۴۰۳/۰۵/۰۹",
          summary: "آرایه وابستگی‌ها، جلوگیری از Memory Leak، کار با هوک‌های پاکسازی و اتصال به سرور تست.",
          hasAssignment: false, // بدون تکلیف
          assignmentType: "no-task",
          assignmentTitle: "",
          assignmentDesc: "",
          teacherAttachment: null,
          resources: [
            { type: "video", title: "ویدیوی جلسه سوم", size: "۴۱۰ مگابایت" },
            { type: "doc", title: "خلاصه نکات چرخه حیات (PDF)", size: "۲.۱ مگابایت" },
          ],
        },
        {
          num: 4,
          title: "جلسه ۴: بهینه‌سازی عملکرد با useMemo و useCallback",
          date: "۱۴۰۳/۰۵/۱۵",
          summary: "بررسی Profiler در React DevTools و جلوگیری از رندرهای سنگین و غیرضروری.",
          hasAssignment: true,
          assignmentType: "attachment",
          assignmentTitle: "بهینه‌سازی لود لیست ۵۰۰۰ آیتمی با فیلتر آنی",
          assignmentDesc: "فایل اولیه دیتای سنگین را دانلود کنید و با استفاده از useMemo سرعت فیلتر کردن را به زیر ۱۰ میلی‌ثانیه برسانید.",
          teacherAttachment: {
            name: "LargeDataset-Assignment4.json",
            size: "1.8 MB",
            url: "#",
          },
          resources: [
            { type: "video", title: "ویدیوی آموزشی جلسه چهارم", size: "۴۶۰ مگابایت" },
            { type: "code", title: "سورس پروژه‌های بهینه‌سازی شده", size: "۲.۲ مگابایت" },
          ],
        },
      ],
    },
    {
      id: 2,
      title: "توسعه بک‌اند و وب‌سرویس با پایتون و جنگو",
      instructor: "مهندس باقری",
      code: "FF-PY-202",
      status: "in-progress",
      level: "متوسط تا پیشرفته",
      progress: 45,
      completedSessions: 10,
      totalSessions: 22,
      days: "دوشنبه و پنج‌شنبه",
      time: "۱۶:۰۰ الی ۱۸:۰۰",
      iconBg: "#ecfdf5",
      iconColor: "#10b981",
      syllabus: [
        {
          chapter: "فصل ۱: پایتون شی‌گرا پیشرفته",
          topics: ["کلاس‌ها و وراثت", "دکوراتورها", "محیط‌های مجازی"],
        },
      ],
      faqs: [],
      sessions: [
        {
          num: 1,
          title: "جلسه ۱: راه‌اندازی محیط توسعه، Virtualenv و ساخت اولین App",
          date: "۱۴۰۳/۰۵/۱۴",
          summary: "پیکربندی pipenv، تنظیمات settings.py و راه‌اندازی سرور جنگو.",
          hasAssignment: true,
          assignmentType: "text-only",
          assignmentTitle: "ساخت پروژه جنگو و تعریف ویو و آدرس‌دهی اختصاصی",
          assignmentDesc: "یک پروژه جنگو بسازید که دو صفحه 'تماس با ما' و 'درباره ما' را با رندر قالب HTML نمایش دهد.",
          teacherAttachment: null,
          resources: [
            { type: "video", title: "ویدیوی جلسه اول جنگو", size: "۳۹۰ مگابایت" },
            { type: "code", title: "سورس کامل پروژه جنگو", size: "۱.۱ مگابایت" },
          ],
        },
      ],
    },
  ]);

  // تاگل آکاردئون
  const toggleSession = (num) => {
    setExpandedSession(expandedSession === num ? null : num);
  };

  // انتخاب فایل توسط هنرجو (هر فرمتی)
  const handleFileChange = (courseId, sessNum, e) => {
    const file = e.target.files[0];
    if (file) {
      const key = `${courseId}_${sessNum}`;
      setAssignmentFiles((prev) => ({
        ...prev,
        [key]: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        },
      }));
    }
  };

  // حذف فایل قبل ارسال
  const handleRemoveFile = (courseId, sessNum) => {
    const key = `${courseId}_${sessNum}`;
    setAssignmentFiles((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // ثبت و ارسال تکلیف
  const handleSubmitAssignment = (courseId, sessNum) => {
    const key = `${courseId}_${sessNum}`;
    setSubmittedStatus((prev) => ({
      ...prev,
      [key]: {
        submittedAt: new Date().toLocaleDateString("fa-IR"),
        file: assignmentFiles[key],
        note: assignmentTexts[key] || "",
      },
    }));
  };

  // تب‌های فیلتر
  const filteredCourses = coursesData.filter((c) => {
    if (activeTab === "in-progress") return c.status === "in-progress";
    if (activeTab === "completed") return c.status === "completed";
    return true;
  });

  return (
    <div className="std-courses-page" dir="rtl">
      {/* ========================================================
          ۱. نمودار گرافیکی نقشه راه هنرجو
      ======================================================== */}
      <div className="roadmap-hero-card">
        <div className="roadmap-header-top">
          <div className="roadmap-title-area">
            <h2>آموزش و دوره‌های من 🎓</h2>
            <p>نقشه راه تخصصی مهارت‌های بازار کار — آموزشگاه فناوران فردا سیرجان</p>
          </div>
          <div className="roadmap-stats-pill">
            <span>پیشرفت مسیر شغلی:</span>
            <strong>۶۵٪ کامل شده</strong>
          </div>
        </div>

        <div className="roadmap-flow-chart">
          <div className="roadmap-connecting-track">
            <div className="roadmap-connecting-progress" style={{ width: "65%" }}></div>
          </div>
          {roadmapSteps.map((step) => (
            <div key={step.id} className={`roadmap-node-step ${step.status}`}>
              <div className="roadmap-node-circle">
                {step.status === "completed" && <FiCheck />}
                {step.status === "active" && <span>{step.id}</span>}
                {step.status === "locked" && <FiLock />}
              </div>
              <div className="roadmap-node-title">{step.title}</div>
              <div className="roadmap-node-sub">{step.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          ۲. تب‌های فیلتر دوره‌ها
      ======================================================== */}
      <div className="courses-filter-bar">
        <div className="courses-tabs">
          <button
            className={`c-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            همه دوره‌ها ({coursesData.length})
          </button>
          <button
            className={`c-tab-btn ${activeTab === "in-progress" ? "active" : ""}`}
            onClick={() => setActiveTab("in-progress")}
          >
            دوره‌های فعال ({coursesData.filter((c) => c.status === "in-progress").length})
          </button>
          <button
            className={`c-tab-btn ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            پایان‌یافته (۰)
          </button>
        </div>
      </div>

      {/* ========================================================
          ۳. لیست کارت دوره‌ها با ۴ دکمه تفکیک شده
      ======================================================== */}
      <div className="courses-grid-layout">
        {filteredCourses.map((course) => (
          <div key={course.id} className="std-card course-card-custom">
            <div>
              <div className="course-banner-top">
                <div
                  className="course-icon-badge"
                  style={{ background: course.iconBg, color: course.iconColor }}
                >
                  <FiBookOpen />
                </div>
                <span className="std-chip primary">
                  {course.level} • {course.code}
                </span>
              </div>

              <div className="course-meta-title">
                <h3>{course.title}</h3>
                <p className="course-instructor-text">
                  مدرس دوره: <strong>{course.instructor}</strong>
                </p>
              </div>

              <div className="course-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">روزهای برگزاری</span>
                  <span className="spec-val">{course.days}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">ساعت برگزاری</span>
                  <span className="spec-val">{course.time}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">تعداد کل جلسات</span>
                  <span className="spec-val">{course.sessions.length} جلسه</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">پیشرفت دوره</span>
                  <span className="spec-val" style={{ color: course.iconColor }}>
                    {course.progress}٪
                  </span>
                </div>
              </div>

              <div className="std-progress-track" style={{ marginBottom: "14px" }}>
                <div
                  className="std-progress-bar"
                  style={{
                    width: `${course.progress}%`,
                    backgroundColor: course.iconColor,
                  }}
                ></div>
              </div>
            </div>

            {/* بخش دکمه‌های چهارتایی با تفکیک تکالیف و محتوا */}
            <div className="course-card-actions-grid">
              <button
                className="std-btn-secondary"
                onClick={() => setSyllabusModalCourse(course)}
              >
                <FiLayers /> سرفصل دوره
              </button>

              <button
                className="std-btn-secondary"
                onClick={() => {
                  setFaqModalCourse(course);
                  setFaqTab("list");
                }}
              >
                <FiHelpCircle /> سوالات متداول
              </button>

              {/* دکمه ۱: تکالیف جلسات */}
              <button
                className="action-btn-accent"
                onClick={() => {
                  setAssignmentsModalCourse(course);
                  setExpandedSession(null);
                }}
              >
                <FiFileText /> تکالیف و تمرین‌ها
              </button>

              {/* دکمه ۲: محتوای جلسات */}
              <button
                className="std-btn-primary"
                onClick={() => {
                  setContentModalCourse(course);
                  setExpandedSession(null);
                }}
              >
                <FiDownload /> محتوای جلسات و دانلود
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          مودال ۱: تکالیف جلسات (نمایش تک تک جلسات + پیوست/توضیح + آپلود)
      ======================================================== */}
      {assignmentsModalCourse && (
        <div
          className="std-modal-overlay"
          onClick={() => setAssignmentsModalCourse(null)}
        >
          <div
            className="std-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="std-modal-header">
              <h3>
                <FiFileText style={{ color: "#2563eb" }} /> تکالیف و پروژه‌ها:{" "}
                {assignmentsModalCourse.title}
              </h3>
              <button
                className="std-modal-close"
                onClick={() => setAssignmentsModalCourse(null)}
              >
                <FiX />
              </button>
            </div>

            {/* بدنه اسکرول‌پذیر */}
            <div className="std-modal-body">
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#64748b" }}>
                وضعیت تکالیف تمامی جلسات در زیر مشخص است. روی هر جلسه کلیک کنید تا
                صورت مسئله، فایل ضمیمه استاد را مشاهده و تمرین خود را آپلود نمایید:
              </p>

              {assignmentsModalCourse.sessions.map((sess) => {
                const itemKey = `${assignmentsModalCourse.id}_${sess.num}`;
                const isExpanded = expandedSession === sess.num;
                const isSubmitted = !!submittedStatus[itemKey];
                const currentFile = assignmentFiles[itemKey];

                return (
                  <div
                    key={sess.num}
                    className={`session-item-row ${isExpanded ? "expanded" : ""}`}
                  >
                    <div
                      className="session-item-header"
                      onClick={() => toggleSession(sess.num)}
                    >
                      <div className="session-info-side">
                        <div className="session-badge-num">{sess.num}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1e293b" }}>
                            {sess.title}
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "3px" }}>
                            تاریخ برگزاری: {sess.date}
                          </div>
                        </div>
                      </div>

                      <div className="session-header-labels">
                        {/* بج وضعیت ثبت توسط هنرجو */}
                        {isSubmitted ? (
                          <span className="badge-assignment-type submitted">
                            <FiCheckCircle /> تکلیف بارگذاری شد
                          </span>
                        ) : sess.hasAssignment ? (
                          sess.assignmentType === "attachment" ? (
                            <span className="badge-assignment-type attachment">
                              <FiPaperclip /> دارای فایل پیوست تمرین
                            </span>
                          ) : (
                            <span className="badge-assignment-type text-only">
                              <FiFileText /> فقط توضیح تشریحی
                            </span>
                          )
                        ) : (
                          <span className="badge-assignment-type no-task">
                            بدون تکلیف
                          </span>
                        )}

                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>

                    {/* محتوای بازشونده آکاردئون تکلیف */}
                    {isExpanded && (
                      <div className="session-details-body">
                        {!sess.hasAssignment ? (
                          <div style={{ fontSize: "0.85rem", color: "#64748b", padding: "10px" }}>
                            🎉 برای این جلسه تکلیفی تعیین نشده است.
                          </div>
                        ) : (
                          <>
                            {/* توضیحات صورت مسئله */}
                            <div>
                              <strong style={{ fontSize: "0.9rem", color: "#1e293b", display: "block", marginBottom: "4px" }}>
                                عنوان تمرین: {sess.assignmentTitle}
                              </strong>
                              <p style={{ fontSize: "0.84rem", color: "#475569", margin: 0, lineHeight: 1.6 }}>
                                {sess.assignmentDesc}
                              </p>
                            </div>

                            {/* اگر استاد فایل پیوست داده باشد */}
                            {sess.teacherAttachment && (
                              <div className="teacher-attachment-card">
                                <div className="teacher-attachment-info">
                                  <FiPaperclip style={{ color: "#2563eb", fontSize: "1.1rem" }} />
                                  <span>فایل صورت تمرین و کدهای اولیه استاد:</span>
                                  <span style={{ color: "#64748b", fontSize: "0.78rem" }}>
                                    ({sess.teacherAttachment.name} - {sess.teacherAttachment.size})
                                  </span>
                                </div>
                                <a
                                  href={sess.teacherAttachment.url}
                                  className="btn-download-file"
                                  download
                                >
                                  <FiDownload /> دریافت فایل تمرین
                                </a>
                              </div>
                            )}

                            {/* ناحیه آپلود و پاسخ هنرجو */}
                            <div className={`student-upload-panel ${isSubmitted ? "completed" : ""}`}>
                              {isSubmitted ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <div
                                    style={{
                                      background: "#dcfce7",
                                      color: "#15803d",
                                      padding: "10px 14px",
                                      borderRadius: "8px",
                                      fontSize: "0.84rem",
                                      fontWeight: 700,
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                    }}
                                  >
                                    <FiCheckCircle style={{ fontSize: "1.1rem" }} />
                                    تکلیف شما در تاریخ {submittedStatus[itemKey].submittedAt} با موفقیت بارگذاری شد.
                                  </div>

                                  {submittedStatus[itemKey].file && (
                                    <div className="file-selected-row">
                                      <span>{submittedStatus[itemKey].file.name}</span>
                                      <span style={{ color: "#64748b", fontSize: "0.74rem" }}>
                                        {submittedStatus[itemKey].file.size}
                                      </span>
                                    </div>
                                  )}

                                  {submittedStatus[itemKey].note && (
                                    <div style={{ fontSize: "0.8rem", color: "#475569", background: "#ffffff", padding: "8px 10px", borderRadius: "8px" }}>
                                      <strong>توضیحات ارسالی شما:</strong> {submittedStatus[itemKey].note}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                  <textarea
                                    rows={3}
                                    placeholder="توضیحات حل تمرین، لینک گیت‌هاب یا نکات خود را اینجا بنویسید..."
                                    value={assignmentTexts[itemKey] || ""}
                                    onChange={(e) =>
                                      setAssignmentTexts({
                                        ...assignmentTexts,
                                        [itemKey]: e.target.value,
                                      })
                                    }
                                    style={{
                                      width: "100%",
                                      padding: "10px",
                                      border: "1px solid #cbd5e1",
                                      borderRadius: "8px",
                                      fontFamily: "inherit",
                                      fontSize: "0.84rem",
                                      boxSizing: "border-box",
                                    }}
                                  />

                                  {/* پیش‌نمایش فایل انتخاب شده */}
                                  {currentFile && (
                                    <div className="file-selected-row">
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FiPaperclip style={{ color: "#2563eb" }} />
                                        <span>{currentFile.name}</span>
                                        <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                                          ({currentFile.size})
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                                        onClick={() => handleRemoveFile(assignmentsModalCourse.id, sess.num)}
                                      >
                                        <FiTrash2 />
                                      </button>
                                    </div>
                                  )}

                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                    <label
                                      style={{
                                        cursor: "pointer",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        fontSize: "0.8rem",
                                        color: "#334155",
                                        background: "#f1f5f9",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                      }}
                                    >
                                      <FiUploadCloud style={{ color: "#2563eb", fontSize: "1rem" }} />
                                      <span>
                                        {currentFile ? "تغییر فایل انتخابی" : "پیوست فایل تکلیف (ZIP, PDF, Code, ...)"}
                                      </span>
                                      <input
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileChange(assignmentsModalCourse.id, sess.num, e)}
                                      />
                                    </label>

                                    <button
                                      type="button"
                                      className="std-btn-primary"
                                      onClick={() => handleSubmitAssignment(assignmentsModalCourse.id, sess.num)}
                                    >
                                      <FiSend /> ثبت و ارسال تکلیف
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          مودال ۲: محتوای جلسات و دانلود فایل‌ها
      ======================================================== */}
      {contentModalCourse && (
        <div
          className="std-modal-overlay"
          onClick={() => setContentModalCourse(null)}
        >
          <div
            className="std-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="std-modal-header">
              <h3>
                <FiDownload style={{ color: "#2563eb" }} /> محتوای آموزشی و فایل‌ها:{" "}
                {contentModalCourse.title}
              </h3>
              <button
                className="std-modal-close"
                onClick={() => setContentModalCourse(null)}
              >
                <FiX />
              </button>
            </div>

            {/* بدنه اسکرول‌پذیر با ماکزیمم ارتفاع مشخص */}
            <div className="std-modal-body">
              <p style={{ margin: 0, fontSize: "0.86rem", color: "#64748b" }}>
                لیست تمام جلسات برگزار شده در زیر قرار دارد. می‌توانید خلاصه تدریس هر
                جلسه را مرور کرده و ویدیوها یا سورس‌کدها را دانلود فرمایید:
              </p>

              {contentModalCourse.sessions.map((sess) => {
                const isExpanded = expandedSession === sess.num;

                return (
                  <div
                    key={sess.num}
                    className={`session-item-row ${isExpanded ? "expanded" : ""}`}
                  >
                    <div
                      className="session-item-header"
                      onClick={() => toggleSession(sess.num)}
                    >
                      <div className="session-info-side">
                        <div className="session-badge-num">{sess.num}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#1e293b" }}>
                            {sess.title}
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "3px" }}>
                            تاریخ برگزاری: {sess.date}
                          </div>
                        </div>
                      </div>

                      <div className="session-header-labels">
                        <span className="std-chip primary" style={{ fontSize: "0.75rem" }}>
                          {sess.resources ? sess.resources.length : 0} فایل پیوست
                        </span>
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </div>
                    </div>

                    {/* محتوای آکاردئون: خلاصه مباحث + دکمه‌های دانلود */}
                    {isExpanded && (
                      <div className="session-details-body">
                        <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: "10px", fontSize: "0.84rem", color: "#475569", lineHeight: 1.6 }}>
                          <strong style={{ display: "block", color: "#1e293b", marginBottom: "4px" }}>
                            خلاصه مباحث تدریس‌شده در این جلسه:
                          </strong>
                          {sess.summary}
                        </div>

                        <div>
                          <strong style={{ fontSize: "0.86rem", color: "#1e293b", display: "block", marginBottom: "8px" }}>
                            فایل‌ها و محتوای دانلودی جلسه:
                          </strong>

                          <div className="session-resources-grid">
                            {sess.resources && sess.resources.map((res, rIdx) => (
                              <div key={rIdx} className="resource-download-pill">
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {res.type === "video" && <FiVideo style={{ color: "#2563eb" }} />}
                                  {res.type === "code" && <FiCode style={{ color: "#10b981" }} />}
                                  {res.type === "doc" && <FiFileText style={{ color: "#f59e0b" }} />}
                                  <div>
                                    <div style={{ fontSize: "0.78rem" }}>{res.title}</div>
                                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{res.size}</div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="btn-download-file"
                                  style={{ padding: "4px 8px" }}
                                  onClick={() => alert(`دانلود ${res.title} آغاز شد.`)}
                                >
                                  <FiDownload />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          مودال ۳: سرفصل‌های دوره
      ======================================================== */}
      {syllabusModalCourse && (
        <div
          className="std-modal-overlay"
          onClick={() => setSyllabusModalCourse(null)}
        >
          <div className="std-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FiLayers style={{ color: "#2563eb" }} /> سرفصل‌های آموزشی:{" "}
                {syllabusModalCourse.title}
              </h3>
              <button
                className="std-modal-close"
                onClick={() => setSyllabusModalCourse(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="std-modal-body">
              {syllabusModalCourse.syllabus.map((ch, idx) => (
                <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", background: "#f8fafc", fontWeight: 700, fontSize: "0.9rem" }}>
                    {ch.chapter}
                  </div>
                  <ul style={{ listStyle: "none", margin: 0, padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {ch.topics.map((t, tidx) => (
                      <li key={tidx} style={{ fontSize: "0.82rem", color: "#475569", display: "flex", justifyContent: "space-between" }}>
                        <span>• {t}</span>
                        <FiCheckCircle style={{ color: "#10b981" }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          مودال ۴: سوالات متداول دوره (FAQ)
      ======================================================== */}
      {faqModalCourse && (
        <div
          className="std-modal-overlay"
          onClick={() => setFaqModalCourse(null)}
        >
          <div className="std-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FiHelpCircle style={{ color: "#2563eb" }} /> سوالات متداول:{" "}
                {faqModalCourse.title}
              </h3>
              <button
                className="std-modal-close"
                onClick={() => setFaqModalCourse(null)}
              >
                <FiX />
              </button>
            </div>

            <div className="std-modal-body">
              <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
                <button
                  className={`c-tab-btn ${faqTab === "list" ? "active" : ""}`}
                  onClick={() => setFaqTab("list")}
                >
                  پرسش‌های قبلی ({faqModalCourse.faqs.length})
                </button>
                <button
                  className={`c-tab-btn ${faqTab === "new" ? "active" : ""}`}
                  onClick={() => setFaqTab("new")}
                >
                  + ثبت پرسش جدید
                </button>
              </div>

              {faqTab === "list" ? (
                faqModalCourse.faqs.length > 0 ? (
                  faqModalCourse.faqs.map((f, fIdx) => (
                    <div key={fIdx} style={{ border: "1px solid #e2e8f0", padding: "12px", borderRadius: "10px" }}>
                      <div style={{ fontWeight: 800, fontSize: "0.88rem", marginBottom: "6px" }}>
                        س: {f.q}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#475569", background: "#f8fafc", padding: "8px", borderRadius: "6px" }}>
                        پاسخ: {f.a}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                    هنوز پرسشی برای این دوره ثبت نشده است.
                  </div>
                )
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newQuestionText.trim()) return;
                    setFaqSubmitSuccess(true);
                    setTimeout(() => {
                      faqModalCourse.faqs.unshift({
                        q: newQuestionText,
                        a: "پرسش شما دریافت شد و توسط استاد پاسخ داده خواهد شد.",
                      });
                      setNewQuestionText("");
                      setFaqSubmitSuccess(false);
                      setFaqTab("list");
                    }, 800);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "10px" }}
                >
                  <textarea
                    rows={4}
                    placeholder="پرسش خود را بنویسید..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    required
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="std-btn-primary">
                      <FiSend /> ارسال پرسش
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
