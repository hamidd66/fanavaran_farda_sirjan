import React, { useState, useEffect } from 'react';
import '../styles/StudentCalendar.css';

// توابع کمکی تبدیل تاریخ به شمسی و ساعت زنده
const getPersianDateTime = () => {
  const now = new Date();
  const dateFa = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);
  
  const timeFa = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);

  return { date: dateFa, time: timeFa, full: `${dateFa} - ساعت ${timeFa}` };
};

// آیکون‌های SVG داخلی
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconMapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IconVideo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const IconLayers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 17 12 22 22 17"></polyline>
    <polyline points="2 12 12 17 22 12"></polyline>
  </svg>
);

const IconBookOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconCreditCard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const daysOfWeek = ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

// داده‌های نمای هفتگی
const myWeeklyGridSchedule = [
  {
    id: 'w1',
    sessionNumber: 5,
    courseTitle: 'دوره جامع React و Next.js',
    teacher: 'استاد پورفریدونی',
    dayIndex: 0,
    dayName: 'شنبه',
    time: '۱۷:۰۰ تا ۱۹:۳۰',
    location: 'سایت ۱ - طبقه اول',
    type: 'حضوری',
    status: 'completed',
    sessionTopic: 'مدیریت State با Redux Toolkit و Context API',
    room: 'کلاس ۱۰۲'
  },
  {
    id: 'w2',
    sessionNumber: 4,
    courseTitle: 'پایتون و هوش مصنوعی',
    teacher: 'استاد رضایی',
    dayIndex: 1,
    dayName: 'یک‌شنبه',
    time: '۱۵:۰۰ تا ۱۷:۰۰',
    location: 'سامانه اسکای‌روم آموزشگاه',
    type: 'آنلاین',
    status: 'completed',
    sessionTopic: 'شبکه‌های عصبی پیچشی (CNN) با PyTorch',
    room: 'اتاق مجازی ۱'
  },
  {
    id: 'w3',
    sessionNumber: 6,
    courseTitle: 'دوره جامع React و Next.js',
    teacher: 'استاد پورفریدونی',
    dayIndex: 2,
    dayName: 'دوشنبه',
    time: '۱۷:۰۰ تا ۱۹:۳۰',
    location: 'سایت ۱ - طبقه اول',
    type: 'حضوری',
    status: 'today',
    sessionTopic: 'پیاده‌سازی Server Components و SSR در Next 14',
    room: 'کلاس ۱۰۲'
  },
  {
    id: 'w4',
    sessionNumber: 3,
    courseTitle: 'الگوریتم و ساختار داده‌ها',
    teacher: 'استاد امینی',
    dayIndex: 3,
    dayName: 'سه‌شنبه',
    time: '۱۸:۰۰ تا ۲۰:۰۰',
    location: 'سایت ۲ - طبقه دوم',
    type: 'حضوری',
    status: 'upcoming',
    sessionTopic: 'درخت‌ها و گراف‌ها (BFS / DFS)',
    room: 'کلاس ۲۰۴'
  },
  {
    id: 'w5',
    sessionNumber: 5,
    courseTitle: 'پایتون و هوش مصنوعی',
    teacher: 'استاد رضایی',
    dayIndex: 4,
    dayName: 'چهارشنبه',
    time: '۱۵:۰۰ تا ۱۷:۰۰',
    location: 'سامانه اسکای‌روم آموزشگاه',
    type: 'آنلاین',
    status: 'upcoming',
    sessionTopic: 'تکنیک‌های بهینه‌سازی و Transfer Learning',
    room: 'اتاق مجازی ۱'
  }
];

