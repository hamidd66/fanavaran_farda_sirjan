import CourseCategorySectoin from "features/home/CourseCategorySectoin"
import HeroSection from "features/home/HeroSection"
import PromoSection from "features/home/PromoSection"
import StatsBar from "features/home/StatsBar"
import TalentSection from "features/home/TalentSection"
import TopTeachersSection from "features/home/TopTeachersSection"

function HomePage() {
  return (
    <section>
      <HeroSection />
      <StatsBar />
      <TalentSection />
      <CourseCategorySectoin />
      <TopTeachersSection />
      <PromoSection />
    </section>
  )
}

export default HomePage