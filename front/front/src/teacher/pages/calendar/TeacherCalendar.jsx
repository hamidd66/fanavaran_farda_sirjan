



import React, { useState, useMemo } from 'react';
import '../../styles/TeacherCalendar.css';

// آیکون‌های داخلی و استاندارد SVG بدون نیاز به پکیج خارجی
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const UsersIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const LayersIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const MapPinIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

// داده‌های نمونه دوره‌ها
const INITIAL_COURSES = [
  {
    id: 'c1',
    code: 'CS-201',
    title: 'برنامه‌نویسی پیشرفته با پایتون',
    room: 'سایت شماره ۱',
    studentsCount: 16,
    totalSessions: 12,
    completedSessions: 8,
    schedule: 'دوشنبه‌ها و چهارشنبه‌ها ۱۶:۰۰ الی ۱۸:۰۰',
    sessions: [
      { id: 's1', number: 1, title: 'آشنایی با شی‌گرایی و ساختار کلاس‌ها', date: '۱۴۰۳/۰۷/۰۲', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 94 },
      { id: 's2', number: 2, title: 'ارث‌بری و چندریختی (Polymorphism)', date: '۱۴۰۳/۰۷/۰۴', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 100 },
      { id: 's3', number: 3, title: 'مدیریت استثناها و کار با فایل', date: '۱۴۰۳/۰۷/۰۹', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 88 },
      { id: 's4', number: 4, title: 'دکوراتورها و جنریتورها در پایتون', date: '۱۴۰۳/۰۷/۱۱', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 94 },
      { id: 's5', number: 5, title: 'کار با ماژول‌ها و ساخت پکیج اختصاصی', date: '۱۴۰۳/۰۷/۱۶', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 81 },
      { id: 's6', number: 6, title: 'مقدمه‌ای بر ماژول‌های async و threading', date: '۱۴۰۳/۰۷/۱۸', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 88 },
      { id: 's7', number: 7, title: 'طراحی ساختار دیتابیس با SQLite', date: '۱۴۰۳/۰۷/۲۳', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 94 },
      { id: 's8', number: 8, title: 'کوئری‌نویسی و ارتباط پایتون با دیتابیس', date: '۱۴۰۳/۰۷/۲۵', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'completed', attendanceRate: 90 },
      { id: 's9', number: 9, title: 'معماری Restful API و وب‌سرویس‌ها', date: '۱۴۰۳/۰۷/۳۰', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'upcoming', attendanceRate: null },
      { id: 's10', number: 10, title: 'پیاده‌سازی مینی‌پروژه وب‌سرویس', date: '۱۴۰۳/۰۸/۰۲', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'upcoming', attendanceRate: null },
      { id: 's11', number: 11, title: 'تست‌نویسی و کنترل نسخه Git', date: '۱۴۰۳/۰۸/۰۷', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'upcoming', attendanceRate: null },
      { id: 's12', number: 12, title: 'ارائه نهایی پروژه‌ها و ارزیابی عملی', date: '۱۴۰۳/۰۸/۰۹', time: '۱۶:۰۰ - ۱۸:۰۰', status: 'upcoming', attendanceRate: null }
    ]
  },
  {
    id: 'c2',
    code: 'FE-102',
    title: 'توسعه فرانت‌اند با React و Tailwind',
    room: 'سایت شماره ۲',
    studentsCount: 19,
    totalSessions: 16,
    completedSessions: 5,
    schedule: 'یکشنبه‌ها و سه‌شنبه‌ها ۱۸:۰۰ الی ۲۰:۰۰',
    sessions: [
      { id: 'r1', number: 1, title: 'مبانی JSX و معماری کامپوننت‌ها', date: '۱۴۰۳/۰۷/۰۸', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'completed', attendanceRate: 100 },
      { id: 'r2', number: 2, title: 'Props و مدیریت State پایه', date: '۱۴۰۳/۰۷/۱۰', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'completed', attendanceRate: 95 },
      { id: 'r3', number: 3, title: 'هوک‌های useEffect و UseRef', date: '۱۴۰۳/۰۷/۱۵', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'completed', attendanceRate: 89 },
      { id: 'r4', number: 4, title: 'مدیریت فرم‌ها و رویدادها در ری‌اکت', date: '۱۴۰۳/۰۷/۱۷', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'completed', attendanceRate: 95 },
      { id: 'r5', number: 5, title: 'استایل‌دهی مدرن با Tailwind CSS', date: '۱۴۰۳/۰۷/۲۲', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'completed', attendanceRate: 90 },
      { id: 'r6', number: 6, title: 'طراحی کامپوننت‌های واکنش‌گرا', date: '۱۴۰۳/۰۷/۲۴', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'upcoming', attendanceRate: null },
      { id: 'r7', number: 7, title: 'مسیریابی با React Router DOM', date: '۱۴۰۳/۰۷/۲۹', time: '۱۸:۰۰ - ۲۰:۰۰', status: 'upcoming', attendanceRate: null }
    ]
  },
  {
    id: 'c3',
    code: 'AI-301',
    title: 'مفاهیم یادگیری ماشین و علم داده',
    room: 'کلاس تئوری ۱۰۲',
    studentsCount: 12,
    totalSessions: 10,
    completedSessions: 2,
    schedule: 'پنج‌شنبه‌ها ۰۹:۰۰ الی ۱۳:۰۰',
    sessions: [
      { id: 'ai1', number: 1, title: 'مقدمه‌ای بر هوش مصنوعی و آمار توصیفی', date: '۱۴۰۳/۰۷/۰۵', time: '۰۹:۰۰ - ۱۳:۰۰', status: 'completed', attendanceRate: 100 },
      { id: 'ai2', number: 2, title: 'تحلیل اکتشافی داده‌ها با Pandas و Numpy', date: '۱۴۰۳/۰۷/۱۲', time: '۰۹:۰۰ - ۱۳:۰۰', status: 'completed', attendanceRate: 92 },
      { id: 'ai3', number: 3, title: 'بصری‌سازی داده‌ها با Seaborn و Matplotlib', date: '۱۴۰۳/۰۷/۱۹', time: '۰۹:۰۰ - ۱۳:۰۰', status: 'upcoming', attendanceRate: null }
    ]
  }
];

