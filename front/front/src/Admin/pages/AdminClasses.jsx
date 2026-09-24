import React, { useState } from 'react';
import "../style/AdminGlobal.css";
import "../style/AdminStudents.css";

// ایمپورت ایمن DatePicker برای جلوگیری از خطای Element type is invalid در Vite
import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import {
  FiLayers,
  FiPlus,
  FiSend,
  FiPrinter,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiUser, 
  FiUsers, 
  FiFileText,
  FiTrendingUp,
  FiSearch,
  FiDownload,
  FiRotateCcw,
  FiCheck,
  FiTrash2,
  FiEye,
  FiToggleRight,
  FiToggleLeft,
  FiInfo,
  FiCalendar,
  FiX,
  FiEdit
} from 'react-icons/fi';


import { BiEdit } from 'react-icons/bi';

// اطمینان از کامپوننت بودن DatePicker (حل باگ ESM/CJS در Vite)
const DatePicker = DatePickerModule?.default || DatePickerModule;

function AdminClasses() {
  // -------------------------------------------------------------
  // ۱. لیست داده‌های اولیه کلاس‌ها
  // -------------------------------------------------------------
  const [classesList, setClassesList] = useState([
    {
      id: 1,
      code: 'CLS-101',
      title: 'دوره جامع React & Next.js',
      courseTitle: 'برنامه‌نویسی فرانت‌اند',
      teacherName: 'حمید پورفریدونی',
      type: 'online',
      link: 'https://meet.fanavaran.ir/react',
      heldDays: 'شنبه، دوشنبه، چهارشنبه',
      heldTime: '۱۷:۰۰ الی ۱۹:۰۰',
      startDate: '۱۴۰۳/۰۷/۰۱',
      endDate: '۱۴۰۳/۰۹/۳۰',
      heldSessions: 14,
      totalSessions: 24,
      enrolledCount: 18,
      capacity: 20,
      tuition: 4500000,
      totalHours: 48,
      sessionDuration: '۱۲۰ دقیقه',
      status: 'active',
      description: 'آموزش جامع فرانت‌اند از صفر تا ورود به بازار کار.'
    },
    {
      id: 2,
      code: 'CLS-102',
      title: 'پایتون و یادگیری ماشین (AI)',
      courseTitle: 'هوش مصنوعی و علم داده',
      teacherName: 'حمید پورفریدونی',
      type: 'in_person',
      link: '',
      heldDays: 'یکشنبه، سه‌شنبه',
      heldTime: '۱۸:۰۰ الی ۲۰:۰۰',
      startDate: '۱۴۰۳/۰۷/۱۰',
      endDate: '۱۴۰۳/۱۰/۱۰',
      heldSessions: 8,
      totalSessions: 20,
      enrolledCount: 12,
      capacity: 15,
      tuition: 5200000,
      totalHours: 40,
      sessionDuration: '۱۲۰ دقیقه',
      status: 'compensatory',
      description: 'کلاس حضوری در سایت ۱ آموزشگاه فناوران فردا.'
    }
  ]);

  // لیست دوره‌ها و مدرسین برای فرم
  const [courses] = useState([
    { id: 1, title: 'برنامه‌نویسی فرانت‌اند (React & Next.js)' },
    { id: 2, title: 'هوش مصنوعی و یادگیری ماشین با پایتون' },
    { id: 3, title: 'توسعه بک‌اند با C# و ASP.NET Core' },
    { id: 4, title: 'الگوریتم، مسابقات برنامه‌نویسی و المپیاد' }
  ]);

  const [instructors] = useState([
    { id: 1, name: 'حمید پورفریدونی', specialty: 'مدرس ارشد هوش مصنوعی و فرانت‌اند' },
    { id: 2, name: 'مدرس نمونه بک‌اند', specialty: 'متخصص دات‌نت و پایتون' }
  ]);

  // فرم ایجاد کلاس جدید
  const initialNewClassState = {
    title: "",
  courseId: "",
  instructorId: "",
  type: "حضوری",
  room: "",
  startDate: null,
  endDate: null,
  days: "",
  startTime: "",
  endTime: "",
  capacity: "",
  price: "",
  description: ""
  };
  const [newClass, setNewClass] = useState(initialNewClassState);
// ۳. تابع باز کردن مودال افزودن (که با کلیک روی دکمه صدا زده می‌شود)
const handleOpenAddModal = () => {
  setNewClass(initialNewClassState);
  setIsAddClassModalOpen(true);
};
  // آمارها و برنامه روز
  const [stats] = useState({
    today: 4,
    active: 12,
    compensatory: 2,
    smsCount: 1420
  });

  const [liveClassesToday] = useState([
    { id: 1, title: 'کلاس ری‌اکت کد A', heldTime: '۱۷:۰۰', link: 'https://meet.fanavaran.ir/react', type: 'online' },
    { id: 2, title: 'پایتون مقدماتی', heldTime: '۱۸:۰۰', link: '', type: 'in_person' },
    { id: 3, title: 'سی‌شارپ و ASP.NET', heldTime: '۱۹:۰۰', link: 'https://meet.fanavaran.ir/csharp', type: 'online' },
    { id: 4, title: 'الگوریتم و مسابقات', heldTime: '۲۰:۰۰', link: '', type: 'in_person' }
  ]);

  // فیلترها و انتخاب‌ها
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  // وضعیت مودال‌ها
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');

 

  const handleCreateClassSubmit = (e) => {
    e.preventDefault();

    const selectedCourse = courses.find((c) => c.id === Number(newClass.courseId));
    const selectedInstructor = instructors.find((i) => i.id === Number(newClass.instructorId));

    const createdItem = {
      id: Date.now(),
      code: `CLS-${Math.floor(100 + Math.random() * 900)}`,
      title: newClass.title,
      courseTitle: selectedCourse ? selectedCourse.title : 'دوره تخصصی',
      teacherName: selectedInstructor ? selectedInstructor.name : 'کادر آموزشی',
      type: newClass.type === 'آنلاین' ? 'online' : 'in_person',
      link: newClass.type === 'آنلاین' ? 'https://meet.fanavaran.ir/class' : '',
      heldDays: newClass.days || 'شنبه، دوشنبه، چهارشنبه',
      heldTime: `${newClass.startTime || '۱۷:۰۰'} الی ${newClass.endTime || '۱۹:۰۰'}`,
      startDate: newClass.startDate ? newClass.startDate.toString() : '۱۴۰۳/۰۷/۰۱',
      endDate: newClass.endDate ? newClass.endDate.toString() : '۱۴۰۳/۰۹/۳۰',
      heldSessions: 0,
      totalSessions: 20,
      enrolledCount: 0,
      capacity: Number(newClass.capacity) || 15,
      tuition: Number(newClass.price) || 0,
      totalHours: 40,
      sessionDuration: '۱۲۰ دقیقه',
      status: 'active',
      description: newClass.description || ''
    };

    setClassesList((prev) => [createdItem, ...prev]);
    setIsAddClassModalOpen(false);
  };

    // ۱. فرم استیت ویرایش کلاس با تمام فیلدهای هماهنگ
  const [classForm, setClassForm] = useState({
    id: null,
    title: "",
    courseId: "",
    instructorId: "",
    type: "حضوری",
    room: "",
    startDate: null,
    endDate: null,
    days: "",
    startTime: "",
    endTime: "",
    capacity: "",
  
    description: ""
  });

  // ۲. تابع باز کردن مودال ویرایش و پر کردن فیلدها از روی کلاس انتخاب‌شده
  const handleOpenEditModal = (item) => {
    // پیدا کردن شناسه دوره و مدرس در صورت تطابق با نام
    const matchedCourse = courses.find((c) => c.title === item.courseTitle || c.id === item.courseId);
    const matchedInstructor = instructors.find((i) => i.name === item.teacherName || i.id === item.instructorId);

    // استخراج ساعت شروع و پایان از متن heldTime (مثلاً "۱۷:۰۰ الی ۱۹:۰۰")
    let startT = item.startTime || "";
    let endT = item.endTime || "";
    if (!startT && item.heldTime && item.heldTime.includes("الی")) {
      const parts = item.heldTime.split("الی").map(p => p.trim());
      startT = parts[0] || "";
      endT = parts[1] || "";
    }

    setClassForm({
      id: item.id,
      code: item.code,
      title: item.title || "",
      courseId: matchedCourse ? matchedCourse.id : (item.courseId || ""),
      instructorId: matchedInstructor ? matchedInstructor.id : (item.instructorId || ""),
      type: item.type === "online" ? "آنلاین" : (item.type === "hybrid" ? "ترکیبی" : "حضوری"),
      room: item.room || "",
      startDate: item.startDate || null,
      endDate: item.endDate || null,
      days: item.heldDays || item.days || "",
      startTime: startT,
      endTime: endT,
      capacity: item.capacity || "",
      price: item.tuition || item.price || "",
      description: item.description || ""
    });

    setIsEditModalOpen(true);
  };

  // ۳. تابع ذخیره تغییرات کلاس
  const handleSaveEditClass = (e) => {
    e.preventDefault();

    const selectedCourse = courses.find((c) => c.id === Number(classForm.courseId));
    const selectedInstructor = instructors.find((i) => i.id === Number(classForm.instructorId));

    setClassesList((prev) =>
      prev.map((c) => {
        if (c.id === classForm.id) {
          return {
            ...c,
            title: classForm.title,
            courseId: classForm.courseId,
            courseTitle: selectedCourse ? selectedCourse.title : c.courseTitle,
            instructorId: classForm.instructorId,
            teacherName: selectedInstructor ? selectedInstructor.name : c.teacherName,
            type: classForm.type === "آنلاین" ? "online" : (classForm.type === "ترکیبی" ? "hybrid" : "in_person"),
            link: classForm.type === "آنلاین" ? (c.link || "https://meet.fanavaran.ir/class") : "",
            room: classForm.room,
            heldDays: classForm.days,
            heldTime: `${classForm.startTime || "۱۷:۰۰"} الی ${classForm.endTime || "۱۹:۰۰"}`,
            startDate: classForm.startDate ? classForm.startDate.toString() : c.startDate,
            endDate: classForm.endDate ? classForm.endDate.toString() : c.endDate,
            capacity: Number(classForm.capacity) || c.capacity,
            tuition: Number(classForm.price) || c.tuition,
            description: classForm.description || ""
          };
        }
        return c;
      })
    );

    setIsEditModalOpen(false);
  };


  const handleViewDetails = (item) => {
    setSelectedClass(item);
    setIsDetailsModalOpen(true);
  };

  const handleToggleStatus = (id) => {
    setClassesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c))
    );
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredClasses.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    alert('پیام همگانی با موفقیت برای دانشجویان ارسال شد.');
    setBroadcastMessage('');
    setIsBroadcastModalOpen(false);
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCourseFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleBulkDeactivate = () => {
    if (window.confirm(`آیا از غیرفعال‌سازی ${selectedIds.length} کلاس انتخاب‌شده اطمینان دارید؟`)) {
      setClassesList((prev) =>
        prev.map((c) => (selectedIds.includes(c.id) ? { ...c, status: 'inactive' } : c))
      );
      setSelectedIds([]);
    }
  };







  // -------------------------------------------------------------
  // مدیریت جلسات کلاس (Class Sessions)
  // -------------------------------------------------------------
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [selectedClassForSessions, setSelectedClassForSessions] = useState(null);

  // داده‌های نمونه جلسات کلاس‌ها
  const [classSessions, setClassSessions] = useState([
    {
      id: 1,
      classId: 1,
      classTitle: 'دوره جامع React & Next.js',
      sessionNumber: 1,
      title: 'آشنایی با مفاهیم JSX و ساختار کامپوننت‌ها',
      sessionDate: '۱۴۰۳/۰۷/۰۱',
      startTime: '۱۷:۰۰',
      endTime: '۱۹:۰۰',
      status: 'held', // 'held' (برگزار شده) | 'scheduled' (برنامه‌ریزی شده) | 'canceled' (لغو شده) | 'compensatory' (جبرانی)
      hasContent: 'دارد', // 'دارد' | 'ندارد'
      description: 'نصب Node.js و معرفی اکوسیستم ری‌اکت و تفاوت با جاوااسکریپت خام.'
    },
    {
      id: 2,
      classId: 1,
      classTitle: 'دوره جامع React & Next.js',
      sessionNumber: 2,
      title: 'مدیریت استیت‌ها با useState و useEffect',
      sessionDate: '۱۴۰۳/۰۷/۰۳',
      startTime: '۱۷:۰۰',
      endTime: '۱۹:۰۰',
      status: 'scheduled',
      hasContent: 'ندارد',
      description: 'تمرین عملی ساخت فرم لاگین و بررسی رندرهای مجدد.'
    }
  ]);

  // استیت فرم ثبت / ویرایش جلسه
  const initialSessionForm = {
    id: null,
    classId: '',
    sessionNumber: '',
    title: '',
    sessionDate: null,
    startTime: '',
    endTime: '',
    status: 'scheduled',
    hasContent: 'دارد',
    description: ''
  };

  const [sessionForm, setSessionForm] = useState(initialSessionForm);

  // باز کردن مودال جلسات برای یک کلاس
  const handleOpenSessionsModal = (targetClass = null) => {
    const cls = targetClass || selectedClassForSessions || classesList[0] || null;
    setSelectedClassForSessions(cls);
    setSessionForm({
      ...initialSessionForm,
      classId: cls ? cls.id : '',
      startTime: cls ? (cls.heldTime?.split('الی')[0]?.trim() || '۱۷:۰۰') : '۱۷:۰۰',
      endTime: cls ? (cls.heldTime?.split('الی')[1]?.trim() || '۱۹:۰۰') : '۱۹:۰۰'
    });
    setIsSessionsModalOpen(true);
  };

  // ذخیره (افزودن یا ویرایش) جلسه
  const handleSaveSession = (e) => {
    e.preventDefault();

    if (!sessionForm.title.trim()) {
      alert('لطفاً عنوان جلسه را وارد کنید.');
      return;
    }

    const currentClass = classesList.find((c) => c.id === Number(sessionForm.classId || selectedClassForSessions?.id));
    const targetClassId = currentClass ? currentClass.id : (selectedClassForSessions?.id || classesList[0]?.id || 1);
    const targetClassTitle = currentClass ? currentClass.title : (selectedClassForSessions?.title || 'کلاس عمومی');

    const formattedDate = sessionForm.sessionDate
      ? (typeof sessionForm.sessionDate === 'object' && sessionForm.sessionDate.format
          ? sessionForm.sessionDate.format()
          : sessionForm.sessionDate.toString())
      : '۱۴۰۳/۰۷/۰۱';

    if (sessionForm.id) {
      // ویرایش جلسه موجود
      setClassSessions((prev) =>
        prev.map((item) =>
          item.id === sessionForm.id
            ? {
                ...item,
                classId: targetClassId,
                classTitle: targetClassTitle,
                sessionNumber: Number(sessionForm.sessionNumber) || item.sessionNumber,
                title: sessionForm.title,
                sessionDate: formattedDate,
                startTime: sessionForm.startTime,
                endTime: sessionForm.endTime,
                status: sessionForm.status,
                hasContent: sessionForm.hasContent,
                description: sessionForm.description
              }
            : item
        )
      );
    } else {
      // افزودن جلسه جدید
      const newSession = {
        id: Date.now(),
        classId: targetClassId,
        classTitle: targetClassTitle,
        sessionNumber: Number(sessionForm.sessionNumber) || (classSessions.filter(s => s.classId === targetClassId).length + 1),
        title: sessionForm.title,
        sessionDate: formattedDate,
        startTime: sessionForm.startTime || '۱۷:۰۰',
        endTime: sessionForm.endTime || '۱۹:۰۰',
        status: sessionForm.status,
        hasContent: sessionForm.hasContent,
        description: sessionForm.description
      };
      setClassSessions((prev) => [newSession, ...prev]);
    }

    // ریست کردن فیلدهای فرم برای ثبت مورد بعدی
    setSessionForm({
      ...initialSessionForm,
      classId: targetClassId
    });
  };

  // آماده‌سازی فرم برای ویرایش جلسه
  const handleEditSession = (item) => {
    setSessionForm({
      id: item.id,
      classId: item.classId,
      sessionNumber: item.sessionNumber || '',
      title: item.title || '',
      sessionDate: item.sessionDate || null,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      status: item.status || 'scheduled',
      hasContent: item.hasContent || 'دارد',
      description: item.description || ''
    });
  };

  // حذف جلسه
  const handleDeleteSession = (id) => {
    if (window.confirm('آیا از حذف این جلسه اطمینان دارید؟')) {
      setClassSessions((prev) => prev.filter((item) => item.id !== id));
      if (sessionForm.id === id) {
        setSessionForm({
          ...initialSessionForm,
          classId: selectedClassForSessions?.id || ''
        });
      }
    }
  };










  // فیلتر کردن لیست کلاس‌ها
  const filteredClasses = classesList.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse = courseFilter === 'ALL' || item.courseTitle === courseFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // -------------------------------------------------------------
  // ۳. رندر JSX
  // -------------------------------------------------------------
  return (
    <div className="admin-page-container container-fluid p-3 p-md-4">
      {/* هدر صفحه */}
      <header className="admin-page-header">
        <div className="d-flex align-items-center gap-3">
          <div className="admin-page-header-icon">
            <FiLayers size={26} />
          </div>
          <div className="admin-page-header-text">
            <h1 className="admin-page-title">مدیریت و برنامه‌ریزی کلاس‌ها</h1>
            <p className="admin-page-subtitle">
              مدیریت دوره‌های آموزشی، زمان‌بندی جلسات، لینک‌های برگزاری و وضعیت کلاس‌های موسسه فناوران فردا
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions d-flex align-items-center flex-wrap gap-2">
          <button
            type="button"
            className="admin-btn-primary"
            onClick={handleOpenAddModal}
          >
            <FiPlus size={20} />
            <span>تعریف کلاس جدید</span>
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => handleOpenSessionsModal()}
          >
            <FiCalendar size={18} />
            <span>جلسات کلاس</span>
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setIsBroadcastModalOpen(true)}
          >
            <FiSend size={18} />
            <span>ارسال پیام همگانی</span>
          </button>
          
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handlePrintSchedule}
          >
            <FiPrinter size={18} />
            <span>پرینت برنامه هفتگی</span>
          </button>

          <button
            type="button"
            className="admin-btn-secondary"
            onClick={handlePrintSchedule}
          >
            <FiPrinter size={18} />
            <span>پرینت برنامه سالیانه</span>
          </button>

        </div>
      </header>

            {/* ================= ۲. کارت‌های آماری تحلیلی کلاس‌ها ================= */}
      <div className="admin-stats-grid mb-4">
        {/* کارت اول: کلاس‌های امروز (آبی) */}
        <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiClock size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کلاس‌های امروز</span>
            <span className="stat-card-value">{stats.today} کلاس</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> جلسات فعال در تقویم روز
            </span>
          </div>
        </div>

        {/* کارت دوم: کل کلاس‌های فعال (سبز) */}
        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل کلاس‌های فعال</span>
            <span className="stat-card-value">{stats.active} ترم</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ترم‌های در حال برگزاری
            </span>
          </div>
        </div>

        {/* کارت سوم: نیازمند جبرانی (کهربایی / نارنجی) */}
        <div className="admin-stat-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <FiAlertCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">نیازمند جبرانی</span>
            <span className="stat-card-value">{stats.compensatory} کلاس</span>
            <span className="stat-trend-badge positive" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <FiAlertCircle size={12} /> جلسات عقب‌افتاده یا تعطیل‌شده
            </span>
          </div>
        </div>

        {/* کارت چهارم: پیامک‌های اطلاع‌رسانی (بنفش) */}
        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiMessageSquare size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">پیامک‌های اطلاع‌رسانی</span>
            <span className="stat-card-value">{stats.smsCount?.toLocaleString('fa-IR') || 0} پیامک</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> یادآوری کلاس و اطلاعیه‌ها
            </span>
          </div>
        </div>
      </div>


          {/* ================= کلاس‌های زنده و برنامه امروز ================= */}
      <div className="live-classes-section bg-white rounded-4 p-4 shadow-sm border mb-4">
        {/* هدر بخش */}
        <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="position-relative d-flex" style={{ width: '12px', height: '12px' }}>
              <span className="spinner-grow spinner-grow-sm text-danger position-absolute" style={{ width: '12px', height: '12px' }}></span>
              <span className="rounded-circle bg-danger w-100 h-100"></span>
            </span>
            <h6 className="fw-bold m-0 text-dark" style={{ fontSize: '1rem' }}>
              کلاس‌های زنده و برنامه امروز
            </h6>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge px-3 py-2 rounded-pill fw-semibold" style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.8rem' }}>
              {liveClassesToday.length > 0 
                ? `${liveClassesToday.length.toLocaleString('fa-IR')} کلاس فعال امروز` 
                : 'بدون جلسه امروز'}
            </span>
          </div>
        </div>

        {/* لیست کارت‌ها یا وضعیت بدون کلاس */}
        {liveClassesToday && liveClassesToday.length > 0 ? (
          <div className="row g-3">
            {liveClassesToday.map((item) => (
              <div 
                key={item.id} 
                className={
                  liveClassesToday.length === 1 
                    ? 'col-12' 
                    : liveClassesToday.length === 2 
                    ? 'col-12 col-md-6' 
                    : liveClassesToday.length === 3 
                    ? 'col-12 col-md-4' 
                    : 'col-12 col-sm-6 col-lg-3'
                }
              >
                <div 
                  className="p-3 rounded-4 h-100 d-flex flex-column justify-content-between transition-all"
                  style={{ 
                    backgroundColor: '#f8fafc', 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease-in-out' 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    {/* برچسب نوع و وضعیت */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span 
                        className="badge rounded-pill px-2 py-1"
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: item.type === 'online' ? '#e0f2fe' : '#fef3c7',
                          color: item.type === 'online' ? '#0284c7' : '#d97706'
                        }}
                      >
                        {item.type === 'online' ? '🌐 کلاس آنلاین' : '🏫 کلاس حضوری'}
                      </span>
                      <span className="text-danger fw-bold d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                        <span className="spinner-grow spinner-grow-sm" style={{ width: '6px', height: '6px' }}></span>
                        در حال برگزاری / آماده
                      </span>
                    </div>

                    {/* عنوان کلاس */}
                    <h6 className="fw-bold text-dark text-truncate mb-2" title={item.title} style={{ fontSize: '0.92rem' }}>
                      {item.title}
                    </h6>

                    {/* ساعت برگزاری و مدرس */}
                    <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '0.78rem' }}>
                      <span className="d-flex align-items-center gap-1">
                        <FiClock size={13} className="text-primary" />
                        {item.heldTime || 'ساعت مشخص نشده'}
                      </span>
                      {item.teacherName && (
                        <span className="d-flex align-items-center gap-1 text-truncate">
                          <FiUser size={13} />
                          {item.teacherName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* دکمه ورود یا وضعیت */}
                  <div className="pt-3 mt-3 border-top d-flex justify-content-between align-items-center">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary w-100 rounded-3 py-1 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <span>ورود به اتاق جلسه</span>
                      </a>
                    ) : (
                      <div className="w-100 text-center py-1 rounded-3 bg-white border text-secondary fw-semibold" style={{ fontSize: '0.78rem' }}>
                        📍 تشکیل حضوری در موسسه
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* وضعیت خالی: در صورتی که کلاسی در امروز نباشد */
          <div className="text-center py-4 px-3 my-2 rounded-4" style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
            <div 
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
              style={{ width: '48px', height: '48px', backgroundColor: '#e2e8f0', color: '#64748b' }}
            >
              <FiCalendar size={22} />
            </div>
            <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.92rem' }}>
              امروز هیچ کلاسی برنامه‌ریزی نشده است
            </h6>
            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
              جلسه فعالی برای تاریخ امروز در سیستم ثبت نشده و تقویم آموزشی امروز آزاد است.
            </p>
          </div>
        )}
      </div>


           {/* ================= ۵. جدول لیست کلاس‌ها و فیلترها ================= */}
      <div className="admin-table-card">
        <div className="admin-table-container">

          {/* نوار فیلترها و جستجو */}
          <div className="admin-filters-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div className="admin-search-box" style={{ flex: '1 1 260px' }}>
              <FiSearch className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="جستجو بر اساس نام کلاس، دوره، استاد یا شناسه..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (typeof setCurrentPage === 'function') setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    if (typeof setCurrentPage === 'function') setCurrentPage(1);
                  }}
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <select
              className="admin-filter-select"
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                if (typeof setCurrentPage === 'function') setCurrentPage(1);
              }}
            >
              <option value="ALL">همه دوره‌ها</option>
              {Array.from(new Set(classesList.map((c) => c.courseTitle))).map((title, i) => (
                <option key={i} value={title}>{title}</option>
              ))}
            </select>

            <select
              className="admin-filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                if (typeof setCurrentPage === 'function') setCurrentPage(1);
              }}
            >
              <option value="ALL">همه وضعیت‌ها</option>
              <option value="active">در حال برگزاری (فعال)</option>
              <option value="compensatory">نیازمند جبرانی</option>
              <option value="inactive">غیرفعال / پایان‌یافته</option>
            </select>

            <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="button"
                className="btn-action-base reset-filters-btn-full"
                onClick={handleResetFilters}
                title="بازنشانی فیلترها"
              >
                <FiRotateCcw className="reset-icon" />
                <span>بازنشانی فیلترها</span>
              </button>

              <button
                type="button"
                className="btn-action-base btn-export-excel"
                onClick={typeof handleExportExcel === 'function' ? handleExportExcel : () => alert('خروجی اکسل کلاس‌ها دریافت شد.')}
                title="دریافت خروجی اکسل"
              >
                <FiDownload />
                <span>خروجی اکسل</span>
              </button>
            </div>
          </div>

          {/* نوار کنترل بالای جدول (انتخاب گروهی) */}
          <div className="table-toolbar-bar">
            <div className="table-toolbar-left">
              

              {selectedIds.length > 0 && (
                <span className="selection-info-tag">
                  {selectedIds.length} کلاس انتخاب شده
                </span>
              )}
            </div>

            {selectedIds.length > 0 && (
              <button
                type="button"
                className="bulk-delete-btn"
                onClick={handleBulkDeactivate}
              >
                <FiTrash2 size={15} />
                <span>غیرفعال‌سازی {selectedIds.length} کلاس</span>
              </button>
            )}
          </div>

          {/* جدول اطلاعات کلاس‌ها */}
          <table className="admin-table table-responsive">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={filteredClasses.length > 0 && selectedIds.length === filteredClasses.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>نام کلاس</th>
                <th>دوره آموزشی</th>
                <th className="d-none d-md-table-cell">مدرس / کادر</th>
                <th className="d-none d-md-table-cell">زمان‌بندی جلسات</th>
                <th className="d-none d-md-table-cell" style={{ minWidth: '140px' }}>پیشرفت جلسات</th>
                <th className="d-none d-md-table-cell">هنرجویان</th>
                <th className="d-none d-md-table-cell">وضعیت</th>
                <th style={{ width: '120px', textAlign: 'center' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length > 0 ? (
                filteredClasses.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  const progress = Math.round(((item.heldSessions || 0) / (item.totalSessions || 1)) * 100);

                  return (
                    <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                      {/* ۱. چک‌باکس انتخاب سطر */}
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                        />
                      </td>

                      {/* ۲. نام کلاس و شناسه */}
                      <td>
                        <div className="user-profile-cell">
                          <div className="user-profile-info">
                            <span className="user-name" style={{ fontWeight: 600 }}>
                              {item.title}
                            </span>
                            <span className="user-email" style={{ fontSize: '11px', color: '#64748b' }}>
                              کد: {item.code || `CLS-${item.id}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ۳. عنوان دوره و نوع برگزاری */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                            {item.courseTitle}
                          </span>
                          <span
                            style={{
                              alignSelf: 'flex-start',
                              background: item.type === 'online' ? '#e0f2fe' : '#ecfdf5',
                              color: item.type === 'online' ? '#0284c7' : '#059669',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            {item.type === 'online' ? '🌐 آنلاین' : '🏫 حضوری'}
                          </span>
                        </div>
                      </td>

                      {/* ۴. مدرس */}
                      <td className="d-none d-md-table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontWeight: 500, fontSize: '13px' }}>
                          <FiUser size={14} className="text-secondary" />
                          <span>{item.teacherName}</span>
                        </div>
                      </td>

                      {/* ۵. زمان‌بندی روز و ساعت */}
                      <td className="d-none d-md-table-cell">
                        <div style={{ fontSize: '12px', color: '#475569' }}>
                          <div style={{ fontWeight: 500 }}>{item.heldDays}</div>
                          <div style={{ color: '#94a3b8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock size={12} />
                            {item.heldTime}
                          </div>
                        </div>
                      </td>

                      {/* ۶. نوار پیشرفت جلسات */}
                      <td className="d-none d-md-table-cell">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                          <span>{item.heldSessions} از {item.totalSessions} جلسه</span>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(progress, 100)}%`,
                              height: '100%',
                              backgroundColor: progress >= 100 ? '#10b981' : progress > 50 ? '#3b82f6' : '#f59e0b',
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </td>

                      {/* ۷. ظرفیت و ثبت‌نام‌شدگان */}
                      <td className="d-none d-md-table-cell">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: 600 }}>
                          <FiUsers size={15} color="#6366f1" />
                          <span>{item.enrolledCount} / {item.capacity}</span>
                        </div>
                      </td>

                      {/* ۸. برچسب وضعیت */}
                      <td className="d-none d-md-table-cell">
                        {item.status === 'active' ? (
                          <span className="admin-status-badge active">در حال برگزاری</span>
                        ) : item.status === 'compensatory' ? (
                          <span className="admin-status-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>نیازمند جبرانی</span>
                        ) : (
                          <span className="admin-status-badge inactive">غیرفعال</span>
                        )}
                      </td>

                      {/* ۹. دکمه‌های عملیات سطر */}
                      <td>
                        <div className="admin-actions-group" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="admin-action-btn btn-details"
                            title="مشاهده جزئیات کامل کلاس"
                            onClick={() => handleViewDetails(item)}
                          >
                            <FiInfo size={16} />
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn btn-password"
                            style={{ color: '#d97706', background: '#fef3c7' }}
                            title="ویرایش کلاس"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <BiEdit size={16} />
                          </button>

                          <button
                            type="button"
                            className="admin-action-btn"
                            style={{
                              color: item.status === 'active' ? '#ef4444' : '#10b981',
                              background: item.status === 'active' ? '#fee2e2' : '#dcfce7'
                            }}
                            title={item.status === 'active' ? 'غیرفعال‌سازی کلاس' : 'فعال‌سازی مجدد کلاس'}
                            onClick={() => handleToggleClassStatus(item.id)}
                          >
                            {item.status === 'active' ? <FiTrash2 size={16} /> : <FiRotateCcw size={16} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '48px 16px', color: '#94a3b8' }}>
                    هیچ کلاسی مطابق با فیلترهای انتخابی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>



      {/* ============================================================ */}
      {/* مودال ایجاد کلاس دوتکه و تقویم شمسی */}
      {/* ============================================================ */}
      {isAddClassModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddClassModalOpen(false)}>
          <div 
            className="admin-modal-dialog admin-modal-lg bg-white" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="d-flex align-items-center gap-2">
                <div className="admin-modal-icon-badge">
                  <FiLayers size={20} />
                </div>
                <div>
                  <h3 className="admin-modal-title">تعریف کلاس جدید</h3>
                  <p className="admin-modal-subtitle">مشخصات آموزشی، مدرس، ظرفیت و زمان‌بندی برگزاری کلاس را وارد نمایید.</p>
                </div>
              </div>
              <button 
                type="button" 
                className=" btn btn-danger"
                onClick={() => setIsAddClassModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateClassSubmit} className="admin-modal-body">
              <div className="admin-modal-grid-2col">
                {/* بخش اول: اطلاعات پایه */}
                <div className="admin-form-section-card">
                  <div className="admin-form-section-header">
                    <FiInfo className="text-primary" size={18} />
                    <h4>اطلاعات پایه و مدرس</h4>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      عنوان کلاس / کد دوره <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-form-control"
                      placeholder="مثال: کد A - پاییز ۱۴۰۳"
                      value={newClass.title}
                      onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      دوره آموزشی مربوطه <span className="text-danger">*</span>
                    </label>
                    <select
                      className="admin-form-control"
                      value={newClass.courseId}
                      onChange={(e) => setNewClass({ ...newClass, courseId: e.target.value })}
                      required
                    >
                      <option value="">-- انتخاب دوره --</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      مدرس دوره <span className="text-danger">*</span>
                    </label>
                    <select
                      className="admin-form-control"
                      value={newClass.instructorId}
                      onChange={(e) => setNewClass({ ...newClass, instructorId: e.target.value })}
                      required
                    >
                      <option value="">-- انتخاب مدرس --</option>
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">نوع برگزاری</label>
                        <select
                          className="admin-form-control"
                          value={newClass.type}
                          onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                        >
                          <option value="حضوری">حضوری</option>
                          <option value="آنلاین">آنلاین</option>
                          <option value="ترکیبی">ترکیبی</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">محل / شماره کلاس</label>
                        <input
                          type="text"
                          className="admin-form-control"
                          placeholder="مثال: سایت ۱"
                          value={newClass.room}
                          onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group mb-0">
                    <label className="admin-form-label">توضیحات و یادداشت</label>
                    <textarea
                      rows={2}
                      className="admin-form-control"
                      placeholder="توضیحات و نیازمندی‌ها..."
                      value={newClass.description}
                      onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* بخش دوم: زمان‌بندی و شهریه */}
                <div className="admin-form-section-card">
                  <div className="admin-form-section-header">
                    <FiCalendar className="text-primary" size={18} />
                    <h4>زمان‌بندی، ظرفیت</h4>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">تاریخ شروع (شمسی)</label>
                        <div className="admin-datepicker-wrapper">
                          <DatePicker
                            value={newClass.startDate}
                            onChange={(date) => setNewClass({ ...newClass, startDate: date })}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="admin-form-control admin-datepicker-input"
                            placeholder="۱۴۰۳/۰۷/۰۱"
                          />
                          <FiCalendar className="admin-input-icon" />
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">تاریخ پایان (شمسی)</label>
                        <div className="admin-datepicker-wrapper">
                          <DatePicker
                            value={newClass.endDate}
                            onChange={(date) => setNewClass({ ...newClass, endDate: date })}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="admin-form-control admin-datepicker-input"
                            placeholder="۱۴۰۳/۰۹/۳۰"
                          />
                          <FiCalendar className="admin-input-icon" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">روزهای برگزاری</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      placeholder="مثال: شنبه، دوشنبه، چهارشنبه"
                      value={newClass.days}
                      onChange={(e) => setNewClass({ ...newClass, days: e.target.value })}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ساعت شروع</label>
                        <input
                          type="time"
                          className="admin-form-control"
                          value={newClass.startTime}
                          onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ساعت پایان</label>
                        <input
                          type="time"
                          className="admin-form-control"
                          value={newClass.endTime}
                          onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ظرفیت (نفر)</label>
                        <input
                          type="number"
                          min="1"
                          className="admin-form-control"
                          placeholder="مثال: ۱۵"
                          value={newClass.capacity}
                          onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsAddClassModalOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="admin-btn-primary">
                  ثبت و ایجاد کلاس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          {/* ============================================================ */}
      {/* مودال ویرایش کلاس دوتکه و تقویم شمسی */}
      {/* ============================================================ */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div 
            className="admin-modal-dialog admin-modal-lg bg-white" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="d-flex align-items-center gap-2">
                <div className="admin-modal-icon-badge">
                  <FiEdit size={20} />
                </div>
                <div>
                  <h3 className="admin-modal-title">ویرایش مشخصات کلاس</h3>
                  <p className="admin-modal-subtitle">ویرایش اطلاعات آموزشی، مدرس، ظرفیت، شهریه و زمان‌بندی برگزاری کلاس.</p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => setIsEditModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditClass} className="admin-modal-body">
              <div className="admin-modal-grid-2col">
                {/* بخش اول: اطلاعات پایه و مدرس */}
                <div className="admin-form-section-card">
                  <div className="admin-form-section-header">
                    <FiInfo className="text-primary" size={18} />
                    <h4>اطلاعات پایه و مدرس</h4>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      عنوان کلاس / کد دوره <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="admin-form-control"
                      placeholder="مثال: کد A - پاییز ۱۴۰۳"
                      value={classForm.title}
                      onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      دوره آموزشی مربوطه <span className="text-danger">*</span>
                    </label>
                    <select
                      className="admin-form-control"
                      value={classForm.courseId}
                      onChange={(e) => setClassForm({ ...classForm, courseId: e.target.value })}
                      required
                    >
                      <option value="">-- انتخاب دوره --</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      مدرس دوره <span className="text-danger">*</span>
                    </label>
                    <select
                      className="admin-form-control"
                      value={classForm.instructorId}
                      onChange={(e) => setClassForm({ ...classForm, instructorId: e.target.value })}
                      required
                    >
                      <option value="">-- انتخاب مدرس --</option>
                      {instructors.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.specialty})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">نوع برگزاری</label>
                        <select
                          className="admin-form-control"
                          value={classForm.type}
                          onChange={(e) => setClassForm({ ...classForm, type: e.target.value })}
                        >
                          <option value="حضوری">حضوری</option>
                          <option value="آنلاین">آنلاین</option>
                          <option value="ترکیبی">ترکیبی</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">محل / شماره کلاس</label>
                        <input
                          type="text"
                          className="admin-form-control"
                          placeholder="مثال: سایت ۱"
                          value={classForm.room}
                          onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group mb-0">
                    <label className="admin-form-label">توضیحات و یادداشت</label>
                    <textarea
                      rows={2}
                      className="admin-form-control"
                      placeholder="توضیحات و نیازمندی‌ها..."
                      value={classForm.description}
                      onChange={(e) => setClassForm({ ...classForm, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* بخش دوم: زمان‌بندی و شهریه */}
                <div className="admin-form-section-card">
                  <div className="admin-form-section-header">
                    <FiCalendar className="text-primary" size={18} />
                    <h4>زمان‌بندی، ظرفیت و شهریه</h4>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">تاریخ شروع (شمسی)</label>
                        <div className="admin-datepicker-wrapper">
                          <DatePicker
                            value={classForm.startDate}
                            onChange={(date) => setClassForm({ ...classForm, startDate: date })}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="admin-form-control admin-datepicker-input"
                            placeholder="۱۴۰۳/۰۷/۰۱"
                          />
                          <FiCalendar className="admin-input-icon" />
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">تاریخ پایان (شمسی)</label>
                        <div className="admin-datepicker-wrapper">
                          <DatePicker
                            value={classForm.endDate}
                            onChange={(date) => setClassForm({ ...classForm, endDate: date })}
                            calendar={persian}
                            locale={persian_fa}
                            calendarPosition="bottom-right"
                            inputClass="admin-form-control admin-datepicker-input"
                            placeholder="۱۴۰۳/۰۹/۳۰"
                          />
                          <FiCalendar className="admin-input-icon" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">روزهای برگزاری</label>
                    <input
                      type="text"
                      className="admin-form-control"
                      placeholder="مثال: شنبه، دوشنبه، چهارشنبه"
                      value={classForm.days}
                      onChange={(e) => setClassForm({ ...classForm, days: e.target.value })}
                    />
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ساعت شروع</label>
                        <input
                          type="time"
                          className="admin-form-control"
                          value={classForm.startTime}
                          onChange={(e) => setClassForm({ ...classForm, startTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ساعت پایان</label>
                        <input
                          type="time"
                          className="admin-form-control"
                          value={classForm.endTime}
                          onChange={(e) => setClassForm({ ...classForm, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <div className="admin-form-group">
                        <label className="admin-form-label">ظرفیت (نفر)</label>
                        <input
                          type="number"
                          min="1"
                          className="admin-form-control"
                          placeholder="مثال: ۱۵"
                          value={classForm.capacity}
                          onChange={(e) => setClassForm({ ...classForm, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="admin-btn-primary">
                  <FiCheck style={{ marginLeft: '6px' }} />
                  ذخیره تغییرات کلاس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
















      {/* ============================================================ */}
      {/* مودال ایجاد، ویرایش و مدیریت جلسات کلاس */}
      {/* ============================================================ */}
      {isSessionsModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content w-75 bg-white" style={{ maxWidth: '1100px' }}>
            {/* هدر مودال */}
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                <FiCalendar className="text-primary" size={22} />
                مدیریت جلسات کلاس: {selectedClassForSessions?.title || 'انتخاب کلاس'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsSessionsModalOpen(false)}
              ></button>
            </div>

            {/* بدنه مودال */}
            <div className="admin-modal-body p-3">
              {/* ۱. انتخاب کلاس برای فیلتر و مدیریت جلسات */}
              <div className="mb-3">
                <label className="form-label fw-bold small">۱. عنوان کلاس:</label>
                <select
                  className="form-select"
                  value={selectedClassForSessions?.id || ''}
                  onChange={(e) => {
                    const cls = classesList.find((c) => c.id === Number(e.target.value));
                    setSelectedClassForSessions(cls);
                    setSessionForm((prev) => ({ ...prev, classId: cls ? cls.id : '' }));
                  }}
                >
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code}) - مدرس: {c.teacherName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">
                {/* ستون راست: فرم ایجاد / ویرایش جلسه */}
                <div className="col-12 col-lg-5">
                  <div className="border rounded-3 p-3 bg-light">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-1">
                      {sessionForm.id ? <FiEdit className="text-warning" /> : <FiPlus className="text-success" />}
                      {sessionForm.id ? 'ویرایش جلسه' : 'ثبت جلسه جدید'}
                    </h6>

                    <form onSubmit={handleSaveSession}>
                      {/* ۲. شماره جلسه */}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label small">۲. شماره جلسه: <span className="text-danger">*</span></label>
                          <input
                            type="number"
                            min="1"
                            className="form-control form-control-sm"
                            placeholder="مثال: 1"
                            value={sessionForm.sessionNumber}
                            onChange={(e) => setSessionForm({ ...sessionForm, sessionNumber: e.target.value })}
                            required
                          />
                        </div>

                        {/* ۶. وضعیت برگزاری جلسه */}
                       {/*  <div className="col-6">
                          <label className="form-label small">۶. وضعیت جلسه:</label>
                          <select
                            className="form-select form-select-sm"
                            value={sessionForm.status}
                            onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })}
                          >
                            <option value="scheduled">برنامه‌ریزی شده</option>
                            <option value="held">برگزار شده</option>
                            <option value="compensatory">جلسه جبرانی</option>
                            <option value="canceled">لغو شده</option>
                          </select>
                        </div> */}
                      </div>

                      {/* ۳. عنوان جلسه */}
                      <div className="mb-2">
                        <label className="form-label small">۳. عنوان جلسه: <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="مثال: آموزش هوک‌های useState و useEffect"
                          value={sessionForm.title}
                          onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })}
                          required
                        />
                      </div>

                      {/* ۴. تاریخ برگزاری جلسه */}
                      <div className="mb-2">
                        <label className="form-label small">۴. تاریخ برگزاری جلسه:</label>
                        <DatePicker
                          value={sessionForm.sessionDate}
                          onChange={(val) => setSessionForm({ ...sessionForm, sessionDate: val })}
                          calendar={persian}
                          locale={persian_fa}
                          calendarPosition="bottom-right"
                          inputClass="form-control form-control-sm w-100"
                          placeholder="انتخاب تاریخ جلسه..."
                        />
                      </div>

                      {/* ۵. ساعت شروع و پایان جلسه */}
                      <div className="row g-2 mb-2">
                        <div className="col-6">
                          <label className="form-label small">۵. ساعت شروع:</label>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={sessionForm.startTime}
                            onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label small">ساعت پایان:</label>
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={sessionForm.endTime}
                            onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* ۷. محتوا (دارد / ندارد) */}
                      <div className="mb-2">
                        <label className="form-label small">۷. محتوای آموزشی جلسه:</label>
                        <div className="d-flex gap-3 align-items-center pt-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="hasContentRadio"
                              id="contentYes"
                              checked={sessionForm.hasContent === 'دارد'}
                              onChange={() => setSessionForm({ ...sessionForm, hasContent: 'دارد' })}
                            />
                            <label className="form-check-label small" htmlFor="contentYes">
                              دارد (ویدیو / فایل)
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="hasContentRadio"
                              id="contentNo"
                              checked={sessionForm.hasContent === 'ندارد'}
                              onChange={() => setSessionForm({ ...sessionForm, hasContent: 'ندارد' })}
                            />
                            <label className="form-check-label small" htmlFor="contentNo">
                              ندارد
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* ۸. توضیحات */}
                      <div className="mb-3">
                        <label className="form-label small">۸. توضیحات جلسه:</label>
                        <textarea
                          rows="3"
                          className="form-control form-control-sm"
                          placeholder="سرفصل‌های ارائه‌شده، تکالیف مرتبط یا نکات جلسه..."
                          value={sessionForm.description}
                          onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                        />
                      </div>

                      {/* دکمه‌های فرم */}
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary btn-sm flex-fill">
                          {sessionForm.id ? 'ذخیره ویرایش جلسه' : 'ثبت جلسه جدید'}
                        </button>
                        {sessionForm.id && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setSessionForm({
                                ...initialSessionForm,
                                classId: selectedClassForSessions?.id || ''
                              })
                            }
                          >
                            انصراف
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                {/* ستون چپ: لیست جلسات ثبت شده با قابلیت ویرایش و حذف */}
                <div className="col-12 col-lg-7">
                  <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                    <span>جلسات ثبت‌شده برای این کلاس:</span>
                    <span className="badge bg-secondary-subtle text-secondary fw-normal">
                      {classSessions.filter((s) => s.classId === selectedClassForSessions?.id).length} جلسه
                    </span>
                  </h6>

                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '460px', overflowY: 'auto' }}>
                    {classSessions.filter((s) => s.classId === selectedClassForSessions?.id).length === 0 ? (
                      <div className="alert alert-secondary text-center small my-3">
                        هنوز هیچ جلسه‌ای برای این کلاس ثبت نشده است. از فرم روبرو برای ثبت جلسه اول استفاده کنید.
                      </div>
                    ) : (
                      classSessions
                        .filter((s) => s.classId === selectedClassForSessions?.id)
                        .sort((a, b) => (Number(a.sessionNumber) || 0) - (Number(b.sessionNumber) || 0))
                        .map((s) => {
                          const statusBadgeClass =
                            s.status === 'held'
                              ? 'bg-success-subtle text-success border border-success-subtle'
                              : s.status === 'scheduled'
                              ? 'bg-primary-subtle text-primary border border-primary-subtle'
                              : s.status === 'compensatory'
                              ? 'bg-warning-subtle text-warning border border-warning-subtle'
                              : 'bg-danger-subtle text-danger border border-danger-subtle';

                          const statusLabel =
                            s.status === 'held'
                              ? 'برگزار شده'
                              : s.status === 'scheduled'
                              ? 'برنامه‌ریزی شده'
                              : s.status === 'compensatory'
                              ? 'جلسه جبرانی'
                              : 'لغو شده';

                          return (
                            <div key={s.id} className="border rounded-3 p-3 bg-white shadow-sm">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex flex-column gap-1">
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <span className="badge bg-dark-subtle text-dark border">
                                      جلسه {s.sessionNumber}
                                    </span>
                                    <span className={`badge ${statusBadgeClass}`}>
                                      {statusLabel}
                                    </span>
                                    <span className={`badge ${s.hasContent === 'دارد' ? 'bg-info-subtle text-info border border-info-subtle' : 'bg-light text-muted border'}`}>
                                      {s.hasContent === 'دارد' ? 'دارای محتوا' : 'بدون محتوا'}
                                    </span>
                                  </div>
                                  <span className="fw-bold text-dark mt-1">{s.title}</span>
                                </div>

                                <div className="d-flex gap-1">
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm p-1"
                                    onClick={() => handleEditSession(s)}
                                    title="ویرایش جلسه"
                                  >
                                    <FiEdit size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm p-1"
                                    onClick={() => handleDeleteSession(s.id)}
                                    title="حذف جلسه"
                                  >
                                    <FiTrash2 size={15} />
                                  </button>
                                </div>
                              </div>

                              <div className="small text-muted d-flex align-items-center gap-3 mb-1 flex-wrap">
                                <span className="d-flex align-items-center gap-1">
                                  <FiCalendar size={14} />
                                  تاریخ: {s.sessionDate || 'تعیین نشده'}
                                </span>
                                <span className="d-flex align-items-center gap-1">
                                  <FiClock size={14} />
                                  ساعت: {s.startTime || '—'} الی {s.endTime || '—'}
                                </span>
                              </div>

                              {s.description && (
                                <p className="text-muted small mb-0 bg-light p-2 rounded border mt-2">
                                  {s.description}
                                </p>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}














      {/* مودال جزئیات کلاس */}
      {isDetailsModalOpen && selectedClass && (
        <div className="admin-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h5 className="admin-modal-title">جزئیات کلاس: {selectedClass.title}</h5>
              <button type="button" className="admin-modal-close-btn" onClick={() => setIsDetailsModalOpen(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="admin-modal-body p-4">
              <div className="row g-3">
                <div className="col-6"><span className="text-muted small d-block">کد کلاس:</span><strong>{selectedClass.code}</strong></div>
                <div className="col-6"><span className="text-muted small d-block">دوره آموزشی:</span><strong className="text-primary">{selectedClass.courseTitle}</strong></div>
                <div className="col-6"><span className="text-muted small d-block">مدرس:</span><strong>{selectedClass.teacherName}</strong></div>
                <div className="col-6"><span className="text-muted small d-block">نوع برگزاری:</span><strong>{selectedClass.type === 'online' ? 'آنلاین' : 'حضوری'}</strong></div>
                <div className="col-6"><span className="text-muted small d-block">روزها و ساعت:</span><strong>{selectedClass.heldDays} ({selectedClass.heldTime})</strong></div>
                <div className="col-6"><span className="text-muted small d-block">جلسات:</span><strong>{selectedClass.heldSessions} از {selectedClass.totalSessions}</strong></div>
                <div className="col-6"><span className="text-muted small d-block">شهریه:</span><strong className="text-success">{Number(selectedClass.tuition).toLocaleString('fa-IR')} تومان</strong></div>
                <div className="col-6"><span className="text-muted small d-block">هنرجویان:</span><strong>{selectedClass.enrolledCount} از {selectedClass.capacity} نفر</strong></div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" className="admin-btn-secondary" onClick={() => setIsDetailsModalOpen(false)}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

           {/* مودال ارسال پیام همگانی */}
      {isBroadcastModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsBroadcastModalOpen(false)}>
          <div 
            className="admin-modal-dialog bg-white shadow-lg rounded-4 overflow-hidden border-0" 
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* هدر مودال */}
            <div className="admin-modal-header bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: '#ecfdf5', color: '#10b981' }}
                >
                  <FiSend size={22} />
                </div>
                <div>
                  <h5 className="modal-title fw-bold text-dark mb-1" style={{ fontSize: '1.1rem' }}>
                    ارسال پیام همگانی
                  </h5>
                  <p className="text-muted small mb-0">اطلاع‌رسانی گروهی به کلیه دانشجویان و هنرجویان کلاس‌ها</p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn btn-light btn-sm rounded-circle p-2 text-muted border-0"
                onClick={() => setIsBroadcastModalOpen(false)}
              >
                <FiX size={18} />
              </button>
            </div>

            {/* بدنه فرم */}
            <form onSubmit={handleSendBroadcast}>
              <div className="admin-modal-body p-4 bg-white">
                
                {/* انتخاب نوع ارسال (کانال) */}
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary mb-2">
                    کانال اطلاع‌رسانی <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    <div className="col-6">
                      <label 
                        className="d-flex align-items-center gap-2 p-2 px-3 border rounded-3 cursor-pointer w-100 bg-light"
                        style={{ cursor: 'pointer' }}
                      >
                        <input 
                          type="radio" 
                          name="channel" 
                          value="sms" 
                          defaultChecked 
                          className="form-check-input mt-0"
                        />
                        <div className="small">
                          <span className="fw-bold d-block text-dark">پیامک (SMS)</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>ارسال به شماره موبایل</span>
                        </div>
                      </label>
                    </div>
                    <div className="col-6">
                      <label 
                        className="d-flex align-items-center gap-2 p-2 px-3 border rounded-3 cursor-pointer w-100 bg-light"
                        style={{ cursor: 'pointer' }}
                      >
                        <input 
                          type="radio" 
                          name="channel" 
                          value="notification" 
                          className="form-check-input mt-0"
                        />
                        <div className="small">
                          <span className="fw-bold d-block text-dark">نوتیفیکیشن پنل</span>
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>پیام درون سامانه‌ای</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* متن پیام */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label small fw-bold text-secondary mb-0">
                      متن پیام <span className="text-danger">*</span>
                    </label>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {broadcastMessage.length} کاراکتر
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    className="form-control bg-light border-1 p-3"
                    style={{ fontSize: '0.9rem', resize: 'none', borderRadius: '12px' }}
                    placeholder="متن پیام خود را با دقت وارد کنید (مثال: کلاس فوق‌العاده روز دوشنبه ساعت ۱۸ برگزار خواهد شد)..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  />
                </div>

                {/* یادداشت راهنما */}
                <div className="alert alert-warning-subtle border-0 rounded-3 p-2 px-3 d-flex align-items-center gap-2 mb-0">
                  <FiAlertCircle className="text-warning flex-shrink-0" size={18} />
                  <span className="small text-dark"
                    placeholder="متن پیام خود را با دقت وارد کنید (مثال: کلاس فوق‌العاده روز دوشنبه ساعت ۱۸ برگزار خواهد شد)..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  />
                </div>

                {/* یادداشت راهنما */}
                <div className="alert alert-warning-subtle border-0 rounded-3 p-2 px-3 d-flex align-items-center gap-2 mb-0">
                  <FiAlertCircle className="text-warning flex-shrink-0" size={18} />
                  <span className="small text-dark" style={{ fontSize: '0.78rem' }}>
                    این پیام برای تمامی دانشجویان کلاس‌های فعال ارسال خواهد شد.
                  </span>
                </div>

              </div>

              {/* فوتر مودال */}
              <div className="admin-modal-footer bg-light px-4 py-3 border-top d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3 rounded-3"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => setIsBroadcastModalOpen(false)}
                >
                  انصراف
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success px-4 rounded-3 d-flex align-items-center gap-2 fw-semibold"
                  style={{ fontSize: '0.875rem' }}
                >
                  <FiSend size={16} />
                  <span>ارسال فوری پیام</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminClasses;
