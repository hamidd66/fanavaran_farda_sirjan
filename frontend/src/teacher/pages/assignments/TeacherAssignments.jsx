import React, { useState, useMemo } from 'react';
import {
  FiBookOpen,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiChevronLeft,
  FiSearch,
  FiSave,
  FiX,
  FiFileText,
  FiDownload,
  FiCheck
} from 'react-icons/fi';
import '../../styles/TeacherAssignments.css';

// داده‌های اولیه نمونه
const INITIAL_COURSES = [
  {
    id: 'c1',
    title: 'برنامه‌نویسی وب فرانت‌اند (React)',
    code: 'FE-201',
    term: 'بهار ۱۴۰۳',
    sessionsCount: 12,
    students: [
      { id: 's1', name: 'علی حسینی', nationalCode: '1270011223' },
      { id: 's2', name: 'سارا احمدی', nationalCode: '1289944332' },
      { id: 's3', name: 'محمد قاسمی', nationalCode: '1294455667' }
    ]
  },
  {
    id: 'c2',
    title: 'هوش مصنوعی و یادگیری ماشین (Python)',
    code: 'AI-101',
    term: 'بهار ۱۴۰۳',
    sessionsCount: 10,
    students: [
      { id: 's4', name: 'رضا کمالی', nationalCode: '1267788990' },
      { id: 's5', name: 'مریم نوری', nationalCode: '1251122334' }
    ]
  }
];

const INITIAL_ASSIGNMENTS = {
  // ساختار کلید: `courseId_sessionId_studentId`
  'c1_1_s1': { status: 'submitted', file: 'hw1_react_basics.zip', score: 19, feedback: 'بسیار تمیز و کامپوننت‌محور.' },
  'c1_1_s2': { status: 'submitted', file: 'react_intro.pdf', score: 18, feedback: 'کد تمیز است، هوک‌ها مرور شود.' },
  'c1_1_s3': { status: 'not_submitted', file: null, score: null, feedback: '' },
  'c1_2_s1': { status: 'submitted', file: 'hw2_hooks.zip', score: 20, feedback: 'عالی، بدون نقص.' },
  'c1_2_s2': { status: 'pending', file: 'todo_app.zip', score: null, feedback: '' },
  'c1_2_s3': { status: 'submitted', file: 'components_demo.zip', score: 15, feedback: 'بهتر است از Fragment استفاده شود.' }
};

