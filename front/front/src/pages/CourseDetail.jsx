import { useLayoutEffect, useRef, useState } from "react";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/stylecourse-detail.css';

export default function CourseDetail() {



   useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  
  const [activeTab, setActiveTab] = useState('desc');

  return (
    <>
      <Navbar />


      <div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="course-hero">
              <div className="row align-items-center g-4">
                <div className="col-lg-7">
                  <h1>آموزش Bootstrap</h1>
                  <p>
                    HTML یک زبان نشانه گذاری و اسکلت اصلی تمامی سایت هایی است که در سراسر دنیا وجود
                    می آیند است. HTML یک زبان بسیار ساده است و پیشنیاز ورود به دنیای طراحی وب می باشد.
                  </p>
                </div>

                <div className="col-lg-5">
                  <div className="hero-img-box">
                    <img id="courseHeroImg" src="/image/course-3.png" alt="" />
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 value-props">
              <div className="col-md-4">
                <div className="value-card">
                  <div className="icon-box icon-blue">
                    <i className="bi bi-patch-check-fill"></i>
                  </div>
                  <div>
                    <h6>گواهینامه ملی معتبر</h6>
                    <p>صدور آنی پس از شرکت در آزمون</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="value-card">
                  <div className="icon-box icon-coral">
                    <i className="bi bi-person-fill-gear"></i>
                  </div>
                  <div>
                    <h6>پروژه محور</h6>
                    <p>اتصال به بازار کار</p>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="value-card">
                  <div className="icon-box icon-mint">
                    <i className="bi bi-headset"></i>
                  </div>
                  <div>
                    <h6>پشتیبانی سریع</h6>
                    <p>پشتیبانی ۲۴ ساعته پس از ثبت نام</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-tabs-wrap">
              <ul className="nav course-nav-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'desc' ? 'active' : ''}`}
                    onClick={() => setActiveTab('desc')}
                  >
                    توضیحات
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'syllabus' ? 'active' : ''}`}
                    onClick={() => setActiveTab('syllabus')}
                  >
                    سرفصل ها
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'files' ? 'active' : ''}`}
                    onClick={() => setActiveTab('files')}
                  >
                    فایل های آموزشی
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`}
                    onClick={() => setActiveTab('faq')}
                  >
                    سوالات متداول
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comments')}
                  >
                    نظرات (۸)
                  </button>
                </li>
              </ul>

              <div className="tab-content tab-content-body">
                {activeTab === 'desc' && (
                  <div className="tab-pane fade show active" id="tab-desc">
                    <h5>آموزش HTML CSS</h5>
                    <p><strong>HTML چیست؟</strong></p>
                    <p>HTML زبانی برای توصیف ساختار صفحات وب است. HTML به نویسندگان این معنی را می دهد:</p>
                    <ul style={{ color: '#555', fontSize: '.93rem', lineHeight: 2 }}>
                      <li>انتشار اسناد آنلاین با عناوین، متن، جداول، لیست ها، عکس ها و غیره.</li>
                      <li>با کلیک بر روی یک دکمه، اطلاعات آنلاین را از طریق لینک های hypertext بازیابی کنید.</li>
                      <li>فرم های طراحی برای انجام معاملات با خدمات از راه دور، جستجوی اطلاعات، ایجاد رزرو، سفارش محصولات و غیره.</li>
                      <li>صفحات گسترده، کلیپ های ویدیویی، کلیپ های صوتی و سایر برنامه ها را مستقیماً در اسناد خود وارد کنید.</li>
                      <li>با HTML، نویسندگان ساختار صفحات را با استفاده از نشانه‌گذاری می‌کنند. عناصری که یک زبان را توصیف می‌کنند مانند «پاراگراف»، «لیست»، «جدول» و غیره.</li>
                    </ul>
                    <p><strong>XHTML چیست؟</strong></p>
                  </div>
                )}

                {activeTab === 'syllabus' && (
                  <div className="tab-pane fade show active" id="tab-syllabus">
                    <div className="accordion" id="syllabusAcc">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button type="button" className="accordion-button">
                            <i className="bi bi-lock-fill me-2"></i> فصل ۱: مقدمه HTML
                          </button>
                        </h2>
                        <div className="accordion-collapse">
                          <div className="accordion-body">
                            آشنایی با تگ‌های پایه HTML و ساختار سند.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button type="button" className="accordion-button">
                            <i className="bi bi-lock-fill me-2"></i> فصل ۲: مقدمه CSS
                          </button>
                        </h2>
                        <div className="accordion-collapse">
                          <div className="accordion-body">
                            آموزش استایل‌دهی و انتخاب‌گرهای CSS.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="tab-pane fade show active" id="tab-files">
                    <ul className="list-unstyled">
                      <li className="d-flex justify-content-between border-bottom py-3">
                        <span>
                          <i className="bi bi-file-earmark-lock-fill me-2"></i>
                          جزوه فصل ۱ - HTML
                        </span>
                        <i className="bi bi-download"></i>
                      </li>
                      <li className="d-flex justify-content-between border-bottom py-3">
                        <span>
                          <i className="bi bi-file-earmark-lock-fill me-2"></i>
                          جزوه فصل ۲ - CSS
                        </span>
                        <i className="bi bi-download"></i>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="tab-pane fade show active" id="tab-faq">
                    <div className="accordion" id="faqAcc">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button type="button" className="accordion-button">
                            آیا این دوره برای مبتدی‌ها مناسب است؟
                          </button>
                        </h2>
                        <div className="accordion-collapse">
                          <div className="accordion-body">
                            بله، این دوره از پایه‌ای‌ترین مفاهیم شروع می‌شود.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="tab-pane fade show active" id="tab-comments">
                    <div className="mb-4">
                      <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="نظر خود را بنویسید..."
                      ></textarea>
                      <button type="button" className="btn btn-primary">
                        ارسال نظر
                      </button>
                    </div>

                    <div className="d-flex gap-3 border-bottom py-3">
                      <img
                        src="https://via.placeholder.com/45"
                        className="rounded-circle"
                        alt=""
                      />
                      <div>
                        <h6 className="mb-1 fw-bold" style={{ fontSize: '.9rem' }}>
                          کاربر نمونه
                        </h6>
                        <small className="text-muted">۱۴۰۴/۰۴/۱۰</small>
                        <p className="mt-2 mb-0" style={{ fontSize: '.88rem' }}>
                          دوره بسیار خوب و کاربردی بود.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="sidebar-card">
              <div className="instructor-header">
                <img src="image/logo.png" alt="لوگو" />
                <div>
                  <h6>آموزشگاه فناوران فردا - سیرجان</h6>
                  <small className="text-muted">طراحی سایت و هوش مصنوعی</small>
                </div>
              </div>

              <p
                className="mt-3 mb-2"
                style={{
                  fontSize: '.85rem',
                  color: '#555',
                  lineHeight: 2,
                  textAlign: 'justify',
                }}
              >
                آموزشگاه طراحی سایت و هوش مصنوعی فناوران فردا با بهره‌گیری از اساتید مجرب و به‌روز،
                محیطی حرفه‌ای برای یادگیری مهارت‌های کاربردی در حوزه طراحی سایت، برنامه‌نویسی و هوش
                مصنوعی فراهم کرده است. هنرجویان از آموزش‌های پروژه‌محور و کاملا
                کاربردی بهره‌مند می‌شوند و پس از پایان دوره نیز مدرک معتبر دریافت می‌کنند تا با
                آمادگی بیشتر وارد بازار کار شوند.
              </p>

              <div className="text-end">
                <a href="#" className="text-decoration-none">
                  FanavaranFarda_sirjan1
                  <i className="bi bi-instagram m-1"></i>
                </a>
              </div>
            </div>

            <div className="sidebar-card">
              <h6 className="fw-bold mb-3">اطلاعات دوره</h6>
              <ul className="course-info-list">
                <li>
                  <span className="lbl">
                    <i className="bi bi-calendar-event"></i>تعداد ترم دوره
                  </span>
                  <span className="val">4 ترم</span>
                </li>
                <li>
                  <span className="lbl">
                    <i className="bi bi-clock-fill"></i>مدت زمان دوره
                  </span>
                  <span className="val">50 ساعت</span>
                </li>
                <li>
                  <span className="lbl">
                    <i className="bi bi-patch-check-fill"></i>نوع گواهینامه
                  </span>
                  <span className="val">فنی و حرفه ای</span>
                </li>
                <li>
                  <span className="lbl">
                    <i className="bi bi-currency-dollar"></i>هزینه هر ترم
                  </span>
                  <span className="val">4,000,000 تومان</span>
                </li>
                <li>
                  <span className="lbl">
                    <i className="bi bi-book-half"></i>محتوای آموزشی
                  </span>
                  <span className="val">دارد</span>
                </li>
              </ul>

              <button type="button" className="btn-sidebar-primary">
                <i className="bi bi-person-plus-fill"></i>
                ثبت نام در دوره
              </button>
            </div>

            <div className="sidebar-card">
              <h6 className="fw-bold mb-3">قوانین و مقررات فناورن فردا</h6>
              <ul className="policy-list">
                <li><i className="bi bi-check-circle-fill"></i>1- ثبت نام پس از پرداخت هزینه قطعی باشد</li>
                <li><i className="bi bi-check-circle-fill"></i>2- پس از ثبت نام قطعی هزینه عودت نخواهد شد</li>
                <li><i className="bi bi-check-circle-fill"></i>3- تعهد آموزشی و حضور منظم داشته باشید</li>
                <li><i className="bi bi-check-circle-fill"></i>4- صدور مدرک فنی‌وحرفه‌ای هزینه مجزا دارد</li>
              </ul>
            </div>

            <div className="sidebar-card guarantee-badge">
              <i className="bi bi-distribute-vertical"></i>
              <h6>پیش نیاز های این دوره</h6>
              <p>فقط آشنایی و کار کردن با کامپیوتر</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
