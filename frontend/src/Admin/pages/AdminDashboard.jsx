import "../style/AdminDashboard.css";

const statCards = [
  {
    title: "کارآموزان فعال",
    value: "۲۴۸",
    icon: "bi-people-fill",
    color: "purple",
    change: "۱۲٪",
    description: "رشد نسبت به ماه گذشته",
    trend: "up",
  },
  {
    title: "کلاس‌های در حال برگزاری",
    value: "۲۶",
    icon: "bi-door-open-fill",
    color: "blue",
    change: "۴ کلاس",
    description: "کلاس امروز برگزار می‌شود",
    trend: "normal",
  },
  {
    title: "دوره‌های فعال",
    value: "۱۸",
    icon: "bi-journal-code",
    color: "green",
    change: "۴ دوره",
    description: "در حال ثبت‌نام هستند",
    trend: "up",
  },
  {
    title: "اساتید فعال",
    value: "۱۲",
    icon: "bi-person-workspace",
    color: "orange",
    change: "۲ نفر",
    description: "مدرس جدید این ماه",
    trend: "up",
  },
  {
    title: "درآمد این ماه",
    value: "۸۴.۵ م",
    icon: "bi-cash-stack",
    color: "teal",
    change: "۸٪",
    description: "رشد درآمد نسبت به ماه قبل",
    trend: "up",
  },
  {
    title: "میانگین حضور و غیاب",
    value: "۸۷٪",
    icon: "bi-person-check-fill",
    color: "pink",
    change: "۳٪",
    description: "بهتر از ماه گذشته",
    trend: "up",
  },
];

const enrollmentData = [
  { month: "فروردین", students: 28, income: 34 },
  { month: "اردیبهشت", students: 40, income: 46 },
  { month: "خرداد", students: 35, income: 42 },
  { month: "تیر", students: 52, income: 57 },
  { month: "مرداد", students: 46, income: 51 },
  { month: "شهریور", students: 68, income: 74 },
];

const courseDistribution = [
  {
    label: "برنامه‌نویسی وب",
    value: 36,
    color: "#4f46e5",
    students: "۸۹ نفر",
  },
  {
    label: "پایتون و Django",
    value: 25,
    color: "#0ea5e9",
    students: "۶۲ نفر",
  },
  {
    label: "هوش مصنوعی",
    value: 18,
    color: "#10b981",
    students: "۴۵ نفر",
  },
  {
    label: "الگوریتم و مسابقات",
    value: 12,
    color: "#f59e0b",
    students: "۳۰ نفر",
  },
  {
    label: "دیتاساینس",
    value: 9,
    color: "#ec4899",
    students: "۲۲ نفر",
  },
];

const alerts = [
  {
    title: "پیش‌ثبت‌نام‌های جدید",
    value: "۳۴",
    description: "نیازمند تماس و پیگیری",
    icon: "bi-person-plus-fill",
    color: "purple",
    badge: "۸ مورد امروز",
  },
  {
    title: "شهریه‌های معوق",
    value: "۱۲",
    description: "جمع بدهی: ۱۴.۸ میلیون تومان",
    icon: "bi-wallet2",
    color: "red",
    badge: "نیازمند پیگیری",
  },
  {
    title: "آزمون‌های پیش رو",
    value: "۵",
    description: "اولین آزمون: فردا ساعت ۱۷",
    icon: "bi-clipboard2-check-fill",
    color: "blue",
    badge: "۳ روز آینده",
  },
  {
    title: "استعداد‌یابی‌های ثبت‌شده",
    value: "۲۱",
    description: "در انتظار بررسی نتیجه",
    icon: "bi-stars",
    color: "orange",
    badge: "۶ مورد جدید",
  },
  {
    title: "مسابقات فعال",
    value: "۳",
    description: "۴۲ کارآموز در مسابقات شرکت کرده‌اند",
    icon: "bi-trophy-fill",
    color: "green",
    badge: "۱ مسابقه نزدیک",
  },
];

