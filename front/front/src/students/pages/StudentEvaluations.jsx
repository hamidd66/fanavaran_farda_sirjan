import React, { useState } from 'react';
import {
  FaUserCheck,
  FaAward,
  FaChartLine,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTimes,
  FaStar,
  FaArrowUp,
  FaTrophy,
  FaGraduationCap
} from 'react-icons/fa';
import '../styles/StudentEvaluations.css';

const StudentEvaluations = () => {
  // تب‌های فیلتر: همه، دوره‌های در حال برگزاری، دوره‌های خاتمه یافته
  const [activeTab, setActiveTab] = useState('all');

  // استیت‌های مودال‌ها
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'attendance' | 'sessionGrades' | 'advancedEval' | null

  // داده‌های نمونه منطبق بر ساختار آموزشگاه فناوران فردا
  const coursesData = [
    {
      id: 'c1',
      title: 'دوره پیشرفته React و معماری فرانت‌اند',
      code: 'CS-RCT-402',
      instructor: 'مهندس حمید پورفریدونی',
      term: 'بهار و تابستان ۱۴۰۳',
      status: 'completed', // completed | ongoing
      finalResult: 'passed', // passed | failed
      totalSessions: 16,
      attendanceRate: 94,
      // نمرات نهایی (فقط در دوره پایان‌یافته)
      grades: {
        sessionsAvg: 19.2,
        midterm: 18.5,
        final: 19.0,
        totalAverage: 18.9
      },
      // مشخصات مقایسه‌ای پیشرفته دوره
      benchmark: {
        classAverage: 16.4,
        classHighest: 19.8,
        classLowest: 11.0,
        breakdown: [
          { title: 'میانگین تکالیف و جلسات', student: 19.2, classAvg: 16.8, highest: 20.0, lowest: 12.0 },
          { title: 'آزمون جامع میان‌ترم', student: 18.5, classAvg: 15.5, highest: 19.5, lowest: 10.0 },
          { title: 'پروژه نهایی پایان‌ترم', student: 19.0, classAvg: 16.2, highest: 20.0, lowest: 11.5 }
        ]
      },
      // جزئیات حضور و غیاب جلسات
      attendanceList: [
        { session: 1, date: '۱۴۰۳/۰۲/۰۵', status: 'present', delayMinutes: 0, topic: 'معماری React و ساختار کامپوننت‌ها' },
        { session: 2, date: '۱۴۰۳/۰۲/۱۲', status: 'present', delayMinutes: 0, topic: 'State Management و Hookها' },
        { session: 3, date: '۱۴۰۳/۰۲/۱۹', status: 'delay', delayMinutes: 15, topic: 'کار با Context API و Reducerها' },
        { session: 4, date: '۱۴۰۳/۰۲/۲۶', status: 'present', delayMinutes: 0, topic: 'اتصال به API و مدیریت ارورها' },
        { session: 5, date: '۱۴۰۳/۰۳/۰۲', status: 'absent', delayMinutes: 0, topic: 'مفاهیم پیشرفته Custom Hooks' },
        { session: 6, date: '۱۴۰۳/۰۳/۰۹', status: 'present', delayMinutes: 0, topic: 'پیاده‌سازی Redux Toolkit' }
      ],
      // نمرات جلسات و تکالیف
      sessionGradesList: [
        { session: 1, topic: 'طراحی کامپوننت‌های پایه', studentScore: 20, maxScore: 20, classAvg: 17.5, classMax: 20, feedback: 'پیاده‌سازی تمیز و ماژولار' },
        { session: 2, topic: 'پیاده‌سازی Custom Hook فرم‌ها', studentScore: 18.5, maxScore: 20, classAvg: 16.0, classMax: 20, feedback: 'ولیدیشن فیلدها نیاز به بهینه‌سازی داشت' },
        { session: 3, topic: 'مدیریت داده با Context', studentScore: 19, maxScore: 20, classAvg: 16.8, classMax: 20, feedback: 'عالی، ساختار ریدوسر بی‌نقص است' },
        { session: 4, topic: 'پروژه واکشی داده داشبورد', studentScore: 19.5, maxScore: 20, classAvg: 17.0, classMax: 20, feedback: 'مدیریت کش و لودینگ بسیار مناسب' }
      ]
    },
    {
      id: 'c2',
      title: 'متخصص هوش مصنوعی، یادگیری ماشین و پایتون',
      code: 'AI-PYT-204',
      instructor: 'مهندس حمید پورفریدونی',
      term: 'تابستان و پاییز ۱۴۰۳',
      status: 'ongoing',
      finalResult: null,
      totalSessions: 20,
      attendanceRate: 100,
      grades: null, // دوره تموم نشده -> هنوز نمره‌ای درج نمی‌شود
      benchmark: null,
      attendanceList: [
        { session: 1, date: '۱۴۰۳/۰۵/۱۰', status: 'present', delayMinutes: 0, topic: 'بررسی کتابخانه‌های NumPy و Pandas' },
        { session: 2, date: '۱۴۰۳/۰۵/۱۷', status: 'present', delayMinutes: 0, topic: 'پیش‌پردازش داده‌ها و رگرسیون' },
        { session: 3, date: '۱۴۰۳/۰۵/۲۴', status: 'present', delayMinutes: 0, topic: 'دسته‌بندی و درخت تصمیم (Decision Trees)' }
      ],
      sessionGradesList: [
        { session: 1, topic: 'تحلیل دیتاست قیمت مسکن با پانداس', studentScore: 19.5, maxScore: 20, classAvg: 16.2, classMax: 20, feedback: 'ویژوالایز بسیار عالی دیتاها' },
        { session: 2, topic: 'مدل رگرسیون خطی و گرادیان نزولی', studentScore: 18.0, maxScore: 20, classAvg: 15.8, classMax: 19.5, feedback: 'کد تمیز با کامنت‌گذاری کامل' }
      ]
    },
    {
      id: 'c3',
      title: 'توسعه بک‌اند با C# و ASP.NET Core Web API',
      code: 'CS-NET-101',
      instructor: 'دپارتمان مهندسی نرم‌افزار',
      term: 'زمستان ۱۴۰۲',
      status: 'completed',
      finalResult: 'failed', // نمونه مردود جهت سنجش UI
      totalSessions: 18,
      attendanceRate: 65,
      grades: {
        sessionsAvg: 11.5,
        midterm: 9.0,
        final: 10.0,
        totalAverage: 10.1
      },
      benchmark: {
        classAverage: 15.2,
        classHighest: 19.5,
        classLowest: 8.5,
        breakdown: [
          { title: 'میانگین تکالیف و جلسات', student: 11.5, classAvg: 15.0, highest: 19.0, lowest: 9.5 },
          { title: 'آزمون جامع میان‌ترم', student: 9.0, classAvg: 14.5, highest: 20.0, lowest: 8.5 },
          { title: 'پروژه نهایی پایان‌ترم', student: 10.0, classAvg: 16.0, highest: 19.5, lowest: 10.0 }
        ]
      },
      attendanceList: [
        { session: 1, date: '۱۴۰۲/۱۰/۱۰', status: 'present', delayMinutes: 0, topic: 'آشنایی با .NET 8 و معماری لایه‌ای' },
        { session: 2, date: '۱۴۰۲/۱۰/۱۷', status: 'absent', delayMinutes: 0, topic: 'Entity Framework Core و Migration' },
        { session: 3, date: '۱۴۰۲/۱۰/۲۴', status: 'delay', delayMinutes: 30, topic: 'احراز هویت با JWT و Identity' }
      ],
      sessionGradesList: [
        { session: 1, topic: 'راه‌اندازی معماری Clean', studentScore: 12, maxScore: 20, classAvg: 16.0, classMax: 20, feedback: 'نیاز به مرور مفاهیم Dependency Injection' }
      ]
    }
  ];

  // فیلتر کردن دوره‌ها
  const filteredCourses = coursesData.filter(course => {
    if (activeTab === 'ongoing') return course.status === 'ongoing';
    if (activeTab === 'completed') return course.status === 'completed';
    return true;
  });

  // باز کردن مودال‌های مختلف
  const handleOpenModal = (course, modalType) => {
    setSelectedCourse(course);
    setActiveModal(modalType);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setActiveModal(null);
  };

  return (
    <div className="eval-page-container">
      {/* هدر بالای صفحه */}
      <div className="eval-header-hero">
        <div className="eval-hero-text">
          <h2>کارنامه، حضور و غیاب و ارزیابی جامع</h2>
          <p>مشاهده وضعیت تحصیلی، تحلیل عملکرد مقایسه‌ای کلاسی و ریزنمرات جلسات دوره‌ها</p>
        </div>
        <div className="eval-hero-badge">
          <FaGraduationCap /> آموزشگاه فناوری و هوش مصنوعی فناوران فردا
        </div>
      </div>

      {/* تب‌های فیلتر */}
      <div className="eval-tabs-bar">
        <button
          className={`eval-tab-item ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          تمام دوره‌ها ({coursesData.length})
        </button>
        <button
          className={`eval-tab-item ${activeTab === 'ongoing' ? 'active' : ''}`}
          onClick={() => setActiveTab('ongoing')}
        >
          دوره‌های در حال برگزاری ({coursesData.filter(c => c.status === 'ongoing').length})
        </button>
        <button
          className={`eval-tab-item ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          دوره‌های پایان‌یافته ({coursesData.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* شبکه کارت‌های دوره‌ها */}
      <div className="eval-cards-grid">
        {filteredCourses.map(course => {
          const isCompleted = course.status === 'completed';
          const isPassed = course.finalResult === 'passed';

          return (
            <div
              key={course.id}
              className={`eval-course-card ${isCompleted ? (isPassed ? 'card-passed' : 'card-failed') : 'card-ongoing'}`}
            >
              {/* نشانگر یا واترمارک قبولی/مردودی/جاری */}
              {isCompleted ? (
                <div className={`result-watermark-stamp ${isPassed ? 'passed' : 'failed'}`}>
                  {isPassed ? 'قبول' : 'مردود'}
                </div>
              ) : (
                <div className="result-watermark-stamp ongoing">در حال برگزاری</div>
              )}

              {/* مشخصات دوره و استاد */}
              <div className="eval-card-header">
                <div className="course-title-wrap">
                  <h3>{course.title}</h3>
                  <span className="course-code-pill">{course.code}</span>
                </div>
                <div className="course-instructor-info">
                  <FaChalkboardTeacher />
                  <span>مدرس: {course.instructor}</span>
                </div>
                <div className="course-term-info">
                  <FaCalendarAlt />
                  <span>نیم‌سال تحصیلی: {course.term}</span>
                </div>
              </div>

              {/* بخش نمرات یا اعلان در حال برگزاری */}
              <div className="eval-card-scores-section">
                {isCompleted && course.grades ? (
                  <>
                    <div className="scores-metrics-grid">
                      <div className="score-metric-box">
                        <span className="score-lbl">میانگین جلسات</span>
                        <strong className="score-val">{course.grades.sessionsAvg.toFixed(1)}</strong>
                      </div>
                      <div className="score-metric-box">
                        <span className="score-lbl">نمره میان‌ترم</span>
                        <strong className="score-val">{course.grades.midterm.toFixed(1)}</strong>
                      </div>
                      <div className="score-metric-box">
                        <span className="score-lbl">نمره پایان‌ترم</span>
                        <strong className="score-val">{course.grades.final.toFixed(1)}</strong>
                      </div>
                    </div>
                    <div className="total-avg-banner">
                      <span>معدل کل دوره:</span>
                      <strong>{course.grades.totalAverage.toFixed(1)} از ۲۰</strong>
                    </div>
                  </>
                ) : (
                  <div className="ongoing-scores-notice">
                    <FaClock className="notice-icon" />
                    <div>
                      <strong>دوره در حال برگزاری است</strong>
                      <p>نمرات نهایی و میان‌ترم پس از اتمام دوره و تایید آموزش درج خواهد شد.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* دکمه‌های عملیاتی زیر کارت */}
              <div className="eval-card-actions">
                <button
                  className="eval-btn eval-btn-attendance"
                  onClick={() => handleOpenModal(course, 'attendance')}
                >
                  <FaUserCheck /> نمایش حضور و غیاب
                </button>

                <button
                  className="eval-btn eval-btn-grades"
                  onClick={() => handleOpenModal(course, 'sessionGrades')}
                >
                  <FaAward /> نمایش نمرات جلسات
                </button>

                {isCompleted && course.benchmark && (
                  <button
                    className="eval-btn eval-btn-advanced"
                    onClick={() => handleOpenModal(course, 'advancedEval')}
                  >
                    <FaChartLine /> ارزیابی پیشرفته دوره
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          مودال ۱: گزارش کامل حضور و غیاب
      ======================================================== */}
      {activeModal === 'attendance' && selectedCourse && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaUserCheck style={{ color: '#2563eb' }} />
                گزارش حضور و غیاب: {selectedCourse.title}
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="attendance-summary-card">
                <div className="summary-stat">
                  <span>درصد حضور کل:</span>
                  <strong className={selectedCourse.attendanceRate >= 80 ? 'text-green' : 'text-danger'}>
                    ٪{selectedCourse.attendanceRate}
                  </strong>
                </div>
                <div className="summary-stat">
                  <span>تعداد کل جلسات برگزارشده:</span>
                  <strong>{selectedCourse.attendanceList.length} جلسه</strong>
                </div>
              </div>

              <div className="eval-table-wrapper">
                <table className="eval-modern-table">
                  <thead>
                    <tr>
                      <th>جلسه</th>
                      <th>تاریخ برگزاری</th>
                      <th>مبحث کلاسی</th>
                      <th>وضعیت</th>
                      <th>توضیحات / تاخیر</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.attendanceList.map(item => (
                      <tr key={item.session}>
                        <td><strong>جلسه {item.session}</strong></td>
                        <td>{item.date}</td>
                        <td>{item.topic}</td>
                        <td>
                          {item.status === 'present' && (
                            <span className="eval-status-badge present">
                              <FaCheckCircle /> حاضر
                            </span>
                          )}
                          {item.status === 'absent' && (
                            <span className="eval-status-badge absent">
                              <FaTimesCircle /> غایب
                            </span>
                          )}
                          {item.status === 'delay' && (
                            <span className="eval-status-badge delay">
                              <FaClock /> با تاخیر
                            </span>
                          )}
                        </td>
                        <td>
                          {item.status === 'delay' ? `${item.delayMinutes} دقیقه تاخیر` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          مودال ۲: ریزنمرات جلسات و تکالیف
      ======================================================== */}
      {activeModal === 'sessionGrades' && selectedCourse && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaAward style={{ color: '#f59e0b' }} />
                ریزنمرات جلسات و تکالیف: {selectedCourse.title}
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <p className="modal-intro-text">
                در این بخش نمره شما در تکالیف و فعالیت‌های کلاسی هر جلسه به همراه میانگین و بالاترین نمره کلاس نمایش داده شده است:
              </p>

              <div className="eval-table-wrapper">
                <table className="eval-modern-table">
                  <thead>
                    <tr>
                      <th>جلسه</th>
                      <th>موضوع تمرین / تکلیف</th>
                      <th>نمره شما</th>
                      <th>میانگین کلاس</th>
                      <th>بالاترین نمره</th>
                      <th>بازخورد استاد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.sessionGradesList.map(item => (
                      <tr key={item.session}>
                        <td><strong>جلسه {item.session}</strong></td>
                        <td>{item.topic}</td>
                        <td>
                          <span className="student-score-pill">
                            {item.studentScore} / {item.maxScore}
                          </span>
                        </td>
                        <td>{item.classAvg}</td>
                        <td>
                          <span className="highest-score-badge">
                            <FaTrophy /> {item.classMax}
                          </span>
                        </td>
                        <td className="feedback-text">{item.feedback || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          مودال ۳: ارزیابی پیشرفته و نمودار مقایسه‌ای کلاس
      ======================================================== */}
      {activeModal === 'advancedEval' && selectedCourse && selectedCourse.benchmark && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaChartLine style={{ color: '#10b981' }} />
                تحلیل و ارزیابی پیشرفته دوره: {selectedCourse.title}
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              {/* کارت آماری خلاصه‌ی بنچمارک */}
              <div className="benchmark-stats-banner">
                <div className="b-stat-col">
                  <span>معدل هنرجو</span>
                  <strong className="text-student">{selectedCourse.grades.totalAverage.toFixed(1)}</strong>
                </div>
                <div className="b-stat-col">
                  <span>میانگین کل کلاس</span>
                  <strong className="text-avg">{selectedCourse.benchmark.classAverage.toFixed(1)}</strong>
                </div>
                <div className="b-stat-col">
                  <span>بالاترین نمره کلاس</span>
                  <strong className="text-high">{selectedCourse.benchmark.classHighest.toFixed(1)}</strong>
                </div>
                <div className="b-stat-col">
                  <span>پایین‌ترین نمره کلاس</span>
                  <strong className="text-low">{selectedCourse.benchmark.classLowest.toFixed(1)}</strong>
                </div>
              </div>

              {/* نمودارهای میله‌ای مقایسه‌ای نمرات ۳ گانه */}
              <div className="advanced-bars-wrapper">
                <h4 className="bars-title">
                  <FaStar style={{ color: '#f59e0b' }} />
                  مقایسه مؤلفه‌های نمره با میانگین و بالاترین نمره کلاس (از ۲۰ نمره)
                </h4>

                <div className="bars-list">
                  {selectedCourse.benchmark.breakdown.map((item, idx) => {
                    const studentPercent = (item.student / 20) * 100;
                    const avgPercent = (item.classAvg / 20) * 100;
                    const highPercent = (item.highest / 20) * 100;

                    return (
                      <div key={idx} className="benchmark-bar-row">
                        <div className="bar-label-side">
                          <strong>{item.title}</strong>
                          <div className="comparison-indicator">
                            {item.student >= item.classAvg ? (
                              <span className="tag-above">
                                <FaArrowUp /> {(item.student - item.classAvg).toFixed(1)} نمره بالاتر از میانگین
                              </span>
                            ) : (
                              <span className="tag-below">
                                {(item.classAvg - item.student).toFixed(1)} نمره پایین‌تر از میانگین
                              </span>
                            )}
                          </div>
                        </div>

                        {/* نمودار گرافیکی سه سطحی */}
                        <div className="triple-bars-container">
                          {/* نمره هنرجو */}
                          <div className="single-bar-line">
                            <span className="line-tag">نمره شما: {item.student}</span>
                            <div className="bar-track">
                              <div
                                className="bar-fill student-fill"
                                style={{ width: `${studentPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* میانگین کلاس */}
                          <div className="single-bar-line">
                            <span className="line-tag">میانگین کلاس: {item.classAvg}</span>
                            <div className="bar-track">
                              <div
                                className="bar-fill avg-fill"
                                style={{ width: `${avgPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* بالاترین نمره کلاس */}
                          <div className="single-bar-line">
                            <span className="line-tag">بالاترین نمره: {item.highest}</span>
                            <div className="bar-track">
                              <div
                                className="bar-fill high-fill"
                                style={{ width: `${highPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* یادداشت تحلیلی پایانی */}
              <div className="eval-performance-summary">
                <h5>نتیجه ارزیابی عملکرد:</h5>
                <p>
                  عملکرد شما در این دوره در بخش تمرینات کلاسی و پروژه پایانی در رده <strong>۱۰ درصد برتر کلاس</strong> بوده است. جهت دریافت گواهی‌نامه پایان‌دوره می‌توانید از بخش امور آموزشی پیگیری فرمایید.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluations;
