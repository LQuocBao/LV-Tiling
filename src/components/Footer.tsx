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
      <div className="border-b border-slate-800 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to elevate your home with master Australian tiling?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Get an accurate laser measure and itemized proposal direct from our Morley trade workshop.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="px-4 py-2.5 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#dc2626]" />
              <span>{phone}</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <span>Request Free Measure</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Credentials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-[6px] bg-white p-1 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="LV Tiling Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="text-white font-bold text-base tracking-tight block">
                  {companyName}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {abn} · Licensed WA Contractor
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Specialist wall and floor tiling workshop based in Morley, WA. Delivering architectural-grade finishes, screeding, and certified AS 3740 waterproofing across the Perth metropolitan region.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-semibold">
                <Award className="w-3 h-3 text-[#dc2626]" />
                <span>4-Year Warranty</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-800 border border-slate-700 text-[11px] text-slate-300 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>AS 3740 Certified</span>
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Trade Services
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Precision Floor Tiling</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Bathroom &amp; Ensuite Renovations</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Kitchen Feature Splashbacks</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Outdoor Patio &amp; Pool Surrounds</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Subfloor Screeding to Fall</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Epoxy Regrouting &amp; Silicone</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors py-0.5 inline-block">Tennax Seal &amp; Protective Coating</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Suburbs Serviced */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Service Areas
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Morley 6062 (Home Base)</li>
              <li>Dianella &amp; Noranda</li>
              <li>Bayswater &amp; Bedford</li>
              <li>Mount Lawley &amp; Inglewood</li>
              <li>Stirling &amp; Balcatta</li>
              <li>Greater Perth Metropolitan</li>
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white font-semibold text-slate-100 py-1">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#dc2626] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white break-all py-1">
                  {email}
                </a>
              </div>
              <div className="pt-1">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-semibold min-h-[36px]"
                >
                  <FacebookIcon className="w-4 h-4 text-[#1877f2]" />
                  <span>Facebook Page</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {companyName}. All rights reserved. {abn}.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Australian Standards AS 3958.1 &amp; AS 3740 Compliant</span>
            <button
              onClick={scrollToTop}
              className="w-11 h-11 rounded-[6px] bg-slate-800 hover:bg-[#dc2626] text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}
