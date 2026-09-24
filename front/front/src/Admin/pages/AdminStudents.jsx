import React, { useState, useMemo } from 'react';




import DatePickerModule from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// برای سازگاری کامل با خروجی‌های مختلف Vite / ESM
const DatePicker = DatePickerModule.default || DatePickerModule;


import '../style/AdminGlobal.css';
import '../style/AdminStudents.css';
import {
  FiUsers, FiUser, FiUserPlus, FiUserCheck, FiUserX,
  FiUpload, FiSearch, FiDownload, FiRotateCcw,
  FiCheckCircle, FiAlertCircle, FiCheck, FiBookOpen,
  FiEye, FiEdit, FiEdit2, FiEdit3, FiTrash2, FiMoreVertical, FiX,
  FiCalendar, FiPhone, FiMail, FiMapPin, FiFileText,
  FiClock, FiAward, FiInfo,
  FiTrendingUp, FiTrendingDown, FiFilter,
  FiCreditCard, FiDollarSign, FiLayers,
  FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown
} from "react-icons/fi";
import { AiFillEdit } from 'react-icons/ai';
import { RiEditCircleFill, RiEditCircleLine, RiFileEditLine, RiImageEditLine } from 'react-icons/ri';
import { BiEdit } from 'react-icons/bi';







// دیتای تستی با تمام فیلدهای مورد نیاز
const INITIAL_STUDENTS = [
  {
    id: 1,
    fullName: 'محمدجواد دهقانی',
    fatherName: 'علیرضا',
    nationalCode: '3060123456',
    birthDate: '1382/05/14',
    phone: '09131234567',
    parentPhone: '09139876543',
    education: 'کارشناسی نرم‌افزار',
    address: 'سیرجان، خیابان شریعتی، کوچه بهار ۴',
    email: 'm.dehghani@example.com',
    avatar: '',
    description: 'علاقه‌مند به فرانت‌اند و ری‌اکت، مستعد برای مسابقات برنامه‌نویسی',
    registerDate: '1403/04/10',
    currentCourse: 'Front-End',
    paymentStatus: 'paid', // paid | partial | unpaid
    progress: 85,
    isActive: true,
    tuitionTotal: '6,500,000 تومان',
    tuitionPaid: '6,500,000 تومان',
    tuitionRemaining: '0 تومان'
  },
  {
    id: 2,
    fullName: 'فاطمه رضایی',
    fatherName: 'حسین',
    nationalCode: '3071239874',
    birthDate: '1384/09/20',
    phone: '09355551234',
    parentPhone: '09133451122',
    education: 'دیپلم ریاضی',
    address: 'سیرجان، بلوار سید جمال، نبش پاساژ صدف',
    email: 'f.rezaei@example.com',
    avatar: '',
    description: 'ثبت‌نام اقساطی دو مرحله‌ای، منظم در حضور و غیاب',
    registerDate: '1403/05/01',
    currentCourse: 'پایتون مقدماتی',
    paymentStatus: 'unpaid',
    progress: 45,
    isActive: true,
    tuitionTotal: '5,000,000 تومان',
    tuitionPaid: '2,500,000 تومان',
    tuitionRemaining: '2,500,000 تومان'
  },
  {
    id: 3,
    fullName: 'امیرحسین کریمی',
    fatherName: 'محمود',
    nationalCode: '3069876541',
    birthDate: '1380/02/11',
    phone: '09130009988',
    parentPhone: '09132223344',
    education: 'کارشناسی فناوری اطلاعات',
    address: 'سیرجان، شهرک گلستان، لاله ۸',
    email: 'amir.karimi@example.com',
    avatar: '',
    description: 'درخواست تخفیف معرف، پروژه پایانی تحویل داده نشده',
    registerDate: '1403/05/15',
    currentCourse: 'بک‌اند پیشرفته ',
    paymentStatus: 'unpaid',
    progress: 20,
    isActive: true,
    tuitionTotal: '7,200,000 تومان',
    tuitionPaid: '0 تومان',
    tuitionRemaining: '7,200,000 تومان'
  },
  {
    id: 4,
    fullName: 'زهرا نادری',
    fatherName: 'قاسم',
    nationalCode: '3067788990',
    birthDate: '1385/11/03',
    phone: '09361112233',
    parentPhone: '09137778899',
    education: 'دانش‌آموز پایه دوازدهم',
    address: 'سیرجان، خیابان امام خمینی، پاساژ کندو',
    email: '',
    avatar: '',
    description: 'شرکت‌کننده دوره‌های فشرده تابستانه',
    registerDate: '1403/06/01',
    currentCourse: 'Bootstrap',
    paymentStatus: 'paid',
    progress: 95,
    isActive: false,
    tuitionTotal: '4,000,000 تومان',
    tuitionPaid: '4,000,000 تومان',
    tuitionRemaining: '0 تومان'
  }
];

