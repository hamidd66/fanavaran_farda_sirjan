import { Link } from "react-router-dom"
import { Lottie } from "lottie-react"
import { BsFillTrophyFill, BsPlayCircle } from "react-icons/bs"
import "./heroSection.css"

function HeroSection() {
    return (
        <div className="hero">
            <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6 order-lg-1 order-2">
                        <div className="hero-img">
                            <Lottie
                                src="/lotties/heroAnimation.json"
                                background="transparent"
                                speed="1"
                                style={{ width: '100%', height: '100%' }}
                                loop
                                autoplay
                            />
                        </div>
                    </div>

                    <div className="col-lg-6 order-lg-2 order-1">
                        <h1 className="text-center">
                            از سیرجان به دنیای فناوری
                        </h1>

                        <h2 className="fw-bold fs-2 text-primary text-center">
                            با آموزشگاه فناوران فردا
                        </h2>

                        <p className="mt-3 text-center">
                            آموزش تخصصی و پروژه‌محور فرانت‌اند، بک‌اند، هوش مصنوعی و دیتاساینس
                            به همراه سیستم هوشمند استعدادیابی و معرفی به بازار کار.
                        </p>

                        <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center">
                            <Link to="/competition" className="btn btn-primary-custom d-flex align-items-center justify-content-center">
                                <BsFillTrophyFill className="ms-2" />
                                <p className="m-0">
                                    مسابقات رایگان برنامه‌نویسی
                                </p>
                            </Link>

                            <Link to="/courses" className="btn btn-outline-custom d-flex align-items-center justify-content-center">
                                <BsPlayCircle className="ms-2" />
                                <p className="m-0 btn-outline-custom-text">
                                    مشاهده دوره‌های فعال
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection