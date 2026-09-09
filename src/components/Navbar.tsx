"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  companyName?: string;
}

export default function Navbar({
  phone = "0452 612 336",
  companyName = "LV Tiling Pty Ltd",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`transition-all duration-300 w-full ${
        isScrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200 py-3 text-slate-800 animate-in slide-in-from-top duration-200"
          : "absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-slate-950/85 via-slate-950/40 to-transparent py-4 sm:py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Official LV Tiling Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-white p-1 shadow-md border border-slate-200/80 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="LV Tiling Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span
                className={`text-base sm:text-lg font-black tracking-tight uppercase leading-none transition-colors ${
                  isScrolled ? "text-slate-900" : "text-white drop-shadow-sm"
                }`}
              >
                LV Tiling
              </span>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase leading-tight mt-1 transition-colors ${
                  isScrolled ? "text-[#dc2626]" : "text-red-400 drop-shadow-sm"
                }`}
              >
                Perth Master Tilers
              </span>
            </div>
          </a>

          {/* 2. Clean, Minimalist Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-7">
            
            {/* Home */}
            <a
              href="#"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#dc2626]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              Home
            </a>

            {/* About Us */}
            <a
              href="#about-us"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#dc2626]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              About Us
            </a>

            {/* Services (Direct link, no submenu) */}
            <a
              href="#services"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#dc2626]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              Services
            </a>

            {/* Gallery */}
            <a
              href="#portfolio"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#5886b9]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              Gallery
            </a>

            {/* Reviews */}
            <a
              href="#reviews"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#5886b9]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              Reviews
            </a>

            {/* Contact Us */}
            <a
              href="#contact"
              className={`text-sm font-semibold transition-colors ${
                isScrolled ? "text-slate-800 hover:text-[#5886b9]" : "text-white hover:text-slate-200 drop-shadow-sm"
              }`}
            >
              Contact Us
            </a>

            {/* Free Quote Primary CTA Button */}
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Free Quote
            </a>

          </nav>

          {/* 3. Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-white hover:bg-white/20"
              }`}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-800 border-t border-slate-200 shadow-xl px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold hover:bg-slate-50 hover:text-[#5886b9] rounded-lg"
          >
            Home
          </a>
          <a
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold hover:bg-slate-50 hover:text-[#5886b9] rounded-lg"
          >
            About Us
          </a>
          
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold hover:bg-slate-50 hover:text-[#dc2626] rounded-lg"
          >
            Services
          </a>

          <a
            href="#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold hover:bg-slate-50 hover:text-[#dc2626] rounded-lg"
          >
            Gallery
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-semibold hover:bg-slate-50 hover:text-[#dc2626] rounded-lg"
          >
            Reviews
          </a>
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 px-4 text-center text-xs font-black text-white bg-gradient-to-r from-[#dc2626] to-[#b91c1c] rounded-xl shadow-md shadow-red-600/25 uppercase tracking-wider"
            >
              Book Free Measure & Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
