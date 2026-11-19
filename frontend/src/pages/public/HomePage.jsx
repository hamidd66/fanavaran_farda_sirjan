import HeroSection from "features/home/HeroSection"
import StatsBar from "features/home/StatsBar"
import TalentSection from "features/home/TalentSection"

function HomePage() {
  return (
    <section>
      <HeroSection />
      <StatsBar />
      <TalentSection />
    </section>
  )
}

export default HomePage