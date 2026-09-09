"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
  FileCheck,
  Zap,
} from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function WhyChooseUs() {
  const advantages = [
    {
      title: "4-Year Written Guarantee",
      desc: "Every project comes with our formal 4-year comprehensive workmanship warranty certificate, protecting against hollow tiles, cracked grout, or movement.",
      icon: Award,
      tag: "Guaranteed",
    },
    {
      title: "Laser Zero-Lippage Precision",
      desc: "We calibrate every tile with mechanical leveling clips and digital cross-line lasers to ensure completely flat transitions conforming to AS 3958.1.",
      icon: Compass,
      tag: "AS 3958.1",
    },
    {
      title: "AS 3740 Certified Waterproofing",
      desc: "Wet areas and showers are sealed with dual-layer polyurethane or acrylic membranes, engineered falls to waste, and perimeter bond breakers.",
      icon: ShieldCheck,
      tag: "100% Leak-Proof",
    },
    {
      title: "Clean & Respectful Worksite",
      desc: "We run HEPA dust extractors during grinding, lay heavy-duty floor protection runners over carpets, and leave your home spotless every single day.",
      icon: Sparkles,
      tag: "Dust-Controlled",
    },
    {
      title: "Itemized & Transparent Pricing",
      desc: "No hidden extras or surprise contractor markups. You receive an itemized quote detailing prep, screeding, adhesives, and tile laying.",
      icon: FileCheck,
      tag: "Fixed Quotes",
    },
    {
      title: "Fast Local Perth Metro Response",
      desc: "Based at 130A Crimea Street, Morley, our mobile quoting vehicle can be on your site within 24–48 hours for a free measure & consultation.",
      icon: Clock,
      tag: "Morley & Metro",
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-red-800 uppercase tracking-wider shadow-sm">
            <Award className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Why Choose LV Tiling</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Built on <span className="text-[#dc2626]">Precision, Integrity &amp; Accountability</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            We don’t rush jobs or cut corners on subfloor preparation. Our master tradesmen take pride in delivering architectural-grade results that endure.
          </p>
        </div>

        {/* 6 Advantages Grid with Framer Motion Stagger & Spotlight Border */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} variants={cardVariants}>
                <SpotlightCard
                  spotlightColor="rgba(220, 38, 38, 0.12)"
                  className="h-full p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 hover:bg-white transition-all duration-300 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#dc2626] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-200/70 text-slate-700">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#dc2626] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#dc2626]">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Standard</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