export default function TeacherAssignments() {
  const [courses] = useState(INITIAL_COURSES);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  // ناوبری و وضعیت‌ها
  const [view, setView] = useState('classes'); // 'classes' | 'sessions'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSession, setSelectedSession] = useState(1);
  const [studentModal, setStudentModal] = useState(null); // { student, course } | null

  // جستجو و فیلتر
  const [searchQuery, setSearchQuery] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  // توابع کمکی
  const getAssignment = (courseId, sessionId, studentId) => {
    const key = `${courseId}_${sessionId}_${studentId}`;
    return assignments[key] || { status: 'not_submitted', file: null, score: '', feedback: '' };
  };

  const handleUpdateAssignment = (courseId, sessionId, studentId, field, value) => {
    const key = `${courseId}_${sessionId}_${studentId}`;
    setAssignments(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { status: 'not_submitted', file: null, score: '', feedback: '' }),
        [field]: value
      }
    }));
  };

  const showSaveNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // فیلتر دوره‌ها بر اساس جستجو
  const filteredCourses = useMemo(() => {
    return courses.filter(c => 
      c.title.includes(searchQuery) || c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <div className="teacher-assignments-container" dir="rtl">
      {/* پیام ذخیره‌سازی */}
      {saveToast && (
        <div className="toast-notification">
          <FiCheck className="toast-icon" /> تغییرات با موفقیت ذخیره شدند.
        </div>
      )}

      {/* هدر صفحه */}
      <header className="page-header">
        <div className="header-info">
          <h1>مدیریت و تصحیح تکالیف</h1>
          <p>بررسی وضعیت ارسال تمرینات، ثبت نمرات و درج بازخورد برای هنرجویان</p>
        </div>
        {view === 'sessions' && (
          <button 
            className="btn-back"
            onClick={() => setView('classes')}
          >
            <FiChevronLeft /> بازگشت به لیست کلاس‌ها
          </button>
        )}
      </header>

      {/* نمای ۱: لیست کلاس‌ها */}
      {view === 'classes' && (
        <div className="classes-view">
          <div className="search-bar-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text"
              placeholder="جستجو در بین کلاس‌ها بر اساس عنوان یا کد دوره..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-card-header">
                  <span className="course-code">{course.code}</span>
                  <span className="course-term">{course.term}</span>
                </div>
                <h3 className="course-title">{course.title}</h3>
                <div className="course-stats">
                  <div className="stat-item">
                    <FiUsers />
                    <span>{course.students.length} هنرجو</span>
                  </div>
                  <div className="stat-item">
                    <FiCalendar />
                    <span>{course.sessionsCount} جلسه</span>
                  </div>
                </div>
                <div className="course-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedSession(1);
                      setView('sessions');
                    }}
                  >
                    <FiBookOpen /> نمایش جلسات و تکالیف
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => setStudentModal({ student: course.students[0], course })}
                  >
                    <FiUsers /> هنرجویان
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* نمای ۲: مدیریت تکالیف در هر جلسه */}
      {view === 'sessions' && selectedCourse && (
        <div className="sessions-view">
          <div className="session-selector-bar">
            <span className="selector-label">انتخاب جلسه:</span>
            <div className="session-chips">
              {Array.from({ length: selectedCourse.sessionsCount }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  className={`chip ${selectedSession === num ? 'active' : ''}`}
                  onClick={() => setSelectedSession(num)}
                >
                  جلسه {num}
                </button>
              ))}
            </div>
          </div>

          <div className="assignments-table-card">
            <div className="table-header-title">
              <h3>تکالیف جلسه {selectedSession} — {selectedCourse.title}</h3>
              <button className="btn-save-all" onClick={showSaveNotification}>
                <FiSave /> ذخیره تغییرات
              </button>
            </div>

            <div className="table-responsive">
              <table className="assignments-table">
  <thead>
    <tr>
      <th>#</th>
      <th>نام هنرجو</th>
      <th>کد ملی</th>
      <th>وضعیت تحویل تکلیف</th>
      <th>فایل ارسالی</th>
      <th>توضیح ارسالی</th>
      <th>نمره (از ۲۰)</th>
      <th>بازخورد استاد</th>
      <th>توضیحات استاد</th>
    </tr>
  </thead>
  <tbody>
    {selectedCourse.students.map((student, idx) => {
      const data = getAssignment(selectedCourse.id, selectedSession, student.id) || {};
      return (
        <tr key={student.id}>
          {/* ردیف */}
          <td className="text-center">{idx + 1}</td>

          {/* ۱. نام هنرجو */}
          <td className="font-bold">{student.name}</td>

          {/* ۲. کد ملی */}
          <td className="font-mono text-center">{student.nationalCode}</td>

          {/* ۳. وضعیت تحویل تکلیف (لیست باکس) */}
          <td>
            <select
              className={`status-select ${data.status || 'not_submitted'}`}
              value={data.status || 'not_submitted'}
              onChange={(e) =>
                handleUpdateAssignment(
                  selectedCourse.id,
                  selectedSession,
                  student.id,
                  'status',
                  e.target.value
                )
              }
            >
              <option value="on_time">ارسال به‌موقع</option>
              <option value="late">با تاخیر</option>
              <option value="needs_followup">نیازمند پیگیری</option>
              <option value="not_submitted">عدم ارسال</option>
            </select>
          </td>

          {/* ۴. فایل ارسالی */}
          <td>
            {data.file ? (
              <a href={`#download-${data.file}`} className="file-link" title="دانلود فایل تکلیف">
                <FiFileText /> <span>{data.file}</span> <FiDownload />
              </a>
            ) : (
              <span className="text-muted text-center block">—</span>
            )}
          </td>

          {/* ۵. توضیح ارسالی هنرجو */}
          <td>
            {data.studentComment ? (
              <span className="student-comment-text" title={data.studentComment}>
                {data.studentComment}
              </span>
            ) : (
              <span className="text-muted text-center block">—</span>
            )}
          </td>

          {/* ۶. نمره */}
          <td>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              className="score-input"
              value={data.score ?? ''}
              placeholder="-"
              onChange={(e) =>
                handleUpdateAssignment(
                  selectedCourse.id,
                  selectedSession,
                  student.id,
                  'score',
                  e.target.value
                )
              }
            />
          </td>

          {/* ۷. بازخورد استاد */}
          <td>
            <input
              type="text"
              className="feedback-input"
              value={data.feedback ?? ''}
              placeholder="بازخورد سریع (مثلاً عالی، نیاز به اصلاح)..."
              onChange={(e) =>
                handleUpdateAssignment(
                  selectedCourse.id,
                  selectedSession,
                  student.id,
                  'feedback',
                  e.target.value
                )
              }
            />
          </td>

          {/* ۸. توضیحات استاد */}
          <td>
            <input
              type="text"
              className="notes-input"
              value={data.teacherNotes ?? ''}
              placeholder="توضیحات و نکات تکمیلی..."
              onChange={(e) =>
                handleUpdateAssignment(
                  selectedCourse.id,
                  selectedSession,
                  student.id,
                  'teacherNotes',
                  e.target.value
                )
              }
            />
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

            </div>
          </div>
        </div>
      )}

      {/* نمای ۳: مودال تاریخچه و تکالیف یک هنرجو */}
{studentModal && (
  <div className="modal-overlay" onClick={() => setStudentModal(null)}>
    <div className="modal-container" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <div className="modal-title-group">
          <h3>پرونده تکالیف: {studentModal.student.name}</h3>
          <span className="modal-subtitle">
            {studentModal.course.title} — کد ملی: {studentModal.student.nationalCode}
          </span>
        </div>
        <button className="btn-close-modal" onClick={() => setStudentModal(null)}>
          <FiX />
        </button>
      </div>

      <div className="modal-body">
        <div className="student-assignments-list">
          {Array.from({ length: studentModal.course.sessionsCount }, (_, i) => i + 1).map(sessionNum => {
            const data = getAssignment(studentModal.course.id, sessionNum, studentModal.student.id) || {};
            return (
              <div key={sessionNum} className="student-session-card">
                {/* سربرگ جلسه و وضعیت تحویل */}
                <div className="session-card-head">
                  <span className="session-badge">جلسه {sessionNum}</span>
                  
                  {/* ۳. وضعیت تحویل تکلیف (لیست‌باکس) */}
                  <div className="status-container">
                    <label className="modal-field-label">وضعیت تحویل:</label>
                    <select
                      className={`status-select ${data.status || 'not_submitted'}`}
                      value={data.status || 'not_submitted'}
                      onChange={e =>
                        handleUpdateAssignment(
                          studentModal.course.id,
                          sessionNum,
                          studentModal.student.id,
                          'status',
                          e.target.value
                        )
                      }
                    >
                      <option value="on_time">ارسال به‌موقع</option>
                      <option value="late">با تاخیر</option>
                      <option value="needs_followup">نیازمند پیگیری</option>
                      <option value="not_submitted">عدم ارسال</option>
                    </select>
                  </div>
                </div>

                {/* محتوا و فیلدهای تکلیف */}
                <div className="session-card-content">
                  <div className="field-row">
                    {/* ۴. فایل ارسالی */}
                    <div className="field-group flex-1">
                      <label>فایل ضمیمه هنرجو:</label>
                      {data.file ? (
                        <a href={`#download-${data.file}`} className="file-tag" title="دانلود فایل">
                          <FiFileText /> <span>{data.file}</span> <FiDownload />
                        </a>
                      ) : (
                        <span className="text-muted">فایلی بارگذاری نشده</span>
                      )}
                    </div>

                    {/* ۵. توضیح ارسالی هنرجو */}
                    <div className="field-group flex-1">
                      <label>توضیح ارسالی هنرجو:</label>
                      <div className="student-comment-box">
                        {data.studentComment ? data.studentComment : <span className="text-muted">بدون توضیح</span>}
                      </div>
                    </div>
                  </div>

                  <div className="field-row">
                    {/* ۶. نمره */}
                    <div className="field-group field-score">
                      <label>نمره (از ۲۰):</label>
                      <input 
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={data.score ?? ''}
                        className="score-input"
                        placeholder="-"
                        onChange={e => handleUpdateAssignment(
                          studentModal.course.id,
                          sessionNum,
                          studentModal.student.id,
                          'score',
                          e.target.value
                        )}
                      />
                    </div>

                    {/* ۷. بازخورد استاد */}
                    <div className="field-group flex-1">
                      <label>بازخورد استاد:</label>
                      <input 
                        type="text"
                        value={data.feedback ?? ''}
                        className="feedback-input"
                        placeholder="نظرات سریع (مثلاً عالی، اصلاح کد...)"
                        onChange={e => handleUpdateAssignment(
                          studentModal.course.id,
                          sessionNum,
                          studentModal.student.id,
                          'feedback',
                          e.target.value
                        )}
                      />
                    </div>

                    {/* ۸. توضیحات استاد */}
                    <div className="field-group flex-1">
                      <label>توضیحات تکمیلی استاد:</label>
                      <input 
                        type="text"
                        value={data.teacherNotes ?? ''}
                        className="notes-input"
                        placeholder="نکات عیب‌یابی و توضیحات تفصیلی..."
                        onChange={e => handleUpdateAssignment(
                          studentModal.course.id,
                          sessionNum,
                          studentModal.student.id,
                          'teacherNotes',
                          e.target.value
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal-footer">
        <button 
          className="btn-primary" 
          onClick={() => {
            showSaveNotification();
            setStudentModal(null);
          }}
        >
          <FiCheck /> ثبت و تایید نهایی
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