// لیست دوره‌ها و تمامی جلسات
const enrolledCoursesWithAllSessions = [
  {
    id: 'c1',
    courseTitle: 'دوره جامع React و Next.js',
    teacher: 'استاد پورفریدونی',
    scheduleInfo: 'روزهای زوج (شنبه و دوشنبه) - ۱۷:۰۰ الی ۱۹:۳۰',
    totalSessions: 10,
    completedSessions: 5,
    sessions: [
      { num: 1, date: '۱۴۰۳/۰۷/۰۱', day: 'شنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'مفاهیم پایه React، JSX و ساخت کامپوننت‌ها', status: 'completed', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 2, date: '۱۴۰۳/۰۷/۰۳', day: 'دوشنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'هوک‌های useState و useEffect و رندرینگ', status: 'completed', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 3, date: '۱۴۰۳/۰۷/۰۸', day: 'شنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'هوک‌های پیشرفته useMemo، useCallback و Custom Hooks', status: 'completed', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 4, date: '۱۴۰۳/۰۷/۱۰', day: 'دوشنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'مدیریت فرم‌ها و اعتبارسنجی با Formik و Yup', status: 'completed', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 5, date: '۱۴۰۳/۰۷/۱۵', day: 'شنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'مدیریت State با Redux Toolkit و Context API', status: 'completed', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 6, date: '۱۴۰۳/۰۷/۱۷', day: 'دوشنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'پیاده‌سازی Server Components و SSR در Next 14', status: 'today', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 7, date: '۱۴۰۳/۰۷/۲۲', day: 'شنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'مسیریابی پیشرفته App Router و Server Actions', status: 'upcoming', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 8, date: '۱۴۰۳/۰۷/۲۴', day: 'دوشنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'ارتباط با API، Caching و Revalidation', status: 'upcoming', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 9, date: '۱۴۰۳/۰۷/۲۹', day: 'شنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'احراز هویت با NextAuth و مدیریت Roleها', status: 'upcoming', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' },
      { num: 10, date: '۱۴۰۳/۰۸/۰۱', day: 'دوشنبه', time: '۱۷:۰۰ - ۱۹:۳۰', topic: 'دیپلوی پروژه کامل، تست و بهینه‌سازی Performance', status: 'upcoming', location: 'سایت ۱ (کلاس ۱۰۲)', type: 'حضوری' }
    ]
  },
  {
    id: 'c2',
    courseTitle: 'پایتون و هوش مصنوعی (AI & Deep Learning)',
    teacher: 'استاد رضایی',
    scheduleInfo: 'یک‌شنبه و چهارشنبه - ۱۵:۰۰ الی ۱۷:۰۰',
    totalSessions: 10,
    completedSessions: 4,
    sessions: [
      { num: 1, date: '۱۴۰۳/۰۷/۰۲', day: 'یک‌شنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'مقدمات جبر خطی و محاسبات آرایه‌ای با NumPy', status: 'completed', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 2, date: '۱۴۰۳/۰۷/۰۵', day: 'چهارشنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'تحلیل و مصورسازی داده با Pandas و Matplotlib', status: 'completed', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 3, date: '۱۴۰۳/۰۷/۰۹', day: 'یک‌شنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'الگوریتم‌های یادگیری ماشین سنتی (Scikit-Learn)', status: 'completed', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 4, date: '۱۴۰۳/۰۷/۱۲', day: 'چهارشنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'شبکه‌های عصبی چندلایه (MLP) با PyTorch', status: 'completed', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 5, date: '۱۴۰۳/۰۷/۱۶', day: 'یک‌شنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'شبکه‌های کانولوشنی (CNN) و پردازش تصویر', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 6, date: '۱۴۰۳/۰۷/۱۹', day: 'چهارشنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'ترنسفر لرنینگ (ResNet / EfficientNet)', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 7, date: '۱۴۰۳/۰۷/۲۳', day: 'یک‌شنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'شبکه‌های بازگشتی و مقدمات NLP', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 8, date: '۱۴۰۳/۰۷/۲۶', day: 'چهارشنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'آشنایی با مدل‌های ترنسفورمر و هوش مصنوعی مولد', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 9, date: '۱۴۰۳/۰۷/۳۰', day: 'یک‌شنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'فاین‌تیون و کار با کتابخانه HuggingFace', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' },
      { num: 10, date: '۱۴۰۳/۰۸/۰۳', day: 'چهارشنبه', time: '۱۵:۰۰ - ۱۷:۰۰', topic: 'سرو کردن مدل و ساخت اینترفیس تعاملی با Gradio', status: 'upcoming', location: 'اسکای‌روم آموزشگاه', type: 'آنلاین' }
    ]
  }
];

