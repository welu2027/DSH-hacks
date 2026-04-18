"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const judges = [
  { name: "Sohil Shah",                          title: "Staff Software Engineer, PayPal",                               photo: "/professionals/sohilshah.png" },
  { name: "Lovleen Kaur",                        title: "Software Engineer, Cisco Systems",                              photo: "/professionals/lovleenkaur.png" },
  { name: "Avaneesh Desai",                      title: "Senior Frontend Engineer, Highspot",                            photo: "/professionals/avaneeshdesai.png" },
  { name: "Jaikumar Banthia",                    title: "Software Development Manager, Amazon Web Services",             photo: "/professionals/jaikumarbanthia.png" },
  { name: "Fenil Shah",                          title: "Senior Software Engineer, Amazon",                              photo: "/professionals/fenilshah.png" },
  { name: "Himanshu Aseeja",                     title: "Principal Architect & Vice President, Citizens Bank",           photo: "/professionals/himanshuaseeja.png" },
  { name: "Praneetha Kotla",                     title: "Lead Robotic Process Automation Developer, ERP Smartlabs",     photo: "/professionals/praneethakotla.png" },
  { name: "Sharan Babu ParamasivamMurugesan",    title: "Senior Software Engineer, Microsoft",                          photo: "/professionals/sharanbabu.png" },
  { name: "Parth Rana",                          title: "Assistant Vice President, State Street",                        photo: "/professionals/partharana.png" },
  { name: "Suraj Devatha",                       title: "Senior Software Engineer",                                      photo: "/professionals/surajdevatha.png" },
  { name: "Danil Matrosov",                      title: "Founder & CEO, Octery",                                         photo: "/professionals/danilmatrosov.png" },
  { name: "Aman Bakshi",                         title: "Senior Software Engineer, Apple",                               photo: "/professionals/amanbakshi.png" },
  { name: "Gediminas Pažėra",                   title: "Healthcare AI Engineer (Oxford PhD)",                           photo: "/professionals/gediminaspazera.png" },
  { name: "Bharat Khanna",                       title: "Senior Staff Backend and AI Systems Engineer, Achieve",         photo: "/professionals/bharatkhanna.png" },
  { name: "Chandni Bhatia",                      title: "Vice President and Lead Quantitative Developer",                photo: "/professionals/chandnibhatia.png" },
  { name: "Preethi Bharathy",                    title: "Data Scientist",                                                photo: "/professionals/preethibharathy.png" },
  { name: "Srinath Gopinath",                    title: "Reliability Engineer",                                          photo: "/professionals/srinathgopinath.png" },
  { name: "Jay-Jay Qian",                        title: "Member of Technical Staff (Data Science)",                      photo: "/professionals/jayjayqian.png" },
  { name: "Sai Joshitha Kathari",                title: "Senior Site Reliability Engineer",                              photo: "/professionals/saijoshithakathari.png" },
  { name: "Dishant Shahani",                     title: "Technical Lead",                                                photo: "/professionals/dishantshahani.png" },
  { name: "Prabu Deivendran",                    title: "Senior Technical Lead at HCL America, Inc.",                   photo: "/professionals/prabudeivendran.png" },
];

const JudgesSection = () => {
  return (
    <section id="judges" className="bg-[#03091a] text-white py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#0ea5e9] text-4xl font-bold text-white sm:h-24 sm:w-24 sm:text-5xl">4</div>
            <h2 className="text-5xl font-light tracking-tight sm:text-7xl">Industry Professionals</h2>
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-8 text-lg sm:text-xl text-white/70 max-w-3xl">
          Meet the 21 industry professionals we're collaborating with.
        </motion.p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {judges.map((judge, index) => (
            <motion.div
              key={judge.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="bg-[#0b1628] border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-[#0ea5e9]/40 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 flex items-center justify-center overflow-hidden">
                {judge.photo ? (
                  <Image src={judge.photo} alt={judge.name} width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-[#38bdf8] font-bold text-sm">
                    {judge.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                )}
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
