"use client";

import React from "react";
import { Hammer, ShieldCheck, BadgeCheck, FileText, Check, X, ArrowUpRight, Award, Star, CheckCircle2, Sparkles } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";

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
    <section id="trade-standards" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <Hammer className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Australian Trade Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Why Hiring a <span className="text-[#b91c1c]">Licensed Tiling Specialist</span> Protects Your Home
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            In Western Australia, wet area waterproofing and large-format tiling are high-risk trades. Cutting corners leads to hidden wall leaks and cracked tiles. Working directly with our Morley workshop eliminates builder markups and guarantees trade excellence.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-[6px] bg-slate-50 border border-slate-200 text-center"
              >
                <div className="w-8 h-8 mx-auto mb-2 rounded-[4px] bg-red-50 text-[#dc2626] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  <AnimatedCounter
                    end={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2-Column Comparison: Specialist Workshop vs General Builder Subcontractor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Card 1: LV Tiling Pty Ltd */}
          <div className="rounded-[6px] p-6 sm:p-8 bg-white border-2 border-[#dc2626] relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-[6px] bg-[#dc2626] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-white" />
              <span>Recommended Choice</span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-red-50 text-[#dc2626] flex items-center justify-center border border-red-200">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">LV Tiling Pty Ltd</h3>
                  <p className="text-xs text-[#dc2626] font-semibold uppercase tracking-wider">Direct Trade Contractor · Morley WA</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Direct engagement with our licensed master tradesmen. We manage everything in-house: laser floor screeding, AS 3740 membrane waterproofing, diamond cutting, and zero-lippage tiling.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Direct trade pricing — zero middleman or builder markups",
                  "4-Year Comprehensive Written Workmanship Warranty",
                  "Strict compliance with Australian Standards AS 3958.1 & AS 3740",
                  "In-house workshop cutting (wet diamond bridge saws for 45° mitred edges)",
                  "Single point of contact from free laser measure to final silicone handover",
                  "Fully licensed, White Card safety certified & $10M public liability insurance",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Fixed Itemized Quotes</span>
              <a
                href="#contact"
                className="px-4 py-2.5 min-h-[44px] rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
              >
                <span>Get Trade Pricing</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: General Builder / Subcontractor Broker */}
          <div className="rounded-[6px] p-6 sm:p-8 bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-slate-200 text-slate-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">General Builder or Broker</h3>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider">Subcontracted Third Parties</p>
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                Many building companies subcontract tiling to lowest-bid transient workers, adding 20% to 35% margin on top while disclaiming direct warranty responsibility.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "20% – 35% builder markup added on top of trade costs",
                  "Vague warranty passing blame between builder and third-party tiler",
                  "Risk of uncertified subfloor screeding leading to hollow/cracked tiles",
                  "Hand-held angle grinder cuts resulting in chipped tile edges and rough grout",
                  "Multiple subcontractors coming and going with poor site cleanliness",
                  "Limited recourse when waterproofing leaks emerge years later",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">High Markup Risk</span>
              <span className="text-xs font-semibold text-slate-600">Avoid Costly Re-work</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
