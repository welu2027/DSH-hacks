"use client";

import React from "react";
import { motion } from "framer-motion";

const judges = [
  { name: "DeltaForge Team",                    title: "Team with Strong Computer Science Knowledge" },
  { name: "STEMise Team",                        title: "Team Passionate about STEM and Innovation" },
  { name: "Sohil Shah",                          title: "Staff Software Engineer, PayPal" },
  { name: "Lovleen Kaur",                        title: "Software Engineer, Cisco Systems" },
  { name: "Avaneesh Desai",                      title: "Senior Frontend Engineer, Highspot" },
  { name: "Jaikumar Banthia",                    title: "Software Development Manager, Amazon Web Services" },
  { name: "Fenil Shah",                          title: "Senior Software Engineer, Amazon" },
  { name: "Himanshu Aseeja",                     title: "Principal Architect & Vice President, Citizens Bank" },
  { name: "Praneetha Kotla",                     title: "Lead Robotic Process Automation Developer, ERP Smartlabs" },
  { name: "Sharan Babu ParamasivamMurugesan",    title: "Senior Software Engineer, Microsoft" },
  { name: "Parth Rana",                          title: "Assistant Vice President, State Street" },
  { name: "Suraj Devatha",                       title: "Senior Software Engineer" },
  { name: "Danil Matrosov",                      title: "Founder & CEO, Octery" },
  { name: "Aman Bakshi",                         title: "Senior Software Engineer, Apple" },
  { name: "Gediminas Pažėra",                   title: "Healthcare AI Engineer (Oxford PhD)" },
  { name: "Bharat Khanna",                       title: "Senior Staff Backend and AI Systems Engineer, Achieve" },
  { name: "Chandni Bhatia",                      title: "Vice President and Lead Quantitative Developer" },
  { name: "Preethi Bharathy",                    title: "Data Scientist" },
  { name: "Srinath Gopinath",                    title: "Reliability Engineer" },
];

const JudgesSection = () => {
  return (
    <section id="judges" className="bg-[#0d0d0d] text-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#8007F7] text-4xl font-bold text-white sm:h-24 sm:w-24 sm:text-5xl">4</div>
            <h2 className="text-5xl font-light tracking-tight sm:text-7xl">Judges</h2>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-8 text-lg sm:text-xl text-white/70 max-w-3xl">
          Our panel of {judges.length} judges includes industry professionals from leading tech companies and academic institutions.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {judges.map((judge, index) => (
            <motion.div
              key={judge.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-[#8007F7]/40 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#8007F7]/20 border border-[#8007F7]/40 flex items-center justify-center text-[#B976FC] font-bold text-sm">
                {judge.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white leading-tight">{judge.name}</p>
                <p className="text-sm text-white/50 mt-1 leading-snug">{judge.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JudgesSection;
