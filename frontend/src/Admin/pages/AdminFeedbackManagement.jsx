import React, { useState, useMemo } from 'react';
import {
  FiBarChart2,
  FiMessageSquare,
  FiToggleLeft,
  FiToggleRight,
  FiSave,
  FiPlusCircle,
  FiTrash2,
  FiCheckCircle,
  FiX,
  FiStar,
  FiTrendingUp,
  FiAward,
  FiSearch,
  FiFilter,
  FiLayers,
} from 'react-icons/fi';
import '../style/AdminFeedbackManagement.css'; // فایل استایل یکپارچه

export default function AdminFeedbackManagement() {
  // مدیریت تب فعال
  const [activeTab, setActiveTab] = useState('survey');

  // استیت‌های تب ارزیابی اساتید
  const [selectedTeacherFeedback, setSelectedTeacherFeedback] = useState(null);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [teacherTermFilter, setTeacherTermFilter] = useState('all');

  // داده‌های جامع کلاس‌ها و نظرسنجی اساتید
  const [teacherCoursesFeedback, setTeacherCoursesFeedback] = useState([
    {
      id: 1,
      courseCode: 'REACT-101',
      courseName: 'توسعه فرانت‌اند با React',
      teacherName: 'مهندس حمید پورفریدونی',
      term: 'تابستان ۱۴۰۳',
      status: 'active', // در حال برگزاری
      totalStudents: 28,
      participatedStudents: 26,
      overallScore: 4.85,
      criteria: [
        { title: 'تسلط فنی و فن بیان استاد', score: 4.9, benchmark: 4.7, status: 'excellent' },
        { title: 'پاسخگویی، رفع اشکال و پشتیبانی', score: 4.8, benchmark: 4.5, status: 'excellent' },
        { title: 'پروژه‌محور و کاربردی بودن سرفصل‌ها', score: 4.9, benchmark: 4.6, status: 'excellent' },
        { title: 'نظم کلاس و مدیریت زمان', score: 4.75, benchmark: 4.4, status: 'good' },
      ],
      summary: 'عملکرد استاد در این دوره فوق‌العاده بوده و بیش از ۹۴٪ هنرجویان از کیفیت و نحوه انتقال مفاهیم رضایت کامل دارند.',
      studentComments: [
        { id: 1, studentName: 'علی رضایی', date: '۱۴۰۳/۰۶/۱۵', text: 'پروژه‌های عملی دوره بسیار عالی و متناسب با بازار کار بود. پشتیبانی استاد حرف نداشت.', rating: 5 },
        { id: 2, studentName: 'مریم حسینی', date: '۱۴۰۳/۰۶/۱۴', text: 'نظم و دقت در تدریس و پاسخگویی به ابهامات از نقاط قوت اصلی کلاس بود.', rating: 5 },
        { id: 3, studentName: 'رضا کمالی', date: '۱۴۰۳/۰۶/۱۰', text: 'سرفصل‌ها عالی بود، اگر تمرینات چالشی بیشتری داده می‌شد بهتر هم می‌شد.', rating: 4 }
      ]
    },
    {
      id: 2,
      courseCode: 'PY-202',
      courseName: 'پایتون مقدماتی تا پیشرفته',
      teacherName: 'مهندس حسینی',
      term: 'تابستان ۱۴۰۳',
      status: 'completed', // پایان‌یافته
      totalStudents: 32,
      participatedStudents: 29,
      overallScore: 4.6,
      criteria: [
        { title: 'تسلط فنی و فن بیان استاد', score: 4.7, benchmark: 4.7, status: 'good' },
        { title: 'پاسخگویی، رفع اشکال و پشتیبانی', score: 4.5, benchmark: 4.5, status: 'good' },
        { title: 'پروژه‌محور و کاربردی بودن سرفصل‌ها', score: 4.6, benchmark: 4.6, status: 'good' },
        { title: 'نظم کلاس و مدیریت زمان', score: 4.6, benchmark: 4.4, status: 'good' },
      ],
      summary: 'کلاس با ریتم منظم پیش رفته و تسلط مدرس بر الگوریتم‌ها و حل مسائل پایه‌ای پایتون تحسین‌برانگیز بود.',
      studentComments: [
        { id: 1, studentName: 'سارا امینی', date: '۱۴۰۳/۰۶/۱۸', text: 'توضیحات بسیار شیوا و کاربردی بود، ممنون از استاد و آموزشگاه.', rating: 5 },
        { id: 2, studentName: 'امیر مرادی', date: '۱۴۰۳/۰۶/۱۶', text: 'تمرینات هفتگی خیلی کمک کرد تا مفاهیم جا بیفته.', rating: 4 }
      ]
    },
    {
      id: 3,
      courseCode: 'DJANGO-301',
      courseName: 'بک‌اند با Django و معماری API',
      teacherName: 'مهندس رضایی',
      term: 'بهار ۱۴۰۳',
      status: 'completed', // پایان‌یافته
      totalStudents: 22,
      participatedStudents: 19,
      overallScore: 4.7,
      criteria: [
        { title: 'تسلط فنی و فن بیان استاد', score: 4.8, benchmark: 4.7, status: 'excellent' },
        { title: 'پاسخگویی، رفع اشکال و پشتیبانی', score: 4.6, benchmark: 4.5, status: 'good' },
        { title: 'پروژه‌محور و کاربردی بودن سرفصل‌ها', score: 4.75, benchmark: 4.6, status: 'excellent' },
        { title: 'نظم کلاس و مدیریت زمان', score: 4.65, benchmark: 4.4, status: 'good' },
      ],
      summary: 'پوشش کامل مباحث احراز هویت، ORM و اتصال به پایگاه‌داده با استقبال و رضایت بالای دانشجویان همراه بوده است.',
      studentComments: [
        { id: 1, studentName: 'حسین احمدی', date: '۱۴۰۳/۰۶/۱۷', text: 'یکی از بهترین دوره‌های بک‌اند بود. پیاده‌سازی پروژه‌های واقعی عالی کار شد.', rating: 5 }
      ]
    }
  ]);

  // لیست یکتای ترم‌ها برای فیلتر دراپ‌داون
  const availableTerms = useMemo(() => {
    return Array.from(new Set(teacherCoursesFeedback.map(c => c.term)));
  }, [teacherCoursesFeedback]);

  // فیلتر کردن هوشمند کلاس‌ها براساس جستجوی مدیر
  const filteredTeacherCourses = useMemo(() => {
    return teacherCoursesFeedback.filter(course => {
      const matchSearch =
        course.courseName.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
        course.teacherName.toLowerCase().includes(teacherSearchTerm.toLowerCase());

      const matchStatus =
        teacherStatusFilter === 'all' ? true : course.status === teacherStatusFilter;

      const matchTerm =
        teacherTermFilter === 'all' ? true : course.term === teacherTermFilter;

      return matchSearch && matchStatus && matchTerm;
    });
  }, [teacherCoursesFeedback, teacherSearchTerm, teacherStatusFilter, teacherTermFilter]);

  // استیت فرم ثبت نظرسنجی جدید
  const [formData, setFormData] = useState({
    topic: '',
    question: '',
    description: '',
    type: 'multi',
    options: ['', '', '', ''],
    isVisible: true
  });

  // لیست نظرسنجی‌های ثبت‌شده
  const [surveys, setSurveys] = useState([
    {
      id: 101,
      topic: 'کیفیت آموزش',
      question: 'کیفیت تدریس سرفصل‌های ری‌اکت چطور ارزیابی می‌شود؟',
      description: 'نظرسنجی پایان دوره فرانت‌اند دوره تابستان',
      type: 'multi',
      options: ['عالی', 'خوب', 'متوسط', 'نیاز به بهبود'],
      isVisible: true,
      stats: {
        totalVotes: 45,
        breakdown: [
          { label: 'عالی', count: 28, percent: 62 },
          { label: 'خوب', count: 12, percent: 27 },
          { label: 'متوسط', count: 4, percent: 9 },
          { label: 'نیاز به بهبود', count: 1, percent: 2 }
        ]
      }
    },
    {
      id: 102,
      topic: 'امکانات آموزشگاه',
      question: 'به وضعیت سیستم‌ها و سرعت اینترنت آموزشگاه از ۱ تا ۵ نمره دهید',
      description: 'بررسی رضایت کارآموزان از تجهیزات سخت‌افزاری',
      type: 'score',
      options: [],
      isVisible: true,
      stats: {
        totalVotes: 38,
        averageScore: 4.4,
        breakdown: [
          { label: '۵ ستاره', count: 22, percent: 58 },
          { label: '۴ ستاره', count: 11, percent: 29 },
          { label: '۳ ستاره', count: 3, percent: 8 },
          { label: '۲ ستاره', count: 2, percent: 5 },
          { label: '۱ ستاره', count: 0, percent: 0 }
        ]
      }
    }
  ]);

  // دیتای نمونه پاسخ‌های کاربران به سوالات
  const [responses, setResponses] = useState([
    { id: 1, surveyId: 101, surveyQuestion: 'کیفیت تدریس سرفصل‌های ری‌اکت چطور ارزیابی می‌شود؟', userName: 'علی رضایی', userResponse: 'عالی', scoreOrRate: 'گزینه ۱', date: '۱۴۰۳/۰۶/۱۵' },
    { id: 2, surveyId: 102, surveyQuestion: 'به وضعیت سیستم‌ها و اینترنت آموزشگاه نمره دهید', userName: 'زهرا کاظمی', userResponse: 'نمره ۵ از ۵', scoreOrRate: 'امتیاز ۵', date: '۱۴۰۳/۰۶/۱۶' },
    { id: 3, surveyId: 101, surveyQuestion: 'کیفیت تدریس سرفصل‌های ری‌اکت چطور ارزیابی می‌شود؟', userName: 'محمد ناصری', userResponse: 'خوب', scoreOrRate: 'گزینه ۲', date: '۱۴۰۳/۰۶/۱۷' }
  ]);

  // لیست نظرات و پیشنهادات عمومی کاربران
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      subject: 'پیشنهاد برگزاری دوره هوش مصنوعی',
      description: 'سلام، در صورت امکان کارگاه پردازش تصویر با پایتون هم برگزار کنید.',
      email: 'ali.ahmadi@gmail.com',
      phone: '09131234567',
      isVisible: true,
      date: '۱۴۰۳/۰۶/۱۸'
    },
    {
      id: 2,
      subject: 'کیفیت سالن مطالعه',
      description: 'نور سالن مطالعه در تایم عصر کمی ضعیف است، در صورت امکان بررسی شود.',
      email: 'sara.k@yahoo.com',
      phone: '09351239876',
      isVisible: false,
      date: '۱۴۰۳/۰۶/۱۷'
    }
  ]);

  // استیت مودال جزئیات و آمار نظرسنجی
  const [selectedSurveyStats, setSelectedSurveyStats] = useState(null);

  // ثبت نظرسنجی جدید
  const handleSaveSurvey = (e) => {
    e.preventDefault();
    if (!formData.topic.trim() || !formData.question.trim()) {
      alert('لطفاً موضوع و متن سوال نظرسنجی را تکمیل کنید.');
      return;
    }

    if (formData.type === 'multi') {
      const emptyOptions = formData.options.filter(opt => !opt.trim());
      if (emptyOptions.length > 0) {
        alert('لطفاً تمام ۴ گزینه نظرسنجی را تکمیل کنید.');
        return;
      }
    }

    const newSurveyItem = {
      id: Date.now(),
      topic: formData.topic,
      question: formData.question,
      description: formData.description,
      type: formData.type,
      options: formData.type === 'multi' ? [...formData.options] : [],
      isVisible: formData.isVisible,
      stats: {
        totalVotes: 0,
        averageScore: formData.type === 'score' ? 0 : null,
        breakdown: formData.type === 'multi'
          ? formData.options.map(opt => ({ label: opt, count: 0, percent: 0 }))
          : []
      }
    };

    setSurveys([newSurveyItem, ...surveys]);

    setFormData({
      topic: '',
      question: '',
      description: '',
      type: 'multi',
      options: ['', '', '', ''],
      isVisible: true
    });

    alert('نظرسنجی با موفقیت ذخیره و منتشر شد.');
  };

  // فعال/غیرفعال کردن نمایش نظرات در سایت
  const handleToggleFeedbackVisibility = (id) => {
    setFeedbacks(prev =>
      prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item)
    );
  };

  // فعال/غیرفعال کردن نظرسنجی
  const handleToggleSurveyVisibility = (id) => {
    setSurveys(prev =>
      prev.map(item => item.id === id ? { ...item, isVisible: !item.isVisible } : item)
    );
  };

  // حذف نظر
  const handleDeleteFeedback = (id) => {
    if (window.confirm('آیا از حذف این نظر اطمینان دارید؟')) {
      setFeedbacks(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="admin-page-wrapper">
      {/* هدر صفحه */}
      <div className="admin-page-header">
        <div>
          <h2 className="admin-page-title">مدیریت نظرسنجی‌ها، نظرات و پیشنهادات</h2>
          <p className="admin-page-subtitle">طراحی و انتشار نظرسنجی‌های دوره‌ها، تحلیل بازخوردها و تایید نظرات عمومی</p>
        </div>
      </div>

      {/* منوی تب‌ها */}
      <div className="admin-tabs-container">
        <button
          className={`tab-btn ${activeTab === 'survey' ? 'active' : ''}`}
          onClick={() => setActiveTab('survey')}
        >
          <FiBarChart2 size={18} />
          <span>طراحی و تحلیل نظرسنجی‌ها</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <FiMessageSquare size={18} />
          <span>نظرات و پیشنهادات کاربران ({feedbacks.length})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'teacher_surveys' ? 'active' : ''}`}
          onClick={() => setActiveTab('teacher_surveys')}
        >
          <FiAward size={18} />
          <span>ارزیابی و نظرسنجی اساتید</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* تب اول: نظرسنجی‌ها */}
      {/* ==================================================== */}
      {activeTab === 'survey' && (
        <div className="tab-content">
          <div className="survey-form-card">
            <div className="card-header-styled">
              <div className="icon-badge">
                <FiPlusCircle size={20} />
              </div>
              <div>
                <h3>تعریف و بارگذاری سوال نظرسنجی جدید</h3>
                <p>نوع سوال را انتخاب کرده و تنظیمات انتشار را مشخص کنید</p>
              </div>
            </div>

            <form onSubmit={handleSaveSurvey} className="survey-builder-grid">
              <div className="field-group">
                <label className="field-label">موضوع نظرسنجی *</label>
                <input
                  type="text"
                  placeholder="مثال: کیفیت تدریس استاد، سنجش رضایت و..."
                  className="admin-input"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="field-group">
                <label className="field-label">نوع سوال نظرسنجی</label>
                <select
                  className="admin-input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="multi">چهار گزینه‌ای (چند گزینه‌ای)</option>
                  <option value="score">نمره‌ای و امتیازی (۱ تا ۵ ستاره)</option>
                  <option value="text">تشریحی و بازخورد متنی</option>
                </select>
              </div>

              <div className="field-group full-width">
                <label className="field-label">متن دقیق سوال نظرسنجی *</label>
                <input
                  type="text"
                  placeholder="سوال خود را شفاف و دقیق بنویسید..."
                  className="admin-input"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                />
              </div>

              {formData.type === 'multi' && (
                <div className="options-container full-width">
                  <span className="options-title">تعریف گزینه‌های پاسخ (۴ گزینه):</span>
                  <div className="options-grid">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="option-input-wrapper">
                        <span className="option-num">{index + 1}</span>
                        <input
                          type="text"
                          placeholder={`متن گزینه ${index + 1}`}
                          className="admin-input"
                          value={formData.options[index]}
                          onChange={(e) => {
                            const updated = [...formData.options];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, options: updated });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.type === 'score' && (
                <div className="notice-banner full-width">
                  <FiStar className="notice-icon" />
                  <span>این سوال به صورت مقیاس عددی ۱ تا ۵ ستاره (امتیازدهی نمره‌ای) به دانشجویان نمایش داده خواهد شد.</span>
                </div>
              )}

              {formData.type === 'text' && (
                <div className="notice-banner full-width">
                  <FiMessageSquare className="notice-icon" />
                  <span>کاربران پاسخ خود را به صورت متن تشریحی و نظر آزاد ارسال خواهند کرد.</span>
                </div>
              )}

              <div className="field-group full-width">
                <label className="field-label">توضیحات تکمیلی (راهنمای دانشجو)</label>
                <textarea
                  rows={2}
                  placeholder="توضیحات کوتاه درباره هدف نظرسنجی..."
                  className="admin-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-footer-actions full-width">
                <label className="toggle-switch-wrapper">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  />
                  <span>انتشار مستقیم و فعال بودن در پورتال دانشجویان</span>
                </label>

                <button type="submit" className="admin-btn-primary">
                  <FiSave size={16} />
                  <span>ذخیره و انتشار نظرسنجی</span>
                </button>
              </div>
            </form>
          </div>

          {/* لیست نظرسنجی‌های تعریف‌شده */}
          <div className="table-section-card" style={{ marginTop: '28px' }}>
            <div className="table-header-custom">
              <div>
                <h3>لیست سوالات و نظرسنجی‌های فعال</h3>
                <p>مدیریت سوالات، فعال/غیرفعال‌سازی و مشاهده نمودار بازخوردها</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th>موضوع</th>
                    <th>متن سوال</th>
                    <th>نوع سوال</th>
                    <th>وضعیت نمایش</th>
                    <th>عملیات و آمار</th>
                  </tr>
                </thead>
                <tbody>
                  {surveys.map((survey) => (
                    <tr key={survey.id}>
                      <td><strong>{survey.topic}</strong></td>
                      <td>{survey.question}</td>
                      <td>
                        <span className="type-pill">
                          {survey.type === 'multi' ? 'چهارگزینه‌ای' : survey.type === 'score' ? 'نمره‌ای (۱ تا ۵)' : 'تشریحی'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="toggle-status-btn btn"
                          onClick={() => handleToggleSurveyVisibility(survey.id)}
                          title="تغییر وضعیت فعال بودن"
                        >
                          {survey.isVisible ? (
                            <span className="status-badge active btn btn-success"><FiCheckCircle /> فعال</span>
                          ) : (
                            <span className="status-badge inactive btn btn-danger">غیرفعال</span>
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="table-btn-details"
                          onClick={() => setSelectedSurveyStats(survey)}
                        >
                          <FiBarChart2 size={16} />
                          <span>جزئیات و نمودار آمار</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* جدول جواب‌ها */}
          <div className="table-section-card" style={{ marginTop: '28px' }}>
            <div className="table-header-custom">
              <div>
                <h3>پاسخ‌های ثبت‌شده دانشجویان</h3>
                <p>مشاهده تک‌تک آرا، نمرات و گزینه‌های انتخابی کاربران</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th>کد سوال</th>
                    <th>متن سوال نظرسنجی</th>
                    <th>نام کاربر</th>
                    <th>جواب کاربر</th>
                    <th>نمره / برچسب</th>
                    <th>تاریخ ثبت</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((resp) => (
                    <tr key={resp.id}>
                      <td><span className="badge-id">#{resp.surveyId}</span></td>
                      <td style={{ fontWeight: 500 }}>{resp.surveyQuestion}</td>
                      <td>{resp.userName}</td>
                      <td>
                        <span className="response-tag">{resp.userResponse}</span>
                      </td>
                      <td><span className="score-badge">{resp.scoreOrRate}</span></td>
                      <td>{resp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* تب دوم: نظرات و پیشنهادات */}
      {/* ==================================================== */}
      {activeTab === 'comments' && (
        <div className="tab-content">
          <div className="table-section-card">
            <div className="table-header-custom">
              <div>
                <h3>نظرات و پیشنهادات ارسالی کاربران</h3>
                <p>بررسی نظرات و تایید برای نمایش در بخش نظرات صفحه اصلی سایت</p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>موضوع</th>
                    <th style={{ width: '35%' }}>توضیحات و متن نظر</th>
                    <th>اطلاعات تماس (ایمیل / تلفن)</th>
                    <th>نمایش در صفحه اصلی</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.subject}</strong><br /><small className="text-muted">{item.date}</small></td>
                      <td>
                        <p className="comment-text">{item.description}</p>
                      </td>
                      <td>
                        <div className="contact-info">
                          <span>{item.phone}</span>
                          <small>{item.email}</small>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`toggle-publish-btn ${item.isVisible ? 'published' : 'hidden'}`}
                          onClick={() => handleToggleFeedbackVisibility(item.id)}
                        >
                          {item.isVisible ? (
                            <>
                              <FiToggleRight size={22} color="#10b981" />
                              <span className="publish-label active">نمایش در سایت</span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft size={22} color="#9ca3af" />
                              <span className="publish-label">مخفی</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="table-btn-delete"
                          onClick={() => handleDeleteFeedback(item.id)}
                          title="حذف نظر"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* تب سوم: نظرسنجی و ارزیابی کلاس‌ها و اساتید */}
      {/* ==================================================== */}
      {activeTab === 'teacher_surveys' && (
        <div className="tab-content">
          {/* کارت شاخص‌های کلی عملکرد اساتید */}
          <div className="stats-summary-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <span className="stat-label">تعداد کل دوره‌های ارزیابی‌شده</span>
              <span className="stat-value">{teacherCoursesFeedback.length} دوره فعال</span>
            </div>
            <div className="stat-card highlight">
              <span className="stat-label">میانگین رضایت از کل اساتید</span>
              <span className="stat-value">
                {(
                  teacherCoursesFeedback.reduce((acc, curr) => acc + curr.overallScore, 0) /
                  teacherCoursesFeedback.length
                ).toFixed(2)}{' '}
                از ۵ ★
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">کل نظرات ارسالی هنرجویان</span>
              <span className="stat-value">
                {teacherCoursesFeedback.reduce((acc, curr) => acc + curr.studentComments.length, 0)} بازخورد کیفی
              </span>
            </div>
          </div>

          {/* جدول لیست کلاس‌ها همراه با نوار فیلتر و جستجو */}
          <div className="table-section-card">
            <div className="table-header-custom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3>کارنامه و بازخورد دوره‌ها به تفکیک اساتید</h3>
                <p>مشاهده نرخ مشارکت هنرجویان، میانگین رضایت‌مندی و گزارش تحلیلی هر دوره</p>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                تعداد نتایج یافت‌شده: <span style={{ color: '#2563eb' }}>{filteredTeacherCourses.length}</span> از {teacherCoursesFeedback.length}
              </div>
            </div>

            {/* بخش جستجو و فیلترهای چندگانه */}
            <div
              className="filters-toolbar"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '10px',
                margin: '16px 0',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* ۱. جستجوی متنی (نام کلاس، کد یا نام استاد) */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiSearch
                  style={{
                    position: 'absolute',
                    right: '12px',
                    color: '#94a3b8',
                    pointerEvents: 'none'
                  }}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="جستجو در نام کلاس، کد یا نام استاد..."
                  className="admin-input"
                  style={{ paddingRight: '38px', width: '100%', height: '42px' }}
                  value={teacherSearchTerm}
                  onChange={(e) => setTeacherSearchTerm(e.target.value)}
                />
              </div>

              {/* ۲. فیلتر وضعیت برگزاری */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiFilter
                  style={{
                    position: 'absolute',
                    right: '12px',
                    color: '#94a3b8',
                    pointerEvents: 'none'
                  }}
                  size={18}
                />
                <select
                  className="admin-input"
                  style={{ paddingRight: '38px', width: '100%', height: '42px', cursor: 'pointer' }}
                  value={teacherStatusFilter}
                  onChange={(e) => setTeacherStatusFilter(e.target.value)}
                >
                  <option value="all">همه وضعیت‌ها (برگزاری و پایان یافته)</option>
                  <option value="active">🟢 فقط در حال برگزاری</option>
                  <option value="completed">⚪ فقط پایان‌یافته</option>
                </select>
              </div>

              {/* ۳. فیلتر بر اساس ترم/دوره */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiLayers
                  style={{
                    position: 'absolute',
                    right: '12px',
                    color: '#94a3b8',
                    pointerEvents: 'none'
                  }}
                  size={18}
                />
                <select
                  className="admin-input"
                  style={{ paddingRight: '38px', width: '100%', height: '42px', cursor: 'pointer' }}
                  value={teacherTermFilter}
                  onChange={(e) => setTeacherTermFilter(e.target.value)}
                >
                  <option value="all">همه ترم‌ها و دوره‌ها</option>
                  {availableTerms.map((term, i) => (
                    <option key={i} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* جدول دوره‌ها */}
            <div className="table-responsive">
              <table className="admin-modern-table">
                <thead>
                  <tr>
                    <th>کد دوره</th>
                    <th>نام دوره آموزشی</th>
                    <th>مدرس دوره</th>
                    <th>ترم / دوره</th>
                    <th>وضعیت کلاس</th>
                    <th>نرخ مشارکت</th>
                    <th>میانگین رضایت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeacherCourses.length > 0 ? (
                    filteredTeacherCourses.map((course) => {
                      const participationRate = Math.round(
                        (course.participatedStudents / course.totalStudents) * 100
                      );
                      return (
                        <tr key={course.id}>
                          <td><span className="badge-id">{course.courseCode}</span></td>
                          <td><strong>{course.courseName}</strong></td>
                          <td>
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>
                              👤 {course.teacherName}
                            </span>
                          </td>
                          <td>{course.term}</td>
                          <td>
                            {course.status === 'active' ? (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '16px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#dcfce7',
                                color: '#15803d',
                                border: '1px solid #bbf7d0'
                              }}>
                                🟢 در حال برگزاری
                              </span>
                            ) : (
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '16px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #e2e8f0'
                              }}>
                                ⚪ پایان‌یافته
                              </span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 600 }}>{participationRate}%</span>
                              <div className="bar-track" style={{ width: '80px', height: '6px' }}>
                                <div
                                  className="bar-fill"
                                  style={{ width: `${participationRate}%`, background: '#10b981' }}
                                ></div>
                              </div>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                ({course.participatedStudents}/{course.totalStudents})
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="score-badge" style={{ background: '#ecfdf5', color: '#059669', borderColor: '#a7f3d0' }}>
                              ⭐ {course.overallScore} از ۵
                            </span>
                          </td>
                          <td>
                            <button
                              className="table-btn-details"
                              onClick={() => setSelectedTeacherFeedback(course)}
                            >
                              <FiBarChart2 size={16} />
                              <span> بازخورد </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        هیچ دوره‌ای مطابق با فیلترهای انتخاب‌شده یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* مودال ۱: مشاهده جزئیات آمار و نمودار میله‌ای نظرسنجی عمومی */}
      {/* ==================================================== */}
      {selectedSurveyStats && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedSurveyStats(null)}>
          <div className="admin-modal-card stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon-badge">
                  <FiTrendingUp size={22} />
                </div>
                <div>
                  <h3>آمار و بازخورد نظرسنجی: {selectedSurveyStats.topic}</h3>
                  <p className="modal-subtitle">{selectedSurveyStats.question}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedSurveyStats(null)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="stats-summary-grid">
                <div className="stat-card">
                  <span className="stat-label">تعداد کل آرا</span>
                  <span className="stat-value">{selectedSurveyStats.stats?.totalVotes || 0} رای</span>
                </div>

                {selectedSurveyStats.type === 'score' && (
                  <div className="stat-card highlight">
                    <span className="stat-label">میانگین امتیاز</span>
                    <span className="stat-value">{selectedSurveyStats.stats?.averageScore || 0} از ۵ ★</span>
                  </div>
                )}

                <div className="stat-card">
                  <span className="stat-label">نوع نظرسنجی</span>
                  <span className="stat-value">
                    {selectedSurveyStats.type === 'multi' && 'چهارگزینه‌ای'}
                    {selectedSurveyStats.type === 'score' && 'نمره‌ای (۱ تا ۵)'}
                    {selectedSurveyStats.type === 'text' && 'پاسخ تشریحی'}
                  </span>
                </div>
              </div>

              <div className="feedback-dynamic-section" style={{ marginTop: '22px' }}>
                {selectedSurveyStats.type === 'multi' && (
                  <div>
                    <h4 className="section-subtitle">توزیع آماری گزینه‌ها:</h4>
                    <div className="chart-bars-list">
                      {selectedSurveyStats.stats?.breakdown?.map((item, idx) => (
                        <div key={idx} className="chart-bar-item">
                          <div className="bar-info">
                            <span className="bar-label"><strong>گزینه {idx + 1}:</strong> {item.label}</span>
                            <span className="bar-percent">{item.percent}% ({item.count} رای)</span>
                          </div>
                          <div className="bar-track">
                            <div className="bar-fill" style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSurveyStats.type === 'score' && (
                  <div>
                    <h4 className="section-subtitle">تفکیک امتیازات و نمرات دانشجویان:</h4>
                    <div className="score-bars-list">
                      {selectedSurveyStats.stats?.breakdown?.map((item, idx) => (
                        <div key={idx} className="score-bar-row">
                          <div className="score-stars-label">
                            <FiStar className="star-icon" />
                            <span>{item.label}</span>
                          </div>
                          <div className="bar-track score-track">
                            <div className="bar-fill score-fill" style={{ width: `${item.percent}%` }}></div>
                          </div>
                          <span className="score-percent-badge">{item.percent}% ({item.count} رای)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSurveyStats.type === 'text' && (
                  <div>
                    <h4 className="section-subtitle">متن پاسخ‌های تشریحی ثبت‌شده:</h4>
                    <div className="text-answers-list">
                      {responses.filter(r => r.surveyId === selectedSurveyStats.id).length > 0 ? (
                        responses
                          .filter(r => r.surveyId === selectedSurveyStats.id)
                          .map((resp, idx) => (
                            <div key={resp.id || idx} className="text-answer-card">
                              <div className="text-answer-header">
                                <span className="user-name">👤 {resp.userName}</span>
                                <span className="answer-date">{resp.date}</span>
                              </div>
                              <p className="answer-content">{resp.userResponse}</p>
                            </div>
                          ))
                      ) : (
                        <div className="empty-answers-notice">
                          <FiMessageSquare size={24} />
                          <p>هنوز پاسخ تشریحی برای این نظرسنجی ثبت نشده است.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedSurveyStats(null)}>
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* مودال ۲: جزئیات بازخورد، مقایسه با بهترین/بدترین کلاس و نظرات */}
      {/* ==================================================== */}
      {selectedTeacherFeedback && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedTeacherFeedback(null)}>
          <div className="admin-modal-card stats-modal" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
            {/* هدر مودال */}
            <div className="admin-modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  <FiAward size={22} />
                </div>
                <div>
                  <h3>گزارش ارزیابی دوره: {selectedTeacherFeedback.courseName}</h3>
                  <p className="modal-subtitle">
                    مدرس: <strong>{selectedTeacherFeedback.teacherName}</strong> | کد دوره: {selectedTeacherFeedback.courseCode} ({selectedTeacherFeedback.term})
                  </p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedTeacherFeedback(null)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="modal-body-content">
              {/* ۱. کارت‌های خلاصه آماری */}
              <div className="stats-summary-grid">
                <div className="stat-card">
                  <span className="stat-label">میزان مشارکت</span>
                  <span className="stat-value">
                    {selectedTeacherFeedback.participatedStudents} از {selectedTeacherFeedback.totalStudents} نفر ({Math.round((selectedTeacherFeedback.participatedStudents / selectedTeacherFeedback.totalStudents) * 100)}%)
                  </span>
                </div>
                <div className="stat-card highlight">
                  <span className="stat-label">امتیاز رضایت کل</span>
                  <span className="stat-value">{selectedTeacherFeedback.overallScore} از ۵ ★</span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">تعداد بازخوردهای کیفی</span>
                  <span className="stat-value">{selectedTeacherFeedback.studentComments.length} نظر ثبت‌شده</span>
                </div>
              </div>

              {/* ۲. بخش مقایسه بنچ‌مارک با کلاس‌های آموزشگاه */}
              {(() => {
                const sortedCourses = [...teacherCoursesFeedback].sort((a, b) => b.overallScore - a.overallScore);
                const bestCourse = sortedCourses[0];
                const lowestCourse = sortedCourses[sortedCourses.length - 1];
                const avgScore = (
                  teacherCoursesFeedback.reduce((acc, c) => acc + c.overallScore, 0) /
                  teacherCoursesFeedback.length
                ).toFixed(2);

                const currentScore = selectedTeacherFeedback.overallScore;
                const diffWithBest = (currentScore - bestCourse.overallScore).toFixed(2);

                return (
                  <div style={{
                    marginTop: '22px',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 className="section-subtitle" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FiTrendingUp color="#2563eb" />
                        <span>تحلیل تطبیقی و مقایسه با سایر کلاس‌های آموزشگاه</span>
                      </h4>
                      
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        background: currentScore === bestCourse.overallScore ? '#ecfdf5' : '#eff6ff',
                        color: currentScore === bestCourse.overallScore ? '#059669' : '#2563eb',
                        border: `1px solid ${currentScore === bestCourse.overallScore ? '#a7f3d0' : '#bfdbfe'}`
                      }}>
                        {currentScore === bestCourse.overallScore
                          ? '🏆 رتبه ۱ آموزشگاه (برترین کلاس)'
                          : `اختلاف با رتبه اول: ${Math.abs(diffWithBest)} نمره`}
                      </span>
                    </div>

                    {/* کارت‌های مقایسه */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      {/* برترین کلاس */}
                      <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                        <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600 }}>🏆 برترین کلاس آموزشگاه</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#065f46', marginTop: '4px' }}>{bestCourse.courseName}</div>
                        <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>استاد: <strong>{bestCourse.teacherName}</strong></div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>⭐ {bestCourse.overallScore} از ۵</div>
                      </div>

                      {/* وضعیت همین کلاس */}
                      <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                        <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600 }}>📌 وضعیت همین کلاس</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginTop: '4px' }}>{selectedTeacherFeedback.courseName}</div>
                        <div style={{ fontSize: '12px', color: '#1d4ed8', marginTop: '2px' }}>استاد: <strong>{selectedTeacherFeedback.teacherName}</strong></div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', marginTop: '6px' }}>⭐ {currentScore} از ۵</div>
                      </div>

                      {/* کمترین کلاس */}
                      <div style={{ padding: '12px', background: '#fff1f2', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                        <div style={{ fontSize: '11px', color: '#be123c', fontWeight: 600 }}>⚠️ کمترین امتیاز آموزشگاه</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#9f1239', marginTop: '4px' }}>{lowestCourse.courseName}</div>
                        <div style={{ fontSize: '12px', color: '#be123c', marginTop: '2px' }}>استاد: <strong>{lowestCourse.teacherName}</strong></div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#e11d48', marginTop: '6px' }}>⭐ {lowestCourse.overallScore} از ۵</div>
                      </div>
                    </div>

                    {/* نمودار میله‌ای مقایسه‌ای */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                          <span>برترین کلاس ({bestCourse.teacherName})</span>
                          <strong>{bestCourse.overallScore}</strong>
                        </div>
                        <div className="bar-track" style={{ height: '8px' }}>
                          <div className="bar-fill" style={{ width: `${(bestCourse.overallScore / 5) * 100}%`, background: '#10b981' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                          <span style={{ fontWeight: 700, color: '#2563eb' }}>این کلاس ({selectedTeacherFeedback.teacherName})</span>
                          <strong style={{ color: '#2563eb' }}>{currentScore}</strong>
                        </div>
                        <div className="bar-track" style={{ height: '8px' }}>
                          <div className="bar-fill" style={{ width: `${(currentScore / 5) * 100}%`, background: '#3b82f6' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px', color: '#64748b' }}>
                          <span>میانگین کل کلاس‌های آموزشگاه</span>
                          <strong>{avgScore}</strong>
                        </div>
                        <div className="bar-track" style={{ height: '8px' }}>
                          <div className="bar-fill" style={{ width: `${(avgScore / 5) * 100}%`, background: '#94a3b8' }}></div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px', color: '#9f1239' }}>
                          <span>کمترین نمره کلاس ({lowestCourse.teacherName})</span>
                          <strong>{lowestCourse.overallScore}</strong>
                        </div>
                        <div className="bar-track" style={{ height: '8px' }}>
                          <div className="bar-fill" style={{ width: `${(lowestCourse.overallScore / 5) * 100}%`, background: '#f43f5e' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* ۳. بخش شاخص‌های ۴ گانه ارزیابی */}
              <div style={{ marginTop: '22px' }}>
                <h4 className="section-subtitle">ارزیابی بر اساس شاخص‌های آموزشی (مقایسه با میانگین کل دوره‌ها):</h4>
                <div className="chart-bars-list" style={{ marginTop: '12px' }}>
                  {selectedTeacherFeedback.criteria.map((item, idx) => (
                    <div key={idx} className="chart-bar-item">
                      <div className="bar-info">
                        <span className="bar-label"><strong>{idx + 1}. {item.title}</strong></span>
                        <span className="bar-percent">
                          امتیاز: <strong>{item.score}</strong> / ۵{' '}
                          <small style={{ color: '#64748b' }}>(میانگین استاندارد: {item.benchmark})</small>
                        </span>
                      </div>
                      <div className="bar-track" style={{ height: '10px' }}>
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(item.score / 5) * 100}%`,
                            background: item.score >= 4.7 ? '#10b981' : item.score >= 4.0 ? '#3b82f6' : '#f59e0b'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ۴. کادر جمع‌بندی تحلیلی */}
              {selectedTeacherFeedback?.summary && (
                <div
                  className="notice-banner"
                  style={{
                    marginTop: '20px',
                    background: '#f0fdf4',
                    borderColor: '#bbf7d0',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '16px',
                    border: '1px solid #bbf7d0',
                    borderRadius: '10px',
                  }}
                >
                  <FiCheckCircle
                    size={20}
                    color="#166534"
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  />
                  <div>
                    <strong>جمع‌بندی تحلیلی</strong>
                    <p style={{ margin: '8px 0 0', lineHeight: 1.8 }}>
                      {selectedTeacherFeedback.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* ۵. بازخوردها و کامنت‌های متنی هنرجویان */}
              <div style={{ marginTop: '22px' }}>
                <h4 className="section-subtitle">نظرات و بازخوردهای ثبت‌شده هنرجویان این کلاس:</h4>
                <div className="text-answers-list" style={{ marginTop: '12px' }}>
                  {selectedTeacherFeedback.studentComments && selectedTeacherFeedback.studentComments.length > 0 ? (
                    selectedTeacherFeedback.studentComments.map((comment) => (
                      <div key={comment.id} className="text-answer-card">
                        <div className="text-answer-header">
                          <span className="user-name">👤 {comment.studentName}</span>
                          <span className="answer-date">
                            ⭐ {comment.rating} از ۵ | {comment.date}
                          </span>
                        </div>
                        <p className="answer-content">{comment.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="empty-answers-notice">
                      <FiMessageSquare size={24} />
                      <p>هنوز نظر متنی برای این کلاس ثبت نشده است.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedTeacherFeedback(null)}>
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
