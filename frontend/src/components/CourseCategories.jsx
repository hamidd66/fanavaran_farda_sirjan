import { Link } from "react-router-dom";



function CourseCategories() {
 const categories = [
  {
    title: "فرانت‌اند",
    slug: "frontend",
    icon: "bi-window-stack",
    description:
      "طراحی ظاهر سایت‌ها و ساخت رابط‌های کاربری جذاب و تعاملی",
  },
  {
    title: "بک‌اند",
    slug: "backend",
    icon: "bi-server",
    description:
      "ساخت منطق، API، دیتابیس و بخش‌های پنهان وب‌سایت",
  },
  {
    title: "هوش مصنوعی",
    slug: "ai",
    icon: "bi-robot",
    description:
      "ساخت سیستم‌های هوشمند، تحلیل داده و یادگیری ماشین",
  },
  {
    title: "الگوریتم و مسابقات",
    slug: "algorithm",
    icon: "bi-code-square",
    description:
      "تقویت حل مسئله و آمادگی برای مسابقات برنامه‌نویسی",
  },
];


  return (
    <section className="course-categories py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">دسته‌بندی دوره‌ها</h2>
          <p className="section-sub">
            مسیر یادگیری خود را انتخاب کنید و قدم‌به‌قدم وارد دنیای فناوری شوید
          </p>
        </div>

        <div className="row g-4">
          {categories.map((category, index) => (
            <div className="col-12 col-sm-6 col-lg-3" key={index}>
              <div className="cat-card h-100">
                <div className="cat-icon">
                  <i className={`bi ${category.icon}`}></i>
                </div>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

     <Link
  to={`/category/${category.slug}`}
  className="cat-link"
>
  مشاهده توضیحات
  <i className="bi bi-arrow-left-short"></i>
</Link>


              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CourseCategories;
