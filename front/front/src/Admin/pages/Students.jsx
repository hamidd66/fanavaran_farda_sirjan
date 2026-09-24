function Students() {
  return (
    <section className="admin-inner-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-breadcrumb">
            <span>پنل مدیریت</span>
            <i className="bi bi-chevron-left"></i>
            <strong>هنرجویان</strong>
          </div>

          <h1>مدیریت هنرجویان</h1>
          <p>مشاهده، جستجو، ثبت و ویرایش اطلاعات هنرجویان آموزشگاه.</p>
        </div>

        <button type="button" className="admin-primary-button">
          <i className="bi bi-person-plus-fill"></i>
          افزودن هنرجو
        </button>
      </div>

      <div className="admin-widget admin-empty-page">
        <i className="bi bi-people-fill"></i>
        <h2>لیست هنرجویان</h2>
        <p>جدول هنرجویان، جستجو و فیلترها در این قسمت قرار می‌گیرند.</p>
      </div>
    </section>
  );
}

export default Students;