const studentsNeedPractice = [
  {
    id: 1,
    name: "مهدی رضایی",
    initials: "م ر",
    course: "پایتون مقدماتی",
    score: "۵۸",
    attendance: "۷۲٪",
    exercises: "۴ از ۱۰",
    level: "نیاز به تمرین",
    color: "purple",
  },
  {
    id: 2,
    name: "زهرا احمدی",
    initials: "ز ا",
    course: "دوره جامع React",
    score: "۶۲",
    attendance: "۸۰٪",
    exercises: "۵ از ۱۰",
    level: "نیاز به تمرین",
    color: "pink",
  },
  {
    id: 3,
    name: "امیرحسین محمدی",
    initials: "ا م",
    course: "الگوریتم مقدماتی",
    score: "۵۴",
    attendance: "۶۸٪",
    exercises: "۳ از ۱۰",
    level: "نیاز به پیگیری",
    color: "blue",
  },
  {
    id: 4,
    name: "سارا کریمی",
    initials: "س ک",
    course: "هوش مصنوعی مقدماتی",
    score: "۶۵",
    attendance: "۷۵٪",
    exercises: "۴ از ۱۰",
    level: "نیاز به تمرین",
    color: "orange",
  },
];

const teacherSatisfaction = [
  {
    name: "استاد امیر رضایی",
    course: "دوره جامع React",
    score: 4.9,
    percentage: 98,
    responses: 31,
    color: "purple",
  },
  {
    name: "استاد سارا محمدی",
    course: "پایتون و Django",
    score: 4.8,
    percentage: 96,
    responses: 27,
    color: "blue",
  },
  {
    name: "استاد علی حسینی",
    course: "الگوریتم و مسابقات",
    score: 4.6,
    percentage: 92,
    responses: 22,
    color: "orange",
  },
];

const todayClasses = [
  {
    title: "دوره جامع React",
    teacher: "استاد امیر رضایی",
    time: "۱۶:۰۰ تا ۱۷:۳۰",
    students: 18,
    room: "کلاس شماره ۱",
    color: "purple",
  },
  {
    title: "پایتون و Django",
    teacher: "استاد سارا محمدی",
    time: "۱۷:۴۵ تا ۱۹:۱۵",
    students: 14,
    room: "کلاس شماره ۲",
    color: "blue",
  },
  {
    title: "الگوریتم و مسابقات",
    teacher: "استاد علی حسینی",
    time: "۱۹:۳۰ تا ۲۱:۰۰",
    students: 12,
    room: "آزمایشگاه",
    color: "orange",
  },
];




const studentSources = [
  { label: "وب‌سایت", value: 42, color: "#4e82ea" },
  { label: "اینستاگرام", value: 29, color: "#ab67e8" },
  { label: "تبلیغات گوگل", value: 15, color: "#40c99b" },
  { label: "معرفی دوستان", value: 10, color: "#ffae4d" },
  { label: "سایر", value: 4, color: "#c8ccd4" },
];

const attendanceHeatmap = [
  {
    week: "هفته ۱",
    values: [0.25, 0.78, 0.85, 0.76, 0.72, 0.64, 0.15],
  },
  {
    week: "هفته ۲",
    values: [0.2, 0.82, 0.92, 0.76, 0.8, 0.72, 0.2],
  },
  {
    week: "هفته ۳",
    values: [0.18, 0.75, 0.86, 0.91, 0.74, 0.65, 0.16],
  },
  {
    week: "هفته ۴",
    values: [0.15, 0.88, 0.81, 0.94, 0.71, 0.52, 0.12],
  },
];

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

function getHeatmapColor(value) {
  if (value >= 0.85) return "#5bc66e";
  if (value >= 0.7) return "#8cda94";
  if (value >= 0.5) return "#b5e9b9";
  if (value >= 0.3) return "#d9f4da";

  return "#edf9ee";
}







