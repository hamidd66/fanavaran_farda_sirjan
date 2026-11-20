import { useState } from "react";
import { Link } from "react-router-dom"
import "./promoSection.css"

function PromoSection() {
    const [isMuted, setIsMuted] = useState(true);
    return (
        <section className="promo-section py-5 mb-3">
            <div className="container">
                <div className="row align-items-center justify-content-center gap-5 gap-lg-0">
                    <div className="col-lg-6 text-center">
                        <span
                            className="badge rounded-pill px-3 py-2 mb-3"
                            style={{ background: 'linear-gradient(90deg,#4f46e5,#3b82f6)', fontSize: '0.85rem' }}
                        >امکانات به‌روز</span>

                        <h6 className="fw-bold display-6 mb-3 text-white" style={{ lineHeight: 2 }}>
                            فضای الهام‌بخش همه‌چی آماده‌ست تا فقط تمرکزت رو بذاری روی یادگیری
                        </h6>

                        <div className="d-flex justify-content-center mt-4 flex-wrap gap-3">
                            <Link to="/gallery" className="btn btn-lg rounded-pill px-4 fw-semibold text-dark promo-btn">
                                فیلم‌های بیشتر
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="promo-video-wrap mx-auto">
                            <video className="promo-video" muted={isMuted} loop playsInline autoPlay onClick={() => setIsMuted(prev => !prev)}>
                                <source src="/videos/promoSectionVideo.mp4" type="video/mp4" />
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PromoSection