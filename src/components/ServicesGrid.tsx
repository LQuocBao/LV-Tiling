"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Award,
  Sun,
  Hammer,
  ArrowRight,
  ZoomIn,
  X,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { ServiceItem, GalleryItem } from "@/data/initialData";

const categoryMeta: Record<
  string,
  {
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
    features: string[];
  }
> = {
  completed: {
    badge: "Master Finish",
    icon: Award,
    desc: "Luxury full-scale tiling and bathroom renovations completed across Greater Perth with precision alignment and AS 3740 compliance.",
    features: [
      "Mitred 45-degree seamless edges & niche trims",
      "Laser clip leveling system for zero lippage",
      "Custom herringbone, subway & slab installations",
      "Mould-resistant epoxy and flexible silicone sealing",
    ],
  },
  flashbacks: {
    badge: "In-Progress Milestone",
    icon: Sparkles,
    desc: "A photographic look back at past job sites showcasing our uncompromising quality from subfloor preparation to final handover.",
    features: [
      "Subfloor leveling and moisture tolerance checks",
      "Progressive photographic quality verification",
      "Structural acoustic and expansion perimeter gaps",
      "Client walk-through inspections before grouting",
    ],
  },
  screeding: {
    badge: "Substrate Prep",
    icon: Hammer,
    desc: "Engineered sand & cement screed bedding laid to AS 3958.1 with precision directional falls for effortless water drainage.",
    features: [
      "Laser-measured 1:60 directional falls to waste",
      "High-adhesion polymer slurry bond coats",
      "Flat substrates for zero tile lippage or hollow spots",
      "Structural crack-bridging control joints",
    ],
  },
  polyurethane: {
    badge: "Bonding & Jointing",
    icon: Layers,
    desc: "Eco Prim Grip mechanical adhesion priming combined with industrial Bostik polyurethane joint sealing at all critical stress points.",
    features: [
      "Eco Prim Grip high-adhesion silica primer",
      "Heavy-duty polyurethane expansion joints",
      "Wall-to-floor internal perimeter stress relief",
      "Watertight plumbing & drain collar seals",
    ],
  },
  bandages: {
    badge: "Reinforced Sealing",
    icon: ShieldCheck,
    desc: "Heavy-duty elastomeric waterproof bandages bridging critical internal wall-floor junctions, hob transitions, and shower recesses.",
    features: [
      "Class III high-elasticity internal corner bandages",
      "Complete shower hob & perimeter encapsulation",
      "Seamless wall-floor movement accommodation",
      "Pre-formed niche and plumbing flange integration",
    ],
  },
  waterproof: {
    badge: "AS 3740 Certified",
    icon: CheckCircle2,
    desc: "Certified multi-layer Laticrete Hydro Ban waterproof membrane applications protecting wet areas with a 20-year lifetime guarantee.",
    features: [
      "AS 3740 certified dual-layer wet area membrane",
      "Flood-tested before any tile installation",
      "NCC compliant waterproofing certificates for council",
      "20-year lifetime manufacturer-backed membrane life",
    ],
  },
  tennax: {
    badge: "Stone Protection",
    icon: Sun,
    desc: "Premium Tenax surface treatments and protective penetrating sealers for marble, travertine, granite, and natural stone installations.",
    features: [
      "Tenax deep-penetrating stone sealer",
      "Long-term moisture, oil & stain resistance",
      "Enhances natural stone colour & veining depth",
      "Preserves tile breathability & durable luster",
    ],
  },
};

function getItemDescription(item: GalleryItem, category: string): string {
  if (item.description) return item.description;

  const title = (item.title || "").toLowerCase();

  if (category === "completed") {
    if (title.includes("bathtub") || title.includes("bath")) {
      return "Mitred marble surround for built-in bath.";
    }
    if (title.includes("vanity") || title.includes("basin")) {
      return "Countertop basin vanity with feature wall tiling.";
    }
    if (title.includes("seat") || title.includes("shower")) {
      return "Walk-in shower tiling with waterfall edge seat.";
    }
    if (title.includes("floor") || title.includes("marble")) {
      return "Large-format floor tile with precision alignment.";
    }
    return "Finished master bathroom tiling to Australian standards.";
  }

  if (category === "flashbacks") {
    return "Subfloor leveling and quality control milestone.";
  }

  if (category === "screeding") {
    return "Sand & cement screed laid with 1:60 falls.";
  }

  if (category === "polyurethane") {
    return "Polyurethane flexible joint and primer application.";
  }

  if (category === "bandages") {
    return "Elastomeric reinforcing bandages on critical joints.";
  }

  if (category === "waterproof") {
    return "AS 3740 dual-layer waterproofing membrane.";
  }

  if (category === "tennax") {
    return "Tenax deep-penetrating stone sealer application.";
  }

  return "Precision tiling executed to Australian standards.";
}

