import { useEffect, useState } from "react";
import { FaNewspaper, FaWandMagicSparkles } from "react-icons/fa6";

import { newsSectionImages, newsSectionList } from "constants/ui";
import "./newsSection.css"

function NewsSectionImage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (newsSectionImages.length <= 1) return;

        const slideTimer = setInterval(() => {
            setCurrentSlide((previousSlide) => {
                return (previousSlide + 1) % newsSectionImages.length;
            });
        }, 4000);

        return () => clearInterval(slideTimer);
    }, []);

    const activeSlide = newsSectionImages[currentSlide];

    return (
        <div className="news-box news-slider-box">
            <div className="news-box-header">
                <div>
                    <span className="news-box-small-title">
                        Technology News
                    </span>
                    <h2>اخبار روز فناوری</h2>
                </div>

                <div className="news-box-header-icon">
                    <FaNewspaper />
                </div>
            </div>

            <div className="news-slider">
                <img key={activeSlide.id} src={activeSlide.image} alt={activeSlide.title} className="news-slider-image" />

                <div className="news-slider-overlay">
                    <h3>{activeSlide.title}</h3>
                </div>

                <div className="news-slider-dots">
                    {newsSectionImages.map((slide, index) => (
                        <span key={index} className={index === currentSlide ? "news-dot active" : "news-dot"} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function NewsSectionList() {
    return (
        <div className="news-box news-list-box">
            <div className="news-box-header">
                <div>
                    <span className="news-box-small-title">
                        Latest Updates
                    </span>

                    <h2>آخرین خبرها</h2>
                </div>

                <div className="news-box-header-icon">
                    <FaWandMagicSparkles />
                </div>
            </div>

            <div className="news-list-image-wrapper">
                <img src="/images/newsSectionImage4.jpg" alt="آخرین اخبار فناوری" className="news-list-image" />
            </div>

            <div className="news-list-items">
                {newsSectionList.map((news, index) => (
                    <div className="news-list-item" key={index}>
                        <span className="news-list-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="news-list-content">
                            <span>{news.category}</span>
                            <h3>{news.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function NewsSection() {
    return (
        <section className="technology-news-section" dir="rtl">
            <div className="technology-news-container">
                <div className="technology-news-heading">
                    <span>مجله فناوران فردا</span>
                    <h1>دنیای فناوری را دنبال کنید</h1>
                    <p>
                        جدیدترین مطالب حوزه هوش مصنوعی، طراحی سایت،
                        فرانت‌اند و بک‌اند
                    </p>
                </div>

                <div className="technology-news-layout">
                    <NewsSectionImage />
                    <NewsSectionList />
                </div>
            </div>
        </section>
    );
}

export default NewsSection;
