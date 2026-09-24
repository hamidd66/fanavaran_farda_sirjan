import React, { useState, useMemo } from 'react';
import {
  FiSend,
  FiMessageSquare,
  FiRadio,
  FiAlertTriangle,
  FiUsers,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiSearch,
  FiFilter,
  FiToggleLeft,
  FiToggleRight,
  FiPaperclip,
  FiUserCheck,
  FiShield,
  FiClock,
  FiTrash2,
  FiInfo,
  FiTrendingUp,
  FiArrowRight,
  FiLayers
} from 'react-icons/fi';
import '../style/AdminMessages.css';
import '../style/AdminCompetitionManagement.css';




export default function AdminMessages() {
  // تب‌های اصلی
  const [activeTab, setActiveTab] = useState('broadcasts'); // broadcasts | direct | monitor | alerts
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // داده‌های نمونه پیام‌های همگانی (Broadcasts)
  const [broadcasts, setBroadcasts] = useState([
    {
      id: 1,
      title: 'اطلاعیه شروع دوره‌های ترم پاییز ۱۴۰۵',
      content: 'کلیه کلاس‌های برنامه‌نویسی React و Python از روز شنبه طبق تقویم آموزشی تشکیل خواهد شد.',
      sender_role: 'admin',
      target_audience: 'all_students',
      priority: 'important',
      is_active: true,
      created_at: '۱۴۰۵/۰۷/۰۱ - ۱۰:۳۰',
      views_count: 142
    },
    {
      id: 2,
      title: 'جلسه هماهنگی اساتید هوش مصنوعی و فرانت‌اند',
      content: 'لطفاً سرفصل‌های نهایی پروژه عملی را تا پیش از سه‌شنبه در سامانه ثبت فرمایید.',
      sender_role: 'admin',
      target_audience: 'all_teachers',
      priority: 'emergency',
      is_active: true,
      created_at: '۱۴۰۵/۰۷/۰۴ - ۱۶:۰۰',
      views_count: 18
    },
    {
      id: 3,
      title: 'یادآوری تمدید ثبت‌نام تخفیف مسابقات کدنویسی',
      content: 'هنرجویان متقاضی مسابقه الگوریتم می‌توانند از کد تخفیف FANAVARAN50 استفاده کنند.',
      sender_role: 'admin',
      target_audience: 'all_students',
      priority: 'normal',
      is_active: false,
      created_at: '۱۴۰۵/۰۶/۲۵ - ۰۹:۱۵',
      views_count: 89
    }
  ]);

  // گفتگوهای دونفره مستقیم مدیر
  const [directThreads, setDirectThreads] = useState([
    {
      id: 101,
      user_id: 1,
      user_name: 'علیرضا تقوی',
      role: 'student',
      avatar: '👨‍🎓',
      course_name: 'دوره React جامع',
      last_message: 'استاد گفتند برای تایید مدرک با مدیریت هماهنگ بشم.',
      last_message_at: '۱۰ دقیقه پیش',
      unread_count: 2,
      messages: [
        { id: 1, sender: 'student', text: 'سلام و وقت بخیر خدمت مدیریت محترم', time: '۱۱:۲۰' },
        { id: 2, sender: 'student', text: 'استاد گفتند برای تایید مدرک با مدیریت هماهنگ بشم.', time: '۱۱:۲۱' }
      ]
    },
    {
      id: 102,
      user_id: 2,
      user_name: 'مهندس رضایی',
      role: 'teacher',
      avatar: '👨‍🏫',
      course_name: 'مدرس پایگاه داده و C#',
      last_message: 'لیست حضور و غیاب جلسه آخر ثبت شد.',
      last_message_at: '۱ ساعت پیش',
      unread_count: 0,
      messages: [
        { id: 1, sender: 'teacher', text: 'سلام، لیست حضور و غیاب جلسه آخر ثبت شد.', time: '۱۰:۰۵' },
        { id: 2, sender: 'admin', text: 'سلام مهندس جان، متشکرم بررسی می‌شود.', time: '۱۰:۱۰' }
      ]
    }
  ]);

  const [selectedDirectThread, setSelectedDirectThread] = useState(directThreads[0]);
  const [replyText, setReplyText] = useState('');

  // مکالمات استاد و هنرجو (جهت نظارت مدیریت - Spy & Audit)
  const [monitoredThreads, setMonitoredThreads] = useState([
    {
      id: 201,
      teacher_name: 'مهندس سهرابی (مدرس جنگو)',
      student_name: 'سارا محمدی (هنرجو)',
      course_name: 'دوره جامع جنگو و پایتون',
      last_update: 'دیروز ۱۸:۴۵',
      status: 'active',
      messages: [
        { id: 1, sender: 'هنرجو', text: 'سلام استاد، در بخش ORM به ارور برخورد کردم کدم رو فرستادم.', time: '۱۸:۳۰' },
        { id: 2, sender: 'استاد', text: 'سلام، کوئری رو با select_related فیلتر کنید مشکل حل میشه.', time: '۱۸:۴۵' }
      ]
    },
    {
      id: 202,
      teacher_name: 'استاد کریمی (مدرس UI/UX)',
      student_name: 'محمد شمس (هنرجو)',
      course_name: 'طراحی رابط کاربری فیگما',
      last_update: '۲ روز پیش',
      status: 'flagged',
      messages: [
        { id: 1, sender: 'هنرجو', text: 'استاد چرا نمره تمرین من رو هنوز ثبت نکردید؟', time: '۰۹:۳۰' },
        { id: 2, sender: 'استاد', text: 'فایل شما باز نشد، لطفاً مجدد در پنل آپلود کنید.', time: '۱۴:۱۵' }
      ]
    }
  ]);

  const [selectedMonitoredThread, setSelectedMonitoredThread] = useState(null);

  // هشدارهای هوشمند سیستمی (System Alerts)
  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 301,
      recipient_name: 'نیما خادمی (هنرجو)',
      course_name: 'فرانت‌اند React',
      trigger_type: 'غیبت غیرمجاز',
      severity: 'danger',
      title: 'هشدار ۳ جلسه غیبت متوالی',
      message: 'هنرجو در آستانه حذف از دوره آموزشی به دلیل غیبت بیش از سقف مجاز قرار دارد.',
      created_at: 'امروز ۰۸:۳۰',
      is_resolved: false
    },
    {
      id: 302,
      recipient_name: 'مهندس فلاح (مدرس هوش مصنوعی)',
      course_name: 'پایتون و یادگیری ماشین',
      trigger_type: 'تاخیر ثبت نمرات',
      severity: 'warning',
      title: 'عدم ثبت نمرات پروژه پایانی',
      message: 'مهلت ثبت نمرات نهایی هنرجویان ۴۸ ساعت است که منقضی شده است.',
      created_at: 'دیروز ۱۲:۱۵',
      is_resolved: false
    },
    {
      id: 303,
      recipient_name: 'امیرحسین رضوی (هنرجو)',
      course_name: 'طراحی وب مقدماتی',
      trigger_type: 'افت نمره',
      severity: 'warning',
      title: 'کسب نمره زیر حد نصاب (۹ از ۲۰)',
      message: 'سیستم به صورت خودکار تمرین جبرانی برای این هنرجو فعال نموده است.',
      created_at: '۳ روز پیش',
      is_resolved: true
    }
  ]);

  // مودال ارسال پیام همگانی جدید
  const [isNewBroadcastModalOpen, setIsNewBroadcastModalOpen] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    content: '',
    target_audience: 'all_students',
    priority: 'normal'
  });

  // مودال ارسال پیام مستقیم جدید به کاربر
  const [isNewDirectModalOpen, setIsNewDirectModalOpen] = useState(false);
  const [newDirectForm, setNewDirectForm] = useState({
    recipient_role: 'student',
    user_id: '',
    title: '',
    message: ''
  });

  // تغییر وضعیت فعال/غیرفعال اطلاعیه همگانی
  const handleToggleBroadcast = (id) => {
    setBroadcasts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_active: !item.is_active } : item))
    );
  };

  // ارسال پاسخ مستقیم مدیر
  const handleSendDirectReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'admin',
      text: replyText,
      time: 'هم‌اکنون'
    };

    const updatedThreads = directThreads.map((t) => {
      if (t.id === selectedDirectThread.id) {
        return {
          ...t,
          last_message: replyText,
          last_message_at: 'هم‌اکنون',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    });

    setDirectThreads(updatedThreads);
    setSelectedDirectThread((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg]
    }));
    setReplyText('');
  };

  // ثبت پیام همگانی جدید
  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.content) return;

    const newBroadcast = {
      id: Date.now(),
      ...broadcastForm,
      sender_role: 'admin',
      is_active: true,
      created_at: 'هم‌اکنون',
      views_count: 0
    };

    setBroadcasts([newBroadcast, ...broadcasts]);
    setIsNewBroadcastModalOpen(false);
    setBroadcastForm({ title: '', content: '', target_audience: 'all_students', priority: 'normal' });
  };

  // آمار کارت‌های بالای صفحه (KPIs)
  const totalBroadcasts = broadcasts.length;
  const activeBroadcasts = broadcasts.filter((b) => b.is_active).length;
  const totalUnreadDirect = directThreads.reduce((sum, t) => sum + (t.unread_count || 0), 0);
  const totalCriticalAlerts = systemAlerts.filter((a) => a.severity === 'danger' && !a.is_resolved).length;

  return (
    <div className="admin-page-container">
      {/* هدر صفحه */}
      <div className="admin-page-header">
        <div className="admin-page-header-text">
          <div className="admin-page-header-icon">
            <FiMessageSquare size={26} />
          </div>
          <div>
            <h1 className="admin-page-title">مرکز مدیریت پیام‌ها و ارتباطات</h1>
            <p className="admin-page-subtitle">
              ارسال پیام‌های همگانی، پاسخ به پیام‌های مستقیم، نظارت بر مکالمات و بررسی هشدارهای هوشمند سیستم
            </p>
          </div>
        </div>

        <div className="admin-page-header-actions">
          <button
            className="admin-btn-primary"
            onClick={() => setIsNewBroadcastModalOpen(true)}
          >
            <FiRadio size={18} />
            <span>ارسال اطلاعیه همگانی</span>
          </button>
          <button
            className="admin-btn-secondary"
            onClick={() => setIsNewDirectModalOpen(true)}
          >
            <FiPlus size={18} />
            <span>پیام جدید به کاربر</span>
          </button>
        </div>
      </div>

      {/* کارت‌های آماری (KPIs) با سیستم رنگی ادمین */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ '--card-color': '#2563eb' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb' }}>
            <FiRadio size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">اطلاعیه‌های همگانی فعال</span>
            <span className="stat-card-value">{activeBroadcasts} <small className="text-muted" style={{ fontSize: '13px' }}>از {totalBroadcasts}</small></span>
            <span className="stat-trend-badge positive">
              <FiCheckCircle size={12} /> در حال نمایش در پنل‌ها
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#8b5cf6' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <FiMessageSquare size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">پیام‌های شخصی منتظر پاسخ</span>
            <span className="stat-card-value">{totalUnreadDirect}</span>
            <span className="stat-trend-badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <FiClock size={12} /> گفتگوهای مستقیم مدیریت
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#10b981' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <FiShield size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">گفتگوهای تحت نظارت</span>
            <span className="stat-card-value">{monitoredThreads.length}</span>
            <span className="stat-trend-badge positive">
              <FiUsers size={12} /> مکالمات استاد و هنرجو
            </span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ '--card-color': '#ef4444' }}>
          <div className="stat-card-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <FiAlertTriangle size={24} />
          </div>
          <div className="stat-card-info">
            <span className="stat-card-title">هشدارهای بحرانی سیستم</span>
            <span className="stat-card-value">{totalCriticalAlerts}</span>
            <span className="stat-trend-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <FiAlertTriangle size={12} /> غیبت و افت تحصیلی
            </span>
          </div>
        </div>
      </div>

      {/* سوئیچ تب‌های اصلی */}
      <div className="messenger-nav-tabs">
        <button
          className={`messenger-nav-tab ${activeTab === 'broadcasts' ? 'active' : ''}`}
          onClick={() => setActiveTab('broadcasts')}
        >
          <FiRadio size={18} />
          <span>اطلاعیه‌های همگانی</span>
          <span className="tab-count-badge">{broadcasts.length}</span>
        </button>

        <button
          className={`messenger-nav-tab ${activeTab === 'direct' ? 'active' : ''}`}
          onClick={() => setActiveTab('direct')}
        >
          <FiSend size={18} />
          <span>پیام‌های مستقیم مدیریت</span>
          {totalUnreadDirect > 0 && <span className="tab-count-badge unread">{totalUnreadDirect}</span>}
        </button>

        <button
          className={`messenger-nav-tab ${activeTab === 'monitor' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitor')}
        >
          <FiShield size={18} />
          <span>نظارت بر چت‌های استاد و هنرجو</span>
        </button>

        <button
          className={`messenger-nav-tab ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <FiAlertTriangle size={18} />
          <span>هشدارهای خودکار سیستم</span>
          <span className="tab-count-badge danger">{systemAlerts.filter(a => !a.is_resolved).length}</span>
        </button>
      </div>

      {/* ================= تب ۱: اطلاعیه‌های همگانی (Broadcasts) ================= */}
      {activeTab === 'broadcasts' && (
        <div className="admin-table-card">
          <div className="messenger-toolbar">
            <div className="admin-search-box">
              <FiSearch className="admin-search-icon" />
              <input
                type="text"
                placeholder="جستجو در عنوان یا متن اطلاعیه همگانی..."
                className="admin-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="messenger-toolbar-actions">
              <button
                className="admin-btn-primary"
                onClick={() => setIsNewBroadcastModalOpen(true)}
              >
                <FiPlus size={16} />
                <span>اطلاعیه جدید</span>
              </button>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>عنوان اطلاعیه</th>
                  <th>مخاطبان هدف</th>
                  <th>اولویت</th>
                  <th>تاریخ ارسال</th>
                  <th>تعداد بازدید</th>
                  <th>وضعیت انتشار (تیک نمایش)</th>
                  <th style={{ textAlign: 'center' }}>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {broadcasts
                  .filter((b) => b.title.includes(searchQuery) || b.content.includes(searchQuery))
                  .map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="broadcast-title-cell">
                          <strong>{item.title}</strong>
                          <p>{item.content.substring(0, 70)}...</p>
                        </div>
                      </td>
                      <td>
                        <span className="audience-tag">
                          {item.target_audience === 'all_students'
                            ? '🎓 تمام هنرجویان'
                            : item.target_audience === 'all_teachers'
                            ? '👨‍🏫 تمام اساتید'
                            : '📚 کلاس اختصاصی'}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge ${item.priority}`}>
                          {item.priority === 'emergency'
                            ? 'فوری و مهم'
                            : item.priority === 'important'
                            ? 'مهم'
                            : 'عادی'}
                        </span>
                      </td>
                      <td className="text-muted">{item.created_at}</td>
                      <td>
                        <div className="views-badge">
                          <FiEye size={14} />
                          <span>{item.views_count} نفر</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={`status-toggle-btn ${item.is_active ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleBroadcast(item.id)}
                          title="کلیک برای فعال/غیرفعال کردن نمایش در پنل‌ها"
                        >
                          {item.is_active ? (
                            <>
                              <FiToggleRight size={22} className="toggle-icon-on" />
                              <span>در حال نمایش (فعال)</span>
                            </>
                          ) : (
                            <>
                              <FiToggleLeft size={22} className="toggle-icon-off" />
                              <span>مخفی شده (غیرفعال)</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td>
                        <div className="admin-actions-group" style={{ justifyContent: 'center' }}>
                          <button
                            className="admin-action-btn delete"
                            title="حذف اطلاعیه"
                            onClick={() => setBroadcasts(broadcasts.filter((b) => b.id !== item.id))}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= تب ۲: پیام‌های مستقیم مدیریت (Direct Messenger) ================= */}
      {activeTab === 'direct' && (
        <div className="direct-messenger-layout">
          {/* لیست گفتگوها */}
          <div className="direct-threads-sidebar">
            <div className="threads-search-box">
              <FiSearch size={16} />
              <input type="text" placeholder="جستجوی شخص یا دوره..." />
            </div>

            <div className="threads-list">
              {directThreads.map((thread) => (
                <div
                  key={thread.id}
                  className={`thread-item-card ${selectedDirectThread.id === thread.id ? 'active' : ''}`}
                  onClick={() => setSelectedDirectThread(thread)}
                >
                  <div className="thread-avatar">{thread.avatar}</div>
                  <div className="thread-meta">
                    <div className="thread-top">
                      <h4 className="thread-name">{thread.user_name}</h4>
                      <span className="thread-time">{thread.last_message_at}</span>
                    </div>
                    <span className="thread-role-badge">
                      {thread.role === 'teacher' ? 'مدرس دوره' : 'هنرجو'} - {thread.course_name}
                    </span>
                    <p className="thread-last-msg">{thread.last_message}</p>
                  </div>
                  {thread.unread_count > 0 && (
                    <span className="thread-unread-pill">{thread.unread_count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* محتوای چت انتخابی */}
          <div className="direct-chat-window">
            <div className="chat-window-header">
              <div className="chat-user-info">
                <div className="thread-avatar">{selectedDirectThread.avatar}</div>
                <div>
                  <h3>{selectedDirectThread.user_name}</h3>
                  <span>{selectedDirectThread.course_name} ({selectedDirectThread.role === 'teacher' ? 'استاد' : 'هنرجو'})</span>
                </div>
              </div>

              <div className="chat-header-actions">
                <button className="admin-btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <FiUserCheck size={14} /> مشاهده پرونده آموزشی
                </button>
              </div>
            </div>

            <div className="chat-messages-container">
              {selectedDirectThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'admin' ? 'admin' : 'incoming'}`}
                >
                  <div className="chat-bubble">
                    <p className="chat-text">{msg.text}</p>
                    <span className="chat-timestamp">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-bar" onSubmit={handleSendDirectReply}>
              <button type="button" className="chat-attachment-btn" title="پیوست فایل یا تمرین">
                <FiPaperclip size={18} />
              </button>
              <input
                type="text"
                placeholder="پاسخ خود را بنویسید..."
                className="chat-text-input"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">
                <FiSend size={18} />
                <span>ارسال پاسخ</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= تب ۳: نظارت بر پیام‌های استاد و هنرجو (Monitoring) ================= */}
      {activeTab === 'monitor' && (
        <div className="admin-table-card">
          <div className="messenger-toolbar">
            <div className="admin-search-box">
              <FiSearch className="admin-search-icon" />
              <input type="text" placeholder="جستجو بر اساس نام استاد، هنرجو یا نام دوره..." className="admin-search-input" />
            </div>
            <div className="monitor-notice-badge">
              <FiShield size={16} />
              <span>قابلیت نظارت و داوری مکالمات توسط مدیریت آموزشگاه</span>
            </div>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام مدرس</th>
                  <th>نام هنرجو</th>
                  <th>عنوان دوره</th>
                  <th>آخرین پیام رد و بدل شده</th>
                  <th>زمان آخرین فعالیت</th>
                  <th>وضعیت گفتگو</th>
                  <th style={{ textAlign: 'center' }}>مشاهده کامل مکالمه</th>
                </tr>
              </thead>
              <tbody>
                {monitoredThreads.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.teacher_name}</strong>
                    </td>
                    <td>{item.student_name}</td>
                    <td>
                      <span className="course-tag">{item.course_name}</span>
                    </td>
                    <td className="text-muted">
                      {item.messages[item.messages.length - 1]?.text.substring(0, 45)}...
                    </td>
                    <td>{item.last_update}</td>
                    <td>
                      {item.status === 'flagged' ? (
                        <span className="priority-badge emergency">نیازمند بررسی مدیر</span>
                      ) : (
                        <span className="priority-badge normal">عادی / فعال</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="admin-btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => setSelectedMonitoredThread(item)}
                      >
                        <FiEye size={15} />
                        <span>بررسی گفتگو</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= تب ۴: هشدارهای هوشمند سیستمی (System Alerts) ================= */}
      {activeTab === 'alerts' && (
        <div className="alerts-grid-layout">
          {systemAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`system-alert-card ${alert.severity} ${alert.is_resolved ? 'resolved' : ''}`}
            >
              <div className="alert-card-header">
                <div className="alert-icon-wrap">
                  <FiAlertTriangle size={22} />
                </div>
                <div className="alert-title-wrap">
                  <h4>{alert.title}</h4>
                  <span className="alert-target-name">{alert.recipient_name} — {alert.course_name}</span>
                </div>
                <span className={`alert-status-pill ${alert.is_resolved ? 'done' : 'pending'}`}>
                  {alert.is_resolved ? 'برطرف شده' : 'اقدام لازم'}
                </span>
              </div>

              <div className="alert-card-body">
                <p>{alert.message}</p>
              </div>

              <div className="alert-card-footer">
                <span className="alert-time">
                  <FiClock size={13} /> {alert.created_at}
                </span>

                <div className="alert-actions">
                  {!alert.is_resolved && (
                    <button
                      className="admin-btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => {
                        setSystemAlerts(
                          systemAlerts.map((a) => (a.id === alert.id ? { ...a, is_resolved: true } : a))
                        );
                      }}
                    >
                      <FiCheckCircle size={14} />
                      <span>تایید و رفع هشدار</span>
                    </button>
                  )}
                  <button
                    className="admin-btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => {
                      setActiveTab('direct');
                    }}
                  >
                    <span>ارسال پیام تذکر</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= مودال ارسال اطلاعیه همگانی ================= */}
      {isNewBroadcastModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <div className="admin-modal-title">
                  <FiRadio size={22} className="modal-title-icon" />
                  <span>ارسال پیام و اطلاعیه همگانی جدید</span>
                </div>
                <button
                  className="admin-modal-close"
                  onClick={() => setIsNewBroadcastModalOpen(false)}
                >
                  <FiXCircle size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateBroadcast}>
                <div className="admin-modal-body">
                  <div className="admin-form-group">
                    <label className="admin-label">عنوان اطلاعیه *</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="مثال: تعطیلی کلاس‌های روز پنج‌شنبه به علت بهسازی سرور"
                      value={broadcastForm.title}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">مخاطبان اطلاعیه *</label>
                      <select
                        className="admin-input"
                        value={broadcastForm.target_audience}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, target_audience: e.target.value })}
                      >
                        <option value="all_students">تمامی هنرجویان آموزشگاه</option>
                        <option value="all_teachers">تمامی اساتید و مدرسین</option>
                        <option value="all_users">عمومی (کل کاربران پنل)</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">سطح اولویت</label>
                      <select
                        className="admin-input"
                        value={broadcastForm.priority}
                        onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value })}
                      >
                        <option value="normal">عادی (اطلاع‌رسانی عمومی)</option>
                        <option value="important">مهم (نمایش در بالای داشبورد)</option>
                        <option value="emergency">فوری و بحرانی (پاپ‌آپ قرمز)</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">متن کامل اطلاعیه *</label>
                    <textarea
                      rows={5}
                      className="admin-input"
                      placeholder="متن پیام را وارد کنید..."
                      value={broadcastForm.content}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, content: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setIsNewBroadcastModalOpen(false)}
                  >
                    انصراف
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    <FiSend size={16} />
                    <span>انتشار و نمایش اطلاعیه</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= مودال بررسی مکالمه تحت نظارت ================= */}
      {selectedMonitoredThread && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container" style={{ maxWidth: '750px' }}>
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <div className="admin-modal-title">
                  <FiShield size={22} className="modal-title-icon" />
                  <span>بررسی مکالمه: {selectedMonitoredThread.teacher_name} و {selectedMonitoredThread.student_name}</span>
                </div>
                <button
                  className="admin-modal-close"
                  onClick={() => setSelectedMonitoredThread(null)}
                >
                  <FiXCircle size={20} />
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="monitored-chat-history">
                  {selectedMonitoredThread.messages.map((m) => (
                    <div key={m.id} className={`monitored-bubble-row ${m.sender === 'استاد' ? 'teacher' : 'student'}`}>
                      <div className="monitored-bubble">
                        <span className="bubble-author">{m.sender}</span>
                        <p>{m.text}</p>
                        <span className="bubble-time">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setSelectedMonitoredThread(null)}
                >
                  بستن پنجره
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => {
                    alert('پیام تذکر مدیریتی برای طرفین مکالمه ارسال گردید.');
                    setSelectedMonitoredThread(null);
                  }}
                >
                  <FiAlertTriangle size={16} />
                  <span>ارسال تذکر مدیریتی به این گفتگو</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= مودال پیام مستقیم جدید ================= */}
      {isNewDirectModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-container">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <div className="admin-modal-title">
                  <FiPlus size={22} className="modal-title-icon" />
                  <span>ارسال پیام مستقیم اختصاصی</span>
                </div>
                <button
                  className="admin-modal-close"
                  onClick={() => setIsNewDirectModalOpen(false)}
                >
                  <FiXCircle size={20} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                alert('پیام مستقیم با موفقیت ارسال شد.');
                setIsNewDirectModalOpen(false);
              }}>
                <div className="admin-modal-body">
                  <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="admin-form-group">
                      <label className="admin-label">نقش کاربر گیرنده</label>
                      <select
                        className="admin-input"
                        value={newDirectForm.recipient_role}
                        onChange={(e) => setNewDirectForm({ ...newDirectForm, recipient_role: e.target.value })}
                      >
                        <option value="student">هنرجو</option>
                        <option value="teacher">مدرس / استاد</option>
                      </select>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-label">انتخاب کاربر</label>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="نام یا کدملی هنرجو / استاد..."
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">عنوان پیام</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="موضوع پیام..."
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">متن پیام</label>
                    <textarea
                      rows={4}
                      className="admin-input"
                      placeholder="متن پیام را بنویسید..."
                      required
                    />
                  </div>
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    className="admin-btn-secondary"
                    onClick={() => setIsNewDirectModalOpen(false)}
                  >
                    انصراف
                  </button>
                  <button type="submit" className="admin-btn-primary">
                    <FiSend size={16} />
                    <span>ارسال پیام به کاربر</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
