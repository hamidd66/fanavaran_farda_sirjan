import { useLayoutEffect, useRef, useState } from "react";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/stylecompetition.css';

export default function Competition() {




  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);





  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    setSubmitted(false);

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // اینجا بعداً می‌توانی API واقعی را وصل کنی
    // مثلا fetch('/api/competition-register', { method: 'POST', body: new FormData(form) })

    setSubmitted(true);
    form.reset();
    form.classList.remove('was-validated');
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="competition-hero mx-5 mt-3">
        <div className="container text-center">
          <span className="competition-badge">رویداد سالانه</span>

          <h1>مسابقه بزرگ برنامه‌نویسی فناوران فردا</h1>

          <p>
            فرصتی برای رقابت، یادگیری و دیده‌شدن در کنار بهترین‌های برنامه‌نویسی.
            در این مسابقه می‌توانید مهارت خود را در حل مسئله، الگوریتم و توسعه
            نرم‌افزار محک بزنید.
          </p>

          <a href="#register" className="btn btn-competition">
            ثبت‌نام در مسابقه
          </a>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-3 mb-5">
            <div className="col-md-6 col-lg-3">
              <div className="competition-card">
                <i className="bi bi-calendar-event" aria-hidden="true"></i>
                <h5>تاریخ برگزاری</h5>
                <p>پنجشنبه، ۲۵ مهر ۱۴۰۴</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="competition-card">
                <i className="bi bi-geo-alt" aria-hidden="true"></i>
                <h5>محل برگزاری</h5>
                <p>آموزشگاه فناوران فردا، سیرجان</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="competition-card">
                <i className="bi bi-people" aria-hidden="true"></i>
                <h5>سطح مسابقه</h5>
                <p>مبتدی تا پیشرفته</p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="competition-card">
                <i className="bi bi-trophy" aria-hidden="true"></i>
                <h5>جوایز</h5>
                <p>جوایز نقدی + معرفی به شرکت‌ها</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="row justify-content-center" id="register">
            <div className="col-lg-8">
              <div className="form-wrap">
                <h2>فرم ثبت‌نام مسابقه</h2>
                <p className="mb-4">
                  فرم زیر را تکمیل کنید تا در مسابقه ثبت‌نام شوید.
                </p>

                {submitted && (
                  <div className="alert alert-success" role="alert">
                    ثبت‌نام شما با موفقیت انجام شد. به‌زودی با شما تماس خواهیم گرفت.
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="fullName" className="form-label">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className="form-control"
                        name="fullName"
                        required
                      />
                      <div className="invalid-feedback">
                        لطفاً نام و نام خانوادگی را وارد کنید.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">
                        شماره تماس *
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
                        شماره موبایل باید معتبر باشد.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="nationalId" className="form-label">
                        شماره ملی *
                      </label>
                      <input
                        id="nationalId"
                        type="text"
                        className="form-control"
                        name="nationalId"
                        pattern="[0-9]{10}"
                        placeholder="۱۰ رقم"
                        required
                      />
                      <div className="invalid-feedback">
                        شماره ملی باید ۱۰ رقم باشد.
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="competition" className="form-label">
                        مسابقه مورد نظر *
                      </label>
                      <select
                        id="competition"
                        className="form-select"
                        name="competition"
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          انتخاب کنید
                        </option>
                        <option value="algorithm">مسابقه الگوریتم</option>
                        <option value="frontend">مسابقه فرانت‌اند</option>
                        <option value="backend">مسابقه بک‌اند</option>
                        <option value="ai">مسابقه هوش مصنوعی</option>
                        <option value="datascience">مسابقه علم داده</option>
                      </select>
                      <div className="invalid-feedback">
                        لطفاً مسابقه مورد نظر را انتخاب کنید.
                      </div>
                    </div>

                    <div className="col-6  mx-auto">
                      <button type="submit" className="btn btn-competition  w-100">
                        ارسال ثبت‌نام
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
