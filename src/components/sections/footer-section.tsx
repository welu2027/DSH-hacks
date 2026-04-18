"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaDiscord, FaLinkedin } from "react-icons/fa";
import Image from "next/image";

const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-b from-zinc-900 to-black text-white py-8">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="flex flex-col items-center lg:items-start">
            <div className="mb-3 flex items-center gap-3">
              <Image src="/dsh-hacks-logo.png" alt="DSH Hacks" width={36} height={36} className="object-contain" />
              <span className="text-2xl font-bold tracking-tight">
                DSH <span className="text-[#0ea5e9]">Hacks</span>
              </span>
            </div>
            <p className="text-white/50 text-sm mb-1">DeltaForge Hacks × NXTHorizon × STEMise</p>
            <p className="text-white/70 text-sm mb-4">
              <a href="https://dsh-hacks-v1.devpost.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors underline underline-offset-2">
                dsh-hacks-v1.devpost.com
              </a>
            </p>
            <div className="flex gap-4 text-white/80">
              <a href="https://www.linkedin.com/posts/stemise_stemise-highschool-hackathon-activity-7444950300852973572-mtY-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF8a_J8BBFD-8QjBjyPkx4PzxZKaZ80DEi8" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaLinkedin size={22} /></a>
              <a href="https://www.instagram.com/dshhacksv1/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaInstagram size={22} /></a>
              <a href="https://discord.gg/3HgSzbYPx5" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><FaDiscord size={22} /></a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h3 className="text-base font-semibold mb-3 text-white/90">Hackathon</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="https://dsh-hacks-v1.devpost.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">Register on Devpost</a></li>
                <li><a href="https://dsh-hacks-v1.devpost.com/rules" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">Rules</a></li>
                <li><a href="#judges" className="hover:text-[#38bdf8] transition-colors">Industry Professionals</a></li>
                <li><a href="#sponsors" className="hover:text-[#38bdf8] transition-colors">Sponsors</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-3 text-white/90">Community</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="https://discord.gg/3HgSzbYPx5" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">DSH Hacks Discord</a></li>
                <li><a href="https://dsh-hacks-v1.devpost.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">Project Gallery</a></li>
                <li><a href="#faq" className="hover:text-[#38bdf8] transition-colors">FAQ</a></li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          © 2026 DSH Hacks. Hosted by DeltaForge Hacks, NXTHorizon & STEMise.
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
