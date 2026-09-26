
import React, { useState, useMemo,useEffect , useRef} from 'react';
import "../style/AdminGlobal.css";
import "../style/AdminStudents.css";
import { BiEdit } from 'react-icons/bi';

import {
  FiInfo,
  FiCheckSquare, // <-- اضافه شد برای دکمه تکالیف و پروژه‌ها
  FiX,
  FiEdit,
  FiEdit2,
  FiSave,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiCheck,
  FiCheckCircle,
  FiSlash,FiList,  FiHelpCircle, FiFileText, FiVideo, FiMic, FiFile,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiUser,
  FiBookOpen,      FiPieChart, FiThumbsUp, FiMessageSquare,
  FiClock,
  FiAward,
  FiBarChart2,
  FiCalendar,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiUploadCloud,
  FiImage,
  FiFolder,
  FiRotateCcw,
  FiStar,
  
} from 'react-icons/fi';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
  
} from 'recharts';


























// داده‌های اولیه و ثابت‌ها خارج از کامپوننت
const CATEGORIES_LIST = [
  { id: 1, name: 'برنامه‌نویسی و وب' },
  { id: 2, name: 'هوش مصنوعی و داده' },
  { id: 3, name: 'شبکه و امنیت' },
  { id: 4, name: 'طراحی و گرافیک' }
];

const INITIAL_COURSE_FORM = {
  title: '',
  categoryId: '',
  prerequisites: '',
  hasCertificate: false,
  status: 'ACTIVE',
  description: '',
  image: '',
  // --- فیلدهای جدید اضافه شده ---
  tuition: '',           // شهریه دوره (تومان)
  sessionsCount: '',     // تعداد جلسات دوره
  durationHours: '',     // ساعت (مدت زمان) دوره
};

const INITIAL_CATEGORY_FORM = {
  name: '',
  description: ''
};

// یک تصویر پیش‌فرض سبک که بدون نیاز به اینترنت لود می‌شود:
const DEFAULT_COURSE_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-.05'/%3E%3Cpath d='M6 6h10'/%3E%3Cpath d='M6 10h10'/%3E%3C/svg%3E";

const INITIAL_COURSES = [
  {
    id: 1,
    title: 'آموزش جامع React و Next.js',
    categoryId: 1,
    category: 'برنامه‌نویسی و وب',
    prerequisites: 'HTML, CSS, JavaScript',
     tuition: '',           // شهریه دوره (تومان)
  sessionsCount: '',     // تعداد جلسات دوره
  durationHours: '',     // ساعت (مدت زمان) دوره
    hasCertificate: true,
    enrolledCount: 38,
    satisfactionRate: 4.8,
    status: 'ACTIVE',
    createdAt: '۱۴۰۳/۰۵/۱۰',
    image: DEFAULT_COURSE_IMG
  },
  {
    id: 2,
    title: 'پایتون، یادگیری ماشین و علم داده',
    categoryId: 2,
    category: 'هوش مصنوعی و داده',
    prerequisites: 'مبانی ریاضی و آمار',
     tuition: '',           // شهریه دوره (تومان)
  sessionsCount: '',     // تعداد جلسات دوره
  durationHours: '',     // ساعت (مدت زمان) دوره
    hasCertificate: true,
    enrolledCount: 25,
    satisfactionRate: 4.9,
    status: 'ACTIVE',
    createdAt: '۱۴۰۳/۰۴/۱۵',
    image: DEFAULT_COURSE_IMG
  },
  {
    id: 3,
    title: 'توسعه وب با C# و ASP.NET Core',
    categoryId: 1,
    category: 'برنامه‌نویسی و وب',
    prerequisites: 'آشنایی با مبانی شی‌گرایی',
     tuition: '',           // شهریه دوره (تومان)
  sessionsCount: '',     // تعداد جلسات دوره
  durationHours: '',     // ساعت (مدت زمان) دوره
    hasCertificate: false,
    enrolledCount: 19,
    satisfactionRate: 4.6,
    status: 'INACTIVE',
    createdAt: '۱۴۰۳/۰۳/۰۱',
    image: DEFAULT_COURSE_IMG
  }
];


const AdminCourses = () => {
  // ۱. استیت اصلی داده‌ها
  const [courses, setCourses] = useState(INITIAL_COURSES);

  // ۲. استیت‌های فیلتر، جستجو و صفحه‌بندی
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [certificateFilter, setCertificateFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // ۳. استیت‌های انتخاب سطرها و دراپ‌داون عملیات
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);


  // ۴. وضعیت‌های مودال‌ها
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);


  // ----------------------------------------------------
// ۵. استیت و مودال تکالیف و پروژه‌ها (Assignments & Projects)
// ----------------------------------------------------
const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

const [assignments, setAssignments] = useState([
  {
    id: 1,
    courseId: 1,
    courseTitle: 'آموزش جامع React و Next.js',
    sessionNumber: 1,
    taskType: 'تمرین', // 'تمرین' | 'پروژه عملی' | 'آزمون کلاسی' | 'مینی پروژه'
    title: 'طراحی کامپوننت کارت محصول با هوک useState',
    fileType: 'zip', // 'zip' | 'pdf' | 'doc' | 'image' | 'code' | 'none'
    fileName: 'exercise-session-01.zip',
    file: null,
    description: 'کدهای پروژه را زیپ کرده و ساختار فولدر کامپوننت‌ها را رعایت فرمایید.',
    createdAt: '۱۴۰۳/۰۵/۱۲'
  }
]);

const initialAssignmentForm = {
  id: null,
  courseId: '',
  sessionNumber: '',
  taskType: 'تمرین',
  title: '',
  fileType: 'zip',
  fileName: '',
  file: null,
  description: ''
};

const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);

// تابع ثبت یا ویرایش تکلیف/پروژه
const handleSaveAssignment = (e) => {
  e.preventDefault();
  if (!assignmentForm.title.trim()) {
    alert('لطفاً عنوان تکلیف یا پروژه را وارد نمایید.');
    return;
  }

  const currentCourse = courses.find((c) => c.id === Number(assignmentForm.courseId || selectedCourseForManage?.id));
  const targetCourseId = currentCourse ? currentCourse.id : (selectedCourseForManage?.id || courses[0]?.id || 1);
  const targetCourseTitle = currentCourse ? currentCourse.title : (selectedCourseForManage?.title || 'دوره عمومی');

  if (assignmentForm.id) {
    // حالت ویرایش
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === assignmentForm.id
          ? {
              ...item,
              courseId: targetCourseId,
              courseTitle: targetCourseTitle,
              sessionNumber: assignmentForm.sessionNumber ? Number(assignmentForm.sessionNumber) : '',
              taskType: assignmentForm.taskType,
              title: assignmentForm.title,
              fileType: assignmentForm.fileType,
              fileName: assignmentForm.fileName || item.fileName,
              file: assignmentForm.file || item.file,
              description: assignmentForm.description
            }
          : item
      )
    );
  } else {
    // حالت ایجاد جدید
    const newAssignment = {
      id: Date.now(),
      courseId: targetCourseId,
      courseTitle: targetCourseTitle,
      sessionNumber: assignmentForm.sessionNumber ? Number(assignmentForm.sessionNumber) : '',
      taskType: assignmentForm.taskType,
      title: assignmentForm.title,
      fileType: assignmentForm.fileType,
      fileName: assignmentForm.fileName || '',
      file: assignmentForm.file || null,
      description: assignmentForm.description,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };
    setAssignments((prev) => [newAssignment, ...prev]);
  }

  // ریست کردن فرم
  setAssignmentForm({
    ...initialAssignmentForm,
    courseId: targetCourseId
  });
};

// باز کردن فرم برای ویرایش یک آیتم
const handleEditAssignment = (item) => {
  setAssignmentForm({
    id: item.id,
    courseId: item.courseId,
    sessionNumber: item.sessionNumber || '',
    taskType: item.taskType || 'تمرین',
    title: item.title || '',
    fileType: item.fileType || 'zip',
    fileName: item.fileName || '',
    file: item.file || null,
    description: item.description || ''
  });
};

// حذف یک تکلیف یا پروژه
const handleDeleteAssignment = (id) => {
  if (window.confirm('آیا از حذف این تکلیف/پروژه اطمینان دارید؟')) {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
    if (assignmentForm.id === id) {
      setAssignmentForm(initialAssignmentForm);
    }
  }
};



// ----------------------------------------------------
// ۱. استیت‌های مودال‌ها
// ----------------------------------------------------
const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
const [isContentModalOpen, setIsContentModalOpen] = useState(false);
const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

// دوره‌ای که در حال حاضر برای آن سرفصل/محتوا/سوال ثبت می‌کنیم
const [selectedCourseForManage, setSelectedCourseForManage] = useState(null);

// ----------------------------------------------------
// ۲. استیت و فرم سرفصل‌ها (Syllabus)
// ----------------------------------------------------
const [syllabi, setSyllabi] = useState([
  {
    id: 1,
    courseId: 1,
    title: 'فصل اول: مقدمات و مفاهیم پایه',
    description: 'در این فصل با مبانی، ابزارهای توسعه و تاریخچه آشنا می‌شویم.',
    lessons: [
      { id: 101, title: 'آشنایی با ساختار و ابزارها', duration: '15 دقیقه' },
      { id: 102, title: 'نصب و راه‌اندازی محیط توسعه', duration: '25 دقیقه' }
    ]
  }
]);

const [chapterForm, setChapterForm] = useState({
  id: null,
  title: '',
  description: '',
  lessonsText: '' // زیرفصل‌ها هر کدام در یک خط
});

// ----------------------------------------------------
// ۳. استیت و فرم محتوای آموزشی (Media & Files)
// ----------------------------------------------------
const [contents, setContents] = useState([
  {
   id: 1,
    courseId: 1,
    sessionNumber: 1, // شماره جلسه
    title: 'اسلاید جلسه اول',
    type: 'pdf',
    fileUrl: '',
    fileName: 'session-01-slides.pdf',
    description: 'فایل PDF اسلایدهای معرفی و نقشه راه دوره',
    createdAt: '1403/05/10'
  }
]);

// ۲. استیت فرم محتوا
const [contentForm, setContentForm] = useState({
  id: null,
  sessionNumber: '', // فیلد شماره جلسه
  title: '',
  type: 'video',
  description: '',
  textContent: '',
  file: null,
  fileName: ''
});

// ----------------------------------------------------
// ۴. استیت و فرم سوالات متداول (FAQ)
// ----------------------------------------------------
const [faqs, setFaqs] = useState([
  {
    id: 1,
    courseId: 1,
    question: 'آیا این دوره برای افراد مبتدی مناسب است؟',
    answer: 'بله، تمامی مباحث از سطح صفر و پایه تدریس شده‌اند.'
  },
  {
    id: 2,
    courseId: 1,
    question: 'آیا به این دوره گواهینامه معتبر تعلق می‌گیرد؟',
    answer: 'بله، پس از پایان دوره و شرکت در آزمون، گواهینامه اعطا می‌شود.'
  }
]);

const [faqForm, setFaqForm] = useState({
  id: null,
  question: '',
  answer: ''
});











  // ۶. کارت‌های آمار تحلیلی
  const [stats, setStats] = useState({
totalCourses: 28,
activeCourses: 24,
totalCategories: 6,
certifiedCourses: 18
  });



  // ----------------- هندلرهای دسته‌بندی -----------------
const handleOpenCategoryModal = () => {
  resetCategoryForm();
  setIsCategoryModalOpen(true);
};

const handleEditCategory = (cat) => {
  setEditingCategoryId(cat.id);
  setCategoryFormData({
    id: cat.id,
    name: cat.name,
    icon: cat.icon || '',
    iconImage: cat.iconImage || '',   // ← اضافه شد
    shortDesc: cat.shortDesc,
    fullDesc: cat.fullDesc,
    displayOrder: cat.displayOrder
  });
};







