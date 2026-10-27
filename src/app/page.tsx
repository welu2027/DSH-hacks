import PlatesProvider from "@/components/plates/PlatesProvider";
import World from "@/components/world/World";
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

/* One descent through one world: the summit (hero), down through the cloud
   layer (sections 01–11), out below it at dusk onto the valley floor (final
   CTA), then the ground (footer). */
export default function HomePage() {
  return (
    <PlatesProvider>
      <World />
      <div className="page">
        <Nav />
        <main>
          <Hero />
          {/* the cloud layer: a mist veil over the world while you read */}
          <div className="clouds">
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
          </div>
          <Register />
        </main>
        <Footer />
      </div>
    </PlatesProvider>
  );
}
