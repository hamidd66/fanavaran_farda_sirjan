import React, { useState, useMemo,useRef  } from 'react';
import '../style/AdminGrade.css';
import html2canvas from 'html2canvas';

import { 
  FiUserPlus, 
  FiArrowLeft, 
  FiPlayCircle, 
  FiCheckCircle, 
  FiClock, 
  FiAward,
  FiCalendar,
  FiFileText,
  FiUser,
  FiUsers,
  FiPrinter,
  FiSend,
  FiCheck,
  FiSave,
  FiCode,
  FiFilter, FiUnlock, FiImage
} from 'react-icons/fi';



const stepBtnStyle = (bg, color) => ({
  width: '26px',
  height: '26px',
  borderRadius: '8px',
  border: 'none',
  background: bg,
  color,
  fontSize: '1.1rem',
  fontWeight: '800',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s, transform 0.15s',
  flexShrink: 0
});

// ۱. لیست داده‌های اولیه کلاس‌های آموزشگاه فناوران فردا
const initialClassesData = [
  {
    id: 1,
    code: 'FE-201',
    name: 'توسعه فرانت‌اند با React و جاوااسکریپت',
    course: 'طراحی وب و فرانت‌اند',
    teacher: 'حمید پورفریدونی',
    capacity: '۸ از ۱۰ هنرجو',
    sessionsCount: '۲۴ جلسه',
    totalSessions: 24,
    termInfo: 'ترم تابستان | ۲۴ جلسه',
    status: 'ongoing',
    statusText: 'در حال برگزاری',
  },
  {
    id: 2,
    code: 'AI-101',
    name: 'هوش مصنوعی و یادگیری ماشین با پایتون',
    course: 'هوش مصنوعی و علوم داده',
    teacher: 'رضا نوری',
    capacity: '۱۲ از ۱۲ هنرجو',
    sessionsCount: '۳۰ جلسه',
    totalSessions: 30,
    termInfo: 'ترم بهار | ۳۰ جلسه',
    status: 'completed',
    statusText: 'پایان‌یافته',
  },
  {
    id: 3,
    code: 'PY-102',
    name: 'برنامه‌نویسی پایتون مقدماتی تا پیشرفته',
    course: 'برنامه‌نویسی پایتون',
    teacher: 'مریم احمدی',
    capacity: '۶ از ۱۰ هنرجو',
    sessionsCount: '۱۶ جلسه',
    totalSessions: 16,
    termInfo: 'ترم تابستان | ۱۶ جلسه',
    status: 'ongoing',
    statusText: 'در حال برگزاری',
  },
  {
    id: 4,
    code: 'NET-301',
    name: 'توسعه وب بک‌اند با ASP.NET Core & C#',
    course: 'برنامه‌نویسی C# و دات‌نت',
    teacher: 'حسین مرادی',
    capacity: '۰ از ۸ هنرجو',
    sessionsCount: '۲۰ جلسه',
    totalSessions: 20,
    termInfo: 'ترم پاییز | ۲۰ جلسه',
    status: 'not_started',
    statusText: 'در حال ثبت‌نام',
  }
];

// ۲. لیست هنرجویان کلاس انتخابی برای ورود نمرات
const initialStudents = [
  { id: 101, nationalCode: '3060123456', name: 'مهدی احمدی', sessionScore: '۱۸', midtermScore: '۲۸', finalScore: '۶۵', note: 'فعالیت کلاسی عالی' },
  { id: 102, nationalCode: '3060234567', name: 'سارا رضایی', sessionScore: '۲۰', midtermScore: '۳۰', finalScore: '۷۰', note: 'پروژه تمیز و کامل' },
  { id: 103, nationalCode: '3060345678', name: 'علی محمدی', sessionScore: '۱۷', midtermScore: '۲۵', finalScore: '۶۰', note: 'تمرینات منظم' },
  { id: 104, nationalCode: '3060456789', name: 'نرگس کریمی', sessionScore: '۱۹', midtermScore: '۲۹', finalScore: '۶۸', note: 'تسلط خوب بر مباحث' },
  { id: 105, nationalCode: '3060567890', name: 'حسین رضایی', sessionScore: '۲۰', midtermScore: '۳۰', finalScore: '۶۹', note: 'عالی در آزمون عملی' },
  { id: 106, nationalCode: '3060678901', name: 'فاطمه حسینی', sessionScore: '۱۶', midtermScore: '۲۴', finalScore: '۵۸', note: 'نیاز به تمرین پروژه' },
  { id: 107, nationalCode: '3060789012', name: 'امیرعلی نادری', sessionScore: '۱۹', midtermScore: '۲۸', finalScore: '۶۶', note: 'کدنویسی استاندارد' },
  { id: 108, nationalCode: '3060890123', name: 'رضا اسماعیلی', sessionScore: '۲۰', midtermScore: '۲۹', finalScore: '۶۷', note: 'پاسخگویی سریع در کلاس' },
];