const WEEK_DAYS = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

const WEEKLY_SCHEDULE_DATA = [
  {
    day: 'یک‌شنبه',
    time: '۱۸:۰۰ - ۲۰:۰۰',
    courseName: 'توسعه فرانت‌اند با React و Tailwind',
    courseCode: 'FE-102',
    room: 'سایت شماره ۲',
    type: 'حضوری'
  },
  {
    day: 'دوشنبه',
    time: '۱۶:۰۰ - ۱۸:۰۰',
    courseName: 'برنامه‌نویسی پیشرفته با پایتون',
    courseCode: 'CS-201',
    room: 'سایت شماره ۱',
    type: 'حضوری'
  },
  {
    day: 'سه‌شنبه',
    time: '۱۸:۰۰ - ۲۰:۰۰',
    courseName: 'توسعه فرانت‌اند با React و Tailwind',
    courseCode: 'FE-102',
    room: 'سایت شماره ۲',
    type: 'حضوری'
  },
  {
    day: 'چهارشنبه',
    time: '۱۶:۰۰ - ۱۸:۰۰',
    courseName: 'برنامه‌نویسی پیشرفته با پایتون',
    courseCode: 'CS-201',
    room: 'سایت شماره ۱',
    type: 'حضوری'
  },
  {
    day: 'پنج‌شنبه',
    time: '۰۹:۰۰ - ۱۳:۰۰',
    courseName: 'مفاهیم یادگیری ماشین و علم داده',
    courseCode: 'AI-301',
    room: 'کلاس تئوری ۱۰۲',
    type: 'حضوری'
  }
];

