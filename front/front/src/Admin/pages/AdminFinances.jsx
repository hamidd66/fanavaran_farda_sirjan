import { useState } from 'react';
import {
  FiDollarSign,      // آیکون هدر
  FiCreditCard,      // شهریه
  FiTool,            // هزینه‌ها
  FiBriefcase,       // درآمد پروژه
  FiUsers,
  FiTrendingUp, FiTrendingDown, FiAlertCircle
} from 'react-icons/fi';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import "../style/AdminFinances.css";
import TuitionManagement from './TuitionManagement';
import TeacherSalaryManagement from './AdminTeacherSalaryManagement'; // <-- این خط اضافه شود
import AdminExpenseManagement from './AdminExpenseManagement'; // <-- این خط اضافه شود
import AdminProjectIncomeManagement from './AdminProjectIncomeManagement'; // <-- این خط اضافه شود
import AdminProjectWageManagement from './AdminProjectWageManagement'; // <-- این خط اضافه شود




import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  LabelList,AreaChart,Area 
} from 'recharts';




// ================= ۱. هدر اختصاصی امور مالی =================
const FinancePage = () => {
  // تب فعال — پیش‌فرض: شهریه
  const [activeTab, setActiveTab] = useState('dashboard');
  // ===== داده‌های نمونه برای گزارش‌ها (بعداً از API) =====
  const monthlyIncome = [
    { month: 'فروردین', income: 85, expense: 42 },
    { month: 'اردیبهشت', income: 95, expense: 48 },
    { month: 'خرداد', income: 120, expense: 55 },
    { month: 'تیر', income: 110, expense: 50 },
    { month: 'مرداد', income: 140, expense: 60 },
    { month: 'شهریور', income: 160, expense: 65 },
  ];

  const yearlyIncome = [
    { year: 1401, income: 620, expense: 300 },
    { year: 1402, income: 840, expense: 410 },
    { year: 1403, income: 1120, expense: 520 },
    { year: 1404, income: 1480, expense: 690 },
  ];

  const courseComparison = [
    { name: 'برنامه‌نویسی پایتون', students: 48, revenue: 42 },
    { name: 'فرانت‌اند', students: 36, revenue: 30 },
    { name: 'هوش مصنوعی', students: 28, revenue: 26 },
    { name: 'طراحی سایت', students: 22, revenue: 18 },
    { name: 'دیتاساینس', students: 15, revenue: 15 },
  ];

  const instructorComparison = [
    { name: 'استاد رضایی', students: 40, hours: 120 },
    { name: 'استاد کریمی', students: 34, hours: 98 },
    { name: 'استاد محمدی', students: 30, hours: 85 },
    { name: 'استاد احمدی', students: 18, hours: 55 },
  ];

  const debtors = [
    { name: 'علی محمدی', course: 'هوش مصنوعی', amount: 12, dueDate: '1404/06/15', status: 'overdue' },
    { name: 'زهرا حسینی', course: 'پایتون', amount: 8, dueDate: '1404/06/20', status: 'overdue' },
    { name: 'محمد کریمی', course: 'فرانت‌اند', amount: 6, dueDate: '1404/07/01', status: 'pending' },
    { name: 'سارا احمدی', course: 'دیتاساینس', amount: 4, dueDate: '1404/07/05', status: 'pending' },
  ];

  const kpis = [
    { title: 'درآمد ماه جاری', value: '۱۶۰ میلیون', change: '+۱۸٪', up: true, icon: <FiTrendingUp size={22} /> },
    { title: 'هزینه‌های ماه', value: '۶۵ میلیون', change: '+۷٪', up: false, icon: <FiTrendingDown size={22} /> },
    { title: 'سود خالص', value: '۹۵ میلیون', change: '+۲۴٪', up: true, icon: <FiDollarSign size={22} /> },
    { title: 'مطالبات (بدهکاران)', value: '۳۰ میلیون', change: '۴ نفر', up: false, icon: <FiAlertCircle size={22} /> },
  ];

  // نمایش صفحه مدیریت شهریه
  if (activeTab === 'tuition') {
    return (
      <TuitionManagement
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

  // نمایش صفحه حقوق و دستمزد اساتید
  if (activeTab === 'payroll') {
    return (
      <TeacherSalaryManagement
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

   // نمایش صفحه حقوق و دستمزد اساتید
  if (activeTab === 'adminexpensemanagement') {
    return (
      <AdminExpenseManagement
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

   // نمایش صفحه حقوق و دستمزد اساتید
  if (activeTab === 'adminprojectincomemanagement') {
    return (
      <AdminProjectIncomeManagement
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }

   // نمایش صفحه حقوق و دستمزد اساتید
  if (activeTab === 'adminprojectwagemanagement') {
    return (
      <AdminProjectWageManagement
        onBack={() => setActiveTab('dashboard')}
      />
    );
  }



  

  


  const CourseYAxisTick = ({ x, y, payload }) => {
  const text = payload?.value || '';

  return (
    <text
      x={x - 10}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#f59e0b"
      fontSize={12}
      fontWeight={600}
    >
      {text.length > 18 ? `${text.substring(0, 18)}…` : text}
    </text>
  );
};

const InstructorYAxisTick = ({ x, y, payload }) => {
  const text = payload?.value || '';

  return (
    <text
      x={x - 10}
      y={y}
      dy={4}
      textAnchor="end"
      fill="#0f766e"
      fontSize={12}
      fontWeight={600}
    >
      {text.length > 18 ? `${text.substring(0, 18)}…` : text}
    </text>
  );
};


  return (


    <div>



    
    <header className="admin-page-header">
      {/* سمت راست: عنوان و توضیحات */}
      <div className="d-flex align-items-center gap-3">
        <div className="admin-page-header-icon">
          <FiDollarSign size={26} />
        </div>
        <div className="admin-page-header-text">
          <h1 className="admin-page-title">امور مالی</h1>
          <p className="admin-page-subtitle">
            مدیریت شهریه‌ها، حقوق استادان، هزینه‌ها و مالی پروژه‌ها
          </p>
        </div>
      </div>

      {/* سمت چپ: ۵ دکمه بخش‌های مالی در یک ردیف منظم */}
      <div className="admin-page-header-actions d-flex align-items-center flex-wrap gap-2">

        {/* دکمه دستمزد پروژه‌ها */}
        <button
          type="button"
          className={`admin-btn-secondary order-5 ${activeTab === 'adminprojectwagemanagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('adminprojectwagemanagement')}
        >
          <FiUsers size={18} />
          <span>دستمزد پروژه</span>
        </button>

        {/* دکمه درآمد پروژه‌ها */}
        <button
          type="button"
          className={`admin-btn-secondary order-4 ${activeTab === 'adminprojectincomemanagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('adminprojectincomemanagement')}
        >
          <FiBriefcase size={18} />
          <span>درآمد پروژه</span>
        </button>

        {/* دکمه هزینه‌ها */}
        <button
          type="button"
          className={`admin-btn-secondary order-3 ${activeTab === 'adminexpensemanagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('adminexpensemanagement')}
        >
          <FiTool size={18} />
          <span>هزینه‌ها</span>
        </button>

        {/* دکمه حقوق و دستمزد استاد */}
        <button
          type="button"
          className={`admin-btn-secondary order-2 ${activeTab === 'payroll' ? 'active' : ''}`}
          onClick={() => setActiveTab('payroll')}
        >
          <FaMoneyCheckAlt size={18} />
          <span>حقوق</span>
        </button>

        {/* دکمه اصلی (پیش‌فرض): ثبت شهریه */}
        <button
          type="button"
          className={`admin-btn-primary order-1 ${activeTab === 'tuition' ? 'active' : ''}`}
          onClick={() => setActiveTab('tuition')}
        >
          <FiCreditCard size={20} />
          <span>شهریه</span>
        </button>
      </div>
    </header>


      {/* ================= ۲. کارت‌های شاخص کلیدی (KPI) ================= */}
      {/* ================= ۲. کارت‌های شاخص کلیدی (KPI) ================= */}
<div className="admin-stats-grid">
  {kpis.map((kpi, i) => {
    // تعیین رنگ کارت و نشانگر بر اساس مثبت/منفی بودن یا رنگ اختصاصی kpi
    const cardColor = kpi.color || (kpi.up ? '#10b981' : '#ef4444');

    return (
      <div 
        key={i} 
        className="admin-stat-card" 
        style={{ '--card-color': cardColor }}
      >
        <div 
          className="stat-card-icon" 
          style={{ 
            backgroundColor: `${cardColor}1f`, 
            color: cardColor 
          }}
        >
          {kpi.icon}
        </div>

        <div className="stat-card-info">
          <span className="stat-card-title">{kpi.title}</span>
          <span className="stat-card-value">{kpi.value}</span>
          <span className={`stat-trend-badge ${kpi.up ? 'positive' : 'warning'}`}>
            {kpi.up ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
            {' '}{kpi.change}
          </span>
        </div>
      </div>
    );
  })}
</div>


      {/* ================= ۳. نمودارهای اصلی ================= */}
      <div className="finance-charts-row">

        {/* درآمد ماه به ماه */}
        <div className="finance-chart-card">
          <div className="finance-chart-header">
            <h3>درآمد ماه‌به‌ماه</h3>
            <span>۱۴۰۴</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyIncome}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="income" name="درآمد" stroke="#4f46e5" fill="url(#incGrad)" />
              <Area type="monotone" dataKey="expense" name="هزینه" stroke="#ef4444" fill="#fee2e2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* درآمد سال به سال */}
        <div className="finance-chart-card">
          <div className="finance-chart-header">
            <h3>درآمد سال‌به‌سال</h3>
            <span>میلیون تومان</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={yearlyIncome}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name="درآمد" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="هزینه" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

     {/* ================= نمودارهای مقایسه‌ای ================= */}
<div className="finance-charts-row">

    {/* مقایسه دوره‌ها - نمودار دایره‌ای */}
  <div className="finance-chart-card">
  <div className="finance-chart-header">
    <h3>مقایسه عملکرد دوره‌ها</h3>
    <span>بر اساس تعداد هنرجو</span>
  </div>

  <ResponsiveContainer width="100%" height={340}>
    <PieChart>
      <defs>
        <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity="0.22" />
        </filter>

        <linearGradient id="pieGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>

        <linearGradient id="pieGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>

        <linearGradient id="pieGrad3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>

        <linearGradient id="pieGrad4" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <linearGradient id="pieGrad5" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      <Tooltip
        contentStyle={{
          border: 'none',
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.16)',
          direction: 'rtl',
        }}
        formatter={(value, name, props) => [`${value} هنرجو`, props.payload.name]}
      />

      <Pie
        data={courseComparison}
        dataKey="students"
        nameKey="name"
        cx="50%"
        cy="42%"
        innerRadius={45}
        outerRadius={110}
        paddingAngle={4}
        stroke="#ffffff"
        strokeWidth={3}
        isAnimationActive={true}
        label={({ name, percent }) =>
          ` (${Math.round(percent * 100)}%)`
        }
        labelLine={false}
        filter="url(#pieShadow)"
      >
        {courseComparison.map((entry, index) => {
          const fills = [
            'url(#pieGrad1)',
            'url(#pieGrad2)',
            'url(#pieGrad3)',
            'url(#pieGrad4)',
            'url(#pieGrad5)',
          ];
          return <Cell key={`cell-${index}`} fill={fills[index % fills.length]} />;
        })}
      </Pie>

      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        wrapperStyle={{
          paddingTop: '18px',
          fontSize: '13px',
          color: '#334155',
          direction: 'rtl',
        }}
        formatter={(value) => <span style={{ color: '#334155' }}>{value}</span>}
      />
    </PieChart>
  </ResponsiveContainer>
</div>




  {/* مقایسه استادها - نمودار ستونی */}
  <div className="finance-chart-card">
  <div className="finance-chart-header">
    <h3>مقایسه عملکرد استادها</h3>
    <span>بر اساس ساعت تدریس</span>
  </div>

  <ResponsiveContainer width="100%" height={340}>
    <BarChart
      data={instructorComparison}
      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
      barCategoryGap="18%"
    >
      <defs>
        <filter id="barShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.2" />
        </filter>

        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="4 4"
        stroke="#e2e8f0"
        vertical={false}
      />

      <XAxis
        dataKey="name"
        tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
        axisLine={false}
        tickLine={false}
        interval={0}
        angle={0}
      />

      <YAxis
        tick={{ fill: '#64748b', fontSize: 12 }}
        axisLine={false}
        tickLine={false}
      />

      <Tooltip
        contentStyle={{
          border: 'none',
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(15,23,42,0.16)',
          direction: 'rtl',
        }}
        formatter={(value) => [`${value} ساعت`, 'ساعت تدریس']}
      />

      <Legend
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        wrapperStyle={{
          paddingTop: '18px',
          fontSize: '13px',
          color: '#334155',
          direction: 'rtl',
        }}
        formatter={() => <span style={{ color: '#334155' }}>ساعت تدریس استادها</span>}
      />

      <Bar
        dataKey="hours"
        name="ساعت تدریس"
        fill="url(#barGrad1)"
        radius={[10, 10, 0, 0]}
        barSize={42}
        filter="url(#barShadow)"
      >
        <LabelList
          dataKey="hours"
          position="top"
          style={{ fill: '#0f172a', fontWeight: 700, fontSize: 12 }}
          formatter={(value) => `${value}`}
        />
        <LabelList
    dataKey="name"
    position="insideBottom"
    style={{ fill: '#ffffff', fontSize: 11, fontWeight: 700 }}
  />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>



</div>


      {/* ================= ۵. جدول بدهکاران ================= */}
      <div className="finance-chart-card finance-table-card">
        <div className="finance-chart-header">
          <h3>لیست بدهکاران (مطالبات شهریه)</h3>
          <span className="finance-badge text-white">۴ نفر</span>
        </div>
        <table className="finance-table">
          <thead>
            <tr>
              <th>نام هنرجو</th>
              <th>دوره</th>
              <th>مبلغ (میلیون)</th>
              <th>سررسید</th>
              <th>وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr key={i}>
                <td>{d.name}</td>
                <td>{d.course}</td>
                <td>{d.amount} میلیون</td>
                <td>{d.dueDate}</td>
                <td>
                  <span className={`finance-status ${d.status}`}>
                    {d.status === 'overdue' ? 'سررسید گذشته' : 'در انتظار'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
</div>
  );
};

export default FinancePage;
