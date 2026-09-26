import React, { useState, useRef, useEffect } from 'react';
import '../styles/StudentMessages.css';

// آیکون‌های SVG توکار هماهنگ با پنل
const IconMessageSquare = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconCheckCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L7 17l-5-5"></path>
    <path d="M22 10l-7.5 7.5L13 16"></path>
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function StudentMessages() {
  // هشدارهای هوشمند آموزشی و انضباطی
  const [smartAlerts, setSmartAlerts] = useState([
    {
      id: 1,
      type: 'danger',
      title: 'هشدار حد نصاب غیبت در دوره React',
      description: 'شما ۲ جلسه از سقف ۳ جلسه مجاز را غیبت کرده‌اید. غیبت در جلسه آینده منجر به حذف آموزشی خواهد شد.',
      date: 'امروز، ۱۰:۴۵'
    },
    {
      id: 2,
      type: 'warning',
      title: 'ثبت نمره تمرین پروژه دوره پایتون',
      description: 'نمره فاز اول پروژه شما ۱۲ از ۲۰ ثبت شده است. جهت جبران نمره تا پنج‌شنبه با استاد در ارتباط باشید.',
      date: 'دیروز، ۱۸:۲۰'
    }
  ]);

  // لیست مخاطبان و گفتگوها
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'مهندس حمید پورفریدونی',
      role: 'مدیریت و مدرس ارشد Front-end',
      avatar: '👨‍🏫',
      unread: 1,
      online: true,
      lastMessage: 'پروژه پایانی شما تایید شد، تمرکز را روی بهینه‌سازی بگذارید.',
      time: '۱۲:۳۰',
      type: 'teacher'
    },
    {
      id: 2,
      name: 'واحد آموزش و پشتیبانی',
      role: 'امور ثبت‌نام و آزمون‌ها',
      avatar: '🏢',
      unread: 0,
      online: true,
      lastMessage: 'کارت ورود به جلسه آزمون جامع صادر گردید.',
      time: 'دیروز',
      type: 'management'
    },
    {
      id: 3,
      name: 'دکتر علوی',
      role: 'مدرس دوره هوش مصنوعی و پایتون',
      avatar: '👨‍💻',
      unread: 0,
      online: false,
      lastMessage: 'فایل‌های تمرین شبکه عصبی در سیستم بارگذاری شد.',
      time: '۳ روز پیش',
      type: 'teacher'
    }
  ]);

  // تاریخچه چت‌های مربوط به هر گفتگو
  const [messagesData, setMessagesData] = useState({
    1: [
      { id: 101, sender: 'them', text: 'سلام علی جان، خسته نباشی. کد کامپوننت سبد خرید رو بازبینی کردم.', time: '۱۰:۱۵' },
      { id: 102, sender: 'me', text: 'سلام استاد، وقت بخیر. ممنون از بررسی‌تون. ساختار ریداکس اوکی بود؟', time: '۱۰:۲۲' },
      { id: 103, sender: 'them', text: 'پروژه پایانی شما تایید شد، تمرکز را روی بهینه‌سازی بگذارید.', time: '۱۲:۳۰' }
    ],
    2: [
      { id: 201, sender: 'them', text: 'کارت ورود به جلسه آزمون جامع صادر گردید.', time: 'دیروز ۱۴:۰۰' }
    ],
    3: [
      { id: 301, sender: 'them', text: 'فایل‌های تمرین شبکه عصبی در سیستم بارگذاری شد.', time: '۳ روز پیش' }
    ]
  });

  // بخش اطلاعیه‌های رسمی همگانی آموزشگاه
  const announcements = [
    {
      id: 1,
      title: 'برگزاری مسابقه برنامه‌نویسی الگوریتمی فناوران فردا',
      badge: 'رویداد مهم',
      date: '۲۲ شهریور ۱۴۰۳',
      content: 'به اطلاع کلیه هنرجویان می‌رساند دومین دوره مسابقات منطقه‌ای الگوریتم با جوایز ویژه و بورسیه دوره‌های پیشرفته در انتهای ماه جاری برگزار خواهد شد.'
    },
    {
      id: 2,
      title: 'تعطیلی کلاس‌های روز پنج‌شنبه به دلیل بهسازی سرورها',
      badge: 'اطلاعیه فنی',
      date: '۱۸ شهریور ۱۴۰۳',
      content: 'سرورهای سامانه آموزشی و سایت‌های عملی در روز پنج‌شنبه از ساعت ۱۴ الی ۱۸ در دست ارتقا خواهند بود.'
    }
  ];

  const [activeChatId, setActiveChatId] = useState(1);
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' | 'announcements'
  const [inputMessage, setInputMessage] = useState('');
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [ticketData, setTicketData] = useState({ recipient: 'management', subject: '', priority: 'normal', text: '' });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData, activeChatId]);

  const activeContact = contacts.find(c => c.id === activeChatId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputMessage.trim(),
      time: new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(new Date())
    };

    setMessagesData(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    setInputMessage('');
  };

  const handleDismissAlert = (id) => {
    setSmartAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.text) return;

    alert('پیام شما با موفقیت به واحد مربوطه ارسال گردید و در اسرع وقت پاسخ داده خواهد شد.');
    setIsNewTicketOpen(false);
    setTicketData({ recipient: 'management', subject: '', priority: 'normal', text: '' });
  };

  return (
    <div className="std-msg-page">
      {/* ۱. هدر بنر به سبک پنل هنرجو */}
      <div className="std-msg-hero">
        <div className="std-msg-hero-info">
          <div className="std-msg-hero-icon">
            <IconMessageSquare />
          </div>
          <div>
            <h2>مرکز پیام و ارتباطات آموزشی</h2>
            <p>گفتگوی برخط با اساتید و مدیریت آموزشگاه فناوران فردا و پیگیری اطلاعیه‌ها</p>
          </div>
        </div>
        <button className="std-msg-new-btn" onClick={() => setIsNewTicketOpen(true)}>
          <IconPlus />
          ارسال پیام و تیکت جدید
        </button>
      </div>

      {/* ۲. هشدارهای هوشمند وضعیت بحرانی */}
      {smartAlerts.length > 0 && (
        <div className="std-smart-alerts-section">
          {smartAlerts.map(alert => (
            <div key={alert.id} className={`std-alert-card std-alert-${alert.type}`}>
              <div className="std-alert-icon">
                <IconAlertTriangle />
              </div>
              <div className="std-alert-body">
                <div className="std-alert-header">
                  <h4>{alert.title}</h4>
                  <span className="std-alert-date">{alert.date}</span>
                </div>
                <p>{alert.description}</p>
              </div>
              <button 
                className="std-alert-close-btn" 
                onClick={() => handleDismissAlert(alert.id)}
                title="بستن هشدار"
              >
                <IconClose />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ۳. محتوای اصلی پیام‌رسان */}
      <div className="std-msg-layout-card">
        {/* سایدبار گفتگوها و تب‌ها */}
        <div className="std-msg-sidebar">
          <div className="std-msg-sidebar-tabs">
            <button 
              className={`std-tab-btn ${activeTab === 'direct' ? 'active' : ''}`}
              onClick={() => setActiveTab('direct')}
            >
              <IconMessageSquare />
              گفتگوهای مستقیم
            </button>
            <button 
              className={`std-tab-btn ${activeTab === 'announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              <IconBell />
              اطلاعیه‌ها
              <span className="std-tab-badge">{announcements.length}</span>
            </button>
          </div>

          {activeTab === 'direct' ? (
            <div className="std-chat-list">
              {contacts.map(c => (
                <div 
                  key={c.id} 
                  className={`std-chat-item ${activeChatId === c.id ? 'active' : ''}`}
                  onClick={() => setActiveChatId(c.id)}
                >
                  <div className="std-avatar-wrap">
                    <span className="std-avatar-icon">{c.avatar}</span>
                    {c.online && <span className="std-online-status" />}
                  </div>
                  <div className="std-chat-info">
                    <div className="std-chat-name-row">
                      <span className="std-contact-name">{c.name}</span>
                      <span className="std-chat-time">{c.time}</span>
                    </div>
                    <span className="std-contact-role">{c.role}</span>
                    <p className="std-last-msg">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="std-unread-bubble">{c.unread}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className="std-announcement-summary-hint">
              جهت مشاهده متن کامل اطلاعیه‌ها، کارت‌های بخش روبرو را بررسی نمایید.
            </div>
          )}
        </div>

        {/* ناحیه محتوا: پنجره چت یا لیست اطلاعیه‌ها */}
        <div className="std-msg-main-content">
          {activeTab === 'direct' ? (
            <div className="std-chat-window">
              {/* هدر چت فعال */}
              <div className="std-chat-header">
                <div className="std-chat-header-info">
                  <div className="std-avatar-wrap">
                    <span className="std-avatar-icon">{activeContact?.avatar}</span>
                    {activeContact?.online && <span className="std-online-status" />}
                  </div>
                  <div>
                    <h4>{activeContact?.name}</h4>
                    <span className="std-chat-status-text">
                      {activeContact?.online ? 'پاسخگوی آنلاین' : 'آخرین بازدید اخیراً'} • {activeContact?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* تاریخچه پیام‌ها */}
              <div className="std-messages-stream">
                {(messagesData[activeChatId] || []).map(msg => (
                  <div key={msg.id} className={`std-msg-bubble-wrap ${msg.sender === 'me' ? 'me' : 'them'}`}>
                    <div className="std-msg-bubble">
                      <p>{msg.text}</p>
                      <div className="std-msg-meta">
                        <span>{msg.time}</span>
                        {msg.sender === 'me' && <IconCheckCheck />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* فرم ارسال پیام */}
              <form className="std-chat-input-bar" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="پیام خود را بنویسید..." 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit" className="std-btn-send" disabled={!inputMessage.trim()}>
                  <IconSend />
                  <span>ارسال</span>
                </button>
              </form>
            </div>
          ) : (
            /* بخش اختصاصی اطلاعیه‌های همگانی */
            <div className="std-announcements-view">
              <div className="std-announcements-hero-title">
                <h3>اعلانات و بخشنامه‌های آموزشی</h3>
                <p>تمامی رویدادها، تغییرات زمانی و نکات مهم آموزشگاه فناوران فردا در این بخش منعکس می‌شود.</p>
              </div>

              <div className="std-announcements-list">
                {announcements.map(item => (
                  <div key={item.id} className="std-announcement-card">
                    <div className="std-ann-card-header">
                      <span className="std-ann-badge">{item.badge}</span>
                      <span className="std-ann-date">{item.date}</span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* مودال ارسال پیام / تیکت جدید */}
      {isNewTicketOpen && (
        <div className="std-modal-overlay" onClick={() => setIsNewTicketOpen(false)}>
          <div className="std-modal-container std-ticket-modal" onClick={e => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>ارسال پیام به اساتید یا مدیریت</h3>
              <button className="std-modal-close" onClick={() => setIsNewTicketOpen(false)}>
                <IconClose />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="std-ticket-form">
              <div className="std-form-group">
                <label>گیرنده پیام:</label>
                <select 
                  value={ticketData.recipient} 
                  onChange={e => setTicketData({ ...ticketData, recipient: e.target.value })}
                >
                  <option value="management">مدیریت و آموزش (مهندس پورفریدونی)</option>
                  <option value="react-teacher">مدرس دوره Front-end / React</option>
                  <option value="ai-teacher">مدرس دوره هوش مصنوعی و Python</option>
                  <option value="finance">امور مالی و شهریه</option>
                </select>
              </div>

              <div className="std-form-group">
                <label>موضوع تیکت / پیام:</label>
                <input 
                  type="text" 
                  placeholder="مثال: سوال در خصوص آزمون عملی یا غیبت"
                  value={ticketData.subject}
                  onChange={e => setTicketData({ ...ticketData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="std-form-group">
                <label>اولویت پیام:</label>
                <div className="std-priority-selector">
                  {['normal', 'important', 'urgent'].map(p => (
                    <label key={p} className={`std-priority-pill ${ticketData.priority === p ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="priority" 
                        value={p} 
                        checked={ticketData.priority === p}
                        onChange={() => setTicketData({ ...ticketData, priority: p })} 
                      />
                      {p === 'normal' ? 'عادی' : p === 'important' ? 'مهم' : 'فوری'}
                    </label>
                  ))}
                </div>
              </div>

              <div className="std-form-group">
                <label>متن پیام شما:</label>
                <textarea 
                  rows="4" 
                  placeholder="جزئیات درخواست یا پیام خود را کامل شرح دهید..."
                  value={ticketData.text}
                  onChange={e => setTicketData({ ...ticketData, text: e.target.value })}
                  required
                />
              </div>

              <div className="std-modal-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsNewTicketOpen(false)}>
                  انصراف
                </button>
                <button type="submit" className="btn-modal-primary">
                  ارسال پیام
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
