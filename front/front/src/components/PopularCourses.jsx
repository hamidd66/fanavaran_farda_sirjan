import { Link } from "react-router-dom";



function PopularCourses() {
  const courses = [
    {
      image: '/image/course-1.png',
      status: 'حضوری',
      title: 'دوره جامع فرانت‌اند از صفر تا بازار کار',
      teacher: 'استاد علی رضایی',
      rating: '4.9',
      students: '124 نفر',
    },
    {
      image: '/image/course-2.png',
      status: 'حضوری',
      title: 'آموزش Python و Django پروژه‌محور',
      teacher: 'استاد محمد احمدی',
      rating: '4.8',
      students: '98 نفر',
    },
    {
      image: '/image/course-3.png',
      status: 'حضوری',
      title: 'هوش مصنوعی، دیتاساینس و Machine Learning',
      teacher: 'استاد سارا کریمی',
      rating: '5.0',
      students: '76 نفر',
    },
    {
      image: '/image/course-1.png',
      status: 'حضوری',
      title: 'هوش مصنوعی، دیتاساینس و Machine Learning',
      teacher: 'استاد سارا کریمی',
      rating: '5.0',
      students: '76 نفر',
    },
  ];

  return (
    <section className="popular-courses py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">دوره‌های پرطرفدار</h2>
          <p className="section-sub">
            محبوب‌ترین دوره‌های آموزشگاه که هنرجوها بیشتر انتخاب کرده‌اند
          </p>
        </div>

        <div className="row g-4">
          {courses.map((course, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <div className="course-card-pro h-100">
                <div className="cover-wrap">
                  <img src={course.image} alt={course.title} className="course-cover-pro" />
                  <span className="badge-status">{course.status}</span>
                </div>

                <div className="p-3 p-md-4">
                  <h3 className="course-title-pro">{course.title}</h3>

                  <div className="course-teacher-pro">
                    <i className="bi bi-person-badge"></i>
                    <span>{course.teacher}</span>
                  </div>

                  <div className="course-meta-pro">
                    <div className="course-rating-pro">
                      <i className="bi bi-star-fill"></i>
                      <span>{course.rating}</span>
                    </div>

                    <div className="course-students-pro">
                      <i className="bi bi-people-fill"></i>
                      <span>{course.students}</span>
                    </div>
                  </div>

                <Link
  to={`/course-detail?title=${encodeURIComponent(course.title)}`}
  className="btn btn-course-pro"
>
  مشاهده اطلاعات کامل دوره
</Link>



                

                    




                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularCourses;
