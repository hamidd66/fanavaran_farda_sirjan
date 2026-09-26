import { useLayoutEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/stylegallery.css";



const VIDEO_DATA = [
  {
    id: 1,
    category: "manager",
    categoryLabel: "پیام مدیریت",
    icon: "bi-star-fill",
    title: "معرفی آموزشگاه توسط مهندس پورفریدونی",
    description: "صحبت مدیر مجموعه درباره اهداف و مسیر آموزشی فناوران فردا",
    src: "image/A3-1.mp4",
  },
  {
    id: 2,
    category: "trainee",
    categoryLabel: "کارآموزان",
    icon: "bi-people-fill",
    title: "تجربه کارآموزان دوره فرانت‌اند",
    description: "مصاحبه با هنرجویانی که پروژه واقعی ساخته‌اند و جذب بازار کار شده‌اند",
    src: "image/A3-1.mp4", // مسیر ویدیوهای خود را جایگزین کنید
  },
  {
    id: 3,
    category: "ai",
    categoryLabel: "تولید با هوش مصنوعی",
    icon: "bi-robot",
    title: "تیزر تبلیغاتی تولیدشده با AI",
    description: "ویدیوی خلاقانه با ابزارهای هوش مصنوعی برای معرفی دوره‌ها و امکانات",
    src: "image/A3-1.mp4",
  },
];

function Gallery() {





     useLayoutEffect(() => {
        window.scrollTo(0, 0);
      }, []);


  const [activeFilter, setActiveFilter] = useState("all");
  const [playingId, setPlayingId] = useState(null);
  
  // نگهداری مرجع ویدیوها برای مدیریت پخش و توقف مستقیم
  const videoRefs = useRef({});

  const handlePlay = (id) => {
    // متوقف کردن ویدیویی که احتمالاً در حال پخش است
    if (playingId && playingId !== id) {
      const prevVideo = videoRefs.current[playingId];
      if (prevVideo) prevVideo.pause();
    }

    setPlayingId(id);
    const currentVideo = videoRefs.current[id];
    if (currentVideo) {
      currentVideo.play().catch((err) => console.log("خطا در پخش ویدیو: ", err));
    }
  };

  const handlePauseOrEnded = (id) => {
    if (playingId === id) {
      setPlayingId(null);
    }
  };

  const filteredVideos = activeFilter === "all"
    ? VIDEO_DATA
    : VIDEO_DATA.filter((v) => v.category === activeFilter);

  return (
    <>
           <Navbar />

    <div className="gallery-page">
      {/* Hero Section */}
      <div className="container py-5">
        <div className="video-hero">
          <div className="content">
            <div className="eyebrow">
              <i className="bi bi-camera-reels me-2"></i>
              گالری رسانه
            </div>
            <h1>ویدیوهای معرفی و مستندات آموزشگاه فناوران فردا</h1>
            <p>
              مجموعه‌ای از فیلم‌های تبلیغاتی، پیام‌های مدیریت، تجربه کارآموزان و محتوای تولیدشده با هوش مصنوعی.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            <i className="bi bi-grid-fill me-2"></i>
            همه
          </button>
          <button
            className={`filter-btn ${activeFilter === "manager" ? "active" : ""}`}
            onClick={() => setActiveFilter("manager")}
          >
            <i className="bi bi-person-badge-fill me-2"></i>
            پیام مدیریت
          </button>
          <button
            className={`filter-btn ${activeFilter === "trainee" ? "active" : ""}`}
            onClick={() => setActiveFilter("trainee")}
          >
            <i className="bi bi-people-fill me-2"></i>
            کارآموزان
          </button>
          <button
            className={`filter-btn ${activeFilter === "ai" ? "active" : ""}`}
            onClick={() => setActiveFilter("ai")}
          >
            <i className="bi bi-robot me-2"></i>
            تولید با هوش مصنوعی
          </button>
        </div>

        {/* Video Grid */}
        <div className="row g-4 justify-content-center" id="videoGrid">
          {filteredVideos.map((video) => {
            const isPlaying = playingId === video.id;

            return (
              <div key={video.id} className="col-sm-6 col-lg-4 video-item show">
                <div className="circle-card">
                  <div
                    className={`circle-media-wrap ${isPlaying ? "playing" : ""}`}
                    onClick={() => {
                      if (!isPlaying) handlePlay(video.id);
                    }}
                  >
                    <video
                      ref={(el) => (videoRefs.current[video.id] = el)}
                      preload="metadata"
                      playsInline
                      controls={isPlaying}
                      onPause={() => handlePauseOrEnded(video.id)}
                      onEnded={() => handlePauseOrEnded(video.id)}
                    >
                      <source src={video.src} type="video/mp4" />
                      مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند.
                    </video>

                    {!isPlaying && (
                      <div className="circle-play">
                        <i className="bi bi-play-fill"></i>
                      </div>
                    )}
                  </div>

                  <span className="badge-cat">
                    <i className={`bi ${video.icon} me-1`}></i>
                    {video.categoryLabel}
                  </span>
                  <h5>{video.title}</h5>
                  <p>{video.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Gallery;
