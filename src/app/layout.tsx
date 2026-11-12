import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import Konami from "@/components/world/Konami";
import { LINKS } from "@/components/sections/shared";
import { SITE_URL } from "./site";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
// headline accents only
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif", display: "swap" });

const TITLE = "DSH Hacks — Free global student hackathon for AI that helps people";
const DESCRIPTION =
  "DSH Hacks is a free, online hackathon series for students 13+ in 100 countries, building human-centered AI. V2: AI × Healthcare, $100,000+ in prizes, submissions close Nov 14, 2026. Run by DeltaForge Hacks, NXT Horizon, and STEMise.";

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL), alternates: { canonical: "/" } }),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "DSH Hacks",
  keywords: ["DSH Hacks", "student hackathon", "high school hackathon", "online hackathon", "AI hackathon", "AI healthcare hackathon", "free hackathon", "global hackathon", "Devpost", "STEMise", "DeltaForge Hacks", "NXT Horizon"],
  authors: [{ name: "DSH Hacks" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "DSH Hacks",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DSH Hacks — Technology, brought down to earth." }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.png"] },
  icons: { icon: "/favicon.png", apple: "/dsh-logo-circle.png" },
};

/* structured data for search engines: the organization and the live event */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "DSH Hacks",
      ...(SITE_URL && { url: SITE_URL, logo: `${SITE_URL}/dsh-logo-circle.png` }),
      sameAs: [LINKS.youtube, LINKS.instagram, LINKS.devpost],
    },
    {
      "@type": "Event",
      name: "DSH Hacks V2: AI × Healthcare",
      description: "A free, online hackathon for students 13+ to build AI that brings healthcare closer to patients. $100,000+ in prizes.",
      startDate: "2026-06-24T09:00:00-07:00",
      endDate: "2026-11-14T23:45:00-08:00",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: LINKS.devpost },
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: 0, priceCurrency: "USD", availability: "https://schema.org/InStock", url: LINKS.devpost },
      organizer: { "@type": "Organization", name: "DSH Hacks", ...(SITE_URL && { url: SITE_URL }) },
      ...(SITE_URL && { image: `${SITE_URL}/og.png` }),
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="lazyOnload"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <Konami />
        <Reveal />
        {children}
      </body>
    </html>
  );
}
