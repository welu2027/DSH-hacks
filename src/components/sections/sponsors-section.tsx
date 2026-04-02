"use client";

import React from "react";
import { motion } from "framer-motion";

const sponsors = [
  "Hudson River Trading",
  "CodeCrafters",
  "Featherless AI",
  "Ideavo",
  "LLM.API",
  "relay.app",
  "InterviewBuddy",
  "Interview Cake",
  "Aniko",
];

const SponsorsSection = () => {
  return (
    <section id="sponsors" className="bg-[#03091a] py-16 text-white sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-6 mb-10">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-4xl font-bold text-white sm:h-24 sm:w-24 sm:text-5xl">3</div>
            <h2 className="text-5xl font-light tracking-tight sm:text-7xl">Sponsors</h2>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12 max-w-4xl">
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
            Interested in supporting DSH Hacks V1? Reach out to us on Discord or email the hackathon manager via{" "}
            <a href="https://dsh-hacks-v1.devpost.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline transition-colors">Devpost</a>{" "}
            to learn about sponsorship opportunities.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sponsors.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 hover:border-[#0ea5e9]/50 hover:bg-white/15 transition-all py-8 px-6"
              >
                <span className="text-white text-lg font-medium tracking-tight">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SponsorsSection;