export default function AdminGrades() {










  // ۱. استیت‌های کنترل باز شدن مودال‌ها
const [analyticsClass, setAnalyticsClass] = useState(null);
const [reportCardClass, setReportCardClass] = useState(null);
const [isExporting, setIsExporting] = useState(false);

// ۲. رفرنس برای گرفتن عکس از کارنامه
const reportCardPrintRef = useRef(null);

// ۳. تابع دانلود خروجی تصویر کارنامه
const handleExportReportCardImage = async () => {
  if (!reportCardPrintRef.current) return;
  try {
    setIsExporting(true);
    const canvas = await html2canvas(reportCardPrintRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    const link = document.createElement('a');
    link.download = `کارنامه_جامع_${reportCardClass.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('خطا در دانلود عکس:', error);
    alert('خطا در ایجاد تصویر کارنامه');
  } finally {
    setIsExporting(false);
  }
};

// ۴. داده‌های آماری مقایسه‌ای برای مودال سطح علمی
const getAcademicAnalytics = (cls) => {
  return {
    classAvg: cls.averageScore || 17.8,
    specialtyAvg: 16.2,
    highestHistoricalAvg: 18.9,
    passRate: 94,
    specialtyPassRate: 86,
    topStudentThisClass: { name: 'امیرحسین رضایی', score: '۱۹.۷۵', project: 'پروژه پایانی تحت وب' },
    allTimeTopStudent: { name: 'سارا احمدی', score: '۲۰.۰۰', term: 'بهار ۱۴۰۳', course: cls.course },
    skillsMastery: [
      { skill: 'مفاهیم پایه و معماری', classScore: 92, avgScore: 80 },
      { skill: 'حل مسئله و الگوریتم', classScore: 85, avgScore: 72 },
      { skill: 'پروژه عملی و کدنویسی', classScore: 95, avgScore: 84 },
      { skill: 'نظم و مشارکت کلاسی', classScore: 88, avgScore: 78 }
    ],
    historicalClassesComparison: [
      { term: 'پاییز ۱۴۰۲', avg: 15.6 },
      { term: 'زمستان ۱۴۰۲', avg: 16.4 },
      { term: 'بهار ۱۴۰۳', avg: 17.1 },
      { term: 'تابستان ۱۴۰۳ (کلاس فعلی)', avg: cls.averageScore || 17.8, current: true }
    ]
  };
};

// ۵. لیست نمرات جامع نمونه برای کارنامه
const getFullGradeList = (cls) => {
  return [
    { id: 1, name: 'علی محمدی', nationalCode: '3050123456', s1: 20, s2: 19, s3: 18, s4: 20, s5: 19, midterm: 28.5, final: 67, total: 19.3, passed: true },
    { id: 2, name: 'زهرا کاظمی', nationalCode: '3049876543', s1: 18, s2: 17, s3: 19, s4: 18, s5: 20, midterm: 27, final: 63, total: 18.1, passed: true },
    { id: 3, name: 'امیرحسین رضایی', nationalCode: '3051122334', s1: 20, s2: 20, s3: 20, s4: 20, s5: 20, midterm: 30, final: 70, total: 20, passed: true },
    { id: 4, name: 'نیلوفر حسینی', nationalCode: '3054455667', s1: 15, s2: 16, s3: 14, s4: 17, s5: 16, midterm: 22, final: 52, total: 15.2, passed: true },
    { id: 5, name: 'مهدی صادقی', nationalCode: '3057788990', s1: 12, s2: 10, s3: 14, s4: 11, s5: 13, midterm: 14, final: 34, total: 10.5, passed: false }
  ];
};


// درون تابع کامپوننت:
const [isFinalized, setIsFinalized] = useState(false);
const gradesTableRef = useRef(null); // این ref را به کانتینر جدول وصل کنید

// ۱. تابع خروجی عکس از جدول
const handleExportImage = async () => {
  if (!gradesTableRef.current) return;
  try {
    const canvas = await html2canvas(gradesTableRef.current, {
      scale: 2, // کیفیت بالا
      backgroundColor: '#ffffff',
      useCORS: true
    });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `لیست-نمرات-${new Date().toLocaleDateString('fa-IR')}.png`;
    link.click();
  } catch (error) {
    console.error('خطا در گرفتن عکس از جدول:', error);
    alert('خطایی در تولید تصویر رخ داد.');
  }
};

// ۲. تابع ذخیره موقت
const handleTempSave = () => {
  // نمایش پیام ثبت موقت
  alert('نمرات کلاس به‌طور موقت در سیستم ثبت شد.');
};

// ۳. تابع نهایی‌سازی و فعال‌سازی مجدد
const handleToggleFinalize = () => {
  if (!isFinalized) {
    setIsFinalized(true);
    alert('نمرات کلاس نهایی و قفل شد.');
  } else {
    setIsFinalized(false);
    alert('کلاس مجدداً فعال شد؛ اکنون می‌توانید نمرات را ویرایش کنید.');
  }
};





  const [classesList] = useState(initialClassesData);
  const [selectedClass, setSelectedClass] = useState(null);

  // تب فعال در صفحه جزئیات ('sessions' | 'terms')
  const [activeTab, setActiveTab] = useState('sessions');

  // فیلتر تب جلسات
  const [selectedSessionNumber, setSelectedSessionNumber] = useState('1');
  const [sessionDate, setSessionDate] = useState('۱۴۰۴/۰۵/۱۵');

  // فیلتر تب میان‌ترم/پایان‌ترم
  const [examType, setExamType] = useState('midterm');

  // استیت نمرات هنرجویان
  const [studentsData, setStudentsData] = useState(initialStudents);

  // فیلترهای لیست اصلی کلاس‌ها
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // فیلتر کردن کلاس‌ها
  const filteredClasses = useMemo(() => {
    return classesList.filter((item) => {
      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchCourse = !courseFilter || item.course.includes(courseFilter) || item.name.includes(courseFilter);
      const matchTeacher = !teacherFilter || item.teacher.includes(teacherFilter);
      const matchSearch = !studentSearch || 
        item.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        item.teacher.toLowerCase().includes(studentSearch.toLowerCase()) ||
        item.course.toLowerCase().includes(studentSearch.toLowerCase());

      return matchStatus && matchCourse && matchTeacher && matchSearch;
    });
  }, [classesList, statusFilter, courseFilter, teacherFilter, studentSearch]);

  const handleResetFilters = () => {
    setStatusFilter('');
    setCourseFilter('');
    setTeacherFilter('');
    setStudentSearch('');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ongoing':
        return 'admin-status-pill badge-success';
      case 'completed':
        return 'admin-status-pill badge-info';
      case 'not_started':
        return 'admin-status-pill badge-warning';
      default:
        return 'admin-status-pill';
    }
  };

  // تغییر نمره جلسه هنرجو
  const handleSessionScoreChange = (studentId, val) => {
    setStudentsData(prev => 
      prev.map(s => s.id === studentId ? { ...s, sessionScore: val } : s)
    );
  };






  // تغییر نمره میان‌ترم یا پایان‌ترم
  const handleExamScoreChange = (studentId, field, val) => {
    setStudentsData(prev => 
      prev.map(s => s.id === studentId ? { ...s, [field]: val } : s)
    );
  };









  // -------------------------------------------------------------
  // ۱. صفحه جزئیات کلاس و ثبت نمرات (با جداول و کنترل‌های ریسپانسیو)
  // -------------------------------------------------------------
  if (selectedClass) {
    const totalSessions = selectedClass.totalSessions || 24;

    return (
      <div className="admin-page-container" style={{ direction: 'rtl', padding: '16px' }}>
        
        {/* هدر صفحه جزئیات */}
        <header className="admin-page-header d-flex justify-content-between align-items-center flex-wrap gap-3 w-100 mb-4">
          <div className="d-flex align-items-center gap-3 text-end">
            <div className="admin-page-header-icon d-flex align-items-center justify-content-center" style={{ flexShrink: 0 }}>
              <FiUserPlus size={26} />
            </div>
            <div className="admin-page-header-info d-flex flex-column text-end">
              <h1 className="admin-page-title m-0">مدیریت نمرات</h1>
              <p className="admin-page-subtitle m-0 mt-1">
                ثبت، بررسی و نهایی‌سازی نمرات کلاس و هنرجویان
              </p>
            </div>
          </div>

          <div className="admin-page-header-actions d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={() => setSelectedClass(null)}
              style={{ borderRadius: '10px', padding: '8px 16px', fontWeight: '600' }}
            >
              <FiArrowLeft size={18} />
              <span>بازگشت به صفحه نمرات</span>
            </button>
          </div>
        </header>

              {/* کارت جامع اطلاعات کلاس */}
        <div 
          className="admin-class-info-card mb-4"
          style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '22px 24px',
            border: '1px solid #edf2f7',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* ردیف اول: عنوان، کد کلاس، دسته‌بندی و وضعیت */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.22)',
                  flexShrink: 0
                }}
              >
                <FiCode size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    {selectedClass.name}
                  </h2>
                  <span style={{ 
                    background: selectedClass.status === 'ongoing' ? '#e6f7ed' : '#e0edff', 
                    color: selectedClass.status === 'ongoing' ? '#15803d' : '#1d68f0', 
                    fontSize: '0.78rem', 
                    fontWeight: '700', 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedClass.status === 'ongoing' ? '#16a34a' : '#2563eb' }} />
                    {selectedClass.statusText}
                  </span>
                </div>

                {/* مسیر دسته‌بندی و دوره */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.84rem', color: '#64748b', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span>
                    دسته‌بندی: <strong style={{ color: '#334155' }}>{selectedClass.category || 'برنامه‌نویسی و وب'}</strong>
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span>
                    دوره اصلی: <strong style={{ color: '#334155' }}>{selectedClass.course}</strong>
                  </span>
                  <span style={{ color: '#cbd5e1' }}>•</span>
                  <span>
                    کد کلاس: <strong style={{ color: '#1d68f0' }}>{selectedClass.code}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ردیف دوم: چیپ‌های اطلاعات جزئی و آماری کلاس */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              flexWrap: 'wrap',
              paddingTop: '14px',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            {/* شماره کلاس از کل دوره */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiAward style={{ color: '#f59e0b' }} size={15} />
              <span>کلاس: <strong>دوره سوم از ۸ دوره این تخصص</strong></span>
            </div>

            {/* استاد */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiUser style={{ color: '#3b82f6' }} size={15} />
              <span>استاد: <strong>{selectedClass.teacher}</strong></span>
            </div>

            {/* تاریخ شروع */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiCalendar style={{ color: '#10b981' }} size={15} />
              <span>تاریخ شروع: <strong>{selectedClass.startDate || '۱۴۰۴/۰۴/۱۵'}</strong></span>
            </div>

            {/* جلسات برگزار شده از کل */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiCheckCircle style={{ color: '#059669' }} size={15} />
              <span>جلسات: <strong>{selectedClass.heldSessions || '۱۲'} از {selectedClass.totalSessions || '۲۴'} جلسه</strong></span>
            </div>

            {/* کل غیبت‌های کلاس */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiClock style={{ color: '#ef4444' }} size={15} />
              <span>مجموع غیبت‌ها: <strong style={{ color: '#dc2626' }}>{selectedClass.totalAbsences || '۴ مورد'}</strong></span>
            </div>

            {/* ظرفیت کلاس */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontSize: '0.82rem', fontWeight: '600', background: '#f8fafc', padding: '7px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <FiUsers style={{ color: '#6366f1' }} size={15} />
              <span>ظرفیت: <strong>{selectedClass.capacity}</strong></span>
            </div>
          </div>
        </div>


        {/* تب‌ها */}
        <div 
          className="admin-grades-tabs mb-4"
          style={{
            display: 'flex',
            borderBottom: '2px solid #e2e8f0',
            gap: '20px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 14px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'sessions' ? '800' : '600',
              color: activeTab === 'sessions' ? '#1d68f0' : '#64748b',
              borderBottom: activeTab === 'sessions' ? '3px solid #1d68f0' : '3px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <FiCalendar size={18} />
            <span>نمرات جلسات و کلاسی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 14px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'terms' ? '800' : '600',
              color: activeTab === 'terms' ? '#1d68f0' : '#64748b',
              borderBottom: activeTab === 'terms' ? '3px solid #1d68f0' : '3px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <FiFileText size={18} />
            <span>میان‌ترم و پایان‌ترم</span>
          </button>
        </div>

           {/* محتوای تب ۱: نمرات جلسات */}
        {activeTab === 'sessions' && (
          <div>
            {/* فیلتر انتخاب جلسه */}
            <div 
              style={{ 
                background: '#ffffff', 
                borderRadius: '14px', 
                padding: '14px 18px', 
                marginBottom: '16px', 
                border: '1px solid #edf2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#1e293b' }}>
                  <FiFilter size={18} style={{ color: '#1d68f0' }} />
                  <span>انتخاب شماره جلسه:</span>
                </div>

                <select 
                  className="form-select"
                  disabled={isFinalized}
                  value={selectedSessionNumber}
                  onChange={(e) => setSelectedSessionNumber(e.target.value)}
                  style={{
                    width: '140px',
                    padding: '7px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontWeight: '700',
                    color: isFinalized ? '#94a3b8' : '#0f172a',
                    outline: 'none',
                    background: isFinalized ? '#f1f5f9' : '#f8fafc',
                    cursor: isFinalized ? 'not-allowed' : 'pointer'
                  }}
                >
                  {Array.from({ length: totalSessions }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      جلسه {num}
                    </option>
                  ))}
                </select>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>تاریخ برگزاری:</span>
                  <input
                    type="text"
                    disabled={isFinalized}
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    style={{
                      width: '120px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      textAlign: 'center',
                      background: isFinalized ? '#f1f5f9' : '#fff',
                      color: isFinalized ? '#94a3b8' : '#1e293b',
                      cursor: isFinalized ? 'not-allowed' : 'text'
                    }}
                    placeholder="۱۴۰۴/۰۵/۱۵"
                  />
                </div>
              </div>

              <div 
                style={{ 
                  fontSize: '0.82rem', 
                  color: isFinalized ? '#b45309' : '#059669', 
                  background: isFinalized ? '#fef3c7' : '#ecfdf5', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontWeight: '700' 
                }}
              >
                {isFinalized 
                  ? `🔒 نمرات جلسه ${selectedSessionNumber} نهایی و قفل شده است`
                  : `در حال ثبت نمرات برای: جلسه ${selectedSessionNumber}`
                }
              </div>
            </div>

            {/* کانتینر اسکرول ریسپانسیو جدول جلسات */}
            <div
              ref={gradesTableRef}
              className="admin-table-container"
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)',
                overflowX: 'auto'
              }}
            >
              <table
                className="admin-table"
                style={{ width: '100%', minWidth: '780px', borderCollapse: 'separate', borderSpacing: '0' }}
              >
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
                    <th style={{ width: '52px', textAlign: 'center', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>#</th>
                    <th style={{ textAlign: 'right', minWidth: '180px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>نام و نام خانوادگی هنرجو</th>
                    <th style={{ textAlign: 'center', width: '110px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>کد ملی</th>
                    <th style={{ textAlign: 'center', width: '180px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>ثبت نمره کلاسی (از ۲۰)</th>
                    <th style={{ textAlign: 'right', minWidth: '200px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>توضیحات و فعالیت کلاسی</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student, idx) => {
                    const score = parseFloat(student.sessionScore) || 0;
                    
                    return (
                      <tr
                        key={student.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc')}
                      >
                        {/* شماره ردیف */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontSize: '0.72rem',
                              fontWeight: '800'
                            }}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        {/* نام هنرجو با آواتار */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: '800',
                                flexShrink: 0
                              }}
                            >
                              {student.name?.slice(0, 1) || '؟'}
                            </span>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                              {student.name}
                            </span>
                          </div>
                        </td>

                        {/* کد ملی */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <span style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                            {student.nationalCode}
                          </span>
                        </td>

                        {/* اینپوت نمره کلاسی */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              disabled={isFinalized}
                              onClick={() => handleSessionScoreChange(student.id, Math.max(0, score - 1))}
                              style={{
                                ...stepBtnStyle('#fecaca', '#b91c1c'),
                                opacity: isFinalized ? 0.35 : 1,
                                cursor: isFinalized ? 'not-allowed' : 'pointer'
                              }}
                            >
                              −
                            </button>
                            <input
                              type="text"
                              disabled={isFinalized}
                              value={student.sessionScore}
                              onChange={(e) => handleSessionScoreChange(student.id, e.target.value)}
                              style={{
                                width: '60px',
                                textAlign: 'center',
                                padding: '7px 4px',
                                borderRadius: '10px',
                                border: '2px solid #e2e8f0',
                                fontWeight: '800',
                                fontSize: '0.95rem',
                                color: isFinalized ? '#94a3b8' : '#1d68f0',
                                outline: 'none',
                                background: isFinalized ? '#f1f5f9' : '#eff6ff',
                                cursor: isFinalized ? 'not-allowed' : 'text'
                              }}
                            />
                            <button
                              type="button"
                              disabled={isFinalized}
                              onClick={() => handleSessionScoreChange(student.id, Math.min(20, score + 1))}
                              style={{
                                ...stepBtnStyle('#bbf7d0', '#15803d'),
                                opacity: isFinalized ? 0.35 : 1,
                                cursor: isFinalized ? 'not-allowed' : 'pointer'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* توضیحات */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="text"
                              disabled={isFinalized}
                              defaultValue={student.note}
                              placeholder={isFinalized ? 'ثبت نهایی شده' : 'نکته یا فعالیت...'}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '0.85rem',
                                color: isFinalized ? '#94a3b8' : '#475569',
                                background: isFinalized ? '#f8fafc' : '#fff',
                                outline: 'none',
                                cursor: isFinalized ? 'not-allowed' : 'text'
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* محتوای تب ۲: میان‌ترم و پایان‌ترم */}
        {activeTab === 'terms' && (
          <div>
            {/* فیلتر نوع آزمون */}
            <div 
              style={{ 
                background: '#ffffff', 
                borderRadius: '14px', 
                padding: '14px 18px', 
                marginBottom: '16px', 
                border: '1px solid #edf2f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', color: '#1e293b' }}>
                  <FiFilter size={18} style={{ color: '#1d68f0' }} />
                  <span>انتخاب مرحله ارزیابی:</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setExamType('midterm')}
                    style={{
                      border: 'none',
                      background: examType === 'midterm' ? '#1d68f0' : 'transparent',
                      color: examType === 'midterm' ? '#fff' : '#475569',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    آزمون میان‌ترم (۳۰ نمره)
                  </button>

                  <button
                    type="button"
                    onClick={() => setExamType('final')}
                    style={{
                      border: 'none',
                      background: examType === 'final' ? '#1d68f0' : 'transparent',
                      color: examType === 'final' ? '#fff' : '#475569',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    آزمون جامع پایان‌ترم (۷۰ نمره)
                  </button>
                </div>
              </div>

              <div 
                style={{ 
                  fontSize: '0.82rem', 
                  color: isFinalized ? '#b45309' : '#0369a1', 
                  background: isFinalized ? '#fef3c7' : '#e0f2fe', 
                  padding: '6px 12px', 
                  borderRadius: '8px', 
                  fontWeight: '700' 
                }}
              >
                {isFinalized 
                  ? '🔒 نمرات آزمون نهایی و قفل شده است' 
                  : (examType === 'midterm' ? 'حداکثر نمره میان‌ترم: ۳۰ امتیاز' : 'حداکثر نمره پایان‌ترم: ۷۰ امتیاز')
                }
              </div>
            </div>

            {/* جدول ریسپانسیو ارزیابی آزمون */}
            <div
              ref={gradesTableRef}
              className="admin-table-container"
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '18px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)',
                overflowX: 'auto'
              }}
            >
              <table
                className="admin-table"
                style={{ width: '100%', minWidth: '780px', borderCollapse: 'separate', borderSpacing: '0' }}
              >
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}>
                    <th style={{ width: '52px', textAlign: 'center', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>#</th>
                    <th style={{ textAlign: 'right', minWidth: '160px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>نام و نام خانوادگی هنرجو</th>
                    <th style={{ textAlign: 'center', width: '110px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>کد ملی</th>
                    <th style={{ textAlign: 'center', width: '170px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>
                      {examType === 'midterm' ? 'نمره میان‌ترم (از ۳۰)' : 'نمره پایان‌ترم (از ۷۰)'}
                    </th>
                    <th style={{ textAlign: 'center', width: '150px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>وضعیت قبولی</th>
                    <th style={{ textAlign: 'right', minWidth: '200px', padding: '12px 8px', fontSize: '0.8rem', color: '#475569' }}>توضیحات و بازخورد</th>
                  </tr>
                </thead>

                <tbody>
                  {studentsData.map((student, idx) => {
                    const currentScore = examType === 'midterm' ? student.midtermScore : student.finalScore;
                    const maxScore = examType === 'midterm' ? 30 : 70;
                    const numericScore = parseFloat(currentScore) || 0;
                    const isPassed = numericScore >= maxScore * 0.5;
                    const percent = Math.min(100, Math.round((numericScore / maxScore) * 100));

                    // رنگ‌بندی هوشمند نمره
                    let scoreColor = '#f59e0b';
                    if (isPassed) scoreColor = '#15803d';
                    else if (numericScore > 0) scoreColor = '#dc2626';

                    return (
                      <tr
                        key={student.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease',
                          background: idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc')
                        }
                      >
                        {/* شماره ردیف */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isPassed ? '#e0f2fe' : '#fef3c7',
                              color: isPassed ? '#0369a1' : '#b45309',
                              fontSize: '0.72rem',
                              fontWeight: '800'
                            }}
                          >
                            {idx + 1}
                          </span>
                        </td>

                        {/* نام هنرجو با آواتار */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '34px',
                                height: '34px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: '800',
                                flexShrink: 0,
                                boxShadow: '0 3px 8px rgba(59, 130, 246, 0.25)'
                              }}
                            >
                              {student.name?.slice(0, 1) || '؟'}
                            </span>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                              {student.name}
                            </span>
                          </div>
                        </td>

                        {/* کد ملی */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <span style={{ color: '#64748b', fontSize: '0.82rem', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                            {student.nationalCode}
                          </span>
                        </td>

                        {/* اینپوت نمره + دکمه‌های + و − */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <button
                              type="button"
                              disabled={isFinalized}
                              onClick={() =>
                                handleExamScoreChange(
                                  student.id,
                                  examType === 'midterm' ? 'midtermScore' : 'finalScore',
                                  Math.max(0, numericScore - 1)
                                )
                              }
                              style={{
                                ...stepBtnStyle('#fecaca', '#b91c1c'),
                                opacity: isFinalized ? 0.35 : 1,
                                cursor: isFinalized ? 'not-allowed' : 'pointer'
                              }}
                              title="یک نمره کم کن"
                            >
                              −
                            </button>

                            <input
                              type="text"
                              disabled={isFinalized}
                              inputMode="numeric"
                              value={currentScore}
                              onChange={(e) =>
                                handleExamScoreChange(
                                  student.id,
                                  examType === 'midterm' ? 'midtermScore' : 'finalScore',
                                  e.target.value
                                )
                              }
                              style={{
                                width: '60px',
                                textAlign: 'center',
                                padding: '7px 4px',
                                borderRadius: '10px',
                                border: isFinalized ? '2px solid #cbd5e1' : `2px solid ${scoreColor}33`,
                                background: isFinalized ? '#f1f5f9' : `${scoreColor}0d`,
                                fontWeight: '800',
                                fontSize: '0.95rem',
                                color: isFinalized ? '#94a3b8' : scoreColor,
                                outline: 'none',
                                cursor: isFinalized ? 'not-allowed' : 'text',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                              }}
                              onFocus={(e) => !isFinalized && (e.target.style.borderColor = scoreColor)}
                              onBlur={(e) => !isFinalized && (e.target.style.borderColor = `${scoreColor}33`)}
                            />

                            <button
                              type="button"
                              disabled={isFinalized}
                              onClick={() =>
                                handleExamScoreChange(
                                  student.id,
                                  examType === 'midterm' ? 'midtermScore' : 'finalScore',
                                  Math.min(maxScore, numericScore + 1)
                                )
                              }
                              style={{
                                ...stepBtnStyle('#bbf7d0', '#15803d'),
                                opacity: isFinalized ? 0.35 : 1,
                                cursor: isFinalized ? 'not-allowed' : 'pointer'
                              }}
                              title="یک نمره اضافه کن"
                            >
                              +
                            </button>
                          </div>

                          {/* درصد پیشرفت کوچک */}
                          <div
                            style={{
                              marginTop: '6px',
                              height: '4px',
                              width: '84px',
                              background: '#e2e8f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              marginLeft: 'auto',
                              marginRight: 'auto'
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${percent}%`,
                                background: isFinalized ? '#94a3b8' : isPassed ? '#22c55e' : percent > 0 ? '#f59e0b' : '#e2e8f0',
                                borderRadius: '4px',
                                transition: 'width 0.25s ease'
                              }}
                            />
                          </div>
                        </td>

                        {/* وضعیت قبولی */}
                        <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 12px',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              background: isPassed ? '#dcfce7' : '#fee2e2',
                              color: isPassed ? '#15803d' : '#b91c1c',
                              border: `1px solid ${isPassed ? '#bbf7d0' : '#fecaca'}`
                            }}
                          >
                            <span style={{ fontSize: '0.85rem' }}>{isPassed ? '✅' : '⚠️'}</span>
                            {isPassed ? 'مجاز / قبولی' : 'نیاز به جبران'}
                          </span>
                        </td>

                        {/* بازخورد */}
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <span style={{ position: 'absolute', right: '10px', zIndex: 1, fontSize: '0.95rem' }}>📝</span>
                            <input
                              type="text"
                              disabled={isFinalized}
                              defaultValue={student.note}
                              placeholder={isFinalized ? 'ثبت نهایی شده' : 'ارزیابی پروژه یا آزمون...'}
                              style={{
                                width: '100%',
                                padding: '8px 38px 8px 10px',
                                borderRadius: '10px',
                                border: '1.5px solid #e2e8f0',
                                fontSize: '0.85rem',
                                color: isFinalized ? '#94a3b8' : '#475569',
                                outline: 'none',
                                background: isFinalized ? '#f8fafc' : '#fafafa',
                                cursor: isFinalized ? 'not-allowed' : 'text',
                                transition: 'border-color 0.2s, box-shadow 0.2s'
                              }}
                              onFocus={(e) => {
                                if (!isFinalized) {
                                  e.target.style.borderColor = '#3b82f6';
                                  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)';
                                }
                              }}
                              onBlur={(e) => {
                                if (!isFinalized) {
                                  e.target.style.borderColor = '#e2e8f0';
                                  e.target.style.boxShadow = 'none';
                                }
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* دکمه‌های عملیاتی پایین جدول */}
        {/* دکمه‌های عملیاتی پایین جدول */}
<div 
  className="admin-bottom-actions mt-4" 
  style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    background: '#ffffff',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid #edf2f7',
    boxShadow: '0 4px 18px rgba(0,0,0,0.02)'
  }}
