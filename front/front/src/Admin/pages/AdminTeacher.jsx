import { useMemo, useState } from "react";
import "../style/AdminGlobal.css";
import "../style/Adminstudents.css";



import {
  FiUsers,
  FiUserCheck,
  FiClock,
  FiBookOpen,
  FiSearch,
  FiUserPlus,
  FiPlus,
  FiDownload,
  FiRotateCcw,
  FiInfo,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiAward,
  FiBriefcase,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiX,
  FiCheck,
  FiStar,
  FiDollarSign,
  FiUser, FiMail, FiFileText,FiEdit2,FiAlertCircle
} from 'react-icons/fi';
import { BiEdit } from 'react-icons/bi';




// مقادیر اولیه برای فرم افزودن کادر جدید (مشابه هنرجویان)
const INITIAL_NEW_STAFF = {
  fullName: "",
  fatherName: "",
  nationalCode: "",
  birthDate: "",
  phone: "",
  emergencyPhone: "",
  education: "کارشناسی",
  jobTitle: "مدرس",
  specialties: "",
  cardNumber: "",
  shebaNumber: "",
  contractType: "تمام وقت",
  address: "",
  description: "",
  photo: "",
  joinDate: new Date().toLocaleDateString("fa-IR-u-nu-latn"),
  isActive: true,
  rating: 90
};





// داده‌های اولیه نمونه
const INITIAL_STAFF = [
  {
    id: 1,
    fullName: 'مهندس حمید پورفریدونی',
    fatherName: 'علی',
    nationalCode: '3071234567',
    phone: '09050958715',
    address: 'سیرجان، بلوار سید جمال، جنب پاساژ صدف',
    education: 'کارشناسی ارشد هوش مصنوعی',
    specialties: ['React', 'Python', 'Machine Learning', 'Django'],
    jobTitle: 'مدرس ارشد و مدیر آموزشی',
    birthDate: '1368/04/15',
    cardNumber: '6037-9975-1234-5678',
    shebaNumber: 'IR120170000000123456789012',
    photo: '',
    joinDate: '1401/07/01',
    isActive: true,
    rating: 98,
    activeClassesCount: 4,
    pendingSettlement: 0,
    contractType: 'تمام وقت'
  },
  {
    id: 2,
    fullName: 'دکتر سارا احمدی',
    fatherName: 'محمدرضا',
    nationalCode: '2998765432',
    phone: '09132456789',
    address: 'سیرجان، خیابان امام، کوچه نسترن ۱۲',
    education: 'دکتری مهندسی نرم‌افزار',
    specialties: ['C#', 'ASP.NET Core', 'SQL Server'],
    jobTitle: 'مدرس بک‌اند',
    birthDate: '1371/09/20',
    cardNumber: '5892-1012-9876-5432',
    shebaNumber: 'IR980180000000987654321098',
    photo: '',
    joinDate: '1402/02/10',
    isActive: true,
    rating: 92,
    activeClassesCount: 3,
    pendingSettlement: 4500000,
    contractType: 'پاره وقت'
  },
  {
    id: 3,
    fullName: 'مهندس رضا صادقی',
    fatherName: 'حسین',
    nationalCode: '3064561234',
    phone: '09351112233',
    address: 'سیرجان، میدان آزادی، مجتمع سپهر',
    education: 'کارشناسی علوم کامپیوتر',
    specialties: ['HTML/CSS', 'Bootstrap', 'JavaScript', 'UI/UX'],
    jobTitle: 'مدرس فرانت‌اند',
    birthDate: '1375/11/05',
    cardNumber: '5022-2910-4455-6677',
    shebaNumber: 'IR450560000000445566778899',
    photo: '',
    joinDate: '1402/08/15',
    isActive: false,
    rating: 84,
    activeClassesCount: 0,
    pendingSettlement: 1200000,
    contractType: 'پروژه‌ای'
  }
];

const INITIAL_FORM = {
  fullName: '',
  fatherName: '',
  nationalCode: '',
  phone: '',
  address: '',
  education: '',
  specialties: '',
  jobTitle: 'مدرس',
  birthDate: '',
  cardNumber: '',
  shebaNumber: '',
  photo: '',
  joinDate: '',
  contractType: 'تمام وقت',
  isActive: true,
  rating: 90
};

export default function AdminStaff() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');

  // صفحه‌بندی (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;


// داخل کامپوننت AdminTeacher:

const [newStaff, setNewStaff] = useState(INITIAL_NEW_STAFF);






// ۱. مدیریت تغییر فیلدهای ورودی متنی و انتخابی
const handleNewStaffChange = (e) => {
  const { name, value } = e.target;
  setNewStaff((prev) => ({
    ...prev,
    [name]: value
  }));
};

// ۲. مدیریت آپلود تصویر پرسنلی
const handleNewStaffPhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const photoUrl = URL.createObjectURL(file);
    setNewStaff((prev) => ({
      ...prev,
      photo: photoUrl
    }));
  }
};

// ۳. حذف تصویر انتخاب‌شده
const handleRemoveNewStaffPhoto = () => {
  setNewStaff((prev) => ({
    ...prev,
    photo: ""
  }));
};