// لیست دوره‌های آموزشگاه
const instituteCourses = [
  {
    id: 201,
    title: 'توسعه Back-End با Django و داکر',
    className: 'کلاس تخصصی جنگو و پایگاه‌داده (کد ۱۰۸)',
    teacher: 'استاد محمودی',
    schedule: 'زوج (۱۸:۰۰ الی ۲۰:۳۰)',
    startDate: '۱۴۰۳/۰۷/۱۰',
    status: 'ongoing',
    capacity: 'ظرفیت تکمیل',
    type: 'حضوری',
    totalHours: '۸۰ ساعت',
    price: '۴,۸۰۰,۰۰۰ تومان',
    description: 'آموزش جامع ORM، معماری Rest API، داکرایز کردن و امنیت پیشرفته سرور.'
  },
  {
    id: 202,
    title: 'برنامه‌نویسی C# و ASP.NET Core',
    className: 'کلاس جامع مهندسی دات‌نت (کد ۱۰۲)',
    teacher: 'استاد پورفریدونی',
    schedule: 'یک‌شنبه و سه‌شنبه (۱۶:۳۰)',
    startDate: '۱۴۰۳/۰۷/۱۵',
    status: 'ongoing',
    capacity: '۲ نفر باقیمانده',
    type: 'حضوری',
    totalHours: '۹۰ ساعت',
    price: '۵,۲۰۰,۰۰۰ تومان',
    description: 'معماری Clean Architecture، میکروسرویس‌ها و بانک اطلاعاتی SQL Server.'
  },
  {
    id: 203,
    title: 'آمادگی مسابقات الگوریتم و حل مسئله',
    className: 'بوت‌کمپ تخصصی المپیاد و مسابقات (کد ۲۰۱)',
    teacher: 'تیم علمی فناوران فردا',
    schedule: 'پنج‌شنبه‌ها (۰۹:۰۰ الی ۱۳:۰۰)',
    startDate: '۱۴۰۳/۰۸/۰۳',
    status: 'upcoming',
    capacity: '۵ نفر باقیمانده',
    type: 'حضوری',
    totalHours: '۲۴ ساعت',
    price: '۲,۵۰۰,۰۰۰ تومان',
    description: 'تحلیل تست‌های مسابقات بین‌المللی، بهینه‌سازی حافظه و زمان در C++ و Python.'
  },
  {
    id: 204,
    title: 'هوش مصنوعی مولد و مهندسی پرامپت',
    className: 'کلاس آنلاین GenAI و ایجنت‌ها (کد ۳۰۱)',
    teacher: 'استاد کمالی',
    schedule: 'جمعه‌ها (۱۰:۰۰ الی ۱۳:۰۰)',
    startDate: '۱۴۰۳/۰۸/۱۰',
    status: 'upcoming',
    capacity: '۸ نفر باقیمانده',
    type: 'آنلاین',
    totalHours: '۳۰ ساعت',
    price: '۳,۲۰۰,۰۰۰ تومان',
    description: 'آشنایی با مدل‌های زبانی LLM، فاین‌تیونینگ و ساخت ایجنت‌های هوشمند با LangChain.'
  },
  {
    id: 205,
    title: 'توسعه فرانت‌اند React و TypeScript',
    className: 'کلاس ری‌اکت و تایپ‌اسکریپت تجاری (کد ۱۰۴)',
    teacher: 'استاد پورفریدونی',
    schedule: 'روزهای زوج (۱۵:۰۰ الی ۱۷:۳۰)',
    startDate: '۱۴۰۳/۰۸/۱۵',
    status: 'upcoming',
    capacity: '۴ نفر باقیمانده',
    type: 'حضوری',
    totalHours: '۷۵ ساعت',
    price: '۴,۹۰۰,۰۰۰ تومان',
    description: 'آموزش تایپ‌اسکریپت تجاری، Next.js، ساخت پورتفولیو و استقرار روی سرور ابری.'
  },
  {
    id: 206,
    title: 'متخصص پایگاه‌داده و هوش تجاری (BI)',
    className: 'کلاس پایگاه داده و هوش تجاری (کد ۲۰۶)',
    teacher: 'استاد رادمنش',
    schedule: 'دوشنبه و پنج‌شنبه (۱۸:۰۰)',
    startDate: '۱۴۰۳/۰۸/۲۲',
    status: 'upcoming',
    capacity: '۶ نفر باقیمانده',
    type: 'آنلاین',
    totalHours: '۴۵ ساعت',
    price: '۳,۷۰۰,۰۰۰ تومان',
    description: 'طراحی دیتابیس‌های حجیم، نوشتن کوری‌های تحلیلی، PowerBI و ETL داده‌ها.'
  }
];

