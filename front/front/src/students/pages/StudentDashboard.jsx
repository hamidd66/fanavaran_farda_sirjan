import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiVideo,
  FiAward,
  FiTrendingUp,
  FiBookOpen,
  FiBell,
  FiCheckCircle,
  FiArrowUpRight,
  FiStar,
  FiZap,
  FiCalendar,
  FiUserCheck
} from "react-icons/fi";
import "../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const enrolledCourses = [
    {
      id: 1,
      title: "متخصص فرانت‌اند (React & Next.js)",
      instructor: "مهندس پورفریدونی",
      progress: 68,
      completedSessions: 17,
      totalSessions: 25,
      color: "#2563eb",
    },
    {
      id: 2,
      title: "برنامه‌نویسی بک‌اند با پایتون و جنگو",
      instructor: "مهندس باقری",
      progress: 42,
      completedSessions: 10,
      totalSessions: 24,
      color: "#10b981",
    },
    {
      id: 3,
      title: "مبانی الگوریتم و آمادگی مسابقات",
      instructor: "استاد پورفریدونی",
      progress: 90,
      completedSessions: 18,
      totalSessions: 20,
      color: "#f59e0b",
    },
  ];

  const comparisonData = [
    { subject: "تکالیف React", myScore: 92, classAvg: 78 },
    { subject: "کوئیز Redux", myScore: 85, classAvg: 72 },
    { subject: "پروژه صنعتی", myScore: 96, classAvg: 80 },
    { subject: "حضور و غیاب", myScore: 100, classAvg: 88 },
    { subject: "مبانی جنگو", myScore: 88, classAvg: 74 },
  ];

  return (
    <div className="std-dashboard-page" dir="rtl">
      {/* ۱. بنر و کلاس بعدی */}
      <div className="std-top-hero-grid">
        <div className="std-welcome-card">
          <div className="welcome-text">
            <span className="welcome-greeting">سلام، حمید عزیز خوش‌آمدی 👋</span>
            <h2>مسیر یادگیری‌ات رو با انگیزه ادامه بده!</h2>
            <p>
              تو در هفته جاری به تمام اهداف مطالعاتی‌ات رسیدی و جزو ۳ هنرجوی برتر دوره
              ری‌اکت آموزشگاه فناوران فردا هستی.
            </p>
            <div className="welcome-tags">
              <span className="w-tag"><FiZap /> زنجیره یادگیری: ۷ روز متوالی</span>
              <span className="w-tag"><FiStar /> سطح فعلی: کدنویس پیشرفته (Level 4)</span>
            </div>
          </div>
        </div>

        {/* کارت کلاس بعدی - استفاده از std-card */}
        <div className="std-card next-class-box" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div className="next-class-header">
            <span className="next-class-tag">
              <span className="pulse-dot"></span> کلاس بعدی شما
            </span>
            <span className="std-chip primary">
              <FiVideo /> آنلاین (Skyroom)
            </span>
          </div>

          <h3 className="next-class-title">ری‌اکت پیشرفته: ساخت کاستوم هوک‌ها</h3>
          <p className="next-class-meta">
            <span>مدرس: مهندس پورفریدونی</span> • <span>ساعت ۱۸:۳۰ الی ۲۰:۳۰</span>
          </p>

          <div className="countdown-box">
            <div className="countdown-unit">
              <span className="num">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="lbl">ساعت</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-unit">
              <span className="num">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="lbl">دقیقه</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-unit">
              <span className="num">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="lbl">ثانیه</span>
            </div>
          </div>

          <div className="next-class-actions">
            <button className="std-btn-primary" style={{ flex: 1.6 }}>
              <FiVideo /> ورود مستقیم به کلاس
            </button>
            <button className="std-btn-secondary" style={{ flex: 1 }}>
              سرفصل جلسه
            </button>
          </div>
        </div>
      </div>

      {/* ۲. کارت‌های گیمیفیکیشن - استفاده از std-card */}
      <div className="std-gamification-row">
        <div className="std-card std-game-card">
          <div className="game-icon-box rank-box"><FiAward /></div>
          <div>
            <div className="game-label">رتبه کلاسی شما</div>
            <div className="game-value">
              رتبه <strong>۲</strong> <span className="game-sub">از ۳۲ هنرجو</span>
            </div>
          </div>
          <div className="game-card-badge">
            <span className="std-chip warning">برترین‌ها 🏆</span>
          </div>
        </div>

        <div className="std-card std-game-card">
          <div className="game-icon-box xp-box"><FiZap /></div>
          <div>
            <div className="game-label">امتیاز مهارت (XP)</div>
            <div className="game-value">
              <strong>۲,۴۵۰</strong> <span className="game-sub">امتیاز کسب‌شده</span>
            </div>
          </div>
          <div className="game-card-badge">
            <span className="std-chip" style={{ background: "#f3e8ff", color: "#7e22ce" }}>Level 4</span>
          </div>
        </div>

        <div className="std-card std-game-card">
          <div className="game-icon-box attendance-box"><FiUserCheck /></div>
          <div>
            <div className="game-label">نرخ حضور در جلسات</div>
            <div className="game-value">
              <strong>۹۶٪</strong> <span className="game-sub">بدون غیبت غیرموجه</span>
            </div>
          </div>
          <div className="game-card-badge">
            <span className="std-chip success">منظم ⭐</span>
          </div>
        </div>

        <div className="std-card std-game-card">
          <div className="game-icon-box quiz-box"><FiCheckCircle /></div>
          <div>
            <div className="game-label">میانگین آزمون‌ها</div>
            <div className="game-value">
              <strong>۱۸.۷۵</strong> <span className="game-sub">از ۲۰ نمره</span>
            </div>
          </div>
          <div className="game-card-badge">
            <span className="std-chip primary">+۲.۴ میانگین</span>
          </div>
        </div>
      </div>

      {/* ۳. دو ستون: پیشرفت دوره‌ها + اعلان‌ها */}
      <div className="std-two-col-grid">
        <div className="std-card">
          <div className="std-card-head">
            <div>
              <h3><FiBookOpen /> خلاصه پیشرفت دوره‌های فعال</h3>
              <p>درصد تکمیل دوره‌ها بر اساس حضور در جلسات و قبولی در تکالیف</p>
            </div>
            <Link to="/student/courses" className="std-card-link">
              مشاهده همه <FiArrowUpRight />
            </Link>
          </div>

          <div className="std-courses-progress-list">
            {enrolledCourses.map((c) => (
              <div key={c.id} className="std-course-prog-item">
                <div className="prog-item-top">
                  <div>
                    <h4>{c.title}</h4>
                    <span className="prog-inst">{c.instructor}</span>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <span className="prog-percent" style={{ color: c.color }}>
                      {c.progress}٪
                    </span>
                    <span className="prog-sessions">
                      {c.completedSessions} از {c.totalSessions} جلسه
                    </span>
                  </div>
                </div>

                <div className="std-progress-track">
                  <div
                    className="std-progress-bar"
                    style={{
                      width: `${c.progress}%`,
                      backgroundColor: c.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="std-card">
          <div className="std-card-head">
            <div>
              <h3><FiBell /> رویدادها و اعلان‌های مهم</h3>
              <p>آخرین پیام‌های آکادمی و مهلت ارسال تمرین‌ها</p>
            </div>
          </div>

          <div className="std-notifs-list">
            <div className="std-notif-item urgent">
              <div className="notif-indicator"></div>
              <div className="notif-content">
                <h5>ددلاین تکلیف ری‌اکت: ساخت سبد خرید با Redux</h5>
                <p>تنها ۲۴ ساعت تا پایان مهلت ارسال باقی مانده است.</p>
                <span className="notif-date"><FiClock /> فردا ساعت ۲۳:۵۹</span>
              </div>
              <button className="std-btn-primary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                ارسال
              </button>
            </div>

            <div className="std-notif-item info">
              <div className="notif-indicator"></div>
              <div className="notif-content">
                <h5>مسابقه هفتگی الگوریتم و حل مسئله</h5>
                <p>مسابقه کدنویسی این هفته جمعه با جوایز ویژه برگزار خواهد شد.</p>
                <span className="notif-date"><FiCalendar /> جمعه ساعت ۱۰:۰۰ صبح</span>
              </div>
              <button className="std-btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }}>
                ثبت‌نام
              </button>
            </div>

            <div className="std-notif-item message">
              <div className="notif-indicator"></div>
              <div className="notif-content">
                <h5>ثبت نمره تمرین جلسه شانزدهم</h5>
                <p>مهندس پورفریدونی: نمره ۲۰ - ساختار هوک‌ها بی‌نقص بود.</p>
                <span className="notif-date"><FiCheckCircle /> دیروز</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ۴. نمودارها و مقایسه‌ها */}
      <div className="std-analytics-grid">
        <div className="std-card">
          <div className="std-card-head">
            <div>
              <h3><FiTrendingUp /> روند نمرات در ۱۰ جلسه اخیر</h3>
              <p>ارزیابی مستمر نمرات آزمون‌ها و تمرین‌های کلاسی شما</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: "#2563eb" }}></span>
              نمره شما
            </div>
          </div>

          <div className="std-chart-container">
            <svg viewBox="0 0 500 180" className="std-line-chart-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="20" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="20" y1="75" x2="480" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="20" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" />

              <polygon
                points="30,130 80,110 130,95 180,105 230,80 280,60 330,70 380,45 430,35 470,30 470,160 30,160"
                fill="url(#chartGrad)"
              />
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="30,130 80,110 130,95 180,105 230,80 280,60 330,70 380,45 430,35 470,30"
              />
              {[
                { x: 30, y: 130, score: "۱۴" },
                { x: 80, y: 110, score: "۱۵.۵" },
                { x: 130, y: 95, score: "۱۶.۵" },
                { x: 180, y: 105, score: "۱۶" },
                { x: 230, y: 80, score: "۱۷.۵" },
                { x: 280, y: 60, score: "۱۸.۵" },
                { x: 330, y: 70, score: "۱۸" },
                { x: 380, y: 45, score: "۱۹" },
                { x: 430, y: 35, score: "۱۹.۵" },
                { x: 470, y: 30, score: "۲۰" },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#fff" stroke="#2563eb" strokeWidth="3" />
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">
                    {pt.score}
                  </text>
                </g>
              ))}
            </svg>
            <div className="std-chart-labels">
              <span>جلسه ۱</span>
              <span>جلسه ۳</span>
              <span>جلسه ۵</span>
              <span>جلسه ۷</span>
              <span>جلسه ۹</span>
              <span>جلسه ۱۱</span>
              <span>جلسه ۱۳</span>
              <span>جلسه ۱۵</span>
              <span>جلسه ۱۷</span>
              <span>جلسه ۱۹</span>
            </div>
          </div>
        </div>

        <div className="std-card">
          <div className="std-card-head">
            <div>
              <h3><FiAward /> مقایسه نمرات با میانگین کلاس</h3>
              <p>میزان برتری عملکرد شما نسبت به میانگین کل کلاس</p>
            </div>
            <div className="chart-legend">
              <span className="legend-dot" style={{ background: "#2563eb" }}></span> شما
              <span className="legend-dot" style={{ background: "#cbd5e1", marginRight: "12px" }}></span> میانگین
            </div>
          </div>

          <div className="comparison-bars-list">
            {comparisonData.map((item, index) => (
              <div key={index}>
                <div className="comp-labels">
                  <span className="comp-title">{item.subject}</span>
                  <div className="comp-values">
                    <span className="my-val">{item.myScore}٪</span>
                    <span className="avg-val">میانگین: {item.classAvg}٪</span>
                  </div>
                </div>

                <div className="comp-double-bar">
                  <div className="bar-wrapper">
                    <div className="bar-fill my-bar" style={{ width: `${item.myScore}%` }}></div>
                  </div>
                  <div className="bar-wrapper">
                    <div className="bar-fill avg-bar" style={{ width: `${item.classAvg}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
