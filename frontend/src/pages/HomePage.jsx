import { useLayoutEffect } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import TalentSection from "../components/TalentSection";
import CourseCategories from "../components/CourseCategories";
import PopularCourses from "../components/PopularCourses";
import TopStudents from "../components/TopStudents";
import TopPerformers from "../components/TopPerformers";
import PromoSection from "../components/PromoSection";
import WhyUs from "../components/WhyUs";
import BlogSection from "../components/BlogSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

function HomePage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <StatsBar />
      <TalentSection />
      <CourseCategories />
      <PopularCourses />
      <TopStudents />
      <TopPerformers/>
      <PromoSection />
      <WhyUs />
      <BlogSection />
      <Testimonials />
      <Footer />
    </>
  );
}

export default HomePage;
