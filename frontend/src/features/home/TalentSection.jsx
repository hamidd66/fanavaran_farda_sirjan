import { BsCompass, BsLightbulbFill } from "react-icons/bs"
import "./talentSection.css"

function TalentSection() {
    return (
        <section className="talent-section">
            <div className="container">
                <h2>
                    <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                    <BsLightbulbFill className="text-warning ms-2" />
                    نمی‌دانید از کجا شروع کنید؟
                </h2>
                <p className="mt-3">
                    با آزمون استعدادیابی 10 دقیقه‌ای ما، پتانسیل و مسیر شغلی مناسب خود را
                    کشف کنید. تحلیل کاملاً رایگان است.
                </p>
                <a className="btn btn-talent" href="/talent.html">
                    <i className="bi bi-compass me-2"></i>
                    <BsCompass className="ms-2" />
                    شروع تست سنجش استعداد
                </a>
            </div>
        </section>
    )
}

export default TalentSection