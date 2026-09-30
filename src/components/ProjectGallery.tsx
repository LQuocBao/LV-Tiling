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
  const [selectedCategory, setSelectedCategory] = useState<string>("completed");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: "completed", label: "Completed Jobs photo" },
    { id: "flashbacks", label: "Flashbacks" },
    { id: "screeding", label: "Screeding and prep" },
    { id: "polyurethane", label: "Polyurethane and Primer" },
    { id: "bandages", label: "Shower Bandages" },
    { id: "waterproof", label: "Waterproof" },
    { id: "tennax", label: "tennax seal" },
  ];

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(6);
  };

  const filteredItems = gallery.filter((item) => item.category === selectedCategory);
  const displayedItems = filteredItems.slice(0, visibleCount);

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Representative Projects</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Our Workmanship <span className="text-[#b91c1c]">Portfolio</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every photo shown below is an authentic LV Tiling Pty Ltd installation completed across Morley, Dianella, Bayswater, and Greater Perth.
          </p>
        </div>

        {/* Category Filters */}
        <div className="w-full mb-12 overflow-hidden">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center items-center gap-2.5 px-4 pb-4 -mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`shrink-0 px-6 py-3 rounded-full text-[13px] font-bold tracking-wide transition-all duration-300 cursor-pointer border ${
                  selectedCategory === cat.id
                    ? "bg-[#dc2626] text-white border-[#dc2626] shadow-lg shadow-red-600/25 sm:scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid with Framer Motion Stagger */}
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayedItems.map((item, idx) => (
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

        {/* Load More Button */}
        {visibleCount < filteredItems.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <span>View More Photos ({filteredItems.length - visibleCount} remaining)</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

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
