"use client";

import React from "react";
import { Award, ShieldCheck } from "lucide-react";

interface AnnouncementBarProps {
  announcement?: string;
  phone?: string;
}

export default function AnnouncementBar({
  phone = "0452 612 336",
}: AnnouncementBarProps) {
  // Matching the clean, thin marquee style of Ảnh 1
  const warrantyItems = [
    {
      badge: "4 YEARS",
      text: "4 years of water leakage warranty for Regrouting showers.",
    },
    {
      badge: "4 YEARS",
      text: "4 years of workmanship warranty for Tiling.",
    },
    {
      badge: "4 YEARS",
      text: "4 years of water leakage warranty for Regrouting showers.",
    },
    {
      badge: "4 YEARS",
      text: "4 years of workmanship warranty for Tiling.",
    },
  ];

  return (
    <div className="relative bg-[#070b12] border-b border-white/10 text-[12px] text-slate-300 py-1.5 overflow-hidden z-50">
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
        {[...warrantyItems, ...warrantyItems, ...warrantyItems].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2.5">
            {/* Blue-shield styled mini badge like in Ảnh 1 */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#5886b9]/25 border border-[#5886b9]/50 text-[#7ba4d6] text-[10px] font-bold tracking-tight">
              <Award className="w-3 h-3 text-[#5886b9]" />
              <span>{item.badge}</span>
            </span>
            <span className="text-slate-200 font-normal tracking-wide">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
