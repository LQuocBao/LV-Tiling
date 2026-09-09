"use client";

import React from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  ArrowUp,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

interface FooterProps {
  companyName?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  abn?: string;
}

export default function Footer({
  companyName = "LV Tiling Pty Ltd",
  phone = "0452 612 336",
  email = "lvotiling@gmail.com",
  address = "130A Crimea street Morley 6062 WA",
  facebookUrl = "https://www.facebook.com/share/lvtiling",
  abn = "ABN 84 629 140 821",
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm">
      
      {/* Upper CTA Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to elevate your home with master Australian tiling?
            </h3>
            <p className="text-sm text-slate-400">
              Get an accurate laser measure and itemized proposal direct from our Morley trade workshop.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#dc2626]" />
              <span>{phone}</span>
            </a>
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-red-600 hover:to-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/40 hover:shadow-xl hover:shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>Request Free Measure</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-xl bg-white p-1 shadow-md border border-slate-700/60 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="LV Tiling Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="text-white font-black text-lg tracking-tight block">
                  {companyName}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {abn} · Licensed WA Contractor
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Specialist wall and floor tiling workshop based in Morley, WA. Delivering architectural-grade finishes, screeding, and certified AS 3740 waterproofing across the Perth metropolitan region.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>4-Year Warranty</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                <span>AS 3740 Certified</span>
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Trade Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors">Precision Floor Tiling</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Bathroom & Ensuite Renovations</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Kitchen Feature Splashbacks</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Outdoor Patio & Pool Surrounds</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Subfloor Screeding to Fall</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Epoxy Regrouting & Silicone</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Suburbs Serviced */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Service Areas
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Morley 6062 (Home Base)</li>
              <li>Dianella & Noranda</li>
              <li>Bayswater & Bedford</li>
              <li>Mount Lawley & Inglewood</li>
              <li>Stirling & Balcatta</li>
              <li>Greater Perth Metropolitan</li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#dc2626] flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white font-bold text-slate-200">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#dc2626] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white break-all">
                  {email}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-bold"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-[#1877f2]" />
                  <span>Facebook Profile</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {companyName}. All rights reserved. {abn}.
          </p>
          <div className="flex items-center gap-6">
            <span>Australian Standards AS 3958.1 & AS 3740 Compliant</span>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-[#dc2626] text-slate-300 hover:text-white border border-slate-700 hover:border-red-500 shadow-md flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 group"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
