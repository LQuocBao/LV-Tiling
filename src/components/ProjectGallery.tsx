"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Camera, MapPin, Layers, X, ZoomIn, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GalleryItem } from "@/data/initialData";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

interface ProjectGalleryProps {
  gallery: GalleryItem[];
}

export default function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: "All Portfolio (15 Items)" },
    { id: "bathroom", label: "Bathrooms & Showers" },
    { id: "craftsmanship", label: "Precision Tiling & Details" },
    { id: "waterproofing", label: "AS 3740 Waterproofing" },
    { id: "screeding", label: "Screeding & Substrate Prep" },
    { id: "standards", label: "Warranty & Standards" },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === selectedCategory);

  const currentItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <Camera className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Representative Projects</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Our Workmanship <span className="text-[#2563eb]">Portfolio</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every photo shown below is an authentic LV Tiling Pty Ltd installation completed across Morley, Dianella, Bayswater, and Greater Perth.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#dc2626] text-white shadow-md shadow-red-600/25"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              onClick={() => setLightboxIndex(idx)}
              className="group relative h-80 rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-300 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-w: 640px) 100vw, (max-w: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-75 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Top badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">
                <MapPin className="w-3 h-3 text-[#dc2626]" />
                <span>{item.location}</span>
              </div>

              {/* Bottom Project Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <h3 className="text-base font-bold leading-tight group-hover:text-red-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-red-400" />
                    {item.tileType}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[#dc2626] group-hover:scale-110 transition-all">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {currentItem.title}
                </h4>
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-red-600" />
                  {currentItem.location} · {currentItem.tileType}
                </p>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative h-[55vh] sm:h-[65vh] w-full bg-slate-950">
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                className="object-contain"
                sizes="(max-w: 1200px) 100vw, 1200px"
              />

              {/* Prev / Next controls */}
              <button
                onClick={prevLightbox}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextLightbox}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg transition-all"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span className="font-semibold">
                Photo {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <a
                href="#contact"
                onClick={() => setLightboxIndex(null)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Request Quote for Similar Work
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
