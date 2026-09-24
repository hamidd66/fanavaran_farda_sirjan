import { useEffect, useMemo, useState } from "react";

const testimonials = [
    {
      id: 1,
      name: "علی رضایی",
      role: "هنرجوی فرانت‌اند",
      image: "/image/student1.jpg",
      text: "کلاس‌ها خیلی کاربردی بود و با پروژه واقعی جلو رفتیم.",
      rating: 5,
    },
    {
      id: 2,
      name: "مریم احمدی",
      role: "هنرجوی پایتون",
      image: "/image/student1.jpg",
      text: "پشتیبانی استادها عالی بود و مسیر یادگیری خیلی منظم بود.",
      rating: 5,
    },
    {
      id: 3,
      name: "سینا محمدی",
      role: "هنرجوی هوش مصنوعی",
      image: "/image/student1.jpg",
      text: "فضای آموزشگاه و روند آموزش دقیقاً چیزی بود که لازم داشتم.",
      rating: 4,
    },
    {
      id: 4,
      name: "زهرا کریمی",
      role: "هنرجوی طراحی سایت",
      image: "/image/student1.jpg",
      text: "از پایه شروع کردم و حالا می‌توانم صفحات وب حرفه‌ای طراحی کنم.",
      rating: 5,
    },
    {
      id: 5,
      name: "امیرحسین احمدی",
      role: "هنرجوی الگوریتم",
      image: "/image/student1.jpg",
      text: "تمرین‌ها هدفمند بودند و باعث شد در حل مسئله خیلی بهتر شوم.",
      rating: 5,
    },
    {
      id: 6,
      name: "نگین حسینی",
      role: "هنرجوی بک‌اند",
      image: "/image/student1.jpg",
      text: "آموزش Django و ساخت API برای من بسیار مفید و پروژه‌محور بود.",
      rating: 5,
    },
    {
      id: 7,
      name: "محمد صادقی",
      role: "هنرجوی React",
      image: "/image/student1.jpg",
      text: "ساختار دوره React کاملاً مرحله‌به‌مرحله و قابل فهم بود.",
      rating: 5,
    },
    {
      id: 8,
      name: "فاطمه موسوی",
      role: "هنرجوی پایتون",
      image: "/image/student1.jpg",
      text: "تمرین‌های دوره کمک کرد اعتمادبه‌نفسم در برنامه‌نویسی بیشتر شود.",
      rating: 4,
    },
    {
      id: 9,
      name: "رضا اکبری",
      role: "هنرجوی C#",
      image: "/image/student1.jpg",
      text: "مباحث برنامه‌نویسی شی‌گرا با مثال‌های واقعی و خوبی آموزش داده شد.",
      rating: 5,
    },
    {
      id: 10,
      name: "سارا مرادی",
      role: "هنرجوی داده‌کاوی",
      image: "/image/student1.jpg",
      text: "دوره هوش مصنوعی مسیر مناسبی برای ورود من به دنیای داده بود.",
      rating: 5,
    },
    {
      id: 11,
      name: "حسین نادری",
      role: "هنرجوی طراحی سایت",
      image: "/image/student1.jpg",
      text: "فضای دوستانه کلاس و پاسخ‌گویی مدرس‌ها واقعاً عالی بود.",
      rating: 5,
    },
    {
      id: 12,
      name: "یاسمن جعفری",
      role: "هنرجوی فرانت‌اند",
      image: "/image/student1.jpg",
      text: "بعد از دوره توانستم اولین پروژه شخصی خودم را طراحی و اجرا کنم.",
      rating: 5,
    },
  ];


