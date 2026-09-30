"use client";

import React from "react";
import { Star, MessageSquareQuote, CheckCircle2, MapPin } from "lucide-react";
import { TestimonialItem } from "@/data/initialData";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="reviews" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Local Perth Client Feedback</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by <span className="text-[#b91c1c]">Homeowners &amp; Builders</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Read genuine reviews from clients across Morley, Dianella, Bayswater, and throughout Perth who chose LV Tiling Pty Ltd for their renovation projects.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-[6px] bg-slate-50 border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Rating & Service Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-white border border-slate-200 text-slate-700 font-semibold">
                    {review.service}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm text-slate-800 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-[#dc2626] font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{review.suburb}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
