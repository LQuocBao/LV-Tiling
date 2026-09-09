"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, ShieldCheck, Compass, Award, ArrowRight, Sparkles, Phone } from "lucide-react";

interface WelcomeSectionProps {
  headline?: string;
  phone?: string;
}

export default function WelcomeSection({
  headline = "At LV Tiling Pty Ltd we treat every project as a work of art, delivering quality, precision even with a small renovation or large scale jobs. Our experts will ensure every detail is done right. Let’s transform your space together.",
  phone = "0452 612 336",
}: WelcomeSectionProps) {
  const [activeTab, setActiveTab] = useState<"designing" | "approved" | "guaranteed">("designing");

  const tabsContent = {
    designing: {
      title: "Designing & Aesthetic Precision",
      image: "/media/b2c368ec-a5fa-4bc3-80d3-dd10d8880563.jpg",
      desc: "We bring creativity and laser precision to every project, offering tailored tiling layouts that enhance beauty, symmetry, and functionality for any space.",
      points: [
        "Custom tile patterns to match your architectural vision",
        "Laser-guided layout planning for perfect symmetry & falls",
        "Seamless 45-degree hand-mitred external corners & niches",
      ],
    },
    approved: {
      title: "Approved & Certified Standards",
      image: "/media/6e383397-b70c-4113-841d-944e65dc8341.jpg",
      desc: "Trusted for professionalism and strict compliance with the National Construction Code (NCC) and Australian Standards AS 3958.1 & AS 3740.",
      points: [
        "Certified AS 3740 dual-membrane wet area waterproofing",
        "Fully licensed WA trade specialists · ABN 84 629 140 821",
        "$10,000,000 Public Liability Insurance for complete protection",
      ],
    },
    guaranteed: {
      title: "4-Year Workmanship Guarantee",
      image: "/media/fc906945-b180-444b-b818-7f0a709dc091.jpg",
      desc: "We stand firmly by our work with an uncompromising commitment to quality, durability, and customer satisfaction—ensuring every project endures.",
      points: [
        "4-Year Comprehensive Written Workmanship Warranty Certificate",
        "Zero-lippage laser alignment guarantee on all floor tiling",
        "100% leak-proof shower and bathroom renovation guarantee",
      ],
    },
  };

  const currentTab = tabsContent[activeTab];

  return (
    <section id="about-us" className="py-20 bg-[#f7f8f9] border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Featured Tiling Craftsmanship Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <div className="relative h-[440px] sm:h-[500px] w-full">
                <Image
                  src="/media/9935903f-3f4e-4182-8197-19e2a50fa065.jpg"
                  alt="LV Tiling Master Craftsmanship"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w: 1024px) 100vw, 500px"
                />
              </div>

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-[#dc2626] flex items-center justify-center flex-shrink-0 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Morley Workshop & Trade
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Direct trade pricing · No builder subcontractors
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Client Statement, and 3 Interactive Tabs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section Subtitle & Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#5886b9]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>What We Do</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black text-slate-900 tracking-tight leading-tight">
                We Craft The Art Of Elegant Spaces Through <span className="text-[#dc2626]">Tiling And Regrouting</span>
              </h2>
            </div>

            {/* The Client Statement (The exact NOTE from the client sketch) */}
            <div className="p-5 rounded-2xl bg-white border-l-4 border-[#dc2626] shadow-sm">
              <p className="text-base sm:text-lg font-semibold text-slate-800 italic leading-relaxed">
                &ldquo;{headline}&rdquo;
              </p>
            </div>

            {/* General Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We craft the art of elegant spaces through expert tiling and regrouting services that combine style, precision, and durability. Whether you are updating a bathroom, kitchen, or commercial floor, our skilled team ensures every tile is placed with care and every grout line is flawless. Using high-grade C2S2 adhesives and advanced laser leveling, we bring your vision to life with lasting beauty.
            </p>

            {/* 3 Interactive Tabs (Designing, Approved, Guaranteed) */}
            <div className="pt-2">
              <div className="flex border-b border-slate-200">
                {(["designing", "approved", "guaranteed"] as const).map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                      activeTab === tabKey
                        ? "border-[#dc2626] text-[#dc2626] bg-red-50/50"
                        : "border-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tabKey === "designing" && "Designing"}
                    {tabKey === "approved" && "Approved"}
                    {tabKey === "guaranteed" && "Guaranteed"}
                  </button>
                ))}
              </div>

              {/* Active Tab Body */}
              <div className="p-6 bg-white rounded-b-2xl border-x border-b border-slate-200 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-4 relative h-32 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={currentTab.image}
                      alt={currentTab.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="sm:col-span-8 space-y-3">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {currentTab.desc}
                    </p>
                    <ul className="space-y-2">
                      {currentTab.points.map((pt, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                          <span className="w-4 h-4 rounded-full bg-red-100 text-[#dc2626] flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions — Synchronized Design System Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#contact"
                className="animate-shimmer-sweep px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>Book Free Site Measure</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-red-500 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>Call: {phone}</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
