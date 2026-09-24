import { useLayoutEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/styleinstructors.css";

const instructorsData = [
  {
    id: 1,
    path: "front",
    image: "/image/1.jpg",
    alt: "مدرس فرانت‌اند",
    name: "استاد فرانت‌اند",
    specialty: "متخصص HTML، CSS، JavaScript و React",
    description: "بیش از 5 سال تجربه در طراحی رابط کاربری و توسعه وب مدرن.",
    degrees: "کارشناسی ارشد مهندسی نرم‌افزار",
    classes: "HTML, CSS, Bootstrap, JavaScript, React",
  },
  {
    id: 2,
    path: "back",
    image: "/image/2.jpg",
    alt: "مدرس بک‌اند",
    name: "استاد بک‌اند",
    specialty: "متخصص C#، ASP.NET Core و Python",
    description: "توسعه API، پایگاه داده، معماری سمت سرور و پروژه‌های سازمانی.",
    degrees: "مدرس ارشد توسعه نرم‌افزار",
    classes: "Python, Django, C#, ASP.NET Core, API",
  },
  {
    id: 3,
    path: "ai",
    image: "/image/3.jpg",
    alt: "مدرس هوش مصنوعی",
    name: "استاد هوش مصنوعی",
    specialty: "متخصص یادگیری ماشین و علم داده",
    description: "Machine Learning، Data Science و طراحی پروژه‌های هوشمند.",
    degrees: "پژوهشگر هوش مصنوعی",
    classes: "AI, ML, Data Science, Python",
  },
  {
    id: 4,
    path: "ai",
    image: "/image/3.jpg",
    alt: "مدرس هوش مصنوعی",
    name: "استاد هوش مصنوعی",
    specialty: "متخصص یادگیری ماشین و علم داده",
    description: "Machine Learning، Data Science و طراحی پروژه‌های هوشمند.",
    degrees: "پژوهشگر هوش مصنوعی",
    classes: "AI, ML, Data Science, Python",
  },
];

const filterOptions = [
  { key: "all", label: "همه" },
  { key: "front", label: "فرانت‌اند" },
  { key: "back", label: "بک‌اند" },
  { key: "ai", label: "هوش مصنوعی" },
];

export default function Instructors() {
  // صفحه مستقیماً از بالا باز می‌شود، بدون انیمیشن اسکرول
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeFilter, setActiveFilter] = useState("all");

  const filteredInstructors = useMemo(() => {
    if (activeFilter === "all") {
      return instructorsData;
    }

    return instructorsData.filter((item) => item.path === activeFilter);
  }, [activeFilter]);

  return (
    <div dir="rtl">
      <Navbar />

      {/* Hero */}
      <section className="instructors-hero py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="hero-badge">
                <i className="bi bi-mortarboard-fill ms-1" />
                مدرسین فناوران فردا
              </span>

              <h1 className="mt-3">
                با بهترین اساتید
                <br />
                در مسیر تخصصی فناوری همراه شوید
              </h1>

              <p className="text-muted mt-3">
                با مدرسین حرفه‌ای در حوزه‌های فرانت‌اند، بک‌اند و هوش مصنوعی
                آشنا شوید و مسیر یادگیری خود را با تجربه واقعی و آموزش کاربردی
                پیش ببرید.
              </p>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <span className="tag tag-frontend">فرانت‌اند</span>
                <span className="tag tag-backend">بک‌اند</span>
                <span className="tag tag-ai">هوش مصنوعی</span>
                <span className="tag tag-remote">پروژه محور</span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="instructor-hero-card shadow-lg">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="hero-icon-box">
                    <i className="bi bi-stars" />
                  </div>

                  <div>
                    <h5 className="mb-1">آموزش با کیفیت، نتیجه‌محور</h5>
                    <small className="text-muted">
                      انتخاب مدرس مناسب، شروع مسیر حرفه‌ای
                    </small>
                  </div>
                </div>

                <div className="hero-stat-grid">
                  <div className="hero-stat">
                    <strong>3+</strong>
                    <span>حوزه تخصصی</span>
                  </div>

                  <div className="hero-stat">
                    <strong>100%</strong>
                    <span>کاربردی</span>
                  </div>

                  <div className="hero-stat">
                    <strong>پروژه</strong>
                    <span>محور</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-2">
        <div className="container">
          <div className="filter-bar">
            {filterOptions.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`filter-btn ${
                  activeFilter === item.key ? "active" : ""
                }`}
                onClick={() => setActiveFilter(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {filteredInstructors.map((instructor) => (
              <div key={instructor.id} className="col-12 col-md-4 col-lg-3">
                <div className="instructor-card h-100">
                  <div className="instructor-image-wrap">
                    <img src={instructor.image} alt={instructor.alt} />

                    <span
                      className={`path-badge ${
                        instructor.path === "front"
                          ? "badge-front"
                          : instructor.path === "back"
                            ? "badge-back"
                            : "badge-ai"
                      }`}
                    >
                      {instructor.path === "front"
                        ? "فرانت‌اند"
                        : instructor.path === "back"
                          ? "بک‌اند"
                          : "هوش مصنوعی"}
                    </span>
                  </div>

                  <div className="card-body">
                    <h5>{instructor.name}</h5>

                    <div className="specialty">
                      {instructor.specialty}
                    </div>

                    <p>{instructor.description}</p>

                    <div className="instructor-meta">
                      <div className="meta-item">
                        <span>مدارک:</span>
                        <strong>{instructor.degrees}</strong>
                      </div>

                      <div className="meta-item">
                        <span>کلاس‌ها:</span>
                        <strong>{instructor.classes}</strong>
                      </div>
                    </div>

                    <Link to="/contact" className="btn-profile mt-3">
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInstructors.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted mb-0">
                هیچ مدرسی برای این بخش یافت نشد.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Join Section */}
      <section className="join-section py-5">
        <div className="container">
          <div className="join-box text-center">
            <h2>می‌خواهید به جمع مدرسین فناوران فردا بپیوندید؟</h2>

            <p className="mb-4">
              اگر در حوزه‌های برنامه‌نویسی، طراحی وب، هوش مصنوعی، علم داده یا
              الگوریتم تجربه و علاقه به تدریس دارید، درخواست همکاری خود را ثبت
              کنید.
            </p>

            <Link
              to="/registerteacher"
              className="btn btn-primary px-4 py-2"
            >
              <i className="bi bi-person-plus-fill ms-2" />
              ثبت‌نام به‌عنوان مدرس
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
