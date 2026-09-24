import { useLayoutEffect, useRef, useState ,useMemo} from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/stylecourses.css";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const coursesData = [
    {
      id: 1,
      title: "آموزش HTML و CSS",
      category: "frontend",
      subtitle: "پایه طراحی وب — ساخت صفحات واکنش‌گرا",
      description:
        "از صفر تا ساخت صفحات وب زیبا با HTML5 و CSS3 به‌صورت پروژه‌محور.",
      sessions: "۱۸ جلسه",
      mode: "آنلاین",
      icon: (
        <i
          className="devicon-html5-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #e44d26, #f16529)",
      },
    },
    {
      id: 2,
      title: "آموزش Bootstrap",
      category: "frontend",
      subtitle: "طراحی واکنش‌گرا — فریم‌ورک CSS",
      description:
        "طراحی سریع و حرفه‌ای رابط کاربری با Bootstrap 5 و گرید سیستم.",
      sessions: "۱۲ جلسه",
      mode: "حضوری",
      icon: (
        <i
          className="devicon-bootstrap-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #7952b3, #a370f7)",
      },
    },
    {
      id: 3,
      title: "آموزش JavaScript",
      category: "frontend",
      subtitle: "برنامه‌نویسی وب — تعامل و پویایی",
      description:
        "از مبانی تا مفاهیم پیشرفته JS با تمرین‌های عملی و پروژه واقعی.",
      sessions: "۲۴ جلسه",
      mode: "آنلاین",
      icon: (
        <i
          className="devicon-javascript-plain"
          style={{ color: "#1f2937", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #f7df1e, #e8c900)",
      },
    },
    {
      id: 4,
      title: "آموزش React",
      category: "frontend",
      subtitle: "فرانت‌اند پیشرفته — SPA",
      description:
        "ساخت رابط‌های کاربری تعاملی و مقیاس‌پذیر با React و Hooks.",
      sessions: "۲۸ جلسه",
      mode: "آنلاین",
      icon: (
        <i
          className="devicon-react-original"
          style={{ color: "#61dafb", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #20232a, #61dafb)",
      },
    },
    {
      id: 5,
      title: "آموزش C#",
      category: "backend",
      subtitle: "بک‌اند حرفه‌ای — شیءگرایی",
      description:
        "برنامه‌نویسی C# از پایه تا پروژه واقعی با تمرکز بر OOP.",
      sessions: "۳۰ جلسه",
      mode: "حضوری",
      icon: (
        <i
          className="devicon-csharp-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #239120, #68217a)",
      },
    },
    {
      id: 6,
      title: "آموزش Python",
      category: "backend",
      subtitle: "آموزش کاربردی — همه‌منظوره",
      description:
        "پایتون از صفر تا صد با رویکرد عملی برای وب، داده و هوش مصنوعی.",
      sessions: "۲۶ جلسه",
      mode: "آنلاین",
      icon: (
        <i
          className="devicon-python-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #3776ab, #ffd43b)",
      },
    },
    {
      id: 7,
      title: "آموزش ASP.NET Core",
      category: "backend",
      subtitle: "توسعه بک‌اند — وب‌سرویس",
      description:
        "ساخت اپلیکیشن‌های وب و API امن و مقیاس‌پذیر با ASP.NET Core.",
      sessions: "۳۲ جلسه",
      mode: "حضوری",
      icon: (
        <i
          className="devicon-dot-net-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #512bd4, #9b59b6)",
      },
    },
    {
      id: 8,
      title: "آموزش Django",
      category: "backend",
      subtitle: "فریم‌ورک پایتون — وب پویا",
      description:
        "ساخت وب‌سایت‌های امن و مقیاس‌پذیر با Django و معماری MVT.",
      sessions: "۲۲ جلسه",
      mode: "آنلاین",
      icon: (
        <i
          className="devicon-django-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #092e20, #44b78b)",
      },
    },
    {
      id: 9,
      title: "آموزش پایگاه داده",
      category: "data",
      subtitle: "SQL Server — طراحی و مدیریت",
      description:
        "طراحی، پرس‌وجو و مدیریت پایگاه داده با SQL Server از مقدماتی تا پیشرفته.",
      sessions: "۲۰ جلسه",
      mode: "حضوری",
      icon: (
        <i
          className="devicon-microsoftsqlserver-plain"
          style={{ color: "#ffffff", fontSize: "54px" }}
        />
      ),
      coverStyle: {
        background: "linear-gradient(135deg, #ffc0bf, #e8736f)",
      },
    },
    {
      id: 10,
      title: "آموزش طراحی API",
      category: "ai",
      subtitle: "REST API — یکپارچه‌سازی سرویس‌ها",
      description:
        "طراحی و پیاده‌سازی REST API حرفه‌ای با اصول امنیت و مستندسازی.",
      sessions: "۱۶ جلسه",
      mode: "آنلاین",
      icon: <span style={{ color: "#ffffff", fontSize: "52px" }}>🔌</span>,
      coverStyle: {
        background: "linear-gradient(135deg, #0f4c81, #2980b9)",
      },
    },
  ];

  const categories = [
    { id: "all", label: "همه دوره‌ها", count: 10 },
    { id: "frontend", label: "فرانت‌اند", count: 4 },
    { id: "backend", label: "بک‌اند", count: 4 },
    { id: "ai", label: "هوش مصنوعی", count: 1 },
    { id: "data", label: "علم داده", count: 1 },
  ];

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesFilter =
        activeFilter === "all" || course.category === activeFilter;

      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, activeFilter]);

  return (
    <>
      <Navbar />

          {/* Hero Section */}
            <section className="courses-hero text-white py-2">
                <div className="container py-3">
                    <h1 className="fw-bold mb-3"><i className="bi bi-collection-play-fill me-2"></i>دوره‌های آموزشی</h1>
                    <p className="lead opacity-75">مسیر یادگیری حرفه‌ای خود را در آموزشگاه فناوران فردا سیرجان آغاز کنید.</p>
                </div>
            </section>

      <div className="container mt-4 mb-5">
        <div className="row g-4">
      <aside className="col-lg-3">
  <div className="sidebar-card mb-4">
    <h6 className="fw-bold mb-3">
      <i className="bi bi-search ms-1"></i>
      جستجوی دوره
    </h6>

    <div className="search-box">
      <i className="bi bi-search search-icon"></i>
      <input
        id="courseSearchInput"
        type="text"
        className="form-control search-input w-100"
        placeholder="نام دوره..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>

  <div className="sidebar-card mb-4">
    <h6 className="fw-bold mb-3">دسته‌بندی</h6>

    <div className="cat-list" id="catList">
      {categories.map((category) => (
        <a
          key={category.id}
          href="#"
          className={activeFilter === category.id ? "active" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveFilter(category.id);
          }}
        >
          <span>{category.label}</span>
          <span>{category.count}</span>
        </a>
      ))}
    </div>
  </div>

  <div
    className="sidebar-card text-center"
    style={{
      background: "linear-gradient(135deg,#6d28d9,#8b5cf6)",
      color: "#fff",
    }}
  >
    <h6 className="fw-bold mb-2">استعداد یابی رایگان</h6>
    <p className="mb-3 small">همین الان مسیر خودت رو مشخص کن</p>
    <Link to="/competition" className="btn btn-light w-100 fw-bold">
      شروع استعداد یابی آنلاین
    </Link>
  </div>
</aside>


          <div className="col-lg-9">
            <div className="row g-3">
              {filteredCourses.map((course) => (
                <div className="col-md-4 col-lg-3" key={course.id}>
                  <div className="course-card-pro h-100 d-flex flex-column">
                    <div className="cover-wrap">
                      <div
                        className="course-cover-pro"
                        style={course.coverStyle}
                      >
                        {course.icon}
                      </div>

                      <span className="badge-status">{course.mode}</span>
                    </div>

                    <div className="p-3 d-flex flex-column flex-grow-1">
                      <h6 className="fw-bold mb-1" data-course-title>
                        {course.title}
                      </h6>

                      <div className="text-muted small mb-2">
                        {course.subtitle}
                      </div>

                      <p className="small text-secondary mb-3">
                        {course.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center mt-auto small text-muted mb-3">
                        <span>
                          <i className="bi bi-collection-play ms-1"></i>
                          {course.sessions}
                        </span>
                        <span>
                          <i className="bi bi-laptop ms-1"></i>
                          {course.mode}
                        </span>
                      </div>

                      <Link
                        to={`/course-detail?title=${encodeURIComponent(
                          course.title
                        )}`}
                        className="btn btn-course-pro mt-auto"
                      >
                        مشاهده اطلاعات کامل دوره
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCourses.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-light border text-center py-4 rounded-4">
                    دوره‌ای با این مشخصات پیدا نشد.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Courses;
