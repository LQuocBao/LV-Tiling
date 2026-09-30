"use client";

import React from "react";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";

interface HeroProps {
  headline?: string;
  phone?: string;
  address?: string;
  warrantyYears?: number;
}

export default function HeroSection({
  phone = "0452 612 336",
}: HeroProps) {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[76vh] flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-800">
      {/* 1. Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/media/completed/completed_21.jpg"
          alt="LV Tiling Master Bathroom Finish in Perth"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        {/* Solid flat dark scrim for text legibility */}
        <div className="absolute inset-0 bg-slate-950/50" />
      </div>

      {/* 2. Main Content Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-20 text-center">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold tracking-wider uppercase mb-6">
          <span className="w-2 h-2 rounded-[2px] bg-[#dc2626]" />
          <span>Perth Master Tilers · Excellence In Craft</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight sm:whitespace-nowrap">
          Every Project As A{" "}
          <span className="text-[#dc2626]">
            Work Of Art.
          </span>
        </h1>

        {/* Narrative Paragraph */}
        <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-3xl mx-auto mt-6">
          At <strong className="text-white font-semibold">LV Tiling Pty Ltd</strong>{" "}
          we treat every project as a work of art, delivering quality, precision
          even with a small renovation or large scale jobs. Our experts will
          ensure every detail is done right.{" "}
          <span className="text-white font-medium">
            Let’s transform your space together.
          </span>
        </p>

        {/* 3 Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-8 w-full max-w-3xl mx-auto">
          {/* Button 1: Our Services */}
          <a
            href="#services"
            className="whitespace-nowrap shrink-0 w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center text-center"
          >
            Our Services
          </a>

          {/* Button 2: Book Free Measure & Quote */}
          <a
            href="#contact"
            className="whitespace-nowrap shrink-0 w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 text-center"
          >
            <span>Book Free Measure &amp; Quote</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>

          {/* Button 3: Quick Phone Call */}
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="whitespace-nowrap shrink-0 w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-colors flex items-center justify-center gap-2 text-center"
            aria-label={`Call ${phone}`}
          >
            <Phone className="w-4 h-4 text-[#dc2626] shrink-0" />
            <span>Call: {phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