export default function StudentCalendar() {
  const [activeTab, setActiveTab] = useState('my_schedule');
  const [scheduleView, setScheduleView] = useState('week');
  const [selectedSessionModal, setSelectedSessionModal] = useState(null);
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);
  const [filterInstituteStatus, setFilterInstituteStatus] = useState('all');

  // استیت‌های آکاردئون
  const [expandedCourses, setExpandedCourses] = useState({});

  // اطلاعات هنرجو از پنل کاربری (قابل اتصال به Context یا Redux)
  const currentStudent = {
    name: 'علی حسینی',
    studentCode: 'STD-140398',
    phone: '09139999999'
  };

  // استیت فرم ثبت نام
  const [registerModalCourse, setRegisterModalCourse] = useState(null);
  const [regForm, setRegForm] = useState({
    referral: 'instagram',
    description: '',
    regDateTime: ''
  });

  // استیت درگاه پرداخت بانکی
  const [paymentGatewayData, setPaymentGatewayData] = useState(null);

  // تولید زمان زنده هنگام باز شدن فرم ثبت‌نام
  useEffect(() => {
    if (registerModalCourse) {
      setRegForm(prev => ({
        ...prev,
        regDateTime: getPersianDateTime().full
      }));
    }
  }, [registerModalCourse]);

  const toggleCourseExpand = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const filteredInstituteCourses = instituteCourses.filter(item => {
    if (filterInstituteStatus === 'all') return true;
    return item.status === filterInstituteStatus;
  });

  // ارسال فرم و انتقال به درگاه بانکی
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const invoiceNumber = 'FF-' + Math.floor(100000 + Math.random() * 900000);
    
    setPaymentGatewayData({
      course: registerModalCourse,
      student: currentStudent,
      invoiceNumber: invoiceNumber,
      regDateTime: regForm.regDateTime,
      referral: regForm.referral,
      description: regForm.description,
      amount: registerModalCourse.price
    });

    setRegisterModalCourse(null);
  };

  return (
    <div className="sched-page-container">
      {/* بنر هدر بالای صفحه */}
      <div className="sched-hero-panel">
        <div className="sched-hero-content">
          <div className="sched-hero-icon">
            <IconCalendar />
          </div>
          <div>
            <h2>تقویم آموزشی و برنامه جلسات</h2>
            <p>مشاهده ساعات برگزاری کلاس‌های هفتگی و تقویم جامع دوره‌های آموزشگاه فناوران فردا</p>
          </div>
        </div>

        {/* سوییچ تب‌های اصلی */}
        <div className="sched-main-tabs">
          <button
            className={`sched-tab-btn ${activeTab === 'my_schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_schedule')}
          >
            <IconBookOpen />
            برنامه کلاس‌های من
          </button>
          <button
            className={`sched-tab-btn ${activeTab === 'institute_calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('institute_calendar')}
          >
            <IconLayers />
            تقویم کلی دوره‌های آموزشگاه
          </button>
        </div>
      </div>

      {/* ===================== تب ۱: کلاس‌های من ===================== */}
      {activeTab === 'my_schedule' && (
        <div className="sched-content-wrapper">
          <div className="sched-control-bar">
            <div className="current-week-info">
              <span className="week-label">حالت نمایش:</span>
              <strong className="week-date-range">
                {scheduleView === 'week' ? 'جدول هفتگی روزهای جاری' : 'فهرست دوره‌ها (مشاهده جلسات با فلش بازشونده)'}
              </strong>
            </div>

            <div className="view-switch-group">
              <button
                className={`view-btn ${scheduleView === 'week' ? 'active' : ''}`}
                onClick={() => setScheduleView('week')}
              >
                نمای جدولی (هفتگی)
              </button>
              <button
                className={`view-btn ${scheduleView === 'list' ? 'active' : ''}`}
                onClick={() => setScheduleView('list')}
              >
                نمای فهرستی (دوره‌ها و جلسات)
              </button>
            </div>
          </div>

          {/* نمای جدول هفتگی */}
          {scheduleView === 'week' ? (
            <div className="weekly-grid-container">
              <div className="weekly-grid-header">
                {daysOfWeek.map((day, idx) => (
                  <div key={idx} className={`week-day-col-head ${idx === 2 ? 'today-col-head' : ''}`}>
                    <span className="day-name">{day}</span>
                    {idx === 2 && <span className="today-badge">امروز</span>}
                  </div>
                ))}
              </div>

              <div className="weekly-grid-body">
                {daysOfWeek.map((day, dayIdx) => {
                  const daySessions = myWeeklyGridSchedule.filter(s => s.dayIndex === dayIdx);
                  const isToday = dayIdx === 2;

                  return (
                    <div key={dayIdx} className={`week-day-column ${isToday ? 'today-column' : ''}`}>
                      {daySessions.length === 0 ? (
                        <div className="no-class-placeholder">بدون کلاس</div>
                      ) : (
                        daySessions.map(session => (
                          <div
                            key={session.id}
                            className={`schedule-card session-${session.status}`}
                            onClick={() => setSelectedSessionModal({
                              courseTitle: session.courseTitle,
                              sessionNum: session.sessionNumber,
                              teacher: session.teacher,
                              dayName: session.dayName,
                              time: session.time,
                              location: session.location,
                              room: session.room,
                              type: session.type,
                              status: session.status,
                              topic: session.sessionTopic
                            })}
                          >
                            <div className="card-top-tag">
                              <span className={`type-pill ${session.type === 'حضوری' ? 'pill-inperson' : 'pill-online'}`}>
                                {session.type === 'حضوری' ? <IconMapPin /> : <IconVideo />}
                                {session.type}
                              </span>
                              <span className="session-number-pill">جلسه {session.sessionNumber}</span>
                            </div>

                            <h4 className="sched-course-name">{session.courseTitle}</h4>

                            <div className="sched-card-meta">
                              <div className="meta-item">
                                <IconClock />
                                <span>{session.time}</span>
                              </div>
                              <div className="meta-item">
                                <IconUser />
                                <span>{session.teacher}</span>
                              </div>
                            </div>

                            <button className="btn-card-details">
                              جزئیات جلسه ←
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* نمای فهرستی تمام جلسات با قابلیت Accordion */
            <div className="all-sessions-accordion-wrapper">
              {enrolledCoursesWithAllSessions.map(course => {
                const isExpanded = !!expandedCourses[course.id];

                return (
                  <div key={course.id} className={`course-sessions-block ${isExpanded ? 'is-open' : ''}`}>
                    <div 
                      className="course-block-header clickable" 
                      onClick={() => toggleCourseExpand(course.id)}
                    >
                      <div className="course-block-info">
                        <h3>{course.courseTitle}</h3>
                        <div className="course-sub-info">
                          <span><IconUser /> {course.teacher}</span>
                          <span><IconClock /> {course.scheduleInfo}</span>
                        </div>
                      </div>

                      <div className="course-header-left-actions">
                        <div className="course-progress-badge">
                          <span>{course.completedSessions} از {course.totalSessions} جلسه</span>
                          <div className="progress-bar-bg">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${(course.completedSessions / course.totalSessions) * 100}%` }}
                            />
                          </div>
                        </div>

                        <button className={`btn-toggle-expand ${isExpanded ? 'rotated' : ''}`} title="نمایش/پنهان‌سازی جلسات">
                          <IconChevronDown />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="sessions-table-wrapper accordion-content-animate">
                        <table className="sessions-table">
                          <thead>
                            <tr>
                              <th>شماره</th>
                              <th>تاریخ و روز</th>
                              <th>ساعت</th>
                              <th>مبحث جلسه</th>
                              <th>نوع و محل</th>
                              <th>وضعیت</th>
                              <th>عملیات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {course.sessions.map(s => (
                              <tr key={s.num} className={`session-row-status-${s.status}`}>
                                <td className="center-cell">
                                  <span className="session-index-circle">جلسه {s.num}</span>
                                </td>
                                <td>
                                  <strong>{s.date}</strong>
                                  <span className="table-day-sub">({s.day})</span>
                                </td>
                                <td>{s.time}</td>
                                <td className="topic-col-cell">{s.topic}</td>
                                <td>
                                  <span className={`type-pill ${s.type === 'حضوری' ? 'pill-inperson' : 'pill-online'}`}>
                                    {s.type}
                                  </span>
                                </td>
                                <td>
                                  {s.status === 'completed' && <span className="status-tag status-done"><IconCheckCircle /> برگزار شده</span>}
                                  {s.status === 'today' && <span className="status-tag status-live">امروز</span>}
                                  {s.status === 'upcoming' && <span className="status-tag status-next">پیش‌رو</span>}
                                </td>
                                <td>
                                  <button
                                    className="btn-table-detail"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedSessionModal({
                                        courseTitle: course.courseTitle,
                                        sessionNum: s.num,
                                        teacher: course.teacher,
                                        dayName: s.day + ' - ' + s.date,
                                        time: s.time,
                                        location: s.location,
                                        type: s.type,
                                        status: s.status,
                                        topic: s.topic
                                      });
                                    }}
                                  >
                                    جزئیات
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== تب ۲: تقویم کلی آموزشگاه ===================== */}
      {activeTab === 'institute_calendar' && (
        <div className="sched-content-wrapper">
          <div className="institute-filters-row">
            <div className="filter-buttons">
              <button
                className={`filter-tag ${filterInstituteStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterInstituteStatus('all')}
              >
                همه دوره‌ها ({instituteCourses.length})
              </button>
              <button
                className={`filter-tag ${filterInstituteStatus === 'ongoing' ? 'active' : ''}`}
                onClick={() => setFilterInstituteStatus('ongoing')}
              >
                در حال برگزاری
              </button>
              <button
                className={`filter-tag ${filterInstituteStatus === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilterInstituteStatus('upcoming')}
              >
                دوره‌های پیش‌رو و آتی
              </button>
            </div>
            <div className="info-badge-counter">
              نمایش {filteredInstituteCourses.length} دوره آموزشی
            </div>
          </div>

          <div className="inst-compact-grid">
            {filteredInstituteCourses.map(course => (
              <div key={course.id} className={`inst-compact-card ${course.status === 'ongoing' ? 'border-ongoing' : 'border-upcoming'}`}>
                <div className={`inst-banner-status ${course.status === 'ongoing' ? 'banner-ongoing' : 'banner-upcoming'}`}>
                  {course.status === 'ongoing' ? '● در حال برگزاری' : `⏳ شروع از: ${course.startDate}`}
                </div>

                <div className="inst-card-compact-body">
                  <div className="inst-compact-title-row">
                    <h4>{course.title}</h4>
                    <span className="inst-compact-type">{course.type}</span>
                  </div>

                  <div className="inst-compact-meta-list">
                    <div className="meta-compact-item">
                      <IconUser />
                      <span>{course.teacher}</span>
                    </div>
                    <div className="meta-compact-item">
                      <IconClock />
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  <div className="inst-compact-footer-row">
                    <span className="inst-capacity-pill">{course.capacity}</span>
                    <button
                      className="btn-compact-view"
                      onClick={() => setSelectedCourseModal(course)}
                    >
                      مشاهده جزئیات
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== مودال ۱: جزئیات جلسه ===================== */}
      {selectedSessionModal && (
        <div className="std-modal-overlay" onClick={() => setSelectedSessionModal(null)}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>جزئیات جلسه {selectedSessionModal.sessionNum}</h3>
              <button className="std-modal-close" onClick={() => setSelectedSessionModal(null)}>
                <IconClose />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="modal-session-hero">
                <span className="session-day-tag">{selectedSessionModal.dayName} | {selectedSessionModal.time}</span>
                <h4>{selectedSessionModal.courseTitle}</h4>
              </div>

              <div className="session-detail-list">
                <div className="detail-row">
                  <span className="row-label">مدرس:</span>
                  <span className="row-value">{selectedSessionModal.teacher}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">نحوه برگزاری و مکان:</span>
                  <span className="row-value">{selectedSessionModal.type} - {selectedSessionModal.location}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">وضعیت جلسه:</span>
                  <span className="row-value">
                    {selectedSessionModal.status === 'completed' && '✅ برگزار شده'}
                    {selectedSessionModal.status === 'today' && '🔥 جلسه امروز'}
                    {selectedSessionModal.status === 'upcoming' && '⏳ پیش‌رو'}
                  </span>
                </div>
                <div className="detail-row topic-row">
                  <span className="row-label">سرفصل و مبحث تدریس:</span>
                  <p className="topic-text">{selectedSessionModal.topic}</p>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button className="btn-modal-cancel" onClick={() => setSelectedSessionModal(null)}>
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== مودال ۲: اطلاعات جامع دوره و دکمه ثبت‌نام ===================== */}
      {selectedCourseModal && (
        <div className="std-modal-overlay" onClick={() => setSelectedCourseModal(null)}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>اطلاعات جامع دوره آموزشی</h3>
              <button className="std-modal-close" onClick={() => setSelectedCourseModal(null)}>
                <IconClose />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="modal-session-hero">
                <span className={`inst-banner-status ${selectedCourseModal.status === 'ongoing' ? 'banner-ongoing' : 'banner-upcoming'}`} style={{ display: 'inline-block', borderRadius: '6px', padding: '3px 10px', marginBottom: '6px' }}>
                  {selectedCourseModal.status === 'ongoing' ? '● در حال برگزاری' : `شروع: ${selectedCourseModal.startDate}`}
                </span>
                <h4>{selectedCourseModal.title}</h4>
              </div>

              <div className="session-detail-list">
                <div className="detail-row">
                  <span className="row-label">نام کلاس و کد:</span>
                  <span className="row-value">{selectedCourseModal.className}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">مدرس دوره:</span>
                  <span className="row-value">{selectedCourseModal.teacher}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">برنامه زمانی کلاس:</span>
                  <span className="row-value">{selectedCourseModal.schedule}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">شهریه دوره:</span>
                  <span className="row-value font-bold-blue">{selectedCourseModal.price}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">مدت کل دوره:</span>
                  <span className="row-value">{selectedCourseModal.totalHours}</span>
                </div>
                <div className="detail-row">
                  <span className="row-label">وضعیت ظرفیت:</span>
                  <span className="row-value" style={{ color: '#2563eb', fontWeight: 'bold' }}>{selectedCourseModal.capacity}</span>
                </div>
                <div className="detail-row topic-row">
                  <span className="row-label">توضیحات و اهداف دوره:</span>
                  <p className="topic-text">{selectedCourseModal.description}</p>
                </div>
              </div>

              <div className="modal-actions-footer">
                <button 
                  className="btn-modal-primary" 
                  onClick={() => {
                    setRegisterModalCourse(selectedCourseModal);
                    setSelectedCourseModal(null);
                  }}
                >
                  ثبت نام در دوره
                </button>
                <button className="btn-modal-cancel" onClick={() => setSelectedCourseModal(null)}>
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== مودال ۳: فرم ثبت نام دوره ===================== */}
      {registerModalCourse && (
        <div className="std-modal-overlay" onClick={() => setRegisterModalCourse(null)}>
          <div className="std-modal-container reg-modal-width" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header reg-header">
              <div>
                <h3>فرم ثبت‌نام دوره آموزشی</h3>
                <span className="sub-header-text">آموزشگاه تخصصی کامپیوتر فناوران فردا</span>
              </div>
              <button className="std-modal-close" onClick={() => setRegisterModalCourse(null)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleProceedToPayment} className="std-modal-body">
              {/* اخطار وضعیت ثبت نام اولیه */}
              <div className="reg-warning-box">
                <IconAlertCircle />
                <span>توجه: ثبت اطلاعات در این فرم به منزله <strong>پیش‌ثبت‌نام اولیه</strong> است و ثبت‌نام نهایی و قطعی تنها پس از پرداخت موفق درگاه بانکی تایید خواهد شد.</span>
              </div>

              <div className="reg-fields-grid">
                {/* عنوان دوره (لیبل ثابت) */}
                <div className="reg-field-group">
                  <label>عنوان دوره:</label>
                  <div className="reg-readonly-box">{registerModalCourse.title}</div>
                </div>

                {/* نام کلاس (لیبل ثابت) */}
                <div className="reg-field-group">
                  <label>نام و کد کلاس:</label>
                  <div className="reg-readonly-box">{registerModalCourse.className}</div>
                </div>

                {/* نام دبیر / استاد (لیبل ثابت) */}
                <div className="reg-field-group">
                  <label>استاد و مدرس دوره:</label>
                  <div className="reg-readonly-box">{registerModalCourse.teacher}</div>
                </div>

                {/* نام هنرجو (از پنل کاربری) */}
                <div className="reg-field-group">
                  <label>نام و نام خانوادگی هنرجو:</label>
                  <div className="reg-readonly-box highlight-user">{currentStudent.name} ({currentStudent.studentCode})</div>
                </div>

                {/* تاریخ و ساعت ثبت نام (شمسی و خودکار) */}
                <div className="reg-field-group">
                  <label>تاریخ و زمان ثبت درخواست:</label>
                  <div className="reg-readonly-box">{regForm.regDateTime || getPersianDateTime().full}</div>
                </div>

                {/* طریقه ثبت نام */}
                <div className="reg-field-group">
                  <label>طریقه ثبت نام:</label>
                  <div className="reg-readonly-box online-tag">آنلاین (از طریق پنل اختصاصی هنرجو)</div>
                </div>
              </div>

              {/* طریقه آشنایی (منوی کشویی) */}
              <div className="reg-field-group full-width">
                <label>نحوه آشنایی با آموزشگاه فناوران فردا: <span className="req-star">*</span></label>
                <select 
                  className="reg-input-select"
                  value={regForm.referral}
                  onChange={(e) => setRegForm({ ...regForm, referral: e.target.value })}
                  required
                >
                  <option value="instagram">اینستاگرام آموزشگاه (@Fanavaranfarda_sirjan1)</option>
                  <option value="friends">معرفی دوستان و هنرجویان قبلی</option>
                  <option value="website">سایت و جستجوی گوگل</option>
                  <option value="banner">بنرها و تبلیغات شهری سیرجان</option>
                  <option value="school">مدرسه / دانشگاه / همایش‌ها</option>
                  <option value="other">سایر موارد</option>
                </select>
              </div>

              {/* توضیحات تکمیلی هنرجو */}
              <div className="reg-field-group full-width">
                <label>توضیحات و پیش‌زمینه مهارتی (اختیاری):</label>
                <textarea 
                  className="reg-textarea" 
                  rows="3"
                  placeholder="اگر پیش‌زمینه‌ای در این مهارت دارید یا یادداشتی برای استاد دوره دارید بنویسید..."
                  value={regForm.description}
                  onChange={(e) => setRegForm({ ...regForm, description: e.target.value })}
                />
              </div>

              {/* فاکتور مبلغ شهریه */}
              <div className="reg-price-summary">
                <span>مبلغ قابل پرداخت:</span>
                <strong>{registerModalCourse.price}</strong>
              </div>

              <div className="modal-actions-footer">
                <button type="submit" className="btn-modal-primary btn-pay-action">
                  <IconCreditCard />
                  تایید و انتقال به درگاه بانکی
                </button>
                <button type="button" className="btn-modal-cancel" onClick={() => setRegisterModalCourse(null)}>
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== مودال ۴: شبیه‌ساز درگاه بانکی و پرداخت شهریه ===================== */}
      {paymentGatewayData && (
        <div className="std-modal-overlay">
          <div className="std-modal-container gateway-modal" onClick={e => e.stopPropagation()}>
            <div className="gateway-header">
              <div className="gateway-bank-brand">
                <div className="bank-logo-placeholder">💳</div>
                <div>
                  <h4>درگاه پرداخت الکترونیک شاپرک</h4>
                  <small>اتصال امن به سرور بانک مرکزی</small>
                </div>
              </div>
              <span className="gateway-timer">اعتبار تراکنش: ۰۹:۵۹</span>
            </div>

            <div className="gateway-body">
              <div className="invoice-info-card">
                <div className="inv-row">
                  <span>پذیرنده:</span>
                  <strong>آموزشگاه کامپیوتر فناوران فردا (سیرجان)</strong>
                </div>
                <div className="inv-row">
                  <span>نام هنرجو:</span>
                  <strong>{paymentGatewayData.student.name}</strong>
                </div>
                <div className="inv-row">
                  <span>دوره انتخابی:</span>
                  <strong>{paymentGatewayData.course.title}</strong>
                </div>
                <div className="inv-row">
                  <span>شماره پیگیری پیش‌ثبت‌نام:</span>
                  <code className="invoice-code">{paymentGatewayData.invoiceNumber}</code>
                </div>
                <div className="inv-row total-row">
                  <span>مبلغ کل پرداختی:</span>
                  <strong className="inv-total-price">{paymentGatewayData.amount}</strong>
                </div>
              </div>

              <div className="gateway-alert-box">
                ⚠️ هنرجوی گرامی، اطلاعات ثبت‌نام شما با موفقیت به صورت موقت ثبت گردید. در صورت انصراف از پرداخت، ثبت‌نام شما <strong>قطعی نبوده</strong> و جایگزین خواهد شد.
              </div>

              <div className="gateway-mock-inputs">
                <input type="text" className="gateway-input" placeholder="شماره کارت ۱۶ رقمی" defaultValue="۶۰۳۷ - ۹۹۷۵ - **** - ****" readOnly />
                <div className="gateway-input-row">
                  <input type="text" className="gateway-input" placeholder="رمز پویا" defaultValue="******" readOnly />
                  <input type="text" className="gateway-input" placeholder="CVV2" defaultValue="۳۵۲" readOnly />
                </div>
              </div>

              <div className="gateway-actions">
                <button 
                  className="btn-pay-success"
                  onClick={() => {
                    alert(`پرداخت با موفقیت انجام شد!\nکد رهگیری: TR-${Math.floor(10000000 + Math.random() * 90000000)}\nثبت‌نام شما در دوره "${paymentGatewayData.course.title}" قطعی گردید. به جمع دانشجویان فناوران فردا خوش آمدید.`);
                    setPaymentGatewayData(null);
                  }}
                >
                  پرداخت موفق و قطعی کردن ثبت‌نام
                </button>
                <button 
                  className="btn-pay-cancel"
                  onClick={() => {
                    alert('پرداخت لغو شد. توجه: پیش‌ثبت‌نام شما بدون پرداخت شهریه فاقد اعتبار است.');
                    setPaymentGatewayData(null);
                  }}
                >
                  انصراف از پرداخت و بازگشت
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
