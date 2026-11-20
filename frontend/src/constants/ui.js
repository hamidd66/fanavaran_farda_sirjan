import { BsBriefcase, BsEmojiHeartEyes, BsMortarboard, BsPeople } from "react-icons/bs"
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
