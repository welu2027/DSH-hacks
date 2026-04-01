"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ExternalLink, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";
import Aurora from "@/components/sections/aurora";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const calculateTimeLeft = (): TimeLeft | {} => {
    // Count down to submission deadline: June 2, 2026 12:45am EDT
    const difference = +new Date("2026-06-02T04:45:00Z") - +new Date();
    let timeLeft: TimeLeft | {} = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(
    calculateTimeLeft() as TimeLeft
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft() as TimeLeft);
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeUnits = [
    { value: timeLeft.days || 0, label: "Days" },
    { value: timeLeft.hours || 0, label: "Hours" },
    { value: timeLeft.minutes || 0, label: "Minutes" },
    { value: timeLeft.seconds || 0, label: "Seconds" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h3 className="text-lg font-light text-white/80 mb-1">
        Submission Deadline — June 2, 2026
      </h3>
      <div className="flex gap-3 sm:gap-4 justify-center">
        {timeUnits.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="relative text-white rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[70px] text-center overflow-hidden">
              <div className="absolute inset-0 bg-[#0ea5e9] rounded-lg"></div>
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl font-thin leading-none text-white">
                  {label !== "Days" ? String(value).padStart(2, "0") : value}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-300 mt-2 uppercase tracking-wide">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#info", label: "Info" },
    { href: "#sponsors", label: "Sponsors" },
    { href: "#judges", label: "Judges" },
    { href: "#register", label: "Register" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/65 backdrop-blur-lg transition-colors">
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
          <div className="relative flex items-center justify-between py-4 h-16">
            <a href="#" className="flex items-center gap-3">
              <span className="text-xl font-bold text-white tracking-tight">
                DSH <span className="text-[#0ea5e9]">Hacks</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-white font-medium tracking-wide transition-all duration-200 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-xl text-white hover:bg-white/30 transition-all"
              aria-label="Open menu"
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <span className="block w-6 h-0.5 bg-white transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-white mt-1 transition-all duration-300"></span>
                <span className="block w-6 h-0.5 bg-white mt-1 transition-all duration-300"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ x: "-100%" }}
        animate={isMenuOpen ? { x: 0 } : { x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col"
      >
        <div className="flex justify-end p-6">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 rounded-full bg-sky-800 flex items-center justify-center hover:bg-sky-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col justify-center items-center gap-8 text-white text-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-gray-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </>
  );
};

export default function HeroSection() {
  return (
    <div className="antialiased bg-[#03091a] min-h-screen">
      <Navbar />
      <main className="min-h-[70vh] bg-[#03091a]">
        <section id="hero" className="min-h-screen relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl mx-4 mt-4 mb-4 min-h-[calc(100vh-32px)] pt-16 text-white"
          >
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-96px)] gap-8 py-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center flex flex-col items-center max-w-4xl"
                >
                  <a
                    href="https://dsh-hacks-v1.devpost.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-full font-normal text-sm transition-all duration-200 border border-white/20"
                  >
                    <ChevronRight className="w-3 h-3" />
                    Hosted by DeltaForge Hacks, NextHorizon & STEMise
                    <ChevronRight className="w-3 h-3" />
                  </a>

                  <div className="relative inline-block mb-6">
                    <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] xl:text-[96px] font-light tracking-tight text-white leading-none">
                      DSH HACKS V1
                    </h1>
                    <div className="absolute -bottom-3 left-0 w-full h-1 bg-[#0ea5e9] opacity-75"></div>
                  </div>

                  <p className="text-[#38bdf8] text-2xl font-semibold mb-3 mt-6">
                    AI × STEM Education
                  </p>
                  <p className="text-white/90 text-xl mb-8">
                    March 1 – May 1, 2026 &nbsp;|&nbsp; Online &nbsp;|&nbsp; Ages 13+
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <a
                      href="https://dsh-hacks-v1.devpost.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0ea5e9] text-white px-10 py-4 rounded-md text-lg font-medium hover:bg-[#0369a1] transition-colors inline-flex items-center gap-2 shadow-lg hover:shadow-sky-500/50"
                    >
                      Register on Devpost
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-2 border-[#0ea5e9] text-white px-10 py-4 rounded-md text-lg font-medium hover:bg-[#0369a1] hover:border-[#0369a1] hover:text-white transition-all inline-flex items-center gap-2"
                    >
                      Join Discord
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex justify-center w-full"
                >
                  <CountdownTimer />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Aurora
        colorStops={["#00e5ff", "#0066cc", "#0ea5e9"]}
        blend={0.4}
        amplitude={1.8}
        speed={0.4}
        className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none"
      />
    </div>
  );
}
