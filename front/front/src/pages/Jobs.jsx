import { useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/stylejob.css";


const jobsData = [
  {
    id: 1,
    category: "frontend",
    location: "iran",
    title: "React Developer",
    company: "دیجی‌کالا — تهران",
    tags: [
      { title: "React", type: "frontend" },
      { title: "TypeScript", type: "frontend" },
      { title: "حضوری", type: "onsite" },
    ],
    salary: "۲۵–۴۰ میلیون تومان",
    address: "تهران، ایران",
  },
  {
    id: 2,
    category: "frontend",
    location: "iran",
    title: "UI Developer (Vue.js)",
    company: "اسنپ — تهران",
    tags: [
      { title: "Vue.js", type: "frontend" },
      { title: "CSS", type: "frontend" },
      { title: "هیبرید", type: "hybrid" },
    ],
    salary: "۲۰–۳۵ میلیون تومان",
    address: "تهران، ایران",
  },
  {
    id: 3,
    category: "frontend",
    location: "remote",
    title: "Frontend Engineer (React)",
    company: "استارتاپ ریموت",
    tags: [
      { title: "React", type: "frontend" },
      { title: "Next.js", type: "frontend" },
      { title: "ریموت", type: "remote" },
    ],
    salary: "۳۰–۵۰ میلیون تومان",
    address: "ریموت — سراسر ایران",
  },
  {
    id: 4,
    category: "frontend",
    location: "abroad",
    title: "Senior React Developer",
    company: "Tech Company — آلمان",
    tags: [
      { title: "React", type: "frontend" },
      { title: "Redux", type: "frontend" },
      { title: "ریموت/ویزا", type: "remote" },
    ],
    salary: "€۴۵۰۰–€۶۵۰۰ / ماه",
    address: "برلین، آلمان",
  },
  {
    id: 5,
    category: "backend",
    location: "iran",
    title: "ASP.NET Core Developer",
    company: "شرکت نرم‌افزاری — اصفهان",
    tags: [
      { title: "C#", type: "backend" },
      { title: "ASP.NET Core", type: "backend" },
      { title: "حضوری", type: "onsite" },
    ],
    salary: "۱۸–۳۰ میلیون تومان",
    address: "اصفهان، ایران",
  },
  {
    id: 6,
    category: "backend",
    location: "iran",
    title: "Python / Django Developer",
    company: "فین‌تک استارتاپ — تهران",
    tags: [
      { title: "Python", type: "backend" },
      { title: "Django", type: "backend" },
      { title: "هیبرید", type: "hybrid" },
    ],
    salary: "۲۲–۳۸ میلیون تومان",
    address: "تهران، ایران",
  },
  {
    id: 7,
    category: "backend",
    location: "remote",
    title: "Backend Developer (Node/Python)",
    company: "SaaS Platform — ریموت",
    tags: [
      { title: "Node.js", type: "backend" },
      { title: "PostgreSQL", type: "backend" },
      { title: "ریموت", type: "remote" },
    ],
    salary: "۳۵–۵۵ میلیون تومان",
    address: "ریموت — بین‌المللی",
  },
  {
    id: 8,
    category: "backend",
    location: "abroad",
    title: "Senior .NET Developer",
    company: "Software Corp — کانادا",
    tags: [
      { title: "C#", type: "backend" },
      { title: ".NET 8", type: "backend" },
      { title: "ریموت/ویزا", type: "remote" },
    ],
    salary: "$۵۰۰۰–$۷۵۰۰ / ماه",
    address: "تورنتو، کانادا",
  },
  {
    id: 9,
    category: "ai",
    location: "iran",
    title: "ML Engineer",
    company: "شرکت هوش مصنوعی — تهران",
    tags: [
      { title: "Python", type: "ai" },
      { title: "TensorFlow", type: "ai" },
      { title: "هیبرید", type: "hybrid" },
    ],
    salary: "۳۰–۵۰ میلیون تومان",
    address: "تهران، ایران",
  },
  {
    id: 10,
    category: "ai",
    location: "remote",
    title: "Data Scientist",
    company: "Analytics Startup — ریموت",
    tags: [
      { title: "Python", type: "ai" },
      { title: "Pandas", type: "ai" },
      { title: "ریموت", type: "remote" },
    ],
    salary: "۴۰–۶۰ میلیون تومان",
    address: "ریموت — بین‌المللی",
  },
  {
    id: 11,
    category: "ai",
    location: "abroad",
    title: "AI/ML Engineer",
    company: "AI Startup — هلند",
    tags: [
      { title: "PyTorch", type: "ai" },
      { title: "LLM", type: "ai" },
      { title: "ریموت/ویزا", type: "remote" },
    ],
    salary: "€۵۰۰۰–€۸۰۰۰ / ماه",
    address: "آمستردام، هلند",
  },
];

const slides = [
  "5-1.jpg",
  "5-2.jpg",
  "5-3.jpg",
  "5-4.jpg",
  "5-5.jpg",
  "5-6.jpg",
  "5-7.jpg",
];

const categoryFilters = [
  { value: "all", title: "همه تخصص‌ها" },
  { value: "frontend", title: "فرانت‌اند" },
  { value: "backend", title: "بک‌اند" },
  { value: "ai", title: "هوش مصنوعی" },
];

const locationFilters = [
  { value: "all", title: "همه موقعیت‌ها" },
  { value: "iran", title: "ایران" },
  { value: "abroad", title: "خارج از کشور" },
  { value: "remote", title: "ریموت" },
];

export default function Jobs() {


  // صفحه مستقیماً از بالا باز می‌شود، بدون انیمیشن اسکرول
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLocation, setActiveLocation] = useState("all");
  const [activeSlide, setActiveSlide] = useState(0);

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return jobsData.filter((job) => {
      const matchesCategory =
        activeCategory === "all" || job.category === activeCategory;

      const matchesLocation =
        activeLocation === "all" || job.location === activeLocation;

      const searchableText = [
        job.title,
        job.company,
        job.salary,
        job.address,
        ...job.tags.map((tag) => tag.title),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search.length === 0 || searchableText.includes(search);

      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [activeCategory, activeLocation, searchTerm]);

  const goToPreviousSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const goToNextSlide = () => {
    setActiveSlide((current) =>
      current === slides.length - 1 ? 0 : current + 1
    );
  };

  return (
<>
           <Navbar />

<div>
      {/* Hero */}
            {/* Hero Section */}
      <section className="jobs-hero py-4">
        <div className="container">
          <div className="row align-items-center g-4">
            
            {/* سمت راست: متن‌ها و بج‌ها */}
            <div className="col-lg-6">
              <span className="hero-badge">
                <i className="bi bi-briefcase-fill ms-1"></i>
                بازار کار فناوری
              </span>

              <h1 className="mt-3">
                فرصت‌های شغلی
                <br />
                فرانت‌اند، بک‌اند و هوش مصنوعی
              </h1>

              <p className="text-muted mt-3">
                جدیدترین موقعیت‌های شغلی در ایران و خارج از کشور برای برنامه‌نویسان و متخصصان فناوری. مسیر شغلی خود را با فناوران فردا بسازید.
              </p>

              <div className="d-flex gap-2 flex-wrap mt-4">
                <span className="tag tag-frontend fs-6 px-3 py-2">فرانت‌اند</span>
                <span className="tag tag-backend fs-6 px-3 py-2">بک‌اند</span>
                <span className="tag tag-ai fs-6 px-3 py-2">هوش مصنوعی</span>
                <span className="tag tag-remote fs-6 px-3 py-2">ریموت</span>
              </div>
            </div>

            {/* سمت چپ: اسلایدر تصاویر */}
            <div className="col-lg-6">
              <div className="job-carousel carousel slide rounded-4 overflow-hidden shadow position-relative">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src={`/image/${slides[activeSlide]}`}
                      className="d-block w-100"
                      alt={`اسلاید ${activeSlide + 1}`}
                      style={{ height: "420px", objectFit: "cover" }}
                    />
                  </div>
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  onClick={goToPreviousSlide}
                  aria-label="اسلاید قبلی"
                >
                  <span className="carousel-control-prev-icon"></span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  onClick={goToNextSlide}
                  aria-label="اسلاید بعدی"
                >
                  <span className="carousel-control-next-icon"></span>
                </button>

                <div className="carousel-indicators">
                  {slides.map((slide, index) => (
                    <button
                      key={slide}
                      type="button"
                      className={index === activeSlide ? "active" : ""}
                      onClick={() => setActiveSlide(index)}
                      aria-label={`رفتن به اسلاید ${index + 1}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* Career Paths */}
      <section className="py-5" style={{ backgroundColor: "#f6effc" }}>
        <div className="container">
          <h2 className="section-title text-center mb-2">
            مسیرهای شغلی پیش روی شما
          </h2>

          <p className="section-sub text-center mb-4">
            با یادگیری مهارت‌های کاربردی، مسیر مناسب خود را انتخاب کنید.
          </p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tip-card h-100 text-center">
                <div
                  className="tip-icon mx-auto mb-3"
                  style={{ background: "#ede9fe", color: "#5b21b6" }}
                >
                  <i className="bi bi-building"></i>
                </div>

                <h5>استخدام در شرکت</h5>

                <p>
                  برای فرصت‌های استخدامی شرکت‌های معتبر رزومه ارسال کنید.
                </p>

                <a
                  href="https://jobinja.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  مشاهده فرصت‌ها
                </a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tip-card h-100 text-center">
                <div
                  className="tip-icon mx-auto mb-3"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  <i className="bi bi-person-workspace"></i>
                </div>

                <h5>فریلنسری</h5>

                <p>
                  پروژه‌های مختلف را دریافت کنید و به‌صورت مستقل فعالیت کنید.
                </p>

                <a
                  href="https://ponisha.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-success btn-sm"
                >
                  مشاهده پروژه‌ها
                </a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tip-card h-100 text-center">
                <div
                  className="tip-icon mx-auto mb-3"
                  style={{ background: "#fef3c7", color: "#d97706" }}
                >
                  <i className="bi bi-kanban"></i>
                </div>

                <h5>پروژه از شرکت‌ها</h5>

                <p>
                  با ساخت پورتفولیو، پروژه‌های بین‌المللی و داخلی بگیرید.
                </p>

                <a
                  href="https://freelancer.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-warning btn-sm"
                >
                  شروع فعالیت
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">آخرین فرصت‌های شغلی</h2>
            <p className="section-sub">
              فرصت مناسب خود را با استفاده از فیلترها پیدا کنید.
            </p>
          </div>

          {/* Filters */}
          <div className="filter-bar d-flex flex-wrap gap-2 align-items-center mb-4">
            <span style={{ fontWeight: 700, fontSize: ".9rem" }}>
              تخصص:
            </span>

            {categoryFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-btn ${
                  activeCategory === filter.value ? "active" : ""
                }`}
                onClick={() => setActiveCategory(filter.value)}
              >
                {filter.title}
              </button>
            ))}

            <span
              className="me-3"
              style={{ fontWeight: 700, fontSize: ".9rem" }}
            >
              موقعیت:
            </span>

            {locationFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`location-btn ${
                  activeLocation === filter.value ? "active" : ""
                }`}
                onClick={() => setActiveLocation(filter.value)}
              >
                {filter.title}
              </button>
            ))}
          </div>

          {/* Job Cards */}
          <div className="row g-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="col-md-6 col-lg-4 job-item"
                data-cat={job.category}
                data-loc={job.location}
              >
                <div className="job-card h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="company-logo">
                      <i className="bi bi-building"></i>
                    </div>

                    <div>
                      <h5 className="mb-1">{job.title}</h5>
                      <div className="company-name">{job.company}</div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {job.tags.map((tag) => (
                      <span
                        key={`${job.id}-${tag.title}`}
                        className={`tag ${tag.type ? `tag-${tag.type}` : ""}`}
                      >
                        {tag.title}
                      </span>
                    ))}
                  </div>

                  <div className="salary mb-3">
                    <i className="bi bi-wallet2 ms-1"></i>
                    {job.salary}
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="job-location">
                      <i className="bi bi-geo-alt ms-1"></i>
                      {job.address}
                    </div>

                    <button
                      type="button"
                      className="apply-btn"
                      onClick={() =>
                        alert(`برای موقعیت «${job.title}» رزومه ارسال کنید.`)
                      }
                    >
                      ارسال رزومه
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div id="emptyState" className="text-center py-5">
              <i className="bi bi-search display-4 text-muted"></i>
              <h5 className="mt-3">
                موقعیت شغلی‌ای با این فیلتر یافت نشد.
              </h5>
              <p className="text-muted">
                فیلترها یا عبارت جست‌وجو را تغییر دهید.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Tips */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">
            چگونه شانس استخدام خود را افزایش دهیم؟
          </h2>

          <p className="section-sub text-center mb-4">
            چند نکته مهم برای ورود حرفه‌ای به بازار کار
          </p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="tip-card h-100">
                <div
                  className="tip-icon"
                  style={{ background: "#ede9fe", color: "#5b21b6" }}
                >
                  <i className="bi bi-mortarboard-fill"></i>
                </div>

                <h5>۱. آموزش تخصصی</h5>
                <p>
                  مهارت‌های کاربردی و موردنیاز بازار کار را به‌صورت اصولی
                  یاد بگیرید.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tip-card h-100">
                <div
                  className="tip-icon"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  <i className="bi bi-folder2-open"></i>
                </div>

                <h5>۲. پورتفولیو بسازید</h5>
                <p>
                  چند پروژه واقعی ایجاد کنید و آن‌ها را در گیت‌هاب و رزومه خود
                  قرار دهید.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tip-card h-100">
                <div
                  className="tip-icon"
                  style={{ background: "#fef3c7", color: "#d97706" }}
                >
                  <i className="bi bi-send-fill"></i>
                </div>

                <h5>۳. رزومه ارسال کنید</h5>
                <p>
                  برای فرصت‌های مناسب رزومه ارسال کنید و ارتباط حرفه‌ای خود را
                  توسعه دهید.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     </div>
      <Footer />
    </>
  );
}
