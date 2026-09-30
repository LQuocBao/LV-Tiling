"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How much does wall and floor tiling cost per square metre in Perth?",
      a: "Standard floor tiling in Perth generally ranges from $70 to $95 per m² for standard ceramic/porcelain formats. Large-format tiles (1200x600mm or larger), herringbone patterns, and wet-area shower screeding range from $90 to $120 per m² due to laser clip leveling, substrate preparation, and precision diamond mitring. We provide free on-site laser measures and itemized written quotes with zero hidden markups.",
    },
    {
      q: "What does the LV Tiling 4-Year Comprehensive Workmanship Warranty cover?",
      a: "Our 4-year warranty guarantees our trade craftsmanship against tile lifting, hollow drummy tiles, joint lippage, and grout cracking. Furthermore, all wet-area waterproofing membranes come backed by our certified compliance with Australian Standard AS 3740, providing peace of mind against concealed leaks.",
    },
    {
      q: "Do you issue Waterproofing Compliance Certificates for WA council approval?",
      a: "Yes. In Western Australia, waterproof membranes in bathrooms, ensuites, and laundries must adhere strictly to the National Construction Code (NCC) and AS 3740. Upon completion of screeding and membrane curing, we supply formal compliance documentation for your certifier or private inspector.",
    },
    {
      q: "How long does a typical master bathroom tiling renovation take?",
      a: "An average bathroom or ensuite renovation takes between 4 to 7 working days. This timeline includes substrate repair, screeding the floor to proper waste falls, applying 2 coats of AS 3740 membrane with appropriate cure time, laser tile laying, and final anti-fungal epoxy grouting and sanitary silicone sealing.",
    },
    {
      q: "Do you service my suburb in Perth?",
      a: "Our workshop and mobile quoting vehicles are based at 130A Crimea Street, Morley 6062 WA. We service Morley, Noranda, Dianella, Bayswater, Mount Lawley, Inglewood, Bedford, Stirling, and the entire Greater Perth metropolitan area.",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Perth Tiling &amp; Renovation <span className="text-[#b91c1c]">Trade FAQ</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Essential information regarding pricing, Australian standards, waterproofing certificates, and our 4-year workmanship warranty.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-[6px] border transition-colors overflow-hidden bg-white ${
                  isOpen ? "border-slate-400" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#dc2626] transition-colors cursor-pointer min-h-[48px]"
                >
                  <span className="text-base tracking-tight">{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-red-50 text-[#dc2626]" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-10 p-5 rounded-[6px] bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Have a specific project question?</h3>
            <p className="text-xs text-slate-600 mt-0.5">Call our direct trade hotline for immediate advice on substrates &amp; materials.</p>
          </div>
          <a
            href="tel:0452612336"
            className="px-5 py-2.5 min-h-[44px] rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            aria-label="Call 0452 612 336"
          >
            <Phone className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Call 0452 612 336</span>
          </a>
        </div>

      </div>
    </section>
  );
}
