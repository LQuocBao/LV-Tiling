"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Grid,
  Droplets,
  Sparkles,
  Sun,
  Layers,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Shield,
  Award,
} from "lucide-react";
import { ServiceItem } from "@/data/initialData";
import SpotlightCard from "@/components/SpotlightCard";

const iconMap: Record<string, React.ElementType> = {
  Grid,
  Droplets,
  Sparkles,
  Sun,
  Layers,
  Wrench,
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

interface ServicesGridProps {
  services: ServiceItem[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Trade Services" },
    { id: "bathroom", label: "Bathrooms & Showers" },
    { id: "floor", label: "Floor Tiling" },
    { id: "waterproofing", label: "Waterproofing" },
    { id: "screeding", label: "Screeding & Prep" },
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter(
          (s) =>
            s.id.includes(activeTab) ||
            s.title.toLowerCase().includes(activeTab) ||
            (activeTab === "bathroom" && (s.id.includes("bathroom") || s.id.includes("ensuite"))) ||
            (activeTab === "screeding" && (s.id.includes("screeding") || s.id.includes("edge") || s.id.includes("detailing")))
        );

  return (
    <section id="services" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200/80 text-xs font-bold text-red-800 uppercase tracking-wider shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Master Trade Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Comprehensive Tiling &amp; <span className="text-[#dc2626]">Wet Area Solutions</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every project is executed to exacting Australian standards using premium C2S2 adhesives, laser leveling clips, and mould-resistant epoxy sealing.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Services Grid Cards with Framer Motion Stagger & Spotlight Border */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Grid;

            return (
              <motion.div key={service.id} variants={cardVariants}>
                <SpotlightCard
                  spotlightColor="rgba(37, 99, 235, 0.16)"
                  className="group h-full rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Service Image with Badge */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                        sizes="(max-w: 768px) 100vw, (max-w: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                      
                      {service.badge && (
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#dc2626] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                          {service.badge}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm text-slate-900 flex items-center justify-center font-bold shadow">
                            <IconComponent className="w-4 h-4 text-[#dc2626]" />
                          </div>
                          <span className="text-xs font-semibold drop-shadow">Australian Standard</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#2563eb] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {service.shortDesc}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {service.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="px-6 pb-6 pt-2">
                    <a
                      href="#contact"
                      className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-[#dc2626] text-slate-800 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 border border-slate-200 hover:border-[#dc2626] shadow-sm hover:shadow-lg hover:shadow-red-600/25"
                    >
                      <span>Get Quote for this Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
