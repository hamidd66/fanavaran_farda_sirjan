import React, { useState, useMemo } from 'react';
import {
  FiCalendar,
  FiCheckCircle,
  FiUserMinus,
  FiClock,
  FiX,
  FiFileText,
  FiSave,
  FiSearch,
  FiFilter,
  FiUsers,
  FiCheck,
  FiAlertCircle,FiRotateCcw
} from 'react-icons/fi';
import '../../styles/TeacherAttendance.css';

// داده‌های اولیه نمونه
const INITIAL_CLASSES = [
  {
    id: 1,
    title: 'فرانت‌اند — React پیشرفته',
    courseCode: 'FE-301',
    teacher: 'علی رضایی',
    status: 'active', // در حال برگزاری
    sessionsHeld: 12,
    totalSessions: 24,
    students: [
      {
        id: 101,
        name: 'سارا احمدی',
        code: '0012345678',
        attendance: { 1: 'present', 2: 'present', 3: 'late', 4: 'present', 5: 'absent', 6: 'present', 7: 'present', 8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present' },
        lateMinutes: { 3: 15 },
        reasons: { 5: 'کسالت' }
      },
      {
        id: 102,
        name: 'محمد مرادی',
        code: '0023456789',
        attendance: { 1: 'present', 2: 'absent', 3: 'absent', 4: 'present', 5: 'present', 6: 'late', 7: 'present', 8: 'present', 9: 'absent', 10: 'present', 11: 'present', 12: 'present' },
        lateMinutes: { 6: 20 },
        reasons: { 2: 'سفر کاری', 3: 'مشکل اینترنت' }
      },
      {
        id: 103,
        name: 'زهرا کاظمی',
        code: '0034567890',
        attendance: { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present', 6: 'present', 7: 'present', 8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present' },
        lateMinutes: {},
        reasons: {}
      }
    ]
  },
  {
    id: 2,
    title: 'بک‌اند — Django و پایگاه‌داده',
    courseCode: 'PY-202',
    teacher: 'علی رضایی',
    status: 'completed', // پایان یافته
    sessionsHeld: 20,
    totalSessions: 20,
    students: [
      {
        id: 201,
        name: 'نیما پارسا',
        code: '0045678901',
        attendance: { 1: 'present', 2: 'present', 3: 'present', 4: 'late', 5: 'absent', 6: 'present', 7: 'present', 8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present', 13: 'present', 14: 'present', 15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'present', 20: 'present' },
        lateMinutes: { 4: 10 },
        reasons: { 5: 'امتحان دانشگاه' }
      },
      {
        id: 202,
        name: 'الهام صادقی',
        code: '0056789012',
        attendance: { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present', 6: 'present', 7: 'present', 8: 'present', 9: 'present', 10: 'present', 11: 'present', 12: 'present', 13: 'present', 14: 'present', 15: 'present', 16: 'present', 17: 'present', 18: 'present', 19: 'present', 20: 'present' },
        lateMinutes: {},
        reasons: {}
      }
    ]
  }
];

export default function TeacherAttendance() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // استیت‌های مودال
  const [reportModalClass, setReportModalClass] = useState(null); // مودال پایان‌یافته
  const [manageModalClass, setManageModalClass] = useState(null); // مودال در حال برگزاری
  const [selectedSession, setSelectedSession] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // نمایش پیام موقت
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // فیلتر کلاس‌ها
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || cls.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [classes, searchTerm, statusFilter]);

  // باز کردن مودال مناسب بر اساس وضعیت
  const handleOpenClassDetails = (cls) => {
    if (cls.status === 'completed') {
      setReportModalClass(cls);
    } else {
      setSelectedSession(cls.sessionsHeld > 0 ? cls.sessionsHeld : 1);
      setManageModalClass(JSON.parse(JSON.stringify(cls))); // کپی عمیق برای ویرایش محلی
    }
  };

  // تغییر وضعیت هنرجو در مودال مدیریت
  const handleStudentStatusChange = (studentId, status) => {
    if (!manageModalClass) return;
    setManageModalClass((prev) => {
      const updatedStudents = prev.students.map((st) => {
        if (st.id === studentId) {
          const newAtt = { ...(st.attendance || {}), [selectedSession]: status };
          const newLate = { ...(st.lateMinutes || {}) };
          if (status !== 'late') delete newLate[selectedSession];
          return { ...st, attendance: newAtt, lateMinutes: newLate };
        }
        return st;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  // تغییر دقایق تأخیر
  const handleLateMinutesChange = (studentId, minutes) => {
    if (!manageModalClass) return;
    setManageModalClass((prev) => {
      const updatedStudents = prev.students.map((st) => {
        if (st.id === studentId) {
          const newLate = { ...(st.lateMinutes || {}), [selectedSession]: Number(minutes) || 0 };
          return { ...st, lateMinutes: newLate };
        }
        return st;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  // تغییر علت غیبت/تأخیر
  const handleReasonChange = (studentId, reason) => {
    if (!manageModalClass) return;
    setManageModalClass((prev) => {
      const updatedStudents = prev.students.map((st) => {
        if (st.id === studentId) {
          const newReasons = { ...(st.reasons || {}), [selectedSession]: reason };
          return { ...st, reasons: newReasons };
        }
        return st;
      });
      return { ...prev, students: updatedStudents };
    });
  };

  // ذخیره و ثبت موقت
  const handleSaveDraft = () => {
    if (!manageModalClass) return;
    setClasses((prev) =>
      prev.map((c) => (c.id === manageModalClass.id ? manageModalClass : c))
    );
    showToast(`اطلاعات جلسه ${selectedSession} با موفقیت به‌صورت موقت ثبت گردید.`);
  };

  // رنگ نوار پیشرفت
  const getProgressColor = (percent) => {
    if (percent >= 75) return '#10b981';
    if (percent >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="teacher-att-wrapper">
      {/* پیام Toast */}
      {toastMessage && (
        <div className="att-toast">
          <FiCheck />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* هدر صفحه و KPIهای کلی */}
      <div className="att-header-section">
        <div>
          <h1 className="att-main-title">حضور و غیاب کلاسی اساتید</h1>
          <p className="att-main-desc">مدیریت جلسات، ثبت وضعیت و مشاهده گزارش تفکیکی دوره‌ها</p>
        </div>
      </div>

      {/* فیلترها و جستجو */}
     {/* فیلترها و جستجو */}
<div className="courses-filter-panel">
  <div className="search-box">
    <FiSearch className="search-icon" size={18} />
    <input
      type="text"
      placeholder="جستجوی نام کلاس یا کد دوره..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    {searchTerm && (
      <button
        type="button"
        className="clear-btn"
        onClick={() => setSearchTerm('')}
        title="پاک کردن جستجو"
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
        <option value="all">همه کلاس‌ها</option>
        <option value="active">در حال برگزاری</option>
        <option value="completed">پایان یافته</option>
      </select>
    </div>

    {/* دکمه بازنشانی فیلترها در صورت فعال بودن هر فیلتر */}
    {(searchTerm !== '' || statusFilter !== 'all') && (
      <button
        type="button"
        className="reset-filters-btn"
        onClick={() => {
          setSearchTerm('');
          setStatusFilter('all');
        }}
      >
        <FiRotateCcw size={15} />
        <span>بازنشانی</span>
      </button>
    )}
  </div>
</div>


      {/* جدول لیست دوره‌ها */}
      <div className="att-card-container">
        <table className="att-main-table">
          <thead>
            <tr>
              <th>عنوان دوره</th>
              <th>عنوان کلاس</th>
              <th>جلسات برگزار شده</th>
              <th>تعداد هنرجویان</th>
              <th>وضعیت دوره</th>
              <th className="th-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredClasses.map((cls) => (
              <tr key={cls.id}>
                <td>
                  <span className="course-title-text">{cls.title}</span>
                </td>
                <td><span className="code-badge">{cls.courseCode}</span></td>
                <td>
                  <span className="session-progress-text">
                    {cls.sessionsHeld} از {cls.totalSessions} جلسه
                  </span>
                </td>
                <td>{cls.students.length} نفر</td>
                <td>
                  <span className={`status-pill ${cls.status === 'active' ? 'pill-active' : 'pill-completed'}`}>
                    {cls.status === 'active' ? 'در حال برگزاری' : 'پایان یافته'}
                  </span>
                </td>
                <td className="th-center">
                  <button
                    className={`action-btn ${cls.status === 'completed' ? 'btn-report' : 'btn-manage'}`}
                    onClick={() => handleOpenClassDetails(cls)}
                  >
                    {cls.status === 'completed' ? 'مشاهده گزارش' : 'مدیریت و ثبت حضور'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* ۱. مودال گزارش جامع (مخصوص کلاس‌های پایان یافته - مطابق تصویر پیوست) */}
      {/* ========================================================================= */}
      {reportModalClass && (
        <div className="report-modal-overlay" onClick={() => setReportModalClass(null)}>
          <div className="report-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* هدر تیره */}
            <div className="report-modal-header">
              <div className="header-top-row">
                <button className="report-modal-close-btn" onClick={() => setReportModalClass(null)}>
                  <FiX size={20} />
                </button>
                <div className="header-badge">
                  <FiFileText size={16} />
                  <span>گزارش جامع ترم و جلسات</span>
                </div>
              </div>

              <div className="header-main-info">
                <h2 className="report-title">بازبینی حضور و غیاب کلاسی</h2>
                <div className="report-meta">
                  <span><strong>کلاس:</strong> {reportModalClass.title}</span>
                  <span className="meta-divider">•</span>
                  <span><strong>مدرس:</strong> {reportModalClass.teacher}</span>
                  <span className="meta-divider">•</span>
                  <span><strong>کد دوره:</strong> {reportModalClass.courseCode}</span>
                </div>
              </div>
            </div>

            {/* بدنه مودال */}
            <div className="report-modal-body">
              {/* کارت‌های آماری (KPIs) */}
              <div className="report-kpi-grid">
                <div className="report-kpi-card">
                  <div className="kpi-icon-wrapper icon-blue"><FiCalendar size={22} /></div>
                  <div className="kpi-content">
                    <span className="kpi-title">جلسات ترم</span>
                    <span className="kpi-num">
                      <strong>{reportModalClass.sessionsHeld}</strong> <small>از {reportModalClass.totalSessions}</small>
                    </span>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-icon-wrapper icon-green"><FiCheckCircle size={22} /></div>
                  <div className="kpi-content">
                    <span className="kpi-title">کل دفعات حضور</span>
                    <span className="kpi-num">
                      <strong>
                        {reportModalClass.students.reduce((acc, st) => 
                          acc + Object.values(st.attendance || {}).filter(v => v === 'present').length, 0
                        )}
                      </strong> <small>نفر/جلسه</small>
                    </span>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-icon-wrapper icon-red"><FiUserMinus size={22} /></div>
                  <div className="kpi-content">
                    <span className="kpi-title">کل غیبت‌های ترم</span>
                    <span className="kpi-num">
                      <strong>
                        {reportModalClass.students.reduce((acc, st) => 
                          acc + Object.values(st.attendance || {}).filter(v => v === 'absent').length, 0
                        )}
                      </strong> <small>مورد</small>
                    </span>
                  </div>
                </div>

                <div className="report-kpi-card">
                  <div className="kpi-icon-wrapper icon-amber"><FiClock size={22} /></div>
                  <div className="kpi-content">
                    <span className="kpi-title">کل تأخیرها</span>
                    <span className="kpi-num">
                      <strong>
                        {reportModalClass.students.reduce((acc, st) => 
                          acc + Object.values(st.attendance || {}).filter(v => v === 'late').length, 0
                        )}
                      </strong> <small>مورد</small>
                    </span>
                  </div>
                </div>
              </div>

              {/* جدول تفکیکی هنرجویان */}
              <div className="report-table-section">
                <div className="table-section-header">
                  <span className="table-title">لیست هنرجویان و آمار تجمعی ترم</span>
                  <span className="students-count">تعداد: {reportModalClass.students.length} نفر</span>
                </div>

                <div className="report-table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th className="th-name">نام هنرجو</th>
                        <th className="th-center">جلسات حاضر</th>
                        <th className="th-center">غیبت کل ترم</th>
                        <th className="th-center">تعداد تأخیر</th>
                        <th className="th-center">درصد حضور</th>
                        <th className="th-sessions">ریز جلسات برگزار شده</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportModalClass.students.map((st) => {
                        const presentCount = Object.values(st.attendance || {}).filter(v => v === 'present').length;
                        const absentCount = Object.values(st.attendance || {}).filter(v => v === 'absent').length;
                        const lateCount = Object.values(st.attendance || {}).filter(v => v === 'late').length;
                        const percent = Math.round(((presentCount + lateCount * 0.5) / (reportModalClass.sessionsHeld || 1)) * 100);

                        return (
                          <tr key={st.id}>
                            <td className="td-name">
                              <div className="student-name-group">
                                <span className="student-fullname">{st.name}</span>
                                <span className="student-id-code">کد: {st.code}</span>
                              </div>
                            </td>
                            <td className="td-center">
                              <span className="badge-pill badge-present">{presentCount} جلسه</span>
                            </td>
                            <td className="td-center">
                              <span className="badge-pill badge-absent">{absentCount} غیبت</span>
                            </td>
                            <td className="td-center">
                              <span className="badge-pill badge-late">{lateCount} بار</span>
                            </td>
                            <td className="td-center">
                              <div className="attendance-percent-box">
                                <span className="percent-text">٪{percent}</span>
                                <div className="progress-track">
                                  <div
                                    className="progress-fill"
                                    style={{ width: `${percent}%`, backgroundColor: getProgressColor(percent) }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="td-sessions">
                              <div className="session-badges-grid">
                                {Array.from({ length: reportModalClass.totalSessions }, (_, i) => i + 1).map((sNum) => {
                                  const status = st.attendance ? st.attendance[sNum] : null;
                                  let clsName = 'session-badge-empty';
                                  if (status === 'present') clsName = 'session-badge-present';
                                  if (status === 'absent') clsName = 'session-badge-absent';
                                  if (status === 'late') clsName = 'session-badge-late';

                                  return (
                                    <span key={sNum} className={`session-badge-item ${clsName}`}>
                                      {sNum}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ۲. مودال مدیریت و ثبت حضور (مخصوص کلاس‌های در حال برگزاری) */}
      {/* ========================================================================= */}
      {manageModalClass && (
        <div className="report-modal-overlay" onClick={() => setManageModalClass(null)}>
          <div className="report-modal-container manage-modal-width" onClick={(e) => e.stopPropagation()}>
            {/* هدر */}
            <div className="report-modal-header header-manage-theme">
              <div className="header-top-row">
                <button className="report-modal-close-btn" onClick={() => setManageModalClass(null)}>
                  <FiX size={20} />
                </button>
                <div className="header-badge">
                  <FiUsers size={16} />
                  <span>ثبت و ویرایش حضور و غیاب</span>
                </div>
              </div>

              <div className="header-main-info">
                <h2 className="report-title">{manageModalClass.title}</h2>
                <div className="report-meta">
                  <span><strong>کد دوره:</strong> {manageModalClass.courseCode}</span>
                  <span className="meta-divider">•</span>
                  <span><strong>تعداد کل جلسات:</strong> {manageModalClass.totalSessions} جلسه</span>
                </div>
              </div>
            </div>

            {/* بدنه */}
            <div className="report-modal-body">
              {/* نوار مدرن انتخاب جلسه */}
              <div className="session-selector-card">
                <div className="selector-title-box">
                  <h4 className="selector-title">انتخاب شماره جلسه</h4>
                  <span className="current-session-badge">
                    جلسه فعال: جلسه {selectedSession}
                  </span>
                </div>
                <div className="session-chips-container">
                  {Array.from({ length: manageModalClass.totalSessions }, (_, i) => i + 1).map((sNum) => {
                    const isSelected = selectedSession === sNum;
                    const isHeld = sNum <= manageModalClass.sessionsHeld;

                    return (
                      <button
                        key={sNum}
                        className={`session-chip-btn ${isSelected ? 'chip-active' : ''} ${isHeld ? 'chip-held' : ''}`}
                        onClick={() => setSelectedSession(sNum)}
                      >
                        جلسه {sNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* جدول ورود وضعیت هنرجویان */}
              <div className="report-table-section">
                <div className="table-section-header">
                  <span className="table-title">ثبت حضور هنرجویان در جلسه {selectedSession}</span>
                  <button className="save-draft-top-btn" onClick={handleSaveDraft}>
                    <FiSave size={16} />
                    <span>ثبت موقت جلسه {selectedSession}</span>
                  </button>
                </div>

                <div className="report-table-responsive">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>نام هنرجو</th>
                        <th>کد ملی</th>
                        <th className="th-center">وضعیت حضور</th>
                        <th className="th-center">تأخیر (دقیقه)</th>
                        <th>علت غیبت / توضیحات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manageModalClass.students.map((st) => {
                        const currentStatus = (st.attendance && st.attendance[selectedSession]) || 'present';
                        const currentLate = (st.lateMinutes && st.lateMinutes[selectedSession]) || '';
                        const currentReason = (st.reasons && st.reasons[selectedSession]) || '';

                        return (
                          <tr key={st.id}>
                            <td>
                              <span className="student-fullname">{st.name}</span>
                            </td>
                            <td>
                              <span className="student-id-code">{st.code}</span>
                            </td>
                            <td className="td-center">
                              <select
                                className={`status-select select-${currentStatus}`}
                                value={currentStatus}
                                onChange={(e) => handleStudentStatusChange(st.id, e.target.value)}
                              >
                                <option value="present">حاضر</option>
                                <option value="late">تأخیر</option>
                                <option value="absent">غایب</option>
                              </select>
                            </td>
                            <td className="td-center">
                              <input
                                type="number"
                                min="0"
                                max="180"
                                placeholder="0"
                                disabled={currentStatus !== 'late'}
                                className={`late-input ${currentStatus !== 'late' ? 'input-disabled' : ''}`}
                                value={currentLate}
                                onChange={(e) => handleLateMinutesChange(st.id, e.target.value)}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="در صورت نیاز دلیل را بنویسید..."
                                className="reason-input"
                                value={currentReason}
                                onChange={(e) => handleReasonChange(st.id, e.target.value)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* فوتر عملیاتی با دکمه ثبت موقت */}
              <div className="manage-modal-footer">
                <button className="btn-cancel" onClick={() => setManageModalClass(null)}>
                  انصراف و بستن
                </button>
                <button className="btn-save-draft" onClick={handleSaveDraft}>
                  <FiSave size={18} />
                  <span>ثبت موقت جلسه {selectedSession}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
