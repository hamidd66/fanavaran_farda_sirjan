import { whyUsItems } from "constants/ui"
import "./whyUsSection.css"

function WhyUsSection() {
    return (
        <section className="py-5">
            <div className="container">
                <div className="text-center mb-4">
                    <h2 className="section-title">چرا فناوران فردا؟</h2>
                    <p className="section-sub">مزایای رقابتی آموزشگاه ما</p>
                </div>

                <div className="row g-4">
                    {whyUsItems.map((item, index) => (
                        <div className="col-6 col-md-3" key={index}>
                            <div className="why-card h-100">
                                <div className="why-icon">{<item.icon />}</div>
                                <h6>{item.title}</h6>
                                <p>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default WhyUsSection