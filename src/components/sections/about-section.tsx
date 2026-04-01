"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const statsData = [
  { value: "209+", title: "PARTICIPANTS", description: "" },
  { value: "18+",  title: "JUDGES",       description: "" },
  { value: "9+",   title: "SPONSORS",     description: "" },
];

const StatCard = ({
  value, title, description, isVisible,
}: (typeof statsData)[0] & { isVisible: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    let startTime: number | null = null;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(easeOutQuart * numericValue);
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(numericValue);
    };
    requestAnimationFrame(animate);
  }, [isVisible, value]);

  const formattedValue = value.includes("+") ? `${displayValue}+` : displayValue.toString();

  return (
    <div className="bg-[#282828] rounded-lg p-8 text-center">
      <div className="text-4xl sm:text-5xl font-bold mb-4">{formattedValue}</div>
      <div className="text-xl font-semibold mb-2">{title}</div>
      <div className="text-sm opacity-80 leading-relaxed">{description}</div>
    </div>
  );
};

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setIsVisible(true); }); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="bg-[#0d0d0d] text-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#8007F7] text-4xl font-bold text-white sm:h-24 sm:w-24 sm:text-5xl">1</div>
            <h2 className="text-5xl font-light tracking-tight sm:text-7xl">About</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 max-w-6xl">
          <p className="mb-6 text-xl leading-relaxed sm:text-2xl">
            DSH Hacks V1 is a global student competition open to students aged 13+, hosted collaboratively by three youth-led organizations:{" "}
            <span className="text-[#B976FC] font-semibold">DeltaForge Hacks</span>,{" "}
            <span className="text-[#B976FC] font-semibold">NextHorizon</span>, and{" "}
            <span className="text-[#B976FC] font-semibold">STEMise</span>.
          </p>
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-4">
            Theme: <span className="text-white font-semibold">AI × STEM Education</span>
          </p>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
            This event brings together young innovators from around the world to reimagine the future of STEM education through artificial intelligence. Participants will work individually or in teams to design and develop a meaningful technical product that leverages AI to improve, enhance, or expand STEM education.
          </p>
        </motion.div>

        <div ref={sectionRef} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statsData.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <StatCard {...stat} isVisible={isVisible} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
