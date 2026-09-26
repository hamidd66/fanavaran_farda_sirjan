/* ============================================================
   AttendancePanel.jsx
   مدیریت حضور و غیاب
   ============================================================ */

import React, { useMemo, useState } from 'react';
import '../style/AdminGrade.css';

import {
  FiArrowLeft,
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiEye,
  FiPlayCircle,
  FiRefreshCw,
  FiSearch,
  FiUserCheck,
  FiUserMinus,
  FiUserPlus,
  FiUsers,
  FiX,FiInfo,FiBookOpen,FiUser,FiLayers,FiUserX,FiUnlock,
  FiBarChart2,
  FiAlertCircle,
} from 'react-icons/fi';

/* ---------- دادهٔ نمونه کلاس‌ها ---------- */

const initialClassesData = [
  {
    id: 'FE-201',
    title: 'فرانت‌اند — React پیشرفته',
    course: 'Front-End',
    teacher: 'علی رضایی',
    capacity: 15,
    semester: 'تابستان ۱۴۰۴',
    status: 'ongoing',
    attFinalized: false,
    sessionsHeld: 12,
    totalSessions: 24,
    startDate: '۱۴۰۴/۰۱/۱۵',
    totalAbsences: 3,

    students: [
      {
        id: 1,
        name: 'محمد احمدی',
        code: '1234567890',
        status: 'present',
        absent: 0,
        late: 0,
        percent: 100,
        lateMinutes: 0,
        reason: '',attendance: {
    1: 'present',
    2: 'absent',
    3: 'late',
    4: 'present'
  }
      },
      {
        id: 2,
        name: 'سارا موسوی',
        code: '2468135790',
        status: 'absent',
        absent: 3,
        late: 1,
        percent: 72,
        lateMinutes: 0,
        reason: 'بیماری',attendance: {
    1: 'present',
    2: 'absent',
    3: 'late',
    4: 'present'
  }
      },
      {
        id: 3,
        name: 'نیما جعفری',
        code: '1357913579',
        status: 'late',
        absent: 0,
        late: 2,
        percent: 90,
        lateMinutes: 15,
        reason: 'ترافیک',attendance: {
    1: 'present',
    2: 'absent',
    3: 'late',
    4: 'present'
  }
      },
    ],
  },

  {
    id: 'PY-102',
    title: 'پایتون — مقدماتی',
    course: 'Back-End',
    teacher: 'مریم حسینی',
    capacity: 12,
    semester: 'پاییز ۱۴۰۴',
    status: 'ongoing',
    attFinalized: true,
    sessionsHeld: 12,
    totalSessions: 24,
    startDate: '۱۴۰۴/۰۱/۱۵',
    totalAbsences: 1,

    students: [
      {
        id: 1,
        name: 'رضا محمدی',
        code: '1122334455',
        status: 'present',
        absent: 0,
        late: 0,
        percent: 100,
        lateMinutes: 0,
        reason: '',
      },
      {
        id: 2,
        name: 'نگار احمدی',
        code: '5566778899',
        status: 'present',
        absent: 1,
        late: 0,
        percent: 92,
        lateMinutes: 0,
        reason: '',
      },
    ],
  },

  {
    id: 'AI-101',
    title: 'هوش مصنوعی — مبانی',
    course: 'AI',
    teacher: 'پدرام صادقی',
    capacity: 10,
    semester: 'تابستان ۱۴۰۴',
    status: 'ongoing',
    attFinalized: false,
    sessionsHeld: 12,
    totalSessions: 24,
    startDate: '۱۴۰۴/۰۱/۱۵',
    totalAbsences: 4,

    students: [
      {
        id: 1,
        name: 'حسین قاسمی',
        code: '9988776655',
        status: 'absent',
        absent: 4,
        late: 0,
        percent: 58,
        lateMinutes: 0,
        reason: 'عدم حضور',
      },
    ],
  },

  {
    id: 'NET-301',
    title: 'برنامه‌نویسی C# — .NET',
    course: 'Back-End',
    teacher: 'الهام نوری',
    capacity: 8,
    semester: 'پاییز ۱۴۰۴',
    status: 'ongoing',
    attFinalized: false,
    sessionsHeld: 12,
    totalSessions: 24,
    startDate: '۱۴۰۴/۰۱/۱۵',
    totalAbsences: 0,
    students: [],
  },
];




const ATTENDANCE_STATUSES = ['present', 'absent', 'late'];

const normalizeAttendance = (attendance) => {
  if (!attendance || typeof attendance !== 'object') {
    return {};
  }

  return Object.entries(attendance).reduce(
    (result, [sessionNumber, status]) => {
      const numericSessionNumber = Number(sessionNumber);

      if (
        Number.isInteger(numericSessionNumber) &&
        numericSessionNumber > 0 &&
        ATTENDANCE_STATUSES.includes(status)
      ) {
        result[numericSessionNumber] = status;
      }

      return result;
    },
    {}
  );
};