// استیت برای سوئیچ بین حالت «ثبت‌نام» و «درآمد» در نمودار دایره‌ای
const [chartDataType, setChartDataType] = useState("students"); // 'students' | 'revenue'

// رنگ‌بندی شیک برای بخش‌های نمودار دایره‌ای
const PIE_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"];

// آماده‌سازی داده‌های نمودار دایره‌ای بر اساس لیست دوره‌ها
const courseStatsData = useMemo(() => {
  return (courses || []).map((c) => {
    const studentCount = Number(c.studentsCount || c.enrolledCount || c.students || 0);
    const price = Number(String(c.price || 0).replace(/[^0-9]/g, ""));
    const totalRevenue = studentCount * price;

    return {
      name: c.title || "بدون عنوان",
      students: studentCount,
      revenue: totalRevenue,
    };
  }).filter(item => (chartDataType === "students" ? item.students > 0 : item.revenue > 0));
}, [courses, chartDataType]);

// داده‌های نمونه و ساختاریافته نظرسنجی دوره‌ها
const surveySummary = useMemo(() => {
  return {
    overallRating: 4.8,
    totalReviews: 348,
    satisfactionRate: 94, // درصد رضایت
    criteria: [
      { title: "کیفیت محتوا و سرفصل‌ها", score: 96 },
      { title: "تسلط و فن بیان اساتید", score: 92 },
      { title: "پشتیبانی و پاسخگویی به تمرینات", score: 89 },
      { title: "پروژه‌محور و کاربردی بودن", score: 95 },
    ],
    topRatedCourses: [
      { name: "فرانت‌اند جامع (React & Next)", score: 4.9, count: 142 },
      { name: "پایتون و هوش مصنوعی", score: 4.8, count: 110 },
      { name: "بک‌اند پیشرفته (C# / ASP.NET)", score: 4.7, count: 96 },
    ]
  };
}, []);








const [isCourseDetailsModalOpen, setIsCourseDetailsModalOpen] = useState(false);

const handleOpenCourseDetails = (course) => {
  setActiveCourse(course);
  setIsCourseDetailsModalOpen(true);
};

const handleCloseCourseDetails = () => {
  setIsCourseDetailsModalOpen(false);
  setActiveCourse(null);
};









const getCourseDetails = (course) => {
  const studentsCount =
    course.studentsCount ??
    course.enrolledCount ??
    course.studentCount ??
    0;

  const tuitionPerStudent = course.tuitionPerStudent ?? 0;

  const receivedTuition =
    course.receivedTuition ??
    studentsCount * tuitionPerStudent;

  return {
    ...course,

    teachers: course.teachers ?? [
      {
        id: 1,
        name: course.teacherName || 'استاد دوره',
        specialization: course.teacherSpecialization || 'برنامه‌نویسی',
        sessionsCount: course.sessionsCount || 24
      }
    ],

    studentsCount,

    tuitionPerStudent,

    receivedTuition,

    pendingTuition: course.pendingTuition ?? 0,

    capacity: course.capacity ?? 30,

    duration: course.duration || 'نامشخص',

    level: course.level || 'متوسط',

    sessionsCount: course.sessionsCount || 0,

    completedSessions: course.completedSessions || 0,

    startDate: course.startDate || course.createdAt || 'ثبت نشده',

    endDate: course.endDate || 'ثبت نشده',

    subCourses: course.subCourses ?? [],

    monthlyRevenue: course.monthlyRevenue ?? [
      { month: 'فروردین', amount: 0 },
      { month: 'اردیبهشت', amount: 0 },
      { month: 'خرداد', amount: 0 },
      { month: 'تیر', amount: receivedTuition }
    ],

    studentStatus: course.studentStatus ?? [
      { name: 'فعال', value: studentsCount },
      { name: 'تکمیل‌شده', value: course.completedStudents || 0 },
      { name: 'انصرافی', value: course.withdrawnStudents || 0 }
    ]
  };
};







// استیت دوره انتخابی و مودال‌ها
const [activeCourse, setActiveCourse] = useState(null);
const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

// تابع باز کردن ویرایش دوره
const handleOpenEdit = (course) => {
  setActiveCourse(course);
  setCourseFormData({
    title: course.title || '',
    categoryId: course.categoryId || '',
    initialDesc: course.initialDesc || '',
    secondaryDesc: course.secondaryDesc || '',
    fullDesc: course.fullDesc || '',
    hasLearningContent: course.hasLearningContent ?? true,
    prerequisites: course.prerequisites || '',
    image: course.image || '',
    hasCertificate: course.hasCertificate ?? true
  });
  setIsEditModalOpen(true);
};

// تابع تغییر وضعیت فعال/غیرفعال دوره
// تابع تغییر وضعیت دوره (فعال / غیرفعال)
// تابع تغییر وضعیت فعال/غیرفعال دوره
const handleToggleCourseStatus = (target) => {
  // اگر آبجکت پاس داده شده بود یا صرفاً شناسه (id)
  const courseId = typeof target === "object" && target !== null ? target.id : target;

  setCourses((prevCourses) =>
    prevCourses.map((course) => {
      if (course.id === courseId) {
        // بررسی هوشمند وضعیت فعلی
        const currentStatusStr = String(course.status || "").toLowerCase();
        const isCurrentlyActive =
          currentStatusStr === "active" ||
          currentStatusStr === "فعال" ||
          course.isActive === true;

        // تغییر وضعیت به حالت معکوس
        const newStatus = isCurrentlyActive ? "INACTIVE" : "ACTIVE";

        return {
          ...course,
          status: newStatus,
          isActive: !isCurrentlyActive,
        };
      }
      return course;
    })
  );

  // بستن منوی دراپ‌داون بعد از کلیک
  if (typeof setOpenDropdownId === "function") {
    setOpenDropdownId(null);
  }
};










const emptyCourseForm = {
 title: '',
  categoryId: '',
  initialDesc: '',
  secondaryDesc: '',
  tuition: '',
  sessionsCount: '',
  durationHours: '',
  fullDesc: '',
  hasLearningContent: true,
  prerequisites: '',
  image: '',
  hasCertificate: true
};

const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
const [editingCourse, setEditingCourse] = useState(null);

const [editCourseForm, setEditCourseForm] = useState(emptyCourseForm);










const resetCategoryForm = () => {
  setEditingCategoryId(null);
  setCategoryFormData({
    id: null,
    name: '',
    icon: '',
    iconImage: '',    // ← اضافه شد
    shortDesc: '',
    fullDesc: '',
    displayOrder: categories.length + 1
  });
};



// انتخاب و تبدیل تصویر آیکون دسته‌بندی به Data URL
const handleCategoryIconUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // اعتبارسنجی نوع فایل
  if (!file.type.startsWith('image/')) {
    alert('لطفاً فقط فایل تصویری (JPG, PNG, SVG و...) انتخاب کنید.');
    return;
  }

  // محدودیت حجم (حداکثر ۱ مگابایت)
  if (file.size > 1024 * 1024) {
    alert('حجم تصویر نباید بیشتر از ۱ مگابایت باشد.');
    return;
  }

  const reader = new FileReader();
  reader.onloadend = () => {
    setCategoryFormData(prev => ({ ...prev, iconImage: reader.result }));
  };
  reader.readAsDataURL(file);
};




