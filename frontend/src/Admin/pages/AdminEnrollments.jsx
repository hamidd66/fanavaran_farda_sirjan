import React, { useState, useRef, useEffect } from 'react';
import {
  FiUserPlus,
  FiPrinter,
  FiSend,
  FiRefreshCw,
  FiLayers, 
  FiX, 
  FiRotateCcw, 
  FiDownload, 
  
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiFileText,
  FiUser,
  FiBookOpen,
  FiAlertTriangle, FiTrendingUp,
  FiHelpCircle,
  FiPhoneCall,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,FiAlertCircle,
  FiPlus, FiInfo,
} from 'react-icons/fi';
import '../style/AdminGlobal.css';
import '../style/AdminStudents.css';
import { BiEdit } from 'react-icons/bi';


// لیست کلاس‌ها و دوره‌های آموزشی (همراه با عنوان دوره)
const availableClasses = [
  { id: 'c1', title: 'برنامه‌نویسی پایتون مقدماتی - کد A1', courseTitle: 'برنامه‌نویسی پایتون و هوش مصنوعی', instructor: 'حمید پورفریدونی' },
  { id: 'c2', title: 'توسعه وب با React.js - کد B2', courseTitle: 'توسعه وب فرانت‌اند مدرن', instructor: 'سارا محمدی' },
  { id: 'c3', title: 'توسعه وب ASP.NET Core - کد C3', courseTitle: 'برنامه‌نویسی فول‌استک C# و دات‌نت', instructor: 'رضا احمدی' },
  { id: 'c4', title: 'هوش مصنوعی و یادگیری ماشین - کد AI1', courseTitle: 'هوش مصنوعی و علم داده', instructor: 'حمید پورفریدونی' },
  { id: 'c5', title: 'طراحی وب مقدماتی (HTML/CSS/JS) - کد W1', courseTitle: 'طراحی و توسعه وب مقدماتی', instructor: 'مریم حسینی' },
  { id: 'c6', title: 'پایگاه داده SQL Server - کد DB1', courseTitle: 'مدیریت و طراحی پایگاه داده', instructor: 'رضا احمدی' }
];

