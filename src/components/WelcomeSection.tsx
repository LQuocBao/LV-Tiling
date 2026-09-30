"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, ArrowRight, Sparkles, Phone } from "lucide-react";

interface WelcomeSectionProps {
  headline?: string;
  phone?: string;
}

export default function WelcomeSection({
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
    <section id="about-us" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          
          {/* Section Subtitle & Title */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b91c1c]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>About Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              Quality &amp; Precision Tiling — <span className="text-[#b91c1c]">Built to Last</span>
            </h2>
          </div>

          {/* Detailed Narrative Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            <p>
              At LV Tiling Pty Ltd, we believe quality tiling is more than simply putting tiles on a wall or floor. It starts with understanding the space, planning the right layout, preparing the surface properly and paying attention to every detail.
            </p>
            <p>
              We have experience working with all types of tiles and a wide range of projects, from small-format tiles and detailed patterns to large-format tiles. We also come across different areas of construction, including wall building, gyprock, plumbing assistance, electrical assistance and general handyman work. This broader construction experience gives us a better understanding of how different parts of a building come together, allowing us to visualize the finished space, identify potential issues and find practical solutions before they become bigger problems.
            </p>
            <p>
              Whether you need a new bathroom tile, existing tiles repaired, a better tile layout or a solution for a challenging space, we look at the project as a whole and work out the right approach. Our goal is not only to create a clean and high-end finish, but to make sure the space is practical, functional and built to last.
            </p>
          </div>

          {/* 3 Interactive Tabs */}
          <div>
            <div className="flex border-b border-slate-200 gap-2">
              {(["designing", "approved", "guaranteed"] as const).map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-4 py-2.5 min-h-[44px] text-xs sm:text-sm font-semibold rounded-t-[6px] border-b-2 transition-colors cursor-pointer ${
                    activeTab === tabKey
                      ? "border-[#dc2626] text-[#dc2626] bg-white"
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
            <div className="p-6 bg-white rounded-b-[6px] border-x border-b border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-4 relative h-32 w-full rounded-[6px] overflow-hidden bg-slate-100 border border-slate-200">
                  <Image
                    src={currentTab.image}
                    alt={currentTab.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="sm:col-span-8 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {currentTab.desc}
                  </p>
                  <ul className="space-y-1.5">
                    {currentTab.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-800">
                        <Check className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#contact"
              className="px-5 py-2.5 min-h-[44px] rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <span>Book Free Site Measure</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="px-5 py-2.5 min-h-[44px] rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>Call: {phone}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
