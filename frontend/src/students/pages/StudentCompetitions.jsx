import React, { useState } from 'react';
import {
  FaTrophy,
  FaMedal,
  FaCalendarAlt,
  FaClock,
  FaCode,
  FaCheckCircle,
  FaHourglassHalf,
  FaFire,
  FaUsers,
  FaExternalLinkAlt,
  FaTimes,
  FaInfoCircle,
  FaStar,
  FaAward
} from 'react-icons/fa';
import '../styles/StudentCompetitions.css';

const StudentCompetitions = () => {
  // داده‌های نمونه مسابقات ثبت‌نامی هنرجو در آموزشگاه فناوران فردا
  const [competitions] = useState([
    {
      id: 'comp-101',
      title: 'ماراتن الگوریتم و حل مسئله سیرجان (کدکاپ پاییزه)',
      category: 'الگوریتم و ساختار داده',
      status: 'ended', // ended | upcoming | live
      date: '۱۴۰۳/۰۸/۱۸',
      time: 'ساعت ۱۶:۰۰ الی ۲۰:۰۰',
      duration: '۴ ساعت',
      rank: 2,
      totalParticipants: 68,
      score: 380,
      totalScore: 400,
      solvedProblems: 5,
      totalProblems: 5,
      prize: 'لوح تقدیر + بورسیه دوره پیشرفته هوش مصنوعی',
      tag: 'Python / C++',
      badgeColor: '#f59e0b'
    },
    {
      id: 'comp-102',
      title: 'هکاتون منطقه‌ای طراحی و توسعه فرانت‌اند مدرن',
      category: 'فرانت‌اند (React & UI/UX)',
      status: 'ended',
      date: '۱۴۰۳/۰۷/۱۰',
      time: 'ساعت ۰۹:۰۰ الی ۱۸:۰۰',
      duration: '۹ ساعت',
      rank: 7,
      totalParticipants: 52,
      score: 85,
      totalScore: 100,
      solvedProblems: 3,
      totalProblems: 4,
      prize: 'گواهی حضور + تخفیف ۳۰٪ دوره‌های بک‌اند',
      tag: 'React / Next.js',
      badgeColor: '#3b82f6'
    },
    {
      id: 'comp-103',
      title: 'چالش لایو هوش مصنوعی و مدل‌سازی داده با پایتون',
      category: 'هوش مصنوعی و یادگیری ماشین',
      status: 'live',
      date: 'امروز',
      time: 'هم‌اکنون در حال برگزاری',
      duration: 'تا ساعت ۲۲:۰۰',
      rank: null,
      totalParticipants: 84,
      score: null,
      totalScore: 500,
      tag: 'Machine Learning',
      badgeColor: '#ef4444'
    },
    {
      id: 'comp-104',
      title: 'لیگ مسابقات سالانه برنامه‌نویسی جام فناوران فردا',
      category: 'توسعه نرم‌افزار و معماری سیستم',
      status: 'upcoming',
      date: '۱۴۰۳/۰۹/۲۵',
      time: 'ساعت ۱۴:۰۰',
      duration: '۵ ساعت',
      rank: null,
      totalParticipants: 110,
      score: null,
      totalScore: 600,
      tag: 'Fullstack / Algorithm',
      badgeColor: '#10b981'
    }
  ]);

  const [selectedComp, setSelectedComp] = useState(null);

  // آیکون مدال بر اساس رتبه
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="rank-stamp-card rank-gold">
          <FaTrophy className="rank-trophy-icon" />
          <div className="rank-data">
            <span className="rank-num">مقام اول (طلا)</span>
            <span className="rank-sub">رتبه ۱ مسابقه</span>
          </div>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="rank-stamp-card rank-silver">
          <FaMedal className="rank-trophy-icon" />
          <div className="rank-data">
            <span className="rank-num">مقام دوم (نقره)</span>
            <span className="rank-sub">رتبه ۲ مسابقه</span>
          </div>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="rank-stamp-card rank-bronze">
          <FaMedal className="rank-trophy-icon" />
          <div className="rank-data">
            <span className="rank-num">مقام سوم (برنز)</span>
            <span className="rank-sub">رتبه ۳ مسابقه</span>
          </div>
        </div>
      );
    }
    return (
      <div className="rank-stamp-card rank-general">
        <FaAward className="rank-trophy-icon" />
        <div className="rank-data">
          <span className="rank-num">رتبه {rank}</span>
          <span className="rank-sub">در بین شرکت‌کنندگان</span>
        </div>
      </div>
    );
  };

  return (
    <div className="comp-page-container">
      {/* ۱. هدر هیرو و پنل آمار کل */}
      <div className="comp-hero-panel">
        <div className="comp-hero-top">
          <div className="comp-hero-title">
            <div className="comp-badge-icon">
              <FaTrophy />
            </div>
            <div>
              <h2>تالار مسابقات و چالش‌های فناوران فردا</h2>
              <p>سوابق حضور، رتبه‌های افتخارآفرین و چالش‌های برنامه‌نویسی فعال شما در آموزشگاه</p>
            </div>
          </div>
        </div>

        {/* کارت‌های تجمیعی دستاوردها */}
        <div className="comp-stats-strip">
          <div className="comp-stat-box">
            <span className="stat-label">کل مسابقات ثبت‌نامی</span>
            <span className="stat-value">{competitions.length} رویداد</span>
          </div>
          <div className="comp-stat-box">
            <span className="stat-label">مسابقات خاتمه‌یافته</span>
            <span className="stat-value text-gold">
              {competitions.filter(c => c.status === 'ended').length} مسابقه
            </span>
          </div>
          <div className="comp-stat-box">
            <span className="stat-label">بهترین رتبه کسب‌شده</span>
            <span className="stat-value text-cyan">مقام دوم (نقره)</span>
          </div>
          <div className="comp-stat-box">
            <span className="stat-label">مسابقات پیش‌رو / لایو</span>
            <span className="stat-value text-emerald">
              {competitions.filter(c => c.status !== 'ended').length} چالش
            </span>
          </div>
        </div>
      </div>

      {/* ۲. لیست کارت‌های مسابقات با استفاده از کلاس مادر eval-cards-grid */}
      <div className="eval-cards-grid">
        {competitions.map((comp) => {
          const isEnded = comp.status === 'ended';
          const isLive = comp.status === 'live';
          const isUpcoming = comp.status === 'upcoming';

          return (
            <div
              key={comp.id}
              className={`comp-card-item ${
                isEnded ? 'comp-card-ended' : isLive ? 'comp-card-live' : 'comp-card-upcoming'
              }`}
            >
              {/* استامپ بزرگ وضعیت در بالای کارت */}
              <div className="comp-status-header">
                {isEnded && (
                  <div className="big-status-stamp stamp-ended">
                    <FaCheckCircle /> به پایان رسیده
                  </div>
                )}
                {isLive && (
                  <div className="big-status-stamp stamp-live">
                    <span className="pulse-dot"></span>
                    <FaFire /> در حال برگزاری (زنده)
                  </div>
                )}
                {isUpcoming && (
                  <div className="big-status-stamp stamp-upcoming">
                    <FaHourglassHalf /> هنوز برگزار نشده (پیش‌رو)
                  </div>
                )}

                <span className="comp-tag-badge">{comp.tag}</span>
              </div>

              {/* عنوان و دسته مسابقه */}
              <div className="comp-body-main">
                <span className="comp-cat">{comp.category}</span>
                <h3 className="comp-title">{comp.title}</h3>

                <div className="comp-meta-list">
                  <div className="meta-row">
                    <FaCalendarAlt /> <span>تاریخ: {comp.date}</span>
                  </div>
                  <div className="meta-row">
                    <FaClock /> <span>زمان‌بندی: {comp.time} ({comp.duration})</span>
                  </div>
                  <div className="meta-row">
                    <FaUsers /> <span>ظرفیت / شرکت‌کنندگان: {comp.totalParticipants} نفر</span>
                  </div>
                </div>
              </div>

              {/* بخش تفکیکی: اگر مسابقه تمام شده، رتبه بزرگ نمایش داده می‌شود */}
              {isEnded ? (
                <div className="comp-result-box">
                  {renderRankBadge(comp.rank)}

                  <div className="comp-score-row">
                    <div className="score-item">
                      <span className="sc-title">امتیاز شما:</span>
                      <strong className="sc-val">
                        {comp.score} / {comp.totalScore}
                      </strong>
                    </div>
                    <div className="score-item">
                      <span className="sc-title">حل مسئله:</span>
                      <strong className="sc-val">
                        {comp.solvedProblems} از {comp.totalProblems}
                      </strong>
                    </div>
                  </div>

                  <button
                    className="btn-comp-action btn-view-report"
                    onClick={() => setSelectedComp(comp)}
                  >
                    <FaInfoCircle /> جزئیات کارنامه و جوایز
                  </button>
                </div>
              ) : (
                /* اگر مسابقه هنوز تمام نشده یا در حال برگزاری است */
                <div className="comp-not-ended-box">
                  {isLive ? (
                    <div className="live-entry-banner">
                      <p>مسابقه آغاز شده است! هم‌اکنون می‌توانید وارد بستر مسابقه شوید.</p>
                      <button className="btn-comp-action btn-enter-live">
                        <FaCode /> ورود به محیط حل مسئله
                      </button>
                    </div>
                  ) : (
                    <div className="upcoming-entry-banner">
                      <p>لینک ورود به محیط آزمون و سامانه داوری آنلاین ۳۰ دقیقه پیش از شروع فعال خواهد شد.</p>
                      <button className="btn-comp-action btn-upcoming-info" disabled>
                        <FaClock /> ثبت‌نام تایید شده
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================
          ۳. مودال استاندارد جزئیات کارنامه و افتخار مسابقه
      ======================================================== */}
      {selectedComp && (
        <div className="std-modal-overlay" onClick={() => setSelectedComp(null)}>
          <div className="std-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="std-modal-header">
              <h3>
                <FaTrophy style={{ color: '#f59e0b' }} />
                نتیجه نهایی: {selectedComp.title}
              </h3>
              <button className="std-modal-close" onClick={() => setSelectedComp(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="std-modal-body">
              <div className="modal-result-spotlight">
                {renderRankBadge(selectedComp.rank)}
                <div className="spotlight-text">
                  <h4>عملکرد عالی در بین {selectedComp.totalParticipants} شرکت‌کننده</h4>
                  <p>تاییدیه و نتیجه داوری رسمی دپارتمان مسابقات آموزشگاه فناوران فردا</p>
                </div>
              </div>

              <div className="modal-metrics-grid">
                <div className="m-metric-card">
                  <span className="m-title">نمره کل مکتسبه</span>
                  <span className="m-val text-gold">
                    {selectedComp.score} از {selectedComp.totalScore}
                  </span>
                </div>
                <div className="m-metric-card">
                  <span className="m-title">مسائل با پاسخ ۱۰۰٪</span>
                  <span className="m-val text-cyan">
                    {selectedComp.solvedProblems} سوال
                  </span>
                </div>
                <div className="m-metric-card">
                  <span className="m-title">مدت زمان داوری</span>
                  <span className="m-val">{selectedComp.duration}</span>
                </div>
              </div>

              {selectedComp.prize && (
                <div className="modal-prize-box">
                  <FaAward className="prize-icon" />
                  <div>
                    <h5>جایزه و امتیاز اختصاص‌یافته:</h5>
                    <p>{selectedComp.prize}</p>
                  </div>
                </div>
              )}

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setSelectedComp(null)}
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCompetitions;
