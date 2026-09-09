"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Sparkles, MoveHorizontal, CheckCircle2, Award } from "lucide-react";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="comparison" className="py-20 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Visible Workmanship Quality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Before &amp; After <span className="text-[#2563eb]">Transformation</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Drag the interactive slider below to witness how our precision laser screeding and master tile laying transforms uneven substrates into flawless luxury finishes.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[360px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100 select-none cursor-ew-resize"
          >
            {/* "After" Image: Completed Flawless Installation */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/media/3dc6ea8d-6e0b-4b8b-a3a6-a3c01bd0cf61.jpg"
                alt="LV Tiling Finished Luxury Bathroom in Morley WA"
                fill
                className="object-cover"
                sizes="(max-w: 1200px) 100vw, 896px"
                priority
              />
              <div className="absolute top-5 right-5 px-3.5 py-1.5 rounded-full bg-green-600 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AFTER: Completed Flawless Tile</span>
              </div>
            </div>

            {/* "Before" Image: Uneven / Unfinished Substrate Clipped with Slider */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative w-full h-full min-w-[320px] sm:min-w-[700px] md:min-w-[896px]">
                <Image
                  src="/media/34bdf219-c1c5-410a-a1a1-a140f08a4f87.jpg"
                  alt="Raw screed and substrate preparation"
                  fill
                  className="object-cover filter grayscale contrast-125"
                  sizes="(max-w: 1200px) 100vw, 896px"
                />
                <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white font-black text-xs uppercase tracking-wider shadow-lg">
                  BEFORE: Raw Subfloor & Prep
                </div>
              </div>
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Radar pulse wave invite rings (emits when idle) */}
              {!isDragging && (
                <>
                  <div className="radar-ring w-14 h-14 pointer-events-none" />
                  <div className="radar-ring radar-ring-delayed w-14 h-14 pointer-events-none" />
                </>
              )}

              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#dc2626] text-white flex items-center justify-center shadow-2xl border-2 border-white pointer-events-auto cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform duration-200">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Subtext info under comparison */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-xs text-slate-600 font-medium px-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#dc2626]" />
              <span>Laser-calibrated fall to floor wastes prevents water ponding</span>
            </div>
            <div className="text-slate-500 font-semibold">
              ← Drag slider left & right to compare →
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
