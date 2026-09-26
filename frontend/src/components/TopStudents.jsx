
const topStudents = [
  {
    id: 1,
    category: "فرانت‌اند",
    categoryIcon: "bi-window-stack",
    studentName: "محمدرضا احمدی",
    course: "دوره جامع React",
    score: "۹۸ از ۱۰۰",
    image: "/image/student1.jpg",
  },
  {
    id: 2,
    category: "بک‌اند",
    categoryIcon: "bi-server",
    studentName: "زهرا کریمی",
    course: "دوره Python و Django",
    score: "۹۶ از ۱۰۰",
    image: "/image/student1.jpg",
  },
  {
    id: 3,
    category: "هوش مصنوعی",
    categoryIcon: "bi-robot",
    studentName: "امیرحسین رضایی",
    course: "دوره هوش مصنوعی",
    score: "۹۵ از ۱۰۰",
    image: "/image/student1.jpg",
  },
  {
    id: 4,
    category: "الگوریتم و مسابقات",
    categoryIcon: "bi-code-square",
    studentName: "نگین حسینی",
    course: "دوره الگوریتم و حل مسئله",
    score: "۹۴ از ۱۰۰",
    image: "/image/student1.jpg",
  },
];

function TopStudents() {
  return (
    <section className="top-students-section py-5" dir="rtl">
      <div className="container">
        <div className="text-center mb-5">
          <span className="top-students-label">
            افتخارآفرینان فناوران فردا
          </span>

          <h2 className="section-title">
            رتبه اول هر دوره
          </h2>

          <p className="section-sub">
            معرفی برترین هنرجویان دوره‌های مختلف آموزشگاه
          </p>
        </div>

        <div className="row g-4">
          {topStudents.map((student) => (
            <div
              className="col-12 col-sm-4 col-lg-3"
              key={student.id}
            >
              <article className="top-student-card h-100">
                <div className="top-student-card-header">
                  <div className="top-student-category">
                    <i className={`bi ${student.categoryIcon}`}></i>
                    <span>{student.category}</span>
                  </div>

                  <div className="top-student-rank">
                    <i className="bi bi-trophy-fill"></i>
                    <span>رتبه اول</span>
                  </div>
                </div>

                <div className="top-student-image-wrapper">
                  <img
                    src={student.image}
                    alt={student.studentName}
                    className="top-student-image"
                  />
                </div>

                <h3 className="top-student-name">
                  {student.studentName}
                </h3>

                <p className="top-student-course">
                  {student.course}
                </p>

                <div className="top-student-score">
                  <span>امتیاز نهایی</span>
                  <strong>{student.score}</strong>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopStudents;
