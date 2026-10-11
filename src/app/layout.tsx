import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import Reveal from "@/components/blueprint/Reveal";
import World from "@/components/scene/World";
import Konami from "@/components/world/Konami";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Departure Mono (OFL), the label face from arlanrakh.com: a pixel mono drawn
   on an 11px grid, so labels sit at 11px. Body stays Geist Mono for reading. */
const departure = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSH Hacks",
  description:
    "DSH Hacks V2: a free, global, online student hackathon focused on AI x Healthcare, hosted by DeltaForge Hacks, NXT Horizon, and STEMise.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05070B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${geistMono.variable} ${departure.variable}`}>
      <body>
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {/* Background stock + the garden world, mounted once. */}
        <div className="stock-grid" aria-hidden="true" />
        <World />
        <Konami />
        <Reveal />
        {children}
        <div className="stock-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
