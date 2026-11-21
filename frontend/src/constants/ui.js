import { BsAwardFill, BsBarChartFill, BsBriefcase, BsCalendarWeekFill, BsCardText, BsClipboardCheckFill, BsEmojiHeartEyes, BsFillMortarboardFill, BsFillPeopleFill, BsFillPersonCheckFill, BsGraphUpArrow, BsJournalCode, BsMortarboard, BsPeople, BsPersonGear, BsPersonWorkspace, BsWallet2, BsWindowStack } from "react-icons/bs"
import { FaComputer, FaHeadset, FaLaptopCode, FaTrophy } from "react-icons/fa6";


export const navLinks = [
    { title: 'دوره‌ها', href: '/courses' },
    { title: 'تقویم آموزشی', href: '/calendar' },
    { title: 'فرصت های شغلی', href: '/jobs' },
    { title: 'استعداد یابی', href: '/talent' },
    { title: 'مقالات', href: '/articles' },
    { title: 'مدرسین', href: '/teachers' },
    { title: 'درباره ما', href: '/about-us' },
];

export const footerLinks = [
    { title: 'دوره ها', href: '/courses' },
    { title: 'مسابقات', href: '/competition' },
    { title: 'استعداد یابی', href: '/talent' },
    { title: 'مقالات', href: '/articles' },
    { title: 'درباره ما', href: '/about-us' },
];

export const Statistics = [
    { icon: BsEmojiHeartEyes, value: '+۵۰۰', label: 'رضایت دانشجویان' },
    { icon: BsMortarboard, value: '+۱۵', label: 'دوره تخصصی فعال' },
    { icon: BsPeople, value: '+۳۰۰', label: 'دانشجوی فعال' },
    { icon: BsBriefcase, value: '۸۵٪', label: 'اشتغال در بازار کار' },
];

export const whyUsItems = [
    { icon: FaLaptopCode, title: 'پروژه‌محور و کاربردی', text: 'یادگیری با پروژه‌های واقعی و قابل ارائه به کارفرما' },
    { icon: FaTrophy, title: 'آمادگی برای مسابقات', text: 'تمرکز ویژه بر مسابقات برنامه‌نویسی و الگوریتم' },
    { icon: FaHeadset, title: 'پشتیبانی اختصاصی', text: 'پاسخگویی مستقیم استاد در طول دوره' },
    { icon: FaComputer, title: 'کارگاه مجهز سیرجان', text: 'محیط یادگیری مدرن با تجهیزات به‌روز' },
];

export const newsSectionImages = [
    { image: "/images/newsSectionImage1.jpg", title: "اخبار و مطالب روز دنیای فناوری" },
    { image: "/images/newsSectionImage2.jpg", title: "تازه‌ترین مطالب هوش مصنوعی و برنامه‌نویسی" },
    { image: "/images/newsSectionImage3.jpg", title: "اخبار جدید طراحی سایت و توسعه نرم‌افزار" },
];

export const newsSectionList = [
    { category: "هوش مصنوعی", title: "تازه‌ترین اخبار و تحولات هوش مصنوعی" },
    { category: "فرانت‌اند", title: "جدیدترین ابزارهای توسعه رابط کاربری" },
    { category: "طراحی سایت", title: "ترندهای جدید طراحی سایت‌های مدرن" },
    { category: "بک‌اند", title: "تکنولوژی‌های جدید توسعه سمت سرور" },
    { category: "React", title: "اخبار و قابلیت‌های جدید اکوسیستم React" },
];

// -----< Panel >----- //

export const userSubItems = [
    { label: "کاربران سیستم", icon: BsPersonGear, path: "users" },
    { label: "هنرجویان", icon: BsFillMortarboardFill, path: "students" },
    { label: "مدرسین", icon: BsPersonWorkspace, path: "teachers" },
];

export const coursesClassesSubItems = [
    { label: "دوره‌ها", icon: BsJournalCode, path: "courses" },
    { label: "کلاس‌ها و تقویم", icon: BsCalendarWeekFill, path: "classes" },
    { label: "ثبت‌نام‌ها", icon: BsClipboardCheckFill, path: "enrollments" },
];

export const eduAcademicSubItems = [
    { label: "نمرات و کارنامه", icon: BsAwardFill, path: "grades" },
    { label: "حضور و غیاب", icon: BsFillPersonCheckFill, path: "attendance" },
    { label: "تحلیل غیبت و نمرات", icon: BsFillPersonCheckFill, path: "academicanalytics" },
];

export const otherNavItems = [
    { label: "امور مالی", icon: BsWallet2, path: "finance" },
    { label: "نظرسنجی‌ها", icon: BsBarChartFill, path: "feedbackmanagement" },
    { label: "مسابقات", icon: BsWindowStack, path: "competitionmanagement" },
    { label: "پیام رسان", icon: BsWindowStack, path: "messages" },
    { label: "گزارش‌ها", icon: BsGraphUpArrow, path: "reports" },
];

export const accessibleItems = [
    { role: "admin", groups: [{ title: "کاربران و اعضا", icon: BsFillPeopleFill, name: "userSubItems", items: userSubItems }, { title: "سایر آیتم‌ها", icon: BsCardText, name: "otherNavItems", items: otherNavItems }] },
    { role: "teacher", groups: [{ title: "دوره‌ها و کلاس‌ها", icon: BsJournalCode, name: "coursesClassesSubItems", items: coursesClassesSubItems }] },
    { role: "student", groups: [{ title: "مدیریت آموزشی", icon: BsMortarboard, name: "eduAcademicSubItems", items: eduAcademicSubItems }] },
];
