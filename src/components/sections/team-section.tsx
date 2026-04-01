"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const RegisterNow = () => {
  return (
    <section id="register" className="bg-[#03091a] text-white py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-transparent pointer-events-none" />
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0b1628] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Fake browser bar */}
          <div className="flex items-center justify-start px-4 py-3 bg-[#0d1a30] border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-[#162540] text-sm text-white/70 px-4 py-1.5 rounded-md font-mono">
                https://dsh-hacks-v1.devpost.com
              </div>
            </div>
          </div>

          <div className="p-10 sm:p-16 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className="overflow-hidden flex justify-center items-center">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full text-4xl sm:text-5xl font-bold bg-[#0ea5e9] text-white">5</div>
                <h2 className="text-5xl font-light tracking-tight sm:text-7xl text-white">REGISTER</h2>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-10 max-w-4xl mx-auto">
              <p className="mb-6 text-xl leading-relaxed sm:text-2xl text-white/90">
                <span className="text-white font-bold">DSH Hacks V1</span> is an online event open to students aged 13+. Whether you want to compete for prizes or just explore workshops and connect with the community, everyone is welcome!
              </p>
              <ul className="text-left sm:text-center text-lg sm:text-xl text-white/90 leading-relaxed space-y-3 mt-10">
                <li>• Register and submit your project on{" "}
                  <a href="https://dsh-hacks-v1.devpost.com/" className="underline-offset-4 hover:underline font-semibold text-[#38bdf8]" target="_blank" rel="noopener noreferrer">
                    Devpost
                  </a>
                </li>
                <li>• Join the{" "}
                  <a href="#" className="underline-offset-4 hover:underline font-semibold text-[#38bdf8]" target="_blank" rel="noopener noreferrer">
                    DeltaForge Hacks Discord
                  </a>
                </li>
                <li>• Join the{" "}
                  <a href="#" className="underline-offset-4 hover:underline font-semibold text-[#38bdf8]" target="_blank" rel="noopener noreferrer">
                    STEMise Discord
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.a
              href="https://dsh-hacks-v1.devpost.com/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-[#0284c7] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-[#38bdf8] transition mt-12"
            >
              Register Now! <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterNow;
