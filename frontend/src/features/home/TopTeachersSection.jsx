import { useQuery } from "@tanstack/react-query"
import { Ratio } from "react-bootstrap";

import { getPublicTeachers } from "services/user"
import "./topTeachersSection.css"

function TopTeachersSection() {
    const { data: teachers, isPending, isError } = useQuery({
        queryKey: ["getTeachers"],
        queryFn: getPublicTeachers,
    })

    if (isPending || isError) return null
    return (
        <section className="top-performers-section py-5" dir="rtl">
            <div className="container text-center">

                <div>
                    <span className="top-performers-badge">
                        انتخاب‌های برتر فناوران فردا
                    </span>
                    <h2 className="section-title">اساتید برتر آموزشگاه  </h2>
                    <p className="section-sub">
                        معرفی برترین‌ اساتید بر اساس نظرسنجی و عملکرد آموزشی
                    </p>
                </div>

                <div className="performers-block mb-5 mt-4">
                    <div className="row g-4 justify-content-center">
                        {teachers?.users?.map(teacher => (
                            <div className="col-12 col-sm-6 col-lg-3" key={teacher.id}>
                                <article className="performer-card h-100">
                                    {/* <div className="performer-card-top">
                                        <div className="performer-icon">
                                            <i className={`bi ${teacher.icon}`}></i>
                                        </div>
                                        <div className="performer-score">
                                            <i className="bi bi-star-fill"></i>
                                            <span>{teacher.score}</span>
                                        </div>
                                    </div> */}

                                    <div className="performer-avatar-wrap">
                                        <Ratio prefix="1x1">
                                            <img src={teacher.files[0].url} alt={teacher.person.first_name} className="performer-avatar" />
                                        </Ratio>
                                    </div>

                                    <h3 className="performer-name">{teacher.person.first_name + " " + teacher.person.last_name}</h3>
                                    <p className="performer-field">{teacher.person.job_title}</p>

                                    {/* <div className="performer-meta">
                                        <i className="bi bi-chat-square-text"></i>
                                        <span>{teacher.votes}</span>
                                    </div> */}
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopTeachersSection