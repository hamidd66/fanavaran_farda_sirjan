
const topTeachers = [
  {
    id: 1,
    name: "استاد امیر رضایی",
    field: "فرانت‌اند و React",
    score: "4.9 / 5",
    votes: "128 نظر",
    image: "/image/student1.jpg",
    icon: "bi-person-workspace",
  },
  {
    id: 2,
    name: "استاد سارا محمدی",
    field: "پایتون و جنگو",
    score: "4.8 / 5",
    votes: "116 نظر",
    image: "/image/student1.jpg",
    icon: "bi-person-badge",
  },
  {
    id: 3,
    name: "استاد علی حسینی",
    field: "هوش مصنوعی و داده",
    score: "4.9 / 5",
    votes: "104 نظر",
    image: "/image/student1.jpg",
    icon: "bi-cpu-fill",
  },
  {
    id: 4,
    name: "استاد مریم کریمی",
    field: "الگوریتم و مسابقات",
    score: "4.7 / 5",
    votes: "98 نظر",
    image: "/image/student1.jpg",
    icon: "bi-code-square",
  },
];

const topStudents = [
  {
    id: 1,
    name: "محمدرضا احمدی",
    field: "فرانت‌اند",
    score: "98 / 100",
    votes: "رتبه 1",
    image: "/image/student1.jpg",
    icon: "bi-trophy-fill",
  },
  {
    id: 2,
    name: "زهرا کریمی",
    field: "بک‌اند",
    score: "96 / 100",
    votes: "رتبه 1",
    image: "/image/student1.jpg",
    icon: "bi-trophy-fill",
  },
  {
    id: 3,
    name: "امیرحسین رضایی",
    field: "هوش مصنوعی",
    score: "95 / 100",
    votes: "رتبه 1",
    image: "/image/student1.jpg",
    icon: "bi-trophy-fill",
  },
  {
    id: 4,
    name: "نگین حسینی",
    field: "الگوریتم و مسابقات",
    score: "94 / 100",
    votes: "رتبه 1",
    image: "/image/student1.jpg",
    icon: "bi-trophy-fill",
  },
];

function TopPerformers() {
  return (
    <section className="top-performers-section py-5" dir="rtl">
      <div className="container text-center">
       
       <div>
          <span className="top-performers-badge">
            انتخاب‌های برتر فناوران فردا
          </span>
          <h2 className="section-title">اساتید برتر آموزشگاه  </h2>
          <p className="section-sub">
            معرفی برترین‌ اساتید بر اساس نظرسنجی و عملکرد آموزشی
          </p>
        </div>

        <div className="performers-block mb-5">
          

          <div className="row g-4">
            {topTeachers.map((teacher) => (
              <div className="col-12 col-sm-6 col-lg-3" key={teacher.id}>
                <article className="performer-card h-100">
                  <div className="performer-card-top">
                    <div className="performer-icon">
                      <i className={`bi ${teacher.icon}`}></i>
                    </div>
                    <div className="performer-score">
                      <i className="bi bi-star-fill"></i>
                      <span>{teacher.score}</span>
                    </div>
                  </div>

                  <div className="performer-avatar-wrap">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="performer-avatar"
                    />
                  </div>

                  <h3 className="performer-name">{teacher.name}</h3>
                  <p className="performer-field">{teacher.field}</p>

                  <div className="performer-meta">
                    <i className="bi bi-chat-square-text"></i>
                    <span>{teacher.votes}</span>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        
        </div>
    </section>
  );
}

export default TopPerformers;
