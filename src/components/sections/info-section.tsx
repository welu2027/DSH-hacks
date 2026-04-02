"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const infoCards = [
  {
    title: "Schedule",
    content: "Submission Deadline: June 2, 2026\n\nWorkshop and event schedules will be posted in the DSH Hacks Discord!\n\nMake sure to join the Discord server to stay up to date on all announcements and live sessions.",
  },
  {
    title: "Theme",
    content: "AI × STEM Education\n\nParticipants will design and develop a meaningful technical product that leverages AI to improve, enhance, or expand STEM education.\n\nProjects may range from ML tools that personalize learning pathways, to computer vision systems for lab simulations, to AI-driven platforms that increase accessibility for underrepresented communities.\n\nThe theme track will have special prizes for projects that align with the announced theme.",
  },
  {
    title: "Rules",
    content: "• All students aged 13+ are eligible to participate.\n• Projects must demonstrate a novel creation of a specialized system made to solve an identified problem.\n• Submissions should demonstrate use in at least a demonstrative capacity.\n• Teams may work individually or in groups.\n• Projects must be original and built during the hackathon period.\n• Follow all community guidelines and maintain a respectful, inclusive environment.",
    link: "https://dsh-hacks-v1.devpost.com/rules",
    linkLabel: "View full rules",
  },
  {
    title: "Prizes",
    content: "🥇 1st Place – $100 Cash + CodeCrafters 2yr VIP ($720) + Featherless AI Credits ($300) + HRT Merch\n\n🥈 2nd Place – $75 Cash + CodeCrafters 1yr VIP ($360) + Featherless AI Credits ($150) + HRT Merch\n\n🥉 3rd Place – $50 Cash + CodeCrafters 6mo VIP ($180) + Featherless AI Credits ($75) + HRT Merch\n\n🎖️ Participation Prize – Ideavo Pro Plan (50% off) + Participation Certificate + Devpost Achievements",
  },
  {
    title: "Judging Criteria",
    content: "Projects are judged on four components:\n\n1. Idea (30 pts) – Did the proposal address the theme? Was the idea innovative? How much potential impact could it have?\n\n2. Implementation (30 pts) – Does the solution work? How technically challenging was the implementation?\n\n3. Design (20 pts) – Did the team put thought into UX? How well designed is the interface?\n\n4. Presentation (20 pts) – Does the presentation clearly define and address the problem statement?",
  },
  {
    title: "Submission Requirements",
    content: "Your submission must include:\n\n• Project: A website, app, or coding prototype with user interaction capabilities. Hardware with a coding component is allowed.\n\n• Demo Video: Explaining the purpose, showcasing features, and demonstrating how users interact with the prototype.\n\n• One-Page Project Description (PDF): Describing the project purpose and key features.\n\n• GitHub Repository / Code PDF: Showcasing all code developed for the project.",
    link: "https://dsh-hacks-v1.devpost.com/",
    linkLabel: "Submit on Devpost",
  },
];

const InfoCarousel = () => {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateLayout = () => {
    const width = window.innerWidth;
    if (width < 640) setVisibleCards(1);
    else if (width < 1024) setVisibleCards(2);
    else setVisibleCards(3);
    if (containerRef.current) setCardWidth(containerRef.current.offsetWidth / visibleCards);
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [visibleCards]);

  const next = () => setIndex((prev) => prev >= infoCards.length - visibleCards ? 0 : prev + 1);
  const prev = () => setIndex((prev) => prev <= 0 ? infoCards.length - visibleCards : prev - 1);

  return (
    <section id="info" className="bg-[#03091a] text-white py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-4xl font-bold text-white sm:h-24 sm:w-24 sm:text-5xl">2</div>
            <h2 className="text-5xl font-light tracking-tight sm:text-7xl">INFO</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={prev} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"><ChevronLeft className="w-6 h-6" /></button>
            <button onClick={next} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"><ChevronRight className="w-6 h-6" /></button>
          </div>
        </div>
        <div ref={containerRef} className="relative overflow-hidden w-full">
          <motion.div className="flex" animate={{ x: -index * cardWidth }} transition={{ type: "spring", stiffness: 90, damping: 20 }}>
            {infoCards.map((card) => (
              <div key={card.title} style={{ minWidth: cardWidth }} className="p-4 sm:p-6">
                <div className="bg-[#0b1628] p-8 rounded-2xl shadow-lg border border-white/10 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
                    <p className="text-base text-gray-300 whitespace-pre-line leading-relaxed">{card.content}</p>
                  </div>
                  {card.link && (
                    <a href={card.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-[#38bdf8] hover:underline font-semibold">
                      {card.linkLabel || "Learn more"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoCarousel;