const initialRegistrations = [
  {
    id: 1,
    registrationCode: 'REG-1042',
    classTitle: 'برنامه‌نویسی پایتون مقدماتی - کد A1',
    instructorName: 'حمید پورفریدونی',
    studentName: 'علی رضایی',
    regDate: '۱۴۰۳/۰۶/۱۰',
    regTime: '۱۶:۳۰',
    status: 'confirmed',
    finalDate: '۱۴۰۳/۰۶/۱۲',
    finalTime: '۱۸:۰۰',
    cancellationReason: '',
    cancellationDate: '',
    cancellationTime: '',
    referralSource: 'اینستاگرام',
    registrationMethod: 'online',
    notes: ''
  },
  {
    id: 2,
    registrationCode: 'REG-1043',
    classTitle: 'توسعه وب با React.js - کد B2',
    instructorName: 'سارا محمدی',
    studentName: 'زهرا کریمی',
    regDate: '۱۴۰۳/۰۶/۱۱',
    regTime: '۱۰:۱۵',
    status: 'pending',
    finalDate: '',
    finalTime: '',
    cancellationReason: '',
    cancellationDate: '',
    cancellationTime: '',
    referralSource: 'معرفی دوستان',
    registrationMethod: 'in_person',
    notes: 'در انتظار پرداخت شهریه'
  },
  {
    id: 3,
    registrationCode: 'REG-1044',
    classTitle: 'توسعه وب ASP.NET Core - کد C3',
    instructorName: 'رضا احمدی',
    studentName: 'محمد حسینی',
    regDate: '۱۴۰۳/۰۶/۱۲',
    regTime: '۱۴:۰۰',
    status: 'cancelled',
    finalDate: '',
    finalTime: '',
    cancellationReason: 'تداخل زمانی با کلاس دانشگاه',
    cancellationDate: '۱۴۰۳/۰۶/۱۳',
    cancellationTime: '۰۹:۳۰',
    referralSource: 'وب‌سایت',
    registrationMethod: 'phone',
    notes: ''
  }
];

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const toPersianDigits = (num) => {
  return String(num).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

// کامپوننت انتخابگر تاریخ شمسی
// کامپوننت انتخابگر تاریخ شمسی (سازگار هم با فیلترها و هم با فرم مودال)
function PersianDatePickerInput({ label, value, onChange, placeholder, required = false, isDanger = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(1403);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDaySelect = (day) => {
    const formattedMonth = String(selectedMonth).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedDate = toPersianDigits(`${selectedYear}/${formattedMonth}/${formattedDay}`);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const daysInMonth = selectedMonth <= 6 ? 31 : selectedMonth <= 11 ? 30 : 29;

  return (
    <div className="position-relative w-100" ref={dropdownRef} style={{ margin: 0 }}>
      {/* لیبل فقط در صورتی نمایش داده می‌شود که ارسال شده باشد (در فیلترها نمایش داده نمی‌شود) */}
      {label && (
        <label className={`form-label small fw-bold mb-1 ${isDanger ? 'text-danger' : 'text-dark'}`}>
          <FiCalendar className={`ms-1 ${isDanger ? 'text-danger' : 'text-secondary'}`} /> {label} {required && '*'}
        </label>
      )}

      {/* باکس ورودی همراه با آیکون شناور داخلی بدون دکمه اضافه یا تگ input-group شکسته */}
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          className="admin-filter-select"
          placeholder={placeholder || 'مثال: ۱۴۰۳/۰۶/۱۵'}
          value={value || ''}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            height: '40px',
            width: '100%',
            paddingRight: '12px',
            paddingLeft: '34px',
            boxSizing: 'border-box',
            fontSize: '13px',
            margin: 0
          }}
          required={required}
        />
        <FiCalendar
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '16px',
            pointerEvents: 'none'
          }}
        />
      </div>

      {isOpen && (
        <div
          className="position-absolute shadow-lg rounded-3 bg-white p-3 border"
          style={{
            top: 'calc(100% + 4px)',
            right: 0,
            zIndex: 1100,
            width: '260px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
            <button
              type="button"
              className="btn btn-sm btn-light p-1"
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear((y) => y - 1);
                } else {
                  setSelectedMonth((m) => m - 1);
                }
              }}
            >
              <FiChevronRight />
            </button>
            <div className="fw-bold small">
              {persianMonths[selectedMonth - 1]} {toPersianDigits(selectedYear)}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-light p-1"
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear((y) => y + 1);
                } else {
                  setSelectedMonth((m) => m + 1);
                }
              }}
            >
              <FiChevronLeft />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              textAlign: 'center'
            }}
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                className="btn btn-sm btn-outline-primary p-1 border-0"
                style={{ fontSize: '0.85rem' }}
                onClick={() => handleDaySelect(day)}
              >
                {toPersianDigits(day)}
              </button>
            ))}
          </div>

          {value && (
            <div className="text-center pt-2 mt-2 border-top">
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="btn btn-sm text-danger p-0 border-0"
                style={{ fontSize: '11px' }}
              >
                پاک کردن تاریخ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}














// کامپوننت ساعت دیجیتال
function DigitalTimePickerInput({ label, value, onChange, required = false, isDanger = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState('16');
  const [minute, setMinute] = useState('00');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyTime = () => {
    onChange(`${toPersianDigits(hour)}:${toPersianDigits(minute)}`);
    setIsOpen(false);
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <label className={`form-label small fw-bold ${isDanger ? 'text-danger' : 'text-dark'}`}>
        <FiClock className={`ms-1 ${isDanger ? 'text-danger' : 'text-secondary'}`} /> {label} {required && '*'}
      </label>
      <div className="input-group">
        <input
          type="text"
          className={`form-control rounded-start-3 ${isDanger ? 'border-danger' : ''}`}
          placeholder="مثال: ۱۶:۳۰"
          value={value}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          style={{ cursor: 'pointer', backgroundColor: '#ffffff' }}
          required={required}
        />
        <button
          type="button"
          className={`btn ${isDanger ? 'btn-outline-danger' : 'btn-outline-secondary'} rounded-end-3`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiClock />
        </button>
      </div>

      {isOpen && (
        <div
          className="position-absolute shadow-lg rounded-3 bg-white p-3 border"
          style={{
            top: '100%',
            right: 0,
            zIndex: 1100,
            width: '240px',
            marginTop: '6px'
          }}
        >
          <div className="text-center fw-bold small mb-2 pb-2 border-bottom">انتخاب ساعت و دقیقه</div>
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <div>
              <label className="form-label small text-muted d-block text-center m-0">دقیقه</label>
              <select
                className="form-select form-select-sm text-center"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              >
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                  <option key={m} value={m}>
                    {toPersianDigits(m)}
                  </option>
                ))}
              </select>
            </div>
            <span className="fw-bold fs-5 mt-3">:</span>
            <div>
              <label className="form-label small text-muted d-block text-center m-0">ساعت</label>
              <select
                className="form-select form-select-sm text-center"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
                  <option key={h} value={h}>
                    {toPersianDigits(h)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-primary w-100 rounded-2"
            onClick={handleApplyTime}
          >
            تایید ساعت
          </button>
        </div>
      )}
    </div>
  );
}

const statusLabels = {
  confirmed: { text: 'تایید شده', className: 'badge-success' },
  pending: { text: 'در انتظار پرداخت', className: 'badge-warning' },
  cancelled: { text: 'لغو شده', className: 'badge-danger' }
};

export default function AdminEnrollments() {
  const [registrations, setRegistrations] = useState(initialRegistrations);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  // استیت مدیریت ردیف‌های انتخاب‌شده (چک‌باکس‌ها)
const [selectedIds, setSelectedIds] = useState([]);

// انتخاب تکی ردیف
const handleSelectRow = (id) => {
  setSelectedIds(prev => 
    prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
};

// انتخاب همه / لغو انتخاب همه
const handleSelectAll = () => {
  if (selectedIds.length === filteredRegistrations.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(filteredRegistrations.map(r => r.id));
  }
};

// تابع حذف کامل ثبت‌نام (Hard Delete)
const handleDelete = (id) => {
  if (window.confirm('آیا از حذف کامل این ثبت‌نام مطمئن هستید؟ (این عملیات غیرقابل بازگشت است)')) {
    setRegistrations(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(itemId => itemId !== id));
  }
};

// حذف گروهی ردیف‌های انتخاب‌شده
const handleBulkDelete = () => {
  if (selectedIds.length === 0) return;
  if (window.confirm(`آیا از حذف کامل ${selectedIds.length} مورد انتخاب‌شده مطمئن هستید؟`)) {
    setRegistrations(prev => prev.filter(item => !selectedIds.includes(item.id)));
    setSelectedIds([]);
  }
};



 // ۱. تمام استیت‌های فیلتر و جستجو درون کامپوننت:
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);








  // تابع خروجی اکسل (CSV با کدگذاری UTF-8 سازگار با حروف فارسی در اکسل)
  const handleExportExcel = () => {
    const listToExport = filteredRegistrations && filteredRegistrations.length > 0 
      ? filteredRegistrations 
      : registrations;

    if (!listToExport || listToExport.length === 0) {
      alert('داده‌ای برای خروجی اکسل وجود ندارد.');
      return;
    }

    // هدر ستون‌های اکسل
    const headers = [
      'کد ثبت‌نام',
      'نام هنرجو',
      'عنوان دوره',
      'عنوان کلاس',
      'مدرس',
      'تاریخ ثبت',
      'ساعت ثبت',
      'روش ثبت‌نام',
      'وضعیت'
    ];

    // تبدیل وضعیت‌ها و روش‌ها به متن فارسی
    const getStatusText = (status) => {
      switch (status) {
        case 'confirmed': return 'تایید شده';
        case 'pending': return 'در انتظار';
        case 'cancelled': return 'لغو شده';
        default: return status || '—';
      }
    };

    const getMethodText = (method) => {
      switch (method) {
        case 'online': return 'آنلاین';
        case 'in_person': return 'حضوری';
        case 'phone': return 'تلفنی';
        default: return method || '—';
      }
    };

    // آماده‌سازی سطرهای جدول
    const rows = listToExport.map((item) => [
      `"${item.registrationCode || ''}"`,
      `"${item.studentName || ''}"`,
      `"${item.courseTitle || ''}"`,
      `"${item.classTitle || ''}"`,
      `"${item.instructorName || ''}"`,
      `"${item.regDate || ''}"`,
      `"${item.regTime || ''}"`,
      `"${getMethodText(item.registrationMethod)}"`,
      `"${getStatusText(item.status)}"`
    ]);

    // ترکیب ردیف‌ها و اضافه کردن UTF-8 BOM (\uFEFF) برای نمایش درست حروف فارسی در نرم‌افزار Excel
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `enrollments_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };




    // تابع چاپ و خروجی PDF
  const handleExportPDF = () => {
    const listToPrint = filteredRegistrations && filteredRegistrations.length > 0
      ? filteredRegistrations
      : registrations;

    if (!listToPrint || listToPrint.length === 0) {
      alert('داده‌ای برای چاپ/خروجی PDF وجود ندارد.');
      return;
    }

    const getStatusBadge = (status) => {
      switch (status) {
        case 'confirmed': return '<span style="color: #059669; font-weight: bold;">تایید شده</span>';
        case 'pending': return '<span style="color: #d97706; font-weight: bold;">در انتظار</span>';
        case 'cancelled': return '<span style="color: #dc2626; font-weight: bold;">لغو شده</span>';
        default: return status || '—';
      }
    };

    const getMethodText = (method) => {
      switch (method) {
        case 'online': return 'آنلاین';
        case 'in_person': return 'حضوری';
        case 'phone': return 'تلفنی';
        default: return method || '—';
      }
    };

    const printWindow = window.open('', '_blank');
    const tableRowsHtml = listToPrint.map((item, index) => `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>${item.registrationCode || '—'}</td>
        <td style="font-weight: bold;">${item.studentName || '—'}</td>
        <td>${item.courseTitle || '—'}</td>
        <td>${item.classTitle || '—'}</td>
        <td>${item.instructorName || '—'}</td>
        <td style="text-align: center;">${item.regDate || '—'} ${item.regTime ? `(${item.regTime})` : ''}</td>
        <td style="text-align: center;">${getMethodText(item.registrationMethod)}</td>
        <td style="text-align: center;">${getStatusBadge(item.status)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="utf-8">
        <title>گزارش ثبت‌نام‌ها - آموزشگاه فناوران فردا</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: 'Vazirmatn', 'Tahoma', sans-serif; direction: rtl; padding: 20px; color: #1e293b; }
          .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
          .header h2 { margin: 0 0 6px 0; font-size: 20px; color: #0f172a; }
          .header p { margin: 0; color: #64748b; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
          th { background-color: #f1f5f9; color: #334155; padding: 10px 8px; border: 1px solid #cbd5e1; font-weight: 600; }
          td { padding: 8px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 20px; text-align: left; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>لیست ثبت‌نام‌های دوره‌ها و کلاس‌ها</h2>
          <p>آموزشگاه فناوران فردا | تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 40px;">ردیف</th>
              <th>کد ثبت‌نام</th>
              <th>نام هنرجو</th>
              <th>عنوان دوره</th>
              <th>کلاس</th>
              <th>مدرس</th>
              <th>تاریخ ثبت</th>
              <th>روش ثبت‌نام</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
        <div class="footer">
          تعداد کل رکوردها: ${listToPrint.length} | چاپ شده از پنل مدیریت
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };






  // ۲. تابع ریست فیلترها درون کامپوننت:
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCourseFilter('ALL');
    setMethodFilter('ALL');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };





  // درون کامپوننت AdminEnrollments استیت اولیه فرم را به این شکل تغییر دهید:
const initialFormState = {
  studentName: '',
  courseTitle: availableClasses[0].courseTitle, // فیلد جدید: عنوان دوره
  classTitle: availableClasses[0].title,
  instructorName: availableClasses[0].instructor,
  regDate: '۱۴۰۳/۰۶/۱۵',
  regTime: '۱۶:۳۰',
  finalDate: '',
  finalTime: '',
  referralSource: '',
  registrationMethod: 'online',
  notes: ''
};

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // تابع تغییر کلاس برای ست شدن همزمان دوره و مدرس
const handleClassChange = (e) => {
  const selectedTitle = e.target.value;
  const matchedClass = availableClasses.find((c) => c.title === selectedTitle);
  setFormData((prev) => ({
    ...prev,
    classTitle: selectedTitle,
    courseTitle: matchedClass ? matchedClass.courseTitle : prev.courseTitle,
    instructorName: matchedClass ? matchedClass.instructor : prev.instructorName
  }));
};

  const handleOpenAddModal = () => {
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    const newRegistration = {
      ...formData,
      id: Date.now(),
      registrationCode: `REG-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setRegistrations((prev) => [newRegistration, ...prev]);
    setIsAddModalOpen(false);
  };

 

    const filteredRegistrations = registrations.filter((r) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (r.studentName && r.studentName.toLowerCase().includes(query)) ||
      (r.classTitle && r.classTitle.toLowerCase().includes(query)) ||
      (r.registrationCode && r.registrationCode.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || statusFilter === 'all' || r.status === statusFilter;
    const matchesCourse = courseFilter === 'ALL' || r.classTitle === courseFilter;
    const matchesMethod = methodFilter === 'ALL' || r.registrationMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesCourse && matchesMethod;
  });


  const stats = {
    total: registrations.length,
    confirmed: registrations.filter((r) => r.status === 'confirmed').length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    cancelled: registrations.filter((r) => r.status === 'cancelled').length
  };

  return (
    <div className="admin-page-container">
      {/* هدر صفحه */}
      <header className="admin-page-header">
        <div className="admin-page-header-icon">
                    <FiUserPlus size={26} />
                  </div>
        <div className="admin-page-header-info">
          <h1 className="admin-page-title">مدیریت ثبت‌نام‌ها</h1>
          <p className="admin-page-subtitle">
            مدیریت، پیگیری وضعیت، تایید و ثبت‌نام هنرجویان در دوره‌ها و کلاس‌های آموزشی
          </p>
        </div>

        <div className="admin-page-header-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleOpenAddModal}>
            <FiUserPlus className="admin-btn-icon" />
            <span>ثبت‌نام جدید</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => alert('بخش ارسال پیامک وضعیت')}
          >
            <FiSend className="admin-btn-icon" />
            <span>ارسال پیامک</span>
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={() => window.print()}>
            <FiPrinter className="admin-btn-icon" />
            <span>چاپ گزارش</span>
          </button>
        </div>
      </header>

      {/* کارت‌های آماری */}
            {/* ================= کارت‌های آماری تحلیلی ثبت‌نام‌ها ================= */}
      <div className="admin-stats-grid mb-4">
        {/* کارت اول: کل ثبت‌نام‌ها (آبی) */}
        <div className="admin-stat-card" style={{ '--card-color': '#3b82f6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <FiFileText size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">کل ثبت‌نام‌ها</span>
            <span className="stat-card-value">{stats.total?.toLocaleString('fa-IR') || stats.total} پرونده</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> مجموع پذیرش و لیدها
            </span>
          </div>
        </div>

        {/* کارت دوم: تایید شده / قطعی (سبز) */}
        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">تایید شده و قطعی</span>
            <span className="stat-card-value">{stats.confirmed?.toLocaleString('fa-IR') || stats.confirmed} هنرجو</span>
            <span className="stat-trend-badge positive">
              <FiTrendingUp size={12} /> پرونده‌های نهایی و تسویه‌شده
            </span>
          </div>
        </div>

        {/* کارت سوم: در انتظار پرداخت / رزرو (کهربایی / زرد) */}
        <div className="admin-stat-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
            <FiClock size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">در انتظار پرداخت</span>
            <span className="stat-card-value">{stats.pending?.toLocaleString('fa-IR') || stats.pending} رزرو</span>
            <span className="stat-trend-badge positive" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <FiAlertCircle size={12} /> نیازمند پیگیری مشاوره
            </span>
          </div>
        </div>

        {/* کارت چهارم: انصرافی و لغو شده (قرمز / رز) */}
        <div className="admin-stat-card" style={{ '--card-color': '#ef4444' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <FiXCircle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">لغو شده / انصرافی</span>
            <span className="stat-card-value">{stats.cancelled?.toLocaleString('fa-IR') || stats.cancelled} مورد</span>
            <span className="stat-trend-badge" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <FiXCircle size={12} /> عدم حضور یا عودت شهریه
            </span>
          </div>
        </div>
      </div>





 


      {/* جدول نمایش اطلاعات */}
      <div className="admin-table-container">




     {/* ================= نوار ابزار، جستجو و فیلترهای ثبت‌نام ================= */}
<div className="admin-filters-bar" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
  
  {/* ردیف جستجو و فیلترهای اصلی */}
<div className="enrollments-filter-row">
  {/* جستجوی هوشمند */}
  <div className="admin-search-box enrollments-search-box">
    <FiSearch className="admin-search-icon" />

    <input
      type="text"
      className="admin-search-input"
      placeholder="جستجوی هنرجو، کد ملی، موبایل یا کد ثبت‌نام..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        if (typeof setCurrentPage === 'function') {
          setCurrentPage(1);
        }
      }}
    />

    {searchQuery && (
      <button
        type="button"
        className="clear-search-btn"
        onClick={() => setSearchQuery('')}
        aria-label="پاک کردن جستجو"
      >
        <FiX size={16} />
      </button>
    )}
  </div>

  {/* فیلتر وضعیت ثبت‌نام */}
  <select
    className="admin-filter-select enrollments-filter-select"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">همه وضعیت‌ها</option>
    <option value="confirmed">تایید شده (قطعی)</option>
    <option value="pending">در انتظار پرداخت / رزرو</option>
    <option value="awaiting">در انتظار تماس</option>
    <option value="cancelled">انصرافی / لغو شده</option>
  </select>

  {/* فیلتر دوره / کلاس */}
  <select
    className="admin-filter-select enrollments-filter-select"
    value={courseFilter}
    onChange={(e) => setCourseFilter(e.target.value)}
  >
    <option value="ALL">همه دوره‌ها / کلاس‌ها</option>

    {availableClasses?.map((c) => (
      <option key={c.id} value={c.title}>
        {c.title}
      </option>
    ))}
  </select>
</div>


{/* ردیف دوم فیلترها: چیدمان یکپارچه و تمام‌عرض با ریسپانسیو خودکار */}
{/* کانتینر کل فیلترها و دکمه‌ها با Grid کاملاً ریسپانسیو و بدون فاصله اضافه */}
<div
  className="enrollments-filters-container w-100"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '8px',
    width: '100%',
    margin: '0 0 12px 0',
    padding: 0,
    alignItems: 'stretch'
  }}
>
  {/* ۱. روش ثبت‌نام */}
  <div style={{ margin: 0, padding: 0 }}>
    <select
      className="admin-filter-select"
      value={methodFilter}
      onChange={(e) => setMethodFilter(e.target.value)}
      style={{
        width: '100%',
        height: '40px',
        margin: 0,
        padding: '0 10px',
        fontSize: '13px',
        boxSizing: 'border-box'
      }}
    >
      <option value="ALL">روش ثبت‌نام</option>
      <option value="online">آنلاین</option>
      <option value="in_person">حضوری</option>
      <option value="phone">تلفنی</option>
    </select>
  </div>

  {/* ۲. از تاریخ */}
  <div زم style={{ margin: 0, padding: 0, width: '100%' }}>
    <PersianDatePickerInput
      placeholder="از تاریخ"
      value={dateFrom}
      onChange={(val) => setDateFrom(val)}
      style={{ width: '100%', height: '40px', margin: 0 }}
    />
  </div>

  {/* ۳. تا تاریخ */}
  <div style={{ margin: 0, padding: 0, width: '100%' }}>
    <PersianDatePickerInput
      placeholder="تا تاریخ"
      value={dateTo}
      onChange={(val) => setDateTo(val)}
      style={{ width: '100%', height: '40px', margin: 0 }}
    />
  </div>

  {/* ۴. دکمه بازنشانی */}
  <button
    type="button"
    className="btn-action-base reset-filters-btn-full"
    onClick={handleResetFilters}
    title="بازنشانی فیلترها"
    style={{
      height: '40px',
      width: '100%',
      margin: 0,
      padding: '0 12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box'
    }}
  >
    <FiRotateCcw className="action-icon" />
    <span>بازنشانی</span>
  </button>

  {/* ۵. دکمه اکسل */}
  <button
    type="button"
    className="btn-action-base btn-export-excel"
    onClick={handleExportExcel}
    title="خروجی فایل اکسل"
    style={{
      height: '40px',
      width: '100%',
      margin: 0,
      padding: '0 12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box'
    }}
  >
    <FiDownload className="action-icon" />
    <span>اکسل</span>
  </button>

  {/* ۶. دکمه چاپ / PDF */}
  <button
    type="button"
    className="btn-action-base btn-export-print"
    onClick={handleExportPDF}
    title="چاپ و دانلود گزارش PDF"
    style={{
      height: '40px',
      width: '100%',
      margin: 0,
      padding: '0 12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box'
    }}
  >
    <FiPrinter className="action-icon" />
    <span>چاپ</span>
  </button>
</div>



</div>





{/* نوار کنترل بالای جدول ثبت‌نام‌ها */}
<div className="table-toolbar-bar">
  <div className="table-toolbar-left">
    {selectedIds.length > 0 && (
      <span className="selection-info-tag">
        {selectedIds.length} ثبت‌نام انتخاب شده
      </span>
    )}
  </div>

  {selectedIds.length > 0 && (
    <button
      type="button"
      className="bulk-delete-btn"
      onClick={handleBulkDelete}
    >
      <FiTrash2 size={15} />
      <span>حذف {selectedIds.length} ثبت‌نام</span>
    </button>
  )}
</div>




       
  <table className="admin-table table-responsive">
<thead>
<tr>
{/* چک‌باکس انتخاب کل */}
<th style={{ width:'40px', textAlign:'center' }}>
<input
type="checkbox"
className="admin-checkbox"
checked={filteredRegistrations.length > 0 && selectedIds.length === filteredRegistrations.length}
onChange={handleSelectAll}
/>
</th>
<th>نام و مشخصات هنرجو</th>
<th className="d-none d-md-table-cell">کلاس / دوره</th>
<th className="d-none d-md-table-cell">استاد</th>
<th className="d-none d-md-table-cell">تاریخ ثبت‌نام</th>
<th className="d-none d-md-table-cell">طریقه ثبت‌نام</th>
<th className="d-none d-md-table-cell">وضعیت</th>
<th style={{ textAlign:'center', width:'130px' }}>عملیات</th>
</tr>
</thead>
<tbody>
{filteredRegistrations.length === 0 ? (
<tr>
<td colSpan={8} style={{ textAlign:'center', padding:'40px', color:'#94a3b8' }}>
هیچ موردی با فیلترهای انتخابی یافت نشد.
</td>
</tr>
) : (
filteredRegistrations.map((reg) => {
const isSelected = selectedIds.includes(reg.id);
return (
<tr key={reg.id} className={isSelected ? 'selected-row' : ''}>
{/* چک‌باکس سطر */}
<td style={{ textAlign:'center' }}>
<input
type="checkbox"
className="admin-checkbox"
checked={isSelected}
onChange={() => handleSelectRow(reg.id)}
/>
</td>

{/* نام هنرجو و کد رجیستر */}
<td>
<div style={{ fontWeight:600, color:'#1e293b' }}>{reg.studentName}</div>
</td>

{/* کلاس / دوره */}
<td className="d-none d-md-table-cell" style={{ fontWeight:600, color:'#0f172a' }}>{reg.classTitle}</td>

{/* استاد */}
<td className="d-none d-md-table-cell" style={{ color:'#334155' }}>{reg.instructorName}</td>

{/* تاریخ ثبت‌نام */}
<td className="d-none d-md-table-cell">
<div style={{ fontSize:'12.5px', color:'#334155' }}>{reg.regDate}</div>
<div style={{ fontSize:'11px', color:'#94a3b8', marginTop:'2px' }}>
{reg.regTime || '—'}
</div>
</td>

{/* طریقه ثبت‌نام */}
<td className="d-none d-md-table-cell">
{reg.registrationMethod === 'online' && (
<span className="admin-badge badge">آنلاین</span>
)}
{reg.registrationMethod === 'in_person' && (
<span className="admin-badge" style={{ background:'#e0f2fe', color:'#0284c7' }}>حضوری</span>
)}
{reg.registrationMethod !== 'online' && reg.registrationMethod !== 'in_person' && (
<span className="admin-badge" style={{ background:'#f1f5f9', color:'#475569' }}>تلفنی</span>
)}
</td>

{/* وضعیت */}
<td className="d-none d-md-table-cell">
<span className={`admin-badge ${statusLabels[reg.status].className}`}>
{statusLabels[reg.status].text}
</span>
</td>

{/* دکمه‌های عملیات */}
<td style={{ textAlign:'center' }}>
<div className="admin-table-actions" style={{ display:'flex', justifyContent:'center', gap:'6px' }}>
<button type="button" className="admin-action-btn btn-details" title="مشاهده جزئیات">
                            <FiInfo size={16} />
</button>
<button
type="button"
className="admin-action-btn btn-password"
style={{ color: '#d97706', background: '#fef3c7' }}
title="ویرایش"
onClick={() => { if (typeof handleOpenEditModal === 'function') handleOpenEditModal(reg); }}
>
<BiEdit size={16} />
</button>
<button
  type="button"
  className="admin-action-btn"
  style={{
    color: '#ef4444',
    background: '#fef2f2'
  }}
  title="حذف کامل ثبت‌نام"
  onClick={() => handleDelete(reg.id)}
>
  <FiTrash2 size={15} />
</button>

</div>
</td>
</tr>
);
})
)}
</tbody>
  </table>
      </div>













            {/* مودال ثبت‌نام جدید - گرافیک مدرن، دسته‌بندی‌شده و کامپکت */}
      {isAddModalOpen && (
        <div
          className="modal-backdrop-custom"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '16px'
          }}
        >
          <div
            className="bg-white rounded-4 shadow-2xl border border-light"
            style={{
              width: '100%',
              maxWidth: '860px',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* هدر جذاب مودال */}
            <div className="px-4 py-3 bg-gradient d-flex justify-content-between align-items-center border-bottom" style={{ backgroundColor: '#f8fafc' }}>
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                  style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}
                >
                  <FiUserPlus size={22} />
                </div>
                <div>
                  <h5 className="modal-title fw-bold text-dark m-0" style={{ fontSize: '1.1rem' }}>
                    ثبت‌نام جدید هنرجو
                  </h5>
                  <span className="text-muted small">تکمیل فرم پذیرش و تخصیص کلاس آموزشی</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center"
                onClick={handleCloseAddModal}
                title="بستن"
              >
                <FiXCircle size={18} className="text-secondary" />
              </button>
            </div>

            {/* بدنه فرم مودال */}
            <form onSubmit={handleSubmitRegistration} className="d-flex flex-column" style={{ overflow: 'hidden', flex: 1 }}>
              <div className="p-4" style={{ overflowY: 'auto', maxHeight: 'calc(92vh - 140px)', backgroundColor: '#fdfdfd' }}>
                
                {/* بخش اول: اطلاعات هنرجو و دوره آموزشی */}
                <div className="bg-white p-3 rounded-3 border mb-3 shadow-xs">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 small">
                    <FiBookOpen size={16} /> مشخصات دوره و هنرجو
                  </h6>
                  <div className="row g-3">
                    {/* نام و نام خانوادگی */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        <FiUser className="ms-1 text-primary" /> نام و نام خانوادگی هنرجو <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="studentName"
                        className="form-control rounded-3"
                        required
                        placeholder="مثال: علی رضایی"
                        value={formData.studentName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* فیلد جدید: عنوان دوره آموزشی */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        <FiBookOpen className="ms-1 text-primary" /> عنوان دوره آموزشی <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="courseTitle"
                        className="form-control rounded-3 bg-light"
                        placeholder="عنوان دوره"
                        value={formData.courseTitle}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* انتخاب کلاس / کد کلاس */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        کد و عنوان کلاس <span className="text-danger">*</span>
                      </label>
                      <select
                        name="classTitle"
                        className="form-select rounded-3"
                        value={formData.classTitle}
                        onChange={handleClassChange}
                        required
                      >
                        {availableClasses.map((item) => (
                          <option key={item.id} value={item.title}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* نام استاد مدرس */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        استاد مدرس <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="instructorName"
                        className="form-control rounded-3 bg-light"
                        required
                        placeholder="نام استاد"
                        value={formData.instructorName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* بخش دوم: زمان‌بندی و تاریخ‌ها */}
                <div className="bg-white p-3 rounded-3 border mb-3 shadow-xs">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 small">
                    <FiCalendar size={16} /> زمان‌بندی ثبت‌نام
                  </h6>
                  <div className="row g-3">
                    {/* تاریخ ثبت‌نام */}
                    <div className="col-12 col-sm-6 col-md-3">
                      <PersianDatePickerInput
                        label="تاریخ ثبت‌نام"
                        value={formData.regDate}
                        onChange={(val) => setFormData((prev) => ({ ...prev, regDate: val }))}
                        required={true}
                      />
                    </div>

                    {/* ساعت ثبت‌نام */}
                    <div className="col-12 col-sm-6 col-md-3">
                      <DigitalTimePickerInput
                        label="ساعت ثبت‌نام"
                        value={formData.regTime}
                        onChange={(val) => setFormData((prev) => ({ ...prev, regTime: val }))}
                        required={true}
                      />
                    </div>

                    {/* تاریخ نهایی قطعی */}
                    {/* <div className="col-12 col-sm-6 col-md-3">
                      <PersianDatePickerInput
                        label="تاریخ نهایی قطعی"
                        value={formData.finalDate}
                        onChange={(val) => setFormData((prev) => ({ ...prev, finalDate: val }))}
                      />
                    </div> */}

                    {/* ساعت نهایی قطعی */}
                    {/* <div className="col-12 col-sm-6 col-md-3">
                      <DigitalTimePickerInput
                        label="ساعت نهایی قطعی"
                        value={formData.finalTime}
                        onChange={(val) => setFormData((prev) => ({ ...prev, finalTime: val }))}
                      />
                    </div> */}
                  </div>
                </div>

                {/* بخش سوم: کانال‌های ورودی و توضیحات */}
                <div className="bg-white p-3 rounded-3 border shadow-xs">
                  <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 small">
                    <FiPhoneCall size={16} /> نحوه آشنایی و یادداشت‌ها
                  </h6>
                  <div className="row g-3">
                    {/* طریقه ثبت‌نام */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        <FiPhoneCall className="ms-1 text-secondary" /> طریقه ثبت‌نام <span className="text-danger">*</span>
                      </label>
                      <select
                        name="registrationMethod"
                        className="form-select rounded-3"
                        value={formData.registrationMethod}
                        onChange={handleInputChange}
                      >
                        <option value="online">آنلاین (وب‌سایت)</option>
                        <option value="in_person">حضوری (آموزشگاه)</option>
                        <option value="phone">تلفنی</option>
                      </select>
                    </div>

                    {/* طریقه آشنایی */}
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-bold text-dark">
                        <FiHelpCircle className="ms-1 text-secondary" /> نحوه آشنایی با آموزشگاه
                      </label>
                      <input
                        type="text"
                        name="referralSource"
                        className="form-control rounded-3"
                        placeholder="مثال: اینستاگرام، معرفی دوستان، بیلبورد"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* یادداشت و توضیحات تکمیلی */}
                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">
                        <FiFileText className="ms-1 text-secondary" /> یادداشت و توضیحات پرونده
                      </label>
                      <textarea
                        name="notes"
                        rows="2"
                        className="form-control rounded-3"
                        placeholder="توضیحات تکمیلی یا شرایط پرداخت..."
                        value={formData.notes}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

              </div>

              {/* فوتر مودال */}
              <div className="modal-footer bg-white px-4 py-3 border-top d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 rounded-3"
                  onClick={handleCloseAddModal}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 rounded-3 d-flex align-items-center gap-2 shadow-sm"
                >
                  <FiCheckCircle size={16} />
                  <span>ثبت نهایی پرونده</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}










    </div>
  );
}
