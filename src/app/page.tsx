import PlatesProvider from "@/components/plates/PlatesProvider";
import Marquee from "@/components/plates/Marquee";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Index from "@/components/sections/Index";
import About from "@/components/sections/About";
import Plates from "@/components/sections/Plates";
import Schedule from "@/components/sections/Schedule";
import Prizes from "@/components/sections/Prizes";
import People from "@/components/sections/People";
import Ledger from "@/components/sections/Ledger";
import Faq from "@/components/sections/Faq";
import Register from "@/components/sections/Register";
import Footer from "@/components/sections/Footer";

/* One continuous world: no dividers or background changes between sections.
   The trace and field (mounted in the root layout) read the data-beat /
   data-node / data-swing markers these sections carry. */
export default function HomePage() {
  return (
    <PlatesProvider>
      <Nav />
      <main>
        <Marquee />
        <Hero />
        <Index />
        <About />
        <Plates />
        <Schedule />
        <Prizes />
        <People />
        <Ledger />
        <Faq />
        <Register />
      </main>
      <Footer />
    </PlatesProvider>
  );
}
