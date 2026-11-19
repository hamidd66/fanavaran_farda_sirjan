import { BsFillGeoAltFill, BsFillPatchCheckFill, BsFillTelephoneFill, BsInstagram, BsShieldCheck } from "react-icons/bs"
import { footerLinks } from "constants/ui"
import { Link } from "react-router-dom"
import "./mainFooter.css"

function MainFooter() {
    return (
        <div className="container">
            <div className="row g-4">
                <div className="col-md-3">
                    <div className="footer-brand mb-2 d-flex align-items-center">
                        <img src="/images/logo1.png" alt="لوگو" className="me-1" style={{ height: '48px' }} />
                        <div>
                            فناوران <span>فردا</span>
                        </div>
                    </div>
                    <p>
                        آموزشگاه تخصصی برنامه‌نویسی و هوش مصنوعی در سیرجان. مسیر شغلی شما
                        از اینجا شروع می‌شود.
                    </p>
                    <a href="https://t.me/fanavaranfarda1" className="social-btn" target="_blank" rel="noreferrer">
                        fanavaranfarda_sirjan1 @
                        <BsInstagram className="text-primary fs-6" />
                    </a>
                </div>

                <div className="col-md-3">
                    <h6>دسترسی سریع</h6>
                    {footerLinks.map((item, index) => (
                        <Link key={index} to={item.href} className="d-block">{item.title}</Link>
                    ))}
                </div>

                <div className="col-md-3">
                    <h6>تماس با ما</h6>
                    <p>
                        <BsFillTelephoneFill color="#818cf8" className="ms-2" />
                        ۰۹۰۵۰۹۵۸۷۱۵
                    </p>
                    <p>
                        <BsFillGeoAltFill color="#818cf8" className="ms-2" />
                        سیرجان، بلوار سیدجمال، بعد از کلانتری ۱۳، جنب صدف مارکت
                    </p>
                </div>

                <div className="col-md-3">
                    <h6>نمادهای اعتماد</h6>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="enamad-box">
                            <BsFillPatchCheckFill color="#4f46e5" className="d-block fs-4 mb-3 text-center w-100" />
                            اینماد
                        </div>
                        <div className="enamad-box">
                            <BsShieldCheck color="#16a34a" className="d-block fs-4 mb-3 text-center w-100" />
                            ساماندهی
                        </div>
                    </div>
                </div>
            </div>

            <div className="copyright">
                تمامی حقوق مادی و معنوی این سایت متعلق به آموزشگاه کامپیوتر فناوران فردا (مهندس حمید پورفریدونی) می‌باشد.
            </div>
        </div>
    )
}

export default MainFooter