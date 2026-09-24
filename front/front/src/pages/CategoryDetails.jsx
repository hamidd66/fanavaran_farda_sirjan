import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import "../styles/category-details.css";

const categoryData = {
  frontend: {
    title: "فرانت‌اند",
    englishTitle: "Front-end Development",
    icon: "bi-window-stack",
    color: "frontend-theme",
    shortDescription:
      "فرانت‌اند بخشی از وب‌سایت است که کاربر آن را می‌بیند و با آن تعامل می‌کند.",
    description:
      "در مسیر فرانت‌اند، یاد می‌گیری چطور ایده‌ها و طرح‌های گرافیکی را به صفحات واقعی، زیبا، سریع و واکنش‌گرا تبدیل کنی. از ساختار صفحه با HTML شروع می‌کنی، با CSS ظاهر آن را طراحی می‌کنی و با JavaScript به عناصر صفحه رفتار و تعامل می‌دهی.",
    skills: [
      "ساختار صفحات با HTML",
      "طراحی و استایل‌دهی با CSS",
      "طراحی واکنش‌گرا با Bootstrap",
      "برنامه‌نویسی تعاملی با JavaScript",
      "ساخت رابط کاربری با React",
      "کار با API و داده‌های پویا",
    ],
    technologies: [
      {
        icon: "bi-filetype-html",
        title: "HTML",
        text: "ساخت اسکلت و ساختار اصلی صفحات وب",
      },
      {
        icon: "bi-filetype-css",
        title: "CSS",
        text: "طراحی ظاهر، رنگ‌بندی، فاصله‌ها و چیدمان",
      },
      {
        icon: "bi-filetype-js",
        title: "JavaScript",
        text: "ایجاد رفتار و تعامل در صفحات وب",
      },
      {
        icon: "bi-braces-asterisk",
        title: "React",
        text: "ساخت رابط‌های کاربری مدرن و کامپوننت‌محور",
      },
    ],
    projects: [
      "ساخت صفحه شخصی حرفه‌ای",
      "طراحی سایت فروشگاهی",
      "ساخت پنل مدیریت",
      "ساخت وب‌اپلیکیشن با React",
    ],
  },

  backend: {
    title: "بک‌اند",
    englishTitle: "Back-end Development",
    icon: "bi-server",
    color: "backend-theme",
    shortDescription:
      "بک‌اند مغز پنهان وب‌سایت است و اطلاعات و منطق برنامه را مدیریت می‌کند.",
    description:
      "در مسیر بک‌اند یاد می‌گیری چطور سرور، دیتابیس، حساب‌های کاربری، احراز هویت و API طراحی کنی. بخش بک‌اند وظیفه دارد اطلاعات را دریافت، پردازش و ذخیره کند و پاسخ مناسب را به بخش فرانت‌اند ارسال کند.",
    skills: [
      "برنامه‌نویسی سمت سرور",
      "طراحی و مدیریت دیتابیس",
      "ساخت API",
      "احراز هویت کاربران",
      "مدیریت اطلاعات و فرم‌ها",
      "اتصال فرانت‌اند به سرور",
    ],
    technologies: [
      {
        icon: "bi-filetype-py",
        title: "Python",
        text: "زبان قدرتمند و خوانا برای توسعه بک‌اند",
      },
      {
        icon: "bi-boxes",
        title: "Django",
        text: "فریم‌ورک کامل برای ساخت وب‌سایت‌های حرفه‌ای",
      },
      {
        icon: "bi-database",
        title: "Database",
        text: "ذخیره و مدیریت اطلاعات کاربران و برنامه",
      },
      {
        icon: "bi-link-45deg",
        title: "API",
        text: "ارتباط بین فرانت‌اند، بک‌اند و سرویس‌ها",
      },
    ],
    projects: [
      "ساخت سیستم ثبت‌نام کاربران",
      "طراحی API فروشگاه اینترنتی",
      "ساخت پنل مدیریت آموزشگاه",
      "ساخت سیستم مدیریت دوره‌ها",
    ],
  },

  ai: {
    title: "هوش مصنوعی",
    englishTitle: "Artificial Intelligence",
    icon: "bi-robot",
    color: "ai-theme",
    shortDescription:
      "هوش مصنوعی به کامپیوتر کمک می‌کند داده‌ها را تحلیل کند و تصمیم‌های هوشمند بگیرد.",
    description:
      "در مسیر هوش مصنوعی با داده‌ها، الگوریتم‌ها و مدل‌های یادگیری ماشین کار می‌کنی. یاد می‌گیری چگونه اطلاعات را بررسی کنی، الگوها را پیدا کنی و سیستم‌هایی بسازی که بتوانند پیش‌بینی، دسته‌بندی یا تحلیل انجام دهند.",
    skills: [
      "مبانی برنامه‌نویسی پایتون",
      "تحلیل و آماده‌سازی داده‌ها",
      "آمار و احتمال",
      "یادگیری ماشین",
      "ساخت مدل‌های پیش‌بینی",
      "کار با ابزارهای هوش مصنوعی",
    ],
    technologies: [
      {
        icon: "bi-filetype-py",
        title: "Python",
        text: "زبان اصلی بسیاری از پروژه‌های هوش مصنوعی",
      },
      {
        icon: "bi-bar-chart-line",
        title: "Data Science",
        text: "تحلیل داده‌ها و پیدا کردن الگوهای مهم",
      },
      {
        icon: "bi-cpu",
        title: "Machine Learning",
        text: "ساخت مدل‌هایی که از داده‌ها یاد می‌گیرند",
      },
      {
        icon: "bi-stars",
        title: "AI Tools",
        text: "استفاده از ابزارهای مدرن هوش مصنوعی",
      },
    ],
    projects: [
      "پیش‌بینی قیمت یا نتیجه",
      "دسته‌بندی تصاویر و متن‌ها",
      "ساخت سیستم پیشنهاددهنده",
      "ساخت دستیار هوشمند",
    ],
  },
  algorithm: {
  title: "الگوریتم و مسابقات",
  englishTitle: "Algorithms & Programming Contests",
  icon: "bi-code-square",
  color: "algorithm-theme",
  shortDescription:
    "با الگوریتم و حل مسئله، مهارت برنامه‌نویسی خود را تقویت کن.",
  description:
    "در این مسیر با مبانی الگوریتم، ساختمان داده و تکنیک‌های حل مسئله آشنا می‌شوی و برای مسابقات برنامه‌نویسی آماده می‌شوی.",
  skills: [
    "تقویت تفکر منطقی",
    "حل مسئله با الگوریتم",
    "آشنایی با ساختمان داده",
    "تحلیل پیچیدگی زمانی",
    "برنامه‌نویسی رقابتی",
    "آمادگی برای مسابقات",
  ],
  technologies: [
    {
      icon: "bi-code-slash",
      title: "C++",
      text: "زبان محبوب در مسابقات برنامه‌نویسی",
    },
    {
      icon: "bi-filetype-py",
      title: "Python",
      text: "زبان ساده و قدرتمند برای حل مسئله",
    },
    {
      icon: "bi-diagram-3",
      title: "Data Structure",
      text: "مدیریت و سازمان‌دهی داده‌ها",
    },
    {
      icon: "bi-lightning",
      title: "Problem Solving",
      text: "حل مسئله‌های چالش‌برانگیز",
    },
  ],
  projects: [
    "حل مسائل مقدماتی الگوریتم",
    "پیاده‌سازی ساختمان داده‌ها",
    "شرکت در مسابقات برنامه‌نویسی",
    "ساخت پروژه‌های حل مسئله",
  ],
},

};

