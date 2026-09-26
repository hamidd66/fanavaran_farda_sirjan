function Courses() {
  return (
    <section className="admin-inner-page">
      <div className="admin-page-heading">
        <div>
          <div className="admin-breadcrumb">
            <span>پنل مدیریت</span>
            <i className="bi bi-chevron-left"></i>
            <strong>دوره‌ها</strong>
          </div>

          <h1>مدیریت دوره‌ها</h1>
          <p>ایجاد، ویرایش و مدیریت دوره‌های آموزشی.</p>
        </div>

        <button type="button" className="admin-primary-button">
          <i className="bi bi-plus-lg"></i>
          افزودن دوره
        </button>
      </div>

      <div className="admin-widget admin-empty-page">
        <i className="bi bi-journal-code"></i>
        <h2>لیست دوره‌ها</h2>
        <p>محتوای این صفحه در مرحله بعدی تکمیل می‌شود.</p>
      </div>
    </section>
  );
}

export default Courses;
