"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const faqData: { id: string; question: string; answer: React.ReactNode }[] = [
  { id: "faq-1",  question: "Who can participate?",
    answer: "All students aged 13+ are eligible to participate. The event is open to students from all countries and territories (excluding standard exceptions)." },
  { id: "faq-2",  question: "Is DSH Hacks V1 free to enter?",
    answer: "Yes! DSH Hacks V1 is completely free to participate in." },
  { id: "faq-3",  question: "When does the hackathon take place?",
    answer: "The hackathon runs from March 1st, 2026 at 12:00 AM CST to May 1st, 2026 at 11:45 PM CST. The project submission deadline is June 2nd, 2026 at 12:45 AM EDT." },
  { id: "faq-4",  question: "Can I work solo or do I need a team?",
    answer: "You can work individually or in a team. We recommend finding like-minded individuals to collaborate with — check out the DeltaForge Hacks and STEMise Discord servers to find teammates!" },
  { id: "faq-5",  question: "What is the theme?",
    answer: "The theme is AI × STEM Education. You'll be building a meaningful technical product that leverages AI to improve, enhance, or expand STEM education." },
  { id: "faq-6",  question: "What do I need to submit?",
    answer: "Your submission must include: (1) a Project — a website, app, or prototype with user interaction; (2) a Demo Video; (3) a One-Page Project Description in PDF; and (4) a GitHub Repository or Code PDF." },
  { id: "faq-7",  question: "Can I use AI tools to help build my project?",
    answer: "Yes! Participants are allowed and encouraged to use AI tools to help build their solutions. The goal is to lower the technical barrier for beginners with ambitious ideas." },
  { id: "faq-8",  question: "What are the prizes?",
    answer: "1st Place: $100 Cash + CodeCrafters 2yr VIP + Featherless AI Credits ($300) + HRT Merch. 2nd Place: $75 Cash + CodeCrafters 1yr VIP + Featherless AI Credits ($150) + HRT Merch. 3rd Place: $50 Cash + CodeCrafters 6mo VIP + Featherless AI Credits ($75) + HRT Merch. All participants receive an Ideavo Pro Plan (50% off) + Participation Certificate." },
  { id: "faq-9",  question: "How will projects be judged?",
    answer: "Projects are judged on Idea (30 pts), Implementation (30 pts), Design (20 pts), and Presentation (20 pts)." },
  { id: "faq-10", question: "Who is hosting DSH Hacks V1?",
    answer: "DSH Hacks V1 is hosted collaboratively by three youth-led organizations: DeltaForge Hacks, NextHorizon, and STEMise." },
  { id: "faq-11", question: "Where can I get updates and find teammates?",
    answer: "Join both the DeltaForge Hacks and STEMise Discord servers. All announcements, workshop schedules, and community discussions will be posted there." },
  { id: "faq-12", question: "I have another question.",
    answer: "Join our Discord servers and make a ticket — we'll get back to you as soon as possible!" },
];

const FaqSection = () => {
  return (
    <section id="faq" className="bg-[#03091a] text-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 sm:h-24 sm:w-24 items-center justify-center rounded-full text-4xl sm:text-5xl font-bold bg-[#0ea5e9] text-white">6</div>
            <h2 className="text-5xl sm:text-7xl font-light tracking-tight">FAQ</h2>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Accordion type="single" collapsible className="w-full mt-12">
            {faqData.map((faq, index) => (
              <motion.div key={faq.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, delay: index * 0.05 }}>
                <AccordionItem value={faq.id} className="group border-b border-border">
                  <AccordionTrigger className="py-6 text-xl font-medium text-left transition-all hover:underline [&>svg:last-child]:hidden">
                    {faq.question}
                    <Plus  className="h-6 w-6 shrink-0 text-white transition-transform duration-200 group-data-[state=open]:hidden" />
                    <Minus className="h-6 w-6 shrink-0 text-white transition-transform duration-200 hidden group-data-[state=open]:block" />
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-4 text-base text-white/80 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
