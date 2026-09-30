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
      className={`transition-all duration-200 w-full ${
        isScrolled
          ? "fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 py-3 text-slate-900 shadow-sm"
          : "absolute top-0 left-0 right-0 z-30 bg-slate-950/30 border-b border-white/10 py-4 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* 1. Brand Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-[6px] bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
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
                className={`text-base sm:text-lg font-bold tracking-tight uppercase leading-none ${
                  isScrolled ? "text-slate-900" : "text-white"
                }`}
              >
                LV Tiling
              </span>
              <span
                className={`text-[11px] font-semibold tracking-wider uppercase leading-tight mt-1 ${
                  isScrolled ? "text-[#dc2626]" : "text-red-400"
                }`}
              >
                Perth Master Tilers
              </span>
            </div>
          </a>

          {/* 2. Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              Home
            </a>
            <a
              href="#about-us"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              About Us
            </a>
            <a
              href="#services"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              Services
            </a>
            <a
              href="#trade-standards"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              Standards
            </a>
            <a
              href="#why-us"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              Why Us
            </a>
            <a
              href="#faq"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              FAQ
            </a>
            <a
              href="#contact"
              className={`text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700 hover:text-[#dc2626]" : "text-slate-200 hover:text-white"
              }`}
            >
              Contact Us
            </a>

            {/* Free Quote CTA Button */}
            <a
              href="#contact"
              className="px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Free Quote
            </a>
          </nav>

          {/* 3. Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-[6px] border flex items-center justify-center transition-colors cursor-pointer ${
                isScrolled
                  ? "text-slate-800 border-slate-200 hover:bg-slate-100"
                  : "text-white border-slate-700 hover:bg-slate-800"
              }`}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-slate-900 border-t border-slate-200 px-4 py-4 space-y-1">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            Home
          </a>
          <a
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            About Us
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            Services
          </a>
          <a
            href="#trade-standards"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            Standards
          </a>
          <a
            href="#why-us"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            Why Us
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center min-h-[44px] px-3 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-[#dc2626] rounded-[6px]"
          >
            Contact Us
          </a>
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center min-h-[48px] w-full px-4 text-center text-xs font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-[6px] uppercase tracking-wider transition-colors"
            >
              Book Free Measure &amp; Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
