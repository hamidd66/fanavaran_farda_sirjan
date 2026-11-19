import CourseCategorySectoin from "features/home/CourseCategorySectoin"
import HeroSection from "features/home/HeroSection"
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
    </section>
  )
}

export default HomePage