const handleSaveCategory = (e) => {
  e.preventDefault();
  if (!categoryFormData.name.trim()) {
    alert('نام دسته‌بندی را وارد کنید.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('fa-IR');

  if (editingCategoryId) {
    // ویرایش دسته موجود
    setCategories(prev =>
      prev.map(c => (c.id === editingCategoryId ? { ...c, ...categoryFormData } : c))
    );
  } else {
    // ثبت دسته جدید (شناسه و تاریخ خودکار تولید می‌شوند)
    const newCategory = {
      ...categoryFormData,
      id: Date.now(),
      createdAt: currentDate
    };
    setCategories(prev => [...prev, newCategory]);
  }
  resetCategoryForm();
};

const handleDeleteCategory = (id) => {
  if (window.confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (editingCategoryId === id) resetCategoryForm();
  }
};

// ----------------- هندلرهای افزودن دوره -----------------
const handleSaveCourse = (e) => {
  e.preventDefault();
  if (!courseFormData.title.trim()) {
    alert('عنوان دوره الزامی است.');
    return;
  }

  const selectedCategory = categories.find(c => String(c.id) === String(courseFormData.categoryId));
  const newCourse = {
    id: Date.now(),
    ...courseFormData,
    category: selectedCategory ? selectedCategory.name : 'عمومی',
    enrolledCount: 0,
    satisfactionRate: 5.0,
    status: 'ACTIVE',
    createdAt: new Date().toLocaleDateString('fa-IR'),
    image: courseFormData.image || DEFAULT_COURSE_IMG
  };

  setCourses(prev => [newCourse, ...prev]);
  setIsAddCourseModalOpen(false);
  // ریست فرم دوره
  setCourseFormData({
  title: '',
  categoryId: '',
  initialDesc: '',
  secondaryDesc: '',
  tuition: '',
  sessionsCount: '',
  durationHours: '',
  fullDesc: '',
  hasLearningContent: true,
  prerequisites: '',
  image: '',
  hasCertificate: true
});

};








  // ۱. استیت‌های مدیریت دسته‌بندی‌ها
const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
const [categories, setCategories] = useState([
  {
    id: 1,
    name: 'برنامه‌نویسی و وب',
    icon: '💻',
    shortDesc: 'دوره‌های جامع فرانت‌اند، بک‌اند و معماری نرم‌افزار',
    fullDesc: 'مسیر یادگیری کامل شامل HTML, CSS, React, Python, C# و پایگاه‌های داده.',
    displayOrder: 1,
    createdAt: '۱۴۰۳/۰۱/۱۵'
  },
  {
    id: 2,
    name: 'هوش مصنوعی و داده',
    icon: '🤖',
    shortDesc: 'یادگیری ماشین، علم داده و پایتون کاربردی',
    fullDesc: 'آموزش پروژه‌محور هوش مصنوعی، یادگیری عمیق، پردازش تصویر و تحلیل آماری.',
    displayOrder: 2,
    createdAt: '۱۴۰۳/۰۲/۱۰'
  }
]);

// فرم دسته بندی (برای ایجاد یا ویرایش)
const [categoryFormData, setCategoryFormData] = useState({
  id: null,
  name: '',
  icon: '',          // اموجی یا نام آیکون (اختیاری)
  iconImage: '',     // تصویر پیوستی (Data URL)
  shortDesc: '',
  fullDesc: '',
  displayOrder: 1
});

const [editingCategoryId, setEditingCategoryId] = useState(null);

// ۲. استیت‌های افزودن دوره جدید
// ۲. استیت‌های افزودن دوره جدید
const [courseFormData, setCourseFormData] = useState(INITIAL_COURSE_FORM); // <-- این خط مهم است


  // محاسبات فیلتر روی لیست دوره‌ها
  const filteredCourses = useMemo(() => {
return courses.filter((item) => {
const matchSearch =
(item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
(item.prerequisites && item.prerequisites.toLowerCase().includes(searchQuery.toLowerCase()));

const matchCategory =
categoryFilter === 'ALL' || item.categoryId === Number(categoryFilter);

const matchStatus =
statusFilter === 'ALL' ||
(statusFilter === 'ACTIVE' && (item.status === 'ACTIVE' || item.status === 'active')) ||
(statusFilter === 'INACTIVE' && (item.status === 'INACTIVE' || item.status === 'inactive'));

const matchCert =
certificateFilter === 'ALL' ||
(certificateFilter === 'CERTIFIED' && item.hasCertificate) ||
(certificateFilter === 'UNCERTIFIED' && !item.hasCertificate);

return matchSearch && matchCategory && matchStatus && matchCert;
});
  }, [courses, searchQuery, categoryFilter, statusFilter, certificateFilter]);

  const paginatedCourses = filteredCourses;

  // توابع کنترل انتخاب چک‌باکس‌ها
  const isAllSelected =
paginatedCourses.length > 0 && selectedIds.length === paginatedCourses.length;

const handleSelectAll = (event) => {
  if (event.target.checked) {
    setSelectedIds(filteredCourses.map((course) => course.id));
  } else {
    setSelectedIds([]);
  }
};


const handleSelectRow = (courseId) => {
  setSelectedIds((previousIds) =>
    previousIds.includes(courseId)
      ? previousIds.filter((id) => id !== courseId)
      : [...previousIds, courseId]
  );
};

  const handleDeleteSelected = () => {
if (window.confirm(`آیا از حذف ${selectedIds.length} دوره انتخاب شده مطمئن هستید؟`)) {
setCourses((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
setSelectedIds([]);
}
  };

  // ریست کردن فیلترها
  const handleResetFilters = () => {
setSearchQuery('');
setCategoryFilter('ALL');
setStatusFilter('ALL');
setCertificateFilter('ALL');
setCurrentPage(1);
  };

  const handleExportExcel = () => {
alert('در حال آماده‌سازی فایل اکسل دوره‌ها...');
  };

  // عملیات سطرها
  const handleViewDetails = (course) => {
setOpenDropdownId(null);
  };

 // ۲. تابع باز کردن مودال ویرایش و پر کردن تمام فیلدها
const handleEditCourse = (course) => {
  setEditingCourse(course);
  setEditCourseForm({
    title: course.title || '',
    categoryId: course.categoryId || '',
    initialDesc: course.initialDesc || '',
    secondaryDesc: course.secondaryDesc || '',
    tuition: course.tuition || '',
    sessionsCount: course.sessionsCount || '',
    durationHours: course.durationHours || '',
    fullDesc: course.fullDesc || '',
    hasLearningContent: course.hasLearningContent ?? true,
    prerequisites: course.prerequisites || '',
    image: course.image || '',
    hasCertificate: course.hasCertificate ?? true
  });
  setIsEditCourseModalOpen(true);
};



useEffect(() => {
  if (!editingCourse) return;

  setEditCourseForm({
    id: editingCourse.id || "",
    title: editingCourse.title || "",
    categoryId: editingCourse.categoryId || "",
    shortDescription: editingCourse.shortDescription || "",
    secondaryDescription: editingCourse.secondaryDescription || "",
    fullDescription: editingCourse.fullDescription || "",
    educationalContent: editingCourse.educationalContent || "",
    prerequisites: editingCourse.prerequisites || "",
    image: editingCourse.image || "",
    certificate: editingCourse.certificate || ""
  });
}, [editingCourse]);





const handleEditCourseChange = (event) => {
  const { name, value } = event.target;

  setEditCourseForm((previous) => ({
    ...previous,
    [name]: value
  }));
};


const handleEditCourseImageChange = (event) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setEditCourseForm((previous) => ({
      ...previous,
      image: reader.result
    }));
  };

  reader.readAsDataURL(file);
};



// ۳. تابع بروزرسانی دوره (اصلاح شده و تمیز)
const handleUpdateCourse = (event) => {
  event.preventDefault();
  if (!editingCourse) return;

  const selectedCategory = categories.find(c => String(c.id) === String(editCourseForm.categoryId));

  const updatedCourse = {
    ...editingCourse,
    ...editCourseForm,
    category: selectedCategory ? selectedCategory.name : editingCourse.category,
    updatedAt: new Date().toLocaleDateString('fa-IR')
  };

  // بروزرسانی استیت اصلی دوره‌ها
  setCourses((previousCourses) =>
    previousCourses.map((course) =>
      course.id === editingCourse.id ? updatedCourse : course
    )
  );

  // بستن مودال و ریست کردن فرم
  setIsEditCourseModalOpen(false);
  setEditingCourse(null);
  setEditCourseForm(emptyCourseForm);
};





// --- هندلرهای سرفصل ---
const handleSaveChapter = (e) => {
  e.preventDefault();
  if (!chapterForm.title.trim()) return;

  const lessonsArray = chapterForm.lessonsText
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line, idx) => ({ id: Date.now() + idx, title: line.trim() }));

  if (chapterForm.id) {
    // ویرایش
    setSyllabi(
      syllabi.map((s) =>
        s.id === chapterForm.id
          ? { ...s, title: chapterForm.title, description: chapterForm.description, lessons: lessonsArray }
          : s
      )
    );
  } else {
    // ثبت جدید
    const newChapter = {
      id: Date.now(),
      courseId: selectedCourseForManage?.id || 1,
      title: chapterForm.title,
      description: chapterForm.description,
      lessons: lessonsArray
    };
    setSyllabi([...syllabi, newChapter]);
  }
  setChapterForm({ id: null, title: '', description: '', lessonsText: '' });
};

const handleEditChapter = (item) => {
  setChapterForm({
    id: item.id,
    title: item.title,
    description: item.description || '',
    lessonsText: item.lessons ? item.lessons.map((l) => l.title).join('\n') : ''
  });
};

const handleDeleteChapter = (id) => {
  if (window.confirm('آیا از حذف این سرفصل مطمئن هستید؟')) {
    setSyllabi(syllabi.filter((s) => s.id !== id));
  }
};

// ۳. هندلر ذخیره و ویرایش محتوا (handleSaveContent)
const handleSaveContent = (e) => {
  e.preventDefault();
  if (!contentForm.title.trim()) return;

  if (contentForm.id) {
    // حالت ویرایش
    setContents(
      contents.map((c) =>
        c.id === contentForm.id
          ? {
              ...c,
              sessionNumber: contentForm.sessionNumber ? Number(contentForm.sessionNumber) : '',
              title: contentForm.title,
              type: contentForm.type,
              description: contentForm.description,
              textContent: contentForm.textContent,
              fileName: contentForm.fileName || c.fileName
            }
          : c
      )
    );
  } else {
    // حالت ثبت جدید
    const newContent = {
      id: Date.now(),
      courseId: selectedCourseForManage?.id || 1,
      sessionNumber: contentForm.sessionNumber ? Number(contentForm.sessionNumber) : '',
      title: contentForm.title,
      type: contentForm.type,
      description: contentForm.description,
      textContent: contentForm.textContent,
      fileName: contentForm.fileName || 'پیوست بدون نام',
      createdAt: new Date().toLocaleDateString('fa-IR')
    };
    setContents([...contents, newContent]);
  }
    // ریست فرم
  setContentForm({
    id: null,
    sessionNumber: '',
    title: '',
    type: 'video',
    description: '',
    textContent: '',
    file: null,
    fileName: ''
  });
};

// ۴. هندلر ویرایش محتوا جهت پر شدن فرم
const handleEditContent = (item) => {
  setContentForm({
    id: item.id,
    sessionNumber: item.sessionNumber || '',
    title: item.title || '',
    type: item.type || 'video',
    description: item.description || '',
    textContent: item.textContent || '',
    file: null,
    fileName: item.fileName || ''
  });
};

const handleDeleteContent = (id) => {
  if (window.confirm('آیا از حذف این محتوا مطمئن هستید؟')) {
    setContents(contents.filter((c) => c.id !== id));
  }
};

// --- هندلرهای سوالات متداول ---
const handleSaveFaq = (e) => {
  e.preventDefault();
  if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

  if (faqForm.id) {
    setFaqs(
      faqs.map((f) =>
        f.id === faqForm.id
          ? { ...f, question: faqForm.question, answer: faqForm.answer }
          : f
      )
    );
  } else {
    setFaqs([
      ...faqs,
      {
        id: Date.now(),
        courseId: selectedCourseForManage?.id || 1,
        question: faqForm.question,
        answer: faqForm.answer
      }
    ]);
  }
  setFaqForm({ id: null, question: '', answer: '' });
};

const handleDeleteFaq = (id) => {
  if (window.confirm('آیا این سوال حذف شود؟')) {
    setFaqs(faqs.filter((f) => f.id !== id));
  }
};









  const handleDeleteCourse = (course) => {
setOpenDropdownId(null);
if (window.confirm(`آیا از حذف دوره "${course.title}" مطمئن هستید؟`)) {
setCourses((prev) => prev.filter((c) => c.id !== course.id));
}
  };

 



  return (
    <div className="admin-page-container">



      {/* ================= ۱. هدر اختصاصی مدیریت دوره‌ها ================= */}
            <header className="admin-page-header">
        {/* سمت راست: عنوان و توضیحات */}
        <div className="d-flex align-items-center gap-3">
          <div className="admin-page-header-icon">
            <FiBookOpen size={26} />
          </div>
          <div className="admin-page-header-text">
            <h1 className="admin-page-title">مدیریت دوره‌ها و دسته‌بندی دوره‌ها</h1>
            <p className="admin-page-subtitle">
              ساختاردهی دوره‌ها، ظرفیت کلاس‌ها و محتوای آموزشی
            </p>
          </div>
        </div>

        {/* سمت چپ: دکمه‌های عملیاتی در یک ردیف منظم */}
        <div className="admin-page-header-actions d-flex align-items-center flex-wrap gap-2">


{/* دکمه جدید: تکالیف و پروژه‌های جلسات دوره */}
          <button
            type="button"
            className="admin-btn-secondary order-5"
            onClick={() => {
              const currentCourse = courses[0] || null;
              setSelectedCourseForManage(currentCourse);
              setAssignmentForm({
                ...initialAssignmentForm,
                courseId: currentCourse?.id || ''
              });
              setIsAssignmentModalOpen(true);
            }}
          >
            <FiCheckSquare size={18} />
            <span>تکالیف و پروژه‌ها</span>
          </button>

          {/* دکمه مدیریت سرفصل‌ها */}
          <button
            type="button"
            className="admin-btn-secondary order-4"
            onClick={() => {
              setSelectedCourseForManage(courses[0] || null);
              setIsSyllabusModalOpen(true);
            }}
          >
            <FiList size={18} />
            <span>مدیریت سرفصل‌ها</span>
          </button>

          {/* دکمه محتوای آموزشی */}
          <button
            type="button"
            className="admin-btn-secondary order-3"
            onClick={() => {
              setSelectedCourseForManage(courses[0] || null);
              setIsContentModalOpen(true);
            }}
          >
            <FiUploadCloud size={18} />
            <span>محتوای آموزشی</span>
          </button>

          {/* دکمه سوالات متداول */}
          <button
            type="button"
            className="admin-btn-secondary order-2"
            onClick={() => {
              setSelectedCourseForManage(courses[0] || null);
              setIsFaqModalOpen(true);
            }}
          >
            <FiHelpCircle size={18} />
            <span>سوالات متداول</span>
          </button>

          {/* دکمه مدیریت دسته‌بندی‌ها */}
          <button
            type="button"
            className="admin-btn-secondary order-1"
            onClick={handleOpenCategoryModal}
          >
            <FiFolder size={18} />
            <span>مدیریت دسته‌بندی‌ها</span>
          </button>

          {/* دکمه اصلی: افزودن دوره جدید */}
          <button
            type="button"
            className="admin-btn-primary order-0"
            onClick={() => setIsAddCourseModalOpen(true)}
          >
            <FiPlus size={20} />
            <span>افزودن دوره جدید</span>
          </button>
        </div>
      </header>





      {/* ================= ۲. کارت‌های آماری تحلیلی دوره‌ها ================= */}
      <div className="admin-stats-grid">
        {/* کارت اول: کل دوره‌های تعریف شده (آبی) */}
          <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
             <FiBookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل دوره‌های آموزشی</span>
            <span className="stat-card-value">{stats.totalCourses} دوره</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۱۰٪ رشد نسبت به فصل قبل
            </span>
          </div>
        </div>

        {/* کارت دوم: دوره‌های فعال در حال برگزاری (سبز) */}
        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">دوره‌های فعال و در حال ثبت‌نام</span>
            <span className="stat-card-value">{stats.activeCourses} دوره</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۸۵٪ نرخ فعال‌سازی
            </span>
          </div>
        </div>

        {/* کارت سوم: دسته‌بندی‌های آموزشی (کهربایی / نارنجی) */}
        <div className="admin-stat-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <FiLayers size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">دسته‌بندی‌های فعال</span>
            <span className="stat-card-value">{stats.totalCategories} دپارتمان</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۲ زیرگروه جدید
            </span>
          </div>
        </div>

        {/* کارت چهارم: دوره‌های دارای مدرک و گواهینامه معتبر (بنفش) */}
        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
           <FiAward size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">دوره‌های با مدرک رسمی</span>
            <span className="stat-card-value">{stats.certifiedCourses} دوره</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> دارای سرتیفیکیت معتبر
            </span>
          </div>
        </div>
      </div>







{/* ===================== سکشن تحلیل آمار و نظرسنجی دوره‌ها ===================== */}
<div className="courses-analytics-section">
  {/* کارت ۱: نمودار دایره‌ای فراوانی ثبت‌نام و سهم درآمد */}
  <div className="analytics-card">
    <div className="analytics-card-header">
      <div className="card-title-wrap">
        <div className="card-icon-badge chart-badge">
          <FiPieChart />
        </div>
        <div>
          <h3>فراوانی دوره‌ها و سهم درآمد</h3>
          <p>توزیع حجم ثبت‌نام و سهم فروش به تفکیک دوره</p>
        </div>
      </div>

      {/* دکمه‌های سوئیچ نمودار */}
      <div className="chart-toggle-tabs">
        <button
          type="button"
          className={`toggle-tab ${chartDataType === "students" ? "active" : ""}`}
          onClick={() => setChartDataType("students")}
        >
          تعداد ثبت‌نام
        </button>
        <button
          type="button"
          className={`toggle-tab ${chartDataType === "revenue" ? "active" : ""}`}
          onClick={() => setChartDataType("revenue")}
        >
          درآمد (تومان)
        </button>
      </div>
    </div>

    <div className="pie-chart-wrapper">
      {courseStatsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={courseStatsData}
              dataKey={chartDataType === "students" ? "students" : "revenue"}
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
            >
              {courseStatsData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                chartDataType === "students"
                  ? `${value.toLocaleString("fa-IR")} نفر`
                  : `${value.toLocaleString("fa-IR")} تومان`,
                chartDataType === "students" ? "ثبت‌نامی‌ها" : "درآمد ناخالص"
              ]}
              contentStyle={{
                backgroundColor: "#1e293b",
                borderRadius: "10px",
                border: "none",
                color: "#fff",
                direction: "rtl",
                fontFamily: "inherit",
                fontSize: "13px"
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: "15px", fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-chart-data">
          <p>داده‌ای برای نمایش نمودار یافت نشد.</p>
        </div>
      )}
    </div>
  </div>

  {/* کارت ۲: خلاصه نظرسنجی و رضایت دانشجویان */}
  <div className="analytics-card">
    <div className="analytics-card-header">
      <div className="card-title-wrap">
        <div className="card-icon-badge survey-badge">
          <FiStar />
        </div>
        <div>
          <h3>خلاصه نظرسنجی و بازخوردها</h3>
          <p>شاخص رضایت دانشجویان بر اساس {surveySummary.totalReviews.toLocaleString("fa-IR")} نظر</p>
        </div>
      </div>

      <div className="rating-pill">
        <FiStar className="star-fill-icon" />
        <span className="rating-val">{surveySummary.overallRating}</span>
        <span className="rating-max">/ ۵</span>
      </div>
    </div>

    <div className="survey-content-wrapper">
      {/* شاخص‌های تفکیکی رضایت */}
      <div className="criteria-list">
        {surveySummary.criteria.map((item, idx) => (
          <div key={idx} className="criterion-item">
            <div className="criterion-info">
              <span>{item.title}</span>
              <span className="criterion-pct">{item.score.toLocaleString("fa-IR")}٪</span>
            </div>
            <div className="criterion-bar-bg">
              <div
                className="criterion-bar-fill"
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* دوره‌های برتر از دید کاربران */}
      <div className="top-courses-feedback">
        <h4 className="top-courses-title">
          <FiAward className="award-icon" /> محبوب‌ترین دوره‌ها بر اساس امتیاز
        </h4>
        <div className="top-courses-list">
          {surveySummary.topRatedCourses.map((c, idx) => (
            <div key={idx} className="top-course-chip">
              <span className="chip-name">{c.name}</span>
              <span className="chip-score">⭐ {c.score} <small>({c.count})</small></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>






      {/* ================= ۵. جدول لیست دوره‌ها ================= */}
      <div className="admin-table-card">



        
        <div className="admin-table-container">


         <div className="admin-filters-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
        {/* باکس جستجو */}
        <div className="admin-search-box" style={{ flex: '1 1 260px' }}>
          <FiSearch className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="جستجو بر اساس عنوان دوره، پیش‌نیاز یا شناسه..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* فیلتر دسته‌بندی دوره */}
        <select
          className="admin-filter-select"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">همه دسته‌بندی‌ها</option>
          {CATEGORIES_LIST.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* فیلتر وضعیت برگزاری */}
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">همه وضعیت‌ها</option>
          <option value="ACTIVE">در حال برگزاری (فعال)</option>
          <option value="INACTIVE">غیرفعال / پایان‌یافته</option>
        </select>

        {/* فیلتر گواهینامه دوره */}
        <select
          className="admin-filter-select"
          value={certificateFilter}
          onChange={(e) => {
            setCertificateFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">وضعیت مدرک (همه)</option>
          <option value="CERTIFIED">دارای گواهینامه معتبر</option>
          <option value="UNCERTIFIED">بدون مدرک رسمی</option>
        </select>

        {/* بخش اکشن‌های فیلتر: ریست و خروجی اکسل */}
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
            onClick={handleExportExcel}
            title="دریافت خروجی اکسل"
          >
            <FiDownload />
            <span>خروجی اکسل</span>
          </button>
        </div>
          </div>



                 {/* نوار کنترل بالای جدول؛ انتخاب دسته‌جمعی دوره‌ها */}
                <div className="table-toolbar-bar">
  <div className="table-toolbar-left">
   

    {selectedIds.length > 0 && (
      <span className="selection-info-tag">
        {selectedIds.length} دوره انتخاب شده 
      </span>
    )}
  </div>

  {selectedIds.length > 0 && (
    <button
      type="button"
      className="bulk-delete-btn"
      onClick={() => setIsBulkDeleteModalOpen(true)}
    >
      <FiTrash2 size={15} />
      <span>
        غیرفعال‌سازی ‌   {selectedIds.length} دوره
      </span>
    </button>
  )}
             </div>



          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="admin-checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>عنوان دوره</th>
                <th className="hide-on-mobile-tablet">دسته‌بندی</th>
                <th className="hide-on-mobile-tablet">پیش‌نیاز دوره</th>
                <th className="hide-on-mobile-tablet">گواهینامه دوره</th>
                <th>تعداد ثبت‌نام</th>
                <th className="hide-on-mobile-tablet">میزان رضایت</th>
                <th className="hide-on-mobile-tablet">وضعیت دوره</th>
                <th style={{ width: '80px' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course) => {
                  const isSelected = selectedIds.includes(course.id);
                  const isDropdownOpen = openDropdownId === course.id;

                  return (
                    <tr key={course.id} className={isSelected ? 'selected-row' : ''}>
                      {/* چک‌باکس ردیف */}
                      <td style={{ textAlign: 'center' }}>
                        <input
  type="checkbox"
  checked={selectedIds.includes(course.id)}
  onChange={() => handleSelectRow(course.id)}
/>

                      </td>

                      {/* عنوان دوره */}
                      <td>
                        <div className="user-profile-cell">
                         
                          <div className="user-profile-info">
                            <span className="user-name" style={{ fontWeight: 600 }}>
                              {course.title}
                            </span>
                            
                          </div>
                        </div>
                      </td>

                      {/* دسته‌بندی دوره */}
                      <td className="hide-on-mobile-tablet">
                        <span
                          style={{
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 500
                          }}
                        >
                          {course.category}
                        </span>
                      </td>

                      {/* پیش‌نیاز دوره */}
                      <td className="hide-on-mobile-tablet">
                        <span style={{ fontSize: '13px', color: '#475569' }}>
                          {course.prerequisites || 'ندارد'}
                        </span>
                      </td>

                      {/* گواهینامه دوره */}
                      <td className="hide-on-mobile-tablet">
                        {course.hasCertificate ? (
                          <span className="admin-status-badge active" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <FiAward size={13} />
                            دارد (معتبر)
                          </span>
                        ) : (
                          <span className="admin-status-badge inactive">
                            ندارد
                          </span>
                        )}
                      </td>

                      {/* تعداد ثبت‌نام دوره */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: 600 }}>
                          <FiUsers size={15} color="#6366f1" />
                          <span>{course.enrolledCount} نفر</span>
                        </div>
                      </td>

                      {/* میزان رضایت از دوره */}
                      <td className="hide-on-mobile-tablet">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: 600 }}>
                          <FiStar size={15} fill="#eab308" />
                          <span>{course.satisfactionRate}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>/ ۵</span>
                        </div>
                      </td>

                      {/* وضعیت دوره */}
                      <td className="hide-on-mobile-tablet">
                        {course.status === 'ACTIVE' || course.status === 'active' ? (
                          <span className="admin-status-badge active">
                            در حال برگزاری
                          </span>
                        ) : (
                          <span className="admin-status-badge inactive">
                            غیرفعال
                          </span>
                        )}
                      </td>

                      {/* ستون منوی عملیات سه‌گانه */}
                      {/* ستون عملیات - کاملاً منطبق با ساختار کادر */}
{/* ستون عملیات */}
<td>
  <div
    className="admin-actions-group"
    style={{ justifyContent: 'center' }}
  >
    {/* مشاهده جزئیات */}
    <button
      className="admin-action-btn btn-details"
      title="مشاهده جزئیات کامل دوره"
      onClick={() => handleOpenCourseDetails(getCourseDetails(course))}
    >
      <FiInfo size={16} />
    </button>

    {/* ویرایش دوره */}
    <button
  className="admin-action-btn btn-password"
                          style={{ color: '#d97706', background: '#fef3c7' }}
  onClick={() => handleEditCourse(course)}
  title="ویرایش دوره"
>
 <BiEdit size={16} /></button>


    {/* فعال یا غیرفعال‌سازی دوره */}
    <button
      className="admin-action-btn"
      style={{
        color:
          course.status === 'ACTIVE'
            ? '#ef4444'
            : '#10b981',

        background:
          course.status === 'ACTIVE'
            ? '#fef2f2'
            : '#ecfdf5'
      }}
      title={
        course.status === 'ACTIVE'
          ? 'غیرفعال‌سازی دوره'
          : 'فعال‌سازی مجدد دوره'
      }
      onClick={() => handleToggleCourseStatus(course)}
    >
      {course.status === 'ACTIVE' ? (
        <FiTrash2 size={15} />
      ) : (
        <FiCheckCircle size={15} />
      )}
    </button>
  </div>
</td>


                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#94a3b8' }}>
                      <FiFileText size={36} />
                      <span>هیچ دوره‌ای مطابق فیلترهای انتخابی یافت نشد.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>






{/* ================= مودال مدیریت دسته‌بندی ================= */}
{isCategoryModalOpen && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-container large category-modal-container">
      {/* هدر مودال */}
      <div className="admin-modal-header">
        <h3 className="admin-modal-title">
          <FiFolder style={{ marginLeft: '8px', verticalAlign: 'middle', color: '#3b82f6' }} />
          مدیریت دسته‌بندی‌های دوره‌ها
        </h3>
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => {
            setIsCategoryModalOpen(false);
            resetCategoryForm();
          }}
        >
          <FiX />
        </button>
      </div>

      {/* بدنه مودال */}
      <div className="admin-modal-body category-modal-body">
        <div className="category-modal-layout">
          
          {/* بخش اول: لیست دسته‌بندی‌های موجود */}
          <div className="category-modal-list-section">
            <h4 className="category-section-title">
              دسته‌بندی‌های موجود ({categories.length})
            </h4>
            <div className="category-items-scroll">
              {categories.length === 0 ? (
                <div className="category-empty-state">
                  هیچ دسته‌بندی‌ای یافت نشد.
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`category-item-card ${editingCategoryId === cat.id ? 'is-editing' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {cat.iconImage ? (
                        <img
                          src={cat.iconImage}
                          alt={cat.name}
                          className="category-item-thumb"
                        />
                      ) : (
                        <div className="category-item-thumb-placeholder">
                          <FiFolder size={18} color="#64748b" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                          {cat.name}
                        </div>
                        {cat.displayOrder !== undefined && (
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            ترتیب: {cat.displayOrder}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* دکمه‌های عملیات */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleEditCategory(cat)}
                        className="admin-btn-icon edit btn btn-success"
                        title="ویرایش"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="admin-btn-icon delete btn btn-danger"
                        title="حذف"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* بخش دوم: فرم اضافه / ویرایش */}
          <div className="category-modal-form-section">
            <h4 className="category-section-title">
              {editingCategoryId ? 'ویرایش دسته‌بندی' : 'تعریف دسته‌بندی جدید'}
            </h4>
            <form onSubmit={handleSaveCategory}>
              <div className="admin-form-group">
                <label className="admin-label">نام دسته‌بندی *</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="مثال: برنامه‌نویسی وب"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="category-form-row">
                {/* آپلود تصویر */}
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label className="admin-label">تصویر / آیکون دسته‌بندی</label>
                  <div
                    className="category-uploader-box"
                    onClick={() => document.getElementById('category-icon-input').click()}
                  >
                    {categoryFormData.iconImage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                        <img
                          src={categoryFormData.iconImage}
                          alt="preview"
                          style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '12px', color: '#16a34a', flex: 1 }}>تصویر انتخاب شد ✓</span>
                        <button
                          type="button"
                          className="admin-btn-icon delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryFormData({ ...categoryFormData, iconImage: null });
                          }}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <FiImage size={24} color="#94a3b8" />
                        <span style={{ fontSize: '12px', color: '#64748b' }}>کلیک برای آپلود تصویر</span>
                      </div>
                    )}
                    <input
                      id="category-icon-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleCategoryIconUpload}
                    />
                  </div>
                </div>

                {/* ترتیب نمایش */}
                <div className="admin-form-group" style={{ width: '110px' }}>
                  <label className="admin-label" >ترتیب نمایش</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={categoryFormData.displayOrder || 0}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, displayOrder: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* توضیحات */}
              <div className="admin-form-group">
                <label className="admin-label">توضیح مختصر</label>
                <textarea
                  className="admin-input"
                  rows={2}
                  placeholder="توضیح کوتاه درباره این دسته..."
                  value={categoryFormData.shortDesc || ''}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, shortDesc: e.target.value })}
                />
              </div>

              {/* دکمه‌ها */}
              <div className="category-form-buttons">
                <button type="submit" className="admin-btn admin-btn-primary">
                  <FiCheck style={{ marginLeft: '6px' }} />
                  {editingCategoryId ? 'ذخیره تغییرات' : 'ثبت دسته‌بندی'}
                </button>
                {editingCategoryId && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-outline"
                    onClick={resetCategoryForm}
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
)}







{/* ================= مودال افزودن دوره جدید ================= */}
{isAddCourseModalOpen && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-container large" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
      
      <div className="admin-modal-header">
        <h3 className="admin-modal-title">
          <FiPlus style={{ marginLeft: '8px' }} />
          تعریف دوره آموزشی جدید
        </h3>
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => setIsAddCourseModalOpen(false)}
        >
          <FiX size={20} />
        </button>
      </div>












           <form onSubmit={handleSaveCourse}>
        <div className="admin-modal-body" style={{ padding: '20px' }}>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* عنوان دوره */}
            <div className="admin-form-group full-width" style={{ gridColumn: 'span 2' }}>
              <label>عنوان دوره آموزشی <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: آموزش جامع React و Next.js"
                value={courseFormData.title}
                onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                required
              />
            </div>

            {/* شناسه دسته‌بندی */}
            <div className="admin-form-group">
              <label>دسته‌بندی دوره <span style={{ color: 'red' }}>*</span></label>
              <select
                className="admin-input"
                value={courseFormData.categoryId}
                onChange={(e) => setCourseFormData({ ...courseFormData, categoryId: e.target.value })}
                required
              >
                <option value="">انتخاب دسته‌بندی...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* پیش‌نیاز */}
            <div className="admin-form-group">
              <label>پیش‌نیازهای دوره</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: HTML, CSS, JavaScript"
                value={courseFormData.prerequisites}
                onChange={(e) => setCourseFormData({ ...courseFormData, prerequisites: e.target.value })}
              />
            </div>

            {/* توضیح اولیه */}
            <div className="admin-form-group">
              <label>توضیح اولیه (معرفی کوتاه)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="توضیح مختصر دوره برای کارت‌ها"
                value={courseFormData.initialDesc}
                onChange={(e) => setCourseFormData({ ...courseFormData, initialDesc: e.target.value })}
              />
            </div>

            {/* توضیح ثانویه */}
            <div className="admin-form-group">
              <label>توضیح ثانویه</label>
              <input
                type="text"
                className="admin-input"
                placeholder="توضیحات تکمیلی یا مخاطبین دوره"
                value={courseFormData.secondaryDesc}
                onChange={(e) => setCourseFormData({ ...courseFormData, secondaryDesc: e.target.value })}
              />
            </div>

            {/* ۱. شهریه دوره */}
            <div className="admin-form-group">
              <label>شهریه دوره (تومان)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 4,000,000"
                value={courseFormData.tuition}
                onChange={(e) => setCourseFormData({ ...courseFormData, tuition: e.target.value })}
              />
            </div>

            {/* ۲. تعداد جلسات دوره */}
            <div className="admin-form-group">
              <label>تعداد جلسات دوره</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 20 جلسه"
                value={courseFormData.sessionsCount}
                onChange={(e) => setCourseFormData({ ...courseFormData, sessionsCount: e.target.value })}
              />
            </div>

            {/* ۳. ساعت دوره (مدت زمان) */}
            <div className="admin-form-group">
              <label>ساعت دوره (مدت زمان)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 45 ساعت"
                value={courseFormData.durationHours}
                onChange={(e) => setCourseFormData({ ...courseFormData, durationHours: e.target.value })}
              />
            </div>

            {/* عکس دوره */}
            <div className="admin-form-group">
              <label>عکس دوره (URL یا تصویر)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="آدرس تصویر یا Data URL"
                value={courseFormData.image}
                onChange={(e) => setCourseFormData({ ...courseFormData, image: e.target.value })}
              />
            </div>

            {/* محتوای آموزشی دارد یا نه */}
            <div className="admin-form-group">
              <label>محتوای آموزشی آنلاین دارد؟</label>
              <select
                className="admin-input"
                value={courseFormData.hasLearningContent ? 'true' : 'false'}
                onChange={(e) => setCourseFormData({ ...courseFormData, hasLearningContent: e.target.value === 'true' })}
              >
                <option value="true">بله، دارای سرفصل و ویدئو</option>
                <option value="false">خیر (صرفاً کارگاهی / حضوری)</option>
              </select>
            </div>

            {/* گواهینامه */}
            <div className="admin-form-group">
              <label>اعطای گواهینامه پایان دوره</label>
              <select
                className="admin-input"
                value={courseFormData.hasCertificate ? 'true' : 'false'}
                onChange={(e) => setCourseFormData({ ...courseFormData, hasCertificate: e.target.value === 'true' })}
              >
                <option value="true">دارای گواهینامه معتبر</option>
                <option value="false">بدون گواهینامه</option>
              </select>
            </div>

            {/* توضیح کامل */}
            <div className="admin-form-group full-width" style={{ gridColumn: 'span 2' }}>
              <label>توضیح کامل و اهداف آموزشی دوره</label>
              <textarea
                className="admin-input"
                rows="4"
                placeholder="شرح کامل سرفصل‌ها، پروژه‌ها و اهداف آموزشی..."
                value={courseFormData.fullDesc}
                onChange={(e) => setCourseFormData({ ...courseFormData, fullDesc: e.target.value })}
              />
            </div>

          </div>
        </div>

        {/* دکمه‌های ثبت و انصراف */}
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => setIsAddCourseModalOpen(false)}
          >
            انصراف
          </button>
          <button type="submit" className="admin-btn admin-btn-primary">
            <FiCheck size={16} />
            <span>ثبت نهایی دوره</span>
          </button>
        </div>
      </form>





















    </div>
  </div>
)}











{/* ================= مودال جزئیات کامل دوره ================= */}
{isCourseDetailsModalOpen && activeCourse && (
  <div className="admin-modal-overlay">
    <div
      className="admin-modal-container course-details-modal"
      style={{
        width: 'min(1180px, 96vw)',
        maxWidth: '1180px',
        maxHeight: '94vh',
        overflowY: 'auto'
      }}
    >
      {/* هدر مودال */}
      <div className="admin-modal-header">
        <div>
          <h3 className="admin-modal-title">
            <FiBookOpen style={{ marginLeft: '8px' }} />
            پرونده مدیریتی دوره
          </h3>

          <p
            style={{
              margin: '6px 0 0',
              color: '#64748b',
              fontSize: '13px'
            }}
          >
            مشاهده اطلاعات آموزشی، مالی و آماری دوره
          </p>
        </div>

        <button
          type="button"
          className="admin-modal-close"
          onClick={handleCloseCourseDetails}
        >
          <FiX size={20} />
        </button>
      </div>

      <div
        className="admin-modal-body"
        style={{ padding: '22px' }}
      >
        {/* معرفی دوره */}
        <section className="course-details-hero">
          <div className="course-details-image">
            {activeCourse.image ? (
              <img
                src={activeCourse.image}
                alt={activeCourse.title}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <FiBookOpen size={42} />
            )}
          </div>

          <div className="course-details-main-info">
            <div className="course-title-row">
              <h2>{activeCourse.title}</h2>

              <span
                className={`admin-status-badge ${
                  activeCourse.status === 'ACTIVE'
                    ? 'status-active'
                    : 'status-inactive'
                }`}
              >
                {activeCourse.status === 'ACTIVE'
                  ? 'فعال'
                  : 'غیرفعال'}
              </span>
            </div>

            <p className="course-details-description">
              {activeCourse.fullDesc ||
                activeCourse.secondaryDesc ||
                activeCourse.initialDesc ||
                'برای این دوره توضیحی ثبت نشده است.'}
            </p>

            <div className="course-meta-list">
              <span>
                <FiLayers />
                دسته‌بندی: {activeCourse.category || 'عمومی'}
              </span>

              <span>
                <FiAward />
                سطح: {activeCourse.level}
              </span>

              <span>
                <FiClock />
                مدت دوره: {activeCourse.duration}
              </span>

              <span>
                <FiCalendar />
                تاریخ شروع: {activeCourse.startDate}
              </span>
            </div>
          </div>
        </section>

        {/* کارت‌های آماری */}
        <section className="course-kpi-grid">
          <div className="course-kpi-card blue">
            <div className="course-kpi-icon">
              <FiUsers />
            </div>
            <div>
              <span>تعداد هنرجویان</span>
              <strong>
                {Number(activeCourse.studentsCount || 0).toLocaleString(
                  'fa-IR'
                )}
              </strong>
              <small>
                ظرفیت: {Number(activeCourse.capacity || 0).toLocaleString(
                  'fa-IR'
                )}{' '}
                نفر
              </small>
            </div>
          </div>

          <div className="course-kpi-card green">
            <div className="course-kpi-icon">
              <FiDollarSign />
            </div>
            <div>
              <span>شهریه دریافت‌شده</span>
              <strong>
                {Number(
                  activeCourse.receivedTuition || 0
                ).toLocaleString('fa-IR')}{' '}
                تومان
              </strong>
              <small>مجموع پرداخت‌های ثبت‌شده</small>
            </div>
          </div>

          <div className="course-kpi-card orange">
            <div className="course-kpi-icon">
              <FiAlertCircle />
            </div>
            <div>
              <span>شهریه معوق</span>
              <strong>
                {Number(
                  activeCourse.pendingTuition || 0
                ).toLocaleString('fa-IR')}{' '}
                تومان
              </strong>
              <small>مبلغ باقی‌مانده هنرجویان</small>
            </div>
          </div>

          <div className="course-kpi-card purple">
            <div className="course-kpi-icon">
              <FiBarChart2 />
            </div>
            <div>
              <span>پیشرفت برگزاری</span>
              <strong>
                {activeCourse.sessionsCount
                  ? Math.round(
                      (activeCourse.completedSessions /
                        activeCourse.sessionsCount) *
                        100
                    )
                  : 0}
                ٪
              </strong>
              <small>
                {activeCourse.completedSessions || 0} از{' '}
                {activeCourse.sessionsCount || 0} جلسه
              </small>
            </div>
          </div>
        </section>

        {/* اطلاعات اصلی در دو ستون */}
        <div className="course-details-columns">
          {/* مشخصات آموزشی */}
          <section className="course-info-panel">
            <div className="course-panel-header">
              <h4>
                <FiBookOpen />
                مشخصات آموزشی
              </h4>
            </div>

            <div className="course-info-grid">
              <div>
                <label>نام دوره</label>
                <strong>{activeCourse.title}</strong>
              </div>

              <div>
                <label>دسته‌بندی</label>
                <strong>{activeCourse.category || 'عمومی'}</strong>
              </div>

              <div>
                <label>سطح دوره</label>
                <strong>{activeCourse.level}</strong>
              </div>

              <div>
                <label>مدت دوره</label>
                <strong>{activeCourse.duration}</strong>
              </div>

              <div>
                <label>تعداد جلسات</label>

              <div>
                <div>
  <label>تعداد جلسات</label>
  <strong>
{Number(activeCourse.sessionsCount || 0).toLocaleString('fa-IR')} جلسه
  </strong>
</div>

              </div>

              <div>
                <label>گواهینامه</label>
                <strong>
                  {activeCourse.hasCertificate
                    ? 'دارد'
                    : 'ندارد'}
                </strong>
              </div>

              <div>
                <label>محتوای آموزشی</label>
                <strong>
                  {activeCourse.hasLearningContent
                    ? 'دارد'
                    : 'ندارد'}
                </strong>
              </div>

              <div>
                <label>پیش‌نیاز</label>
                <strong>
                  {activeCourse.prerequisites || 'بدون پیش‌نیاز'}
                </strong>
              </div>
            </div>
            </div>
          </section>

          {/* اساتید دوره */}
          <section className="course-info-panel">
            <div className="course-panel-header">
              <h4>
                <FiUser />
                اساتید دوره
              </h4>
            </div>

            <div className="course-teachers-list">
              {activeCourse.teachers?.length ? (
                activeCourse.teachers.map((teacher) => (
                  <div
                    className="course-teacher-item"
                    key={teacher.id || teacher.name}
                  >
                    <div className="teacher-avatar">
                      {teacher.avatar ? (
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                        />
                      ) : (
                        <FiUser />
                      )}
                    </div>

                    <div>
                      <strong>{teacher.name}</strong>
                      <span>
                        {teacher.specialization ||
                          'مدرس دوره'}
                      </span>
                    </div>

                    <small>
                      {teacher.sessionsCount || 0} جلسه
                    </small>
                  </div>
                ))
              ) : (
                <div className="course-empty-state">
                  استادی برای این دوره ثبت نشده است.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* نمودارها */}
        <div className="course-charts-grid">
          {/* نمودار درآمد ماهانه */}
          <section className="course-chart-panel">
            <div className="course-panel-header">
              <h4>
                <FiBarChart2 />
                روند درآمد دوره
              </h4>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart
                  data={activeCourse.monthlyRevenue}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) =>
                      `${Number(value / 1000000).toFixed(1)}م`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toLocaleString(
                        'fa-IR'
                      )} تومان`,
                      'درآمد'
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#2563eb'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* وضعیت هنرجویان */}
          <section className="course-chart-panel">
            <div className="course-panel-header">
              <h4>
                <FiUsers />
                وضعیت هنرجویان
              </h4>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={activeCourse.studentStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={88}
                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }
                  >
                    {activeCourse.studentStatus.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ['#10b981', '#2563eb', '#ef4444'][
                              index % 3
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    height={30}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* زیرمجموعه دوره‌ها */}
        <section className="course-info-panel">
          <div className="course-panel-header">
            <h4>
              <FiLayers />
              زیرمجموعه‌ها و دوره‌های مرتبط
            </h4>
          </div>

          {activeCourse.subCourses?.length ? (
            <div className="sub-courses-grid">
              {activeCourse.subCourses.map((subCourse) => (
                <div
                  className="sub-course-card"
                  key={subCourse.id || subCourse.title}
                >
                  <div>
                    <strong>{subCourse.title}</strong>
                    <span>
                      {subCourse.type || 'دوره مرتبط'}
                    </span>
                  </div>

                  <div>
                    <small>
                      هنرجو:{' '}
                      {Number(
                        subCourse.studentsCount || 0
                      ).toLocaleString('fa-IR')}
                    </small>

                    <small>
                      وضعیت:{' '}
                      {subCourse.status === 'ACTIVE'
                        ? 'فعال'
                        : 'غیرفعال'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="course-empty-state">
              برای این دوره زیرمجموعه‌ای ثبت نشده است.
            </div>
          )}
        </section>

        {/* توضیحات کامل */}
        <section className="course-info-panel">
          <div className="course-panel-header">
            <h4>
              <FiBookOpen />
              توضیحات کامل و اهداف آموزشی
            </h4>
          </div>

          <p className="course-full-description">
            {activeCourse.fullDesc ||
              'توضیحات کاملی برای این دوره ثبت نشده است.'}
          </p>
        </section>
      </div>

      {/* پاورقی */}
      <div className="admin-modal-footer">
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={handleCloseCourseDetails}
        >
          بستن
        </button>
      </div>
    </div>
  </div>
)}






{/* ================= مودال ویرایش کامل دوره ================= */}
{isEditCourseModalOpen && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-container large" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
      
      <div className="admin-modal-header">
        <h3 className="admin-modal-title">
          <FiEdit style={{ marginLeft: '8px' }} />
          ویرایش دوره آموزشی
        </h3>
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => {
            setIsEditCourseModalOpen(false);
            setEditingCourse(null);
          }}
        >
          <FiX size={20} />
        </button>
      </div>

      <form onSubmit={handleUpdateCourse}>
        <div className="admin-modal-body" style={{ padding: '20px' }}>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* عنوان دوره */}
            <div className="admin-form-group full-width" style={{ gridColumn: 'span 2' }}>
              <label>عنوان دوره آموزشی <span style={{ color: 'red' }}>*</span></label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: آموزش جامع React و Next.js"
                value={editCourseForm.title}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                required
              />
            </div>

            {/* شناسه دسته‌بندی */}
            <div className="admin-form-group">
              <label>دسته‌بندی دوره <span style={{ color: 'red' }}>*</span></label>
              <select
                className="admin-input"
                value={editCourseForm.categoryId}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, categoryId: e.target.value })}
                required
              >
                <option value="">انتخاب دسته‌بندی...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* پیش‌نیاز */}
            <div className="admin-form-group">
              <label>پیش‌نیازهای دوره</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: HTML, CSS, JavaScript"
                value={editCourseForm.prerequisites}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, prerequisites: e.target.value })}
              />
            </div>

            {/* توضیح اولیه */}
            <div className="admin-form-group">
              <label>توضیح اولیه (معرفی کوتاه)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="توضیح مختصر دوره برای کارت‌ها"
                value={editCourseForm.initialDesc}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, initialDesc: e.target.value })}
              />
            </div>

            {/* توضیح ثانویه */}
            <div className="admin-form-group">
              <label>توضیح ثانویه</label>
              <input
                type="text"
                className="admin-input"
                placeholder="توضیحات تکمیلی یا مخاطبین دوره"
                value={editCourseForm.secondaryDesc}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, secondaryDesc: e.target.value })}
              />
            </div>

            {/* ۱. شهریه دوره */}
            <div className="admin-form-group">
              <label>شهریه دوره (تومان)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 4,000,000"
                value={editCourseForm.tuition}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, tuition: e.target.value })}
              />
            </div>

            {/* ۲. تعداد جلسات دوره */}
            <div className="admin-form-group">
              <label>تعداد جلسات دوره</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 20 جلسه"
                value={editCourseForm.sessionsCount}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, sessionsCount: e.target.value })}
              />
            </div>

            {/* ۳. ساعت دوره (مدت زمان) */}
            <div className="admin-form-group">
              <label>ساعت دوره (مدت زمان)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="مثال: 45 ساعت"
                value={editCourseForm.durationHours}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, durationHours: e.target.value })}
              />
            </div>

            {/* عکس دوره */}
            <div className="admin-form-group">
              <label>عکس دوره (URL یا تصویر)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="آدرس تصویر یا Data URL"
                value={editCourseForm.image}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, image: e.target.value })}
              />
            </div>

            {/* محتوای آموزشی دارد یا نه */}
            <div className="admin-form-group">
              <label>محتوای آموزشی آنلاین دارد؟</label>
              <select
                className="admin-input"
                value={editCourseForm.hasLearningContent ? 'true' : 'false'}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, hasLearningContent: e.target.value === 'true' })}
              >
                <option value="true">بله، دارای سرفصل و ویدئو</option>
                <option value="false">خیر (صرفاً کارگاهی / حضوری)</option>
              </select>
            </div>

            {/* گواهینامه */}
            <div className="admin-form-group">
              <label>اعطای گواهینامه پایان دوره</label>
              <select
                className="admin-input"
                value={editCourseForm.hasCertificate ? 'true' : 'false'}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, hasCertificate: e.target.value === 'true' })}
              >
                <option value="true">دارای گواهینامه معتبر</option>
                <option value="false">بدون گواهینامه</option>
              </select>
            </div>

            {/* توضیح کامل */}
            <div className="admin-form-group full-width" style={{ gridColumn: 'span 2' }}>
              <label>توضیح کامل و اهداف آموزشی دوره</label>
              <textarea
                className="admin-input"
                rows="4"
                placeholder="شرح کامل سرفصل‌ها، پروژه‌ها و اهداف آموزشی..."
                value={editCourseForm.fullDesc}
                onChange={(e) => setEditCourseForm({ ...editCourseForm, fullDesc: e.target.value })}
              />
            </div>

          </div>
        </div>

        {/* دکمه‌های ثبت و انصراف */}
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-outline"
            onClick={() => {
              setIsEditCourseModalOpen(false);
              setEditingCourse(null);
            }}
          >
            انصراف
          </button>
          <button type="submit" className="admin-btn admin-btn-primary">
            <FiSave size={16} />
            <span>ذخیره تغییرات دوره</span>
          </button>
        </div>
      </form>

    </div>
  </div>
)}








