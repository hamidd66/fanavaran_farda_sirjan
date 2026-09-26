import React, { useState, useMemo } from 'react';
import {
  FiFilter,
  FiBookOpen,
  FiUser,
  FiUsers,
  FiAlertTriangle,
  FiTrendingDown,
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPercent,
  FiFileText,
  FiDownload,
  FiPrinter,
  FiSend,
  FiCheck
} from 'react-icons/fi';

// داده‌های اولیه نمونه تحلیلی
const initialAnalyticsData = {
  classes: [
    { id: 'c1', title: 'برنامه‌نویسی React پیشرفته', teacher: 'مهندس احمدی', semester: 'بهار ۱۴۰۳' },
    { id: 'c2', title: 'پایتون و یادگیری ماشین', teacher: 'دکتر رضایی', semester: 'بهار ۱۴۰۳' },
    { id: 'c3', title: 'طراحی وب مقدماتی (HTML/CSS)', teacher: 'استاد حسینی', semester: 'بهار ۱۴۰۳' },
  ],
  students: [
    {
      id: 's101',
      name: 'علی محمدی',
      phone: '09131112233',
      nationalCode: '1270011223',
      classId: 'c1',
      className: 'برنامه‌نویسی React پیشرفته',
      teacher: 'مهندس احمدی',
      totalSessions: 16,
      attendedSessions: 11,
      absentSessions: 5,
      lateMinutes: 45,
      attendanceRate: 68.75,
      midtermGrade: 18,
      finalGrade: 12.5,
      predictedDrop: 5.5,
      status: 'high_risk',
      riskReason: '۵ جلسه غیبت متوالی منجر به افت ۵.۵ نمره‌ای شده است'
    },
    {
      id: 's102',
      name: 'سارا رضایی',
      phone: '09132223344',
      nationalCode: '1289944331',
      classId: 'c1',
      className: 'برنامه‌نویسی React پیشرفته',
      teacher: 'مهندس احمدی',
      totalSessions: 16,
      attendedSessions: 16,
      absentSessions: 0,
      lateMinutes: 0,
      attendanceRate: 100,
      midtermGrade: 19,
      finalGrade: 19.5,
      predictedDrop: 0,
      status: 'safe',
      riskReason: 'حضور کامل و ثبات نمره عالی'
    },
    {
      id: 's103',
      name: 'محمد اکبری',
      phone: '09133334455',
      nationalCode: '1298833221',
      classId: 'c2',
      className: 'پایتون و یادگیری ماشین',
      teacher: 'دکتر رضایی',
      totalSessions: 16,
      attendedSessions: 12,
      absentSessions: 4,
      lateMinutes: 90,
      attendanceRate: 75,
      midtermGrade: 16,
      finalGrade: 13,
      predictedDrop: 3,
      status: 'warning',
      riskReason: 'تأخیرهای مکرر و ۴ غیبت در مباحث کلیدی'
    },
    {
      id: 's104',
      name: 'زهرا نادری',
      phone: '09134445566',
      nationalCode: '1275566778',
      classId: 'c2',
      className: 'پایتون و یادگیری ماشین',
      teacher: 'دکتر رضایی',
      totalSessions: 16,
      attendedSessions: 10,
      absentSessions: 6,
      lateMinutes: 30,
      attendanceRate: 62.5,
      midtermGrade: 17.5,
      finalGrade: 11,
      predictedDrop: 6.5,
      status: 'high_risk',
      riskReason: 'بیش از یک سوم غیبت، افت شدید در پروژه نهایی'
    },
    {
      id: 's105',
      name: 'حسین کاظمی',
      phone: '09135556677',
      nationalCode: '1281122334',
      classId: 'c3',
      className: 'طراحی وب مقدماتی (HTML/CSS)',
      teacher: 'استاد حسینی',
      totalSessions: 12,
      attendedSessions: 12,
      absentSessions: 0,
      lateMinutes: 10,
      attendanceRate: 100,
      midtermGrade: 18.5,
      finalGrade: 19,
      predictedDrop: 0,
      status: 'safe',
      riskReason: 'بدون افت نمره'
    }
  ]
};

