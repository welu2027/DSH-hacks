import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist_Mono, Doto } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Field from "@/components/world/Field";
import Trace from "@/components/world/Trace";
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

/* Countdown digits and schedule step numbers only. */
const doto = Doto({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-doto",
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
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${geistMono.variable} ${doto.variable}`}>
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
        {/* Background stock + the continuous world, mounted once. */}
        <div className="stock-grid" aria-hidden="true" />
        <Field />
        <Trace />
        <Konami />
        {children}
        <div className="stock-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
