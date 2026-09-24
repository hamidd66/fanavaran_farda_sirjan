import { useLayoutEffect, useRef, useState } from "react";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/styleaboutus.css';

export default function AboutUs() {



useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    // مخفی‌کردن پیام قبلی در ارسال مجدد فرم
    setSubmitted(false);

    // اعتبارسنجی داخلی HTML
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // در این قسمت می‌توانید بعداً اطلاعات فرم را به API ارسال کنید.
    // مثال: fetch('/api/contact', { method: 'POST', body: new FormData(form) })

    setSubmitted(true);
    form.reset();
    form.classList.remove('was-validated');
  };

  return (
    <>
      <Navbar />

      {/* معرفی صفحه */}
      <section className="page-hero">
        <div className="container">
          <h1>درباره ما</h1>
          <p>
            آموزشگاه فناوران فردا؛ مسیر شغلی شما در دنیای فناوری از اینجا
            شروع می‌شود.
          </p>
        </div>
      </section>

      {/* درباره آموزشگاه */}
      <section className="about-hero py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            {/* آمار */}
            <div className="col-lg-5">
              <div className="row g-3">
                <div className="col-6">
                  <div className="about-stat-card">
                    <div className="about-stat-icon">
                      <i className="bi bi-mortarboard-fill" aria-hidden="true" />
                    </div>
                    <h3>۳۰+</h3>
                    <p>دوره تخصصی</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="about-stat-card">
                    <div className="about-stat-icon">
                      <i className="bi bi-people-fill" aria-hidden="true" />
                    </div>
                    <h3>۵۰۰+</h3>
                    <p>دانش‌آموز فارغ‌التحصیل</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="about-stat-card">
                    <div className="about-stat-icon">
                      <i
                        className="bi bi-calendar2-check-fill"
                        aria-hidden="true"
                      />
                    </div>
                    <h3>۵+</h3>
                    <p>سال تجربه آموزشی</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="about-stat-card">
                    <div className="about-stat-icon">
                      <i className="bi bi-person-badge-fill" aria-hidden="true" />
                    </div>
                    <h3>۱۰+</h3>
                    <p>مدرس متخصص</p>
                  </div>
                </div>
              </div>
            </div>

            {/* متن معرفی */}
            <div className="col-lg-7">
              <p className="about-lead">
                آموزشگاه فناوران فردا در سیرجان با هدف پرورش برنامه‌نویسان و
                متخصصان فناوری اطلاعات فعالیت می‌کند. آموزش در این مجموعه به‌صورت
                پروژه‌محور و توسط مدرسین مجرب، با برنامه درسی به‌روز از HTML تا
                الگوریتم‌های یادگیری ماشین ارائه می‌شود. برگزاری مسابقات
                برنامه‌نویسی و کارگاه‌های تخصصی، فضایی رقابتی و انگیزشی برای
                دانش‌آموزان فراهم کرده است.
              </p>

              <div className="about-badges">
                <span
                  className="badge-track"
                  style={{ '--c': '#4f46e5' }}
                >
                  فرانت‌اند
                </span>

                <span
                  className="badge-track"
                  style={{ '--c': '#06b6d4' }}
                >
                  بک‌اند
                </span>

                <span
                  className="badge-track"
                  style={{ '--c': '#f59e0b' }}
                >
                  هوش مصنوعی
                </span>

                <span
                  className="badge-track"
                  style={{ '--c': '#ef4444' }}
                >
                  الگوریتم و مسابقات
                </span>

                <span
                  className="badge-track"
                  style={{ '--c': '#10b981' }}
                >
                  علم داده
                </span>
              </div>
            </div>
          </div>

          {/* ویدئو */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <video
                controls
                style={{
                  width: '100%',
                  borderRadius: '16px',
                  boxShadow: '0 12px 40px -8px rgba(79,70,229,.3)',
                  display: 'block',
                }}
              >
                <source src="/image/A3-1.mp4" type="video/mp4" />
                مرورگر شما از ویدئو پشتیبانی نمی‌کند.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* تماس با ما */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-title text-primary">تماس با ما</div>
            <div className="section-sub">
              برای ثبت‌نام، مشاوره رایگان یا هر سؤالی با ما در ارتباط باشید.
            </div>
          </div>

          <div className="row g-4">
            {/* اطلاعات تماس */}
            <div className="col-lg-5">
              <div className="contact-info-card">
                <h6
                  style={{
                    fontWeight: 800,
                    color: '#1a1a2e',
                    marginBottom: '20px',
                  }}
                >
                  اطلاعات تماس
                </h6>

                <div className="contact-item">
                  <div className="icon">
                    <i className="bi bi-telephone-fill" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <strong>شماره تماس</strong>
                    <a href="tel:09050958715">۰۹۰۵۰۹۵۸۷۱۵</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="icon">
                    <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <strong>آدرس</strong>
                    <span>
                      سیرجان، بلوار سیدجمال، بعد از کلانتری ۱۳، جنب صدف مارکت
                    </span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="icon">
                    <i className="bi bi-clock-fill" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <strong>ساعات پاسخگویی</strong>
                    <span>شنبه تا پنجشنبه، ۸ صبح تا ۹ شب</span>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="icon">
                    <i className="bi bi-envelope-fill" aria-hidden="true" />
                  </div>
                  <div className="info">
                    <strong>ایمیل</strong>
                    <a href="mailto:info@fanavaranfarda.ir">
                      info@fanavaranfarda.ir
                    </a>
                  </div>
                </div>

                <div className="mt-4">
                  <div
                    style={{
                      fontSize: '.82rem',
                      color: '#999',
                      marginBottom: '8px',
                    }}
                  >
                    شبکه‌های اجتماعی
                  </div>

                  <div className="social-links">
                    <a
                      href="https://instagram.com/Fanavaranfarda_sirjan1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-instagram" aria-hidden="true" />
                      اینستاگرام
                    </a>

                    <a
                      href="https://t.me/Fanavaranfarda_sirjan1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-telegram" aria-hidden="true" />
                      تلگرام
                    </a>

                    {/* لینک واقعی روبیکا، ایتا و بله را جایگزین کنید */}
                    <a
                      href="https://rubika.ir/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                      روبیکا
                    </a>

                    <a
                      href="https://eitaa.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                      ایتا
                    </a>

                    <a
                      href="https://ble.ir/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                      بله
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* فرم تماس */}
            <div className="col-lg-7">
              <div className="contact-form-card">
                <h6
                  style={{
                    fontWeight: 800,
                    color: '#1a1a2e',
                    marginBottom: '20px',
                  }}
                >
                  ارسال پیام
                </h6>

                {submitted && (
                  <div
                    className="alert alert-success success-msg"
                    role="alert"
                  >
                    <i
                      className="bi bi-check-circle-fill me-1"
                      aria-hidden="true"
                    />
                    پیام شما با موفقیت ارسال شد. در اسرع وقت پاسخ خواهیم داد.
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="form-control"
                        name="name"
                        required
                      />
                      <div className="invalid-feedback">
                        لطفاً نام و نام خانوادگی را وارد کنید.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        شماره موبایل *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="form-control"
                        name="phone"
                        pattern="09[0-9]{9}"
                        placeholder="09xxxxxxxxx"
                        required
                      />
                      <div className="invalid-feedback">
                        شماره موبایل باید مانند 09123456789 باشد.
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="subject" className="form-label">
                        موضوع پیام *
                      </label>
                      <select
                        id="subject"
                        className="form-select"
                        name="subject"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          انتخاب کنید
                        </option>
                        <option value="registration">ثبت‌نام در دوره</option>
                        <option value="consultation">مشاوره رایگان</option>
                        <option value="instructor">
                          همکاری به عنوان مدرس
                        </option>
                        <option value="competition">
                          مسابقات برنامه‌نویسی
                        </option>
                        <option value="other">سایر موارد</option>
                      </select>
                      <div className="invalid-feedback">
                        لطفاً موضوع پیام را انتخاب کنید.
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="message" className="form-label">
                        متن پیام *
                      </label>
                      <textarea
                        id="message"
                        className="form-control"
                        name="message"
                        rows={5}
                        required
                        placeholder="پیام خود را بنویسید..."
                      />
                      <div className="invalid-feedback">
                        لطفاً متن پیام را وارد کنید.
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary-custom w-100">
                        <i className="bi bi-send-fill me-1" aria-hidden="true" />
                        ارسال پیام
                      </button>
                    </div>
                  </div>
                </form>

                {/* راه‌های ارتباط سریع */}
                <div className="row g-2 mt-4">
                  <div className="col-4">
                    <a
                      href="https://wa.me/989050958715"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <div
                        className="text-center p-3"
                        style={{
                          background: '#f0f4ff',
                          borderRadius: '12px',
                        }}
                      >
                        <i
                          className="bi bi-whatsapp"
                          style={{ color: '#25d366', fontSize: '1.4rem' }}
                          aria-hidden="true"
                        />
                        <div
                          style={{
                            fontSize: '.75rem',
                            color: '#555',
                            marginTop: '4px',
                            fontWeight: 600,
                          }}
                        >
                          واتساپ
                        </div>
                        <div style={{ fontSize: '.78rem', color: '#333' }}>
                          ۰۹۰۵۰۹۵۸۷۱۵
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-4">
                    <a href="tel:09050958715" className="text-decoration-none">
                      <div
                        className="text-center p-3"
                        style={{
                          background: '#f0f4ff',
                          borderRadius: '12px',
                        }}
                      >
                        <i
                          className="bi bi-telephone"
                          style={{ color: '#4f46e5', fontSize: '1.4rem' }}
                          aria-hidden="true"
                        />
                        <div
                          style={{
                            fontSize: '.75rem',
                            color: '#555',
                            marginTop: '4px',
                            fontWeight: 600,
                          }}
                        >
                          تماس مستقیم
                        </div>
                        <div style={{ fontSize: '.78rem', color: '#333' }}>
                          ۰۹۰۵۰۹۵۸۷۱۵
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-4">
                    <a
                      href="https://instagram.com/Fanavaranfarda_sirjan1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <div
                        className="text-center p-3"
                        style={{
                          background: '#f0f4ff',
                          borderRadius: '12px',
                        }}
                      >
                        <i
                          className="bi bi-instagram"
                          style={{ color: '#e1306c', fontSize: '1.4rem' }}
                          aria-hidden="true"
                        />
                        <div
                          style={{
                            fontSize: '.75rem',
                            color: '#555',
                            marginTop: '4px',
                            fontWeight: 600,
                          }}
                        >
                          اینستاگرام
                        </div>
                        <div style={{ fontSize: '.78rem', color: '#333' }}>
                          Fanavaranfarda_sirjan1
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* نقشه */}
          <div className="map-wrap mt-4">
            <iframe
              title="موقعیت آموزشگاه فناوران فردا"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.0!2d55.68!3d29.46!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDI3JzM2LjAiTiA1NcKwNDAnNDguMCJF!5e0!3m2!1sfa!2sir!4v1690000000000"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
