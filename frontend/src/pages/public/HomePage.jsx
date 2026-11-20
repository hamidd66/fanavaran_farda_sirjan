import CourseCategorySection from "features/home/CourseCategorySection"
import HeroSection from "features/home/HeroSection"
import NewsSection from "features/home/NewsSection"
import PromoSection from "features/home/PromoSection"
import StatsBar from "features/home/StatsBar"
import TalentSection from "features/home/TalentSection"
import TopTeachersSection from "features/home/TopTeachersSection"
import WhyUsSection from "features/home/WhyUsSection"

function HomePage() {
    return (
        <section>
            <HeroSection />
            <StatsBar />
            <TalentSection />
            <CourseCategorySection />
            <TopTeachersSection />
            <PromoSection />
            <WhyUsSection />
            <NewsSection />
        </section>
    )
}

export default HomePage