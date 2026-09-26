import React, { useState } from 'react';
import {
  FaPollH,
  FaChalkboardTeacher,
  FaUniversity,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
  FaCommentDots,
  FaPaperPlane,
  FaInfoCircle,
  FaAward,
  FaClock,
  FaHeadset,
  FaLaptopCode,
  FaUsers
} from 'react-icons/fa';
import '../styles/StudentSurvey.css';

const StudentSurvey = () => {
  // ==========================================
  // ۱. داده‌ها و استیت بخش نظرسنجی دوره‌ای آموزشگاه
  // ==========================================
  const [generalSurveyAnswers, setGeneralSurveyAnswers] = useState({
    satisfactionScore: 0,
    preferredTopic: '',
    suggestions: ''
  });
  const [generalSurveySubmitted, setGeneralSurveySubmitted] = useState(false);

  // ==========================================
  // ۲. داده‌های دوره‌های هنرجو با وضعیت ثبت نظر
  // ==========================================
  const [courses, setCourses] = useState([
    {
      id: 'c-101',
      title: 'دوره جامع React & Next.js و معماری مدرن وب',
      code: 'CS-RCT-402',
      instructor: 'مهندس حمید پورفریدونی',
      teacherSurveyDone: false,
      instituteSurveyDone: false,
      teacherRatings: null,
      instituteRatings: null
    },
    {
      id: 'c-102',
      title: 'متخصص هوش مصنوعی، یادگیری عمیق و ماشین لرنینگ با پایتون',
      code: 'AI-PYT-204',
      instructor: 'مهندس حمید پورفریدونی',
      teacherSurveyDone: true,
      instituteSurveyDone: false,
      teacherRatings: { q1: 5, q2: 5, q3: 5, q4: 5, comment: 'عالی و کاملاً پروژه‌محور' },
      instituteRatings: null
    },
    {
      id: 'c-103',
      title: 'توسعه بک‌اند پیشرفته با C# و ASP.NET Core Web API',
      code: 'CS-NET-101',
      instructor: 'دپارتمان مهندسی نرم‌افزار',
      teacherSurveyDone: true,
      instituteSurveyDone: true,
      teacherRatings: { q1: 5, q2: 4, q3: 5, q4: 5, comment: 'بسیار کاربردی' },
      instituteRatings: { q1: 5, q2: 5, q3: 5, q4: 4, comment: 'امکانات عالی بود' }
    }
  ]);

  // استیت‌های مدیریت مودال‌ها
  const [activeModal, setActiveModal] = useState(null); // 'teacher' | 'institute' | null
  const [selectedCourse, setSelectedCourse] = useState(null);

  // فرم نظرسنجی استاد
  const [teacherForm, setTeacherForm] = useState({
    mastery: 0,     // ۱. تسلط و فن بیان
    support: 0,     // ۲. پشتیبانی و پاسخگویی
    practical: 0,   // ۳. پروژه‌محور و کاربردی بودن
    punctuality: 0, // ۴. منظم بودن استاد و زمان‌بندی
    comment: ''
  });

  // فرم نظرسنجی آموزشگاه
  const [instituteForm, setInstituteForm] = useState({
    facilities: 0,  // ۱. مناسب بودن امکانات
    staff: 0,       // ۲. برخورد پرسنل آموزشگاه
    quality: 0,     // ۳. کیفیت دوره‌ها
    timing: 0,      // ۴. مناسب بودن ساعت کلاس
    comment: ''
  });

  // باز کردن مودال استاد
  const handleOpenTeacherModal = (course) => {
    setSelectedCourse(course);
    setTeacherForm({
      mastery: 0,
      support: 0,
      practical: 0,
      punctuality: 0,
      comment: ''
    });
    setActiveModal('teacher');
  };

  // باز کردن مودال آموزشگاه
  const handleOpenInstituteModal = (course) => {
    setSelectedCourse(course);
    setInstituteForm({
      facilities: 0,
      staff: 0,
      quality: 0,
      timing: 0,
      comment: ''
    });
    setActiveModal('institute');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedCourse(null);
  };

  // ثبت نظرسنجی عمومی آموزشگاه
  const handleGeneralSurveySubmit = (e) => {
    e.preventDefault();
    if (generalSurveyAnswers.satisfactionScore === 0) {
      alert('لطفاً به میزان رضایت کلی خود امتیاز دهید.');
      return;
    }
    setGeneralSurveySubmitted(true);
  };

  // ثبت فرم استاد
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    if (
      teacherForm.mastery === 0 ||
      teacherForm.support === 0 ||
      teacherForm.practical === 0 ||
      teacherForm.punctuality === 0
    ) {
      alert('لطفاً به تمامی ۴ معیار امتیاز ۱ تا ۵ دهید.');
      return;
    }

    setCourses(prev =>
      prev.map(c =>
        c.id === selectedCourse.id
          ? { ...c, teacherSurveyDone: true, teacherRatings: { ...teacherForm } }
          : c
      )
    );
    handleCloseModal();
  };

  // ثبت فرم آموزشگاه
  const handleInstituteSubmit = (e) => {
    e.preventDefault();
    if (
      instituteForm.facilities === 0 ||
      instituteForm.staff === 0 ||
      instituteForm.quality === 0 ||
      instituteForm.timing === 0
    ) {
      alert('لطفاً به تمامی ۴ شاخص امتیاز ۱ تا ۵ دهید.');
      return;
    }

    setCourses(prev =>
      prev.map(c =>
        c.id === selectedCourse.id
          ? { ...c, instituteSurveyDone: true, instituteRatings: { ...instituteForm } }
          : c
      )
    );
    handleCloseModal();
  };

  // کامپوننت امتیازدهی ستاره‌ای / عددی ۱ تا ۵
  const StarRatingInput = ({ value, onChange, label, icon: Icon }) => {
    return (
      <div className="star-rating-item">
        <div className="star-rating-label">
          {Icon && <Icon className="star-field-icon" />}
          <span>{label}</span>
        </div>
        <div className="stars-wrapper">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              type="button"
              key={num}
              className={`star-box-btn ${num <= value ? 'active' : ''}`}
              onClick={() => onChange(num)}
            >
              <FaStar />
              <span className="star-num">{num}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="survey-page-container">
      {/* ========================================================
          ۱. هدر و بنر نظرسنجی عمومی آموزشگاه (زیر هدر صفحه)
      ======================================================== */}
      <div className="survey-hero-panel">
        <div className="survey-hero-header">
          <div className="hero-badge-icon">
            <FaPollH />
          </div>
          <div>
            <h2>نظرسنجی و ارزیابی کیفیت آموزشی</h2>
            <p>دیدگاه‌های شما در آموزشگاه فناوران فردا مستقیماً در ارتقای سطح تدریس و امکانات اثرگذار است.</p>
          </div>
        </div>

        {/* جعبه نظرسنجی فعال آموزشگاه (چندگزینه‌ای / نمره‌ای / تشریحی) */}
        {!generalSurveySubmitted ? (
          <form className="general-survey-card" onSubmit={handleGeneralSurveySubmit}>
            <div className="general-survey-title">
              <span className="live-tag">نظرسنجی دوره‌ای ویژه هنرجویان</span>
              <h4>ارزیابی خدمات و نیازسنجی کارگاه‌های مهارتی پاییز</h4>
            </div>

            <div className="survey-questions-grid">
              {/* بخش ۱: نمره‌دهی ۱ تا ۵ */}
              <div className="survey-q-box">
                <label className="q-label">
                  ۱. رضایت کلی شما از بستر برگزاری و خدمات رفاهی آموزشگاه (۱ تا ۵):
                </label>
                <div className="stars-wrapper">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      type="button"
                      key={score}
                      className={`star-box-btn ${score <= generalSurveyAnswers.satisfactionScore ? 'active' : ''}`}
                      onClick={() =>
                        setGeneralSurveyAnswers({ ...generalSurveyAnswers, satisfactionScore: score })
                      }
                    >
                      <FaStar />
                      <span className="star-num">{score}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* بخش ۲: ۴ گزینه‌ای */}
              <div className="survey-q-box">
                <label className="q-label">
                  ۲. تمایل دارید کارگاه‌های حضوری مکمل آینده روی کدام محور باشد؟
                </label>
                <div className="options-radio-grid">
                  {[
                    { id: 'opt1', text: 'ورود به بازار کار بین‌المللی و فریلنسری' },
                    { id: 'opt2', text: 'الگوریتم‌های پیشرفته و مسابقات برنامه‌نویسی' },
                    { id: 'opt3', text: 'معماری میکروسرویس و دواپس (DevOps)' },
                    { id: 'opt4', text: 'هوش مصنوعی زایا (Generative AI) و لارج مدل‌ها' }
                  ].map(opt => (
                    <label
                      key={opt.id}
                      className={`radio-option-card ${
                        generalSurveyAnswers.preferredTopic === opt.text ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferredTopic"
                        value={opt.text}
                        checked={generalSurveyAnswers.preferredTopic === opt.text}
                        onChange={e =>
                          setGeneralSurveyAnswers({ ...generalSurveyAnswers, preferredTopic: e.target.value })
                        }
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* بخش ۳: تشریحی و توضیحات */}
              <div className="survey-q-box">
                <label className="q-label">
                  ۳. پیشنهادات، انتقادات یا نقطه‌نظرات تکمیلی برای مدیریت آموزشگاه:
                </label>
                <textarea
                  className="survey-textarea"
                  rows="3"
                  placeholder="نظرات، پیشنهادات یا تجهیزات مورد نظر خود را بنویسید..."
                  value={generalSurveyAnswers.suggestions}
                  onChange={e =>
                    setGeneralSurveyAnswers({ ...generalSurveyAnswers, suggestions: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="survey-action-row">
              <button type="submit" className="btn-submit-general">
                <FaPaperPlane /> ثبت و ارسال پاسخ‌های نظرسنجی
              </button>
            </div>
          </form>
        ) : (
          <div className="survey-completed-banner">
            <FaCheckCircle className="completed-icon" />
            <div>
              <h4>پاسخ‌های شما در نظرسنجی فصلی آموزشگاه با موفقیت ثبت شد</h4>
              <p>از مشارکت ارزشمند شما در ارتقای سطح کیفی آموزشگاه فناوران فردا صمیمانه سپاسگزاریم.</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          ۲. بخش کارت‌های دوره‌ها جهت ثبت نظر استاد و آموزشگاه
      ======================================================== */}
      <div className="section-title-wrap">
        <h3>
          <FaAward className="icon-gold" /> دوره‌های من و نظرسنجی تفکیکی
        </h3>
        <p>لطفاً نظرات و امتیازات خود را به تفکیک درباره اساتید و خدمات آموزشگاه برای هر دوره ثبت فرمایید.</p>
      </div>

      <div className="eval-cards-grid">
        {courses.map(course => {
          const bothCompleted = course.teacherSurveyDone && course.instituteSurveyDone;

          return (
            <div
              key={course.id}
              className={`course-survey-card ${bothCompleted ? 'all-completed' : ''}`}
            >
              {/* وضعیت استامپ بزرگ ثبت نظر */}
              <div className="stamps-header-row">
                <div
                  className={`survey-stamp-badge ${
                    course.teacherSurveyDone ? 'stamp-done' : 'stamp-pending'
                  }`}
                >
                  {course.teacherSurveyDone ? (
                    <>
                      <FaCheckCircle /> نظرسنجی استاد: ثبت شده
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> نظرسنجی استاد: شرکت نکرده‌اید
                    </>
                  )}
                </div>

                <div
                  className={`survey-stamp-badge ${
                    course.instituteSurveyDone ? 'stamp-done' : 'stamp-pending'
                  }`}
                >
                  {course.instituteSurveyDone ? (
                    <>
                      <FaCheckCircle /> نظرسنجی آموزشگاه: ثبت شده
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> نظرسنجی آموزشگاه: شرکت نکرده‌اید
                    </>
                  )}
                </div>
              </div>

              {/* مشخصات دوره */}
              <div className="survey-card-body">
                <div className="c-code-badge">{course.code}</div>
                <h4 className="c-title">{course.title}</h4>
                <div className="c-instructor">
                  <FaChalkboardTeacher /> مدرس: <strong>{course.instructor}</strong>
                </div>
              </div>

              {/* دکمه‌های اقدام جهت باز کردن مودال‌ها */}
              <div className="survey-card-actions">
                <button
                  className={`btn-survey-action btn-teacher ${
                    course.teacherSurveyDone ? 'btn-completed' : ''
                  }`}
                  onClick={() => handleOpenTeacherModal(course)}
                >
                  <FaChalkboardTeacher />
                  <span>
                    {course.teacherSurveyDone ? 'ویرایش یا مشاهده نظر استاد' : 'نظرسنجی در مورد استاد'}
                  </span>
                </button>

                <button
                  className={`btn-survey-action btn-institute ${
                    course.instituteSurveyDone ? 'btn-completed' : ''
                  }`}
                  onClick={() => handleOpenInstituteModal(course)}
                >
                  <FaUniversity />
                  <span>
                    {course.instituteSurveyDone ? 'ویرایش یا مشاهده نظر آموزشگاه' : 'نظرسنجی در مورد آموزشگاه'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          ۳. مودال نظرسنجی در مورد استاد
      ======================================================== */}
      {activeModal === 'teacher' && selectedCourse && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaChalkboardTeacher style={{ color: '#3b82f6' }} />
                ارزیابی استاد: {selectedCourse.instructor}
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="modal-course-info-tag">
                <FaInfoCircle /> دوره: <strong>{selectedCourse.title}</strong>
              </div>

              <form onSubmit={handleTeacherSubmit} className="ratings-form">
                {/* ۱. تسلط و فن بیان اساتید */}
                <StarRatingInput
                  label="۱. تسلط علمی، شیوایی کلام و فن بیان استاد:"
                  icon={FaLaptopCode}
                  value={teacherForm.mastery}
                  onChange={val => setTeacherForm({ ...teacherForm, mastery: val })}
                />

                {/* ۲. پشتیبانی و پاسخگویی */}
                <StarRatingInput
                  label="۲. پشتیبانی، رفع اشکال و پاسخگویی به سوالات:"
                  icon={FaHeadset}
                  value={teacherForm.support}
                  onChange={val => setTeacherForm({ ...teacherForm, support: val })}
                />

                {/* ۳. پروژه‌محور و کاربردی بودن */}
                <StarRatingInput
                  label="۳. پروژه‌محور و کاربردی بودن مباحث تدریس شده:"
                  icon={FaAward}
                  value={teacherForm.practical}
                  onChange={val => setTeacherForm({ ...teacherForm, practical: val })}
                />

                {/* ۴. منظم بودن استاد و زمان‌بندی */}
                <StarRatingInput
                  label="۴. نظم در شروع و پایان، و رعایت زمان‌بندی جلسات:"
                  icon={FaClock}
                  value={teacherForm.punctuality}
                  onChange={val => setTeacherForm({ ...teacherForm, punctuality: val })}
                />

                {/* فیلد توضیحات */}
                <div className="modal-textarea-wrap">
                  <label>
                    <FaCommentDots /> توضیحات و پیشنهادات تکمیلی درباره استاد:
                  </label>
                  <textarea
                    rows="3"
                    className="survey-textarea"
                    placeholder="نقاط قوت استاد یا مواردی که نیاز به بهبود دارد را بنویسید..."
                    value={teacherForm.comment}
                    onChange={e => setTeacherForm({ ...teacherForm, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="modal-actions-footer">
                  <button type="button" className="btn-modal-cancel" onClick={handleCloseModal}>
                    انصراف
                  </button>
                  <button type="submit" className="btn-modal-save">
                    <FaCheckCircle /> ثبت نهایی نظر درباره استاد
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ۴. مودال نظرسنجی در مورد آموزشگاه
      ======================================================== */}
      {activeModal === 'institute' && selectedCourse && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaUniversity style={{ color: '#10b981' }} />
                ارزیابی خدمات آموزشگاه فناوران فردا
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="modal-course-info-tag">
                <FaInfoCircle /> مربوط به دوره: <strong>{selectedCourse.title}</strong>
              </div>

              <form onSubmit={handleInstituteSubmit} className="ratings-form">
                {/* ۱. مناسب بودن امکانات */}
                <StarRatingInput
                  label="۱. مناسب بودن امکانات، سیستم‌ها و محیط آموزشی:"
                  icon={FaLaptopCode}
                  value={instituteForm.facilities}
                  onChange={val => setInstituteForm({ ...instituteForm, facilities: val })}
                />

                {/* ۲. برخورد پرسنل آموزشگاه */}
                <StarRatingInput
                  label="۲. شیوه برخورد، تکریم و راهنمایی پرسنل آموزشگاه:"
                  icon={FaUsers}
                  value={instituteForm.staff}
                  onChange={val => setInstituteForm({ ...instituteForm, staff: val })}
                />

                {/* ۳. کیفیت دوره‌ها */}
                <StarRatingInput
                  label="۳. کیفیت کلی و انطباق سرفصل‌های دوره با استانداردهای روز:"
                  icon={FaAward}
                  value={instituteForm.quality}
                  onChange={val => setInstituteForm({ ...instituteForm, quality: val })}
                />

                {/* ۴. مناسب بودن ساعت کلاس */}
                <StarRatingInput
                  label="۴. مناسب بودن ساعت، ایام و برنامه‌ریزی تقویم کلاس‌ها:"
                  icon={FaClock}
                  value={instituteForm.timing}
                  onChange={val => setInstituteForm({ ...instituteForm, timing: val })}
                />

                {/* فیلد توضیحات */}
                <div className="modal-textarea-wrap">
                  <label>
                    <FaCommentDots /> توضیحات، انتقادات یا پیشنهادات درباره آموزشگاه:
                  </label>
                  <textarea
                    rows="3"
                    className="survey-textarea"
                    placeholder="هرگونه پیشنهاد درباره محیط، امکانات یا زمان‌بندی آموزشگاه..."
                    value={instituteForm.comment}
                    onChange={e => setInstituteForm({ ...instituteForm, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="modal-actions-footer">
                  <button type="button" className="btn-modal-cancel" onClick={handleCloseModal}>
                    انصراف
                  </button>
                  <button type="submit" className="btn-modal-save btn-institute-save">
                    <FaCheckCircle /> ثبت نهایی نظر درباره آموزشگاه
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSurvey;
