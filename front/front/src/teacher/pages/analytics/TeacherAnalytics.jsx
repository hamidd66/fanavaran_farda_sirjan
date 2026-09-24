import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  FiTrendingUp,
  FiCheckCircle,
  FiUserCheck,
  FiAlertTriangle,
  FiAward,
  FiDownload,
  FiFilter,
  FiCalendar,
  FiMessageSquare,
  FiChevronLeft
} from 'react-icons/fi';
import '../../styles/TeacherAnalytics.css';

export default function TeacherAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState('react-101');
  const [timeRange, setTimeRange] = useState('all');

  // لیست دوره‌های استاد
  const courses = [
    { id: 'react-101', name: 'توسعه فرانت‌اند با React', code: 'REACT-01' },
    { id: 'py-201', name: 'برنامه‌نویسی پایتون و جنگو', code: 'PY-02' },
    { id: 'ui-301', name: 'طراحی رابط کاربری UI/UX', code: 'UI-03' }
  ];

  // داده‌های روند پیشرفت در جلسات (Line/Area Chart)
  const sessionProgressData = [
    { session: 'جلسه ۱', averageGrade: 78, attendanceRate: 95 },
    { session: 'جلسه ۲', averageGrade: 82, attendanceRate: 90 },
    { session: 'جلسه ۳', averageGrade: 80, attendanceRate: 92 },
    { session: 'جلسه ۴', averageGrade: 85, attendanceRate: 88 },
    { session: 'جلسه ۵', averageGrade: 74, attendanceRate: 85 },
    { session: 'جلسه ۶', averageGrade: 88, attendanceRate: 94 },
    { session: 'جلسه ۷', averageGrade: 91, attendanceRate: 91 },
    { session: 'جلسه ۸', averageGrade: 86, attendanceRate: 89 },
  ];

  // داده‌های توزیع نمرات (Bar Chart)
  const gradeDistributionData = [
    { range: 'عالی (۹۰-۱۰۰)', count: 8, fill: '#10b981' },
    { range: 'خوب (۷۵-۸۹)', count: 12, fill: '#2563eb' },
    { range: 'متوسط (۶۰-۷۴)', count: 5, fill: '#f59e0b' },
    { range: 'نیازمند تلاش (<۶۰)', count: 2, fill: '#ef4444' }
  ];

  // داده‌های وضعیت تکالیف (Doughnut Chart)
  const assignmentStatusData = [
    { name: 'ارسال به‌موقع و تایید شده', value: 65, color: '#10b981' },
    { name: 'ارسال با تاخیر', value: 15, color: '#f59e0b' },
    { name: 'نیازمند بازنگری', value: 12, color: '#6366f1' },
    { name: 'عدم ارسال', value: 8, color: '#ef4444' }
  ];

  // داده‌های نمودار راداری تسلط بر مباحث (Radar Chart)
  const skillMasteryData = [
    { subject: 'HTML & CSS', mastery: 95, fullMark: 100 },
    { subject: 'جاوااسکریپت نوین', mastery: 82, fullMark: 100 },
    { subject: 'کامپوننت‌های React', mastery: 88, fullMark: 100 },
    { subject: 'هوک‌ها و State', mastery: 74, fullMark: 100 },
    { subject: 'اتصال به API', mastery: 68, fullMark: 100 },
    { subject: 'پروژه پایانی', mastery: 85, fullMark: 100 }
  ];

  // برترین هنرجویان (Leaderboard)
  const topStudents = [
    { rank: 1, name: 'علی حسینی', code: 'ST-1002', grade: 98.5, avatarBg: '#dbeafe', avatarColor: '#2563eb' },
    { rank: 2, name: 'زهرا کاظمی', code: 'ST-1008', grade: 96.0, avatarBg: '#f3e8ff', avatarColor: '#7c3aed' },
    { rank: 3, name: 'سارا محمدی', code: 'ST-1014', grade: 94.5, avatarBg: '#dcfce7', avatarColor: '#16a34a' }
  ];

  // هنرجویان نیازمند پیگیری (At-Risk)
  const atRiskStudents = [
    { id: 1, name: 'امیر مرادی', code: 'ST-1019', issue: 'عدم تحویل ۲ تکلیف متوالی', avg: '۵۴.۰' },
    { id: 2, name: 'مهدی رضایی', code: 'ST-1025', issue: 'افت نمره در ۳ جلسه اخیر', avg: '۵۸.۵' }
  ];

  return (
    <div className="teacher-analytics-container" dir="rtl">
      {/* هدر صفحه و فیلترها */}
      <header className="analytics-header">
        <div className="header-info">
          <h1 className="page-title">نمودارها و تحلیل عملکرد</h1>
          <p className="page-subtitle">ارزیابی جامع پیشرفت تحصیلی، نرخ مشارکت و عملکرد کیفی دوره‌ها</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => window.print()}>
            <FiDownload /> دریافت گزارش تحلیلی
          </button>
        </div>
      </header>

      {/* نوار انتخاب دوره و فیلتر زمان */}
      <div className="analytics-controls-bar">
        <div className="course-tabs-wrapper">
          {courses.map((course) => (
            <button
              key={course.id}
              className={`course-tab-btn ${selectedCourse === course.id ? 'active' : ''}`}
              onClick={() => setSelectedCourse(course.id)}
            >
              <span className="course-name">{course.name}</span>
              <span className="course-tab-code">{course.code}</span>
            </button>
          ))}
        </div>

        <div className="filter-select-group">
          <div className="filter-item">
            <FiCalendar className="filter-icon" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="select-control"
            >
              <option value="all">تمام جلسات ترم</option>
              <option value="last30">۳۰ روز اخیر</option>
              <option value="midterm">تا میان‌ترم</option>
            </select>
          </div>
        </div>
      </div>

      {/* ۴ کارت شاخص‌های کلیدی (KPIs) */}
      <div className="kpi-grid">
        <div className="kpi-card card-blue">
          <div className="kpi-icon blue">
            <FiTrendingUp />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">میانگین نمرات دوره</span>
            <div className="kpi-value-row">
              <span className="kpi-value">۸۴.۵</span>
              <span className="kpi-unit">از ۱۰۰</span>
            </div>
            <span className="kpi-trend positive">+۳.۲٪ نسبت به ماه قبل</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon green">
            <FiCheckCircle />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">نرخ مشارکت در تکالیف</span>
            <div className="kpi-value-row">
              <span className="kpi-value">۹۲٪</span>
            </div>
            <span className="kpi-trend positive">تحویل به موقع و فعال</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon purple">
            <FiUserCheck />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">میانگین حضور در جلسات</span>
            <div className="kpi-value-row">
              <span className="kpi-value">۸۹.۵٪</span>
            </div>
            <span className="kpi-trend neutral">پایداری حضور در کلاس</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon orange">
            <FiAlertTriangle />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">نیازمند توجه و پیگیری</span>
            <div className="kpi-value-row">
              <span className="kpi-value">۲</span>
              <span className="kpi-unit">هنرجو</span>
            </div>
            <span className="kpi-trend warning">هشدار نمره زیر حد نصاب</span>
          </div>
        </div>
      </div>

      {/* بخش ردیف اول نمودارها (روند پیشرفت + توزیع نمرات) */}
      <div className="charts-grid-two">
        {/* نمودار روند جلسات */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>روند پیشرفت تحصیلی در طول جلسات</h3>
              <p>مقایسه میانگین نمره با نرخ حضور کلاس</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={sessionProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="session" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '13px' }} />
                <Area
                  type="monotone"
                  dataKey="averageGrade"
                  name="میانگین نمره"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradeGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="attendanceRate"
                  name="درصد حضور"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#attGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار توزیع نمرات */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>توزیع سطوح نمرات کلاسی</h3>
              <p>تعداد هنرجویان در هر بازه مهارتی</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="range" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} هنرجو`, 'تعداد']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* بخش ردیف دوم نمودارها (وضعیت تکالیف + تسلط بر مباحث) */}
      <div className="charts-grid-two">
        {/* نمودار وضعیت تکالیف */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>وضعیت کلی تحویل تکالیف</h3>
              <p>نسبت ارسال‌ها و وضعیت تایید استاد</p>
            </div>
          </div>
          <div className="donut-chart-layout">
            <div className="chart-wrapper" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assignmentStatusData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {assignmentStatusData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}٪`, 'درصد']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      direction: 'rtl'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="custom-legend-list">
              {assignmentStatusData.map((item, idx) => (
                <div key={idx} className="custom-legend-item">
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-val">{item.value}٪</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* نمودار راداری تسلط بر سرفصل‌ها */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>ارزیابی تسلط بر سرفصل‌ها</h3>
              <p>میانگین مهارت عملی کلاس در مباحث مختلف</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={skillMasteryData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar
                  name="میزان تسلط"
                  dataKey="mastery"
                  stroke="#7c3aed"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip
                  formatter={(val) => [`${val}٪`, 'میزان تسلط']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    direction: 'rtl'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* بخش پایین: لیدربرد برترین‌ها و هشدارهای کلاسی */}
      <div className="bottom-insights-grid">
        {/* کارت لیدربرد */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>
                <FiAward className="title-icon-gold" /> برترین هنرجویان دوره
              </h3>
              <p>بالاترین معدل و انضباط تحصیلی</p>
            </div>
          </div>
          <div className="top-students-list">
            {topStudents.map((st) => (
              <div key={st.code} className="top-student-row">
                <div className="rank-badge" data-rank={st.rank}>
                  {st.rank}
                </div>
                <div className="student-avatar" style={{ background: st.avatarBg, color: st.avatarColor }}>
                  {st.name.charAt(0)}
                </div>
                <div className="student-meta">
                  <strong>{st.name}</strong>
                  <span>کد: {st.code}</span>
                </div>
                <div className="student-grade-badge">
                  <span>معدل: {st.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* کارت هشدارهای کلاسی (At-Risk) */}
        <div className="analytics-card">
          <div className="card-header">
            <div className="card-title-group">
              <h3>
                <FiAlertTriangle className="title-icon-red" /> نیازمند بررسی و مداخله
              </h3>
              <p>هنرجویانی که دچار افت نمره یا تاخیر متوالی شده‌اند</p>
            </div>
          </div>
          <div className="at-risk-list">
            {atRiskStudents.map((st) => (
              <div key={st.id} className="at-risk-row">
                <div className="at-risk-info">
                  <strong>{st.name}</strong>
                  <span className="at-risk-code">کد: {st.code}</span>
                  <span className="at-risk-reason">{st.issue}</span>
                </div>
                <div className="at-risk-action">
                  <span className="risk-avg">میانگین: {st.avg}</span>
                  <button className="btn-send-message" title="ارسال پیام به هنرجو">
                    <FiMessageSquare /> پیام
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
