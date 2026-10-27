import PlatesProvider from "@/components/plates/PlatesProvider";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import V2 from "@/components/sections/V2";
import Plates from "@/components/sections/Plates";
import Sponsors from "@/components/sections/Sponsors";
import Prizes from "@/components/sections/Prizes";
import Schedule from "@/components/sections/Schedule";
import People from "@/components/sections/People";
import Workshops from "@/components/sections/Workshops";
import Faq from "@/components/sections/Faq";
import ComingSoon from "@/components/sections/ComingSoon";
import Register from "@/components/sections/Register";
import Footer from "@/components/sections/Footer";

/* One descent: summit (hero) → valley mist (sections) → valley floor
   (final CTA and footer). */
export default function HomePage() {
  return (
    <PlatesProvider>
      <div className="page">
        <Nav />
        <main>
          <Hero />
          <About />
          <Journey />
          <V2 />
          <Plates />
          <Prizes />
          <Schedule />
          <Workshops />
          <Sponsors />
          <People />
          <Faq />
          <ComingSoon />
          <Register />
        </main>
        <Footer />
      </div>
    </PlatesProvider>
  );
}
