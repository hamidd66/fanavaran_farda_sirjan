import { Link, useParams } from "react-router-dom";
import "../style/AdminStudents.css";

export default function AdminStudentProfile() {
  const { id } = useParams();

  /*
    در آینده اطلاعات واقعی را از API دریافت می‌کنید:
    GET /api/students/:id

    فعلاً ساختار صفحه آماده است و با اتصال دیتابیس
    فقط مقدار student با داده دریافتی جایگزین می‌شود.
  */
  const student = {
    id,
    name: "هنرجو",
    fatherName: "—",
    nationalId: "—",
    birthDate: "—",
    educationLevel: "—",
    phone: "—",
    parentPhone: "—",
    address: "—",
    email: "—",
    notes: "—",
    image: "",
  };

  const sections = [
    {
      id: "identity",
      title: "اطلاعات هویتی و تماس",
      icon: "bi bi-person-vcard",
      status: "آماده",
    },
    {
      id: "education",
      title: "جزئیات آموزشی و ثبت‌نام دوره‌ها",
      icon: "bi bi-journal-bookmark",
      status: "به‌زودی",
    },
    {
      id: "attendance",
      title: "حضور و غیاب کلاس‌ها",
      icon: "bi bi-calendar-check",
      status: "به‌زودی",
    },
    {
      id: "payments",
      title: "شهریه، پرداختی‌ها و بدهی‌ها",
      icon: "bi bi-wallet2",
      status: "به‌زودی",
    },
    {
      id: "progress",
      title: "پیشرفت تحصیلی و ارزیابی‌ها",
      icon: "bi bi-graph-up-arrow",
      status: "به‌زودی",
    },
  ];

  return (
    <div className="students-page">
      <div className="students-page-header">
        <div>
          <Link to="/admin/students" className="students-back-link">
            <i className="bi bi-arrow-right"></i>
            بازگشت به فهرست هنرجویان
          </Link>

          <h1>پرونده هنرجو</h1>
          <p>شناسه هنرجو: {id}</p>
        </div>
      </div>

      <section className="students-profile-header">
        <div className="students-profile-avatar-large">
          {student.image ? (
            <img src={student.image} alt={student.name} />
          ) : (
            <span>{student.name?.charAt(0) || "ه"}</span>
          )}
        </div>

        <div>
          <h2>{student.name}</h2>
          <p>کد ملی: <span dir="ltr">{student.nationalId}</span></p>
          <p>شماره تماس: <span dir="ltr">{student.phone}</span></p>
        </div>
      </section>

      <section className="students-profile-section">
        <div className="students-profile-section-title">
          <i className="bi bi-person-lines-fill"></i>
          <h3>اطلاعات هویتی و تماس</h3>
        </div>

        <div className="students-details-grid">
          <div><span>نام پدر</span><strong>{student.fatherName}</strong></div>
          <div><span>تاریخ تولد</span><strong>{student.birthDate}</strong></div>
          <div><span>مدرک تحصیلی</span><strong>{student.educationLevel}</strong></div>
          <div><span>شماره تماس والدین</span><strong dir="ltr">{student.parentPhone}</strong></div>
          <div><span>ایمیل</span><strong dir="ltr">{student.email || "ثبت نشده"}</strong></div>
          <div className="students-profile-full-row"><span>آدرس</span><strong>{student.address}</strong></div>
          <div className="students-profile-full-row"><span>توضیحات</span><strong>{student.notes || "—"}</strong></div>
        </div>
      </section>

      <section className="students-profile-section">
        <div className="students-profile-section-title">
          <i className="bi bi-collection"></i>
          <h3>سایر بخش‌های پرونده</h3>
        </div>

        <div className="students-profile-sections-grid">
          {sections.slice(1).map((section) => (
            <div className="students-profile-placeholder-card" key={section.id}>
              <i className={section.icon}></i>
              <div>
                <h4>{section.title}</h4>
                <span>{section.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
