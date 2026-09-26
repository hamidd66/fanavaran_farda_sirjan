import React from 'react';
import { 
  FiClock, 
  FiCpu, 
  FiAward, 
  FiLayers, 
  FiZap, 
  FiCheckCircle, 
  FiTrendingUp,
  FiCode
} from 'react-icons/fi';
import '../../styles/ExamComingSoon.css';

export default function ExamComingSoon() {
  const upcomingFeatures = [
    {
      icon: <FiClock />,
      title: 'آزمون‌های زمان‌دار و آنلاین',
      desc: 'امکان تعریف کوییزهای کلاسی با محدودیت زمانی دقیق و تصحیح خودکار'
    },
    {
      icon: <FiCode />,
      title: 'چالش‌های کدنویسی تعاملی',
      desc: 'محیط اجرای زنده کد برای تست مهارت‌های الگوریتم و برنامه‌نویسی'
    },
    {
      icon: <FiLayers />,
      title: 'بانک جامع سوالات',
      desc: 'دسته‌بندی تستی، تشریحی و عملی با قابلیت انتخاب تصادفی'
    },
    {
      icon: <FiAward />,
      title: 'صدور کارنامه و رتبه‌بندی آنی',
      desc: 'تحلیل نقاط قوت و ضعف هنرجو بلافاصله پس از پایان آزمون'
    }
  ];

  return (
    <div className="coming-soon-container" dir="rtl">
      {/* هاله‌های نوری پس‌زمینه */}
      <div className="glow-circle glow-1"></div>
      <div className="glow-circle glow-2"></div>

      <div className="coming-soon-content">
        {/* نشان بالای عنوان */}
        <div className="badge-pill">
          <span className="pulsing-dot"></span>
          <FiZap className="pill-icon" />
          <span>در حال توسعه و بهینه‌سازی</span>
        </div>

        {/* عنوان و توضیحات اصلی */}
        <h1 className="coming-soon-title">
          ماژول پیشرفته <span className="highlight-text">آزمون‌ساز و چالش‌ها</span>
        </h1>
        
        <p className="coming-soon-subtitle">
          در حال طراحی یک پلتفرم جامع برای برگزاری کوییزهای تعاملی، چالش‌های هفتگی برنامه‌نویسی و سنجش هوشمند مهارت هنرجویان هستیم.
        </p>

        {/* نوار پیشرفت توسعه */}
        <div className="progress-card">
          <div className="progress-info">
            <span className="progress-label">
              <FiTrendingUp /> وضعیت پیشرفت فرآیند توسعه
            </span>
            <span className="progress-percent">۷۵٪</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill"></div>
          </div>
          <p className="progress-note">
            🚀 معماری دیتابیس و طراحی رابط کاربری تکمیل شده؛ در مرحله پیاده‌سازی موتور پردازش و ارزیابی کد هستیم.
          </p>
        </div>

        {/* گرید ویژگی‌های آینده */}
        <div className="features-preview-grid">
          {upcomingFeatures.map((feat, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <div className="feature-text">
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* فوتر اطلاعاتی */}
        <div className="coming-soon-footer">
          <FiCheckCircle className="footer-check-icon" />
          <span>این قابلیت در آپدیت بعدی پنل اساتید فعال و در دسترس خواهد بود.</span>
        </div>
      </div>
    </div>
  );
}
