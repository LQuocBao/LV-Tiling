"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  MessageSquare,
  Mail,
  X,
  ArrowUp,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

interface FloatingContactWidgetProps {
  phone?: string;
  email?: string;
  facebookUrl?: string;
}

export default function FloatingContactWidget({
  phone = "0452 612 336",
  email = "lvotiling@gmail.com",
  facebookUrl = "https://www.facebook.com/share/lvtiling",
}: FloatingContactWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cleanPhone = phone.replace(/\s+/g, "");

  return (
    <aside aria-label="Quick contact and navigation" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none">
      
      {/* 1. Scroll To Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={scrollToTop}
            className="w-12 h-12 rounded-2xl bg-slate-900/95 hover:bg-[#dc2626] text-white border border-slate-700 hover:border-red-500 shadow-xl shadow-slate-950/30 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group hover:shadow-red-600/35 hover:-translate-y-1 cursor-pointer"
            aria-label="Scroll smoothly to top"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200 text-slate-300 group-hover:text-white" />
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors leading-tight">
              TOP
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. Interactive Contact Us Popover Card with Flying Down Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -45, scale: 0.9 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 280,
              mass: 0.8,
            }}
            className="w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white mb-2 relative z-50 origin-top"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white p-4">
              <h4 className="font-bold text-base tracking-tight leading-snug">
                How would you like to contact us?
              </h4>
            </div>

            {/* Contact Options List */}
            <div className="p-3 space-y-2">
              
              {/* 1. Hotline */}
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-red-50/60 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc2626] group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-[#dc2626] transition-colors leading-tight">
                    Hotline
                  </span>
                  <span className="text-xs text-slate-500">
                    {phone} (7:00 - 17:30)
                  </span>
                </div>
              </a>

              {/* 2. Messenger */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-red-50/60 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 text-[#1877f2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1877f2] group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-[#1877f2] transition-colors leading-tight">
                    Messenger
                  </span>
                  <span className="text-xs text-slate-500">
                    Facebook Chat (24/7)
                  </span>
                </div>
              </a>

              {/* 3. Email us */}
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-amber-50/60 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                    Email us
                  </span>
                  <span className="text-xs text-slate-500 truncate max-w-[170px]">
                    {email}
                  </span>
                </div>
              </a>

            </div>

            {/* Little triangle arrow pointing down to button */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Contact Us Button with Pulsing Wave & Green Dot */}
      <div className="relative">
        
        {/* Pulsating Aura Rings */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping pointer-events-none" />
            <span className="absolute -inset-1.5 rounded-full bg-red-400/30 animate-pulse pointer-events-none" />
          </>
        )}

        {/* The Main Round Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-[#dc2626] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white shadow-xl shadow-red-600/30 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isOpen ? "bg-[#991b1b]" : ""
          }`}
          aria-label={isOpen ? "Close contact options" : "Contact us"}
        >
          {/* Active Online Green Dot */}
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white" />
          </span>

          {isOpen ? (
            <X className="w-6 h-6 animate-in spin-in-90 duration-200" />
          ) : (
            <div className="flex flex-col items-center justify-center leading-none space-y-1">
              <MessageSquare className="w-5 h-5 fill-white" />
              <span className="text-[9px] font-black tracking-tight uppercase">
                Contact
              </span>
            </div>
          )}
        </button>
      </div>

    </aside>
  );
}