function Testimonials() {
  const [itemsPerSlide, setItemsPerSlide] = useState(6);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // تعیین تعداد کارت‌ها در اندازه‌های مختلف صفحه
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth <= 576) {
        setItemsPerSlide(1);
      } else if (window.innerWidth <= 992) {
        setItemsPerSlide(4);
      } else {
        setItemsPerSlide(6);
      }
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  /*
    برای حلقه‌ای شدن اسلایدر:
    - به اول آرایه، آخرین آیتم‌ها را clone می‌کنیم.
    - به آخر آرایه، اولین آیتم‌ها را clone می‌کنیم.
  */
  const sliderTestimonials = useMemo(() => {
    if (testimonials.length <= itemsPerSlide) {
      return testimonials;
    }

    const startClones = testimonials.slice(-itemsPerSlide);
    const endClones = testimonials.slice(0, itemsPerSlide);

    return [...startClones, ...testimonials, ...endClones];
  }, [itemsPerSlide]);

  const canSlide = testimonials.length > itemsPerSlide;

  // اولین ایندکس واقعی پس از cloneهای ابتدایی
  const firstRealIndex = canSlide ? itemsPerSlide : 0;

  /*
    اولین clone بعد از آخرین نظر واقعی.
    وقتی به این نقطه برسیم، بدون transition به ابتدای داده‌های واقعی برمی‌گردیم.
  */
  const endCloneIndex = canSlide
    ? testimonials.length + itemsPerSlide
    : 0;

  // با تغییر اندازه صفحه، اسلایدر به حالت اولیه برگردد.
  useEffect(() => {
    setIsAnimating(false);
    setCurrentIndex(firstRealIndex);

    const animationFrame = requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [firstRealIndex, itemsPerSlide]);

  // حرکت خودکار هر 6 ثانیه
  useEffect(() => {
    if (!canSlide) return;

    const autoSlide = setInterval(() => {
      setIsAnimating(true);
      setCurrentIndex((previousIndex) => previousIndex + 1);
    }, 6000);

    return () => clearInterval(autoSlide);
  }, [canSlide, itemsPerSlide]);

  const goToNextSlide = () => {
    if (!canSlide) return;

    setIsAnimating(true);
    setCurrentIndex((previousIndex) => previousIndex + 1);
  };

  const goToPreviousSlide = () => {
    if (!canSlide) return;

    setIsAnimating(true);
    setCurrentIndex((previousIndex) => previousIndex - 1);
  };

  /*
    بعد از تمام‌شدن transition:
    - اگر به cloneهای انتهایی رسیدیم، بدون انیمیشن به ابتدای اصلی برگرد.
    - اگر به cloneهای ابتدایی رسیدیم، بدون انیمیشن به انتهای اصلی برگرد.
  */
  const handleTransitionEnd = () => {
    if (!canSlide) return;

    if (currentIndex >= endCloneIndex) {
      setIsAnimating(false);
      setCurrentIndex(firstRealIndex);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }

    if (currentIndex <= 0) {
      setIsAnimating(false);
      setCurrentIndex(testimonials.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    }
  };

  return (
    <section className="testimonials py-5" dir="rtl">
      <div className="container">
        <div className="text-center mb-5">
          <span className="testimonials-label">
            تجربه هنرجویان فناوران فردا
          </span>

          <h2 className="section-title">نظرات هنرجویان</h2>

          <p className="section-sub">
            تجربه کسانی که مسیر یادگیری خود را با ما شروع کردند
          </p>
        </div>

        <div className="testimonials-slider">
          {canSlide && (
            <button
              type="button"
              className="testimonial-arrow testimonial-arrow-right"
              onClick={goToNextSlide}
              aria-label="نمایش نظر بعدی"
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          )}

          <div className="testimonials-viewport">
            <div
              className="testimonials-track"
              onTransitionEnd={handleTransitionEnd}
              style={{
                "--items-per-slide": itemsPerSlide,
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerSlide)
                }%)`,
                transition: isAnimating
                  ? "transform 1.2s ease-in-out"
                  : "none",
              }}
            >
              {sliderTestimonials.map((testimonial, index) => (
                <div
                  className="testimonial-slide-card"
                  key={`${testimonial.id}-${index}`}
                >
                  <article className="testimonial-card h-100">
                    <div className="testimonial-header">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="testimonial-img"
                      />

                      <div className="testimonial-user-info">
                        <h3 className="testimonial-name">
                          {testimonial.name}
                        </h3>

                        <span className="testimonial-role">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>

                    <div
                      className="testimonial-stars"
                      aria-label={`امتیاز ${testimonial.rating} از 5`}
                    >
                      {"★".repeat(testimonial.rating)}
                      {"☆".repeat(5 - testimonial.rating)}
                    </div>

                    <p className="testimonial-text">
                      “{testimonial.text}”
                    </p>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {canSlide && (
            <button
              type="button"
              className="testimonial-arrow testimonial-arrow-left"
              onClick={goToPreviousSlide}
              aria-label="نمایش نظر قبلی"
            >
              <i className="bi bi-chevron-left"></i>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
