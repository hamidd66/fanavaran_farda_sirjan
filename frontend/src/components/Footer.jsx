function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <div className="footer-brand mb-2">
              <img
                src="/image/logo1.png"
                alt="لوگو"
                className="brand-logo1 me-1"
                style={{ height: '48px' }}
              />
              فناوران <span>فردا</span>
            </div>
            <p>
              آموزشگاه تخصصی برنامه‌نویسی و هوش مصنوعی در سیرجان. مسیر شغلی شما
              از اینجا شروع می‌شود.
            </p>
            <a href="https://t.me/fanavaranfarda1" className="social-btn" target="_blank" rel="noreferrer">
              fanavaranfarda_sirjan1 @ <i className="bi bi-instagram text-primary fs-6"></i>
            </a>
          </div>

          <div className="col-md-3">
            <h6>دسترسی سریع</h6>
            <div><a href="#">دوره ها</a></div>
            <div><a href="#">مسابقات</a></div>
            <div><a href="#">استعداد یابی</a></div>
            <div><a href="#">مقالات</a></div>
            <div><a href="#">درباره ما</a></div>
          </div>

          <div className="col-md-3">
            <h6>تماس با ما</h6>
            <p><i className="bi bi-telephone-fill me-2" style={{ color: '#818cf8' }}></i>۰۹۰۵۰۹۵۸۷۱۵</p>
            <p>
              <i className="bi bi-geo-alt-fill me-2" style={{ color: '#818cf8' }}></i>
              سیرجان، بلوار سیدجمال، بعد از کلانتری ۱۳، جنب صدف مارکت
            </p>
          </div>

          <div className="col-md-3">
            <h6>نمادهای اعتماد</h6>
            <div className="d-flex gap-2 flex-wrap">
              <div className="enamad-box">
                <i className="bi bi-patch-check-fill d-block fs-4 mb-1" style={{ color: '#4f46e5' }}></i>
                اینماد
              </div>
              <div className="enamad-box">
                <i className="bi bi-shield-check d-block fs-4 mb-1" style={{ color: '#16a34a' }}></i>
                ساماندهی
              </div>
            </div>
          </div>
        </div>

        <div className="copyright">
          تمامی حقوق مادی و معنوی این سایت متعلق به آموزشگاه کامپیوتر فناوران فردا (مهندس حمید پورفریدونی) می‌باشد.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
