import { useEffect, useState } from "react";


const rightSlides = [
  {
    id: 1,
    image: "/image/100.jpg",
    title: "اخبار و مطالب روز دنیای فناوری",
  },
  {
    id: 2,
    image: "/image/200.jpg",
    title: "تازه‌ترین مطالب هوش مصنوعی و برنامه‌نویسی",
  },
  {
    id: 3,
    image: "/image/300.jpg",
    title: "اخبار جدید طراحی سایت و توسعه نرم‌افزار",
  },
];

const newsItems = [
  {
    id: 1,
    category: "هوش مصنوعی",
    title: "تازه‌ترین اخبار و تحولات هوش مصنوعی",
  },
  {
    id: 2,
    category: "فرانت‌اند",
    title: "جدیدترین ابزارهای توسعه رابط کاربری",
  },
  {
    id: 3,
    category: "طراحی سایت",
    title: "ترندهای جدید طراحی سایت‌های مدرن",
  },
  {
    id: 4,
    category: "بک‌اند",
    title: "تکنولوژی‌های جدید توسعه سمت سرور",
  },
  {
    id: 5,
    category: "React",
    title: "اخبار و قابلیت‌های جدید اکوسیستم React",
  },
  
];

function RightNewsSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((previousSlide) => {
        return (previousSlide + 1) % rightSlides.length;
      });
    }, 4000);

    return () => clearInterval(slideTimer);
  }, []);

  const activeSlide = rightSlides[currentSlide];

  return (
    <div className="news-box news-slider-box">
      <div className="news-box-header">
        <div>
          <span className="news-box-small-title">
            Technology News
          </span>

          <h2>اخبار روز فناوری</h2>
        </div>

        <div className="news-box-header-icon">
          📰
        </div>
      </div>

      <div className="news-slider">
        <img
          key={activeSlide.id}
          src={activeSlide.image}
          alt={activeSlide.title}
          className="news-slider-image"
        />

        <div className="news-slider-overlay">
          <h3>{activeSlide.title}</h3>
        </div>

        <div className="news-slider-dots">
          {rightSlides.map((slide, index) => (
            <span
              key={slide.id}
              className={
                index === currentSlide
                  ? "news-dot active"
                  : "news-dot"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeftNewsList() {
  return (
    <div className="news-box news-list-box">
      <div className="news-box-header">
        <div>
          <span className="news-box-small-title">
            Latest Updates
          </span>

          <h2>آخرین خبرها</h2>
        </div>

        <div className="news-box-header-icon">
          ✨
        </div>
      </div>

      <div className="news-list-image-wrapper">
        <img
          src="/image/400.jpg"
          alt="آخرین اخبار فناوری"
          className="news-list-image"
        />
      </div>

      <div className="news-list-items">
        {newsItems.map((news) => (
          <div className="news-list-item" key={news.id}>
            <span className="news-list-number">
              {String(news.id).padStart(2, "0")}
            </span>

            <div className="news-list-content">
              <span>{news.category}</span>
              <h3>{news.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsSection() {
  return (
    <section className="technology-news-section" dir="rtl">
      <div className="technology-news-container">
        <div className="technology-news-heading">
          <span>مجله فناوران فردا</span>

          <h1>دنیای فناوری را دنبال کنید</h1>

          <p>
            جدیدترین مطالب حوزه هوش مصنوعی، طراحی سایت،
            فرانت‌اند و بک‌اند
          </p>
        </div>

        <div className="technology-news-layout">
          {/* تصویر اول در سمت راست */}
          <RightNewsSlider />

          {/* تصویر دوم در سمت چپ */}
          <LeftNewsList />
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
