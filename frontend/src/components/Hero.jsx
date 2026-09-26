import { Link } from 'react-router-dom';




function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6 order-lg-1 order-2">
            <div className="hero-img">
              <lottie-player
                src="/image/Designer.json"
                background="transparent"
                speed="1"
                style={{
                  width: '100%',
                  height: '100%',
                }}
                loop
                autoplay
              ></lottie-player>
            </div>
          </div>

          <div className="col-lg-6 order-lg-2 order-1">
            <h1 className="text-center">
              از سیرجان به دنیای فناوری
            </h1>

            <h2 className="fw-bold fs-2 text-primary text-center">
              با آموزشگاه فناوران فردا
            </h2>

            <p className="mt-3 text-center">
              آموزش تخصصی و پروژه‌محور فرانت‌اند، بک‌اند، هوش مصنوعی و دیتاساینس
              به همراه سیستم هوشمند استعدادیابی و معرفی به بازار کار.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center">
              <Link to="/competition" className="btn btn-primary-custom">
                <i className="bi bi-brain me-1" aria-hidden="true"></i>
                مسابقات رایگان برنامه‌نویسی
              </Link>



              <Link to="/courses" className="btn btn-outline-custom">
                <i className="bi bi-play-circle me-1"></i>
                مشاهده دوره‌های فعال
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