// Sub-component for individual card image with Skeleton Loading
function ServiceCardImage({
  src,
  alt,
  badge,
  location,
  CategoryIcon,
  onClick,
}: {
  src: string;
  alt: string;
  badge: string;
  location?: string;
  CategoryIcon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative h-60 w-full overflow-hidden bg-slate-100 cursor-pointer group"
      onClick={onClick}
    >
      {/* Skeleton Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-0 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
            Loading...
          </span>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-all duration-300 group-hover:scale-105 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Subtle bottom gradient for readability */}
      <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />

      {/* Zoom Indicator on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/40">
        <span className="px-3 py-1.5 rounded-[6px] bg-white text-slate-900 flex items-center gap-1.5 text-xs font-semibold">
          <ZoomIn className="w-3.5 h-3.5 text-[#dc2626]" />
          <span>View Full Size</span>
        </span>
      </div>

      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-[6px] bg-[#dc2626] text-white text-[10px] font-bold uppercase tracking-wider">
        {badge}
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[4px] bg-white text-slate-900 flex items-center justify-center font-bold">
            <CategoryIcon className="w-3.5 h-3.5 text-[#dc2626]" />
          </div>
          <span className="text-xs font-medium text-white drop-shadow-sm">
            {location || "Perth & WA"}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ServicesGridProps {
  services?: ServiceItem[];
  gallery?: GalleryItem[];
}

export default function ServicesGrid({
  gallery = [],
}: ServicesGridProps) {
  const [activeTab, setActiveTab] = useState<string>("completed");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    title: string;
  } | null>(null);

  // 7 Trade Categories
  const filterTabs = [
    { id: "completed", label: "Completed Jobs photo" },
    { id: "flashbacks", label: "Flashbacks" },
    { id: "screeding", label: "Screeding and prep" },
    { id: "polyurethane", label: "Polyurethane and Primer" },
    { id: "bandages", label: "Shower Bandages" },
    { id: "waterproof", label: "Waterproof" },
    { id: "tennax", label: "Tennax Seal" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setVisibleCount(6);
  };

  const activeItems = gallery.filter((item) => item.category === activeTab);
  const displayedItems = activeItems.slice(0, visibleCount);
  const meta = categoryMeta[activeTab] || categoryMeta.completed;
  const CategoryIcon = meta.icon;

  return (
    <section
      id="services"
      className="py-16 bg-slate-50 border-b border-slate-200 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Master Trade Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Comprehensive Tiling &amp;{" "}
            <span className="text-[#b91c1c]">Wet Area Solutions</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every project is executed to exacting Australian standards using
            premium materials including LATHydroban membrane, laser leveling
            clips, quality grout, silicone sealing and tiles restoration.
          </p>
        </div>

        {/* 7 Filter Tabs */}
        <div className="w-full mb-10 overflow-hidden">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center items-center gap-2 px-2 pb-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-[6px] text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer border ${
                  activeTab === tab.id
                    ? "bg-[#dc2626] text-white border-[#dc2626]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-400 rounded-[6px] overflow-hidden flex flex-col justify-between transition-colors"
            >
              <div>
                {/* Service Photo with Click-to-Preview & Skeleton Loading */}
                <ServiceCardImage
                  src={item.image}
                  alt={item.title}
                  badge={meta.badge}
                  location={item.location}
                  CategoryIcon={CategoryIcon}
                  onClick={() =>
                    setPreviewImage({
                      src: item.image,
                      title: item.title,
                    })
                  }
                />

                {/* Content Area */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  {/* Short & Concise Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-normal min-h-[2.5rem] flex items-center">
                    {getItemDescription(item, activeTab)}
                  </p>

                  {/* Trade Spec Details */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#dc2626] shrink-0" />
                      <span>{item.location || "Perth, WA"}</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {item.tileType || "Licensed WA Trade"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-1">
                <a
                  href="#contact"
                  className="w-full py-2.5 rounded-[6px] bg-slate-100 hover:bg-[#dc2626] text-slate-800 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors border border-slate-200 hover:border-[#dc2626]"
                >
                  <span>Get Quote for this Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {activeItems.length > visibleCount && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2.5 rounded-[6px] bg-slate-900 hover:bg-[#dc2626] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>
                Load More ({activeItems.length - visibleCount} remaining)
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[70vh] rounded-[6px] overflow-hidden bg-black">
              <Image
                src={previewImage.src}
                alt={previewImage.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-3 text-center">
              <h4 className="text-base font-semibold text-white tracking-wide">
                {previewImage.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic LV Tiling Pty Ltd Project Photograph
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
