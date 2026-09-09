"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

interface HeroProps {
  headline?: string;
  phone?: string;
  address?: string;
  warrantyYears?: number;
}
const FULL_LINE1 = "Expert Tiling With";

const TYPEWRITER_PHRASES = [
  "An Artistic Touch",
  "Master Craftsmanship",
  "Flawless Precision",
  "Luxury Perfection",
  "Zero-Lippage Standards",
];

type TypewriterStep = "typing-1" | "typing-2" | "paused" | "deleting-2" | "deleting-1";

export default function HeroSection({
  headline = "At LV Tiling Pty Ltd we treat every project as a work of art, delivering quality, precision even with a small renovation or large scale jobs. Our experts will ensure every detail is done right. Let’s transform your space together.",
  phone = "0452 612 336",
  address = "130A Crimea street Morley 6062 WA",
  warrantyYears = 4,
}: HeroProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [step, setStep] = useState<TypewriterStep>("typing-1");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

    switch (step) {
      case "typing-1":
        if (line1Text.length < FULL_LINE1.length) {
          timer = setTimeout(() => {
            setLine1Text(FULL_LINE1.slice(0, line1Text.length + 1));
          }, 55);
        } else {
          timer = setTimeout(() => {
            setStep("typing-2");
          }, 120);
        }
        break;

      case "typing-2":
        if (line2Text.length < currentPhrase.length) {
          timer = setTimeout(() => {
            setLine2Text(currentPhrase.slice(0, line2Text.length + 1));
          }, 70);
        } else {
          timer = setTimeout(() => {
            setStep("paused");
          }, 2400); // Pause to read full title
        }
        break;

      case "paused":
        setStep("deleting-2");
        break;

      case "deleting-2":
        if (line2Text.length > 0) {
          timer = setTimeout(() => {
            setLine2Text(currentPhrase.slice(0, line2Text.length - 1));
          }, 30);
        } else {
          timer = setTimeout(() => {
            setStep("deleting-1");
          }, 80);
        }
        break;

      case "deleting-1":
        if (line1Text.length > 0) {
          timer = setTimeout(() => {
            setLine1Text(FULL_LINE1.slice(0, line1Text.length - 1));
          }, 22);
        } else {
          timer = setTimeout(() => {
            setPhraseIndex((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
            setStep("typing-1");
          }, 300);
        }
        break;
    }

    return () => clearTimeout(timer);
  }, [line1Text, line2Text, step, phraseIndex]);

  return (
    <section className="relative min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-900 border-b border-slate-200">
      
      {/* 1. Full-bleed Background Image of Luxury Bathroom Project with Ken Burns Breathing Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/media/3dc6ea8d-6e0b-4b8b-a3a6-a3c01bd0cf61.jpg"
          alt="LV Tiling Luxury Bathroom & Floor Tiling in Perth"
          fill
          priority
          className="object-cover object-center filter brightness-90 contrast-105 animate-ken-burns"
        />
        {/* Architectural Vignette Scrim (Ensures text is 100% crisp while keeping bathroom visible) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/65 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: 4-Year Gold Warranty Badge with 3D Tilt & Gold Foil Sweep */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            
            <div className="w-full flex justify-center lg:justify-start">
              {/* 3D Gold Ribbon Shield Badge with periodic gold foil sweep */}
              <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-amber-500/20 to-black/40 backdrop-blur-md border-2 border-amber-400/60 shadow-2xl space-y-4 max-w-xs animate-gold-sweep cursor-pointer hover:scale-102 transition-transform duration-300">
                
                <div className="w-20 h-20 mx-auto rounded-2xl gold-shield-gradient flex flex-col items-center justify-center text-center shadow-xl border-2 border-yellow-200">
                  <span className="text-2xl font-black leading-none text-amber-950 tracking-tight">
                    {warrantyYears}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-900">
                    YEARS
                  </span>
                </div>

                <div className="space-y-2 text-center">
                  <div className="red-ribbon-gradient text-white text-xs font-black uppercase tracking-wider py-1 px-3 rounded shadow-md">
                    Comprehensive Workmanship Warranty
                  </div>
                  <p className="text-xs text-amber-100 font-semibold drop-shadow">
                    100% Guaranteed Compliance with AS 3958.1 & AS 3740 Standards
                  </p>
                </div>

                <div className="pt-2 border-t border-amber-400/30 flex items-center justify-center gap-2 text-[11px] text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span>Licensed WA Trade Specialist</span>
                </div>
              </div>
            </div>

            {/* Direct location tag */}
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-900/70 px-3.5 py-1.5 rounded-full border border-slate-700">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{address}</span>
            </div>

          </div>

          {/* Right: Layout matching a1groutingandtiling.com Slider */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            
            {/* Pre-title in Accent Color (Like "A TRENDY LUXURY" in a1groutingandtiling) */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest text-[#5886b9] drop-shadow">
              <span>A TRENDY LUXURY · PERTH MASTER TILERS</span>
            </div>

            {/* Main Big Heading with Dual Typewriter animated highlight */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight drop-shadow-md min-h-[2.4em] sm:min-h-[2.3em]">
              <span className="inline-flex items-center">
                <span>{line1Text || (step === "typing-1" ? "\u00A0" : "")}</span>
                {(step === "typing-1" || step === "deleting-1") && (
                  <span className="inline-block w-[3px] sm:w-1 h-[0.85em] bg-white ml-1.5 animate-pulse rounded-full" />
                )}
              </span>
              <br className="hidden sm:inline" />
              <span className="text-[#5886b9] drop-shadow inline-flex items-center min-h-[1.15em]">
                <span>{line2Text || (step === "typing-2" ? "\u00A0" : "")}</span>
                {(step === "typing-2" || step === "paused" || step === "deleting-2") && (
                  <span className="inline-block w-[3px] sm:w-1 h-[0.85em] bg-[#5886b9] ml-1.5 animate-pulse rounded-full" />
                )}
              </span>
            </h1>

            {/* Subheading text: The client's exact words */}
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow">
              {headline}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm font-semibold text-white">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Laser Zero-Lippage Precision
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                AS 3740 Leak-Proof Waterproofing
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Direct Trade Rates (No Middlemen)
              </span>
            </div>

            {/* CTA Buttons & Phone Call Strip — Synchronized Design System */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              
              {/* 1. "Our Services!" Button (Luxury Glass Secondary) */}
              <a
                href="#services"
                className="px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 hover:border-white/50 backdrop-blur-md font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg text-center block w-full sm:w-auto hover:-translate-y-0.5 active:translate-y-0"
              >
                Our Services!
              </a>

              {/* 2. Free Quote Button with Shimmer Sweep (Primary Brand) */}
              <a
                href="#contact"
                className="animate-shimmer-sweep px-7 py-4 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 text-center block w-full sm:w-auto"
              >
                <span>Book Free Measure & Quote</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* 3. Phone Quick Call (Dark Slate Secondary) */}
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="px-6 py-4 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-red-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 text-center block w-full sm:w-auto"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>Call: {phone}</span>
              </a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