export default function TeacherCalendar() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [expandedCourses, setExpandedCourses] = useState({ c1: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('ALL');

  const toggleAccordion = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const toggleAllAccordions = (expandAll) => {
    const nextState = {};
    INITIAL_COURSES.forEach((c) => {
      nextState[c.id] = expandAll;
    });
    setExpandedCourses(nextState);
  };

  const filteredCourses = useMemo(() => {
    return INITIAL_COURSES.filter((course) => {
      const matchCourse = filterCourse === 'ALL' || course.id === filterCourse;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCourse;

      const matchSearch =
        course.title.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query) ||
        course.sessions.some((s) => s.title.toLowerCase().includes(query));

      return matchCourse && matchSearch;
    });
  }, [searchQuery, filterCourse]);

  return (
    <div className="teacher-calendar-container">
      {/* هدر صفحه */}
      <header className="page-header">
        <div className="page-header-title-group">
          <div className="header-badge-icon">
            <CalendarIcon />
          </div>
          <div>
            <h1 className="page-title text-white">تقویم و برنامه آموزشی اساتید</h1>
            <p className="page-subtitle">مشاهده برنامه کلاس‌های هفتگی و لیست تفکیکی جلسات دوره‌های آموزشی</p>
          </div>
        </div>

        {/* سوییچ تب‌ها */}
        <div className="calendar-nav-tabs pt-3 text-white">
          <button
            type="button"
            className={`calendar-tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <ClockIcon size={16} />
            <span>برنامه هفتگی کلاس‌ها</span>
          </button>

          <button
            type="button"
            
            className={`calendar-tab-btn ${activeTab === 'all-sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-sessions')}
          >
            <LayersIcon />
            <span>لیست جامع جلسات دوره‌ها</span>
          </button>
        </div>
      </header>

      {/* تب اول: برنامه هفتگی */}
      {activeTab === 'weekly' && (
        <section className="weekly-tab-content">
          <div className="calendar-kpi-grid mb-4">
            <div className="calendar-kpi-card card-blue">
              <div className="kpi-icon-box">
                <BookOpenIcon />
              </div>
              <div className="kpi-info-box">
                <span className="kpi-label">دوره‌های فعال این ترم</span>
                <span className="kpi-value">{INITIAL_COURSES.length} دوره</span>
              </div>
            </div>

            <div className="calendar-kpi-card card-purple">
              <div className="kpi-icon-box">
                <ClockIcon size={20} />
              </div>
              <div className="kpi-info-box">
                <span className="kpi-label">ساعات تدریس در هفته</span>
                <span className="kpi-value">۱۲ ساعت</span>
              </div>
            </div>

            <div className="calendar-kpi-card card-emerald">
              <div className="kpi-icon-box">
                <UsersIcon size={20} />
              </div>
              <div className="kpi-info-box">
                <span className="kpi-label">مجموع هنرجویان</span>
                <span className="kpi-value">۴۷ نفر</span>
              </div>
            </div>
          </div>

          <div className="weekly-grid-container">
            {WEEK_DAYS.map((dayName) => {
              const dayClasses = WEEKLY_SCHEDULE_DATA.filter((item) => item.day === dayName);
              const hasClass = dayClasses.length > 0;

              return (
                <div key={dayName} className={`weekly-day-card ${hasClass ? 'has-class' : 'day-off'}`}>
                  <div className="day-header">
                    <span className="day-name">{dayName}</span>
                    <span className="day-badge">{hasClass ? `${dayClasses.length} کلاس` : 'بدون کلاس'}</span>
                  </div>

                  <div className="day-classes-list">
                    {hasClass ? (
                      dayClasses.map((item, idx) => (
                        <div key={idx} className="class-schedule-box">
                          <div className="class-box-header">
                            <span className="class-code-tag">{item.courseCode}</span>
                            <span className="class-time-tag">
                              <ClockIcon size={13} />
                              {item.time}
                            </span>
                          </div>

                          <h4 className="class-title-text">{item.courseName}</h4>

                          <div className="class-box-footer">
                            <span className="class-location">
                              <MapPinIcon size={13} />
                              {item.room}
                            </span>
                            <span className="class-type-badge">{item.type}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-class-notice">برنامه‌ای برای این روز ثبت نشده است.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* تب دوم: لیست آکاردئونی تمام جلسات */}
      {activeTab === 'all-sessions' && (
        <section className="all-sessions-tab-content">
          <div className="calendar-filter-bar">
            <div className="filter-inputs-group">
              <div className="search-input-wrapper">
                <span className="search-icon"><SearchIcon /></span>
                <input
                  type="text"
                  placeholder="جستجو در عنوان دوره، جلسه یا کد..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="calendar-search-input"
                />
              </div>

              <div className="select-wrapper">
                <span className="select-icon"><FilterIcon /></span>
                <select
                  value={filterCourse}
                  onChange={(e) => setFilterCourse(e.target.value)}
                  className="course-select-input"
                >
                  <option value="ALL">تمام دوره‌های من</option>
                  {INITIAL_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="accordion-action-buttons">
              <button
                type="button"
                className="accordion-control-btn"
                onClick={() => toggleAllAccordions(true)}
              >
                باز کردن همه
              </button>
              <button
                type="button"
                className="accordion-control-btn"
                onClick={() => toggleAllAccordions(false)}
              >
                بستن همه
              </button>
            </div>
          </div>

          <div className="courses-accordion-list">
            {filteredCourses.map((course) => {
              const isExpanded = !!expandedCourses[course.id];
              const progressPct = Math.round((course.completedSessions / course.totalSessions) * 100);

              return (
                <div key={course.id} className={`course-accordion-item ${isExpanded ? 'is-open' : ''}`}>
                  <div
                    className="accordion-header"
                    onClick={() => toggleAccordion(course.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="accordion-header-info">
                      <div className="course-badge-pill">{course.code}</div>
                      <div>
                        <h3 className="course-title-text">{course.title}</h3>
                        <div className="course-sub-metadata">
                          <span className="sub-meta-item">
                            <MapPinIcon size={13} />
                            {course.room}
                          </span>
                          <span className="sub-meta-separator">•</span>
                          <span className="sub-meta-item">
                            <ClockIcon size={13} />
                            {course.schedule}
                          </span>
                          <span className="sub-meta-separator">•</span>
                          <span className="sub-meta-item">
                            <UsersIcon size={13} />
                            {course.studentsCount} هنرجو
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-header-status-side">
                      <div className="course-progress-container">
                        <div className="progress-labels">
                          <span>پیشرفت: {course.completedSessions} از {course.totalSessions} جلسه</span>
                          <span className="progress-pct-bold">{progressPct}٪</span>
                        </div>
                        <div className="progress-bar-track">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="toggle-chevron-btn">
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="accordion-body">
                      <div className="sessions-table-wrapper">
                        <table className="sessions-data-table">
                          <thead>
                            <tr>
                              <th>شماره جلسه</th>
                              <th>موضوع / مبحث آموزشی</th>
                              <th>تاریخ برگزاری</th>
                              <th>ساعت کلاس</th>
                              <th>وضعیت برگزاری</th>
                              <th>نرخ حضور</th>
                            </tr>
                          </thead>
                          <tbody>
                            {course.sessions.map((session) => (
                              <tr key={session.id}>
                                <td className="session-index-col">
                                  <span className="session-number-pill">
                                    جلسه {session.number}
                                  </span>
                                </td>
                                <td className="session-title-col">
                                  <span className="session-topic-title">{session.title}</span>
                                </td>
                                <td>{session.date}</td>
                                <td className="font-tabular">{session.time}</td>
                                <td>
                                  {session.status === 'completed' ? (
                                    <span className="status-pill status-completed">
                                      <CheckCircleIcon />
                                      برگزار شده
                                    </span>
                                  ) : (
                                    <span className="status-pill status-upcoming">
                                      <ClockIcon size={13} />
                                      برگزار نشده (پیش‌رو)
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {session.attendanceRate !== null ? (
                                    <div className="attendance-rate-box">
                                      <div className="attendance-track">
                                        <div
                                          className="attendance-fill"
                                          style={{ width: `${session.attendanceRate}%` }}
                                        />
                                      </div>
                                      <span className="attendance-text">{session.attendanceRate}٪</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-placeholder">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCourses.length === 0 && (
              <div className="calendar-empty-state">
                <AlertCircleIcon />
                <p className="empty-state-title">جلسه یا دوره‌ای با مشخصات جستجو شده یافت نشد</p>
                <p className="empty-state-desc">لطفاً عبارت جستجو یا فیلتر دوره را تغییر دهید.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
