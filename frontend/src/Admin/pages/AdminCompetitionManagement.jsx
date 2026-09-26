import React, { useState } from 'react';
import { 
  FiAward, 
  FiCalendar, 
  FiMapPin, 
  FiEdit, 
  FiEye, 
  FiPlus, 
  FiCheck, FiLayers, FiGift, FiFileText, FiBarChart2,
  FiX, 
  FiUsers, 
  FiInfo, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';
import '../style/AdminCompetitionManagement.css'; // یا فایل استایل مرتبط خودتان

const initialCompetitions = [
  {
    id: 1,
    title: 'مسابقه برنامه‌نویسی وب و فرانت‌اند',
    category: 'فرانت‌اند (React / JS)',
    date: '1403/08/20',
    location: 'سیرجان، سالن همایش فناوران فردا',
    level: 'متوسط',
    prizes: 'نفر اول: ۵ میلیون تومان + بورسیه | نفر دوم: ۳ میلیون تومان',
    description: 'چالش کدنویسی زنده و پیاده‌سازی رابط کاربری مدرن در ۴ ساعت.',
    isVisible: true,
  },
  {
    id: 2,
    title: 'ماراتن الگوریتم و حل مسئله پایتون',
    category: 'هوش مصنوعی و پایتون',
    date: '1403/09/05',
    location: 'آنلاین (سامانه کوئرا / پنل اختصاصی)',
    level: 'پیشرفته',
    prizes: 'جوایز نقدی به همراه معرفی به شرکت‌های فناور',
    description: 'مسابقه حل مسائل داده‌ساختارها، الگوریتم‌ها و بهینه‌سازی کد.',
    isVisible: false,
  }
];

const initialRegistrations = [
  {
    id: 1,
    competitionId: 1,
    competitionTitle: 'مسابقه برنامه‌نویسی وب و فرانت‌اند',
    fullName: 'علی رضایی',
    phone: '09131234567',
    nationalCode: '3061234567',
    skills: 'React, Tailwind CSS, JavaScript',
    email: 'ali.rezaei@gmail.com',
    motivation: 'سنجش مهارت‌های فرانت‌اند و ورود به بازار کار تیمی'
  },
  {
    id: 2,
    competitionId: 1,
    competitionTitle: 'مسابقه برنامه‌نویسی وب و فرانت‌اند',
    fullName: 'زهرا کاظمی',
    phone: '09359876543',
    nationalCode: '3079876543',
    skills: 'HTML, CSS, Vue.js',
    email: 'z.kazemi@yahoo.com',
    motivation: 'کسب تجربه در شرایط مسابقه و بردن جایزه اول'
  },
  {
    id: 3,
    competitionId: 2,
    competitionTitle: 'ماراتن الگوریتم و حل مسئله پایتون',
    fullName: 'محمد امین پورفریدونی',
    phone: '09050958715',
    nationalCode: '3120001122',
    skills: 'Python, C++, Data Science',
    email: 'm.amin@gmail.com',
    motivation: 'علاقه شدید به مباحث هوش مصنوعی و بهینه‌سازی الگوریتم‌ها'
  }
];

const AdminCompetitionManagement = () => {
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const [registrations, setRegistrations] = useState(initialRegistrations);

  // استیت‌های فرم
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    location: '',
    level: 'متوسط',
    prizes: '',
    description: '',
    isVisible: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // استیت مودال جزئیات و لیست ثبت‌نامی‌ها
  const [selectedCompForDetails, setSelectedCompForDetails] = useState(null);

  // تغییر مقادیر فرم
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ثبت یا به‌روزرسانی مسابقه
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.date) {
      alert('لطفاً عنوان، تخصص و تاریخ برگزاری را وارد کنید.');
      return;
    }

    if (isEditing) {
      setCompetitions(prev =>
        prev.map(item => item.id === editingId ? { ...formData, id: editingId } : item)
      );
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newComp = {
        ...formData,
        id: Date.now(),
      };
      setCompetitions([newComp, ...competitions]);
    }

    // ریست فرم
    setFormData({
      title: '',
      category: '',
      date: '',
      location: '',
      level: 'متوسط',
      prizes: '',
      description: '',
      isVisible: true,
    });
  };

  // بارگذاری داده‌ها در فرم برای ویرایش
  const handleStartEdit = (comp) => {
    setIsEditing(true);
    setEditingId(comp.id);
    setFormData({
      title: comp.title,
      category: comp.category,
      date: comp.date,
      location: comp.location,
      level: comp.level,
      prizes: comp.prizes,
      description: comp.description,
      isVisible: comp.isVisible,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // لغو ویرایش
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      category: '',
      date: '',
      location: '',
      level: 'متوسط',
      prizes: '',
      description: '',
      isVisible: true,
    });
  };

  // تغییر وضعیت نمایش مسابقه در صفحه اصلی
  const handleToggleVisibility = (id) => {
    setCompetitions(prev =>
      prev.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c)
    );
  };

  // فیلتر ثبت‌نامی‌ها بر اساس مسابقه انتخاب‌شده در مودال
  const currentParticipants = selectedCompForDetails 
    ? registrations.filter(r => r.competitionId === selectedCompForDetails.id)
    : [];

  return (
    <div className="admin-salary-container">
      
      {/* هدر صفحه */}
      <div className="admin-page-header">
        <div>
          <h2>مدیریت مسابقات و رویدادها</h2>
          <p className="subtitle">تعریف رویدادها، تنظیم وضعیت نمایش و مشاهده لیست ثبت‌نام‌کنندگان</p>
        </div>
      </div>

     {/* ۱. فرم ثبت / ویرایش مسابقه */}
<div className="salary-form-card competition-form-card">
  <div className="card-header">
    <div className={`header-icon-badge ${isEditing ? 'edit-mode' : ''}`}>
      {isEditing ? <FiEdit size={22} /> : <FiAward size={22} />}
    </div>
    <div>
      <h3 className="form-card-title">{isEditing ? 'ویرایش اطلاعات مسابقه' : 'ثبت مسابقه جدید'}</h3>
      <p className="card-subtitle">
        {isEditing ? 'تغییرات مورد نظر را اعمال کرده و دکمه بروزرسانی را بزنید' : 'مشخصات کامل مسابقه را در دو ستون زیر وارد نمایید'}
      </p>
    </div>
  </div>

  <form onSubmit={handleSubmit} className="competition-grid-form">
    
    {/* ستون راست / فیلد ۱: عنوان */}
    <div className="form-group">
      <label className="form-label">
        عنوان مسابقه <span className="required-star">*</span>
      </label>
      <div className="input-icon-wrapper">
        <FiAward className="field-icon" />
        <input
          type="text"
          name="title"
          className="form-control"
          placeholder="مثال: مسابقه الگوریتم و هوش مصنوعی"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>

    {/* ستون چپ / فیلد ۲: زمینه تخصص */}
    <div className="form-group">
      <label className="form-label">
        زمینه تخصص <span className="required-star">*</span>
      </label>
      <div className="input-icon-wrapper">
        <FiLayers className="field-icon" />
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="مثال: برنامه‌نویسی وب / پایتون / React"
          value={formData.category}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>

    {/* ستون راست / فیلد ۳: تاریخ */}
    <div className="form-group">
      <label className="form-label">
        تاریخ برگزاری <span className="required-star">*</span>
      </label>
      <div className="input-icon-wrapper">
        <FiCalendar className="field-icon" />
        <input
          type="text"
          name="date"
          className="form-control"
          placeholder="مثال: 1403/09/15"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>

    {/* ستون چپ / فیلد ۴: محل برگزاری */}
    <div className="form-group">
      <label className="form-label">محل برگزاری</label>
      <div className="input-icon-wrapper">
        <FiMapPin className="field-icon" />
        <input
          type="text"
          name="location"
          className="form-control"
          placeholder="مثال: حضوری (سالن اصلی آموزشگاه) یا آنلاین"
          value={formData.location}
          onChange={handleInputChange}
        />
      </div>
    </div>

    {/* ستون راست / فیلد ۵: سطح */}
    <div className="form-group">
      <label className="form-label">سطح مسابقه</label>
      <div className="input-icon-wrapper">
        <FiBarChart2 className="field-icon" />
        <select 
          name="level" 
          className="form-control custom-select" 
          value={formData.level} 
          onChange={handleInputChange}
        >
          <option value="مبتدی">مبتدی (مفاهیم پایه)</option>
          <option value="متوسط">متوسط (پروژه‌محور)</option>
          <option value="پیشرفته">پیشرفته (چالش تخصصی)</option>
          <option value="عمومی">عمومی / تمام سطوح</option>
        </select>
      </div>
    </div>

    {/* ستون چپ / فیلد ۶: جوایز */}
    <div className="form-group">
      <label className="form-label">جوایز و هدایا</label>
      <div className="input-icon-wrapper">
        <FiGift className="field-icon" />
        <input
          type="text"
          name="prizes"
          className="form-control"
          placeholder="مثال: ۵ میلیون تومان نقدی + لوح تقدیر"
          value={formData.prizes}
          onChange={handleInputChange}
        />
      </div>
    </div>

    {/* فیلد تمام عرض (۲ ستونه): توضیحات */}
    <div className="form-group full-width">
      <label className="form-label">توضیحات و قوانین مسابقه</label>
      <div className="input-icon-wrapper textarea-wrapper">
        <FiFileText className="field-icon textarea-icon" />
        <textarea
          name="description"
          rows={3}
          className="form-control form-textarea"
          placeholder="توضیحات کوتاه درباره شرایط شرکت، زمان‌بندی و ابزارهای مجاز در مسابقه..."
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
    </div>

    {/* دکمه‌های عملیات (تمام عرض) */}
    <div className="form-actions full-width">
      <button type="submit" className={`submit-btn ${isEditing ? 'edit-btn' : ''}`}>
        {isEditing ? <FiCheck size={18} /> : <FiPlus size={18} />}
        <span>{isEditing ? 'ذخیره تغییرات مسابقه' : 'ثبت و انتشار مسابقه'}</span>
      </button>

      {isEditing && (
        <button type="button" className="admin-btn-secondary" onClick={handleCancelEdit}>
          <FiX size={17} />
          <span>انصراف از ویرایش</span>
        </button>
      )}
    </div>

  </form>
</div>


    {/* ۲. جدول مدرن نمایش مسابقات */}
<div className="salary-table-card competition-table-card" style={{ marginTop: '30px' }}>
  <div className="table-header competition-table-header">
    <div className="table-title-area">
      <div className="table-header-badge">
        <FiAward size={20} />
      </div>
      <div>
        <div className="title-with-pill">
          <h3>لیست مسابقات و رویدادها</h3>
          <span className="count-pill">{competitions.length} رویداد</span>
        </div>
      </div>
    </div>
  </div>

  <div className="table-responsive">
    <table className="admin-table competition-table">
      <thead>
        <tr>
          <th style={{ width: '50px', textAlign: 'center' }}>#</th>
          <th>عنوان و زمینه مسابقه</th>
          <th>تاریخ برگزاری</th>
          <th>محل برگزاری</th>
          <th style={{ textAlign: 'center' }}>سطح رویداد</th>
          <th style={{ textAlign: 'center' }}>شرکت‌کنندگان</th>
          <th style={{ textAlign: 'center' }}>وضعیت در سایت</th>
          <th style={{ textAlign: 'center', width: '170px' }}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {competitions.length > 0 ? (
          competitions.map((comp, index) => {
            const regCount = registrations.filter(r => r.competitionId === comp.id).length;
            return (
              <tr key={comp.id} className="competition-row">
                {/* شماره */}
                <td style={{ textAlign: 'center', color: '#94a3b8', fontWeight: '600' }}>
                  {index + 1}
                </td>

                {/* عنوان و دسته */}
                <td>
                  <div className="comp-info-cell">
                    <strong className="comp-title">{comp.title}</strong>
                    <span className="comp-category-tag">
                      <FiLayers size={12} />
                      {comp.category}
                    </span>
                  </div>
                </td>

                {/* تاریخ */}
                <td>
                  <div className="meta-info-item">
                    <FiCalendar size={14} className="meta-icon" />
                    <span className="en-font">{comp.date}</span>
                  </div>
                </td>

                {/* محل برگزاری */}
                <td>
                  <div className="meta-info-item">
                    <FiMapPin size={14} className="meta-icon" />
                    <span>{comp.location || 'مشخص نشده'}</span>
                  </div>
                </td>

                {/* سطح مسابقه */}
                <td style={{ textAlign: 'center' }}>
                  <span className={`comp-level-badge ${
                    comp.level === 'پیشرفته' ? 'level-advanced' : 
                    comp.level === 'متوسط' ? 'level-intermediate' : 'level-beginner'
                  }`}>
                    {comp.level}
                  </span>
                </td>

                {/* تعداد ثبت‌نام */}
                <td style={{ textAlign: 'center' }}>
                  <span className={`reg-count-chip ${regCount > 0 ? 'has-reg' : 'no-reg'}`}>
                    <FiUsers size={13} />
                    <span>{regCount} </span>
                  </span>
                </td>

                {/* وضعیت انتشار در سایت همراه با Switch و Label */}
                <td style={{ textAlign: 'center' }}>
                  <div className="visibility-switch-wrapper">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={comp.isVisible}
                        onChange={() => handleToggleVisibility(comp.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className={`status-label ${comp.isVisible ? 'status-active' : 'status-inactive'}`}>
                      {comp.isVisible ? 'منتشر شده' : 'مخفی'}
                    </span>
                  </div>
                </td>

                {/* دکمه‌های عملیات */}
                <td style={{ textAlign: 'center' }}>
                  <div className="action-buttons-group">
                    <button
                      className="btn-action-view"
                      title="مشاهده لیست شرکت‌کنندگان"
                      onClick={() => setSelectedCompForDetails(comp)}
                    >
                      <FiEye size={15} />
                      <span>جزئیات </span>
                    </button>

                    <button
                      className="btn-action-edit"
                      title="ویرایش مسابقه"
                      onClick={() => handleStartEdit(comp)}
                    >
                      <FiEdit size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8} className="empty-table-state">
              <div className="empty-state-content">
                <FiAward size={36} />
                <p>در حال حاضر هیچ مسابقه‌ای ثبت نشده است.</p>
                <span>می‌توانید با استفاده از فرم بالا اولین مسابقه را ثبت کنید.</span>
              </div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>


      {/* ۳. مودال جزئیات و لیست ثبت‌نامی‌های مسابقه */}
      {selectedCompForDetails && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedCompForDetails(null)}>
          <div className="admin-modal-card large-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="admin-modal-header">
              <div className="modal-title-wrapper">
                <div className="modal-icon-badge">
                  <FiUsers size={22} />
                </div>
                <div>
                  <h3>لیست افراد ثبت‌نام‌شده</h3>
                  <p className="modal-subtitle">مسابقه: {selectedCompForDetails.title}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedCompForDetails(null)}>
                <FiX size={20} />
              </button>
            </div>

            {/* بدنه مودال */}
            <div className="modal-body-content">
              {currentParticipants.length > 0 ? (
                <div className="table-responsive">
                  <table className="admin-table mini-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>نام و نام خانوادگی</th>
                        <th>شماره تماس</th>
                        <th>کد ملی</th>
                        <th>ایمیل</th>
                        <th>مهارت‌ها</th>
                        <th>انگیزه از ثبت‌نام</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentParticipants.map((user, idx) => (
                        <tr key={user.id}>
                          <td>{idx + 1}</td>
                          <td><strong>{user.fullName}</strong></td>
                          <td><span className="en-font">{user.phone}</span></td>
                          <td><span className="en-font">{user.nationalCode}</span></td>
                          <td><span className="en-font">{user.email}</span></td>
                          <td><span className="badge badge-info">{user.skills}</span></td>
                          <td style={{ maxWidth: '280px', lineHeight: '1.4', fontSize: '0.85rem' }}>
                            {user.motivation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-answers-notice">
                  <FiAlertCircle size={32} />
                  <p>هنوز کسی برای این مسابقه ثبت‌نام نکرده است.</p>
                </div>
              )}
            </div>

            {/* فوتر مودال */}
            <div className="admin-modal-footer">
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
                مجموع نفرات ثبت‌نامی: <strong>{currentParticipants.length} نفر</strong>
              </span>
              <button className="admin-btn-secondary" onClick={() => setSelectedCompForDetails(null)}>
                بستن پنجره
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCompetitionManagement;
