"use client";

import React from "react";
import { Star, MessageSquareQuote, CheckCircle2, Shield, MapPin } from "lucide-react";
import { TestimonialItem } from "@/data/initialData";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="reviews" className="py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <MessageSquareQuote className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Local Perth Client Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by <span className="text-[#2563eb]">Homeowners &amp; Builders</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Read genuine reviews from clients across Morley, Dianella, Bayswater, and throughout Perth who chose LV Tiling Pty Ltd for their renovation projects.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative group"
            >
              <div className="space-y-4">
                {/* Rating & Service Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-bold">
                    {review.service}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-base text-slate-800 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">{review.name}</h4>
                  <p className="text-xs text-red-600 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {review.suburb}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
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