// ۴. ثبت و ذخیره کادر جدید (مشابه handleCreateStudent)
const handleCreateStaff = (e) => {
  e.preventDefault();

  // اعتبارسنجی فیلدهای ضروری
  if (!newStaff.fullName.trim() || !newStaff.nationalCode.trim() || !newStaff.phone.trim()) {
    alert("لطفاً فیلدهای ستاره‌دار (نام و نام خانوادگی، کد ملی و شماره موبایل) را تکمیل فرمایید.");
    return;
  }

  // تبدیل تخصص‌ها به آرایه (در صورت وارد شدن به صورت کاما یا رشته)
  const formattedSpecialties = typeof newStaff.specialties === "string"
    ? newStaff.specialties.split(/[,،-]/).map(s => s.trim()).filter(Boolean)
    : (newStaff.specialties || ["عمومی"]);

  const staffRecord = {
    ...newStaff,
    id: Date.now(),
    specialties: formattedSpecialties.length > 0 ? formattedSpecialties : ["مدرس"],
    activeClasses: 0,
    pendingSettlement: 0,
    courses: []
  };

  // اضافه کردن به ابتدای لیست
  setStaffList((prev) => [staffRecord, ...prev]);

  // بستن مودال و ریست کردن فرم
  setIsAddModalOpen(false);
  setNewStaff(INITIAL_NEW_STAFF);
  alert("عضو جدید کادر آموزشی با موفقیت ثبت شد.");
};









  // وضعیت‌های مودال‌ها
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const [activeStaff, setActiveStaff] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [photoPreview, setPhotoPreview] = useState('');



// ۱. استیت باز شدن مودال عملیات دسته‌جمعی
const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

