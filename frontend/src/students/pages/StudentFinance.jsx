import React, { useState } from 'react';
import {
  FaWallet,
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaReceipt,
  FaHistory,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaTimes,
  FaShieldAlt,
  FaFileInvoiceDollar,
  FaArrowLeft,
  FaBuilding
} from 'react-icons/fa';
import '../styles/StudentFinance.css';

const StudentFinance = () => {
  // فیلتر دوره‌ها: همه، تسویه‌شده، بدهکار
  const [activeFilter, setActiveFilter] = useState('all');

  // استیت‌های مودال
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'details' | 'payment' | null

  // استیت مدیریت پرداخت آنلاین
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedGateway, setSelectedGateway] = useState('mellat');

  // داده‌های فرضی دوره‌ها و پرداخت‌های هنرجو در فناوران فردا
  const [coursesFinance, setCoursesFinance] = useState([
    {
      id: 'fin-01',
      title: 'دوره جامع React & Next.js و معماری مدرن فرانت‌اند',
      code: 'CS-RCT-402',
      instructor: 'مهندس حمید پورفریدونی',
      term: 'بهار و تابستان ۱۴۰۳',
      totalTuition: 8500000,
      totalPaid: 8500000,
      balance: 0,
      status: 'settled', // 'settled' (تسویه) | 'indebted' (بدهکار)
      transactions: [
        {
          id: 'TX-9841',
          date: '۱۴۰۳/۰۱/۲۵ - ساعت ۱۰:۱۴',
          amount: 4500000,
          method: 'درگاه آنلاین به‌پرداخت ملت',
          refCode: '984102938471',
          status: 'success',
          note: 'پیش‌پرداخت اولیه ثبت‌نام'
        },
        {
          id: 'TX-9965',
          date: '۱۴۰۳/۰۳/۰۴ - ساعت ۱۷:۳۲',
          amount: 4000000,
          method: 'درگاه آنلاین سامان کیش',
          refCode: '996510394852',
          status: 'success',
          note: 'تسویه کامل قسط دوم دوره'
        }
      ]
    },
    {
      id: 'fin-02',
      title: 'متخصص هوش مصنوعی، یادگیری عمیق و ماشین لرنینگ با پایتون',
      code: 'AI-PYT-204',
      instructor: 'مهندس حمید پورفریدونی',
      term: 'تابستان و پاییز ۱۴۰۳',
      totalTuition: 11000000,
      totalPaid: 6000000,
      balance: 5000000,
      status: 'indebted',
      dueDate: '۱۴۰۳/۰۷/۱۵',
      transactions: [
        {
          id: 'TX-10452',
          date: '۱۴۰۳/۰۴/۱۸ - ساعت ۱۱:۰۵',
          amount: 6000000,
          method: 'درگاه آنلاین به‌پرداخت ملت',
          refCode: '104529381920',
          status: 'success',
          note: 'قسط اول و شهریه ورود به دوره هوش مصنوعی'
        }
      ]
    },
    {
      id: 'fin-03',
      title: 'توسعه بک‌اند پیشرفته با C# و ASP.NET Core Web API',
      code: 'CS-NET-101',
      instructor: 'دپارتمان مهندسی نرم‌افزار',
      term: 'زمستان ۱۴۰۲',
      totalTuition: 7500000,
      totalPaid: 7500000,
      balance: 0,
      status: 'settled',
      transactions: [
        {
          id: 'TX-8712',
          date: '۱۴۰۲/۰۹/۲۸ - ساعت ۱۴:۴۵',
          amount: 7500000,
          method: 'کارت به کارت (حساب آموزشگاه فناوران فردا)',
          refCode: '8712039182',
          status: 'success',
          note: 'پرداخت یکجا با تخفیف ثبت‌نام نقدی'
        }
      ]
    }
  ]);

  // محاسبات مجموع مالی
  const totalAllTuition = coursesFinance.reduce((sum, c) => sum + c.totalTuition, 0);
  const totalAllPaid = coursesFinance.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalAllBalance = coursesFinance.reduce((sum, c) => sum + c.balance, 0);

  // فیلتر کردن کارت‌ها
  const filteredCourses = coursesFinance.filter(c => {
    if (activeFilter === 'settled') return c.status === 'settled';
    if (activeFilter === 'indebted') return c.status === 'indebted';
    return true;
  });

  // هندلر باز کردن مودال پرداخت
  const handleOpenPayment = (course = null) => {
    setSelectedCourse(course);
    if (course) {
      setPaymentAmount(course.balance);
    } else {
      setPaymentAmount(totalAllBalance);
    }
    setActiveModal('payment');
  };

  // هندلر باز کردن مودال جزئیات تراکنش
  const handleOpenDetails = (course) => {
    setSelectedCourse(course);
    setActiveModal('details');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedCourse(null);
  };

  // شبیه‌سازی اتصال به درگاه بانکی
  const handleProceedToGateway = (e) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      alert('لطفاً مبلغ معتبری برای پرداخت وارد نمایید.');
      return;
    }
    alert(
      `در حال انتقال امن به درگاه شاپرک (${
        selectedGateway === 'mellat' ? 'به‌پرداخت ملت' : 'سامان کیش'
      })...\nمبلغ قابل پرداخت: ${paymentAmount.toLocaleString('fa-IR')} تومان`
    );
  };

  return (
    <div className="finance-page-container">
      {/* ========================================================
          ۱. بنر شیک وضعیت کلی مالی هنرجو (Financial Overview Hero)
      ======================================================== */}
      <div className="finance-hero-panel">
        <div className="finance-hero-header">
          <div className="hero-title-wrap">
            <div className="wallet-badge">
              <FaWallet />
            </div>
            <div>
              <h2>وضعیت مالی و حسابداری آموزشی</h2>
              <p>مشاهده شفاف شهریه‌ها، مانده حساب دوره‌ها و درگاه پرداخت آنلاین شاپرک</p>
            </div>
          </div>

          {/* دکمه پرداخت آنلاین سریع بدهی کل */}
          {totalAllBalance > 0 && (
            <button
              className="pay-global-btn"
              onClick={() => handleOpenPayment(null)}
            >
              <FaCreditCard />
              <span>تسویه و پرداخت آنلاین مانده حساب</span>
              <FaArrowLeft />
            </button>
          )}
        </div>

        {/* ۴ باکس تحلیلی مشخصات مالی */}
        <div className="finance-summary-grid">
          <div className="fin-stat-card">
            <span className="stat-label">مجموع کل شهریه‌ها</span>
            <strong className="stat-value">{totalAllTuition.toLocaleString('fa-IR')}</strong>
            <span className="stat-unit">تومان</span>
          </div>

          <div className="fin-stat-card stat-success">
            <span className="stat-label">مجموع پرداخت شده</span>
            <strong className="stat-value text-green">{totalAllPaid.toLocaleString('fa-IR')}</strong>
            <span className="stat-unit">تومان</span>
          </div>

          <div className={`fin-stat-card ${totalAllBalance > 0 ? 'stat-danger' : 'stat-settled'}`}>
            <span className="stat-label">مانده بدهی کل هنرجو</span>
            <strong className={`stat-value ${totalAllBalance > 0 ? 'text-red' : 'text-green'}`}>
              {totalAllBalance.toLocaleString('fa-IR')}
            </strong>
            <span className="stat-unit">تومان</span>
          </div>

          <div className="fin-stat-card">
            <span className="stat-label">وضعیت کلی پرونده</span>
            <div className="status-indicator-box">
              {totalAllBalance === 0 ? (
                <span className="badge-status-green">
                  <FaCheckCircle /> فاقد بدهی (تسویه کامل)
                </span>
              ) : (
                <span className="badge-status-warning">
                  <FaExclamationTriangle /> دارای اقساط باز
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ۲. بار فیلتر کارت‌ها
      ======================================================== */}
      <div className="finance-filters-bar">
        <div className="filters-group">
          <button
            className={`fin-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            همه دوره‌ها ({coursesFinance.length})
          </button>
          <button
            className={`fin-filter-btn ${activeFilter === 'indebted' ? 'active' : ''}`}
            onClick={() => setActiveFilter('indebted')}
          >
            دوره‌های دارای بدهی / اقساط ({coursesFinance.filter(c => c.status === 'indebted').length})
          </button>
          <button
            className={`fin-filter-btn ${activeFilter === 'settled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('settled')}
          >
            دوره‌های کاملاً تسویه‌شده ({coursesFinance.filter(c => c.status === 'settled').length})
          </button>
        </div>
      </div>

      {/* ========================================================
          ۳. شبکه کارت‌های دوره‌ها همراه با جزئیات کامل
      ======================================================== */}
      <div className="courses-finance-grid">
        {filteredCourses.map(course => {
          const isSettled = course.status === 'settled';

          return (
            <div
              key={course.id}
              className={`course-fin-card ${isSettled ? 'card-settled' : 'card-indebted'}`}
            >
              {/* برچسب استامپ بزرگ و چشم‌نواز تسویه یا بدهکار */}
              <div className={`fin-stamp-badge ${isSettled ? 'stamp-settled' : 'stamp-indebted'}`}>
                {isSettled ? (
                  <>
                    <FaCheckCircle /> تسویه کامل
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle /> بدهکار (اقساطی)
                  </>
                )}
              </div>

              {/* مشخصات دوره */}
              <div className="card-top-info">
                <div className="course-title-section">
                  <h3>{course.title}</h3>
                  <span className="course-code-tag">{course.code}</span>
                </div>

                <div className="course-meta-row">
                  <span className="meta-item">
                    <FaChalkboardTeacher /> مدرس: {course.instructor}
                  </span>
                  <span className="meta-item">
                    <FaCalendarAlt /> نیم‌سال: {course.term}
                  </span>
                </div>
              </div>

              {/* باکس ارقام و نقدینگی دوره */}
              <div className="course-figures-box">
                <div className="figures-row">
                  <span className="f-title">شهریه مصوب دوره:</span>
                  <span className="f-val-main">{course.totalTuition.toLocaleString('fa-IR')} تومان</span>
                </div>

                <div className="figures-row sub">
                  <span className="f-title">مبلغ واریزی تا امروز:</span>
                  <span className="f-val text-green">{course.totalPaid.toLocaleString('fa-IR')} تومان</span>
                </div>

                <div className="figures-separator"></div>

                <div className="figures-row highlight-balance">
                  <span className="f-title">مانده بدهی این دوره:</span>
                  <strong className={`f-val-big ${isSettled ? 'text-green' : 'text-red'}`}>
                    {course.balance === 0 ? '۰ تومان (تسویه)' : `${course.balance.toLocaleString('fa-IR')} تومان`}
                  </strong>
                </div>

                {!isSettled && course.dueDate && (
                  <div className="due-date-notice">
                    مهلت پرداخت قسط بعدی: <strong>{course.dueDate}</strong>
                  </div>
                )}
              </div>

              {/* دکمه‌های اقدام و تعامل */}
              <div className="course-fin-actions">
                <button
                  className="btn-action-details"
                  onClick={() => handleOpenDetails(course)}
                >
                  <FaHistory /> جزئیات و تاریخچه پرداخت‌ها ({course.transactions.length})
                </button>

                {!isSettled && (
                  <button
                    className="btn-action-pay"
                    onClick={() => handleOpenPayment(course)}
                  >
                    <FaCreditCard /> پرداخت آنلاین مانده دوره
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          ۴. مودال جزئیات پرداخت‌ها و فاکتورها
      ======================================================== */}
      {activeModal === 'details' && selectedCourse && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaReceipt style={{ color: '#2563eb' }} />
                ریزتراکنش‌ها و تاریخچه پرداخت: {selectedCourse.title}
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              {/* باکس خلاصه نقدینگی این دوره درون مودال */}
              <div className="modal-finance-summary">
                <div className="m-fin-col">
                  <span>شهریه کل دوره:</span>
                  <strong>{selectedCourse.totalTuition.toLocaleString('fa-IR')} تومان</strong>
                </div>
                <div className="m-fin-col">
                  <span>کل پرداختی:</span>
                  <strong className="text-green">{selectedCourse.totalPaid.toLocaleString('fa-IR')} تومان</strong>
                </div>
                <div className="m-fin-col">
                  <span>مانده حساب:</span>
                  <strong className={selectedCourse.balance > 0 ? 'text-red' : 'text-green'}>
                    {selectedCourse.balance.toLocaleString('fa-IR')} تومان
                  </strong>
                </div>
              </div>

              <div className="tx-table-wrapper">
                <table className="tx-modern-table">
                  <thead>
                    <tr>
                      <th>کد رهگیری</th>
                      <th>تاریخ و ساعت</th>
                      <th>مبلغ پرداختی</th>
                      <th>روش واریز</th>
                      <th>شماره پیگیری شتاب</th>
                      <th>وضعیت</th>
                      <th>توضیحات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.transactions.map(tx => (
                      <tr key={tx.id}>
                        <td><span className="tx-code-badge">{tx.id}</span></td>
                        <td>{tx.date}</td>
                        <td className="tx-amount">{tx.amount.toLocaleString('fa-IR')} تومان</td>
                        <td>{tx.method}</td>
                        <td className="tx-ref">{tx.refCode}</td>
                        <td>
                          <span className="tx-status-success">
                            <FaCheckCircle /> موفق
                          </span>
                        </td>
                        <td className="tx-note">{tx.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="receipt-footer-notice">
                <FaShieldAlt /> کلیه تراکنش‌ها با نظارت واحد مالی آموزشگاه فناوران فردا ثبت و سند معتبر حسابداری صادر شده است.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ۵. مودال پرداخت آنلاین به درگاه بانکی
      ======================================================== */}
      {activeModal === 'payment' && (
        <div className="std-modal-overlay" onClick={handleCloseModal}>
          <div className="std-modal-container modal-payment-box" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaFileInvoiceDollar style={{ color: '#16a34a' }} />
                اتصال امن به درگاه پرداخت آنلاین
              </h3>
              <button className="std-modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <form onSubmit={handleProceedToGateway}>
                <div className="payment-target-info">
                  <span>دوره مقصد:</span>
                  <strong>{selectedCourse ? selectedCourse.title : 'تسویه تجمیعی تمام دوره‌ها'}</strong>
                </div>

                {/* فیلد مبلغ پرداخت */}
                <div className="form-group-payment">
                  <label>مبلغ قابل پرداخت (تومان):</label>
                  <input
                    type="number"
                    className="payment-input"
                    value={paymentAmount}
                    onChange={e => setPaymentAmount(Number(e.target.value))}
                    min="1000"
                    required
                  />
                  <span className="amount-in-words">
                    {paymentAmount > 0 ? `${paymentAmount.toLocaleString('fa-IR')} تومان` : '۰ تومان'}
                  </span>
                </div>

                {/* انتخاب درگاه بانکی */}
                <div className="gateway-selection">
                  <label>انتخاب درگاه بانکی مجاز:</label>
                  <div className="gateway-cards-grid">
                    <label className={`gateway-card ${selectedGateway === 'mellat' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gateway"
                        value="mellat"
                        checked={selectedGateway === 'mellat'}
                        onChange={() => setSelectedGateway('mellat')}
                      />
                      <FaBuilding className="gw-icon text-red" />
                      <div>
                        <strong>به‌پرداخت ملت</strong>
                        <small>تمامی کارت‌های عضو شتاب</small>
                      </div>
                    </label>

                    <label className={`gateway-card ${selectedGateway === 'saman' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="gateway"
                        value="saman"
                        checked={selectedGateway === 'saman'}
                        onChange={() => setSelectedGateway('saman')}
                      />
                      <FaBuilding className="gw-icon text-blue" />
                      <div>
                        <strong>سامان کیش</strong>
                        <small>سرعت بالا و اتصال مستقیم</small>
                      </div>
                    </label>
                  </div>
                </div>

                {/* اطلاعیه امنیتی شاپرک */}
                <div className="shaparak-security-note">
                  <FaShieldAlt />
                  <p>
                    پرداخت در بستر شبکه تبادل اطلاعات بانکی (شاپرک) با پروتکل رمزنگاری SSL انجام خواهد شد.
                  </p>
                </div>

                {/* دکمه انتقال */}
                <div className="payment-modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                    انصراف
                  </button>
                  <button type="submit" className="btn-confirm-pay">
                    <FaCreditCard /> ورود به درگاه شاپرک
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

export default StudentFinance;