function CategoryDetails() {
  const { slug } = useParams();

  const category = categoryData[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!category) {
    return (
      <main className="category-not-found" dir="rtl">
        <h1>دسته‌بندی پیدا نشد</h1>
        <p>دسته‌بندی موردنظر شما وجود ندارد.</p>

        <Link to="/" className="category-main-button">
          بازگشت به صفحه اصلی
        </Link>
      </main>
    );
  }

  return (
    <main
      className={`category-details-page ${category.color}`}
      dir="rtl"
    >
      {/* بخش Hero */}
      <section className="category-hero">
        <div className="category-hero-background">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="category-hero-content">
          <Link to="/" className="back-home-link">
            <i className="bi bi-arrow-right"></i>
            بازگشت به صفحه اصلی
          </Link>

         

          <div className="category-hero-grid">
            <div className="category-hero-text">
              <div className="category-badge">
                مسیر یادگیری فناوران فردا
              </div>

              <h1>{category.title}</h1>

              <h2>{category.englishTitle}</h2>

              <p className="category-short-description">
                {category.shortDescription}
              </p>

              <div className="hero-buttons">
                <a href="#course-content" className="primary-category-button">
                  شروع آشنایی
                  <i className="bi bi-arrow-left"></i>
                </a>

                <Link to="/courses" className="secondary-category-button">
                  مشاهده دوره‌ها
                </Link>
              </div>
            </div>

            <div className="category-visual">
              <div className="visual-orbit orbit-one"></div>
              <div className="visual-orbit orbit-two"></div>

              <div className="category-icon-large">
                <i className={`bi ${category.icon}`}></i>
              </div>

              <div className="floating-code code-one">
                {"</>"}
              </div>

              <div className="floating-code code-two">
                {"{ }"}
              </div>

              <div className="floating-code code-three">
                {"AI"}
              </div>
            </div>
          </div>
          </div>
        
      </section>

      {/* معرفی مسیر */}
      <section
        className="category-introduction section-padding"
        id="course-content"
      >
        <div className="category-container">
          <div className="section-heading">
            <span>این مسیر برای توست اگر...</span>
            <h2>در این مسیر چه چیزهایی یاد می‌گیری؟</h2>
          </div>

          <div className="introduction-grid">
            <div className="introduction-text">
              <p>{category.description}</p>

              <div className="feature-list">
                {category.skills.map((skill) => (
                  <div className="feature-item" key={skill}>
                    <span className="feature-check">
                      <i className="bi bi-check-lg"></i>
                    </span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="learning-card">
              <div className="learning-card-top">
                <i className="bi bi-lightbulb"></i>
              </div>

              <h3>یادگیری پروژه‌محور</h3>

              <p>
                مطالب را فقط حفظ نمی‌کنی؛ با انجام پروژه‌های واقعی،
                مهارت‌هایت را تقویت می‌کنی.
              </p>

              <div className="learning-card-line"></div>

              <strong>از یادگیری تا ساخت محصول واقعی</strong>
            </div>
          </div>
        </div>
      </section>

      {/* تکنولوژی‌ها */}
      <section className="technologies-section section-padding">
        <div className="category-container">
          <div className="section-heading centered-heading">
            <span>ابزارهای مسیر</span>
            <h2>با چه تکنولوژی‌هایی کار می‌کنی؟</h2>
          </div>

          <div className="technology-grid">
            {category.technologies.map((technology) => (
              <div className="technology-card" key={technology.title}>
                <div className="technology-icon">
                  <i className={`bi ${technology.icon}`}></i>
                </div>

                <h3>{technology.title}</h3>
                <p>{technology.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* پروژه‌ها */}
      <section className="projects-section section-padding">
        <div className="category-container">
          <div className="project-box">
            <div className="project-box-text">
              <span>چیزهایی که می‌سازی</span>
              <h2>با مهارت‌هایت پروژه‌های واقعی بساز</h2>

              <p>
                در پایان مسیر، فقط اطلاعات تئوری نداری؛ بلکه چند پروژه
                قابل ارائه برای نمونه‌کار و رزومه‌ات خواهی داشت.
              </p>
            </div>

            <div className="project-list">
              {category.projects.map((project, index) => (
                <div className="project-item" key={project}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{project}</p>
                  <i className="bi bi-arrow-left"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* دعوت به اقدام */}
      <section className="category-cta section-padding">
        <div className="category-container">
          <div className="cta-content">
            <div className="cta-icon">
              <i className="bi bi-rocket-takeoff"></i>
            </div>

            <h2>آماده‌ای مسیرت رو شروع کنی؟</h2>

            <p>
              قدم اول را بردار و وارد دنیای فناوری شو.
            </p>

            <Link to="/courses" className="cta-button">
              مشاهده دوره‌های فناوران فردا
              <i className="bi bi-arrow-left"></i>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CategoryDetails;