export default function AdminStudents() {

  // ۱. باز کردن پنجره تایید حذف نرم
  const triggerSoftDelete = (id, name) => {
    setConfirmModal({
      isOpen: true,
      type: 'delete',
      studentId: id,
      studentName: name
    });
  };

  // ۲. باز کردن پنجره تایید فعال‌سازی مجدد
  const triggerRestore = (id, name) => {
    setConfirmModal({
      isOpen: true,
      type: 'restore',
      studentId: id,
      studentName: name
    });
  };

  // ۳. اجرای قطعی عملیات بعد از تایید کاربر در مودال
  const handleConfirmAction = async () => {
    const { type, studentId, studentName } = confirmModal;
    setConfirmModal({ isOpen: false, type: '', studentId: null, studentName: '' });

    if (type === 'delete') {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/students/${studentId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchStudents();
          setSuccessMessage(`هنرجو «${studentName}» با موفقیت غیرفعال (حذف نرم) شد.`);
          setTimeout(() => setSuccessMessage(''), 2500);
        } else {
          alert('خطا در غیرفعال‌سازی هنرجو');
        }
      } catch (err) {
        console.error(err);
        alert('ارتباط با سرور برقرار نشد.');
      }
    } else if (type === 'restore') {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/students/${studentId}/restore`, {
          method: 'PATCH'
        });
        if (res.ok) {
          fetchStudents();
          setSuccessMessage(`هنرجو «${studentName}» با موفقیت فعال و بازیابی شد.`);
          setTimeout(() => setSuccessMessage(''), 2500);
        } else {
          alert('خطا در بازیابی هنرجو');
        }
      } catch (err) {
        console.error(err);
        alert('ارتباط با سرور برقرار نشد.');
      }
    }
  };


const [editPhotoPreview, setEditPhotoPreview] = useState('');
const [editPhotoFile, setEditPhotoFile] = useState(null);

const handleEditPhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setEditPhotoFile(file);
  setEditPhotoPreview(URL.createObjectURL(file));
};

const handleRemoveEditPhoto = () => {
  setEditPhotoFile(null);
  setEditPhotoPreview('');
  setEditFormData((prev) => ({ ...prev, photo: '', avatar: '' }));
};

    // استیت مربوط به مودال افزودن هنرجو
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    fatherName: '',
    nationalCode: '',
    birthDate: '',
    phone: '',
    parentPhone: '',
    education: '',
    address: '',
    email: '',
    avatar: '',
    description: '',
    registerDate: new Date().toLocaleDateString('fa-IR-u-nu-latn').replace(/\//g, '/'),
    isActive: true,
  });

  // تابع آپلود/پیش‌نمایش تصویر هنرجو
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewStudent(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  // تابع ذخیره هنرجوی جدید
  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.nationalCode || !newStudent.phone) {
      alert('لطفاً فیلدهای ضروری (نام کامل، کد ملی و شماره تماس) را وارد کنید.');
      return;
    }

    const createdRecord = {
      ...newStudent,
      id: Date.now(),
      courses: [], // دوره‌های اولیه خالی
      progress: 0,
      paymentStatus: 'تکمیل',
    };

    setStudents(prev => [createdRecord, ...prev]);
    setIsAddModalOpen(false);

    // ریست کردن فرم
    setNewStudent({
      fullName: '',
      fatherName: '',
      nationalCode: '',
      birthDate: '',
      phone: '',
      parentPhone: '',
      education: '',
      address: '',
      email: '',
      avatar: '',
      description: '',
      registerDate: new Date().toLocaleDateString('fa-IR-u-nu-latn').replace(/\//g, '/'),
      isActive: true,
    });
  };


  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // وضعیت‌های فیلتر
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  // انتخاب‌های چندگانه (Checkbox)
  const [selectedIds, setSelectedIds] = useState([]);

  // مودال‌ها
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // فرم ویرایش
  const [editFormData, setEditFormData] = useState({});

  // ۱. محاسبات کارت‌های آماری
  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.isActive).length;
    const partialOrUnpaid = students.filter((s) => s.paymentStatus !== 'paid').length;
    const activeCoursesCount = new Set(students.map((s) => s.currentCourse)).size;

    return {
      total,
      totalGrowth: '+12%',
      active,
      activeGrowth: '+8%',
      partialOrUnpaid,
      partialGrowth: '-3%',
      activeCoursesCount,
      coursesGrowth: '+2'
    };
  }, [students]);

  // ۲. فیلتر کردن لیست
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // جستجو براساس نام، کد ملی یا موبایل
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        student.fullName.toLowerCase().includes(query) ||
        student.nationalCode.includes(query) ||
        student.phone.includes(query);

      // فیلتر دوره
      const matchCourse = courseFilter === 'all' || student.currentCourse === courseFilter;

      // فیلتر وضعیت پرداخت
      const matchPayment = paymentFilter === 'all' || student.paymentStatus === paymentFilter;

      // فیلتر تاریخ ثبت نام
      const matchDate = !dateFilter || student.registerDate.includes(dateFilter);

      return matchSearch && matchCourse && matchPayment && matchDate;
    });
  }, [students, searchQuery, courseFilter, paymentFilter, dateFilter]);

  // لیست یکتا از دوره‌ها جهت پر کردن Dropdown فیلتر
  const uniqueCourses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.currentCourse)));
  }, [students]);

  // هندلر بازنشانی فیلترها
  const handleResetFilters = () => {
    setSearchQuery('');
    setCourseFilter('all');
    setPaymentFilter('all');
    setDateFilter('');
  };

  // هندلر خروجی اکسل (شبیه‌سازی دانلودی)
  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      ['شناسه,نام کامل,کد ملی,شماره تماس,دوره فعلی,وضعیت پرداخت,پیشرفت,تاریخ ثبت‌نام']
        .concat(
          filteredStudents.map(
            (s) =>
              `${s.id},"${s.fullName}","${s.nationalCode}","${s.phone}","${s.currentCourse}","${s.paymentStatus}","${s.progress}%","${s.registerDate}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // هندلر انتخاب همه
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // هندلر انتخاب تک‌به‌تک
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // باز کردن مودال جزئیات
  const handleOpenDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  // باز کردن مودال ویرایش
  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({ ...student });
    setIsEditModalOpen(true);
  };

  // ذخیره ویرایش
  const handleSaveEdit = (e) => {
  e.preventDefault();
  const updatedPhoto = editPhotoFile
    ? URL.createObjectURL(editPhotoFile)
    : editFormData.photo || editFormData.avatar || '';

  setStudents((prev) =>
    prev.map((s) =>
      s.id === editFormData.id
        ? { ...editFormData, photo: updatedPhoto, avatar: updatedPhoto }
        : s
    )
  );
  setIsEditModalOpen(false);
  setEditPhotoFile(null);
  setEditPhotoPreview('');
};

  // باز کردن مودال حذف تک‌کاربره (غیرفعال‌سازی)
  const handleOpenDelete = (student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };




  const handleEditClick = (student) => {
  setEditFormData({ ...student });
  setEditPhotoPreview(student.photo || student.avatar || '');
  setEditPhotoFile(null);
  setIsEditModalOpen(true);
};



  // تایید حذف تک‌کاربره
  const handleConfirmDelete = () => {
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, isActive: false } : s))
    );
    setIsDeleteModalOpen(false);
  };

  // تایید حذف گروهی (غیرفعال‌سازی)
  const handleConfirmBulkDelete = () => {
    setStudents((prev) =>
      prev.map((s) => (selectedIds.includes(s.id) ? { ...s, isActive: false } : s))
    );
    setSelectedIds([]);
    setIsBulkDeleteModalOpen(false);
  };

  // تابع کمکی برای رنگ و درصد پیشرفت
  const getProgressColor = (percent) => {
    if (percent >= 80) return '#10b981';
    if (percent >= 40) return '#3b82f6';
    return '#f59e0b';
  };

  // بج وضعیت پرداخت
  const renderPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="payment-badge paid">
            <FiCheckCircle size={13} /> تسویه
          </span>
        );
     
      case 'unpaid':
      default:
        return (
          <span className="payment-badge unpaid">
            <FiAlertCircle size={13} />  بدهکار
          </span>
        );
    }
  };

  return (
    <div className="admin-page-container">
      {/* ۱. هدر صفحه */}
            {/* هدر صفحه به همراه دکمه افزودن هنرجو */}
     <div className="admin-page-header">
  <div className="admin-header-right">
    <div
      className="admin-page-header-icon"
      style={{
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        color: '#ffffff'
      }}
    >
      <FiUsers size={24} />
    </div>

    <div>
      <h1 className="admin-page-title">مدیریت هنرجویان</h1>
      <p className="admin-page-subtitle">
        مشاهده، ویرایش اطلاعات، سوابق آموزشی و وضعیت ثبت‌نام هنرجویان
      </p>
    </div>
  </div>

  <button
    type="button"
    className="admin-btn-primary admin-add-student-btn"
    onClick={() => setIsAddModalOpen(true)}
  >
    <FiUserPlus size={21} />
    <span>افزودن هنرجو</span>
  </button>
</div>





      {/* ۲. کارت‌های آماری (۴ عدد با رشد و آیکون اختصاصی) */}
      <div className="admin-stats-grid">
        {/* کل هنرجویان */}
        <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiUsers size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل هنرجویان</span>
            <span className="stat-card-value">{stats.total} نفر </span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> {stats.totalGrowth} نسبت به ماه قبل
            </span>
          </div>
        </div>

        {/* هنرجویان فعال */}
        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiUserCheck size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">هنرجویان فعال</span>
            <span className="stat-card-value">{stats.active} نفر</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> {stats.activeGrowth} نسبت به ماه قبل
            </span>
          </div>
        </div>

        {/* پرداخت‌های ناقص */}
        <div className="admin-stat-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <FiCreditCard size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">پرداخت‌های ناقص</span>
            <span className="stat-card-value">{stats.partialOrUnpaid} مورد</span>
            <span className="stat-trend-badge negative">
              <FiTrendingDown size={12} /> {stats.partialGrowth} پیگیری شهریه
            </span>
          </div>
        </div>

        {/* دوره‌های فعال */}
        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiBookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">دوره‌های در حال برگزاری</span>
            <span className="stat-card-value">{stats.activeCoursesCount} دوره</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> {stats.coursesGrowth} دوره جدید
            </span>
          </div>
        </div>
      </div>

      



      {/* ۵. جدول لیست هنرجویان */}
      <div className="admin-table-container">







{/* ۳. نوار فیلتر و جستجو */}
      <div className="admin-filters-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
        {/* فیلد جستجو */}
        <div className="admin-search-box" style={{ flex: '1 1 260px' }}>
          <FiSearch className="admin-search-icon" />
          <input
            type="text"
            className="admin-search-input"
            placeholder="جستجو بر اساس نام، کدملی یا شماره همراه..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* فیلتر دوره */}
        <select
          className="admin-filter-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="all">همه دوره‌ها</option>
          {uniqueCourses.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* فیلتر وضعیت پرداخت */}
        <select
          className="admin-filter-select"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">وضعیت پرداخت (همه)</option>
          <option value="paid">تسویه کامل</option>
          <option value="unpaid">بدهکار</option>
        </select>

       {/* فیلتر تاریخ ثبت‌نام */}
       {/* فیلتر تاریخ ثبت‌نام با تقویم شمسی */}
{/* <div className="shamsi-datepicker-wrapper">
  <DatePicker
    calendar={persian}
    locale={persian_fa}
    calendarPosition="bottom-right"
    format="YYYY/MM/DD"
    value={dateFilter}
    onChange={(dateObject) => {
      // اگر کاربر تاریخ را انتخاب یا پاک کرد، رشته تاریخ فارسی ثبت شود
      setDateFilter(dateObject ? dateObject.format("YYYY/MM/DD") : "");
    }}
    placeholder="تاریخ ثبت‌نام (مثال: 1403/05/10)"
    inputClass="admin-filter-select shamsi-custom-input"
    containerClassName="w-100"
  />
</div>  */}


        {/* دکمه‌های بازنشانی و اکسل */}
<div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end', marginTop: '4px' }}>
  <button
    type="button"
    className="btn-action-base reset-filters-btn-full"
    onClick={handleResetFilters}
    title="بازنشانی تمام فیلترها و نمایش لیست کامل"
  >
    <FiRotateCcw className="reset-icon" />
    <span>بازنشانی فیلترها</span>
  </button>

  <button
    className="btn-action-base btn-export-excel"
    onClick={handleExportExcel}
    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px' }}
  >
    <FiDownload size={16} />
    خروجی اکسل
  </button>
</div>

      </div>




      {/* ۴. نوار کنترل بالای جدول (انتخاب دسته‌جمعی) */}
      <div className="table-toolbar-bar">
        <div className="table-toolbar-left">
          
          {selectedIds.length > 0 && (
            <span className="selection-info-tag">{selectedIds.length} هنرجو انتخاب شده است</span>
          )}
        </div>

        {selectedIds.length > 0 && (
          <button className="bulk-delete-btn" onClick={() => setIsBulkDeleteModalOpen(true)}>
            <FiTrash2 size={15} />
            حذف / غیرفعال‌سازی انتخاب شده‌ها ({selectedIds.length})
          </button>
        )}
      </div>








        <div className="admin-table-responsive">
  <table className="admin-table admin-users-table text-center">
    <thead>
      <tr>
        <th style={{ width: '40px' }}>#</th>
        <th style={{ width: '60px' }}>عکس</th>
        <th>نام کامل</th>
        <th className="hide-on-mobile-tablet">کد ملی</th>
        <th className="hide-on-mobile-tablet">شماره تماس</th>
        <th className="hide-on-mobile-tablet">دوره فعلی</th>
        <th className="hide-on-mobile-tablet">وضعیت پرداخت</th>
        <th className="hide-on-mobile-tablet">پیشرفت دوره</th>
        <th className="hide-on-mobile-tablet">تاریخ ثبت‌نام</th>
        <th style={{ width: '130px' }}>عملیات</th>
      </tr>
    </thead>
    <tbody>
      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => {
          const isSelected = selectedIds.includes(student.id);
          return (
            <tr key={student.id} style={{ opacity: student.isActive ? 1 : 0.6 }}>
              {/* ستون ۱: چک‌باکس */}
              <td>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelect(student.id)}
                />
              </td>

              {/* ستون ۲: عکس کوچک */}
              <td>
                {student.avatar ? (
                  <img src={student.avatar} alt={student.fullName} className="student-avatar-cell" />
                ) : (
                  <div className="student-avatar-placeholder">{student.fullName[0]}</div>
                )}
              </td>

              {/* ستون ۳: نام */}
              <td className="font-medium text-right">
                <div>{student.fullName}</div>
                {!student.isActive && (
                  <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 'bold' }}>
                    (غیرفعال)
                  </span>
                )}
              </td>

              {/* ستون ۴: کد ملی */}
              <td className="hide-on-mobile-tablet">{student.nationalCode}</td>

              {/* ستون ۵: شماره تماس */}
              <td className="hide-on-mobile-tablet" style={{ direction: 'ltr' }}>
                {student.phone}
              </td>

              {/* ستون ۶: دوره فعلی */}
              <td className="hide-on-mobile-tablet">
                <span className="admin-badge admin-badge-primary" style={{ fontSize: '0.78rem' }}>
                  {student.currentCourse}
                </span>
              </td>

              {/* ستون ۷: وضعیت پرداخت */}
              <td className="hide-on-mobile-tablet">{renderPaymentBadge(student.paymentStatus)}</td>

              {/* ستون ۸: پیشرفت دوره */}
              <td className="hide-on-mobile-tablet">
                <div className="progress-bar-wrapper">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${student.progress}%`,
                        backgroundColor: getProgressColor(student.progress)
                      }}
                    />
                  </div>
                  <span className="progress-percent-label font-mono">{student.progress}%</span>
                </div>
              </td>

              {/* ستون ۹: تاریخ ثبت‌نام */}
              <td className="hide-on-mobile-tablet">{student.registerDate}</td>

              {/* ستون ۱۰: عملیات */}
              <td>
                <div className="admin-actions-group" style={{ justifyContent: 'center' }}>
                  <button
                    className="admin-action-btn btn-details"
                    title="جزئیات و پرونده"
                    onClick={() => handleOpenDetails(student)}
                  >
                    <FiInfo size={16} />
                  </button>
                  <button
                    className="admin-action-btn btn-password"
                          style={{ color: '#d97706', background: '#fef3c7' }}
                    title="ویرایش"
                    onClick={() => handleOpenEdit(student)}
                  >
                    <BiEdit size={16} />
                  </button>
                 {/*  <button
                    className="admin-action-btn"
                    style={{ color: '#ef4444', background: '#fef2f2' }}
                    title="غیرفعال‌سازی / حذف"
                    onClick={() => handleOpenDelete(student)}
                  >
                    <FiTrash2 size={15} />
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
            <p>هیچ هنرجویی با مشخصات وارد شده یافت نشد.</p>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

      {/* ۶. مودال جزئیات پرونده هنرجو (اطلاعات کامل آموزشی و مالی) */}
      {isDetailModalOpen && selectedStudent && (
        <div className="admin-modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div
            className="admin-modal-box user-details-modal"
            style={{ maxWidth: '750px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* هدر مودال */}
            <div className="modal-header-hero">
              <button
                className="modal-close-btn"
                onClick={() => setIsDetailModalOpen(false)}
                title="بستن"
              >
                <FiX size={20} />
              </button>
              <div className="user-hero-info">
                {selectedStudent.avatar ? (
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.fullName}
                    className="user-avatar-circle"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="user-avatar-circle">
                    <FiUser size={36} />
                  </div>
                )}
                <div className="user-hero-texts">
                  <h3 className="user-hero-name">{selectedStudent.fullName}</h3>
                  <div className="user-hero-badges">
                    <span className="admin-badge admin-badge-primary">
                      {selectedStudent.currentCourse}
                    </span>
                    {selectedStudent.isActive ? (
                      <span className="user-status-tag status-active">
                        <span className="status-dot"></span> فعال
                      </span>
                    ) : (
                      <span className="user-status-tag status-inactive">
                        <span className="status-dot"></span> غیرفعال
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* کارت‌های مشخصات کامل */}
            <div className="modal-body-content" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="details-cards-grid">
                {/* کد ملی */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-indigo">
                    <FiUser size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">کد ملی</span>
                    <span className="detail-value font-mono">{selectedStudent.nationalCode}</span>
                  </div>
                </div>

                {/* نام پدر */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-purple">
                    <FiUser size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">نام پدر</span>
                    <span className="detail-value">{selectedStudent.fatherName}</span>
                  </div>
                </div>

                {/* تاریخ تولد */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-teal">
                    <FiCalendar size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">تاریخ تولد</span>
                    <span className="detail-value font-mono">{selectedStudent.birthDate}</span>
                  </div>
                </div>

                {/* مدرک تحصیلی */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-cyan">
                    <FiAward size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">مدرک تحصیلی</span>
                    <span className="detail-value">{selectedStudent.education}</span>
                  </div>
                </div>

                {/* تماس هنرجو */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-emerald">
                    <FiPhone size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">شماره همراه هنرجو</span>
                    <span className="detail-value font-mono" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {selectedStudent.phone}
                    </span>
                  </div>
                </div>

                {/* تماس والدین */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-amber">
                    <FiPhone size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">شماره همراه والدین / اضطراری</span>
                    <span className="detail-value font-mono" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {selectedStudent.parentPhone}
                    </span>
                  </div>
                </div>

                {/* ایمیل */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-blue">
                    <FiMail size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">پست الکترونیک</span>
                    <span className="detail-value" style={{ direction: 'ltr', textAlign: 'right' }}>
                      {selectedStudent.email || 'ثبت نشده'}
                    </span>
                  </div>
                </div>

                {/* تاریخ ثبت‌نام */}
                <div className="detail-card">
                  <div className="detail-icon-wrap icon-slate">
                    <FiClock size={18} />
                  </div>
                  <div className="detail-text-wrap">
                    <span className="detail-title">تاریخ ثبت‌نام در سامانه</span>
                    <span className="detail-value font-mono">{selectedStudent.registerDate}</span>
                  </div>
                </div>
              </div>

              {/* بخش مالی و شهریه */}
              <div style={{ marginTop: '16px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiCreditCard size={17} color="#2563eb" /> وضعیت حسابداری و شهریه:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>مبلغ کل شهریه:</span>
                    <div className="font-bold">{selectedStudent.tuitionTotal || '—'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>پرداخت شده:</span>
                    <div className="font-bold text-success" style={{ color: '#10b981' }}>{selectedStudent.tuitionPaid || '—'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>مانده بدهی:</span>
                    <div className="font-bold text-danger" style={{ color: '#ef4444' }}>{selectedStudent.tuitionRemaining || '۰ تومان'}</div>
                  </div>
                </div>
              </div>

              {/* آدرس و توضیحات */}
              <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                  <strong><FiMapPin size={14} style={{ verticalAlign: 'middle', marginLeft: '4px' }} /> آدرس سکونت:</strong>{' '}
                  {selectedStudent.address || 'ثبت نشده'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                  <strong><FiFileText size={14} style={{ verticalAlign: 'middle', marginLeft: '4px' }} /> توضیحات و یادداشت:</strong>{' '}
                  {selectedStudent.description || 'توضیحاتی ثبت نشده است.'}
                </div>
              </div>
            </div>

            {/* فوتر مودال جزئیات */}
            <div className="modal-custom-footer" style={{ padding: '14px 20px' }}>
              <button className="admin-btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ۷. مودال ویرایش هنرجو */}
      {isEditModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div
            className="admin-modal-box user-details-modal"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-hero">
              <button className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>
                <FiX size={20} />
              </button>
              <div className="user-hero-info">
                <div className="user-avatar-circle">
                  <FiEdit2 size={28} />
                </div>
                <div className="user-hero-texts">
                  <h3 className="user-hero-name">ویرایش اطلاعات هنرجو</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                    {editFormData.fullName} (کد ملی: {editFormData.nationalCode})
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body-content" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <div className="modal-form-grid">
     

                  <div className="form-group-item">
                    <label>نام و نام‌خانوادگی</label>
                    <input
                      type="text"
                      value={editFormData.fullName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label>نام پدر</label>
                    <input
                      type="text"
                      value={editFormData.fatherName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>کد ملی</label>
                    <input
                      type="text"
                      className="font-mono"
                      value={editFormData.nationalCode || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, nationalCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label>تاریخ تولد</label>
                    <input
                      type="text"
                      className="font-mono"
                      value={editFormData.birthDate || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, birthDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>شماره تماس هنرجو</label>
                    <input
                      type="text"
                      className="font-mono"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label>شماره تماس والدین</label>
                    <input
                      type="text"
                      className="font-mono"
                      value={editFormData.parentPhone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, parentPhone: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>مدرک تحصیلی</label>
                    <input
                      type="text"
                      value={editFormData.education || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, education: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item">
                    <label>پست الکترونیک (اختیاری)</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>

                 

                 

                  

               

                  <div className="form-group-item modal-form-full">
                    <label>آدرس سکونت</label>
                    <input
                      type="text"
                      value={editFormData.address || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    />
                  </div>

                  <div className="form-group-item modal-form-full">
                    <label>توضیحات و یادداشت</label>
                    <textarea
                      rows="2"
                      value={editFormData.description || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    ></textarea>
                  </div>


             <div className="edit-photo-section">
  <div
    className="edit-photo-preview"
    onClick={() => document.getElementById('edit-photo-input').click()}
  >
    {editPhotoPreview ? (
      <img
        src={editPhotoPreview}
        alt="عکس پرسنلی"
        style={{ width: '100%', height: '100%', object: 'cover',  borderRadius: 'inherit' }}
      />
    ) : (
      <>
        <FiUpload size={22} />
        <span>انتخاب عکس</span>
      </>
    )}
  </div>

  <input
    type="file"
    accept="image/*"
    id="edit-photo-input"
    style={{ display: 'none' }}
    onChange={handleEditPhotoChange}
  />

  {editPhotoPreview && (
    <button
      type="button"
      className="btn btn-danger"
      onClick={handleRemoveEditPhoto}
    >
      حذف عکس
    </button>
  )}
</div>




                </div>
              </div>

              <div className="modal-custom-footer">
                <button type="button" className="admin-btn-secondary m-1" onClick={() => setIsEditModalOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className="admin-btn-primary save-password-btn m-1">
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ۸. مودال تایید حذف / غیرفعال‌سازی تک‌کاربره */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="admin-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div
            className="admin-modal-box"
            style={{ maxWidth: '420px', borderRadius: '16px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-hero" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
              <button className="modal-close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <FiX size={20} />
              </button>
              <div className="user-hero-info" style={{ justifyContent: 'center' }}>
                <FiAlertCircle size={36} color="#fff" />
              </div>
            </div>

            <div className="modal-body-content delete-confirm-box">
              {selectedStudent.avatar && (
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.fullName}
                  className="delete-avatar-preview"
                />
              )}
              <h4 className="delete-warning-text">
                آیا از غیرفعال‌سازی پرونده <strong>«{selectedStudent.fullName}»</strong> با کد ملی{' '}
                <span className="font-mono">{selectedStudent.nationalCode}</span> اطمینان دارید؟
              </h4>

              <div className="delete-note-text">
                توجه: اطلاعات هنرجو از پایگاه داده به صورت فیزیکی حذف نخواهد شد و صرفاً وضعیت آن به «غیرفعال» تغییر می‌یابد.
              </div>
            </div>

            <div className="modal-custom-footer" style={{ justifyContent: 'center', gap: '12px' }}>
              <button className="admin-btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                انصراف
              </button>
              <button
                className="admin-btn-primary"
                style={{ background: '#ef4444', borderColor: '#dc2626' }}
                onClick={handleConfirmDelete}
              >
                بله، غیرفعال شود
              </button>
            </div>
          </div>
        </div>
      )}





           {/* مودال افزودن هنرجوی جدید */}
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
                  <h3 className="admin-modal-title">افزودن هنرجوی جدید</h3>
                  <p className="admin-modal-subtitle">اطلاعات هویتی و تماسی هنرجو را وارد کنید</p>
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
            <form onSubmit={handleCreateStudent} className="admin-modal-form">
              
              {/* بخش آپلود و پیش‌نمایش تصویر هنرجو */}
              <div className="admin-avatar-upload-section">
                <div className="admin-avatar-preview-box">
                  {newStudent.avatar ? (
                    <img src={newStudent.avatar} alt="Preview" className="admin-avatar-preview-img" />
                  ) : (
                    <FiUsers size={24} color="#94a3b8" />
                  )}
                </div>
                <div className="admin-avatar-upload-actions">
                  <label className="admin-btn-secondary admin-avatar-upload-btn">
                    <FiUpload size={14} />
                    انتخاب تصویر
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                  </label>
                  <span className="admin-avatar-hint">فرمت‌های JPG، PNG (حداکثر ۲ مگابایت)</span>
                </div>
              </div>

              {/* ردیف اول: نام کامل / نام پدر */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">نام و نام خانوادگی <span className="admin-required-star">*</span></label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="مثال: علی رضایی"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">نام پدر</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="مثال: حسین"
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
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
                    className="admin-form-input"
                    placeholder="مثال: 3060123456"
                    value={newStudent.nationalCode}
                    onChange={(e) => setNewStudent({ ...newStudent, nationalCode: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">تاریخ تولد</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="مثال: 1382/05/14"
                    value={newStudent.birthDate}
                    onChange={(e) => setNewStudent({ ...newStudent, birthDate: e.target.value })}
                  />
                </div>
              </div>

              {/* ردیف سوم: شماره تماس هنرجو / شماره تماس والدین */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره تماس همراه <span className="admin-required-star">*</span></label>
                  <input
                    type="tel"
                    required
                    className="admin-form-input"
                    placeholder="مثال: 09131234567"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">شماره تماس والدین / اضطراری</label>
                  <input
                    type="tel"
                    className="admin-form-input"
                    placeholder="مثال: 09139876543"
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                  />
                </div>
              </div>

                          {/* ردیف چهارم: تحصیلات / ایمیل (اختیاری) */}
              <div className="admin-form-grid-2">
                <div className="admin-form-group">
                  <label className="admin-form-label">تحصیلات / رشته</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="مثال: دیپلم / کارشناسی نرم‌افزار"
                    value={newStudent.education || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, education: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">
                    پست الکترونیک (ایمیل)
                    <span className="admin-optional-badge">اختیاری</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    className="admin-form-input admin-input-email"
                    placeholder="student@example.com"
                    value={newStudent.email || ''}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
              </div>

              {/* ردیف پنجم: آدرس محل سکونت */}
              <div className="admin-form-group">
                <label className="admin-form-label">آدرس محل سکونت</label>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="مثال: سیرجان، بلوار سید جمال..."
                  value={newStudent.address || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                />
              </div>

              {/* ردیف ششم: توضیحات و یادداشت */}
              <div className="admin-form-group">
                <label className="admin-form-label">توضیحات و علاقه‌مندی‌ها</label>
                <textarea
                  rows={2}
                  className="admin-form-input admin-form-textarea"
                  placeholder="علاقه‌مندی‌ها، دوره‌های مدنظر یا نکات ثبت‌نام..."
                  value={newStudent.description || ''}
                  onChange={(e) => setNewStudent({ ...newStudent, description: e.target.value })}
                />
              </div>

              {/* فوتر دکمه‌های عملیات (طراحی شیک، مدرن و باکیفیت) */}
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
                  <span>ثبت و ذخیره هنرجو</span>
                </button>
              </div>


            
            </form>
          </div>
        </div>
      )}





      {/* ۹. مودال حذف گروهی */}
      {isBulkDeleteModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsBulkDeleteModalOpen(false)}>
          <div
            className="admin-modal-box"
            style={{ maxWidth: '420px', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-hero" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
              <button className="modal-close-btn" onClick={() => setIsBulkDeleteModalOpen(false)}>
                <FiX size={20} />
              </button>
              <div className="user-hero-info" style={{ justifyContent: 'center' }}>
                <FiTrash2 size={36} color="#fff" />
              </div>
            </div>

            <div className="modal-body-content delete-confirm-box">
              <h4 className="delete-warning-text">
                آیا از غیرفعال‌سازی هم‌زمان <strong>{selectedIds.length} هنرجوی</strong> انتخاب شده اطمینان دارید؟
              </h4>
              <div className="delete-note-text">
                این عملیات سوابق را حذف نمی‌کند و دسترسی همه موارد انتخاب‌شده را به حالت تعلیق درمی‌آورد.
              </div>
            </div>

            <div className="modal-custom-footer" style={{ justifyContent: 'center', gap: '12px' }}>
              <button className="admin-btn-secondary" onClick={() => setIsBulkDeleteModalOpen(false)}>
                انصراف
              </button>
              <button
                className="admin-btn-primary"
                style={{ background: '#ef4444', borderColor: '#dc2626' }}
                onClick={handleConfirmBulkDelete}
              >
                تایید غیرفعال‌سازی همگانی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
