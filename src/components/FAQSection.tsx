"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Phone, ArrowRight } from "lucide-react";

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
    <section id="faq" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Perth Tiling &amp; Renovation <span className="text-[#2563eb]">Trade FAQ</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Essential information regarding pricing, Australian standards, waterproofing certificates, and our 4-year workmanship warranty.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white ${
                  isOpen ? "border-red-300 shadow-md ring-1 ring-red-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#dc2626] transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg tracking-tight">{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-red-50 text-[#dc2626]" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-slate-900">Have a specific project question?</h4>
            <p className="text-xs text-slate-500">Call our direct trade hotline for immediate advice on substrates & materials.</p>
          </div>
          <a
            href="tel:0452612336"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 hover:border-red-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5 text-[#dc2626]" />
            <span>Call 0452 612 336</span>
          </a>
        </div>

      </div>
    </section>
  );
}
