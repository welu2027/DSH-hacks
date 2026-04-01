"use client";

import React from "react";
import { motion } from "framer-motion";

interface Sponsor {
  name: string;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

const sponsors: Sponsor[] = [
  { name: "Hudson River Trading", tier: "diamond" },
  { name: "CodeCrafters",         tier: "gold" },
  { name: "Featherless AI",       tier: "gold" },
  { name: "Ideavo",               tier: "silver" },
  { name: "LLM.API",              tier: "silver" },
  { name: "relay.app",            tier: "silver" },
  { name: "InterviewBuddy",       tier: "bronze" },
  { name: "Interview Cake",       tier: "bronze" },
  { name: "Aniko",                tier: "bronze" },
];

const tierConfig = {
  diamond: { label: "Diamond",  cols: "grid-cols-1",                textSize: "text-2xl font-bold",   py: "py-10" },
  gold:    { label: "Gold",     cols: "grid-cols-2",                textSize: "text-xl font-semibold", py: "py-8"  },
  silver:  { label: "Silver",   cols: "grid-cols-3",                textSize: "text-lg font-medium",   py: "py-7"  },
  bronze:  { label: "Bronze",   cols: "grid-cols-2 sm:grid-cols-3", textSize: "text-base font-medium", py: "py-6"  },
};

const tierOrder: Array<keyof typeof tierConfig> = ["diamond", "gold", "silver", "bronze"];

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

        <div className="flex flex-col gap-6">
          {tierOrder.map((tier) => {
            const filtered = sponsors.filter((s) => s.tier === tier);
            if (!filtered.length) return null;
            const cfg = tierConfig[tier];
            return (
              <motion.div key={tier} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
                <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-semibold">{cfg.label}</p>
                <div className={`grid ${cfg.cols} gap-4`}>
                  {filtered.map((s) => (
                    <div
                      key={s.name}
                      className={`flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 hover:border-[#0ea5e9]/50 hover:bg-white/15 transition-all ${cfg.py} px-6`}
                    >
                      <span className={`text-white ${cfg.textSize} tracking-tight`}>{s.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
