import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  FiBookOpen,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiPrinter,
  FiEye,
  FiX,
  FiLayers,
  FiArrowRight,
  FiSave,
  FiEdit3,
  FiFilter,
  FiRotateCcw
} from 'react-icons/fi';
import '../../styles/TeacherGrades.css';

// داده‌های اولیه نمونه دوره‌ها
const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'توسعه وب فرانت‌اند (React)',
    code: 'FE-201',
    studentsCount: 18,
    averageGrade: 17.8,
    status: 'active', // active | finalized
    sessionsCount: 16,
    currentSession: 10
  },
  {
    id: 'c2',
    title: 'برنامه‌نویسی پایتون پیشرفته',
    code: 'PY-301',
    studentsCount: 22,
    averageGrade: 16.2,
    status: 'active',
    sessionsCount: 20,
    currentSession: 14
  },
  {
    id: 'c3',
    title: 'طراحی رابط کاربری UI/UX',
    code: 'UX-101',
    studentsCount: 15,
    averageGrade: 18.5,
    status: 'finalized',
    sessionsCount: 12,
    currentSession: 12
  }
];

const INITIAL_STUDENTS = {
  c1: [
    {
      id: 'st-101',
      name: 'علیرضا حسینی',
      studentCode: '4021101',
      sessionGrades: { 1: 18, 2: 19, 3: 17, 4: 20, 5: 18, 6: 19, 7: 20, 8: 18, 9: 17, 10: 19 },
      midtermGrade: 27, // از 30
      finalGrade: 62,   // از 70
      discipline: 'عالی',
      notes: 'فعال در پروژه‌های تیمی'
    },
    {
      id: 'st-102',
      name: 'مهدی رضایی',
      studentCode: '4021102',
      sessionGrades: { 1: 15, 2: 16, 3: 14, 4: 15, 5: 16, 6: 15, 7: 17, 8: 16, 9: 15, 10: 16 },
      midtermGrade: 22,
      finalGrade: 54,
      discipline: 'خوب',
      notes: 'نیاز به تمرین بیشتر در هوک‌ها'
    },
    {
      id: 'st-103',
      name: 'سارا احمدی',
      studentCode: '4021103',
      sessionGrades: { 1: 20, 2: 20, 3: 19, 4: 20, 5: 20, 6: 20, 7: 19, 8: 20, 9: 20, 10: 20 },
      midtermGrade: 29,
      finalGrade: 68,
      discipline: 'عالی',
      notes: 'پروژه نهایی در سطح پیشرفته'
    }
  ],
  c2: [
    {
      id: 'st-201',
      name: 'نیما کریمی',
      studentCode: '4022101',
      sessionGrades: { 1: 16, 2: 17, 3: 15 },
      midtermGrade: 24,
      finalGrade: 58,
      discipline: 'خوب',
      notes: ''
    }
  ],
  c3: [
    {
      id: 'st-301',
      name: 'زهرا کاظمی',
      studentCode: '4023101',
      sessionGrades: { 1: 19, 2: 18, 3: 20 },
      midtermGrade: 28,
      finalGrade: 66,
      discipline: 'عالی',
      notes: 'طراحی دیزاین سیستم بی‌نقص'
    }
  ]
};