export default function AdminAcademicAnalytics() {
  const [filterMode, setFilterMode] = useState('all');
  const [selectedClassId, setSelectedClassId] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [sentSmsIds, setSentSmsIds] = useState([]);
  const [actionNotice, setActionNotice] = useState(null);

  const teachersList = useMemo(() => {
    return Array.from(new Set(initialAnalyticsData.classes.map(c => c.teacher)));
  }, []);

  const filteredStudents = useMemo(() => {
    return initialAnalyticsData.students.filter(st => {
      if (filterMode === 'byClass' && selectedClassId !== 'all') {
        return st.classId === selectedClassId;
      }
      if (filterMode === 'byTeacher' && selectedTeacher !== 'all') {
        return st.teacher === selectedTeacher;
      }
      if (filterMode === 'byStudent' && selectedStudentId !== 'all') {
        return st.id === selectedStudentId;
      }
      return true;
    });
  }, [filterMode, selectedClassId, selectedTeacher, selectedStudentId]);

  // محاسبات آماری خودکار (KPIs)
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) return { avgAttendance: 0, avgFinalGrade: 0, atRiskCount: 0, highRiskCount: 0 };

    const sumAttendance = filteredStudents.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    const sumFinal = filteredStudents.reduce((acc, curr) => acc + curr.finalGrade, 0);
    const atRisk = filteredStudents.filter(s => s.status === 'high_risk' || s.status === 'warning');

    return {
      avgAttendance: (sumAttendance / total).toFixed(1),
      avgFinalGrade: (sumFinal / total).toFixed(1),
      atRiskCount: atRisk.length,
      highRiskCount: filteredStudents.filter(s => s.status === 'high_risk').length
    };
  }, [filteredStudents]);

  // لیست هنرجویان دارای افت تحصیلی
  const atRiskStudents = useMemo(() => {
    return filteredStudents.filter(s => s.predictedDrop > 0 || s.status === 'high_risk');
  }, [filteredStudents]);

  // اکشن: خروجی اکسل / CSV با پشتیبانی کامل از فارسی
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert('داده‌ای برای خروجی گرفتن وجود ندارد.');
      return;
    }

    const headers = ['نام و نام خانوادگی', 'کد ملی', 'کلاس', 'استاد', 'جلسات غایب', 'درصد حضور', 'نمره میان‌ترم', 'نمره نهایی', 'میزان افت نمره', 'وضعیت'];
    const rows = filteredStudents.map(s => [
      `"${s.name}"`,
      `"${s.nationalCode}"`,
      `"${s.className}"`,
      `"${s.teacher}"`,
      s.absentSessions,
      `"${s.attendanceRate}%"`,
      s.midtermGrade,
      s.finalGrade,
      s.predictedDrop,
      s.status === 'high_risk' ? 'افت شدید' : s.status === 'warning' ? 'هشدار' : 'عادی'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `گزارش_تحلیل_نمرات_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // اکشن: چاپ گزارش
  const handlePrint = () => {
    window.print();
  };

  // اکشن: ارسال پیامک هشدار افت به هنرجو یا ولی
  const handleSendWarningSMS = (student) => {
    if (sentSmsIds.includes(student.id)) return;
    setSentSmsIds(prev => [...prev, student.id]);
    setActionNotice(`پیامک هشدار و دعوت به جلسه مشاوره برای ${student.name} با موفقیت ارسال گردید.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // اکشن: ارسال همگانی پیامک برای تمام موارد پرریسک
  const handleSendAllRiskSMS = () => {
    const riskIds = atRiskStudents.map(s => s.id);
    setSentSmsIds(prev => Array.from(new Set([...prev, ...riskIds])));
    setActionNotice(`پیامک پیگیری آموزشی برای کلیه هنرجویان دارای افت تحصیلی (${atRiskStudents.length} نفر) ارسال شد.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="container-fluid p-4 academic-analytics-page" style={{ direction: 'rtl', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* پیام اعلان عملیات */}
      {actionNotice && (
        <div className="alert alert-success d-flex align-items-center gap-2 shadow-sm rounded-4 mb-4 border-0">
          <FiCheck size={20} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* هدر صفحه و دکمه‌های عملیاتی */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 bg-white p-3 rounded-4 shadow-sm border">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary-subtle text-primary p-3 rounded-4">
            <FiActivity size={28} />
          </div>
          <div>
            <h4 className="fw-bold mb-1 text-dark">مرکز تحلیل نمرات و پیش‌بینی افت تحصیلی</h4>
            <p className="text-muted mb-0 small">بررسی همبستگی جلسات غیبت و تأخیر با عملکرد تحصیلی هنرجویان</p>
          </div>
        </div>

        {/* دکمه‌های خروجی و عملیات مرحله ۵ */}
        <div className="d-flex gap-2 align-items-center">
          <button 
            onClick={handleExportCSV} 
            className="btn btn-outline-success d-flex align-items-center gap-2 rounded-3 px-3 shadow-none"
            title="دانلود فایل اکسل داده‌ها"
          >
            <FiDownload /> خروجی اکسل
          </button>
          <button 
            onClick={handlePrint} 
            className="btn btn-outline-dark d-flex align-items-center gap-2 rounded-3 px-3 shadow-none"
            title="پرینت گزارش تحلیلی"
          >
            <FiPrinter /> چاپ گزارش
          </button>
        </div>
      </div>

            {/* نوار فیلتر مدرن و بازطراحی‌شده */}
      <div className="card shadow-sm border-0 mb-4 rounded-4 bg-white overflow-hidden d-print-none">
        <div className="card-body p-4">
          <div className="row g-3 align-items-center justify-content-between">
            
            {/* انتخاب‌گر حالت فیلتر به صورت تب‌های قرصی مدرن (Segmented Control) */}
            <div className="col-12 col-xl-7">
              <label className="form-label small fw-bold text-muted d-flex align-items-center gap-2 mb-2">
                <FiFilter className="text-primary" /> فیلتر بر اساس:
              </label>
              
              <div className="d-flex flex-wrap gap-2 p-1 bg-light rounded-4 border">
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('all');
                    setSelectedClassId('all');
                    setSelectedTeacher('all');
                    setSelectedStudentId('all');
                  }}
                  className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 border-0 transition-all ${
                    filterMode === 'all'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover-bg-white'
                  }`}
                >
                  <FiActivity /> کل آموزشگاه
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('byClass');
                    setSelectedTeacher('all');
                    setSelectedStudentId('all');
                  }}
                  className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 border-0 transition-all ${
                    filterMode === 'byClass'
                      ? 'bg-white text-info shadow-sm'
                      : 'text-secondary hover-bg-white'
                  }`}
                >
                  <FiBookOpen /> کلاس
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('byTeacher');
                    setSelectedClassId('all');
                    setSelectedStudentId('all');
                  }}
                  className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 border-0 transition-all ${
                    filterMode === 'byTeacher'
                      ? 'bg-white text-success shadow-sm'
                      : 'text-secondary hover-bg-white'
                  }`}
                >
                  <FiUser /> استاد
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('byStudent');
                    setSelectedClassId('all');
                    setSelectedTeacher('all');
                  }}
                  className={`btn btn-sm rounded-3 px-3 py-2 fw-semibold d-flex align-items-center gap-2 border-0 transition-all ${
                    filterMode === 'byStudent'
                      ? 'bg-white text-warning shadow-sm'
                      : 'text-secondary hover-bg-white'
                  }`}
                >
                  <FiUsers /> هنرجو
                </button>
              </div>
            </div>

            {/* دراپ‌داون انتخاب زیرمجموعه (بر اساس تب فعال) */}
            <div className="col-12 col-xl-5">
              {filterMode === 'all' ? (
                <div className="d-flex align-items-center justify-content-xl-end gap-2 pt-xl-3">
                  <div className="bg-primary-subtle text-primary px-3 py-2 rounded-4 small fw-bold d-flex align-items-center gap-2">
                    <FiCheckCircle /> در حال نمایش آمار کامل تمام کلاس‌ها و دوره‌ها
                  </div>
                </div>
              ) : (
                <div>
                  <label className="form-label small fw-bold text-muted d-flex align-items-center gap-1 mb-2">
                    {filterMode === 'byClass' && <><FiBookOpen className="text-info" /> انتخاب دوره / کلاس</>}
                    {filterMode === 'byTeacher' && <><FiUser className="text-success" /> انتخاب استاد دوره</>}
                    {filterMode === 'byStudent' && <><FiUsers className="text-warning" /> جستجو و انتخاب هنرجو</>}
                  </label>

                  <div className="input-group">
                    {filterMode === 'byClass' && (
                      <select 
                        className="form-select rounded-4 py-2 px-3 border-1 shadow-none bg-light text-dark fw-medium"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                      >
                        <option value="all">همه کلاس‌ها</option>
                        {initialAnalyticsData.classes.map(c => (
                          <option key={c.id} value={c.id}>{c.title} — ({c.teacher})</option>
                        ))}
                      </select>
                    )}

                    {filterMode === 'byTeacher' && (
                      <select 
                        className="form-select rounded-4 py-2 px-3 border-1 shadow-none bg-light text-dark fw-medium"
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                      >
                        <option value="all">همه اساتید</option>
                        {teachersList.map((t, idx) => (
                          <option key={idx} value={t}>{t}</option>
                        ))}
                      </select>
                    )}

                    {filterMode === 'byStudent' && (
                      <select 
                        className="form-select rounded-4 py-2 px-3 border-1 shadow-none bg-light text-dark fw-medium"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                      >
                        <option value="all">همه هنرجویان</option>
                        {initialAnalyticsData.students.map(st => (
                          <option key={st.id} value={st.id}>{st.name} — ({st.className})</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* نوار وضعیت پایین کارت فیلتر */}
          <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 mt-3 border-top gap-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal">
                نتایج فعال: <strong className="text-primary">{filteredStudents.length}</strong> هنرجو
              </span>
              {(selectedClassId !== 'all' || selectedTeacher !== 'all' || selectedStudentId !== 'all' || filterMode !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('all');
                    setSelectedClassId('all');
                    setSelectedTeacher('all');
                    setSelectedStudentId('all');
                  }}
                  className="btn btn-link btn-sm text-decoration-none text-danger p-0 ms-2"
                >
                  ✕ حذف فیلترها
                </button>
              )}
            </div>

            <small className="text-muted">
              بروزرسانی لحظه‌ای بر اساس آخرین نمرات و جلسات
            </small>
          </div>

        </div>
      </div>


      {/* مرحله ۲: کارت‌های شاخص‌های کلیدی (KPIs) */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">میانگین نرخ حضور</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{stats.avgAttendance}%</h3>
              </div>
              <div className="bg-primary-subtle text-primary p-3 rounded-3">
                <FiPercent size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">میانگین نمره نهایی</small>
                <h3 className="fw-bold text-dark mt-1 mb-0">{stats.avgFinalGrade} <span className="fs-6 text-muted">از ۲۰</span></h3>
              </div>
              <div className="bg-success-subtle text-success p-3 rounded-3">
                <FiAward size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-danger">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">هشدار افت ناشی از غیبت</small>
                <h3 className="fw-bold text-danger mt-1 mb-0">{stats.atRiskCount} <span className="fs-6 text-muted">هنرجو</span></h3>
              </div>
              <div className="bg-danger-subtle text-danger p-3 rounded-3">
                <FiTrendingDown size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted fw-bold">موارد بحرانی (High Risk)</small>
                <h3 className="fw-bold text-warning-emphasis mt-1 mb-0">{stats.highRiskCount} <span className="fs-6 text-muted">مورد حاد</span></h3>
              </div>
              <div className="bg-warning-subtle text-warning p-3 rounded-3">
                <FiAlertTriangle size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مرحله ۳: دیده‌بان افت تحصیلی به همراه اکشن ارسال پیامک هشدار */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <h5 className="fw-bold text-danger d-flex align-items-center gap-2 m-0">
            <FiAlertCircle /> دیده‌بان هوشمند افت تحصیلی ناشی از عدم حضور
          </h5>
          {atRiskStudents.length > 0 && (
            <button 
              onClick={handleSendAllRiskSMS} 
              className="btn btn-sm btn-danger d-print-none d-flex align-items-center gap-1 rounded-3 px-3 shadow-none"
            >
              <FiSend /> ارسال پیامک هشدار به همه موارد افت
            </button>
          )}
        </div>
        <div className="card-body px-4 py-3">
          {atRiskStudents.length === 0 ? (
            <div className="text-center py-4 text-success">
              <FiCheckCircle size={36} className="mb-2" />
              <p className="fw-bold mb-0">هیچ افت نمره‌ای ناشی از غیبت در بازه انتخابی یافت نشد.</p>
            </div>
          ) : (
            <div className="row g-3">
              {atRiskStudents.map(student => {
                const isSent = sentSmsIds.includes(student.id);
                return (
                  <div key={student.id} className="col-lg-6">
                    <div className="p-3 rounded-4 border bg-light d-flex flex-column justify-content-between h-100">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong className="text-dark fs-6">{student.name}</strong>
                            <div className="text-muted small">{student.className} | استاد: {student.teacher}</div>
                          </div>
                          <span className={`badge ${student.status === 'high_risk' ? 'bg-danger' : 'bg-warning text-dark'} px-2 py-1 rounded-3`}>
                            {student.status === 'high_risk' ? 'افت شدید' : 'هشدار افت'}
                          </span>
                        </div>
                        
                        <div className="d-flex flex-wrap gap-3 my-2 text-muted small">
                          <span><FiClock className="me-1 text-danger" /> غیبت: <strong>{student.absentSessions} جلسه</strong></span>
                          <span><FiPercent className="me-1 text-primary" /> نرخ حضور: <strong>{student.attendanceRate}%</strong></span>
                          <span><FiTrendingDown className="me-1 text-danger" /> افت نمره: <strong className="text-danger">-{student.predictedDrop} نمره</strong></span>
                        </div>

                        <div className="p-2 rounded-3 bg-white border small text-secondary mt-2">
                          <strong className="text-dark">علت تحلیلی: </strong>{student.riskReason}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center d-print-none">
                        <small className="text-muted">شماره تماس: {student.phone}</small>
                        <button 
                          onClick={() => handleSendWarningSMS(student)}
                          disabled={isSent}
                          className={`btn btn-sm ${isSent ? 'btn-success' : 'btn-outline-danger'} d-flex align-items-center gap-1 rounded-3`}
                        >
                          {isSent ? <><FiCheck /> پیامک ارسال شد</> : <><FiSend /> ارسال پیامک پیگیری</>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* مرحله ۴: جدول تحلیلی جامع و مقایسه‌ای */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white border-0 pt-4 pb-2 px-4">
          <h5 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
            <FiFileText /> لیست جامع تحلیل وضعیت تحصیلی
          </h5>
        </div>
        <div className="card-body px-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">هنرجو</th>
                  <th>کلاس و استاد</th>
                  <th>وضعیت حضور</th>
                  <th>نمره میان‌ترم</th>
                  <th>نمره نهایی</th>
                  <th>تغییرات نمره</th>
                  <th>وضعیت ریسک</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{student.name}</div>
                      <small className="text-muted">{student.nationalCode}</small>
                    </td>
                    <td>
                      <div className="fw-medium text-dark">{student.className}</div>
                      <small className="text-muted">{student.teacher}</small>
                    </td>
                    <td style={{ minWidth: '180px' }}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '8px' }}>
                          <div 
                            className={`progress-bar ${student.attendanceRate >= 80 ? 'bg-success' : student.attendanceRate >= 70 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${student.attendanceRate}%` }}
                          ></div>
                        </div>
                        <small className="fw-bold">{student.attendanceRate}%</small>
                      </div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        {student.attendedSessions} از {student.totalSessions} جلسه ({student.absentSessions} غیبت)
                      </small>
                    </td>
                    <td><span className="fw-semibold">{student.midtermGrade}</span></td>
                    <td>
                      <span className={`fw-bold ${student.finalGrade < 14 ? 'text-danger' : 'text-success'}`}>
                        {student.finalGrade}
                      </span>
                    </td>
                    <td>
                      {student.predictedDrop > 0 ? (
                        <span className="badge bg-danger-subtle text-danger">
                          <FiTrendingDown className="me-1" /> {student.predictedDrop}- نمره
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success">
                          بدون افت
                        </span>
                      )}
                    </td>
                    <td>
                      {student.status === 'safe' ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">پایدار و مطمئن</span>
                      ) : student.status === 'warning' ? (
                        <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-2 rounded-pill">نیاز به توجه</span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill">ریسک بالا</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
             <div className="text-center py-5 text-muted">
               <FiFilter size={40} className="mb-3 opacity-50" />
               <p>هیچ موردی مطابق با فیلتر انتخابی یافت نشد.</p>
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
