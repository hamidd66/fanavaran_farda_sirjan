import React from 'react';
import { 
  FaLaptopCode, 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaRocket, 
  FaCode, 
  FaAward, 
  FaTools,
  FaShieldAlt
} from 'react-icons/fa';
import '../styles/StudentExams.css';

const StudentExams = () => {
  return (
    <div className="exams-page-container">
      {/* بنر هیرو اطلاع‌رسانی وضعیت توسعه */}
      <div className="exams-hero-card">
        <div className="exams-hero-badge">
          <span className="pulsing-dot"></span>
          <span>در حال توسعه و بهینه‌سازی زیرساخت</span>
        </div>

        <div className="exams-hero-content">
          <div className="exams-hero-icon-wrapper">
            <FaLaptopCode className="exams-hero-icon" />
            <div className="gear-spin-badge">
              <FaTools />
            </div>
          </div>

          <h1 className="exams-hero-title">سامانه هوشمند آزمون‌ها و چالش‌های کدنویسی</h1>
          <p className="exams-hero-desc">
            این بخش با هدف برگزاری آزمون‌های زمان‌بندی‌شده، کوئیزهای مستمر کلاسی و چالش‌های آنلاین الگوریتم و برنامه‌نویسی در دست پیاده‌سازی است و به‌زودی در دسترس شما عزیزان قرار خواهد گرفت.
          </p>

          <div className="exams-stats-pills">
            <div className="dev-pill">
              <span className="dev-pill-label">نسخه ماژول:</span>
              <span className="dev-pill-val">v2.0-Alpha</span>
            </div>
            <div className="dev-pill">
              <span className="dev-pill-label">وضعیت:</span>
              <span className="dev-pill-val warning">
                <FaHourglassHalf /> پیاده‌سازی منطق فنی
              </span>
            </div>
          </div>
        </div>

        {/* پترن پس‌زمینه تزئینی */}
        <div className="hero-glow-circle circle-1"></div>
        <div className="hero-glow-circle circle-2"></div>
      </div>

      {/* پیش‌نمایش قابلیت‌های در دست ساخت */}
      <div className="exams-roadmap-section">
        <div className="section-heading">
          <h3>امکاناتی که در این سامانه تجربه خواهید کرد:</h3>
          <p>زیرساخت اختصاصی آموزشگاه فناوری و هوش مصنوعی فناوران فردا</p>
        </div>

        <div className="features-preview-grid">
          <div className="feature-preview-card">
            <div className="feature-icon-box blue">
              <FaCode />
            </div>
            <h4>کامپایلر و چالش کد آنلاین</h4>
            <p>حل مسائل الگوریتمی و تست کیس‌های خودکار برای دوره‌های پایتون، جاوااسکریپت و سی‌شارپ.</p>
            <span className="feature-status-tag in-progress">در حال کدنویسی</span>
          </div>

          <div className="feature-preview-card">
            <div className="feature-icon-box green">
              <FaShieldAlt />
            </div>
            <h4>کوییزهای دوره‌ای و تستی</h4>
            <p>آزمون‌های تستی هوشمند با تصحیح آنی، تحلیل نقاط قوت و ضعف مباحث آموزشی.</p>
            <span className="feature-status-tag ready">طراحی UI انجام شد</span>
          </div>

          <div className="feature-preview-card">
            <div className="feature-icon-box purple">
              <FaAward />
            </div>
            <h4>کارنامه و رتبه‌بندی کلاسی</h4>
            <p>محاسبه نمره نهایی دوره، لیدربورد رقابتی دانشجویان و ثبت خودکار در سوابق تحصیلی.</p>
            <span className="feature-status-tag in-progress">در مرحله اتصال API</span>
          </div>
        </div>
      </div>

      {/* خط پیشرفت فازهای توسعه */}
      <div className="dev-timeline-card">
        <div className="timeline-title">
          <FaRocket className="timeline-title-icon" />
          <span>مراحل انتشار سیستم آزمون‌ساز</span>
        </div>
        
        <div className="timeline-steps-track">
          <div className="t-step done">
            <div className="t-circle"><FaCheckCircle /></div>
            <span className="t-label">طراحی بانک سوالات</span>
          </div>
          <div className="t-line active"></div>

          <div className="t-step active">
            <div className="t-circle">۲</div>
            <span className="t-label">تایمر و ضدتقلب</span>
          </div>
          <div className="t-line"></div>

          <div className="t-step pending">
            <div className="t-circle">۳</div>
            <span className="t-label">اتصال به پنل هنرجویان</span>
          </div>
          <div className="t-line"></div>

          <div className="t-step pending">
            <div className="t-circle">۴</div>
            <span className="t-label">راه‌اندازی نهایی</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExams;
