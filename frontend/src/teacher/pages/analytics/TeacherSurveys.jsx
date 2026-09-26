import React, { useState, useMemo } from 'react';
import {
  FiSmile,
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiSearch,
  FiMessageSquare,
  FiCheckCircle,
  FiX,
  FiStar,
  FiBarChart2,
  FiThumbsUp,
  FiClock,
  FiBookOpen,
  FiHeadphones,
  FiArrowUpRight,
  FiLayers
} from 'react-icons/fi';
import '../../styles/TeacherSurveys.css';

// داده‌های اولیه کلاس‌ها و آمار نظرسنجی
const INITIAL_COURSES_SURVEYS = [
  {
    id: 'c1',
    title: 'برنامه‌نویسی فرانت‌اند React و Next.js',
    code: 'FE-201',
    studentsCount: 24,
    responsesCount: 22,
    overallScore: 4.8, // از 5
    status: 'active',
    criteria: {
      mastery: 4.9,       // 1. تسلط و فن بیان
      support: 4.7,       // 2. پشتیبانی و پاسخگویی
      practical: 4.9,     // 3. پروژه محور و کاربردی بودن
      discipline: 4.8     // 4. منظم بودن استاد
    },
    comments: [
      { id: 1, studentName: 'علی رضایی', date: '۱۴۰۳/۰۶/۱۵', rating: 5, text: 'پروژه‌های عملی دوره فوق‌العاده کاربردی بود و پاسخگویی به اشکالات در سریع‌ترین زمان ممکن انجام می‌شد.' },
      { id: 2, studentName: 'مهسا کاظمی', date: '۱۴۰۳/۰۶/۱۲', rating: 4.5, text: 'تسلط استاد بر مفاهیم هوک‌ها و ریداکس بی‌نظیر بود، کاش زمان بیشتری به تایپ‌اسکریپت اختصاص داده می‌شد.' },
      { id: 3, studentName: 'سارا محمدی', date: '۱۴۰۳/۰۶/۱۰', rating: 5, text: 'نظم بسیار بالای جلسات و شروع دقیق سر ساعت از ویژگی‌های بارز استاد پورفریدونی بود.' }
    ]
  },
  {
    id: 'c2',
    title: 'توسعه بک‌اند با Python و Django',
    code: 'PY-301',
    studentsCount: 18,
    responsesCount: 17,
    overallScore: 4.6,
    status: 'active',
    criteria: {
      mastery: 4.8,
      support: 4.4,
      practical: 4.7,
      discipline: 4.6
    },
    comments: [
      { id: 1, studentName: 'حسین احمدی', date: '۱۴۰۳/۰۶/۱۸', rating: 4.5, text: 'آموزش معماری MVT و نحوه ساخت API با DRF کاملاً استاندارد بازار کار بود.' },
      { id: 2, studentName: 'رضا نوری', date: '۱۴۰۳/۰۶/۱۴', rating: 4.8, text: 'فن بیان بسیار شیوا و شفاف بدون حاشیه.' }
    ]
  },
  {
    id: 'c3',
    title: 'طراحی رابط و تجربه کاربری (UI/UX)',
    code: 'UX-101',
    studentsCount: 15,
    responsesCount: 12,
    overallScore: 4.3,
    status: 'finalized',
    criteria: {
      mastery: 4.5,
      support: 4.1,
      practical: 4.4,
      discipline: 4.3
    },
    comments: [
      { id: 1, studentName: 'نیلوفر امینی', date: '۱۴۰۳/۰۵/۲۸', rating: 4.2, text: 'پروژه‌های فیگما خوب بود ولی پشتیبانی تکالیف کمی با تاخیر انجام می‌شد.' }
    ]
  }
];