function AdminDashboard() {
  const totalStudents = courseDistribution.reduce(
    (total, item) => total + Number(item.students.replace(/\D/g, "")),
    0
  );

  return (
    <div className="admin-dashboard-page">
      {/* عنوان داشبورد */}
      <section className="admin-page-heading">
        <div>
          <div className="admin-breadcrumb">
            <span>پنل مدیریت</span>
            <i className="bi bi-chevron-left"></i>
            <strong className="text-primary">پنل مدیریت</strong>
          </div>

          <h1>سلام حمید 👋</h1>
          <p>
            امروز شنبه، ۱ شهریور ۱۴۰۵ است؛ نمای کلی عملکرد آموزشگاه را اینجا
            ببینید.
          </p>
        </div>

        <div className="ad-heading-actions">
          <button type="button" className="ad-secondary-button">
            <i className="bi bi-download"></i>
            دریافت گزارش
          </button>

          <button type="button" className="admin-primary-button">
            <i className="bi bi-person-plus-fill"></i>
            ثبت کارآموز جدید
          </button>
        </div>
      </section>

      {/* کارت‌های آمار اصلی */}
      <section className="ad-stat-grid">
        {statCards.map((item) => (
          <article className="ad-stat-card" key={item.title}>
            <div className={`ad-stat-icon ${item.color}`}>
              <i className={`bi ${item.icon}`}></i>
            </div>

            <div className="ad-stat-content">
              <span>{item.title}</span>
              <strong>{item.value}</strong>

              <small className={item.trend === "up" ? "positive" : ""}>
                {item.trend === "up" && <i className="bi bi-arrow-up-short"></i>}
                <b>{item.change}</b> {item.description}
              </small>
            </div>
          </article>
        ))}
      </section>

      {/* نمودار ثبت‌نام و نمودار دایره‌ای */}
      <section className="ad-main-charts-grid">
        {/* نمودار ستونی ثبت نام */}
        <article className="ad-widget ad-enrollment-chart">
          <div className="ad-widget-header">
            <div>
              <h2>روند ثبت‌نام و درآمد</h2>
              <p>مقایسه تعداد ثبت‌نام‌ها و درآمد ۶ ماه اخیر</p>
            </div>

            <div className="ad-select-wrapper">
              <i className="bi bi-calendar3"></i>
              <select defaultValue="sixMonths" aria-label="انتخاب بازه زمانی">
                <option value="sixMonths">۶ ماه اخیر</option>
                <option value="threeMonths">۳ ماه اخیر</option>
                <option value="year">سال جاری</option>
              </select>
            </div>
          </div>

          <div className="ad-chart-legend">
            <span>
              <i className="ad-dot purple"></i>
              ثبت‌نام کارآموزان
            </span>
            <span>
              <i className="ad-dot green"></i>
              درآمد نسبی
            </span>
          </div>

          <div className="ad-bar-chart">
            <div className="ad-chart-scale">
              <span>۸۰</span>
              <span>۶۰</span>
              <span>۴۰</span>
              <span>۲۰</span>
              <span>۰</span>
            </div>

            <div className="ad-chart-columns">
              {enrollmentData.map((item) => (
                <div className="ad-chart-column" key={item.month}>
                  <div className="ad-bars-wrapper">
                    <span
                      title={`${item.students} ثبت‌نام`}
                      className="ad-bar purple"
                      style={{ height: `${item.students}%` }}
                    >
                      <b>{item.students}</b>
                    </span>

                    <span
                      title={`${item.income} میلیون تومان`}
                      className="ad-bar green"
                      style={{ height: `${item.income}%` }}
                    >
                      <b>{item.income}</b>
                    </span>
                  </div>

                  <small>{item.month}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="ad-chart-summary">
            <div>
              <span>مجموع ثبت‌نام این بازه</span>
              <strong>۲۶۹ نفر</strong>
            </div>

            <div>
              <span>رشد ثبت‌نام شهریور</span>
              <strong className="positive">
                <i className="bi bi-arrow-up-short"></i>
                ۲۸٪
              </strong>
            </div>

            <div>
              <span>بیشترین ثبت‌نام</span>
              <strong>شهریور</strong>
            </div>
          </div>
        </article>

        {/* نمودار دایره‌ای توزیع کارآموزان */}
        <article className="ad-widget ad-course-chart">
          <div className="ad-widget-header">
            <div>
              <h2>توزیع کارآموزان در دوره‌ها</h2>
              <p>بر اساس ثبت‌نام‌های فعال</p>
            </div>

            <button className="ad-icon-button" type="button" aria-label="جزئیات">
              <i className="bi bi-three-dots"></i>
            </button>
          </div>

          <div className="ad-donut-area">
            <div
              className="ad-donut-chart"
              style={{
                background:
                  "conic-gradient(#4f46e5 0% 36%, #0ea5e9 36% 61%, #10b981 61% 79%, #f59e0b 79% 91%, #ec4899 91% 100%)",
              }}
            >
              <div className="ad-donut-center">
                <strong>{totalStudents}</strong>
                <span>کارآموز فعال</span>
              </div>
            </div>
          </div>

          <div className="ad-course-legend">
            {courseDistribution.map((item) => (
              <div className="ad-course-legend-item" key={item.label}>
                <span className="ad-course-name">
                  <i style={{ background: item.color }}></i>
                  {item.label}
                </span>

                <span>
                  <b>{item.value}٪</b>
                  <small>{item.students}</small>
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* کارت‌های نیازمند پیگیری */}
      <section className="ad-attention-grid">
        {alerts.map((item) => (
          <article className={`ad-attention-card ${item.color}`} key={item.title}>
            <div className="ad-attention-top">
              <div className="ad-attention-icon">
                <i className={`bi ${item.icon}`}></i>
              </div>

              <span>{item.badge}</span>
            </div>

            <p>{item.title}</p>
            <strong>{item.value}</strong>
            <small>{item.description}</small>

            <button type="button">
              مشاهده جزئیات
              <i className="bi bi-arrow-left"></i>
            </button>
          </article>
        ))}
      </section>

      {/* نیازمند تمرین + رضایت اساتید */}
      <section className="ad-performance-grid">
        {/* کارآموزان نیازمند تمرین */}
        <article className="ad-widget ad-practice-widget">
          <div className="ad-widget-header">
            <div>
              <h2>کارآموزان نیازمند تمرین بیشتر</h2>
              <p>بر اساس نمره، حضور و تحویل تمرین‌ها</p>
            </div>

            <button type="button" className="ad-outline-button">
              مشاهده همه
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>

          <div className="ad-table-scroll">
            <table className="ad-students-table">
              <thead>
                <tr>
                  <th>کارآموز</th>
                  <th>دوره</th>
                  <th>نمره</th>
                  <th>حضور</th>
                  <th>تمرین‌ها</th>
                  <th>وضعیت</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {studentsNeedPractice.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="ad-student-cell">
                        <span className={`ad-avatar ${student.color}`}>
                          {student.initials}
                        </span>
                        <strong>{student.name}</strong>
                      </div>
                    </td>

                    <td>{student.course}</td>

                    <td>
                      <span className="ad-score-badge">{student.score} از ۱۰۰</span>
                    </td>

                    <td>{student.attendance}</td>
                    <td>{student.exercises}</td>

                    <td>
                      <span className="ad-status-badge warning">{student.level}</span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="ad-row-action"
                        aria-label={`مشاهده ${student.name}`}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* رضایت از اساتید */}
        <article className="ad-widget ad-satisfaction-widget">
          <div className="ad-widget-header">
            <div>
              <h2>رضایت از اساتید</h2>
              <p>نتیجه نظرسنجی ماه جاری</p>
            </div>

            <span className="ad-rating-total">
              <i className="bi bi-star-fill"></i>
              ۴.۸ از ۵
            </span>
          </div>

          <div className="ad-satisfaction-overview">
            <div className="ad-big-rating">
              <strong>۹۶٪</strong>
              <span>رضایت کلی کارآموزان</span>
            </div>

            <div className="ad-rating-bars">
              <div>
                <span>کیفیت تدریس</span>
                <div>
                  <i style={{ width: "97%" }}></i>
                </div>
                <b>۹۷٪</b>
              </div>

              <div>
                <span>تعامل با کارآموز</span>
                <div>
                  <i style={{ width: "95%" }}></i>
                </div>
                <b>۹۵٪</b>
              </div>

              <div>
                <span>نظم کلاس</span>
                <div>
                  <i style={{ width: "94%" }}></i>
                </div>
                <b>۹۴٪</b>
              </div>
            </div>
          </div>

          <div className="ad-teacher-ratings">
            {teacherSatisfaction.map((teacher) => (
              <div className="ad-teacher-rating" key={teacher.name}>
                <span className={`ad-avatar ${teacher.color}`}>
                  {teacher.name.replace("استاد ", "").slice(0, 1)}
                </span>

                <div className="ad-teacher-info">
                  <strong>{teacher.name}</strong>
                  <small>{teacher.course}</small>

                  <div className="ad-teacher-progress">
                    <i style={{ width: `${teacher.percentage}%` }}></i>
                  </div>
                </div>

                <div className="ad-teacher-score">
                  <strong>
                    <i className="bi bi-star-fill"></i>
                    {teacher.score}
                  </strong>
                  <small>{teacher.responses} پاسخ</small>
                </div>
              </div>
            ))}
          </div>

          <button type="button" className="ad-full-text-button">
            مشاهده گزارش کامل نظرسنجی‌ها
            <i className="bi bi-arrow-left"></i>
          </button>
        </article>
      </section>

      {/* کلاس‌های امروز + فعالیت‌های اخیر */}
      <section className="ad-bottom-grid">
        <article className="ad-widget ad-today-classes-widget">
          <div className="ad-widget-header">
            <div>
              <h2>کلاس‌های امروز</h2>
              <p>شنبه، ۱ شهریور ۱۴۰۵</p>
            </div>

            <button type="button" className="ad-outline-button">
              تقویم کامل
            </button>
          </div>

          <div className="ad-class-list">
            {todayClasses.map((item) => (
              <div className="ad-class-item" key={item.title}>
                <span className={`ad-class-line ${item.color}`}></span>

                <div className="ad-class-info">
                  <strong>{item.title}</strong>
                  <span>{item.teacher}</span>
                </div>

                <div className="ad-class-meta">
                  <strong>{item.time}</strong>
                  <span>
                    <i className="bi bi-people"></i>
                    {item.students} کارآموز
                  </span>
                </div>

                <span className="ad-class-room">{item.room}</span>

                <button type="button" aria-label="جزئیات کلاس">
                  <i className="bi bi-chevron-left"></i>
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="ad-widget ad-quick-actions-widget">
          <div className="ad-widget-header">
            <div>
              <h2>دسترسی سریع</h2>
              <p>عملیات پراستفاده مدیریت</p>
            </div>
          </div>

          <div className="ad-quick-actions">
            <button type="button">
              <span className="purple">
                <i className="bi bi-person-plus-fill"></i>
              </span>
              ثبت کارآموز
            </button>

            <button type="button">
              <span className="blue">
                <i className="bi bi-calendar-plus-fill"></i>
              </span>
              ایجاد کلاس
            </button>

            <button type="button">
              <span className="green">
                <i className="bi bi-cash-coin"></i>
              </span>
              ثبت پرداخت
            </button>

            <button type="button">
              <span className="orange">
                <i className="bi bi-clipboard2-plus-fill"></i>
              </span>
              ثبت آزمون
            </button>
          </div>

          <div className="ad-dashboard-note">
            <i className="bi bi-lightbulb-fill"></i>
            <p>
              <strong>پیشنهاد امروز:</strong>
              با ۱۲ کارآموز دارای شهریه معوق تماس بگیرید.
            </p>
          </div>
        </article>
      </section>




       {/* منابع جذب کارآموز + نقشه حرارتی حضور */}
<section className="ad-insights-grid">
  {/* منابع جذب کارآموز */}
  <article className="ad-widget ad-sources-widget">
    <div className="ad-widget-header">
      <div>
        <h2>
          منابع جذب کارآموز
          <span className="ad-header-icon blue">
            <i className="bi bi-box-arrow-in-down-left"></i>
          </span>
        </h2>

        <p>کانال‌های ورود کارآموزان در ماه جاری</p>
      </div>

      <button type="button" className="ad-outline-button">
        گزارش کامل
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>

    <div className="ad-sources-content">
      <div
        className="ad-sources-donut"
        style={{
          background:
            "conic-gradient(#4e82ea 0% 42%, #ab67e8 42% 71%, #40c99b 71% 86%, #ffae4d 86% 96%, #c8ccd4 96% 100%)",
        }}
      >
        <div className="ad-sources-donut-center">
          <strong>۱,۲۴۸</strong>
          <span>کل کارآموزان</span>
        </div>
      </div>

      <div className="ad-sources-legend">
        {studentSources.map((source) => (
          <div className="ad-source-item" key={source.label}>
            <div className="ad-source-label">
              <i style={{ backgroundColor: source.color }}></i>
              <span>{source.label}</span>
            </div>

            <strong>{source.value}٪</strong>
          </div>
        ))}
      </div>
    </div>

    <div className="ad-source-footer">
      <span>
        <i className="bi bi-arrow-up-short"></i>
        ۱۴٪ رشد جذب کارآموز
      </span>

      <small>نسبت به ماه قبل</small>
    </div>
  </article>

  {/* نقشه حرارتی حضور و غیاب */}
  <article className="ad-widget ad-heatmap-widget">
    <div className="ad-widget-header">
      <div>
        <h2>
          نقشه حرارتی حضور و غیاب
          <span className="ad-header-icon purple">
            <i className="bi bi-bar-chart-line-fill"></i>
          </span>
        </h2>

        <p>میزان حضور کارآموزان در ۴ هفته اخیر</p>
      </div>

      <button type="button" className="ad-outline-button">
        جزئیات حضور
        <i className="bi bi-arrow-left"></i>
      </button>
    </div>

    <div className="ad-heatmap-scroll">
      <div className="ad-heatmap">
        {/* عنوان روزهای هفته */}
        <div className="ad-heatmap-row ad-heatmap-days">
          <div className="ad-heatmap-week-empty"></div>

          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* داده هفته‌ها */}
        {attendanceHeatmap.map((week) => (
          <div className="ad-heatmap-row" key={week.week}>
            <strong>{week.week}</strong>

            {week.values.map((value, index) => (
              <span
                key={`${week.week}-${index}`}
                className="ad-heatmap-cell"
                style={{ backgroundColor: getHeatmapColor(value) }}
                title={`${weekDays[index]}: ${Math.round(value * 100)}٪ حضور`}
              ></span>
            ))}
          </div>
        ))}
      </div>
    </div>

    <div className="ad-heatmap-footer">
      <div className="ad-heatmap-scale">
        <span>کم</span>

        <i style={{ background: "#edf9ee" }}></i>
        <i style={{ background: "#d9f4da" }}></i>
        <i style={{ background: "#b5e9b9" }}></i>
        <i style={{ background: "#8cda94" }}></i>
        <i style={{ background: "#5bc66e" }}></i>

        <span>زیاد</span>
      </div>

      <div className="ad-attendance-average">
        <i className="bi bi-check-circle-fill"></i>
        میانگین حضور: <strong>۸۷٪</strong>
      </div>
    </div>
  </article>
</section>




























    </div>
  );
}

export default AdminDashboard;
