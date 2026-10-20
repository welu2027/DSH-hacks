import PlatesProvider from "@/components/plates/PlatesProvider";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Ticker from "@/components/sections/Ticker";
import About from "@/components/sections/About";
import Plates from "@/components/sections/Plates";
import Sponsors from "@/components/sections/Sponsors";
import Prizes from "@/components/sections/Prizes";
import Schedule from "@/components/sections/Schedule";
import People from "@/components/sections/People";
import Staff from "@/components/sections/Staff";
import Faq from "@/components/sections/Faq";
import ComingSoon from "@/components/sections/ComingSoon";
import Register from "@/components/sections/Register";
import Footer from "@/components/sections/Footer";

/* One continuous scene: sections are transparent over a single page-long
   wash, and their art layers bleed across section edges. */
export default function HomePage() {
  return (
    <PlatesProvider>
      <div className="page">
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <About />
          <Plates />
          <Sponsors />
          <Prizes />
          <Schedule />
          <People />
          <Staff />
          <Faq />
          <ComingSoon />
          <Register />
        </main>
        <Footer />
      </div>
    </PlatesProvider>
  );
}