{/* مودال تغییر وضعیت (فعال / غیرفعال سازی) */}
{isStatusModalOpen && activeCourse && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-container small" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px' }}>
      <h3 style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '12px', color: '#1e293b' }}>
        {activeCourse.isActive ? 'تغییر وضعیت به غیرفعال' : 'فعال‌سازی مجدد دوره'}
      </h3>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>
        آیا از {activeCourse.isActive ? 'غیرفعال کردن' : 'فعال‌سازی مجدد'} دوره «<strong>{activeCourse.title}</strong>» اطمینان دارید؟
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          type="button"
          className="admin-btn admin-btn-outline"
          onClick={() => setIsStatusModalOpen(false)}
        >
          انصراف
        </button>
        {/* دکمه فعال‌سازی / غیرفعال‌سازی هوشمند */}
{/* دکمه فعال‌سازی / غیرفعال‌سازی هوشمند */}
<button
  type="button"
  className={`dropdown-item ${
    String(course.status).toLowerCase() === "active" || course.status === "فعال" || course.isActive
      ? "text-danger"
      : "text-success"
  }`}
  onClick={() => handleToggleCourseStatus(course.id)}
>
  {String(course.status).toLowerCase() === "active" || course.status === "فعال" || course.isActive ? (
    <>
      <FiSlash className="dropdown-icon" />
      <span>غیرفعال کردن</span>
    </>
  ) : (
    <>
      <FiCheckCircle className="dropdown-icon" />
      <span>فعال کردن</span>
    </>
  )}
