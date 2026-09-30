"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
  FileCheck,
} from "lucide-react";

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
    <section id="why-us" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Why Choose LV Tiling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Built on <span className="text-[#b91c1c]">Precision, Integrity &amp; Accountability</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We don’t rush jobs or cut corners on subfloor preparation. Our master tradesmen take pride in delivering architectural-grade results that endure.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="h-full p-6 rounded-[6px] bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-[4px] bg-red-50 text-[#dc2626] border border-red-100 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-slate-200 text-slate-700">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-[#dc2626]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