>
  {/* بخش راست: خروجی تصویر لیست نمرات */}
  <div>
    <button
      type="button"
      onClick={handleExportImage}
      className="btn btn-outline-secondary"
      style={{
        borderRadius: '10px',
        padding: '8px 16px',
        fontSize: '0.88rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#f8fafc',
        border: '1px solid #cbd5e1',
        color: '#334155',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      <FiImage size={18} color="#0284c7" />
      <span>خروجی عکس از لیست نمرات</span>
    </button>
  </div>

  {/* بخش چپ: دکمه‌های وضعیت و ذخیره */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
    {/* دکمه نهایی کردن یا فعال‌سازی مجدد کلاس */}
    <button
      type="button"
      onClick={handleToggleFinalize}
      style={{
        background: isFinalized 
          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
          : 'linear-gradient(135deg, #1d68f0 0%, #1d4ed8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '9px 20px',
        fontSize: '0.88rem',
        fontWeight: '700',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        boxShadow: isFinalized 
          ? '0 4px 12px rgba(217, 119, 6, 0.25)' 
          : '0 4px 12px rgba(29, 104, 240, 0.25)',
        transition: 'all 0.2s ease'
      }}
    >
      {isFinalized ? (
        <>
          <FiUnlock size={18} />
          <span>فعال کردن مجدد کلاس</span>
        </>
      ) : (
        <>
          <FiCheck size={18} />
          <span>نهایی کردن و ثبت نمرات</span>
        </>
      )}
    </button>

    {/* دکمه ذخیره موقت */}
    <button
      type="button"
      onClick={handleTempSave}
      disabled={isFinalized}
      style={{
        background: isFinalized ? '#e2e8f0' : '#64748b',
        color: isFinalized ? '#94a3b8' : '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '9px 18px',
        fontSize: '0.88rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        cursor: isFinalized ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <FiSave size={16} />
      <span>ذخیره موقت</span>
    </button>
  </div>
</div>


      </div>
    );
  }

  // -------------------------------------------------------------
  // ۲. صفحه اصلی لیست کلاس‌ها (با گرید ریسپانسیو و جدول سازگار)
  // -------------------------------------------------------------
  return (
    <div className="admin-page-container" style={{ direction: 'rtl', padding: '16px' }}>
      
      {/* هدر صفحه اصلی */}
      <header className="admin-page-header mb-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'right' }}>
          <div className="admin-page-header-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FiUserPlus size={26} />
          </div>
          <div className="admin-page-header-info" style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 className="admin-page-title" style={{ margin: 0, lineHeight: '1.3' }}>
              مدیریت نمرات
            </h1>
            <p className="admin-page-subtitle" style={{ margin: '4px 0 0 0', lineHeight: '1.4' }}>
              مدیریت، پیگیری وضعیت، تایید و ثبت نمرات هنرجویان در کلاس‌ها و دوره‌ها
            </p>
          </div>
        </div>
      </header>

      {/* ۳. کارت‌های آماری کاملاً ریسپانسیو (Grid خودتنظیم شونده با ابعاد صفحه) */}
      <div 
        className="admin-stats-grid" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '16px', 
          width: '100%', 
          marginBottom: '24px' 
        }}
      >
        
        {/* ۱. کلاس‌های در حال برگزاری */}
        <div className="admin-stat-card" style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', border: '1px solid #f1f3f7' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#1d68f0', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#e0edff', color: '#1d68f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiPlayCircle size={22} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>کلاس‌های در حال برگزاری</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>۲</div>
        </div>

        {/* ۲. کلاس‌های پایان‌یافته */}
        <div className="admin-stat-card" style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', border: '1px solid #f1f3f7' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#16a34a', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiCheckCircle size={22} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>کلاس‌های پایان‌یافته</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>۷</div>
        </div>

        {/* ۳. کلاس در انتظار نهایی کردن نمرات */}
        <div className="admin-stat-card" style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', border: '1px solid #f1f3f7' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#dc2626', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiClock size={22} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>کلاس در انتظار نهایی کردن</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>۱</div>
        </div>

        {/* ۴. میانگین نمرات کل کلاس‌ها */}
        <div className="admin-stat-card" style={{ position: 'relative', background: '#fff', borderRadius: '16px', padding: '16px 18px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', border: '1px solid #f1f3f7' }}>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '6px', backgroundColor: '#d97706', borderTopRightRadius: '16px', borderBottomRightRadius: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FiAward size={22} />
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#475569' }}>میانگین نمرات کل کلاس‌ها</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a' }}>۱۲/۶</div>
        </div>

      </div>

      

      {/* ۱. کانتینر جدول لیست کلاس‌ها (اسکرول افقی در موبایل و تبلت) */}
      <div className="admin-table-container" style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #edf2f7', boxShadow: '0 4px 18px rgba(0,0,0,0.02)' }}>
        
        
        
        
        {/* فیلترها و جستجو */}
      <div className="admin-filters-bar admin-filters-with-reset" style={{ marginTop: '20px' }}>
        <div className="admin-search-box" style={{ flex: 1, minWidth: '220px' }}>
          <span className="admin-search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            placeholder="جستجوی نام کلاس، دوره یا استاد..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>

        <select 
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="ongoing">در حال برگزاری</option>
          <option value="completed">پایان‌یافته</option>
          <option value="not_started">در حال ثبت‌نام / شروع نشده</option>
        </select>

        <select 
          className="admin-filter-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="">همه دوره‌ها</option>
          <option value="طراحی وب">طراحی وب و فرانت‌اند</option>
          <option value="پایتون">برنامه‌نویسی پایتون</option>
          <option value="هوش مصنوعی">هوش مصنوعی و علوم داده</option>
          <option value="C#">برنامه‌نویسی C# و دات‌نت</option>
        </select>

        <select 
          className="admin-filter-select"
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
        >
          <option value="">همه اساتید</option>
          <option value="حمید پورفریدونی">حمید پورفریدونی</option>
          <option value="رضا نوری">رضا نوری</option>
          <option value="مریم احمدی">مریم احمدی</option>
          <option value="حسین مرادی">حسین مرادی</option>
        </select>

        {(statusFilter || courseFilter || teacherFilter || studentSearch) && (
          <button className="reset-filters-btn" onClick={handleResetFilters} title="بازنشانی فیلترها">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>حذف فیلترها</span>
          </button>
        )}
      </div>



        
        
        
        <table className="admin-table" style={{ width: '100%', minWidth: '950px' }}>
  <thead>
    <tr>
      <th style={{ width: '50px', textAlign: 'center' }}>#</th>
      <th style={{ textAlign: 'right', minWidth: '180px' }}>نام کلاس</th>
      <th style={{ textAlign: 'right', minWidth: '140px' }}>دوره آموزشی</th>
      <th style={{ textAlign: 'right', minWidth: '120px' }}>استاد</th>
      <th style={{ textAlign: 'center', minWidth: '90px' }}>ظرفیت</th>
      <th style={{ textAlign: 'center', minWidth: '140px' }}>مشخصات ترم و جلسات</th>
      <th style={{ textAlign: 'center', minWidth: '110px' }}>وضعیت کلاس</th>
      {/* ستون جدید وضعیت نمرات */}
      <th style={{ textAlign: 'center', minWidth: '120px' }}>وضعیت نمرات</th>
      {/* ستون عملیات با عرض مناسب */}
      <th style={{ textAlign: 'center', minWidth: '320px' }}>عملیات</th>
    </tr>
  </thead>
  <tbody>
    {filteredClasses.length > 0 ? (
      filteredClasses.map((item, index) => {
        const isGradesFinalized = Boolean(item.isFinalized ?? item.gradesFinalized);

        return (
          <tr key={item.id}>
            <td style={{ textAlign: 'center' }}>{index + 1}</td>
            <td>
              <strong style={{ color: 'var(--admin-primary, #1e3a8a)' }}>{item.name}</strong>
            </td>
            <td>{item.course}</td>
            <td>{item.teacher}</td>
            <td style={{ textAlign: 'center' }}>{item.capacity}</td>
            <td style={{ textAlign: 'center' }}>{item.termInfo}</td>
            <td style={{ textAlign: 'center' }}>
              <span className={getStatusBadgeClass(item.status)}>
                {item.statusText}
              </span>
            </td>

            {/* ۱. نمایش چیپ وضعیت نهایی شدن نمرات */}
            <td style={{ textAlign: 'center' }}>
              {isGradesFinalized ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '4px 8px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700' }}>
                  🔒 نهایی شده
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', padding: '4px 8px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: '700' }}>
                  ✏️ در حال ثبت
                </span>
              )}
            </td>

            {/* ۲. دکمه‌های ۳ گانه عملیات */}
            <td style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {/* دکمه ثبت نمرات */}
                <button
                  className="admin-btn admin-btn-sm admin-btn-primary"
                  onClick={() => setSelectedClass(item)}
                  style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  ثبت نمرات
                </button>

                {/* دکمه سطح علمی کلاس */}
                <button
                  type="button"
                  onClick={() => setAnalyticsClass(item)}
                  style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', fontWeight: '700' }}
                >
                  📊 سطح علمی
                </button>
                
                {/* دکمه لیست کامل نمرات */}
                <button
                  type="button"
                  onClick={() => setReportCardClass(item)}
                  style={{ padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', background: isGradesFinalized ? '#f0fdf4' : '#fafafa', color: isGradesFinalized ? '#15803d' : '#475569', border: `1px solid ${isGradesFinalized ? '#bbf7d0' : '#cbd5e1'}`, fontWeight: '700' }}
                >
                  📋 لیست کامل نمرات
                </button>
              </div>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan="9" className="admin-table-empty" style={{ textAlign: 'center', padding: '24px' }}>
          هیچ کلاسی با فیلترهای انتخابی یافت نشد.
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>





      {/* ======================= مودال تحلیل سطح علمی ======================= */}
      {analyticsClass && (() => {
        const analytics = getAcademicAnalytics(analyticsClass);
        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '850px', maxHeight: '90vh', borderRadius: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>📊 سطح علمی و مقایسه کلاس: {analyticsClass.name}</h3>
                <button type="button" onClick={() => setAnalyticsClass(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: '700' }}>میانگین نمرات این کلاس</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#1d4ed8', marginTop: '4px' }}>{analytics.classAvg} <small style={{ fontSize: '0.75rem' }}>از ۲۰</small></div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '700' }}>میانگین تاریخ این تخصص</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#334155', marginTop: '4px' }}>{analytics.specialtyAvg} <small style={{ fontSize: '0.75rem' }}>از ۲۰</small></div>
                  </div>
                  <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#065f46', fontWeight: '700' }}>درصد قبولی کلاس</div>
                    <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#059669', marginTop: '4px' }}>٪{analytics.passRate}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                    <div style={{ fontWeight: '800', color: '#92400e', fontSize: '0.88rem' }}>🥇 برترین هنرجوی این دوره:</div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#78350f', marginTop: '4px' }}>{analytics.topStudentThisClass.name} (معدل: {analytics.topStudentThisClass.score})</div>
                  </div>
                  <div style={{ background: '#fae8ff', padding: '14px', borderRadius: '12px', border: '1px solid #f5d0fe' }}>
                    <div style={{ fontWeight: '800', color: '#86198f', fontSize: '0.88rem' }}>🏆 برترین هنرجوی تاریخ این تخصص:</div>
                    <div style={{ fontSize: '1rem', fontWeight: '900', color: '#701a75', marginTop: '4px' }}>{analytics.allTimeTopStudent.name} (نمره: {analytics.allTimeTopStudent.score})</div>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#1e293b' }}>📈 مقایسه میانگین نمرات با تمامی دوره‌های قبلی:</h4>
                  {analytics.historicalClassesComparison.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ width: '150px', fontSize: '0.78rem', fontWeight: item.current ? '800' : '600', color: item.current ? '#1d4ed8' : '#64748b' }}>{item.term}:</span>
                      <div style={{ flex: 1, height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(item.avg / 20) * 100}%`, background: item.current ? '#2563eb' : '#94a3b8' }} />
                      </div>
                      <span style={{ width: '40px', fontSize: '0.82rem', fontWeight: '800', color: item.current ? '#1d4ed8' : '#334155' }}>{item.avg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setAnalyticsClass(null)} style={{ padding: '6px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '700' }}>بستن</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================= مودال کارنامه جامع چاپی ======================= */}
      {reportCardClass && (() => {
        const fullGrades = getFullGradeList(reportCardClass);
        return (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)', zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#fff', width: '100%', maxWidth: '940px', maxHeight: '92vh', borderRadius: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>📜 لیست کامل و رسمی نمرات کلاس</strong>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" disabled={isExporting} onClick={handleExportReportCardImage} style={{ padding: '6px 12px', borderRadius: '8px', background: '#16a34a', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem' }}>
                    {isExporting ? 'در حال تهیه عکس...' : '📷 خروجی عکس (PNG)'}
                  </button>
                  <button type="button" onClick={() => window.print()} style={{ padding: '6px 12px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.82rem' }}>
                    🖨️ چاپ
                  </button>
                  <button type="button" onClick={() => setReportCardClass(null)} style={{ background: '#e2e8f0', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
                </div>
              </div>

              {/* کانتینر اصلی کارنامه که تبدیل به عکس می‌شود */}
              <div ref={reportCardPrintRef} style={{ padding: '24px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e3a8a', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: '900' }}>آموزشگاه تخصصی فناوران فردا</h2>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>کارنامه رسمی ارزشیابی نهایی دوره آموزشی</p>
                  </div>
                  <div style={{ fontSize: '0.82rem', textAlign: 'left', color: '#475569' }}>
                    <div>تاریخ: <strong>۱۴۰۴/۰۵/۲۰</strong></div>
                    <div>کد کلاس: <strong>CLS-{reportCardClass.id}</strong></div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', flexWrap: 'wrap', gap: '8px' }}>
                  <span>نام کلاس: <strong>{reportCardClass.name}</strong></span>
                  <span>دوره: <strong>{reportCardClass.course}</strong></span>
                  <span>مدرس: <strong>{reportCardClass.teacher}</strong></span>
                  <span>مشخصات ترم: <strong>{reportCardClass.termInfo}</strong></span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
                  <thead>
                    <tr style={{ background: '#1e3a8a', color: '#fff' }}>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a', width: '30px' }}>#</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a', textAlign: 'right' }}>نام هنرجو</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a' }}>کد ملی</th>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a' }}>ج ۱</th>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a' }}>ج ۲</th>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a' }}>ج ۳</th>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a' }}>ج ۴</th>
                      <th style={{ padding: '8px 4px', border: '1px solid #1e3a8a' }}>ج ۵</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a', background: '#1e40af' }}>میان‌ترم (۳۰)</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a', background: '#1e40af' }}>پایان‌ترم (۷۰)</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a', background: '#0f172a' }}>نمره کل (۲۰)</th>
                      <th style={{ padding: '8px', border: '1px solid #1e3a8a' }}>وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullGrades.map((st, i) => (
                      <tr key={st.id} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{i + 1}</td>
                        <td style={{ padding: '6px 8px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: '700' }}>{st.name}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}>{st.nationalCode}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{st.s1}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{st.s2}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{st.s3}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{st.s4}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1' }}>{st.s5}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#1d4ed8' }}>{st.midterm}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#1d4ed8' }}>{st.final}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1', fontWeight: '900', color: '#0f172a' }}>{st.total}</td>
                        <td style={{ padding: '6px 4px', border: '1px solid #cbd5e1', color: st.passed ? '#15803d' : '#b91c1c', fontWeight: '700' }}>
                          {st.passed ? 'قبول' : 'مردود'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: '0.82rem' }}>
                  <div>امضای مدرس: <strong>{reportCardClass.teacher}</strong></div>
                  <div>مهر و تایید آموزشگاه: <strong>فناوران فردا</strong></div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
