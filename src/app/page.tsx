import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import InfoCarousel from "@/components/sections/info-section";
import SponsorsSection from "@/components/sections/sponsors-section";
import JudgesSection from "@/components/sections/judges-section";
import TeamSection from "@/components/sections/team-section";
import FaqSection from "@/components/sections/faq-section";
import FooterSection from "@/components/sections/footer-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#03091a]">
      <HeroSection />
      <AboutSection />
      <InfoCarousel />
      <SponsorsSection />
      <JudgesSection />
      <TeamSection />
      <FaqSection />
      <FooterSection />
    </div>
  );
}
