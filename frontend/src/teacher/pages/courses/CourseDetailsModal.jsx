import React, { useState } from 'react';
import { 
  FiX, FiMapPin, FiClock, FiCalendar, FiAward, 
  FiTrendingUp, FiUsers, FiStar, FiDollarSign, 
  FiCheckCircle, FiMessageSquare, FiAlertTriangle, FiBookOpen 
} from 'react-icons/fi';

const CourseDetailsModal = ({ selectedCourse, setSelectedCourse, getStatusBadge }) => {
  const [activeTab, setActiveTab] = useState('academic'); // academic | engagement | satisfaction | financial

  if (!selectedCourse) return null;

  // داده‌های نمونه تحلیلی در صورت موجود نبودن در آبجکت اصلی
  const metrics = selectedCourse.metrics || {
    // ۱. عملکرد آموزشی
    gpa: '۱۸.۴',
    projectCompletion: 88,
    pacing: '+۲ جلسه جلوتر از بودجه‌بندی',
    pacingStatus: 'ahead', // 'ahead' | 'on-track' | 'behind'
    gradeDistribution: [
      { range: '۰-۱۰', count: 1, percent: 5 },
      { range: '۱۰-۱۴', count: 3, percent: 15 },
      { range: '۱۴-۱۷', count: 7, percent: 35 },
      { range: '۱۷-۲۰', count: 9, percent: 45 },
    ],
    // ۲. مشارکت و تعامل
    attendanceRate: 94,
    qaQuestionsCount: 142,
    qaResolvedCount: 138,
    avgAssignmentResponseHours: '۱۸ ساعت',
    // ۳. رضایت و کیفیت
    csatScore: 4.8,
    csatTotalVotes: 20,
    dropoutRate: 5,
    difficultyRating: 'متوسط رو به بالا (۳.۸ از ۵)',
    // ۴. مالی و بهره‌وری
    grossRevenue: '۴۵,۰۰۰,۰۰۰',
    netProfit: '۳۱,۵۰۰,۰۰۰',
    costToRevenueRatio: '۳۰٪',
    roi: '+۱۴۰٪'
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
      <div className="modal-card modal-analytics" onClick={(e) => e.stopPropagation()}>
        
        {/* هدر مودال */}
        <div className="modal-header">
          <div className="modal-header-text">
            <div className="title-row">
              <h3>{selectedCourse.title}</h3>
              <span className="modal-id">{selectedCourse.id}</span>
              {getStatusBadge && getStatusBadge(selectedCourse.status)}
            </div>
            <p className="modal-subtitle">گزارش جامع عملکرد آموزشی، مالی و آماری دوره</p>
          </div>
          <button className="close-modal-btn" onClick={() => setSelectedCourse(null)}>
            <FiX size={20} />
          </button>
        </div>

        {/* مشخصات پایه کلاس (شناسنامه) */}
        <div className="modal-meta-bar">
          <div className="meta-item">
            <FiMapPin className="meta-icon" />
            <span>محل: <strong>{selectedCourse.room || 'کلاس آنلاین ۱'}</strong></span>
          </div>
          <div className="meta-item">
            <FiClock className="meta-icon" />
            <span>زمان: <strong>{selectedCourse.schedule || 'زوج ۱۷:۰۰ تا ۱۹:۰۰'}</strong></span>
          </div>
          <div className="meta-item">
            <FiCalendar className="meta-icon" />
            <span>بازه: <strong>{selectedCourse.startDate} تا {selectedCourse.endDate}</strong></span>
          </div>
          <div className="meta-item">
            <FiAward className="meta-icon" />
            <span>نوع دوره: <strong>{selectedCourse.type || 'پروژه‌محور'}</strong></span>
          </div>
        </div>

        {/* منوی تب‌های تحلیلی */}
        <div className="analytics-tabs">
          <button 
            className={`tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            <FiTrendingUp /> ۱. عملکرد آموزشی
          </button>
          <button 
            className={`tab-btn ${activeTab === 'engagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('engagement')}
          >
            <FiUsers /> ۲. مشارکت و تعامل
          </button>
          <button 
            className={`tab-btn ${activeTab === 'satisfaction' ? 'active' : ''}`}
            onClick={() => setActiveTab('satisfaction')}
          >
            <FiStar /> ۳. رضایت و کیفیت
          </button>
          <button 
            className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
            onClick={() => setActiveTab('financial')}
          >
            <FiDollarSign /> ۴. شاخص‌های مالی
          </button>
        </div>

        <div className="modal-body analytics-body">
          
          {/* تب ۱: عملکرد آموزشی */}
          {activeTab === 'academic' && (
            <div className="tab-content">
              <div className="kpi-grid">
                <div className="kpi-card highlight">
                  <span className="kpi-label">میانگین نمرات (GPA)</span>
                  <div className="kpi-val-row">
                    <span className="kpi-value">{metrics.gpa}</span>
                    <span className="kpi-sub">از ۲۰</span>
                  </div>
                  <span className="badge-pill success">سطح کیفی: عالی</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">نرخ تکمیل پروژه</span>
                  <div className="kpi-val-row">
                    <span className="kpi-value">{metrics.projectCompletion}٪</span>
                  </div>
                  <div className="progress-bar-mini">
                    <div className="progress-fill fill-cyan" style={{ width: `${metrics.projectCompletion}%` }}></div>
                  </div>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">سرعت پیشرفت (Pacing)</span>
                  <div className="pacing-badge ahead">
                    <FiCheckCircle />
                    <span>{metrics.pacing}</span>
                  </div>
                  <p className="kpi-hint">پیشرفت سرفصل: {selectedCourse.progress || 75}٪</p>
                </div>
              </div>

              {/* هیستوگرام توزیع نمرات */}
              <div className="chart-card">
                <div className="chart-header">
                  <h4>📊 نمودار توزیع نمرات کلاس (Histogram)</h4>
                  <span className="chart-legend">تعداد هنرجویان به ازای بازه نمره</span>
                </div>
                <div className="histogram-container">
                  {metrics.gradeDistribution.map((bar, idx) => (
                    <div className="histogram-bar-col" key={idx}>
                      <span className="bar-count">{bar.count} نفر</span>
                      <div className="histogram-bar-track">
                        <div 
                          className="histogram-bar-fill" 
                          style={{ height: `${bar.percent * 1.8}px` }}
                        ></div>
                      </div>
                      <span className="bar-label">{bar.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* تب ۲: مشارکت و تعامل */}
          {activeTab === 'engagement' && (
            <div className="tab-content">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-icon-header">
                    <FiUsers className="icon-cyan" />
                    <span className="kpi-label">نرخ حضور و غیاب</span>
                  </div>
                  <span className="kpi-value">{metrics.attendanceRate}٪</span>
                  <div className="progress-bar-mini">
                    <div className="progress-fill fill-emerald" style={{ width: `${metrics.attendanceRate}%` }}></div>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-header">
                    <FiMessageSquare className="icon-blue" />
                    <span className="kpi-label">پرسش و پاسخ (Q&A)</span>
                  </div>
                  <span className="kpi-value">{metrics.qaResolvedCount} / {metrics.qaQuestionsCount}</span>
                  <span className="kpi-hint">۹۷٪ سوالات رفع اشکال شده‌اند</span>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-header">
                    <FiClock className="icon-amber" />
                    <span className="kpi-label">میانگین زمان ارسال تکلیف</span>
                  </div>
                  <span className="kpi-value">{metrics.avgAssignmentResponseHours}</span>
                  <span className="kpi-hint">شاخص پشتکار و پیگیری بالا</span>
                </div>
              </div>

              <div className="insight-box">
                <FiBookOpen className="insight-icon" />
                <div>
                  <strong>وضعیت تعامل کلاسی:</strong>
                  <p>هنرجویان این دوره بالاترین نرخ تحویل زودهنگام پروژه‌ها را نسبت به میانگین آموزشگاه داشته‌اند.</p>
                </div>
              </div>
            </div>
          )}

          {/* تب ۳: رضایت و کیفیت */}
          {activeTab === 'satisfaction' && (
            <div className="tab-content">
              <div className="kpi-grid">
                <div className="kpi-card highlight">
                  <span className="kpi-label">امتیاز رضایت (CSAT)</span>
                  <div className="rating-row">
                    <span className="rating-star">★</span>
                    <span className="kpi-value">{metrics.csatScore}</span>
                    <span className="kpi-sub">از ۵.۰</span>
                  </div>
                  <span className="kpi-hint">بر اساس بازخورد {metrics.csatTotalVotes} هنرجو</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">نرخ انصراف و ریزش (Dropout)</span>
                  <span className="kpi-value text-emerald">{metrics.dropoutRate}٪</span>
                  <span className="kpi-hint">بسیار مطلوب (میانگین مجاز: زیر ۱۰٪)</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">شاخص دشواری درک مطالب</span>
                  <span className="kpi-value-sm">{metrics.difficultyRating}</span>
                  <div className="progress-bar-mini">
                    <div className="progress-fill fill-amber" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تب ۴: شاخص‌های مالی و بهره‌وری */}
          {activeTab === 'financial' && (
            <div className="tab-content">
              <div className="kpi-grid">
                <div className="kpi-card">
                  <span className="kpi-label">شهریه ناخالص دریافتی</span>
                  <span className="kpi-value-sm text-cyan">{metrics.grossRevenue} تومان</span>
                </div>

                <div className="kpi-card highlight-profit">
                  <span className="kpi-label">سود خالص دوره</span>
                  <span className="kpi-value text-emerald">{metrics.netProfit} تومان</span>
                  <span className="badge-pill success">بازدهی: {metrics.roi}</span>
                </div>

                <div className="kpi-card">
                  <span className="kpi-label">نسبت هزینه به درآمد</span>
                  <span className="kpi-value">{metrics.costToRevenueRatio}</span>
                  <span className="kpi-hint">شامل حق‌التدریس و سرانه سیستم‌ها</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* فوتر مودال */}
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => window.open(`/courses/${selectedCourse.id}/report`, '_blank')}>
            📄 خروجی گزارش کامل دوره
          </button>
          <button className="btn-secondary" onClick={() => setSelectedCourse(null)}>
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};

export default CourseDetailsModal;
