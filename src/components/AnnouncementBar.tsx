"use client";

import React from "react";
import { ShieldCheck, Award } from "lucide-react";

interface AnnouncementBarProps {
  announcement?: string;
  phone?: string;
}

export default function AnnouncementBar({
  phone = "0452 612 336",
}: AnnouncementBarProps) {
  const warrantyItems = [
    {
      badge: "4 YEARS",
      badgeColor: "bg-red-950 text-red-300 border border-red-800",
      icon: ShieldCheck,
      headline: "4 Years Warranty",
      detail: "for regrout and silicones",
      accent: "text-slate-400",
    },
    {
      badge: "20 YEARS",
      badgeColor: "bg-amber-950 text-amber-300 border border-amber-800",
      icon: Award,
      headline: "Guarantee 20 Years",
      detail: "life-time waterproofing",
      accent: "text-slate-300",
    },
    {
      badge: "4 YEARS",
      badgeColor: "bg-red-950 text-red-300 border border-red-800",
      icon: ShieldCheck,
      headline: "4 Years Warranty",
      detail: "for regrout and silicones",
      accent: "text-slate-400",
    },
    {
      badge: "20 YEARS",
      badgeColor: "bg-amber-950 text-amber-300 border border-amber-800",
      icon: Award,
      headline: "Guarantee 20 Years",
      detail: "life-time waterproofing",
      accent: "text-slate-300",
    },
  ];

  const renderItemSet = () => (
    <div className="flex shrink-0 items-center gap-10 md:gap-14">
      {warrantyItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="inline-flex items-center gap-3 select-none">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-[10px] font-bold tracking-wider uppercase ${item.badgeColor}`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.badge}</span>
            </span>
            <span className="text-[12px] tracking-wide inline-flex items-center gap-1.5 text-slate-200">
              <strong className="font-semibold text-white">
                {item.headline}
              </strong>
              <span className={item.accent}>— {item.detail}</span>
            </span>
            <span className="text-slate-600 text-xs ml-4 select-none">·</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 overflow-hidden z-50">
      <div className="flex animate-marquee whitespace-nowrap gap-10 md:gap-14 items-center">
        {renderItemSet()}
        {renderItemSet()}
      </div>
    </div>
  );
}
