"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Ruler, Sparkles, Droplets, Grid, CheckCircle2, ArrowRight } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function WorkProcess() {
  const steps = [
    {
      num: "01",
      title: "Laser Measure & Quote",
      desc: "We visit your property, laser-measure exact square meterage, inspect substrate integrity, and provide a comprehensive itemized written quote.",
      icon: Ruler,
    },
    {
      num: "02",
      title: "Subfloor Screeding",
      desc: "We mechanically grind high spots, patch depressions, and pour laser-leveled polymer screeds to create an immaculate, dead-flat substrate.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "AS 3740 Waterproofing",
      desc: "For wet areas and showers, dual polyurethane membranes are applied with perimeter bond breakers, fully compliant with Australian Standards.",
      icon: Droplets,
    },
    {
      num: "04",
      title: "Precision Laser Tiling",
      desc: "Tiles are installed using high-polymer C2S2 adhesives and mechanical leveling clips, ensuring flawless symmetry and zero edge lippage.",
      icon: Grid,
    },
    {
      num: "05",
      title: "Epoxy Grout & Handover",
      desc: "We apply anti-mould epoxy grout and sanitary silicone seals, followed by a 100-point inspection and your 4-Year Warranty Certificate.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="process" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-red-800 uppercase tracking-wider shadow-sm">
            <span>Seamless Project Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Our 5-Step <span className="text-[#dc2626]">Precision Trade Workflow</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From your first phone call to final handover, every stage is managed with structured Australian trade discipline.
          </p>
        </div>

        {/* Steps Grid with Timeline Beam and Staggered Entrance */}
        <div className="relative">
          {/* Animated Glowing Connecting Line */}
          <div className="hidden md:block absolute top-14 left-8 right-8 h-1 bg-gradient-to-r from-red-500/20 via-blue-500/30 to-green-500/30 z-0 rounded-full" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6 relative z-10"
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div key={idx} variants={stepVariants}>
                  <SpotlightCard
                    spotlightColor="rgba(220, 38, 38, 0.12)"
                    className="h-full p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between space-y-4 relative group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-slate-200 group-hover:text-red-200 transition-colors">
                          {step.num}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center font-bold group-hover:scale-110 group-hover:bg-[#dc2626] group-hover:text-white transition-all shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#dc2626] transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span>Quality Check Gate</span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