const getClassAttendanceAnalytics = (classItem) => {
  const students = Array.isArray(classItem?.students)
    ? classItem.students
    : [];

  const sessionsHeld = Math.max(
    0,
    Number(classItem?.sessionsHeld) || 0
  );

  const totalSessions = Math.max(
    0,
    Number(classItem?.totalSessions) || 0
  );

  const sessionStats = Array.from(
    { length: sessionsHeld },
    (_, index) => {
      const sessionNumber = index + 1;

      const statuses = students
        .map((student) => {
          return student.attendance?.[sessionNumber];
        })
        .filter((status) => ATTENDANCE_STATUSES.includes(status));

      const present = statuses.filter(
        (status) => status === 'present'
      ).length;

      const absent = statuses.filter(
        (status) => status === 'absent'
      ).length;

      const late = statuses.filter(
        (status) => status === 'late'
      ).length;

      return {
        sessionNumber,
        statuses,
        present,
        absent,
        late,
        recorded: statuses.length,
        hasAbsence: absent > 0,
      };
    }
  );

  const allStatuses = sessionStats.reduce(
    (result, session) => {
      return result.concat(session.statuses);
    },
    []
  );

  const hasSessionRecords = allStatuses.length > 0;

  const totalPresent = allStatuses.filter(
    (status) => status === 'present'
  ).length;

  const totalAbsencesFromSessions = allStatuses.filter(
    (status) => status === 'absent'
  ).length;

  const totalLate = allStatuses.filter(
    (status) => status === 'late'
  ).length;

  const recordedSessions = sessionStats.filter(
    (session) => session.recorded > 0
  ).length;

  const sessionsWithAbsence = hasSessionRecords
    ? sessionStats.filter((session) => session.hasAbsence).length
    : null;

  const expectedRecords = students.length * sessionsHeld;

  const missingRecords = Math.max(
    0,
    expectedRecords - allStatuses.length
  );

  const attendanceRate = hasSessionRecords
    ? Math.round(
        ((totalPresent + totalLate * 0.5) / allStatuses.length) * 100
      )
    : null;

  /*
   * اگر برای کلاس هنوز attendance جلسه‌ای ثبت نشده باشد،
   * از مقدار قدیمی totalAbsences استفاده می‌کنیم؛
   * اما تعداد جلساتی که غیبت داشته‌اند قابل تشخیص نیست.
   */
  const totalAbsences = hasSessionRecords
    ? totalAbsencesFromSessions
    : Number(classItem?.totalAbsences) || 0;

  const currentPresent = students.filter(
    (student) => student.status === 'present'
  ).length;

  const currentAbsent = students.filter(
    (student) => student.status === 'absent'
  ).length;

  const currentLate = students.filter(
    (student) => student.status === 'late'
  ).length;

  return {
    sessionsHeld,
    totalSessions,
    recordedSessions,
    sessionsWithAbsence,
    totalPresent,
    totalAbsences,
    totalLate,
    attendanceRate,
    expectedRecords,
    recordedRecords: allStatuses.length,
    missingRecords,
    hasSessionRecords,
    currentPresent,
    currentAbsent,
    currentLate,
    sessionStats,
  };
};












/* ---------- ابزارهای کمکی ---------- */

const normalizeClass = (classItem) => ({
  ...classItem,

  sessionsHeld: Number(classItem.sessionsHeld ?? 0),

  totalSessions: Number(classItem.totalSessions ?? 24),

  startDate: classItem.startDate || 'ثبت نشده',

  totalAbsences: Number(classItem.totalAbsences ?? 0),

  students: Array.isArray(classItem.students)
    ? classItem.students.map((student) => ({
        ...student,

        status: student.status || 'present',

        absent: Number(student.absent ?? 0),

        late: Number(student.late ?? 0),

        percent: Number(student.percent ?? 100),

        lateMinutes: Number(student.lateMinutes ?? 0),

        reason: student.reason || '',

        /*
         * رکوردهای هر جلسه:
         * {
         *   1: 'present',
         *   2: 'absent',
         *   3: 'late'
         * }
         */
        attendance: normalizeAttendance(student.attendance),
      }))
    : [],
});

const getAttendanceRate = (classItem) => {
  const students = classItem.students || [];

  if (students.length === 0) {
    return 0;
  }

  const totalRate = students.reduce((sum, student) => {
    if (student.status === 'present') {
      return sum + 100;
    }

    if (student.status === 'late') {
      return sum + 50;
    }

    return sum;
  }, 0);

  return Math.round(totalRate / students.length);
};

const AttendancePanel = () => {
  /* ---------- stateهای صفحه ---------- */

  const [classes, setClasses] = useState(
    initialClassesData.map(normalizeClass)
  );

  const [selectedClassId, setSelectedClassId] = useState(null);
  const [analyticsClassId, setAnalyticsClassId] = useState(null);
  const [reviewClassId, setReviewClassId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  const [selectedSession, setSelectedSession] = useState(1); // جلسه پیش‌فرض ۱
const [isFinalized, setIsFinalized] = useState(false); // وضعیت قفل (بعداً با داده دیتابیس همگام می‌شود)


  /*
   * نام state کاملاً مشخص است و در تمام JSX همین نام استفاده می‌شود.
   * این state نباید داخل renderClassDetail دوباره تعریف شود.
   */
  const [attendanceSessionNumber, setAttendanceSessionNumber] = useState('1');
  const [attendanceSessionDate, setAttendanceSessionDate] = useState(
    '۱۴۰۴/۰۵/۱۵'
  );

  /* ---------- کلاس انتخاب‌شده ---------- */

  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) || null,
    [classes, selectedClassId]
  );

  const analyticsClass = useMemo(
    () => classes.find((item) => item.id === analyticsClassId) || null,
    [classes, analyticsClassId]
  );

  const reviewClass = useMemo(
    () => classes.find((item) => item.id === reviewClassId) || null,
    [classes, reviewClassId]
  );

  const analyticsStats = useMemo(() => {
  if (!analyticsClass) {
    return null;
  }

  return getClassAttendanceAnalytics(analyticsClass);
}, [analyticsClass]);





  const reviewStats = useMemo(() => {
    if (!reviewClass) return null;
    return getClassAttendanceAnalytics(reviewClass);
  }, [reviewClass]);






  /* ---------- فیلتر کلاس‌ها ---------- */

  const filteredClasses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return classes.filter((classItem) => {
      const matchesSearch =
        query === '' ||
        classItem.title.toLowerCase().includes(query) ||
        classItem.id.toLowerCase().includes(query) ||
        classItem.teacher.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && classItem.status === 'ongoing') ||
        (statusFilter === 'inactive' && classItem.status !== 'ongoing');

      const matchesCourse =
        courseFilter === 'all' || classItem.course === courseFilter;

      const isFull =
        classItem.students.length >= Number(classItem.capacity || 0);

      const matchesCapacity =
        capacityFilter === 'all' ||
        (capacityFilter === 'full' && isFull) ||
        (capacityFilter === 'free' && !isFull);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse &&
        matchesCapacity
      );
    });
  }, [
    classes,
    searchQuery,
    statusFilter,
    courseFilter,
    capacityFilter,
  ]);

  /* ---------- آمار کلی ---------- */

  const totalClasses = classes.length;

  const totalStudents = classes.reduce(
    (sum, classItem) => sum + classItem.students.length,
    0
  );

  const activeClasses = classes.filter(
    (classItem) => classItem.status === 'ongoing'
  ).length;

  const totalAbsent = classes.reduce(
    (sum, classItem) =>
      sum +
      classItem.students.filter(
        (student) => student.status === 'absent'
      ).length,
    0
  );

  const totalLate = classes.reduce(
    (sum, classItem) =>
      sum +
      classItem.students.filter(
        (student) => student.status === 'late'
      ).length,
    0
  );

  const overallAttendanceRate =
    totalStudents === 0
      ? 0
      : Math.round(
          classes.reduce(
            (sum, classItem) =>
              sum + getAttendanceRate(classItem) * classItem.students.length,
            0
          ) / totalStudents
        );

  /* ---------- به‌روزرسانی اطلاعات هنرجو ---------- */

  const updateStudent = (classId, studentId, changes) => {
    setClasses((previousClasses) =>
      previousClasses.map((classItem) => {
        if (classItem.id !== classId) {
          return classItem;
        }

        return {
          ...classItem,
          students: classItem.students.map((student) =>
            student.id === studentId
              ? { ...student, ...changes }
              : student
          ),
        };
      })
    );
  };

  /* ---------- تغییر وضعیت حضور ---------- */

  const handleStatusChange = (
  classItem,
  student,
  newStatus
) => {
  if (classItem.attFinalized) {
    return;
  }

  const currentAttendance = normalizeAttendance(
    student.attendance
  );

  const updatedAttendance = {
    ...currentAttendance,
    [selectedSession]: newStatus,
  };

  const attendanceValues = Object.values(
    updatedAttendance
  ).filter((status) =>
    ATTENDANCE_STATUSES.includes(status)
  );

  const absentCount = attendanceValues.filter(
    (status) => status === 'absent'
  ).length;

  const lateCount = attendanceValues.filter(
    (status) => status === 'late'
  ).length;

  const percent =
    attendanceValues.length === 0
      ? 0
      : Math.round(
          (
            (
              attendanceValues.filter(
                (status) => status === 'present'
              ).length +
              lateCount * 0.5
            ) /
            attendanceValues.length
          ) *
            100
        );

  updateStudent(classItem.id, student.id, {
    status: newStatus,

    attendance: updatedAttendance,

    absent: absentCount,

    late: lateCount,

    percent,

    lateMinutes:
      newStatus === 'late'
        ? Number(student.lateMinutes || 0)
        : 0,
  });
};


  /* ---------- تغییر دقیقهٔ تأخیر ---------- */