</button>


      </div>
    </div>
  </div>
)}













{/* ============================================================ */}
{/* مودال ۱: مدیریت سرفصل‌ها و زیرفصل‌ها */}
{/* ============================================================ */}
{isSyllabusModalOpen && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-content w-75 bg-white" style={{ maxWidth: '950px' }}>
      <div className="admin-modal-header d-flex justify-content-between align-items-center">
        <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
          <FiList className="text-primary" />
          مدیریت سرفصل‌های دوره: {selectedCourseForManage?.title || 'انتخاب دوره'}
        </h5>
        <button type="button" className="btn-close" onClick={() => setIsSyllabusModalOpen(false)}></button>
      </div>

      <div className="admin-modal-body p-3">
        {/* انتخاب دوره */}
        <div className="mb-3">
          <label className="form-label fw-bold small">انتخاب دوره جهت مدیریت سرفصل‌ها:</label>
          <select
            className="form-select"
            value={selectedCourseForManage?.id || ''}
            onChange={(e) => {
              const c = courses.find((item) => item.id === Number(e.target.value));
              setSelectedCourseForManage(c);
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          {/* ستون راست: فرم ثبت / ویرایش فصل */}
          <div className="col-12 col-lg-5">
            <div className="border rounded-3 p-3 bg-light">
              <h6 className="fw-bold mb-3">{chapterForm.id ? 'ویرایش فصل' : 'افزودن سرفصل جدید'}</h6>
              <form onSubmit={handleSaveChapter}>
                <div className="mb-2">
                  <label className="form-label small">عنوان سرفصل (فصل):</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: فصل اول - آشنایی با مبانی"
                    value={chapterForm.title}
                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label small">توضیح مختصر فصل:</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="توضیحات درباره اهداف این سرفصل..."
                    value={chapterForm.description}
                    onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">زیرفصل‌ها (هر زیرفصل در یک خط):</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="درس اول: نصب ابزارها&#10;درس دوم: نوشتن اولین برنامه&#10;درس سوم: متغیرها"
                    value={chapterForm.lessonsText}
                    onChange={(e) => setChapterForm({ ...chapterForm, lessonsText: e.target.value })}
                  />
                  <small className="text-muted">با زدن Enter زیرفصل بعدی را وارد کنید.</small>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary btn-sm flex-fill">
                    {chapterForm.id ? 'ذخیره تغییرات فصل' : 'ثبت سرفصل'}
                  </button>
                  {chapterForm.id && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setChapterForm({ id: null, title: '', description: '', lessonsText: '' })}
                    >
                      انصراف
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* ستون چپ: لیست سرفصل‌های ثبت شده */}
          <div className="col-12 col-lg-7">
            <h6 className="fw-bold mb-3">سرفصل‌های ثبت‌شده این دوره:</h6>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {syllabi.filter((s) => s.courseId === selectedCourseForManage?.id).length === 0 ? (
                <div className="alert alert-secondary text-center small">هنوز سرفصلی برای این دوره ثبت نشده است.</div>
              ) : (
                syllabi
                  .filter((s) => s.courseId === selectedCourseForManage?.id)
                  .map((item, idx) => (
                    <div key={item.id} className="border rounded-3 p-3 bg-white shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-primary">{idx + 1}. {item.title}</span>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm p-1"
                            onClick={() => handleEditChapter(item)}
                            title="ویرایش"
                          >
                            <BiEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1"
                            onClick={() => handleDeleteChapter(item.id)}
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {item.description && <p className="text-muted small mb-2">{item.description}</p>}
                      {item.lessons && item.lessons.length > 0 && (
                        <ul className="list-group list-group-flush small border-top pt-2">
                          {item.lessons.map((lesson) => (
                            <li key={lesson.id} className="list-group-item px-1 py-1 d-flex justify-content-between align-items-center bg-transparent">
                              <span>• {lesson.title}</span>
                              {lesson.duration && <span className="badge bg-light text-secondary">{lesson.duration}</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}







{/* مودال ۲: آپلود و مدیریت محتوای آموزشی (فیلم، صوت، متن، PDF و Word) */}
{/* ============================================================ */}
{isContentModalOpen && (
  <div className="admin-modal-overlay">
    <div className="admin-modal-content w-75 bg-white" style={{ maxWidth: '950px' }}>
      <div className="admin-modal-header d-flex justify-content-between align-items-center">
        <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
          <FiUploadCloud className="text-success" />
          مدیریت فایل و محتوای آموزشی: {selectedCourseForManage?.title || 'انتخاب دوره'}
        </h5>
        <button type="button" className="btn-close" onClick={() => setIsContentModalOpen(false)}></button>
      </div>

      <div className="admin-modal-body p-3">
        {/* انتخاب دوره */}
        <div className="mb-3">
          <label className="form-label fw-bold small">دوره مورد نظر:</label>
          <select
            className="form-select"
            value={selectedCourseForManage?.id || ''}
            onChange={(e) => {
              const c = courses.find((item) => item.id === Number(e.target.value));
              setSelectedCourseForManage(c);
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          {/* فرم آپلود / ثبت */}
          <div className="col-12 col-lg-5">
            <div className="border rounded-3 p-3 bg-light">
              <h6 className="fw-bold mb-3">{contentForm.id ? 'ویرایش محتوا' : 'بارگذاری محتوای جدید'}</h6>
              <form onSubmit={handleSaveContent}>
                
                {/* فیلد شماره جلسه دوره */}
                <div className="row g-2 mb-2">
                  <div className="col-5">
                    <label className="form-label small">شماره جلسه:</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={contentForm.sessionNumber}
                      onChange={(e) => setContentForm({ ...contentForm, sessionNumber: e.target.value })}
                    />
                  </div>
                  <div className="col-7">
                    <label className="form-label small">نوع محتوا:</label>
                    <select
                      className="form-select"
                      value={contentForm.type}
                      onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}
                    >
                      <option value="video">ویدیو (MP4 / MKV)</option>
                      <option value="audio">فایل صوتی (MP3 / Voice)</option>
                      <option value="pdf">فایل PDF</option>
                      <option value="doc">فایل Word (DOCX)</option>
                      <option value="text">متن آموزشی اختصاصی</option>
                    </select>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label small">عنوان محتوا یا درس: <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: جزوه درس اول یا ویدیوی جلسه دوم"
                    value={contentForm.title}
                    onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                    required
                  />
                </div>

                {contentForm.type === 'text' ? (
                  <div className="mb-2">
                    <label className="form-label small">متن آموزشی:</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="متن کامل درس یا نکات را اینجا وارد نمایید..."
                      value={contentForm.textContent}
                      onChange={(e) => setContentForm({ ...contentForm, textContent: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="mb-2">
                    <label className="form-label small">پیوست فایل (ویدیو، صوت، PDF، ورد):</label>
                    <input
                      type="file"
                      className="form-control"
                      accept={
                        contentForm.type === 'video'
                          ? 'video/*'
                          : contentForm.type === 'audio'
                          ? 'audio/*'
                          : contentForm.type === 'pdf'
                          ? '.pdf'
                          : '.doc,.docx'
                      }
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setContentForm({ ...contentForm, file, fileName: file.name });
                        }
                      }}
                    />
                    {contentForm.fileName && (
                      <small className="text-success d-block mt-1">فایل انتخابی: {contentForm.fileName}</small>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label small">توضیحات پیوست:</label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="توضیح راهنما درباره این فایل..."
                    value={contentForm.description}
                    onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success btn-sm flex-fill">
                    {contentForm.id ? 'ذخیره تغییرات' : 'بارگذاری و ذخیره'}
                  </button>
                  {contentForm.id && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        setContentForm({
                          id: null,
                          sessionNumber: '',
                          title: '',
                          type: 'video',
                          description: '',
                          textContent: '',
                          file: null,
                          fileName: ''
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

          {/* لیست محتواهای بارگذاری شده */}
          <div className="col-12 col-lg-7">
            <h6 className="fw-bold mb-3">فایل‌ها و محتواهای بارگذاری‌شده:</h6>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {contents.filter((c) => c.courseId === selectedCourseForManage?.id).length === 0 ? (
                <div className="alert alert-secondary text-center small">هنوز فایلی برای این دوره آپلود نشده است.</div>
              ) : (
                contents
                  .filter((c) => c.courseId === selectedCourseForManage?.id)
                  // مرتب‌سازی بر اساس شماره جلسه
                  .sort((a, b) => (Number(a.sessionNumber) || 0) - (Number(b.sessionNumber) || 0))
                  .map((item) => (
                    <div key={item.id} className="border rounded-3 p-3 bg-white shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center gap-2">
                          {item.type === 'video' && <FiVideo className="text-danger" size={20} />}
                          {item.type === 'audio' && <FiMic className="text-warning" size={20} />}
                          {item.type === 'pdf' && <FiFileText className="text-danger" size={20} />}
                          {item.type === 'doc' && <FiFile className="text-primary" size={20} />}
                          {item.type === 'text' && <FiFileText className="text-info" size={20} />}
                          
                          {/* نشان شماره جلسه */}
                          {item.sessionNumber && (
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                              جلسه {item.sessionNumber}
                            </span>
                          )}

                          <span className="fw-bold">{item.title}</span>
                        </div>
                        <div className="d-flex gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm p-1"
                            onClick={() => handleEditContent(item)}
                            title="ویرایش"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1"
                            onClick={() => handleDeleteContent(item.id)}
                            title="حذف"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {item.fileName && (
                        <div className="small text-muted mb-1">📁 فایل: {item.fileName}</div>
                      )}
                      {item.description && <p className="text-muted small mb-1">{item.description}</p>}
                      {item.textContent && (
                        <div className="bg-light p-2 rounded small text-dark mt-2 border">
                          {item.textContent}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}










{/* ============================================================ */}
{/* مودال ۳: ثبت و مدیریت سوالات متداول (FAQ) */}
{/* ============================================================ */}
{isFaqModalOpen && (
  <div className="admin-modal-overlay ">
    <div className="admin-modal-content w-75 bg-white" style={{ maxWidth: '900px' }}>
      <div className="admin-modal-header d-flex justify-content-between align-items-center">
        <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
          <FiHelpCircle className="text-warning" />
          مدیریت سوالات متداول (FAQ): {selectedCourseForManage?.title || 'انتخاب دوره'}
        </h5>
        <button type="button" className="btn-close" onClick={() => setIsFaqModalOpen(false)}></button>
      </div>

      <div className="admin-modal-body p-3">
        {/* انتخاب دوره */}
        <div className="mb-3">
          <label className="form-label fw-bold small">دوره مورد نظر:</label>
          <select
            className="form-select"
            value={selectedCourseForManage?.id || ''}
            onChange={(e) => {
              const c = courses.find((item) => item.id === Number(e.target.value));
              setSelectedCourseForManage(c);
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        <div className="row g-3">
          {/* فرم افزودن/ویرایش سوال */}
          <div className="col-12 col-lg-5">
            <div className="border rounded-3 p-3 bg-light">
              <h6 className="fw-bold mb-3">{faqForm.id ? 'ویرایش پرسش و پاسخ' : 'افزودن پرسش جدید'}</h6>
              <form onSubmit={handleSaveFaq}>
                <div className="mb-2">
                  <label className="form-label small">متن پرسش:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="مثال: پیش‌نیازهای این دوره چیست؟"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small">پاسخ کامل:</label>
                  <textarea
                    rows="4"
                    className="form-control"
                    placeholder="پاسخ روشن و دقیق برای رفع ابهام هنرجو..."
                    value={faqForm.answer}
                    onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                    required
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning btn-sm flex-fill fw-bold">
                    {faqForm.id ? 'ذخیره ویرایش' : 'ثبت سوال و جواب'}
                  </button>
                  {faqForm.id && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setFaqForm({ id: null, question: '', answer: '' })}
                    >
                      انصراف
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* لیست سوالات ثبت‌شده */}
          <div className="col-12 col-lg-7">
            <h6 className="fw-bold mb-3">سوالات متداول ثبت‌شده این دوره:</h6>
            <div className="d-flex flex-column gap-2" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {faqs.filter((f) => f.courseId === selectedCourseForManage?.id).length === 0 ? (
                <div className="alert alert-secondary text-center small">هنوز سوال متداولی برای این دوره تعریف نشده است.</div>
              ) : (
                faqs
                  .filter((f) => f.courseId === selectedCourseForManage?.id)
                  .map((item, idx) => (
                    <div key={item.id} className="border rounded-3 p-3 bg-white shadow-sm">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span className="fw-bold text-dark small">❓ {idx + 1}. {item.question}</span>
                        <div className="d-flex gap-1 flex-shrink-0">
                          <button
                            type="button"
                            className="btn btn-outline-info btn-sm p-1"
                            onClick={() => setFaqForm({ id: item.id, question: item.question, answer: item.answer })}
                            title="ویرایش"
                          >
                            <BiEdit size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1"
                            onClick={() => handleDeleteFaq(item.id)}
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-muted small mb-0 mt-2 pe-3 border-top pt-2">
                        💡 {item.answer}
                      </p>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}








      {/* ============================================================ */}
      {/* مودال تکالیف و پروژه‌های جلسات دوره */}
      {/* ============================================================ */}
      {isAssignmentModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content w-75 bg-white" style={{ maxWidth: '1050px' }}>
            {/* هدر مودال */}
            <div className="admin-modal-header d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                <FiCheckSquare className="text-primary" size={22} />
                مدیریت تکالیف و پروژه‌های دوره: {selectedCourseForManage?.title || 'انتخاب دوره'}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsAssignmentModalOpen(false)}
              ></button>
            </div>

            {/* بدنه مودال */}
            <div className="admin-modal-body p-3">
              {/* انتخاب دوره انتخابی برای فیلتر و مدیریت */}
              <div className="mb-3">
                <label className="form-label fw-bold small">انتخاب دوره آموزشی:</label>
                <select
                  className="form-select"
                  value={selectedCourseForManage?.id || ''}
                  onChange={(e) => {
                    const c = courses.find((item) => item.id === Number(e.target.value));
                    setSelectedCourseForManage(c);
                    setAssignmentForm((prev) => ({ ...prev, courseId: c ? c.id : '' }));
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row g-3">
                {/* فرم ثبت / ویرایش تکلیف و پروژه (ستون سمت راست) */}
                <div className="col-12 col-lg-5">
                  <div className="border rounded-3 p-3 bg-light">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-1">
                      {assignmentForm.id ? <FiEdit2 className="text-warning" /> : <FiPlus className="text-success" />}
                      {assignmentForm.id ? 'ویرایش تکلیف / پروژه' : 'ثبت تکلیف یا پروژه جدید'}
                    </h6>

                    <form onSubmit={handleSaveAssignment}>
                      {/* ردیف شماره جلسه و نوع فعالیت */}
                      <div className="row g-2 mb-2">
                        <div className="col-5">
                          <label className="form-label small">۱. شماره جلسه:</label>
                          <input
                            type="number"
                            min="1"
                            className="form-control form-control-sm"
                            placeholder="مثال: 1"
                            value={assignmentForm.sessionNumber}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, sessionNumber: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-7">
                          <label className="form-label small">۳. نوع فعالیت:</label>
                          <select
                            className="form-select form-select-sm"
                            value={assignmentForm.taskType}
                            onChange={(e) => setAssignmentForm({ ...assignmentForm, taskType: e.target.value })}
                          >
                            <option value="تمرین">تمرین کلاسی</option>
                            <option value="پروژه عملی">پروژه عملی</option>
                            <option value="مینی پروژه">مینی پروژه</option>
                            <option value="آزمون و کوئیز">آزمون و کوئیز</option>
                          </select>
                        </div>
                      </div>

                      {/* عنوان تکلیف */}
                      <div className="mb-2">
                        <label className="form-label small">
                          ۴. عنوان تکلیف یا پروژه: <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="مثال: پیاده‌سازی فرم لاگین با اعتبارسنجی"
                          value={assignmentForm.title}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                          required
                        />
                      </div>

                      {/* نوع فایل پیوست */}
                      <div className="mb-2">
                        <label className="form-label small">۵. نوع فایل پیوست:</label>
                        <select
                          className="form-select form-select-sm"
                          value={assignmentForm.fileType}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, fileType: e.target.value })}
                        >
                          <option value="zip">فایل فشرده (ZIP / RAR)</option>
                          <option value="pdf">سند راهنما (PDF)</option>
                          <option value="doc">فایل متنی / ورد (DOCX)</option>
                          <option value="image">تصویر یا طرح اولیه (PNG/JPG)</option>
                          <option value="none">بدون فایل پیوست</option>
                        </select>
                      </div>

                      {/* آپلود فایل در صورت انتخاب نوع فایل */}
                      {assignmentForm.fileType !== 'none' && (
                        <div className="mb-2">
                          <label className="form-label small">۶. فایل پیوست تکلیف / صورت پروژه:</label>
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept={
                              assignmentForm.fileType === 'zip'
                                ? '.zip,.rar,.7z'
                                : assignmentForm.fileType === 'pdf'
                                ? '.pdf'
                                : assignmentForm.fileType === 'doc'
                                ? '.doc,.docx'
                                : 'image/*'
                            }
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setAssignmentForm({
                                  ...assignmentForm,
                                  file,
                                  fileName: file.name
                                });
                              }
                            }}
                          />
                          {assignmentForm.fileName && (
                            <small className="text-success d-block mt-1">📁 فایل: {assignmentForm.fileName}</small>
                          )}
                        </div>
                      )}

                      {/* توضیحات */}
                      <div className="mb-3">
                        <label className="form-label small">۷. توضیحات و راهنمای تحویل:</label>
                        <textarea
                          rows="3"
                          className="form-control form-control-sm"
                          placeholder="نحوه انجام، ددلاین ارسال یا نکات تکمیلی را بنویسید..."
                          value={assignmentForm.description}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                        />
                      </div>

                      {/* دکمه‌های عملیات فرم */}
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary btn-sm flex-fill">
                          {assignmentForm.id ? 'ذخیره ویرایش' : 'ثبت تکلیف / پروژه'}
                        </button>
                        {assignmentForm.id && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              setAssignmentForm({
                                ...initialAssignmentForm,
                                courseId: selectedCourseForManage?.id || ''
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

                {/* لیست تکالیف و پروژه‌ها (ستون سمت چپ) */}
                <div className="col-12 col-lg-7">
                  <h6 className="fw-bold mb-3 d-flex align-items-center justify-content-between">
                    <span>لیست تکالیف و پروژه‌های ثبت‌شده:</span>
                    <span className="badge bg-secondary-subtle text-secondary fw-normal">
                      {assignments.filter((a) => a.courseId === selectedCourseForManage?.id).length} مورد
                    </span>
                  </h6>

                  <div className="d-flex flex-column gap-2" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    {assignments.filter((a) => a.courseId === selectedCourseForManage?.id).length === 0 ? (
                      <div className="alert alert-secondary text-center small my-3">
                        هنوز تکلیفی برای این دوره تعریف نشده است.
                      </div>
                    ) : (
                      assignments
                        .filter((a) => a.courseId === selectedCourseForManage?.id)
                        .sort((a, b) => (Number(a.sessionNumber) || 0) - (Number(b.sessionNumber) || 0))
                        .map((item) => (
                          <div key={item.id} className="border rounded-3 p-3 bg-white shadow-sm">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="d-flex flex-column gap-1">
                                <div className="d-flex align-items-center gap-2">
                                  {item.sessionNumber && (
                                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                                      جلسه {item.sessionNumber}
                                    </span>
                                  )}
                                  <span
                                    className={`badge ${
                                      item.taskType === 'پروژه عملی'
                                        ? 'bg-danger-subtle text-danger border border-danger-subtle'
                                        : item.taskType === 'مینی پروژه'
                                        ? 'bg-warning-subtle text-warning border border-warning-subtle'
                                        : 'bg-info-subtle text-info border border-info-subtle'
                                    }`}
                                  >
                                    {item.taskType}
                                  </span>
                                </div>
                                <span className="fw-bold text-dark mt-1">{item.title}</span>
                              </div>

                              <div className="d-flex gap-1">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btn-sm p-1"
                                  onClick={() => handleEditAssignment(item)}
                                  title="ویرایش"
                                >
                                  <FiEdit2 size={15} />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm p-1"
                                  onClick={() => handleDeleteAssignment(item.id)}
                                  title="حذف"
                                >
                                  <FiTrash2 size={15} />
                                </button>
                              </div>
                            </div>

                            {item.fileName && (
                              <div className="small text-muted mb-1 d-flex align-items-center gap-1">
                                <FiFileText className="text-secondary" />
                                <span>فایل پیوست: {item.fileName}</span>
                              </div>
                            )}

                            {item.description && (
                              <p className="text-muted small mb-0 bg-light p-2 rounded border">
                                {item.description}
                              </p>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}















      {/* بخش‌های بعدی: فیلترها، جدول، و مودال‌های دوگانه در مراحل بعد قرار می‌گیرند */}
    </div>
  );
}
export default AdminCourses; // یا اسم هر کامپوننتی که در اون فایل هست