export default function TeacherSurveys() {
  const [courses] = useState(INITIAL_COURSES_SURVEYS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // پیدا کردن بهترین کلاس بر اساس میانگین رضایت برای مقایسه (Benchmark)
  const bestCourse = useMemo(() => {
    return [...courses].sort((a, b) => b.overallScore - a.overallScore)[0];
  }, [courses]);

  // فیلتر کردن کلاس‌ها در جستجو
  const filteredCourses = useMemo(() => {
    return courses.filter(
      c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  // آمار کلی کارت‌های KPI
  const stats = useMemo(() => {
    const totalResp = courses.reduce((sum, c) => sum + c.responsesCount, 0);
    const totalStud = courses.reduce((sum, c) => sum + c.studentsCount, 0);
    const avgScore = (courses.reduce((sum, c) => sum + c.overallScore, 0) / (courses.length || 1)).toFixed(1);
    const participationRate = Math.round((totalResp / (totalStud || 1)) * 100);

    return {
      avgScore,
      totalResponses: totalResp,
      participationRate,
      topCourseTitle: bestCourse ? bestCourse.title : '—'
    };
  }, [courses, bestCourse]);

  // محاسبه درصد از نمره ۵ برای نوار پیشرفت
  const getPercentage = (score, max = 5) => Math.min(100, Math.round((score / max) * 100));

  return (
    <div className="teacher-surveys-container">
      {/* هدر صفحه */}
      <div className="surveys-page-header">
        <div>
          <h1 className="surveys-page-title">نظرسنجی و ارزیابی کیفیت تدریس</h1>
          <p className="surveys-page-subtitle">
            مشاهده بازخورد هنرجویان، ارزیابی شاخص‌های کلیدی تدریس و مقایسه عملکرد کلاس‌ها
          </p>
        </div>
      </div>

      {/* کارت‌های KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon blue">
            <FiSmile />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">میانگین رضایت کل</span>
            <span className="kpi-value">{stats.avgScore} <small className="kpi-unit">از ۵</small></span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green">
            <FiUsers />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">نرخ مشارکت هنرجویان</span>
            <span className="kpi-value">{stats.participationRate}%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon purple">
            <FiMessageSquare />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">مجموع پاسخ‌های دریافتی</span>
            <span className="kpi-value">{stats.totalResponses}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange">
            <FiAward />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">برترین کلاس از دید هنرجویان</span>
            <span className="kpi-value truncate-text" title={stats.topCourseTitle}>{stats.topCourseTitle}</span>
          </div>
        </div>
      </div>

      {/* نوار کنترل و جستجو */}
      <div className="table-controls-wrapper">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="جستجو بر اساس نام دوره یا کد کلاس..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* جدول کلاس‌های استاد */}
      <div className="table-responsive-container">
        <table className="surveys-table">
          <thead>
            <tr>
              <th>#</th>
              <th>نام دوره آموزشی</th>
              <th>کد کلاس</th>
              <th>تعداد هنرجویان</th>
              <th>نرخ مشارکت</th>
              <th>میانگین رضایت</th>
              <th>وضعیت دوره</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, idx) => {
                const partRate = Math.round((course.responsesCount / course.studentsCount) * 100);
                return (
                  <tr key={course.id}>
                    <td className="text-center">{idx + 1}</td>
                    <td className="course-title-cell font-bold">
                      <FiBookOpen className="inline-icon" /> {course.title}
                    </td>
                    <td>
                      <span className="code-badge">{course.code}</span>
                    </td>
                    <td className="text-center">{course.studentsCount} نفر</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${partRate}%` }}
                          />
                        </div>
                        <span className="progress-text">{partRate}% ({course.responsesCount} پاسخ)</span>
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${course.overallScore >= 4.5 ? 'high' : 'medium'}`}>
                        <FiStar className="star-icon" /> {course.overallScore} / ۵
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${course.status === 'active' ? 'pass' : 'neutral'}`}>
                        {course.status === 'active' ? 'در حال برگزاری' : 'پایان یافته'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn-feedback"
                        onClick={() => setSelectedCourseModal(course)}
                        title="مشاهده بازخورد و تحلیل نظرسنجی"
                      >
                        <FiBarChart2 /> بازخورد کلاس
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="empty-state-cell">
                  دوره‌ای با مشخصات جستجو شده یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= مودال جزئیات نظرسنجی ================= */}
      {selectedCourseModal && (
        <div className="modal-backdrop" onClick={() => setSelectedCourseModal(null)}>
          <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
            {/* سربرگ مودال */}
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>گزارش نظرسنجی و ارزیابی کیفیت تدریس</h3>
                <span className="modal-subtitle">
                  {selectedCourseModal.title} (کد: {selectedCourseModal.code})
                </span>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedCourseModal(null)}>
                <FiX />
              </button>
            </div>

            {/* بدنه مودال */}
            <div className="modal-body">
              {/* ۴ شاخص اصلی ارزیابی */}
              <div className="section-title">
                <FiCheckCircle className="sec-icon" />
                <span>شاخص‌های ۴ گانه ارزیابی تدریس</span>
              </div>

              <div className="criteria-grid">
                {/* شاخص ۱: تسلط و فن بیان */}
                <div className="criterion-card">
                  <div className="crit-head">
                    <span className="crit-title">
                      <FiAward className="crit-icon blue" /> ۱. تسلط و فن بیان اساتید
                    </span>
                    <span className="crit-score">{selectedCourseModal.criteria.mastery} <small>/ ۵</small></span>
                  </div>
                  <div className="crit-progress">
                    <div
                      className="crit-progress-bar blue"
                      style={{ width: `${getPercentage(selectedCourseModal.criteria.mastery)}%` }}
                    />
                  </div>
                  <span className="crit-meta">رضایت {getPercentage(selectedCourseModal.criteria.mastery)}٪ هنرجویان</span>
                </div>

                {/* شاخص ۲: پشتیبانی و پاسخگویی */}
                <div className="criterion-card">
                  <div className="crit-head">
                    <span className="crit-title">
                      <FiHeadphones className="crit-icon purple" /> ۲. پشتیبانی و پاسخگویی
                    </span>
                    <span className="crit-score">{selectedCourseModal.criteria.support} <small>/ ۵</small></span>
                  </div>
                  <div className="crit-progress">
                    <div
                      className="crit-progress-bar purple"
                      style={{ width: `${getPercentage(selectedCourseModal.criteria.support)}%` }}
                    />
                  </div>
                  <span className="crit-meta">رضایت {getPercentage(selectedCourseModal.criteria.support)}٪ هنرجویان</span>
                </div>

                {/* شاخص ۳: پروژه محور و کاربردی */}
                <div className="criterion-card">
                  <div className="crit-head">
                    <span className="crit-title">
                      <FiLayers className="crit-icon green" /> ۳. پروژه‌محور و کاربردی بودن
                    </span>
                    <span className="crit-score">{selectedCourseModal.criteria.practical} <small>/ ۵</small></span>
                  </div>
                  <div className="crit-progress">
                    <div
                      className="crit-progress-bar green"
                      style={{ width: `${getPercentage(selectedCourseModal.criteria.practical)}%` }}
                    />
                  </div>
                  <span className="crit-meta">رضایت {getPercentage(selectedCourseModal.criteria.practical)}٪ هنرجویان</span>
                </div>

                {/* شاخص ۴: منظم بودن استاد */}
                <div className="criterion-card">
                  <div className="crit-head">
                    <span className="crit-title">
                      <FiClock className="crit-icon orange" /> ۴. منظم بودن استاد و زمان‌بندی
                    </span>
                    <span className="crit-score">{selectedCourseModal.criteria.discipline} <small>/ ۵</small></span>
                  </div>
                  <div className="crit-progress">
                    <div
                      className="crit-progress-bar orange"
                      style={{ width: `${getPercentage(selectedCourseModal.criteria.discipline)}%` }}
                    />
                  </div>
                  <span className="crit-meta">رضایت {getPercentage(selectedCourseModal.criteria.discipline)}٪ هنرجویان</span>
                </div>
              </div>

              {/* جعبه مقایسه با بهترین کلاس (Benchmark) */}
              <div className="benchmark-box">
                <div className="benchmark-header">
                  <div className="bench-title">
                    <FiTrendingUp className="bench-icon" />
                    <span>مقایسه این کلاس با برترین کلاس آموزشگاه ({bestCourse.title})</span>
                  </div>
                  <span className="bench-badge">
                    {selectedCourseModal.id === bestCourse.id ? (
                      'این دوره دارای بالاترین رتبه رضایت است'
                    ) : (
                      `اختلاف میانگین: ${Math.abs(bestCourse.overallScore - selectedCourseModal.overallScore).toFixed(1)} نمره`
                    )}
                  </span>
                </div>

                <div className="benchmark-bars-wrapper">
                  <div className="benchmark-row">
                    <span className="bench-label">این کلاس ({selectedCourseModal.code}):</span>
                    <div className="bench-track">
                      <div
                        className="bench-fill current"
                        style={{ width: `${getPercentage(selectedCourseModal.overallScore)}%` }}
                      />
                    </div>
                    <span className="bench-val">{selectedCourseModal.overallScore} / ۵</span>
                  </div>

                  <div className="benchmark-row">
                    <span className="bench-label">بهترین کلاس ({bestCourse.code}):</span>
                    <div className="bench-track">
                      <div
                        className="bench-fill best"
                        style={{ width: `${getPercentage(bestCourse.overallScore)}%` }}
                      />
                    </div>
                    <span className="bench-val">{bestCourse.overallScore} / ۵</span>
                  </div>
                </div>
              </div>

              {/* بخش جمع‌بندی استاد */}
              <div className="summary-section">
                <div className="section-title">
                  <FiThumbsUp className="sec-icon" />
                  <span>جمع‌بندی و نتیجه‌گیری تحلیلی</span>
                </div>
                <div className="summary-cards-wrapper">
                  <div className="summary-card positive">
                    <h5>نقاط قوت تدریس در این دوره</h5>
                    <ul>
                      <li>تسلط فنی بسیار بالا و انتقال شفاف مفاهیم سخت به شکل ساده.</li>
                      <li>ارائه تمارین کاملاً کاربردی و منطبق با نیازهای بازار کار.</li>
                      <li>شروع منظم و تعهد بالا به سرفصل‌های اعلام‌شده.</li>
                    </ul>
                  </div>

                  <div className="summary-card suggestions">
                    <h5>فرصت‌های رشد و پیشنهادات بهبود</h5>
                    <ul>
                      <li>افزایش کانال‌های پشتیبانی آنلاین برای پاسخگویی سریع‌تر به ابهامات.</li>
                      <li>اختصاص دقایق ابتدایی هر جلسه به رفع اشکال تکالیف جلسه قبل.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* نظرات کیفی متنی هنرجویان */}
              <div className="student-comments-section">
                <div className="section-title">
                  <FiMessageSquare className="sec-icon" />
                  <span>نظرات و پیام‌های ثبت‌شده هنرجویان ({selectedCourseModal.comments.length} نظر)</span>
                </div>
                <div className="comments-list">
                  {selectedCourseModal.comments.map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-head">
                        <div className="comment-rating">
                          <FiStar className="star" /> <span>{c.rating}</span>
                        </div>
                        <span className="comment-date">{c.date}</span>
                      </div>
                      <p className="comment-body">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* فوتر مودال */}
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedCourseModal(null)}>
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
