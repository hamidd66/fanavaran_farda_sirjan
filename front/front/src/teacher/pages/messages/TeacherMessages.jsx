import React, { useState, useEffect, useRef } from "react";
import {
  FiSend,
  FiSearch,
  FiCheck,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiUsers,
  FiPlus,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiRadio,
  FiX
} from "react-icons/fi";

import '../../styles/TeacherMessages.css';

export default function TeacherMessages() {
  // تَب‌های صفحه: direct (گفتگوی مستقیم), system-alerts (هشدارهای خودکار سیستم), announcements (اطلاعیه‌ها)
  const [activeTab, setActiveTab] = useState("direct");

  // فیلترها و جستجو
  const [chatSearch, setChatSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [messageInput, setMessageInput] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // ترد گفتگوی انتخاب‌شده
  const [selectedThreadId, setSelectedThreadId] = useState(1);

  // استیت مودال گفتگوی جدید
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newRecipientType, setNewRecipientType] = useState("student");
  const [selectedCourseForNew, setSelectedCourseForNew] = useState("");
  const [selectedStudentForNew, setSelectedStudentForNew] = useState("");
  const [newChatSubject, setNewChatSubject] = useState("");
  const [newChatFirstMsg, setNewChatFirstMsg] = useState("");

  // استیت مودال پیام همگانی به کلاس (Broadcast)
  const [isClassBroadcastModalOpen, setIsClassBroadcastModalOpen] = useState(false);
  const [broadcastCourseId, setBroadcastCourseId] = useState("");
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastPriority, setBroadcastPriority] = useState("normal");

  const messagesEndRef = useRef(null);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // دوره‌های فعال استاد
  const courses = [
    { id: "c-react", title: "برنامه‌نویسی ری‌اکت (React)", studentsCount: 18 },
    { id: "c-python", title: "پایتون و جنگو (Django)", studentsCount: 24 },
    { id: "c-ai", title: "هوش مصنوعی و یادگیری ماشین", studentsCount: 15 }
  ];

  // فهرست هنرجویان در دسترس
  const accessibleStudents = [
    { id: "s-101", name: "علی رضایی", courseId: "c-react", courseTitle: "ری‌اکت", avatar: "👨‍💻" },
    { id: "s-102", name: "مریم احمدی", courseId: "c-react", courseTitle: "ری‌اکت", avatar: "👩‍💻" },
    { id: "s-103", name: "حسین حسینی", courseId: "c-python", courseTitle: "پایتون", avatar: "👨‍🎓" },
    { id: "s-104", name: "سارا قاسمی", courseId: "c-python", courseTitle: "پایتون", avatar: "👩‍🎓" },
    { id: "s-105", name: "پویا کریمی", courseId: "c-ai", courseTitle: "هوش مصنوعی", avatar: "🧑‍💻" }
  ];

  // داده‌های چت و گفتگوهای مستقیم
  const [threads, setThreads] = useState([
    {
      id: 1,
      recipientType: "student",
      studentId: "s-101",
      name: "علی رضایی",
      role: "هنرجو",
      courseId: "c-react",
      courseName: "برنامه‌نویسی ری‌اکت",
      avatar: "👨‍💻",
      isOnline: true,
      unreadCount: 0,
      lastMessageTime: "۱۰:۴۵",
      messages: [
        {
          id: 101,
          sender: "them",
          senderName: "علی رضایی",
          text: "سلام استاد وقتتون بخیر. در تسک شماره ۴ درباره هوک useEffect سوال داشتم.",
          time: "۱۰:۳۰",
          status: "read"
        },
        {
          id: 102,
          sender: "me",
          senderName: "استاد",
          text: "سلام علی جان. وابستگی‌های آرایه دوم رو دقیق چک کردی؟ لوپ بینهایت تولید نمیکنه؟",
          time: "۱۰:۳۴",
          status: "read"
        },
        {
          id: 103,
          sender: "them",
          senderName: "علی رضایی",
          text: "ممنون استاد، بله مشکل دقیقا از متغیر داخل dependency array بود. حل شد!",
          time: "۱۰:۴۵",
          status: "read"
        }
      ]
    },
    {
      id: 2,
      recipientType: "student",
      studentId: "s-103",
      name: "حسین حسینی",
      role: "هنرجو",
      courseId: "c-python",
      courseName: "پایتون و جنگو",
      avatar: "👨‍🎓",
      isOnline: false,
      unreadCount: 2,
      lastMessageTime: "دیروز",
      messages: [
        {
          id: 201,
          sender: "them",
          senderName: "حسین حسینی",
          text: "سلام استاد، برای پروژه پایانی تا کی مهلت آپلود سورس کد داریم؟",
          time: "دیروز ۱۶:۱۵",
          status: "unread"
        }
      ]
    }
  ]);

  // پایش هوشمند هشدارهای سیستمی
  const [systemAlerts] = useState([
    {
      id: "alert-1",
      type: "critical",
      courseId: "c-react",
      courseName: "برنامه‌نویسی ری‌اکت (React)",
      title: "افت میانگین نمرات کلاسی به زیر حد نصاب",
      metricName: "میانگین نمره میان‌ترم",
      currentValue: "۱۲.۸ از ۲۰",
      thresholdValue: "۱۴.۰",
      impactedCount: 7,
      triggerDate: "امروز - ساعت ۰۸:۳۰",
      suggestion: "برگزاری کارگاه رفع اشکال و تمرین جبرانی برای سرفصل State Management پیشنهاد می‌شود."
    },
    {
      id: "alert-2",
      type: "warning",
      courseId: "c-python",
      courseName: "پایتون و جنگو (Django)",
      title: "افزایش نرخ غیبت غیرمجاز کلاسی",
      metricName: "درصد غیبت جلسات اخیر",
      currentValue: "۱۸.۵٪",
      thresholdValue: "۱۵٪",
      impactedCount: 5,
      triggerDate: "دیروز - ساعت ۱۸:۰۰",
      suggestion: "بررسی دلایل عدم حضور هنرجویان و هماهنگی با مدیر آموزش جهت پیگیری تماس با والدین/هنرجویان."
    }
  ]);

  // اطلاعیه‌ها و پیام‌های همگانی ثبت‌شده
  const [announcements, setAnnouncements] = useState([
    {
      id: "anc-1",
      courseName: "برنامه‌نویسی ری‌اکت (React)",
      courseId: "c-react",
      title: "تغییر ساعت جلسه جبرانی سه‌شنبه",
      message: "جلسه جبرانی سه‌شنبه به جای ساعت ۱۶، در ساعت ۱۷:۳۰ در همان کلاس برگزار خواهد شد.",
      priority: "important",
      date: "۱۴۰۳/۰۶/۲۴ - ۱۱:۳۰",
      recipientsCount: 18
    }
  ]);

  const activeThread = threads.find((t) => t.id === selectedThreadId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "direct") {
      scrollToBottom();
    }
  }, [selectedThreadId, activeTab, threads]);

  // ارسال پیام در چت فردی فعال
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeThread) return;

    const newMsg = {
      id: Date.now(),
      sender: "me",
      senderName: "استاد",
      text: messageInput.trim(),
      time: new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
      status: "sent"
    };

    setThreads((prevThreads) =>
      prevThreads.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessageTime: "هم‌اکنون",
              messages: [...t.messages, newMsg]
            }
          : t
      )
    );

    setMessageInput("");
  };

  // ارسال پیام از طریق مودال (با پشتیبانی از گزینه همه هنرجویان کلاس)
  const handleCreateNewDirectChat = (e) => {
    e.preventDefault();

    if (newRecipientType === "student" && !selectedStudentForNew) {
      showToast("لطفاً مخاطب یا کلاس را مشخص فرمایید.", "error");
      return;
    }

    if (!newChatFirstMsg.trim()) {
      showToast("متن پیام الزامی است.", "error");
      return;
    }

    const currentTime = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" }).format(new Date());

    // سناریو ۱: اگر گزینه «همه هنرجویان کلاس» انتخاب شده باشد
    if (selectedStudentForNew === "ALL_STUDENTS") {
      const selectedCourseObj = courses.find((c) => c.id === selectedCourseForNew);
      const courseTitle = selectedCourseObj ? selectedCourseObj.title : "تمام کلاس‌ها";
      const totalStudentsCount = selectedCourseObj
        ? selectedCourseObj.studentsCount
        : accessibleStudents.length;

      // ثبت در اطلاعیه‌ها
      const newAnnouncement = {
        id: `anc-${Date.now()}`,
        courseName: courseTitle,
        courseId: selectedCourseForNew || "all",
        title: newChatSubject.trim() || `پیام به کل کلاس (${courseTitle})`,
        message: newChatFirstMsg.trim(),
        priority: "normal",
        date: new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date()),
        recipientsCount: totalStudentsCount
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);

      // ثبت در پیام فردی هنرجویان مربوطه
      const targetStudents = accessibleStudents.filter(
        (s) => !selectedCourseForNew || s.courseId === selectedCourseForNew
      );

      setThreads((prevThreads) => {
        let updatedThreads = [...prevThreads];

        targetStudents.forEach((student) => {
          const msgObj = {
            id: Date.now() + Math.random(),
            sender: "me",
            senderName: "استاد (همگانی)",
            text: newChatFirstMsg.trim(),
            time: currentTime,
            status: "sent"
          };

          const existIdx = updatedThreads.findIndex((t) => t.studentId === student.id);
          if (existIdx !== -1) {
            updatedThreads[existIdx] = {
              ...updatedThreads[existIdx],
              lastMessageTime: "هم‌اکنون",
              messages: [...updatedThreads[existIdx].messages, msgObj]
            };
          } else {
            updatedThreads.unshift({
              id: Date.now() + Math.random(),
              recipientType: "student",
              studentId: student.id,
              name: student.name,
              role: "هنرجو",
              courseId: student.courseId,
              courseName: student.courseTitle,
              avatar: student.avatar,
              isOnline: false,
              unreadCount: 0,
              lastMessageTime: "هم‌اکنون",
              messages: [msgObj]
            });
          }
        });

        return updatedThreads;
      });

      setIsNewChatModalOpen(false);
      setSelectedCourseForNew("");
      setSelectedStudentForNew("");
      setNewChatSubject("");
      setNewChatFirstMsg("");
      setActiveTab("announcements");
      showToast(`پیام برای تمامی هنرجویان دوره (${courseTitle}) با موفقیت ارسال شد.`);
      return;
    }

    // سناریو ۲: ارسال پیام فردی به یک هنرجوی مشخص
    const targetStudent = accessibleStudents.find((s) => s.id === selectedStudentForNew);
    if (!targetStudent) return;

    const firstMessage = {
      id: Date.now(),
      sender: "me",
      senderName: "استاد",
      text: newChatFirstMsg.trim(),
      time: currentTime,
      status: "sent"
    };

    const existingThread = threads.find((t) => t.studentId === targetStudent.id);

    if (existingThread) {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === existingThread.id
            ? { ...t, lastMessageTime: "هم‌اکنون", messages: [...t.messages, firstMessage] }
            : t
        )
      );
      setSelectedThreadId(existingThread.id);
    } else {
      const newThreadItem = {
        id: Date.now(),
        recipientType: "student",
        studentId: targetStudent.id,
        name: targetStudent.name,
        role: "هنرجو",
        courseId: targetStudent.courseId,
        courseName: targetStudent.courseTitle,
        avatar: targetStudent.avatar,
        isOnline: false,
        unreadCount: 0,
        lastMessageTime: "هم‌اکنون",
        messages: [firstMessage]
      };
      setThreads((prev) => [newThreadItem, ...prev]);
      setSelectedThreadId(newThreadItem.id);
    }

    setIsNewChatModalOpen(false);
    setSelectedCourseForNew("");
    setSelectedStudentForNew("");
    setNewChatSubject("");
    setNewChatFirstMsg("");
    setActiveTab("direct");
    showToast("پیام شما با موفقیت برای هنرجو ارسال شد.");
  };

  // ارسال پیام همگانی کلاسی (Broadcast Modal)
  const handleSendBroadcast = (e) => {
    e.preventDefault();

    if (!broadcastCourseId) {
      showToast("لطفاً کلاس مخاطب را مشخص کنید.", "error");
      return;
    }

    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast("عنوان و متن پیام همگانی الزامی است.", "error");
      return;
    }

    const selectedCourseObj = courses.find((c) => c.id === broadcastCourseId);

    const newAnnouncement = {
      id: `anc-${Date.now()}`,
      courseName: selectedCourseObj ? selectedCourseObj.title : "کلاس انتخاب‌شده",
      courseId: broadcastCourseId,
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      priority: broadcastPriority,
      date: new Intl.DateTimeFormat("fa-IR", { dateStyle: "short", timeStyle: "short" }).format(new Date()),
      recipientsCount: selectedCourseObj ? selectedCourseObj.studentsCount : 0
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setIsClassBroadcastModalOpen(false);
    setBroadcastCourseId("");
    setBroadcastTitle("");
    setBroadcastMessage("");
    setBroadcastPriority("normal");
    setActiveTab("announcements");
    showToast(`پیام همگانی برای تمامی هنرجویان دوره با موفقیت ارسال شد.`);
  };

  // فیلتر کردن لیست مکالمات
  const filteredThreads = threads.filter((t) => {
    const matchesCourse = courseFilter === "all" || t.courseId === courseFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      t.courseName.toLowerCase().includes(chatSearch.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="teacher-messages-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`app-toast toast-${toastMessage.type}`}>
          {toastMessage.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* هدر صفحه */}
      <header className="messages-header">
        <div className="header-info">
          <h2>پیام‌رسان و مدیریت کلاس‌ها</h2>
          <p>ارتباط زنده با هنرجویان، پایش خودکار شاخص‌های کلاسی و ارسال پیام گروهی</p>
        </div>
        <div className="header-actions">
          <button
            className="btn-action btn-broadcast"
            onClick={() => setIsClassBroadcastModalOpen(true)}
            title="ارسال پیام همگانی به کلاس"
          >
            <FiUsers />
            <span>پیام به تمام هنرجویان کلاس</span>
          </button>
          <button
            className="btn-action btn-primary"
            onClick={() => setIsNewChatModalOpen(true)}
          >
            <FiPlus />
            <span>گفتگوی جدید</span>
          </button>
        </div>
      </header>

      {/* تب‌بار بالای صفحه */}
      <div className="messages-tabs-bar">
        <button
          className={`tab-btn ${activeTab === "direct" ? "active" : ""}`}
          onClick={() => setActiveTab("direct")}
        >
          گفتگوهای مستقیم
          <span className="tab-badge">{threads.length}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "system-alerts" ? "active" : ""}`}
          onClick={() => setActiveTab("system-alerts")}
        >
          هشدارهای خودکار سیستم
          {systemAlerts.length > 0 && (
            <span className="tab-badge badge-warning">{systemAlerts.length}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          اطلاعیه‌ها و پیام‌های همگانی
          <span className="tab-badge">{announcements.length}</span>
        </button>
      </div>

      {/* تب ۱: گفتگوهای مستقیم */}
      {activeTab === "direct" && (
        <div className="chat-container">
          <aside className="chat-sidebar">
            <div className="sidebar-filters">
              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="جستجو در مخاطبان یا دوره‌ها..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                />
              </div>
              <select
                className="course-select-filter"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">تمام دوره‌ها</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="threads-list">
              {filteredThreads.length === 0 ? (
                <div className="empty-threads">مخاطبی یافت نشد.</div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className={`thread-item ${thread.id === selectedThreadId ? "active" : ""}`}
                    onClick={() => setSelectedThreadId(thread.id)}
                  >
                    <div className="thread-avatar-wrap">
                      <span className="avatar-emoji">{thread.avatar}</span>
                      {thread.isOnline && <span className="online-indicator"></span>}
                    </div>
                    <div className="thread-info">
                      <div className="thread-title-row">
                        <span className="thread-name">{thread.name}</span>
                        <span className="thread-time">{thread.lastMessageTime}</span>
                      </div>
                      <div className="thread-sub-row">
                        <span className="thread-course">{thread.courseName}</span>
                        {thread.unreadCount > 0 && (
                          <span className="unread-badge">{thread.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

          <main className="chat-main">
            {activeThread ? (
              <>
                <div className="chat-main-header">
                  <div className="chat-user-meta">
                    <div className="thread-avatar-wrap">
                      <span className="avatar-emoji">{activeThread.avatar}</span>
                      {activeThread.isOnline && <span className="online-indicator"></span>}
                    </div>
                    <div>
                      <h4 className="chat-user-name">{activeThread.name}</h4>
                      <p className="chat-user-status">
                        {activeThread.role} • {activeThread.courseName} •{" "}
                        {activeThread.isOnline ? "آنلاین" : "آخرین بازدید اخیراً"}
                      </p>
                    </div>
                  </div>
                  <button className="icon-btn" title="گزینه‌های بیشتر">
                    <FiMoreVertical />
                  </button>
                </div>

                <div className="messages-body">
                  {activeThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message-row ${msg.sender === "me" ? "msg-mine" : "msg-theirs"}`}
                    >
                      <div className="message-bubble">
                        <div className="message-text">{msg.text}</div>
                        <div className="message-meta">
                          <span className="msg-time">{msg.time}</span>
                          {msg.sender === "me" && (
                            <span className="msg-status">
                              <FiCheck />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-bar" onSubmit={handleSendMessage}>
                  <button type="button" className="icon-btn" title="پیوست فایل">
                    <FiPaperclip />
                  </button>
                  <button type="button" className="icon-btn" title="ایموجی">
                    <FiSmile />
                  </button>
                  <input
                    type="text"
                    placeholder="پیام خود را بنویسید..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button type="submit" className="btn-send" disabled={!messageInput.trim()}>
                    <FiSend />
                  </button>
                </form>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>لطفاً یک گفتگو را از لیست انتخاب فرمایید.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {/* تب ۲: هشدارهای هوشمند سیستم */}
      {activeTab === "system-alerts" && (
        <div className="system-alerts-container">
          <div className="alerts-description-box">
            <div className="info-icon-wrapper">
              <FiInfo />
            </div>
            <div>
              <h4>سیستم پایش هوشمند سلامت کلاس‌ها</h4>
              <p>
                این هشدارها به‌صورت خودکار بر مبنای نمرات ثبت‌شده و نرخ حضور و غیاب محاسبه می‌شوند تا دوره‌های نیازمند مداخله مشخص شوند.
              </p>
            </div>
          </div>

          <div className="alerts-grid">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`system-alert-card ${alert.type}`}>
                <div className="alert-card-header">
                  <div className="alert-badge">
                    <FiAlertTriangle />
                    <span>{alert.type === "critical" ? "ریسک آموزشی بالا" : "هشدار توجه"}</span>
                  </div>
                  <span className="alert-date">{alert.triggerDate}</span>
                </div>

                <h3 className="alert-title">{alert.title}</h3>
                <p className="alert-course-name">دوره: {alert.courseName}</p>

                <div className="alert-stats-box">
                  <div className="stat-item">
                    <span className="stat-label">{alert.metricName}</span>
                    <span className="stat-value danger-text">{alert.currentValue}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">حد استاندارد</span>
                    <span className="stat-value">{alert.thresholdValue}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">هنرجویان متأثر</span>
                    <span className="stat-value">{alert.impactedCount} نفر</span>
                  </div>
                </div>

                <div className="alert-recommendation">
                  <strong>پیشنهاد سیستم: </strong>
                  <span>{alert.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تب ۳: اطلاعیه‌ها */}
      {activeTab === "announcements" && (
        <div className="announcements-container">
          <div className="announcements-header-row">
            <h3>تاریخچه اطلاعیه‌ها و پیام‌های کلاسی</h3>
            <button
              className="btn-action btn-broadcast"
              onClick={() => setIsClassBroadcastModalOpen(true)}
            >
              <FiRadio />
              <span>ارسال اطلاعیه جدید</span>
            </button>
          </div>

          <div className="announcements-list">
            {announcements.map((anc) => (
              <div key={anc.id} className="announcement-card">
                <div className="anc-card-header">
                  <div className="anc-course-tag">
                    <FiUsers />
                    <span>{anc.courseName}</span>
                  </div>
                  <span className={`anc-priority ${anc.priority}`}>
                    {anc.priority === "urgent" ? "فوری" : anc.priority === "important" ? "مهم" : "عادی"}
                  </span>
                </div>
                <h4 className="anc-title">{anc.title}</h4>
                <p className="anc-body">{anc.message}</p>
                <div className="anc-footer">
                  <span>گیرندگان: {anc.recipientsCount} نفر (کل کلاس)</span>
                  <span>تاریخ ارسال: {anc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* مودال ۱: ارسال پیام همگانی (Broadcast) */}
      {isClassBroadcastModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>ارسال پیام همگانی به کلاس</h3>
              <button
                className="close-btn"
                onClick={() => setIsClassBroadcastModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSendBroadcast}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">انتخاب کلاس مخاطب:</label>
                  <select
                    className="form-input"
                    value={broadcastCourseId}
                    onChange={(e) => setBroadcastCourseId(e.target.value)}
                    required
                  >
                    <option value="">-- کلاس مورد نظر را انتخاب کنید --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.studentsCount} هنرجو)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">اولویت پیام:</label>
                  <select
                    className="form-input"
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                  >
                    <option value="normal">عادی</option>
                    <option value="important">مهم</option>
                    <option value="urgent">فوری / اضطراری</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">موضوع یا تیتر پیام:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: تغییر ساعت جلسه یا مهلت تکالیف"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">متن پیام عمومی:</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="متن پیام خود را که برای تمام هنرجویان این کلاس ارسال خواهد شد بنویسید..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsClassBroadcastModalOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="btn-action btn-broadcast">
                  <FiSend />
                  <span>ارسال به کل کلاس</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال ۲: پیام جدید (با پشتیبانی از گزینه همه هنرجویان کلاس) */}
      {isNewChatModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>ارسال پیام جدید</h3>
              <button
                className="close-btn"
                onClick={() => setIsNewChatModalOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <form onSubmit={handleCreateNewDirectChat}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">فیلتر دوره آموزشی:</label>
                  <select
                    className="form-input"
                    value={selectedCourseForNew}
                    onChange={(e) => {
                      setSelectedCourseForNew(e.target.value);
                      setSelectedStudentForNew("");
                    }}
                  >
                    <option value="">همه دوره‌ها</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">انتخاب مخاطب (هنرجو یا کل کلاس):</label>
                  <select
                    className="form-input"
                    value={selectedStudentForNew}
                    onChange={(e) => setSelectedStudentForNew(e.target.value)}
                    required
                  >
                    <option value="">-- مخاطب را مشخص نمایید --</option>
                    
                    {/* گزینه انتخاب گروهی کل کلاس */}
                    <option value="ALL_STUDENTS" style={{ fontWeight: "bold", color: "#2563eb" }}>
                      👥 همه هنرجویان این کلاس {selectedCourseForNew ? `(${courses.find(c => c.id === selectedCourseForNew)?.title})` : "(ارسال گروهی)"}
                    </option>

                    <option disabled>──────────────</option>

                    {/* لیست هنرجویان تفکیک‌شده */}
                    {accessibleStudents
                      .filter(
                        (s) =>
                          !selectedCourseForNew || s.courseId === selectedCourseForNew
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.courseTitle})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">موضوع پیام (اختیاری):</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="مثال: پیگیری تکالیف یا اطلاع‌رسانی"
                    value={newChatSubject}
                    onChange={(e) => setNewChatSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">متن پیام:</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="متن پیام خود را وارد کنید..."
                    value={newChatFirstMsg}
                    onChange={(e) => setNewChatFirstMsg(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsNewChatModalOpen(false)}
                >
                  انصراف
                </button>
                <button type="submit" className="btn-action btn-primary">
                  <FiSend />
                  <span>
                    {selectedStudentForNew === "ALL_STUDENTS" ? "ارسال به تمام کلاس" : "ارسال پیام"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