// ۲. تابع مدیریت عملیات دسته‌جمعی (حذف یا غیرفعال‌سازی اساتید انتخاب‌شده)
const handleConfirmBulkAction = () => {
  setStaffList((prev) =>
    prev.map((staff) =>
      selectedIds.includes(staff.id) ? { ...staff, isActive: false } : staff
    )
  );
  setSelectedIds([]);
  setIsBulkDeleteModalOpen(false);
};



  // استخراج تمام تخصص‌های منحصر‌به‌فرد برای فیلتر
  const allSpecialties = useMemo(() => {
    const list = new Set();
    staffList.forEach((s) => {
      if (Array.isArray(s.specialties)) {
        s.specialties.forEach((spec) => list.add(spec));
      }
    });
    return Array.from(list);
  }, [staffList]);

  // کارت‌های آمار و گزارش تحلیلی
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.isActive).length;
    const pendingSettlements = staffList.filter((s) => (s.pendingSettlement || 0) > 0).length;
    const activeClasses = staffList.reduce((acc, curr) => acc + (curr.activeClassesCount || 0), 0);

    return {
      total,
      active,
      pendingSettlements,
      activeClasses
    };
  }, [staffList]);

  // فیلتر کردن لیست
  const filteredStaff = useMemo(() => {
    return staffList.filter((item) => {
      const matchSearch =
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nationalCode.includes(searchQuery) ||
        item.phone.includes(searchQuery) ||
        item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'ACTIVE'
          ? item.isActive
          : !item.isActive;

      const matchSpecialty =
        specialtyFilter === 'ALL'
          ? true
          : Array.isArray(item.specialties) && item.specialties.includes(specialtyFilter);

      return matchSearch && matchStatus && matchSpecialty;
    });
  }, [staffList, searchQuery, statusFilter, specialtyFilter]);

  // منطق صفحه‌بندی
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1;
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStaff.slice(start, start + itemsPerPage);
  }, [filteredStaff, currentPage]);

  // مدیریت چک‌باکس‌ها
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
  if (e.target.checked) {
    setSelectedIds(filteredStaff.map((item) => item.id));
  } else {
    setSelectedIds([]);
  }
};


  // ریست فیلترها
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSpecialtyFilter('ALL');
    setCurrentPage(1);
  };

  // هندلر آپلود عکس
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setFormData((prev) => ({ ...prev, photo: url }));
    }
  };

  // باز کردن مودال ویرایش
  const handleOpenEdit = (staff) => {
    setActiveStaff(staff);
    setFormData({
      ...staff,
      specialties: Array.isArray(staff.specialties) ? staff.specialties.join('، ') : staff.specialties
    });
    setPhotoPreview(staff.photo || '');
    setIsEditModalOpen(true);
  };

  // ذخیره فرم افزودن / ویرایش
  const handleSaveForm = (e) => {
    e.preventDefault();
    const specsArray = typeof formData.specialties === 'string'
      ? formData.specialties.split(/[,،]/).map((s) => s.trim()).filter(Boolean)
      : formData.specialties;

    if (isEditModalOpen && activeStaff) {
      setStaffList((prev) =>
        prev.map((item) =>
          item.id === activeStaff.id
            ? { ...formData, id: activeStaff.id, specialties: specsArray, photo: photoPreview }
            : item
        )
      );
      setIsEditModalOpen(false);
    } else {
      const newStaff = {
        ...formData,
        id: Date.now(),
        specialties: specsArray,
        photo: photoPreview,
        activeClassesCount: 0,
        pendingSettlement: 0,
        rating: 100,
        joinDate: formData.joinDate || '1403/06/01'
      };
      setStaffList((prev) => [newStaff, ...prev]);
      setIsAddModalOpen(false);
    }
    setFormData(INITIAL_FORM);
    setPhotoPreview('');
  };

  // تغییر وضعیت فعال / غیرفعال
  const handleToggleActiveStatus = () => {
    if (!activeStaff) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === activeStaff.id ? { ...s, isActive: !s.isActive } : s))
    );
    setIsStatusModalOpen(false);
    setActiveStaff(null);
  };

  // شبیه‌سازی خروجی اکسل
  const handleExportExcel = () => {
    alert(`خروجی اکسل از ${filteredStaff.length} ردیف کادر و اساتید با موفقیت آماده شد.`);
  };

  return (
    <div className="admin-page-container">
      {/* ۱. هدر صفحه */}
      <header className="admin-page-header">
  <div className="admin-page-header-icon">
    <FiUsers size={26} />
  </div>
  <div className="admin-page-header-text">
    <h1 className="admin-page-title">مدیریت کادر و اساتید آموزشگاه</h1>
    <p className="admin-page-subtitle">
      مدیریت مشخصات پرسنلی، قراردادها، سوابق آموزشی و وضعیت مالی اساتید و کارکنان
    </p>
  </div>
  <div className="admin-page-header-actions">
    


<button
    type="button"
    className="admin-btn-primary admin-add-student-btn"
    onClick={() => {
      setFormData(INITIAL_FORM);
        setPhotoPreview('');
      setIsAddModalOpen(true)}}
  >
    <FiUserPlus size={21} />
    <span>افزودن کادر</span>
  </button>




  </div>
</header>


           {/* ۲. کارت‌های آماری تحلیلی */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiUsers size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل کادر و اساتید</span>
            <span className="stat-card-value">{stats.total} نفر</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۸٪ نسبت به ماه قبل
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiUserCheck size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">اساتید و کادر فعال</span>
            <span className="stat-card-value">{stats.active} نفر</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۴٪ نسبت به ماه قبل
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <FiClock size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">تسویه‌های معوقه</span>
            <span className="stat-card-value">{stats.pendingSettlements} مورد</span>
            <span className="stat-trend-badge negative">
              <FiTrendingDown size={12} /> ۲٪ کاهش بدهی
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiBookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کلاس‌های فعال جاری</span>
            <span className="stat-card-value">{stats.activeClasses} کلاس</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> ۱۲٪ افزایش ظرفیت
            </span>
          </div>
        </div>
      </div>

  



      {/* ۴. جدول لیست کادر (ریسپانسیو: موبایل، تبلت و دسکتاپ) */}
      <div className="admin-table-container" >

    {/* ۳. نوار جستجو، فیلترها و عملیات */}
      <div className="admin-filters-bar"  style={{ flexWrap: 'wrap', gap: '12px' }}>
  {/* باکس جستجو */}
  <div className="admin-search-box"  style={{ flex: '1 1 260px' }}>
    <FiSearch className="admin-search-icon" />
    <input
      type="text"
      className="admin-search-input"
      placeholder="جستجو بر اساس نام، کدملی، شماره تماس یا تخصص..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
      }}
    />
    {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  <FiX size={16} />
                </button>
              )}
  </div>

  {/* فیلتر وضعیت */}
  <select
    className="admin-filter-select"
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="ALL">همه وضعیت‌ها</option>
    <option value="ACTIVE">کادر فعال</option>
    <option value="INACTIVE">غیرفعال / پایان همکاری</option>
  </select>

  {/* فیلتر تخصص */}
  <select
    className="admin-filter-select"
    value={specialtyFilter}
    onChange={(e) => {
      setSpecialtyFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="ALL">همه تخصص‌ها</option>
    {allSpecialties.map((spec) => (
      <option key={spec} value={spec}>
        {spec}
      </option>
    ))}
  </select>

  {/* بخش اکشن‌های فیلتر: ریست و خروجی اکسل */}
  <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end', marginTop: '4px' }}>
    <button
      type="button"
      className="btn-action-base reset-filters-btn-full"
      onClick={handleResetFilters}
      title="بازنشانی فیلترها"
    >
      <FiRotateCcw className="reset-icon" />
          <span>بازنشانی فیلترها</span>
    </button>

    <button
      type="button"
      className="btn-action-base btn-export-excel"
      onClick={handleExportExcel}
      title="دریافت خروجی اکسل"
    >
      <FiDownload />
      <span>خروجی اکسل</span>
    </button>
  </div>
</div>


      {/* ۴. نوار کنترل بالای جدول (انتخاب دسته‌جمعی اساتید) */}
      <div className="table-toolbar-bar">
        <div className="table-toolbar-left">
          
          {selectedIds.length > 0 && (
            <span className="selection-info-tag">{selectedIds.length} استاد انتخاب شده است</span>
          )}
        </div>

        {selectedIds.length > 0 && (
          <button 
            type="button" 
            className="bulk-delete-btn" 
            onClick={() => setIsBulkDeleteModalOpen(true)}
          >
            <FiTrash2 size={15} />
            <span>غیرفعال‌سازی / حذف انتخاب شده‌ها ({selectedIds.length})</span>
          </button>
        )}
      </div>



        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  className="admin-checkbox"
                  onChange={handleSelectAll}
                  checked={paginatedStaff.length > 0 && selectedIds.length === paginatedStaff.length}
                />
              </th>
              <th style={{ width: '60px' }}>عکس</th>
              <th>نام</th>
              <th>عنوان</th>
              <th className="hide-on-mobile-tablet">کد ملی</th>
              <th className="hide-on-mobile-tablet">شماره تماس</th>
              <th className="hide-on-mobile-tablet">وضعیت</th>
              <th className="hide-on-mobile-tablet">ارزیابی عملکرد</th>
              <th className="hide-on-mobile-tablet">شروع همکاری</th>
              <th style={{ width: '130px' }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaff.length > 0 ? (
              paginatedStaff.map((staff) => {
                const isSelected = selectedIds.includes(staff.id);
                return (
                  <tr key={staff.id} style={{ opacity: staff.isActive ? 1 : 0.65 }}>
                    {/* ستون ۱: چک باکس */}
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(staff.id)}
                      />
                    </td>

                    {/* ستون ۲: عکس کادر */}
                    <td>
                      {staff.photo ? (
                        <img src={staff.photo} alt={staff.fullName} className="student-avatar-cell" />
                      ) : (
                        <div className="student-avatar-placeholder">{staff.fullName[0]}</div>
                      )}
                    </td>

                    {/* ستون ۳: نام و عنوان شغلی */}
                    <td className="font-medium text-right">
                      <div style={{ fontWeight: 600 }}>{staff.fullName}</div>
                    </td>
                    {/* ستون ۳: نام و عنوان شغلی */}
                    <td className="font-medium text-right">
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{staff.jobTitle}</div>
                    </td>

                    {/* ستون ۴: کد ملی (مخفی در موبایل/تبلت) */}
                    <td className="hide-on-mobile-tablet">{staff.nationalCode}</td>

                    {/* ستون ۵: شماره تماس (مخفی در موبایل/تبلت) */}
                    <td className="hide-on-mobile-tablet" style={{ direction: 'ltr' }}>
                      {staff.phone}
                    </td>

                 

                    {/* ستون ۷: وضعیت فعالیت (مخفی در موبایل/تبلت) */}
                    <td className="hide-on-mobile-tablet">
                      {staff.isActive ? (
                        <span className="admin-badge admin-badge-success">فعال</span>
                      ) : (
                        <span className="admin-badge admin-badge-danger">غیرفعال</span>
                      )}
                    </td>

                    {/* ستون ۸: ارزیابی عملکرد (مخفی در موبایل/تبلت) */}
                    <td className="hide-on-mobile-tablet">
                      <div className="progress-bar-wrapper">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${staff.rating}%`,
                              backgroundColor:
                                staff.rating >= 90 ? '#10b981' : staff.rating >= 75 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span className="progress-percent-label font-mono">{staff.rating}%</span>
                      </div>
                    </td>

                    {/* ستون ۹: تاریخ شروع همکاری (مخفی در موبایل/تبلت) */}
                    <td className="hide-on-mobile-tablet font-mono">{staff.joinDate}</td>

                    {/* ستون ۱۰: عملیات */}
                    <td>
                      <div className="admin-actions-group" style={{ justifyContent: 'center' }}>
                        <button
                          className="admin-action-btn btn-details"
                          title="مشاهده پرونده کامل"
                          onClick={() => {
                            setActiveStaff(staff);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <FiInfo size={16} />
                        </button>
                        <button
                          className="admin-action-btn btn-password"
                          style={{ color: '#d97706', background: '#fef3c7' }}
                          title="ویرایش مشخصات"
                          onClick={() => handleOpenEdit(staff)}
                        >
                          <BiEdit size={16} />
                        </button>
                        {/* <button
                          className="admin-action-btn"
                          style={{
                            color: staff.isActive ? '#ef4444' : '#10b981',
                            background: staff.isActive ? '#fef2f2' : '#ecfdf5'
                          }}
                          title={staff.isActive ? 'غیرفعال‌سازی کادر' : 'فعال‌سازی مجدد'}
                          onClick={() => {
                            setActiveStaff(staff);
                            setIsStatusModalOpen(true);
                          }}
                        >
                          {staff.isActive ? <FiTrash2 size={15} /> : <FiCheckCircle size={15} />}
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="10" className="admin-table-empty">
                  <FiUsers size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p>هیچ عضوی از کادر با مشخصات وارد شده یافت نشد.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ۵. شماره‌گذاری صفحات (Pagination) */}
     {/*  <div className="admin-pagination-container">
        <span className="pagination-info font-mono">
          نمایش {(currentPage - 1) * itemsPerPage + 1} تا{' '}
          {Math.min(currentPage * itemsPerPage, filteredStaff.length)} از {filteredStaff.length} نفر
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <FiChevronRight size={18} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={`pagination-page-number ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <FiChevronLeft size={18} />
          </button>
        </div>
      </div> */}

        {/* ========================================================
          مودال افزودن کادر جدید (مطابق ساختار هنرجویان)
          ======================================================== */}
          {/* ========================================================
          مودال افزودن کادر جدید (کاملاً همسان با ساختار هنرجویان)
          ======================================================== */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="admin-modal-header">
              <div className="admin-modal-header-title">
                <div className="admin-modal-header-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <FiUserPlus size={20} />
                </div>
                <div>
                  <h3 className="admin-modal-title">افزودن عضو جدید کادر آموزشی</h3>
                  <p className="admin-modal-subtitle">اطلاعات هویتی، تخصصی و شغلی مدرس یا کادر جدید را وارد کنید</p>
                </div>
              </div>
              <button 
                type="button"
                className="admin-modal-close-btn" 
                onClick={() => setIsAddModalOpen(false)}
                title="بستن"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* فرم بدنه مودال */}
            <form onSubmit={handleCreateStaff} className="admin-modal-form">
              
              {/* بخش آپلود و پیش‌نمایش تصویر پرسنلی */}
              <div className="admin-avatar-upload-section">
                <div className="admin-avatar-preview-box">
                  {newStaff.photo ? (
                    <img src={newStaff.photo} alt="Preview" className="admin-avatar-preview-img" />
                  ) : (
                    <FiUsers size={24} color="#94a3b8" />
                  )}
                </div>
                <div className="admin-avatar-upload-actions">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label className="admin-btn-secondary admin-avatar-upload-btn">
                      <FiUpload size={14} />
                      بارگذاری تصویر پرسنلی
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleNewStaffPhotoChange} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                    {newStaff.photo && (
                      <button
                        type="button"
                        onClick={handleRemoveNewStaffPhoto}
                        style={{
                          background: '#fee2e2',
                          color: '#ef4444',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        حذف
                      </button>
                    )}
                  </div>
                  <span className="admin-avatar-hint">فرمت‌های JPG، PNG (حداکثر ۲ مگابایت)</span>
                </div>
              </div>

              {/* ردیف اول: نام و نام خانوادگی / نام پدر */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">نام و نام خانوادگی <span className="admin-required-star">*</span></label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    className="admin-form-input"
                    placeholder="مثال: دکتر علی رضایی"
                    value={newStaff.fullName}
                    onChange={handleNewStaffChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">نام پدر</label>
                  <input
                    type="text"
                    name="fatherName"
                    className="admin-form-input"
                    placeholder="مثال: محمد"
                    value={newStaff.fatherName}
                    onChange={handleNewStaffChange}
                  />
                </div>
              </div>

              {/* ردیف دوم: کد ملی / تاریخ تولد */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">کد ملی <span className="admin-required-star">*</span></label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    name="nationalCode"
                    className="admin-form-input"
                    placeholder="مثال: 3060123456"
                    value={newStaff.nationalCode}
                    onChange={handleNewStaffChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">تاریخ تولد</label>
                  <input
                    type="text"
                    name="birthDate"
                    className="admin-form-input"
                    placeholder="مثال: 1368/05/12"
                    value={newStaff.birthDate}
                    onChange={handleNewStaffChange}
                  />
                </div>
              </div>

              {/* ردیف سوم: شماره تماس اصلی / شماره اضطراری یا ثابت */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره موبایل همراه <span className="admin-required-star">*</span></label>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    name="phone"
                    className="admin-form-input"
                    placeholder="مثال: 09131234567"
                    value={newStaff.phone}
                    onChange={handleNewStaffChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">مدرک تحصیلی</label>
                  <select
                    name="education"
                    className="admin-form-input"
                    value={newStaff.education}
                    onChange={handleNewStaffChange}
                  >
                    <option value="دیپلم">دیپلم</option>
                    <option value="کاردانی">کاردانی</option>
                    <option value="کارشناسی">کارشناسی</option>
                    <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                    <option value="دکتری">دکتری</option>
                  </select>
                </div>
              </div>

              {/* ردیف چهارم: عنوان شغلی / مدرک تحصیلی */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">عنوان شغلی / سمت سازمانی</label>
                  <select
                    name="jobTitle"
                    className="admin-form-input"
                    value={newStaff.jobTitle}
                    onChange={handleNewStaffChange}
                  >
                    <option value="مدرس">مدرس</option>
                    <option value="مدیر گروه آموزشی">مدیر گروه آموزشی</option>
                    <option value="منتور و دستیار آموزشی">منتور و دستیار آموزشی</option>
                    <option value="کادر اداری">کادر اداری</option>
                  </select>
                </div>
              <div className="admin-form-group">
                  <label className="admin-form-label">تخصص‌ها و حوزه‌های تدریس</label>
                  <input
                    type="text"
                    name="specialties"
                    className="admin-form-input"
                    placeholder="مثال: React, Python, UI/UX"
                    value={newStaff.specialties}
                    onChange={handleNewStaffChange}
                  />
                </div>
              </div>

         

              {/* ردیف ششم: شماره کارت بانکی / شماره شبا */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره کارت بانکی (۱۶ رقم)</label>
                  <input
                    type="text"
                    maxLength={16}
                    dir="ltr"
                    name="cardNumber"
                    className="admin-form-input"
                    placeholder="6037-xxxx-xxxx-xxxx"
                    value={newStaff.cardNumber}
                    onChange={handleNewStaffChange}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره شبا (IBAN)</label>
                  <input
                    type="text"
                    maxLength={26}
                    dir="ltr"
                    name="shebaNumber"
                    className="admin-form-input"
                    placeholder="IR..."
                    value={newStaff.shebaNumber}
                    onChange={handleNewStaffChange}
                  />
                </div>
              </div>

              {/* ردیف هفتم: آدرس محل سکونت */}
              <div className="admin-form-group">
                <label className="admin-form-label">آدرس محل سکونت</label>
                <input
                  type="text"
                  name="address"
                  className="admin-form-input"
                  placeholder="مثال: سیرجان، بلوار سید جمال، کوچه..."
                  value={newStaff.address}
                  onChange={handleNewStaffChange}
                />
              </div>

              {/* ردیف هشتم: سوابق و توضیحات تکمیلی */}
              <div className="admin-form-group">
                <label className="admin-form-label">سوابق، افتخارات و توضیحات رزومه</label>
                <textarea
                  rows={2}
                  name="description"
                  className="admin-form-input admin-form-textarea"
                  placeholder="سوابق تدریس، رزومه کاری، مدارک بین‌المللی و نکات پرسنلی..."
                  value={newStaff.description}
                  onChange={handleNewStaffChange}
                />
              </div>

              {/* فوتر دکمه‌های عملیات (طراحی شیک، مدرن و باکیفیت هنرجویان) */}
              <div className="admin-modal-footer-modern">
                <button
                  type="button"
                  className="admin-btn-cancel-modern"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <FiX size={17} />
                  <span>انصراف</span>
                </button>
                <button
                  type="submit"
                  className="admin-btn-submit-modern"
                >
                  <FiCheck size={18} />
                  <span>ثبت و ذخیره کادر</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}



{isDetailsModalOpen && activeStaff && (
  <div
    className="admin-modal-overlay"
    onClick={() => setIsDetailsModalOpen(false)}
  >
    <div
      className="admin-modal-box user-details-modal"
      style={{ maxWidth: "750px" }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* هدر مودال */}
      <div className="modal-header-hero">
        <button
          className="modal-close-btn"
          onClick={() => setIsDetailsModalOpen(false)}
          title="بستن"
        >
          <FiX size={20} />
        </button>

        <div className="user-hero-info">
          {activeStaff.photo ? (
            <img
              src={activeStaff.photo}
              alt={activeStaff.fullName}
              className="user-avatar-circle"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="user-avatar-circle">
              <FiUser size={36} />
            </div>
          )}

          <div className="user-hero-texts">
            <h3 className="user-hero-name">
              {activeStaff.fullName}
            </h3>

            <div className="user-hero-badges">
              <span className="admin-badge admin-badge-primary">
                {activeStaff.jobTitle || "مدرس"}
              </span>

              {activeStaff.isActive ? (
                <span className="user-status-tag status-active">
                  <span className="status-dot"></span>
                  فعال
                </span>
              ) : (
                <span className="user-status-tag status-inactive">
                  <span className="status-dot"></span>
                  غیرفعال
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* بدنه و محتوای جزئیات */}
      <div
        className="modal-body-content"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <div className="details-cards-grid">
          {/* نام پدر */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-indigo">
              <FiUser size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">نام پدر</span>
              <span className="detail-value">
                {activeStaff.fatherName || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* کد ملی */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-purple">
              <FiBriefcase size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">کد ملی</span>
              <span className="detail-value font-mono">
                {activeStaff.nationalCode || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* شماره تماس */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-emerald">
              <FiPhone size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">شماره همراه</span>
              <span
                className="detail-value font-mono"
                style={{
                  direction: "ltr",
                  textAlign: "right",
                }}
              >
                {activeStaff.phone || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* آخرین مدرک تحصیلی */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-cyan">
              <FiAward size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">آخرین مدرک تحصیلی</span>
              <span className="detail-value">
                {activeStaff.education || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* تاریخ تولد */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-teal">
              <FiCalendar size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">تاریخ تولد</span>
              <span className="detail-value font-mono">
                {activeStaff.birthDate ||
                  activeStaff.birth100 ||
                  "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* تاریخ شروع همکاری */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-blue">
              <FiCalendar size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">تاریخ شروع همکاری</span>
              <span className="detail-value font-mono">
                {activeStaff.joinDate || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* نوع قرارداد */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-slate">
              <FiFileText size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">نوع همکاری</span>
              <span className="detail-value">
                {activeStaff.contractType || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* امتیاز استاد */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-amber">
              <FiStar size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">امتیاز ارزیابی</span>
              <span className="detail-value">
                {activeStaff.rating ?? 0} از ۱۰۰
              </span>
            </div>
          </div>

          {/* تعداد کلاس‌های فعال */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-indigo">
              <FiClock size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">کلاس‌های فعال</span>
              <span className="detail-value">
                {activeStaff.activeClassesCount ?? 0} کلاس
              </span>
            </div>
          </div>

          {/* وضعیت تسویه */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-emerald">
              <FiDollarSign size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">مانده تسویه</span>
              <span className="detail-value">
                {activeStaff.pendingSettlement || "۰ تومان"}
              </span>
            </div>
          </div>

          {/* شماره کارت */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-purple">
              <FiCreditCard size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">شماره کارت</span>
              <span
                className="detail-value font-mono"
                style={{
                  direction: "ltr",
                  textAlign: "right",
                }}
              >
                {activeStaff.cardNumber || "ثبت نشده"}
              </span>
            </div>
          </div>

          {/* شماره شبا */}
          <div className="detail-card">
            <div className="detail-icon-wrap icon-blue">
              <FiCreditCard size={18} />
            </div>
            <div className="detail-text-wrap">
              <span className="detail-title">شماره شبا</span>
              <span
                className="detail-value font-mono"
                style={{
                  direction: "ltr",
                  textAlign: "right",
                  wordBreak: "break-all",
                }}
              >
                {activeStaff.shebaNumber || "ثبت نشده"}
              </span>
            </div>
          </div>
        </div>

        {/* بخش تخصص‌ها */}
        <div
          style={{
            marginTop: "16px",
            background: "#f8fafc",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{
              fontSize: "0.9rem",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FiAward size={17} color="#2563eb" />
            تخصص‌ها و حوزه‌های آموزشی:
          </h4>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {Array.isArray(activeStaff.specialties) &&
            activeStaff.specialties.length > 0 ? (
              activeStaff.specialties.map((specialty, index) => (
                <span
                  key={`${specialty}-${index}`}
                  className="admin-badge admin-badge-primary"
                >
                  {specialty}
                </span>
              ))
            ) : (
              <span className="detail-value">ثبت نشده</span>
            )}
          </div>
        </div>

        {/* بخش آدرس */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "0.85rem",
              color: "#334155",
            }}
          >
            <strong>
              <FiMapPin
                size={14}
                style={{
                  verticalAlign: "middle",
                  marginLeft: "4px",
                }}
              />
              آدرس:
            </strong>{" "}
            {activeStaff.address || "ثبت نشده"}
          </div>
        </div>
      </div>

      {/* فوتر مودال */}
      <div
        className="modal-custom-footer"
        style={{ padding: "14px 20px" }}
      >
        <button
          className="admin-btn-secondary"
          onClick={() => setIsDetailsModalOpen(false)}
        >
          بستن پنجره
        </button>
      </div>
    </div>
  </div>
)}



{/* مودال ویرایش اطلاعات کادر / استاد */}
{isEditModalOpen && (
  <div
    className="admin-modal-overlay"
    onClick={() => setIsEditModalOpen(false)}
  >
    <div
      className="admin-modal-box user-details-modal"
      style={{ maxWidth: '750px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* هدر هیرو مودال */}
      <div className="modal-header-hero">
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsEditModalOpen(false)}
          title="بستن"
        >
          <FiX size={20} />
        </button>
        <div className="user-hero-info">
          <div className="user-avatar-circle">
            <FiEdit2 size={28} />
          </div>
          <div className="user-hero-texts">
            <h3 className="user-hero-name">ویرایش مشخصات کادر و استاد</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
              {formData.fullName || 'بدون نام'} {formData.nationalCode ? `(کد ملی: ${formData.nationalCode})` : ''}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveForm}>
        <div
          className="modal-body-content"
          style={{ maxHeight: '68vh', overflowY: 'auto' }}
        >
          {/* بخش آپلود و پیش‌نمایش عکس */}
          <div className="edit-photo-section" style={{ marginBottom: '18px' }}>
            <div
              className="edit-photo-preview"
              onClick={() => document.getElementById('teacher-edit-photo-input').click()}
              style={{ cursor: 'pointer' }}
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="عکس پرسنلی"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 'inherit',
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                  <FiUpload size={22} />
                  <span style={{ fontSize: '0.78rem' }}>انتخاب عکس</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              id="teacher-edit-photo-input"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />

            {photoPreview && (
              <button
                type="button"
                className="admin-btn-secondary"
                style={{ color: '#ef4444', borderColor: '#fca5a5', marginTop: '8px', fontSize: '0.8rem' }}
                onClick={() => {
                  setPhotoPreview('');
                  setFormData((prev) => ({ ...prev, photo: '' }));
                }}
              >
                حذف عکس
              </button>
            )}
          </div>

          {/* فیلدهای فرم در گرید دو ستونه */}
          <div className="modal-form-grid">
            {/* نام و نام خانوادگی */}
            <div className="form-group-item">
              <label>نام و نام‌خانوادگی <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            {/* نام پدر */}
            <div className="form-group-item">
              <label>نام پدر</label>
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>

            {/* کد ملی */}
            <div className="form-group-item">
              <label>کد ملی <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                className="font-mono"
                maxLength={10}
                value={formData.nationalCode || ''}
                onChange={(e) => setFormData({ ...formData, nationalCode: e.target.value })}
                required
              />
            </div>

            {/* شماره همراه */}
            <div className="form-group-item">
              <label>شماره تماس همراه <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                className="font-mono"
                maxLength={11}
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            {/* عنوان شغلی / سمت */}
            <div className="form-group-item">
              <label>عنوان شغلی / سمت</label>
              <input
                type="text"
                value={formData.jobTitle || ''}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="مثلاً مدرس ارشد، پشتیبان و..."
              />
            </div>

            {/* مدرک تحصیلی */}
            <div className="form-group-item">
              <label>آخرین مدرک تحصیلی</label>
              <input
                type="text"
                value={formData.education || ''}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>

            {/* تاریخ تولد */}
            <div className="form-group-item">
              <label>تاریخ تولد</label>
              <input
                type="text"
                className="font-mono"
                placeholder="۱۴۰۰/۰۱/۰۱"
                value={formData.birthDate || ''}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            
            

             {/* تخصص‌ها (تمام عرض) */}
            <div className="form-group-item ">
              <label>تخصص‌ها و حوزه‌های تدریس (با ویرگول یا کاما جدا کنید)</label>
              <input
                type="text"
                placeholder="مثلاً: پایتون، جنگو، هوش مصنوعی"
                value={formData.specialties || ''}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
            </div>

            {/* شماره کارت */}
            <div className="form-group-item">
              <label>شماره کارت بانکی</label>
              <input
                type="text"
                className="font-mono"
                maxLength={19}
                placeholder="۶۰۳۷-xxxx-xxxx-xxxx"
                value={formData.cardNumber || ''}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
            </div>

            {/* شماره شبا */}
            <div className="form-group-item">
              <label>شماره شبا</label>
              <input
                type="text"
                className="font-mono"
                placeholder="IRxxxxxxxxxxxxxxxxxxxx"
                value={formData.shebaNumber || ''}
                onChange={(e) => setFormData({ ...formData, shebaNumber: e.target.value })}
              />
            </div>



             {/* آدرس سکونت (تمام عرض) */}
            <div className="form-group-item modal-form-full">
              <label>آدرس محل سکونت</label>
              <textarea
                rows="2"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              ></textarea>
            </div>


            {/* توضیحات (تمام عرض) */}
            <div className="form-group-item modal-form-full">
              <label>توضیحات)</label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              />
            </div>

           
          </div>
        </div>

        {/* فوتر مودال با دکمه‌های انصراف و ذخیره */}
        <div className="modal-custom-footer" style={{ padding: '14px 20px' }}>
          <button
            type="button"
            className="admin-btn-secondary m-1"
            onClick={() => setIsEditModalOpen(false)}
          >
            انصراف
          </button>
          <button
            type="submit"
            className="admin-btn-primary save-password-btn m-1"
          >
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  </div>
)}







      {/* مودال تأیید عملیات گروهی */}
      {isBulkDeleteModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <div className="admin-modal-header">
              <h3>تأیید عملیات گروهی</h3>
              <button 
                type="button" 
                className="admin-modal-close-btn" 
                onClick={() => setIsBulkDeleteModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ lineHeight: '1.8', color: '#475569' }}>
                آیا از غیرفعال‌سازی / حذف <strong>{selectedIds.length}</strong> استاد انتخاب‌شده اطمینان دارید؟
              </p>
            </div>
            <div className="admin-modal-footer">
              <button 
                type="button" 
                className="admin-btn-secondary" 
                onClick={() => setIsBulkDeleteModalOpen(false)}
              >
                انصراف
              </button>
              <button 
                type="button" 
                className="admin-btn-danger" 
                onClick={handleConfirmBulkAction}
              >
                تأیید و اعمال
              </button>
            </div>
          </div>
        </div>
      )}

















      {/* ۸. مودال تایید تغییر وضعیت (فعال / غیرفعال) */}
     {/* مودال تایید تغییر وضعیت / غیرفعال‌سازی تک‌کاربره کادر و اساتید */}
{isStatusModalOpen && activeStaff && (
  <div
    className="admin-modal-overlay"
    onClick={() => setIsStatusModalOpen(false)}
  >
    <div
      className="admin-modal-box"
      style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* هدر هیرو با پس‌زمینه اخطار */}
      <div
        className="modal-header-hero"
        style={{
          background: activeStaff.isActive
            ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        }}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setIsStatusModalOpen(false)}
          title="بستن"
        >
          <FiX size={20} />
        </button>
        <div className="user-hero-info" style={{ justifyContent: 'center' }}>
          <FiAlertCircle size={36} color="#fff" />
        </div>
      </div>

      {/* محتوای بدنه اخطار */}
      <div className="modal-body-content delete-confirm-box">
        {activeStaff.photo && (
          <img
            src={activeStaff.photo}
            alt={activeStaff.fullName}
            className="delete-avatar-preview"
          />
        )}
        <h4 className="delete-warning-text">
          آیا از {activeStaff.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی'} پرونده همکاری{' '}
          <strong>«{activeStaff.fullName}»</strong> با کد ملی{' '}
          <span className="font-mono">{activeStaff.nationalCode}</span> اطمینان دارید؟
        </h4>

        <div className="delete-note-text">
          توجه: اطلاعات کادر از پایگاه داده به صورت فیزیکی حذف نخواهد شد و صرفاً وضعیت دسترسی آن به حالت «{activeStaff.isActive ? 'غیرفعال' : 'فعال'}» تغییر می‌یابد.
        </div>
      </div>

      {/* دکمه‌های فوتر */}
      <div
        className="modal-custom-footer"
        style={{ justifyContent: 'center', gap: '12px' }}
      >
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => setIsStatusModalOpen(false)}
        >
          انصراف
        </button>
        <button
          type="button"
          className="admin-btn-primary"
          style={{
            background: activeStaff.isActive ? '#ef4444' : '#10b981',
            borderColor: activeStaff.isActive ? '#dc2626' : '#059669',
          }}
          onClick={handleToggleActiveStatus}
        >
          {activeStaff.isActive ? 'بله، غیرفعال شود' : 'بله، فعال شود'}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
