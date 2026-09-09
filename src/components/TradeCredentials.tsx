"use client";

import React from "react";
import { Hammer, ShieldCheck, BadgeCheck, FileText, Check, X, ArrowUpRight, Award, Shield, Star, CheckCircle2, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import SpotlightCard from "@/components/SpotlightCard";

export default function TradeCredentials() {
  const stats = [
    {
      value: 4,
      suffix: "+",
      label: "Years Warranty",
      sub: "Comprehensive written certificate",
      icon: Award,
    },
    {
      value: 1200,
      suffix: "+",
      label: "Projects Completed",
      sub: "Across Greater Perth & WA",
      icon: CheckCircle2,
    },
    {
      value: 100,
      suffix: "%",
      label: "AS 3740 Compliance",
      sub: "Zero waterproofing failures",
      icon: ShieldCheck,
    },
    {
      value: 5.0,
      decimals: 1,
      suffix: "★",
      label: "Google Rating",
      sub: "Direct verified homeowner reviews",
      icon: Star,
    },
  ];

  return (
    <section id="trade-standards" className="py-20 bg-white border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <Hammer className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Australian Trade Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why Hiring a <span className="text-[#dc2626]">Licensed Tiling Specialist</span> Protects Your Home
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            In Western Australia, wet area waterproofing and large-format tiling are high-risk trades. Cutting corners leads to hidden wall leaks and cracked tiles. Working directly with our Morley workshop eliminates builder markups and guarantees trade excellence.
          </p>
        </div>

        {/* Milestone Animated Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <SpotlightCard
                key={idx}
                spotlightColor="rgba(220, 38, 38, 0.08)"
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all text-center group"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  <AnimatedCounter
                    end={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stat.sub}
                </p>
              </SpotlightCard>
            );
          })}
        </div>

        {/* 2-Column Comparison: Specialist Workshop vs General Builder Subcontractor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-4">
          
          {/* Card 1: LV Tiling Pty Ltd (Direct Specialist Workshop) */}
          <SpotlightCard
            spotlightColor="rgba(220, 38, 38, 0.14)"
            className="rounded-3xl p-8 bg-gradient-to-b from-white to-red-50/40 border-2 border-red-500 shadow-xl relative flex flex-col justify-between"
          >
            <div className="absolute -top-4 right-6 sm:right-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 z-30 flex items-center gap-1.5 border border-white/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Recommended Choice</span>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center border border-red-200">
                  <BadgeCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">LV Tiling Pty Ltd</h3>
                  <p className="text-xs text-red-700 font-bold uppercase tracking-wider">Direct Trade Contractor · Morley WA</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Direct engagement with our licensed master tradesmen. We manage everything in-house: laser floor screeding, AS 3740 membrane waterproofing, diamond cutting, and zero-lippage tiling.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Direct trade pricing — zero middleman or builder markups",
                  "4-Year Comprehensive Written Workmanship Warranty",
                  "Strict compliance with Australian Standards AS 3958.1 & AS 3740",
                  "In-house workshop cutting (wet diamond bridge saws for 45° mitred edges)",
                  "Single point of contact from free laser measure to final silicone handover",
                  "Fully licensed, White Card safety certified & $10M public liability insurance",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-800 font-medium">
                    <span className="p-1 rounded-full bg-green-100 text-green-700 flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-red-100 flex items-center justify-between z-20">
              <span className="text-xs font-bold text-slate-500">Fixed Itemized Quotes</span>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Get Trade Pricing</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </SpotlightCard>

          {/* Card 2: General Builder / Subcontractor Broker */}
          <div className="rounded-3xl p-8 bg-slate-50 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-700">General Builder or Broker</h3>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Subcontracted Third Parties</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 leading-relaxed">
                Many building companies subcontract tiling to lowest-bid transient workers, adding 20% to 35% margin on top while disclaiming direct warranty responsibility.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "20% – 35% builder markup added on top of trade costs",
                  "Vague warranty passing blame between builder and third-party tiler",
                  "Risk of uncertified subfloor screeding leading to hollow/cracked tiles",
                  "Hand-held angle grinder cuts resulting in chipped tile edges and rough grout",
                  "Multiple subcontractors coming and going with poor site cleanliness",
                  "Limited recourse when waterproofing leaks emerge years later",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-500">
                    <span className="p-1 rounded-full bg-red-100 text-red-600 flex-shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">High Markup Risk</span>
              <span className="text-xs font-semibold text-slate-500">Avoid Costly Re-work</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
