import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Ratio } from 'react-bootstrap'
import { BsArrowLeftShort } from 'react-icons/bs'

import { getCourseCategory } from 'services/courseCategory'
import "./courseCategorySectoin.css"

function CourseCategorySectoin() {
    const { data: categories, isPending, isError } = useQuery({
        queryKey: ["getCourseCategory"],
        queryFn: getCourseCategory,
    })

    if (isPending || isError) return null
    return (
        <section className="course-categories py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">دسته‌بندی دوره‌ها</h2>
                    <p className="section-sub">
                        مسیر یادگیری خود را انتخاب کنید و قدم‌به‌قدم وارد دنیای فناوری شوید
                    </p>
                </div>

                <div className="row g-4 justify-content-center">
                    {categories?.categories?.map(category => (
                        <div className="col-12 col-sm-6 col-lg-3" key={category.id}>
                            <div className="cat-card h-100">
                                <div className="cat-icon">
                                    <Ratio prefix='1x1' className='rounded-4 overflow-hidden'>
                                        <img src={category.files[0].url} alt="" />
                                    </Ratio>
                                </div>
                                <h3>{category.name}</h3>
                                <p>{category.description}</p>
                                <Link to={`/category/${category.slug}`} className="cat-link">
                                    مشاهده توضیحات
                                    <BsArrowLeftShort fontSize="20px" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CourseCategorySectoin