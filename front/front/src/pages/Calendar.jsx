import { useLayoutEffect, useRef, useState } from "react";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/stylecalendar.css';

const filters = [
  { id: 'all', title: 'همه' },
  { id: 'frontend', title: 'فرانت‌اند' },
  { id: 'backend', title: 'بک‌اند (سی‌شارپ / پایتون)' },
  { id: 'ai', title: 'هوش مصنوعی' },
  { id: 'algo', title: 'الگوریتم و مسابقات' },
  { id: 'data', title: 'علوم داده' },
];

const weekSchedule = [
  {
    day: 'شنبه',
    englishDay: 'Saturday',
    classes: [
      {
        id: 1,
        category: 'frontend',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'HTML & CSS مقدماتی',
        teacher: 'مدرس: تیم فرانت‌اند',
        badge: 'فرانت‌اند',
      },
      {
        id: 2,
        category: 'backend',
        time: '۱۸:۳۰ - ۲۰:۳۰',
        title: 'پایتون مقدماتی',
        teacher: 'مدرس: تیم بک‌اند',
        badge: 'بک‌اند',
      },
    ],
  },
  {
    day: 'یکشنبه',
    englishDay: 'Sunday',
    classes: [
      {
        id: 3,
        category: 'ai',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'مقدمات هوش مصنوعی',
        teacher: 'مدرس: تیم AI',
        badge: 'هوش مصنوعی',
      },
      {
        id: 4,
        category: 'frontend',
        time: '۱۸:۳۰ - ۲۰:۳۰',
        title: 'React پیشرفته',
        teacher: 'مدرس: تیم فرانت‌اند',
        badge: 'فرانت‌اند',
      },
    ],
  },
  {
    day: 'دوشنبه',
    englishDay: 'Monday',
    classes: [
      {
        id: 5,
        category: 'backend',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'سی‌شارپ و ASP.NET Core',
        teacher: 'مدرس: تیم بک‌اند',
        badge: 'بک‌اند',
      },
      {
        id: 6,
        category: 'algo',
        time: '۱۸:۳۰ - ۲۰:۰۰',
        title: 'آماده‌سازی مسابقات برنامه‌نویسی',
        teacher: 'مدرس: تیم الگوریتم',
        badge: 'الگوریتم',
      },
    ],
  },
  {
    day: 'سه‌شنبه',
    englishDay: 'Tuesday',
    classes: [
      {
        id: 7,
        category: 'data',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'مقدمات علوم داده',
        teacher: 'مدرس: تیم Data Science',
        badge: 'علوم داده',
      },
      {
        id: 8,
        category: 'frontend',
        time: '۱۸:۳۰ - ۲۰:۳۰',
        title: 'Bootstrap و طراحی ریسپانسیو',
        teacher: 'مدرس: تیم فرانت‌اند',
        badge: 'فرانت‌اند',
      },
    ],
  },
  {
    day: 'چهارشنبه',
    englishDay: 'Wednesday',
    classes: [
      {
        id: 9,
        category: 'ai',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'Machine Learning عملی',
        teacher: 'مدرس: تیم AI',
        badge: 'هوش مصنوعی',
      },
      {
        id: 10,
        category: 'backend',
        time: '۱۸:۳۰ - ۲۰:۳۰',
        title: 'Django و پایگاه داده',
        teacher: 'مدرس: تیم بک‌اند',
        badge: 'بک‌اند',
      },
    ],
  },
  {
    day: 'پنجشنبه',
    englishDay: 'Thursday',
    classes: [
      {
        id: 11,
        category: 'algo',
        time: '۱۰:۰۰ - ۱۲:۰۰',
        title: 'جلسه استعدادیابی و حل مسئله',
        teacher: 'مدرس: تیم الگوریتم',
        badge: 'الگوریتم',
      },
      {
        id: 12,
        category: 'data',
        time: '۱۶:۰۰ - ۱۸:۰۰',
        title: 'پروژه عملی علوم داده',
        teacher: 'مدرس: تیم Data Science',
        badge: 'علوم داده',
      },
    ],
  },
];

const legends = [
  { category: 'frontend', title: 'فرانت‌اند' },
  { category: 'backend', title: 'بک‌اند' },
  { category: 'ai', title: 'هوش مصنوعی' },
  { category: 'algo', title: 'الگوریتم و مسابقات' },
  { category: 'data', title: 'علوم داده' },
];

export default function Calendar() {



  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);




  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <Navbar />

      {/* هدر صفحه تقویم */}
      <section className="cal-hero">
        <div className="container">
          <h1>
            <i
              className="bi bi-calendar3-week me-2"
              aria-hidden="true"
            />
            تقویم آموزشی
          </h1>

          <h3 className="section-title text-info">برنامه هفتگی کلاس‌ها</h3>
        </div>
      </section>

      {/* بخش اصلی تقویم */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <p className="section-sub">
              با کلیک روی هر دسته، فقط کلاس‌های همان حوزه را ببینید.
            </p>
          </div>

          {/* دکمه‌های فیلتر */}
          <div className="cal-filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`cal-filter-btn ${
                  activeFilter === filter.id ? 'active' : ''
                }`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.title}
              </button>
            ))}
          </div>

          {/* جدول برنامه هفتگی */}
          <div className="cal-week">
            {weekSchedule.map((day) => {
              const visibleClasses = day.classes.filter(
                (course) =>
                  activeFilter === 'all' || course.category === activeFilter
              );

              return (
                <div className="cal-day" key={day.day}>
                  <div className="cal-day-head">
                    {day.day} <small>{day.englishDay}</small>
                  </div>

                  <div className="cal-day-body">
                    {visibleClasses.length > 0 ? (
                      visibleClasses.map((course) => (
                        <div
                          className={`cal-item ${course.category}`}
                          key={course.id}
                        >
                          <div className="cal-time">
                            <i
                              className="bi bi-clock me-1"
                              aria-hidden="true"
                            />
                            {course.time}
                          </div>

                          <div className="cal-name">{course.title}</div>

                          <div className="cal-teacher">
                            {course.teacher}
                          </div>

                          <span
                            className={`cal-badge ${course.category}`}
                          >
                            {course.badge}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="cal-empty">
                        کلاسی در این دسته برای {day.day} برگزار نمی‌شود.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* راهنمای رنگ‌ها */}
          <div className="cal-legend">
            {legends.map((legend) => (
              <div className="cal-legend-item" key={legend.category}>
                <span
                  className={`cal-legend-dot dot-${legend.category}`}
                />
                {legend.title}
              </div>
            ))}
          </div>

          {/* دعوت به ثبت‌نام */}
          <div className="cal-cta">
            <h3>برای رزرو جای خود اقدام کنید</h3>
            <p>ظرفیت کلاس‌ها محدود است؛ همین امروز ثبت‌نام کنید.</p>

            <a href="/courses" className="btn btn-cta">
              مشاهده دوره‌ها
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