const handleLateMinutes = (classItem, studentId, value) => {
  if (classItem.attFinalized) {
    return;
  }

  const safeValue = Math.max(0, Number(value) || 0);

  updateStudent(classItem.id, studentId, {
    lateMinutes: safeValue,
  });
};


  /* ---------- تغییر دلیل ---------- */

  const handleReason = (classItem, studentId, value) => {
    if (classItem.attFinalized) {
      return;
    }

    updateStudent(classItem.id, studentId, {
      reason: value,
    });
  };

  /* ---------- قفل یا بازکردن جلسه ---------- */

  const toggleFinalize = (classItem) => {
    setClasses((previousClasses) =>
      previousClasses.map((item) =>
        item.id === classItem.id
          ? { ...item, attFinalized: !item.attFinalized }
          : item
      )
    );
  };

  /* ---------- پاک‌سازی فیلترها ---------- */

  const handleResetFilters = () => {
  setSearchQuery('');
  setStatusFilter('all');
  setCourseFilter('all');
  setCapacityFilter('all');
};


  /* ---------- کلاس انتخاب‌شده را باز کن ---------- */

  const openClassDetail = (classItem) => {
    setSelectedClassId(classItem.id);
    setAttendanceSessionNumber('1');
    setAttendanceSessionDate('۱۴۰۴/۰۵/۱۵');
  };

  /* ---------- وضعیت کلاس ---------- */

  const getStatusText = (status) => {
    return status === 'ongoing' ? 'در حال برگزاری' : 'غیرفعال';
  };

  const getStatusBadgeClass = (status) => {
    return status === 'ongoing'
      ? 'admin-status-pill badge-success'
      : 'admin-status-pill badge-warning';
  };

  /* ---------- رنگ نرخ حضور ---------- */

  const getRateColor = (rate) => {
    if (rate >= 80) {
      return '#16a34a';
    }

    if (rate >= 60) {
      return '#d97706';
    }

    return '#dc2626';
  };

  /* ---------- نمای جزئیات کلاس ---------- */

  const renderClassDetail = (classItem) => {
    const isFinalized = Boolean(classItem.attFinalized);
    const totalSessions = Math.max(
      1,
      Number(classItem.totalSessions || 24)
    );

    return (
      <div
        className="admin-page-container"
        dir="rtl"
        style={{ padding: '16px' }}
      >
        {/* هدر */}
        <header className="admin-page-header d-flex justify-content-between align-items-center flex-wrap gap-3 w-100 mb-4">
          <div className="d-flex align-items-center gap-3 text-end">
            <div
              className="admin-page-header-icon d-flex align-items-center justify-content-center"
              style={{ flexShrink: 0 }}
            >
              <FiUserPlus size={26} />
            </div>

            <div className="admin-page-header-info d-flex flex-column text-end">
              <h1 className="admin-page-title m-0">
                حضور و غیاب — {classItem.title}
              </h1>

              <p className="admin-page-subtitle m-0 mt-1">
                ثبت، بررسی و نهایی‌سازی وضعیت حضور و غیاب هنرجویان
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-danger d-flex align-items-center gap-2"
            onClick={() => setSelectedClassId(null)}
            style={{
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: '600',
            }}
          >
            <FiArrowLeft size={18} />
            بازگشت
          </button>
        </header>

        {/* کارت مشخصات کلاس */}
        <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
  <div className="card-header bg-white border-0 pt-3 pb-0">
    <h6 className="text-muted d-flex align-items-center gap-2 m-0">
      <FiInfo className="text-primary" /> جزئیات و وضعیت دوره
    </h6>
  </div>
  <div className="card-body">
    <div className="row g-3">
      {/* ردیف اول: اطلاعات اصلی */}
      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-primary-subtle text-primary h-100 border border-primary-subtle">
          <FiBookOpen size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">نام کلاس</small>
          <strong className="d-block">{classItem.title}</strong>
        </div>
      </div>

      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-info-subtle text-info h-100 border border-info-subtle">
          <FiUser size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">استاد</small>
          <strong className="d-block">{classItem.teacher}</strong>
        </div>
      </div>

      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-secondary-subtle text-secondary h-100 border border-secondary-subtle">
          <FiCalendar size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">تاریخ شروع</small>
          <strong className="d-block">{classItem.startDate}</strong>
        </div>
      </div>

      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-success-subtle text-success h-100 border border-success-subtle">
          <FiLayers size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">جلسات</small>
          <strong className="d-block">{classItem.sessionsHeld} / {totalSessions}</strong>
        </div>
      </div>

      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-danger-subtle text-danger h-100 border border-danger-subtle">
          <FiUserX size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">غیبت‌ها</small>
          <strong className="d-block">{classItem.totalAbsences}</strong>
        </div>
      </div>

      <div className="col-lg-2 col-md-4 col-6">
        <div className="p-3 rounded-3 bg-warning-subtle text-warning-emphasis h-100 border border-warning-subtle">
          <FiUsers size={20} className="mb-2" />
          <small className="d-block small fw-bold text-uppercase">ظرفیت</small>
          <strong className="d-block">{classItem.students.length} / {classItem.capacity}</strong>
        </div>
      </div>
    </div>
  </div>
</div>


        {/* انتخاب جلسه */}
   {/* نوار انتخاب جلسه - ساختار لیستی مدرن */}
<div className="card shadow-sm border-0 mb-4 rounded-4 bg-white">
  <div className="card-body p-3">
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3 border-bottom pb-2">
      <div className="d-flex align-items-center gap-2">
        <span className="badge bg-primary-subtle text-primary p-2 rounded-3">
          <FiCalendar size={18} />
        </span>
        <div>
          <h6 className="mb-0 fw-bold text-dark">انتخاب شماره جلسه</h6>
          <small className="text-muted">جلسه مورد نظر را جهت ثبت و مشاهده وضعیت انتخاب کنید</small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
          جلسه فعلی: جلسه {selectedSession}
        </span>
      </div>
    </div>

    {/* لیست افقی و ریسپانسیو جلسات */}
    <div 
      className="d-flex align-items-center gap-2 overflow-x-auto pb-2 pt-1" 
      style={{ scrollbarWidth: 'thin', whiteSpace: 'nowrap' }}
    >
      {Array.from({ length: totalSessions || 10 }, (_, i) => {
        const sessionNum = i + 1;
        const isSelected = selectedSession === sessionNum;
        const isHeld = sessionNum <= (classItem.sessionsHeld || 0);

        return (
          <button
            key={sessionNum}
            type="button"
            onClick={() => setSelectedSession(sessionNum)}
            className={`btn d-flex flex-column align-items-center justify-content-center px-3 py-2 rounded-3 transition-all ${
              isSelected
                ? 'btn-primary shadow text-white'
                : isHeld
                ? 'btn-light border text-dark bg-white'
                : 'btn-light border border-dashed text-muted opacity-75'
            }`}
            style={{
              minWidth: '95px',
              borderWidth: isSelected ? '1px' : '1px',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
          >
            <span className="small fw-semibold" style={{ fontSize: '0.75rem' }}>
              {isHeld ? 'برگزار شده' : 'پیش‌رو'}
            </span>
            <span className="fw-bold fs-6 my-1">
              جلسه {sessionNum}
            </span>
            <span 
              className={`badge rounded-pill ${
                isSelected 
                  ? 'bg-white text-primary' 
                  : isHeld 
                  ? 'bg-success-subtle text-success' 
                  : 'bg-secondary-subtle text-secondary'
              }`} 
              style={{ fontSize: '0.65rem' }}
            >
              {isSelected ? 'انتخاب شده' : isHeld ? 'ثبت شده' : 'خام'}
            </span>
          </button>
        );
      })}
    </div>
  </div>
</div>






       




        {/* جدول هنرجویان */}
        <div
          className="admin-table-container"
          style={{
            overflowX: 'auto',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #edf2f7',
            boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
          }}
        >
          {classItem.students.length === 0 ? (
            <div
              className="admin-table-empty"
              style={{
                textAlign: 'center',
                padding: '30px',
              }}
            >
              هنرجویی برای این کلاس ثبت نشده است.
            </div>
          ) : (
            <table
              className="table admin-table text-center align-middle"
              style={{ minWidth: '850px' }}
            >
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>#</th>
                  <th>نام هنرجو</th>
                  <th>کد ملی</th>
                  <th>وضعیت حضور</th>
                  <th>تأخیر، دقیقه</th>
                  <th>دلیل غیبت/تأخیر</th>
                  <th>نرخ حضور</th>
                </tr>
              </thead>

              <tbody>
                {classItem.students.map((student, index) => {
                  const studentRate = Number(student.percent || 0);
                  const rateColor = getRateColor(studentRate);

                  return (
                    <tr key={student.id}>
                      <td>{index + 1}</td>

                      <td style={{ fontWeight: 700 }}>
                        {student.name}
                      </td>

                      <td>{student.code || '—'}</td>

                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={student.status}
                          disabled={isFinalized}
                          onChange={(event) =>
                            handleStatusChange(
                              classItem,
                              student,
                              event.target.value
                            )
                          }
                        >
                          <option value="present">حاضر</option>
                          <option value="late">تأخیر</option>
                          <option value="absent">غایب</option>
                        </select>
                      </td>

                      <td>
                        <input
                          type="number"
                          min="0"
                          className="form-control form-control-sm"
                          value={student.lateMinutes}
                          disabled={
                            isFinalized ||
                            student.status !== 'late'
                          }
                          onChange={(event) =>
                            handleLateMinutes(
                              classItem,
                              student.id,
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={student.reason}
                          disabled={isFinalized}
                          placeholder="دلیل..."
                          onChange={(event) =>
                            handleReason(
                              classItem,
                              student.id,
                              event.target.value
                            )
                          }
                        />
                      </td>

                      <td style={{ minWidth: '130px' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                          }}
                        >
                          <strong style={{ color: rateColor }}>
                            {studentRate}٪
                          </strong>

                          <div
                            style={{
                              height: '6px',
                              background: '#e2e8f0',
                              borderRadius: '999px',
                              overflow: 'hidden',
                              direction: 'ltr',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(0, studentRate)
                                )}%`,
                                height: '100%',
                                background: rateColor,
                                borderRadius: '999px',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>





          )}

          {/* فوتر کنترل‌گر - ثبت و نهایی‌سازی */}
<div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
  <div className="text-muted small">
    {isFinalized ? (
       <span className="text-danger fw-bold"><FiLock /> وضعیت: قفل شده (ثبت نهایی)</span>
    ) : (
       <span className="text-success"><FiUnlock /> وضعیت: در حال ویرایش</span>
    )}
  </div>
  
  <div className="d-flex gap-2">
    <button 
      className="btn btn-outline-primary px-4" 
      disabled={isFinalized}
      onClick={() => alert('تغییرات موقت ذخیره شد!')}
    >
      ثبت موقت جلسه {selectedSession}
    </button>

    <button 
      className={`btn ${isFinalized ? 'btn-secondary' : 'btn-danger'} px-4`}
      onClick={() => setIsFinalized(!isFinalized)}
    >
      {isFinalized ? (
        <><FiRefreshCw className="me-2" /> بازگشایی جهت ویرایش</>
      ) : (
        <><FiCheckCircle className="me-2" /> ثبت و قفل نهایی کلاس</>
      )}
    </button>
  </div>
</div>

        </div>
      </div>
    );
  };

  /* ---------- پاک‌سازی فیلترها ---------- */

  if (selectedClass) {
    return renderClassDetail(selectedClass);
  }

  return (
    <div
      className="admin-page-container"
      dir="rtl"
      style={{ padding: '16px' }}
    >
      {/* هدر صفحه */}
      <header className="admin-page-header d-flex justify-content-between align-items-center flex-wrap gap-3 w-100 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="admin-page-header-icon d-flex align-items-center justify-content-center"
            style={{ flexShrink: 0 }}
          >
            <FiUserPlus size={26} />
          </div>

          <div className="admin-page-header-info">
            <h1 className="admin-page-title m-0">
              حضور و غیاب
            </h1>

            <p className="admin-page-subtitle m-0 mt-1">
              ثبت، بررسی و نهایی‌سازی وضعیت حضور و غیاب هنرجویان
            </p>
          </div>
        </div>
      </header>

      {/* کارت‌های آماری */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card blue">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="admin-stat-label">
              کل کلاس‌ها
            </span>
            <span className="admin-stat-icon-wrapper">
              <FiPlayCircle />
            </span>
            <span className="admin-stat-value">
              {totalClasses}
            </span>
          </div>
        </div>

        <div className="admin-stat-card green">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="admin-stat-label">
              کلاس‌های فعال
            </span>
            <span className="admin-stat-icon-wrapper">
              <FiCheckCircle />
            </span>
            <span className="admin-stat-value">
              {activeClasses}
            </span>
          </div>
        </div>

        <div className="admin-stat-card amber">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="admin-stat-label">
              نرخ حضور کلی
            </span>
            <span className="admin-stat-icon-wrapper">
              <FiAward />
            </span>
            <span className="admin-stat-value">
              {overallAttendanceRate}٪
            </span>
          </div>
        </div>

        <div className="admin-stat-card red">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="admin-stat-label">
              غایب / تأخیر
            </span>
            <span className="admin-stat-icon-wrapper">
              <FiUserMinus />
            </span>
            <span className="admin-stat-value">
              {totalAbsent + totalLate}
            </span>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="admin-filters-bar admin-filters-with-reset">
        <div
          className="admin-search-box"
          style={{
            flex: '1 1 auto',
            minWidth: '220px',
          }}
        >
          <span className="admin-search-icon">
            <FiSearch />
          </span>

          <input
            type="text"
            placeholder="جستجوی نام کلاس، کد یا استاد..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
          />
        </div>

        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">وضعیت کلاس: همه</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>

        <select
          className="admin-filter-select"
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(event.target.value)
          }
        >
          <option value="all">رشته: همه</option>
          <option value="Front-End">فرانت‌اند</option>
          <option value="Back-End">بک‌اند</option>
          <option value="AI">هوش مصنوعی</option>
        </select>

        <select
          className="admin-filter-select"
          value={capacityFilter}
          onChange={(event) =>
            setCapacityFilter(event.target.value)
          }
        >
          <option value="all">ظرفیت: همه</option>
          <option value="full">تکمیل</option>
          <option value="free">جاهای خالی</option>
        </select>

        {(searchQuery ||
          statusFilter !== 'all' ||
          courseFilter !== 'all' ||
          capacityFilter !== 'all') && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={handleResetFilters}
          >
            <FiRefreshCw />
            پاک‌سازی فیلترها
          </button>
        )}
      </div>

      {/* جدول کلاس‌ها */}
      <div
        className="admin-table-container"
        style={{
          overflowX: 'auto',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #edf2f7',
          boxShadow: '0 4px 18px rgba(0,0,0,0.02)',
        }}
      >
        <table
          className="admin-table"
          style={{
            width: '100%',
            minWidth: '1050px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: '50px', textAlign: 'center' }}>
                #
              </th>
              <th>نام کلاس</th>
              <th>دوره</th>
              <th>استاد</th>
              <th style={{ textAlign: 'center' }}>جلسات</th>
              <th>ترم</th>
              <th style={{ textAlign: 'center' }}>
                وضعیت کلاس
              </th>
              <th style={{ textAlign: 'center' }}>
                درصد حضور
              </th>
              <th style={{ textAlign: 'center' }}>
                عملیات
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredClasses.map((classItem, index) => {
              const attendanceRate = getAttendanceRate(classItem);
              const rateColor = getRateColor(attendanceRate);

              return (
                <tr
                  key={classItem.id}
                  style={{
                    background:
                      index % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <td style={{ textAlign: 'center' }}>
                    {index + 1}
                  </td>

                  <td>
                    <strong>
                      {classItem.title}
                    </strong>

                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                      }}
                    >
                      {classItem.id}
                    </div>
                  </td>

                  <td>{classItem.course}</td>

                  <td>{classItem.teacher}</td>

                  <td style={{ textAlign: 'center' }}>
                    <strong>
                      {classItem.sessionsHeld}
                    </strong>
                    <span style={{ color: '#94a3b8' }}>
                      {' '}
                      / {classItem.totalSessions}
                    </span>
                  </td>

                  <td>{classItem.semester}</td>

                  <td style={{ textAlign: 'center' }}>
                    <span
                      className={getStatusBadgeClass(
                        classItem.status
                      )}
                    >
                      {getStatusText(classItem.status)}
                    </span>
                  </td>

                  <td style={{ minWidth: '140px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      <strong style={{ color: rateColor }}>
                        {attendanceRate}٪
                      </strong>

                      <div
                        style={{
                          height: '6px',
                          background: '#e2e8f0',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          direction: 'ltr',
                        }}
                      >
                        <div
                          style={{
                            width: `${attendanceRate}%`,
                            height: '100%',
                            background: rateColor,
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="admin-btn admin-btn-sm admin-btn-primary d-inline-flex align-items-center gap-2"
                        onClick={() => openClassDetail(classItem)}
                        style={{
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontWeight: '600',
                        }}
                      >
                        <FiEye size={15} />
                        ثبت حضور
                      </button>

                      <button
                        type="button"
                        title="آمار حضور"
                        onClick={() =>
                          setAnalyticsClassId(classItem.id)
                        }
                        style={{
                          width: '34px',
                          height: '34px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f0f9ff',
                          color: '#0369a1',
                          border: '1px solid #bae6fd',
                          borderRadius: '8px',
                        }}
                      >
                        <FiAward size={15} />
                      </button>

                      <button
                        type="button"
                        title="بازبینی حضور و غیاب"
                        onClick={() =>
                          setReviewClassId(classItem.id)
                        }
                        style={{
                          width: '34px',
                          height: '34px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f0fdf4',
                          color: '#15803d',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                        }}
                      >
                        <FiClipboard size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredClasses.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="admin-table-empty"
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                  }}
                >
                  هیچ کلاسی مطابق فیلترها پیدا نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>











     {analyticsClass && analyticsStats && (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="attendance-analytics-title"
    dir="rtl"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1050,
      background: 'rgba(15, 23, 42, 0.58)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      overflowY: 'auto',
    }}
  >
    <div
      style={{
        width: '100%',
        maxWidth: '760px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#f8fafc',
        borderRadius: '24px',
        boxShadow: '0 30px 80px rgba(15, 23, 42, 0.28)',
        border: '1px solid rgba(255,255,255,.8)',
      }}
    >
      {/* هدر مودال */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '24px',
          color: '#fff',
          background:
            'linear-gradient(135deg, #1d4ed8 0%, #2563eb 48%, #0ea5e9 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.12)',
            top: '-90px',
            left: '-40px',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                marginBottom: '12px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,.16)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <FiBarChart2 size={16} />
              گزارش آماری کلاس
            </div>

            <h3
              id="attendance-analytics-title"
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 800,
              }}
            >
              تحلیل حضور و غیاب
            </h3>

            <p
              style={{
                margin: '8px 0 0',
                color: 'rgba(255,255,255,.86)',
                fontSize: '0.88rem',
              }}
            >
              {analyticsClass.title} — استاد{' '}
              {analyticsClass.teacher}
            </p>
          </div>

          <button
            type="button"
            aria-label="بستن پنجره تحلیل"
            onClick={() => setAnalyticsClassId(null)}
            style={{
              width: '38px',
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,.35)',
              borderRadius: '12px',
              background: 'rgba(255,255,255,.14)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <FiX size={21} />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* کارت نرخ حضور */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1fr) minmax(180px, 240px)',
            gap: '16px',
            alignItems: 'center',
            padding: '18px',
            marginBottom: '16px',
            borderRadius: '18px',
            background: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 24px rgba(15,23,42,.05)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  color: '#475569',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                نرخ حضور ثبت‌شده
              </span>

              <strong
                style={{
                  color:
                    analyticsStats.attendanceRate === null
                      ? '#94a3b8'
                      : analyticsStats.attendanceRate >= 80
                        ? '#15803d'
                        : analyticsStats.attendanceRate >= 60
                          ? '#b45309'
                          : '#dc2626',
                  fontSize: '1.4rem',
                }}
              >
                {analyticsStats.attendanceRate === null
                  ? '—'
                  : `${analyticsStats.attendanceRate}٪`}
              </strong>
            </div>

            <div
              style={{
                height: '12px',
                overflow: 'hidden',
                borderRadius: '999px',
                background: '#e2e8f0',
              }}
            >
              <div
                style={{
                  width: `${analyticsStats.attendanceRate || 0}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background:
                    analyticsStats.attendanceRate === null
                      ? '#cbd5e1'
                      : analyticsStats.attendanceRate >= 80
                        ? 'linear-gradient(90deg, #16a34a, #4ade80)'
                        : analyticsStats.attendanceRate >= 60
                          ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                          : 'linear-gradient(90deg, #dc2626, #fb7185)',
                  transition: 'width .35s ease',
                }}
              />
            </div>

            <small
              style={{
                display: 'block',
                marginTop: '9px',
                color: '#64748b',
                lineHeight: 1.8,
              }}
            >
              این نرخ بر اساس رکوردهای ثبت‌شده برای جلسات محاسبه شده است.
            </small>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '110px',
              borderRadius: '16px',
              background: '#eff6ff',
              color: '#1d4ed8',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <FiCalendar size={28} />
              <div
                style={{
                  marginTop: '7px',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                }}
              >
                {analyticsStats.sessionsHeld}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                جلسه برگزارشده
              </div>
            </div>
          </div>
        </div>

        {/* کارت‌های آماری */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(145px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#ecfdf5',
              border: '1px solid #bbf7d0',
            }}
          >
            <FiCheckCircle
              size={22}
              color="#15803d"
            />
            <div
              style={{
                marginTop: '10px',
                color: '#166534',
                fontSize: '1.45rem',
                fontWeight: 800,
              }}
            >
              {analyticsStats.totalPresent}
            </div>
            <div
              style={{
                marginTop: '3px',
                color: '#166534',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              مجموع حضور
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
            }}
          >
            <FiUserMinus
              size={22}
              color="#dc2626"
            />
            <div
              style={{
                marginTop: '10px',
                color: '#b91c1c',
                fontSize: '1.45rem',
                fontWeight: 800,
              }}
            >
              {analyticsStats.totalAbsences}
            </div>
            <div
              style={{
                marginTop: '3px',
                color: '#b91c1c',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              مجموع غیبت‌ها
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
            }}
          >
            <FiClock
              size={22}
              color="#d97706"
            />
            <div
              style={{
                marginTop: '10px',
                color: '#b45309',
                fontSize: '1.45rem',
                fontWeight: 800,
              }}
            >
              {analyticsStats.totalLate}
            </div>
            <div
              style={{
                marginTop: '3px',
                color: '#b45309',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              مجموع تأخیرها
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#f5f3ff',
              border: '1px solid #ddd6fe',
            }}
          >
            <FiAlertCircle
              size={22}
              color="#7c3aed"
            />
            <div
              style={{
                marginTop: '10px',
                color: '#6d28d9',
                fontSize: '1.45rem',
                fontWeight: 800,
              }}
            >
              {analyticsStats.sessionsWithAbsence === null
                ? '—'
                : analyticsStats.sessionsWithAbsence}
            </div>
            <div
              style={{
                marginTop: '3px',
                color: '#6d28d9',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              جلسات دارای غیبت
            </div>
          </div>
        </div>

        {/* جزئیات جلسات */}
        <div
          style={{
            padding: '16px',
            marginBottom: '16px',
            borderRadius: '18px',
            background: '#fff',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              color: '#1e293b',
              fontWeight: 800,
            }}
          >
            <FiInfo size={18} color="#2563eb" />
            جزئیات ثبت اطلاعات
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
            }}
          >
            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
              }}
            >
              <small style={{ color: '#64748b' }}>
                کل جلسات برنامه‌ریزی‌شده
              </small>
              <strong
                style={{
                  display: 'block',
                  marginTop: '5px',
                  color: '#1e293b',
                  fontSize: '1.1rem',
                }}
              >
                {analyticsStats.totalSessions}
              </strong>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
              }}
            >
              <small style={{ color: '#64748b' }}>
                جلسات دارای رکورد
              </small>
              <strong
                style={{
                  display: 'block',
                  marginTop: '5px',
                  color: '#1e293b',
                  fontSize: '1.1rem',
                }}
              >
                {analyticsStats.recordedSessions}
              </strong>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
              }}
            >
              <small style={{ color: '#64748b' }}>
                رکوردهای ثبت‌شده
              </small>
              <strong
                style={{
                  display: 'block',
                  marginTop: '5px',
                  color: '#1e293b',
                  fontSize: '1.1rem',
                }}
              >
                {analyticsStats.recordedRecords}
              </strong>
            </div>

            <div
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: '#f8fafc',
              }}
            >
              <small style={{ color: '#64748b' }}>
                رکوردهای باقی‌مانده
              </small>
              <strong
                style={{
                  display: 'block',
                  marginTop: '5px',
                  color:
                    analyticsStats.missingRecords > 0
                      ? '#b45309'
                      : '#15803d',
                  fontSize: '1.1rem',
                }}
              >
                {analyticsStats.missingRecords}
              </strong>
            </div>
          </div>
        </div>

        {/* هشدار کمبود داده */}
        {!analyticsStats.hasSessionRecords && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '14px',
              marginBottom: '16px',
              borderRadius: '14px',
              color: '#92400e',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              lineHeight: 1.9,
              fontSize: '0.82rem',
            }}
          >
            <FiAlertCircle
              size={20}
              style={{ flexShrink: 0, marginTop: '3px' }}
            />

            <div>
              برای این کلاس هنوز رکورد جلسه‌ای در فیلد{' '}
              <code>attendance</code> ثبت نشده است. بنابراین
              «مجموع غیبت‌ها» از مقدار قدیمی{' '}
              <code>totalAbsences</code> خوانده شده و تعداد دقیق
              جلسات دارای غیبت قابل محاسبه نیست.
            </div>
          </div>
        )}

        {analyticsStats.hasSessionRecords &&
          analyticsStats.missingRecords > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '14px',
                marginBottom: '16px',
                borderRadius: '14px',
                color: '#075985',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                lineHeight: 1.9,
                fontSize: '0.82rem',
              }}
            >
              <FiInfo
                size={20}
                style={{ flexShrink: 0, marginTop: '3px' }}
              />

              <div>
                از {analyticsStats.expectedRecords} رکورد مورد انتظار،
                تاکنون {analyticsStats.recordedRecords} رکورد ثبت شده
                است و {analyticsStats.missingRecords} رکورد هنوز خالی
                است.
              </div>
            </div>
          )}

        {/* وضعیت فعلی هنرجویان */}
        <div
          style={{
            padding: '14px 16px',
            marginBottom: '18px',
            borderRadius: '14px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.82rem',
            lineHeight: 1.9,
          }}
        >
          <strong style={{ color: '#334155' }}>
            وضعیت فعلی هنرجویان:
          </strong>{' '}
          حاضر {analyticsStats.currentPresent} نفر، غایب{' '}
          {analyticsStats.currentAbsent} نفر و دارای تأخیر{' '}
          {analyticsStats.currentLate} نفر.
          <br />
          این بخش فقط وضعیت فعلی را نشان می‌دهد و با آمار کل جلسات
          متفاوت است.
        </div>

        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => setAnalyticsClassId(null)}
          style={{
            minHeight: '44px',
            borderRadius: '12px',
            fontWeight: 700,
          }}
        >
          بستن گزارش
        </button>
      </div>
    </div>
  </div>
)}







         {/* پنجرهٔ بازبینی پیشرفته و جامع ترم */}
      {reviewClass && reviewStats && (
        <div
          role="dialog"
    aria-modal="true"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1050,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      direction: 'rtl',
          }}
        >
          <div
          style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '90vh',
        height: 'auto',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto', /* جلوگیری از بریده شدن یا اسکرول هدر */

            }}
          >
            {/* ۱. هدر گرافیکی مودال */}
            <div 
              style={{
                 background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '24px 28px',
          flexShrink: 0,
          color: '#ffffff',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '220px',
                  height: '220px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(255,255,255,0) 70%)',
                  top: '-70px',
                  left: '-40px',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#93c5fd',
                      marginBottom: '10px',
                    }}
                  >
                    <FiClipboard size={14} />
                    گزارش جامع ترم و جلسات
                  </div>
                  <h3
                    id="review-attendance-title"
                    style={{
                      margin: 0,
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    بازبینی حضور و غیاب کلاسی
                  </h3>
                  <div
                    style={{
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '0.88rem',
                      color: '#94a3b8',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span><strong>کلاس:</strong> {reviewClass.title}</span>
                    <span><strong>مدرس:</strong> {reviewClass.teacher}</span>
                    <span><strong>کد دوره:</strong> {reviewClass.course || reviewClass.id}</span>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="بستن پنجره بازبینی"
                  onClick={() => setReviewClassId(null)}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.borderColor = '#ef4444'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* ۲. بدنه محتوا */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* خلاصه وضعیت کل ترم در کارت‌های آماری */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiCalendar size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>جلسات ترم</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {reviewStats.sessionsHeld} <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>از {reviewStats.totalSessions}</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#dcfce7',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiCheckCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>کل دفعات حضور</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                      {reviewStats.totalPresent} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>نفر/جلسه</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#fee2e2',
                      color: '#b91c1c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiUserMinus size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>کل غیبت‌های ترم</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginTop: '2px' }}>
                      {reviewStats.totalAbsences} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>مورد</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#fef3c7',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FiClock size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>کل تأخیرها</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e', marginTop: '2px' }}>
                      {reviewStats.totalLate} <span style={{ fontSize: '0.78rem', color: '#64748b' }}>مورد</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* هشدار داده‌های ثبت‌نشده در صورت وجود */}
              {!reviewStats.hasSessionRecords && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: '0.85rem',
                    lineHeight: 1.8,
                  }}
                >
                  <FiAlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    برای این کلاس هنوز سابقه تفکیکی جلسات در سیستم ثبت نشده است. آمار غیبت‌ها از رکورد کلی کلاس خوانده شده و برای مشاهده ریز جلسات باید حضور و غیاب هر جلسه در تب مربوطه ثبت شود.
                  </div>
                </div>
              )}

              {/* جدول مجزا و تفصیلی وضعیت دانش‌آموزان در کل ترم */}
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#ffffff',
                }}
              >
                <div
                  style={{
                    padding: '14px 20px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>
                    لیست هنرجویان و آمار تجمیعی ترم
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    تعداد: {reviewClass.students.length} نفر
                  </span>
                </div>

                {reviewClass.students.length === 0 ? (
                  <div style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    هنرجویی در این کلاس یافت نشد.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.86rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '12px 16px', fontWeight: 700 }}>نام هنرجو</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>جلسات حاضر</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>غیبت کل ترم</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>تعداد تأخیر</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>درصد حضور</th>
                          <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center' }}>ریز جلسات برگزار شده</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviewClass.students.map((student) => {
                          const heldCount = reviewStats.sessionsHeld || 1;
                          
                          // استخراج دقیق رکوردهای دانش‌آموز تا جلسه فعلی برگزار شده
                          const records = Object.entries(student.attendance || {})
                            .filter(([sessionNum]) => Number(sessionNum) <= heldCount && Number(sessionNum) > 0)
                            .map(([, status]) => status);

                          const studentPresent = records.length > 0
                            ? records.filter((s) => s === 'present').length
                            : (student.status === 'present' ? 1 : 0);

                          const studentAbsent = records.length > 0
                            ? records.filter((s) => s === 'absent').length
                            : Number(student.absent || (student.status === 'absent' ? 1 : 0));

                          const studentLate = records.length > 0
                            ? records.filter((s) => s === 'late').length
                            : Number(student.late || (student.status === 'late' ? 1 : 0));

                          const totalRecorded = records.length > 0 ? records.length : 1;
                          const calculatedPercent = records.length > 0
                            ? Math.round(((studentPresent + studentLate * 0.5) / totalRecorded) * 100)
                            : Number(student.percent || 100);

                          return (
                            <tr
                              key={student.id}
                              style={{
                                borderBottom: '1px solid #f1f5f9',
                                transition: 'background-color 0.15s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>
                                <div>{student.name}</div>
                                {student.code && (
                                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                                    کد: {student.code}
                                  </div>
                                )}
                              </td>

                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    fontWeight: 700,
                                  }}
                                >
                                  {studentPresent} جلسه
                                </span>
                              </td>

                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: studentAbsent > 0 ? '#fee2e2' : '#f1f5f9',
                                    color: studentAbsent > 0 ? '#b91c1c' : '#64748b',
                                    fontWeight: 700,
                                  }}
                                >
                                  {studentAbsent} غیبت
                                </span>
                              </td>

                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <span
                                  style={{
                                    display: 'inline-block',
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: studentLate > 0 ? '#fef3c7' : '#f1f5f9',
                                    color: studentLate > 0 ? '#b45309' : '#64748b',
                                    fontWeight: 700,
                                  }}
                                >
                                  {studentLate} بار
                                </span>
                              </td>

                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '70px' }}>
                                  <span
                                    style={{
                                      fontWeight: 800,
                                      color:
                                        calculatedPercent >= 80
                                          ? '#16a34a'
                                          : calculatedPercent >= 60
                                          ? '#d97706'
                                          : '#dc2626',
                                    }}
                                  >
                                    ٪{calculatedPercent}
                                  </span>
                                  <div
                                    style={{
                                      width: '60px',
                                      height: '6px',
                                      background: '#e2e8f0',
                                      borderRadius: '999px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: `${calculatedPercent}%`,
                                        height: '100%',
                                        background:
                                          calculatedPercent >= 80
                                            ? '#16a34a'
                                            : calculatedPercent >= 60
                                            ? '#d97706'
                                            : '#dc2626',
                                        borderRadius: '999px',
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* نمایش وضعیت جلسات به صورت بج‌های تفکیکی ۱ تا ۱۲ */}
                              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    flexWrap: 'wrap',
                                    maxWidth: '240px',
                                    margin: '0 auto',
                                  }}
                                >
                                  {Array.from({ length: Math.min(heldCount, 12) }, (_, i) => {
                                    const sNum = i + 1;
                                    const status = student.attendance?.[sNum];
                                    let bg = '#e2e8f0';
                                    let color = '#94a3b8';
                                    let title = `جلسه ${sNum}: ثبت نشده`;

                                    if (status === 'present') {
                                      bg = '#10b981';
                                      color = '#ffffff';
                                      title = `جلسه ${sNum}: حاضر`;
                                    } else if (status === 'absent') {
                                      bg = '#ef4444';
                                      color = '#ffffff';
                                      title = `جلسه ${sNum}: غایب`;
                                    } else if (status === 'late') {
                                      bg = '#f59e0b';
                                      color = '#ffffff';
                                      title = `جلسه ${sNum}: تأخیر`;
                                    }

                                    return (
                                      <span
                                        key={sNum}
                                        title={title}
                                        style={{
                                          width: '20px',
                                          height: '20px',
                                          borderRadius: '6px',
                                          background: bg,
                                          color: color,
                                          fontSize: '0.68rem',
                                          fontWeight: 700,
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'default',
                                        }}
                                      >
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
                )}
              </div>

              {/* دکمه بستن در پایین مودال */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReviewClassId(null)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                >
                  بستن پنجره بازبینی
                </button>
              </div>

            </div>
          </div>
        </div>
      )}





    </div>
  );
};

export default AttendancePanel;