export default function TeacherGrades() {
  // ۱. تعریف استیت‌های اصلی
  const [courses] = useState(INITIAL_COURSES);
  const [studentsData, setStudentsData] = useState(INITIAL_STUDENTS);

  // مدیریت نمای فعال: 'list' (لیست کلاس‌ها) یا 'details' (ثبت نمرات کلاس انتخابی)
  const [viewMode, setViewMode] = useState('list');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [activeTab, setActiveTab] = useState('sessions'); // sessions | terms
  const [selectedSession, setSelectedSession] = useState(1);
  const [examType, setExamType] = useState('midterm'); // midterm | final
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | finalized

  // استیت‌های مودال و Toast
  const [reportModalStudent, setReportModalStudent] = useState(null);
  const [analyticsCourse, setAnalyticsCourse] = useState(null);
  const [saveToast, setSaveToast] = useState(false);

  const reportCardRef = useRef(null);

  // ۲. دوره انتخابی و دانش‌آموزان آن
  const currentCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || null;
  }, [courses, selectedCourseId]);

  const currentStudents = useMemo(() => {
    if (!selectedCourseId) return [];
    return studentsData[selectedCourseId] || [];
  }, [studentsData, selectedCourseId]);

  // ۳. تحلیل آماری برای کارنامه فردی دانش‌آموز انتخابی
  const studentAnalysis = useMemo(() => {
    if (!reportModalStudent || !currentStudents.length) return null;

    const scores = currentStudents
      .map((s) => {
        const sessionValues = s.sessionGrades ? Object.values(s.sessionGrades) : [];
        const sessionAvg = sessionValues.length
          ? sessionValues.reduce((a, b) => a + Number(b || 0), 0) / sessionValues.length
          : 18;

        const classwork = Math.round(sessionAvg);
        const project = 18;
        const midterm = Number(s.midtermGrade ?? 0);
        const final = Number(s.finalGrade ?? 0);
        const total = classwork + project + midterm + final;
        return { id: s.id, total, classwork, project, midterm, final };
      })
      .sort((a, b) => b.total - a.total);

    const currentReportScore = scores.find((s) => s.id === reportModalStudent.id) || {
      classwork: 18,
      project: 18,
      midterm: Number(reportModalStudent.midtermGrade ?? 0),
      final: Number(reportModalStudent.finalGrade ?? 0),
      total: 0
    };

    const studentTotal = currentReportScore.total || (currentReportScore.classwork + currentReportScore.project + currentReportScore.midterm + currentReportScore.final);
    const totalSum = scores.reduce((acc, curr) => acc + curr.total, 0);
    const classAvg = scores.length ? (totalSum / scores.length).toFixed(1) : '0';
    const highestScore = Math.max(...scores.map((s) => s.total), 0);
    const rank = scores.findIndex((s) => s.id === reportModalStudent.id) + 1;
    const totalStudents = currentStudents.length;

    return {
      classwork: currentReportScore.classwork,
      project: currentReportScore.project,
      midterm: currentReportScore.midterm,
      final: currentReportScore.final,
      studentTotal,
      classAvg,
      highestScore,
      rank: rank > 0 ? rank : 1,
      totalStudents,
      isPassed: studentTotal >= 60,
    };
  }, [reportModalStudent, currentStudents]);

  // ۴. تحلیل آماری جامع برای مودال تحلیل عملکرد کل کلاس
  const classAnalyticsData = useMemo(() => {
    if (!analyticsCourse) return null;

    const courseStudents = studentsData[analyticsCourse.id] || [];
    const totalStudents = courseStudents.length;

    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        passedCount: 0,
        failedCount: 0,
        passRate: 0,
        classAvg: 0,
        highestScore: 0,
        lowestScore: 0,
        topStudents: [],
        gradeDistribution: { excellent: 0, good: 0, average: 0, weak: 0 },
        sessionsAvgMap: []
      };
    }

    const studentScores = courseStudents.map((st) => {
      const sessionVals = st.sessionGrades ? Object.values(st.sessionGrades) : [];
      const sessionAvg = sessionVals.length
        ? sessionVals.reduce((a, b) => a + Number(b || 0), 0) / sessionVals.length
        : 18;
      const classwork = Math.round(sessionAvg);
      const project = 18;
      const midterm = Number(st.midtermGrade || 0);
      const final = Number(st.finalGrade || 0);
      const total = classwork + project + midterm + final;

      return {
        id: st.id,
        name: st.name,
        studentCode: st.studentCode,
        total,
        midterm,
        final,
        discipline: st.discipline || 'عالی'
      };
    }).sort((a, b) => b.total - a.total);

    const totalSum = studentScores.reduce((acc, s) => acc + s.total, 0);
    const classAvg = (totalSum / totalStudents).toFixed(1);
    const highestScore = Math.max(...studentScores.map(s => s.total), 0);
    const lowestScore = Math.min(...studentScores.map(s => s.total), 0);

    const passedStudents = studentScores.filter(s => s.total >= 60);
    const passedCount = passedStudents.length;
    const failedCount = totalStudents - passedCount;
    const passRate = Math.round((passedCount / totalStudents) * 100);

    const gradeDistribution = {
      excellent: studentScores.filter(s => s.total >= 85).length,
      good: studentScores.filter(s => s.total >= 70 && s.total < 85).length,
      average: studentScores.filter(s => s.total >= 60 && s.total < 70).length,
      weak: studentScores.filter(s => s.total < 60).length
    };

    const sessionsCount = analyticsCourse.currentSession || analyticsCourse.sessionsCount || 10;
    const sessionsAvgMap = Array.from({ length: sessionsCount }, (_, i) => {
      const sNum = i + 1;
      let sSum = 0;
      let sCount = 0;
      courseStudents.forEach(st => {
        if (st.sessionGrades && st.sessionGrades[sNum] !== undefined) {
          sSum += Number(st.sessionGrades[sNum]);
          sCount++;
        }
      });
      return {
        session: sNum,
        avg: sCount ? (sSum / sCount).toFixed(1) : 0
      };
    });

    return {
      totalStudents,
      passedCount,
      failedCount,
      passRate,
      classAvg,
      highestScore,
      lowestScore,
      topStudents: studentScores.slice(0, 3),
      gradeDistribution,
      sessionsAvgMap
    };
  }, [analyticsCourse, studentsData]);

  // تنظیم جلسه اولیه با تغییر دوره
  useEffect(() => {
    if (currentCourse) {
      setSelectedSession(currentCourse.currentSession || 1);
    }
  }, [currentCourse]);

  // مدیریت تایمر ذخیره موقت
  useEffect(() => {
    let timer;
    if (saveToast) {
      timer = setTimeout(() => {
        setSaveToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [saveToast]);

  // فیلتر دانش‌آموزان در بخش جزئیات
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return currentStudents;
    const q = searchQuery.toLowerCase().trim();
    return currentStudents.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.studentCode && s.studentCode.toLowerCase().includes(q))
    );
  }, [currentStudents, searchQuery]);

  // فیلتر کلاس‌ها بر اساس جستجو و وضعیت دوره
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (c.code && c.code.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesStatus =
        statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  // آمار کلی کارت‌های بالای داشبورد
  const stats = useMemo(() => {
    const totalStudents = courses.reduce((acc, curr) => acc + (Number(curr.studentsCount) || 0), 0);
    const avgSum = courses.reduce((acc, curr) => acc + (Number(curr.averageGrade) || 0), 0);
    const overallAvg = courses.length ? (avgSum / courses.length).toFixed(1) : '0';
    const finalizedCount = courses.filter((c) => c.status === 'finalized').length;

    return {
      coursesCount: courses.length,
      totalStudents,
      overallAvg,
      finalizedCount
    };
  }, [courses]);

  // اکشن‌های کاربری
  const handleOpenCourseDetails = (courseId) => {
    setSelectedCourseId(courseId);
    setViewMode('details');
    setSearchQuery('');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCourseId(null);
    setSearchQuery('');
  };

  const handleSessionGradeChange = (studentId, sessionNum, val) => {
    const num = val === '' ? '' : Math.min(20, Math.max(0, Number(val) || 0));
    setStudentsData((prev) => ({
      ...prev,
      [selectedCourseId]: (prev[selectedCourseId] || []).map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            sessionGrades: {
              ...(st.sessionGrades || {}),
              [sessionNum]: num
            }
          };
        }
        return st;
      })
    }));
  };

  const handleExamGradeChange = (studentId, type, val) => {
    const max = type === 'midterm' ? 30 : 70;
    const num = val === '' ? '' : Math.min(max, Math.max(0, Number(val) || 0));
    setStudentsData((prev) => ({
      ...prev,
      [selectedCourseId]: (prev[selectedCourseId] || []).map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            [type === 'midterm' ? 'midtermGrade' : 'finalGrade']: num
          };
        }
        return st;
      })
    }));
  };

  const handleMetaChange = (studentId, field, val) => {
    setStudentsData((prev) => ({
      ...prev,
      [selectedCourseId]: (prev[selectedCourseId] || []).map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            [field]: val
          };
        }
        return st;
      })
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleTempSave = () => {
    setSaveToast(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (



    <div className="teacher-grades-container">
      {/* پیام موفقیت ذخیره موقت */}
      {saveToast && (
        <div className="toast-notification">
          <FiCheckCircle size={20} />
          <span>تغییرات نمرات با موفقیت ذخیره موقت گردید.</span>
        </div>
      )}

      {/* هدر صفحه */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {viewMode === 'list' ? 'مدیریت و ارزیابی کلاس‌ها' : `ثبت نمرات: ${currentCourse?.title}`}
          </h1>
          <p className="page-subtitle">
            {viewMode === 'list'
              ? 'لیست دوره‌های آموزشی شما، تحلیل آماری و ورود به بخش ثبت نمرات'
              : `کد دوره: ${currentCourse?.code} | مدیریت نمرات جلسات، آزمون‌ها و صدور کارنامه`}
          </p>
        </div>

        {/* دکمه بازگشت به لیست در سمت چپ هدر */}
        <div className="header-actions">
          {viewMode === 'details' && (
            <button type="button" className="btn btn-outline" onClick={handleBackToList}>
              <FiArrowRight />
              <span>بازگشت به لیست کلاس‌ها</span>
            </button>
          )}
        </div>
      </div>

    {/* KPI Summary Cards - استایل دقیقاً مطابق StudentsList */}
{viewMode === 'list' && (
  <div className="courses-kpi-grid">
    <div className="kpi-card card-blue">
      <div className="kpi-icon kpi-icon-blue">
        <FiBookOpen size={22} />
      </div>
      <div className="kpi-info">
        <span className="kpi-label">دوره‌های تحت تدریس</span>
        <span className="kpi-value">
          {stats.coursesCount} <small>دوره</small>
        </span>
      </div>
    </div>

    <div className="kpi-card card-purple">
      <div className="kpi-icon kpi-icon-purple">
        <FiUsers size={22} />
      </div>
      <div className="kpi-info">
        <span className="kpi-label">کل فراگیران فعال</span>
        <span className="kpi-value">
          {stats.totalStudents} <small>نفر</small>
        </span>
      </div>
    </div>

    <div className="kpi-card card-emerald">
      <div className="kpi-icon kpi-icon-green">
        <FiCheckCircle size={22} />
      </div>
      <div className="kpi-info">
        <span className="kpi-label">نمرات نهایی‌شده</span>
        <span className="kpi-value">
          {stats.gradedCount} <small>نفر</small>
        </span>
      </div>
    </div>

    <div className="kpi-card card-amber">
      <div className="kpi-icon kpi-icon-amber">
        <FiAward size={22} />
      </div>
      <div className="kpi-info">
        <span className="kpi-label">میانگین نمرات ثبت‌شده</span>
        <span className="kpi-value">
          {stats.avgGrade} <small>از ۱۰۰</small>
        </span>
      </div>
    </div>
  </div>
)}


     

    {/* ۳. جعبه فیلتر و جستجوی کلاس‌ها */}
{viewMode === 'list' && (
  <div className="courses-filter-panel">
    <div className="search-box">
      <FiSearch className="search-icon" size={18} />
      <input
        type="text"
        placeholder="جستجو در نام یا کد دوره..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => setSearchQuery('')}
        >
          ✕
        </button>
      )}
    </div>

    <div className="filter-selects">
      <div className="select-wrapper">
        <FiFilter className="select-icon" size={16} />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">در حال برگزاری</option>
          <option value="finalized">پایان‌یافته</option>
        </select>
      </div>

      {(searchQuery !== '' || statusFilter !== 'all') && (
        <button
          type="button"
          className="reset-filters-btn"
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        >
          <FiRotateCcw size={15} />
          <span>بازنشانی</span>
        </button>
      )}
    </div>
  </div>
)}



      {/* 1. نمای لیست کلاس‌ها (VIEWMODE === 'LIST')                */}
   
      {viewMode === 'list' && (
        <div className="table-responsive-container">
          <div className="table-controls-wrapper" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center' }}>
            
            
          

          <table className="grades-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>عنوان دوره</th>
                <th>کد دوره</th>
                <th>تعداد فراگیران</th>
                <th>جلسات برگزارشده</th>
                <th>میانگین کلاس</th>
                <th>وضعیت دوره</th>
                <th className="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong style={{ color: '#0f172a' }}>{course.title}</strong>
                    </td>
                    <td>
                      <span className="student-code-badge">{course.code}</span>
                    </td>
                    <td>{course.studentsCount} نفر</td>
                    <td>
                      {course.currentSession} از {course.sessionsCount} جلسه
                    </td>
                    <td>
                      <strong style={{ color: '#2563eb' }}>{course.averageGrade}</strong> از ۲۰
                    </td>
                    <td>
                      <span className={`status-tag ${course.status === 'finalized' ? 'pass' : 'fail'}`}>
                        {course.status === 'finalized' ? 'پایان‌یافته' : 'در حال برگزاری'}
                      </span>
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        {/* دکمه ثبت نمرات فقط در صورت پایان‌نیافتن کلاس نمایش داده می‌شود */}
                        {course.status !== 'finalized' && (
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            title="ثبت و مدیریت نمرات"
                            onClick={() => handleOpenCourseDetails(course.id)}
                          >
                            <FiEdit3 />
                            <span>ثبت نمرات</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', color: '#7c3aed', borderColor: '#ddd6fe' }}
                          title="تحلیل آماری کلاس"
                          onClick={() => setAnalyticsCourse(course)}
                        >
                          <FiTrendingUp />
                          <span>تحلیل آماری</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-state">
                    <FiAlertCircle size={32} />
                    <p>هیچ دوره‌ای با این مشخصات یافت نشد.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      )}


      {/* ======================================================== */}
      {/* 2. نمای ثبت نمرات (VIEWMODE === 'DETAILS')              */}
      {/* ======================================================== */}
      {viewMode === 'details' && (
        <div className="details-view-wrapper">
          {/* نوار کنترل ثبت نمرات */}
          <div className="table-controls-wrapper">
            <div className="left-controls">
              <div className="nav-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sessions')}
                >
                  <FiCalendar />
                  <span>نمرات جلسات کلاسی</span>
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('terms')}
                >
                  <FiLayers />
                  <span>نمرات میان‌ترم و پایان‌ترم</span>
                </button>
              </div>
            </div>

            <div className="right-controls">
              {activeTab === 'sessions' && (
                <div className="session-select-box">
                  <label htmlFor="session-select">انتخاب جلسه:</label>
                  <select
                    id="session-select"
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(Number(e.target.value))}
                    className="select-input"
                  >
                    {Array.from({ length: currentCourse?.sessionsCount || 0 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>
                        جلسه {s} {s === currentCourse?.currentSession ? '(جلسه اخیر)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="session-select-box">
                  <label htmlFor="exam-type-select">مرحله آزمون:</label>
                  <select
                    id="exam-type-select"
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="select-input"
                  >
                    <option value="midterm">آزمون میان‌ترم (۳۰ نمره)</option>
                    <option value="final">آزمون جامع پایان‌ترم (۷۰ نمره)</option>
                  </select>
                </div>
              )}

              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="جستجوی نام یا شماره دانش‌آموز..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* جدول ثبت نمرات دانش‌آموزان */}
          <div className="table-responsive-container">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>مشخصات فراگیر</th>
                  <th>شماره دانش‌آموزی</th>
                  {activeTab === 'sessions' ? (
                    <>
                      <th>نمره جلسه {selectedSession} (از ۲۰)</th>
                      <th>وضعیت انضباط</th>
                      <th>توضیحات و بازخورد استاد</th>
                    </>
                  ) : (
                    <>
                      <th>{examType === 'midterm' ? 'نمره میان‌ترم (از ۳۰)' : 'نمره پایان‌ترم (از ۷۰)'}</th>
                      <th>مجموع کل نمره (از ۱۰۰)</th>
                      <th>وضعیت قبولی</th>
                    </>
                  )}
                  <th className="text-center">کارنامه</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st, idx) => {
                    const sessionGrade = st.sessionGrades?.[selectedSession] ?? '';
                    const mGrade = Number(st.midtermGrade) || 0;
                    const fGrade = Number(st.finalGrade) || 0;
                    const totalScore = mGrade + fGrade;
                    const isPassed = totalScore >= 60;

                    return (
                      <tr key={st.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="student-name-cell">
                            <strong>{st.name}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="student-code-badge">{st.studentCode}</span>
                        </td>

                        {activeTab === 'sessions' ? (
                          <>
                            <td>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.5"
                                value={sessionGrade}
                                placeholder="نمره..."
                                onChange={(e) =>
                                  handleSessionGradeChange(st.id, selectedSession, e.target.value)
                                }
                                className="grade-input"
                              />
                            </td>
                            <td>
                              <select
                                value={st.discipline || 'عالی'}
                                onChange={(e) => handleMetaChange(st.id, 'discipline', e.target.value)}
                                className="status-select"
                              >
                                <option value="عالی">عالی</option>
                                <option value="خوب">خوب</option>
                                <option value="متوسط">متوسط</option>
                                <option value="نیاز به تلاش">نیاز به تلاش</option>
                              </select>
                            </td>
                            <td>
                              <input
                                type="text"
                                value={st.notes || ''}
                                placeholder="یادداشت در مورد عملکرد..."
                                onChange={(e) => handleMetaChange(st.id, 'notes', e.target.value)}
                                className="notes-input"
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <input
                                type="number"
                                min="0"
                                max={examType === 'midterm' ? 30 : 70}
                                value={examType === 'midterm' ? (st.midtermGrade ?? '') : (st.finalGrade ?? '')}
                                placeholder="نمره آزمون..."
                                onChange={(e) =>
                                  handleExamGradeChange(st.id, examType, e.target.value)
                                }
                                className="grade-input"
                              />
                            </td>
                            <td>
                              <strong style={{ color: isPassed ? '#10b981' : '#ef4444', fontSize: '1.05rem' }}>
                                {totalScore}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / ۱۰۰</span>
                            </td>
                            <td>
                              <span className={`status-tag ${isPassed ? 'pass' : 'fail'}`}>
                                {isPassed ? 'قبول' : 'مردود'}
                              </span>
                            </td>
                          </>
                        )}

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            title="مشاهده کارنامه"
                            onClick={() => setReportModalStudent(st)}
                          >
                            <FiEye />
                            <span>کارنامه</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={activeTab === 'sessions' ? 6 : 6} className="empty-table-state">
                      <FiAlertCircle size={32} />
                      <p>هنرجویی با این مشخصات یافت نشد.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* بخش پایین جدول: دکمه ذخیره موقت */}
            <div className="table-bottom-actions">
              <span className="save-hint-text">
                نکته: نمرات وارد شده تا زمان تأیید نهایی، با دکمه ذخیره موقت نگهداری می‌شوند.
              </span>
              <button type="button" className="btn btn-primary" onClick={handleTempSave}>
                <FiSave />
                <span>ذخیره موقت نمرات</span>
              </button>
            </div>
          </div>
        </div>
      )}

    {/* مودال کارنامه جامع و ارزیابی مهارتی فراگیر */}
{reportModalStudent && studentAnalysis && (
  <div className="modal-backdrop">
    <div className="modal-card report-card-modal">
      
      {/* سربرگ پنجره مودال */}
      <div className="modal-header">
        <div className="modal-title-wrap">
          <FiAward className="modal-title-icon" size={22} />
          <h3>کارنامه جامع و ارزیابی مهارتی</h3>
        </div>
        <button
          type="button"
          className="close-modal-btn"
          onClick={() => setReportModalStudent(null)}
        >
          <FiX size={20} />
        </button>
      </div>

      {/* ناحیه محتوا و چاپ */}
      <div className="modal-body print-area" ref={reportCardRef}>
        
        {/* سربرگ رسمی آموزشگاه */}
        <div className="rc-official-header">
          <div className="rc-brand">
            <div className="rc-logo-badge">FF</div>
            <div className="rc-brand-text">
              <h4>مجتمع آموزشی و پژوهشی فناوران فردا</h4>
              <p>سیستم یکپارچه مدیریت و ارزشیابی نمرات فراگیران</p>
            </div>
          </div>
          <div className="rc-doc-meta">
            <span>شماره پرونده: <strong>{reportModalStudent.studentCode || '---'}</strong></span>
            <span>تاریخ صدور: <strong>{new Date().toLocaleDateString('fa-IR')}</strong></span>
          </div>
        </div>

        {/* کارت مشخصات فراگیر */}
        <div className="rc-profile-banner">
          <div className="rc-student-avatar">
            <FiUsers size={26} />
          </div>
          <div className="rc-profile-grid">
            <div className="rc-field">
              <span className="rc-field-lbl">نام و نام خانوادگی:</span>
              <strong className="rc-field-val">{reportModalStudent.name}</strong>
            </div>
            <div className="rc-field">
              <span className="rc-field-lbl">کد فراگیر:</span>
              <strong className="rc-field-val">{reportModalStudent.studentCode}</strong>
            </div>
            <div className="rc-field">
              <span className="rc-field-lbl">عنوان دوره تخصصی:</span>
              <strong className="rc-field-val">{currentCourse?.title}</strong>
            </div>
            <div className="rc-field">
              <span className="rc-field-lbl">کد شناسه دوره:</span>
              <strong className="rc-field-val">{currentCourse?.code}</strong>
            </div>
          </div>
        </div>

        {/* شاخص‌های کلیدی آماری (KPIs) */}
        <div className="rc-summary-kpis">
          <div className="rc-kpi-item">
            <span className="lbl">نمره کل پایانی</span>
            <span className={`val ${studentAnalysis.isPassed ? 'text-success' : 'text-danger'}`}>
              {studentAnalysis.studentTotal} <small>/ ۱۰۰</small>
            </span>
          </div>
          <div className="rc-kpi-item">
            <span className="lbl">رتبه در کلاس</span>
            <span className="val text-primary">
              {studentAnalysis.rank} <small>از {studentAnalysis.totalStudents} نفر</small>
            </span>
          </div>
          <div className="rc-kpi-item">
            <span className="lbl">میانگین کل دوره</span>
            <span className="val text-muted">
              {studentAnalysis.classAvg} <small>/ ۱۰۰</small>
            </span>
          </div>
          <div className="rc-kpi-item">
            <span className="lbl">نتیجه نهایی</span>
            <span className={`rc-status-pill ${studentAnalysis.isPassed ? 'status-pass' : 'status-fail'}`}>
              {studentAnalysis.isPassed ? 'شایسته دریافت گواهی' : 'نیاز به آزمون مجدد'}
            </span>
          </div>
        </div>

        {/* جدول ریز نمرات تمام بخش‌های ترم */}
        <div className="rc-table-wrapper">
          <h5 className="rc-section-title">
            <FiBookOpen size={16} /> ریز ارزیابی عملکرد و آزمون‌های ترم
          </h5>
          <table className="rc-scores-table">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>شاخص ارزیابی</th>
                <th>سقف نمره</th>
                <th>نمره اخذ شده</th>
                <th>درصد</th>
                <th>ارزیابی عملکرد</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>۱</td>
                <td>
                  <strong>فعالیت کلاسی، تکالیف و حضور در جلسات</strong>
                  <small>مشارکت در جلسات، کوییزهای کلاسی و تکالیف پیوسته</small>
                </td>
                <td>۲۰</td>
                <td><strong>{studentAnalysis.classwork}</strong></td>
                <td>{Math.round((studentAnalysis.classwork / 20) * 100)}٪</td>
                <td>
                  <span className={`badge-pill ${studentAnalysis.classwork >= 14 ? 'badge-green' : 'badge-amber'}`}>
                    {studentAnalysis.classwork >= 17 ? 'بسیار فعال' : studentAnalysis.classwork >= 14 ? 'مطلوب' : 'متوسط'}
                  </span>
                </td>
              </tr>
              {/* <tr>
                <td>۲</td>
                <td>
                  <strong>پروژه مهارتی و ژوژمان عملی</strong>
                  <small>اجرای پروژه‌های کدی/عملی طبق استاندارد بازار کار</small>
                </td>
                <td>۲۰</td>
                <td><strong>{studentAnalysis.project}</strong></td>
                <td>{Math.round((studentAnalysis.project / 20) * 100)}٪</td>
                <td>
                  <span className={`badge-pill ${studentAnalysis.project >= 14 ? 'badge-green' : 'badge-amber'}`}>
                    {studentAnalysis.project >= 16 ? 'خلاقانه و عالی' : 'قابل قبول'}
                  </span>
                </td>
              </tr> */}
              <tr>
                <td>2</td>
                <td>
                  <strong>آزمون مهارتی میان‌ترم</strong>
                  <small>ارزیابی تئوری و عملی مفاهیم نیمه اول ترم</small>
                </td>
                <td>۲۰</td>
                <td><strong>{studentAnalysis.midterm}</strong></td>
                <td>{Math.round((studentAnalysis.midterm / 20) * 100)}٪</td>
                <td>
                  <span className={`badge-pill ${studentAnalysis.midterm >= 12 ? 'badge-green' : 'badge-red'}`}>
                    {studentAnalysis.midterm >= 15 ? 'عالی' : studentAnalysis.midterm >= 12 ? 'مناسب' : 'نیاز به تقویت'}
                  </span>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>
                  <strong>آزمون جامع پایان‌ترم</strong>
                  <small>سنجش تسلط بر مهارت‌های کلیدی و اهداف آموزشی دوره</small>
                </td>
                <td>۴۰</td>
                <td><strong>{studentAnalysis.final}</strong></td>
                <td>{Math.round((studentAnalysis.final / 40) * 100)}٪</td>
                <td>
                  <span className={`badge-pill ${studentAnalysis.final >= 24 ? 'badge-green' : 'badge-red'}`}>
                    {studentAnalysis.final >= 32 ? 'مسلط' : studentAnalysis.final >= 24 ? 'قبول' : 'عدم تسلط'}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="rc-total-row">
                <td colSpan="2"><strong>مجموع نمرات و معدل نهایی</strong></td>
                <td><strong>۱۰۰</strong></td>
                <td className="rc-grand-score"><strong>{studentAnalysis.studentTotal}</strong></td>
                <td><strong>{studentAnalysis.studentTotal}٪</strong></td>
                <td>
                  <strong className={studentAnalysis.isPassed ? 'text-success' : 'text-danger'}>
                    {studentAnalysis.isPassed ? 'قبول نهایی (احراز حدنصاب)' : 'عدم احراز حدنصاب'}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* مقایسه بصری عملکرد فراگیر با میانگین کلاس */}
        <div className="rc-benchmark-box">
          <h5 className="rc-section-title">
            <FiTrendingUp size={16} /> مقایسه نمره با میانگین کلاس
          </h5>
          <div className="benchmark-bar-container">
            <div className="bar-labels">
              <span>نمره فراگیر: <strong>{studentAnalysis.studentTotal}</strong></span>
              <span>میانگین دوره: <strong>{studentAnalysis.classAvg}</strong></span>
              <span>بالاترین نمره دوره: <strong>{studentAnalysis.highestScore}</strong></span>
            </div>
            <div className="benchmark-progress-track">
              <div
                className="benchmark-student-fill"
                style={{ width: `${Math.min(studentAnalysis.studentTotal, 100)}%` }}
              >
                <span>{studentAnalysis.studentTotal}٪</span>
              </div>
              <div
                className="benchmark-avg-marker"
                style={{ right: `${Math.min(Number(studentAnalysis.classAvg), 100)}%` }}
              >
                <div className="marker-pin"></div>
                <span className="marker-txt">میانگین ({studentAnalysis.classAvg})</span>
              </div>
            </div>
          </div>
        </div>

        {/* فیدبک و امضاها */}
        <div className="rc-feedback-signatures">
          <div className="rc-feedback-card">
            <div>
              <strong>انضباط و اخلاق حرفه‌ای: </strong>
              <span>{reportModalStudent.discipline || 'بسیار منظم و مسئولیت‌پذیر'}</span>
            </div>
            <div>
              <strong>توصیه و بازخورد استاد: </strong>
              <span>{reportModalStudent.notes || 'تسلط مهارتی و روند آموزشی فراگیر در طول ترم کاملاً رضایت‌بخش بوده است.'}</span>
            </div>
          </div>
          <div className="rc-signatures-card">
            <div className="sign-box">
              <span>محل امضای استاد دوره</span>
              <div className="sign-space"></div>
            </div>
            <div className="sign-box">
              <span>مهر و امضای مدیریت آموزشگاه</span>
              <div className="sign-space"></div>
            </div>
          </div>
        </div>

      </div>

      {/* دکمه‌های فوتر مودال */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => setReportModalStudent(null)}
        >
          بستن
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handlePrint}
        >
          <FiPrinter size={16} />
          <span>چاپ کارنامه</span>
        </button>
      </div>

    </div>
  </div>
)}


            {/* مودال تحلیل آماری جامع کلاس */}
      {analyticsCourse && classAnalyticsData && (
        <div className="modal-backdrop" onClick={() => setAnalyticsCourse(null)}>
          <div className="report-card-modal analytics-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* سربرگ مودال */}
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <FiTrendingUp />
                </div>
                <div>
                  <h3 className="modal-title">گزارش و تحلیل آماری عملکرد کلاس</h3>
                  <p className="modal-subtitle">
                    دوره: <strong>{analyticsCourse.title}</strong> ({analyticsCourse.code})
                  </p>
                </div>
              </div>
              <button className="btn-close-modal btn btn-danger" onClick={() => setAnalyticsCourse(null)}>
                <FiX />
              </button>
            </div>

            {/* بدنه اسکرول‌پذیر مودال */}
            <div className="modal-body">
              
              {/* ۴ کارت شاخص کلیدی (KPIs) */}
              <div className="analytics-kpi-grid">
                <div className="kpi-stat-card card-blue">
                  <div className="kpi-icon"><FiUsers /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">تعداد فراگیران</span>
                    <span className="kpi-value">{classAnalyticsData.totalStudents} نفر</span>
                  </div>
                </div>

                <div className="kpi-stat-card card-green">
                  <div className="kpi-icon"><FiAward /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">میانگین کل دوره</span>
                    <span className="kpi-value">{classAnalyticsData.classAvg} <small>/ ۱۰۰</small></span>
                  </div>
                </div>

                <div className="kpi-stat-card card-purple">
                  <div className="kpi-icon"><FiCheckCircle /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">درصد قبولی کلاس</span>
                    <span className="kpi-value">{classAnalyticsData.passRate}٪</span>
                  </div>
                </div>

                <div className="kpi-stat-card card-orange">
                  <div className="kpi-icon"><FiTrendingUp /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">بازه نمرات (کمترین / بیشترین)</span>
                    <span className="kpi-value">{classAnalyticsData.lowestScore} - {classAnalyticsData.highestScore}</span>
                  </div>
                </div>
              </div>

              {/* بخش توزیع نمرات و نفرات برتر */}
              <div className="analytics-row-two-col">
                
                {/* نمودار توزیع سطح نمرات */}
                <div className="analytics-box">
                  <h4 className="analytics-box-title">
                    <FiLayers /> توزیع فراوانی نمرات دانش‌آموزان
                  </h4>
                  <div className="distribution-bars">
                    <div className="dist-item">
                      <div className="dist-label-row">
                        <span>عالی و پیشرفته (۸۵ تا ۱۰۰)</span>
                        <span className="dist-count">{classAnalyticsData.gradeDistribution.excellent} نفر</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill fill-emerald"
                          style={{
                            width: `${(classAnalyticsData.gradeDistribution.excellent / (classAnalyticsData.totalStudents || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="dist-item">
                      <div className="dist-label-row">
                        <span>خوب و شایسته (۷۰ تا ۸۴)</span>
                        <span className="dist-count">{classAnalyticsData.gradeDistribution.good} نفر</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill fill-blue"
                          style={{
                            width: `${(classAnalyticsData.gradeDistribution.good / (classAnalyticsData.totalStudents || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="dist-item">
                      <div className="dist-label-row">
                        <span>متوسط و قابل قبول (۶۰ تا ۶۹)</span>
                        <span className="dist-count">{classAnalyticsData.gradeDistribution.average} نفر</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill fill-amber"
                          style={{
                            width: `${(classAnalyticsData.gradeDistribution.average / (classAnalyticsData.totalStudents || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="dist-item">
                      <div className="dist-label-row">
                        <span>نیازمند تمرین و مردود (زیر ۶۰)</span>
                        <span className="dist-count text-danger">{classAnalyticsData.gradeDistribution.weak} نفر</span>
                      </div>
                      <div className="dist-track">
                        <div
                          className="dist-fill fill-rose"
                          style={{
                            width: `${(classAnalyticsData.gradeDistribution.weak / (classAnalyticsData.totalStudents || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* نفرات برتر و رتبه‌های اول تا سوم */}
                <div className="analytics-box">
                  <h4 className="analytics-box-title">
                    <FiAward /> ۳ رتبه برتر کلاس
                  </h4>
                  <div className="top-students-list">
                    {classAnalyticsData.topStudents.map((student, index) => (
                      <div key={student.id} className={`top-student-card rank-${index + 1}`}>
                        <div className="rank-badge">رتبه {index + 1}</div>
                        <div className="top-student-info">
                          <span className="top-name">{student.name}</span>
                          <span className="top-code">کد: {student.studentCode}</span>
                        </div>
                        <div className="top-score-badge">
                          <strong>{student.total}</strong>
                          <span>از ۱۰۰</span>
                        </div>
                      </div>
                    ))}
                    {classAnalyticsData.topStudents.length === 0 && (
                      <p className="no-data-text">اطلاعاتی برای نمایش وجود ندارد.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* روند میانگین نمرات جلسات کلاس */}
              <div className="analytics-box">
                <h4 className="analytics-box-title">
                  <FiCalendar /> روند میانگین نمرات در جلسات برگزار شده (از ۲۰)
                </h4>
                <div className="sessions-trend-grid">
                  {classAnalyticsData.sessionsAvgMap.map((item) => (
                    <div key={item.session} className="session-trend-card">
                      <span className="session-label">جلسه {item.session}</span>
                      <span className="session-score">{item.avg}</span>
                      <div className="session-mini-bar-track">
                        <div 
                          className="session-mini-bar-fill" 
                          style={{ width: `${(Number(item.avg) / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* فوتر مودال */}
            <div className="modal-footer">
              <button className="btn-secondary btn" onClick={() => setAnalyticsCourse(null)}>
                بستن پنجره
              </button>
              <button className="btn-primary btn " onClick={handlePrint}>
                <FiPrinter /> چاپ گزارش آماری
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
