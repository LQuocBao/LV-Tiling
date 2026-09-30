"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

interface QuoteSectionProps {
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
}

export default function QuoteSection({
  phone = "0452 612 336",
  email = "lvotiling@gmail.com",
  address = "130A Crimea street Morley 6062 WA",
  facebookUrl = "https://www.facebook.com/share/lvtiling",
}: QuoteSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    suburb: "",
    serviceType: "Completed Jobs photo",
    approxArea: "20-40 m²",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    // Australian Phone Validation Check
    const cleanDigits = formData.phone.replace(/\D/g, "");
    if (cleanDigits.length < 8 || cleanDigits.length > 12) {
      setStatus("error");
      setResponseMsg("Please enter a valid phone number (e.g. 0412 345 678).");
      return;
    }

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResponseMsg(data.message || "Your quote request has been received! Our Morley trade team will contact you shortly.");
        setFormData({
          name: "",
          phone: "",
          email: "",
          suburb: "",
          serviceType: "Completed Jobs photo",
          approxArea: "20-40 m²",
          message: "",
        });
      } else {
        setStatus("error");
        setResponseMsg(data.message || "Failed to submit quote request.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setResponseMsg("Network error. Please call our direct line at 0452 612 336.");
    }
  };

  return (
    <section id="contact" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-red-50 border border-red-200 text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#b91c1c]" />
            <span>Fast 24-Hour Quoting Turnaround</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Book Your Free On-Site <br className="hidden sm:inline" />
            <span className="text-[#b91c1c]">Laser Measure &amp; Written Quote</span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Fill out the form below or phone us directly. We will schedule a visit, assess your substrate, and provide an accurate, fixed itemized proposal.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-[6px] bg-slate-50 border border-slate-200 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
                Direct Trade Contact
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-3 text-slate-700 hover:text-[#dc2626] transition-colors p-1.5 rounded-[4px]"
                  aria-label={`Call direct phone ${phone}`}
                >
                  <div className="w-9 h-9 rounded-[4px] bg-red-50 text-[#dc2626] border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider block">
                      Direct Trade Line
                    </span>
                    <span className="text-base font-bold text-slate-900 block">
                      {phone}
                    </span>
                    <span className="text-xs text-emerald-800 font-medium block">
                      ● Active Mon–Sat 7:00 AM – 5:30 PM
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 text-slate-700 hover:text-[#dc2626] transition-colors p-1.5 rounded-[4px]"
                  aria-label={`Send email to ${email}`}
                >
                  <div className="w-9 h-9 rounded-[4px] bg-red-50 text-[#dc2626] border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider block">
                      Plans &amp; Scope Email
                    </span>
                    <span className="text-sm font-semibold text-slate-900 block break-all">
                      {email}
                    </span>
                    <span className="text-xs text-slate-600 block">
                      Send architectural PDF drawings for fast take-off
                    </span>
                  </div>
                </a>

                {/* Workshop Address */}
                <div className="flex items-start gap-3 p-1.5">
                  <div className="w-9 h-9 rounded-[4px] bg-red-50 text-[#dc2626] border border-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 font-semibold uppercase tracking-wider block">
                      Workshop &amp; Base
                    </span>
                    <span className="text-sm font-semibold text-slate-900 block">
                      {address}
                    </span>
                    <span className="text-xs text-slate-600 block">
                      Serving Morley, Dianella, Bayswater &amp; Greater Perth
                    </span>
                  </div>
                </div>

                {/* Facebook Social */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 min-h-[44px] rounded-[6px] bg-white border border-slate-200 hover:border-[#1877f2] text-slate-800 font-medium text-xs transition-colors"
                  aria-label="Follow LV Tiling on Facebook"
                >
                  <span className="flex items-center gap-2">
                    <FacebookIcon className="w-4 h-4 text-[#1877f2]" />
                    <span>Follow Our Work on Facebook</span>
                  </span>
                  <span className="text-[#1877f2] font-semibold">View Projects →</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Widget */}
            <div className="rounded-[6px] overflow-hidden border border-slate-200 h-48 relative bg-slate-100">
              <iframe
                title="LV Tiling Morley WA Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13548.82650125866!2d115.8942289!3d-31.8986289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32b036573ce785%3A0x504f0b535df4ab0!2sMorley%20WA%206062%2C%20Australia!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

          {/* Right Column: Quote Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-[6px] bg-white border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Request an Itemized Written Proposal
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    No obligation · Free on-site laser inspection · Written warranty included
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>4-Yr Warranty</span>
                </div>
              </div>

              {/* Form Status Messages */}
              {status === "success" && (
                <div className="p-3.5 rounded-[6px] bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-start gap-2.5" role="alert">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-700" />
                  <div>
                    <span className="font-semibold block">Quote Request Received!</span>
                    <span className="text-xs text-emerald-800 mt-0.5 block">{responseMsg}</span>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-3.5 rounded-[6px] bg-red-50 border border-red-300 text-red-900 text-sm flex items-start gap-2.5" role="alert">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-700" />
                  <div>
                    <span className="font-semibold block">Submission Notice</span>
                    <span className="text-xs text-red-800 mt-0.5 block">{responseMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="quote-name" className="text-xs font-semibold text-slate-800 block">
                      Your Full Name <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="quote-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Morrison"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label htmlFor="quote-phone" className="text-xs font-semibold text-slate-800 block">
                      Mobile Number <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="quote-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0412 345 678"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="quote-email" className="text-xs font-semibold text-slate-800 block">
                      Email Address
                    </label>
                    <input
                      id="quote-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. david@gmail.com"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>

                  {/* Suburb */}
                  <div className="space-y-1">
                    <label htmlFor="quote-suburb" className="text-xs font-semibold text-slate-800 block">
                      Job Location / Suburb <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      id="quote-suburb"
                      name="suburb"
                      type="text"
                      required
                      value={formData.suburb}
                      onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                      placeholder="e.g. Morley, WA 6062"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Service Type with explicit associated Label */}
                  <div className="space-y-1">
                    <label htmlFor="quote-service-type" className="text-xs font-semibold text-slate-800 block">
                      Primary Service Required
                    </label>
                    <select
                      id="quote-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors cursor-pointer"
                    >
                      <option value="Completed Jobs photo">Completed Jobs photo</option>
                      <option value="Flashbacks">Flashbacks</option>
                      <option value="Screeding and prep">Screeding and prep</option>
                      <option value="Polyurethane and Primer">Polyurethane and Primer</option>
                      <option value="Shower Bandages">Shower Bandages</option>
                      <option value="Waterproof">Waterproof</option>
                      <option value="Tennax Seal">Tennax Seal</option>
                    </select>
                  </div>

                  {/* Approx Area with explicit associated Label */}
                  <div className="space-y-1">
                    <label htmlFor="quote-approx-area" className="text-xs font-semibold text-slate-800 block">
                      Estimated Floor/Wall Area
                    </label>
                    <select
                      id="quote-approx-area"
                      name="approxArea"
                      value={formData.approxArea}
                      onChange={(e) => setFormData({ ...formData, approxArea: e.target.value })}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors cursor-pointer"
                    >
                      <option value="Under 15 m² (Small Ensuite)">Under 15 m² (Small Ensuite)</option>
                      <option value="15-35 m² (Standard Bathroom)">15–35 m² (Standard Bathroom)</option>
                      <option value="35-70 m² (Living Areas / Multiple Bathrooms)">35–70 m² (Living / 2 Bathrooms)</option>
                      <option value="70-150 m² (Complete Home Floor)">70–150 m² (Full Home Floor)</option>
                      <option value="150+ m² (Commercial / Large Estate)">150+ m² (Commercial / Large Estate)</option>
                    </select>
                  </div>
                </div>

                {/* Message with explicit associated Label */}
                <div className="space-y-1">
                  <label htmlFor="quote-message" className="text-xs font-semibold text-slate-800 block">
                    Project Details, Tile Choice, or Substrate Condition (Optional)
                  </label>
                  <textarea
                    id="quote-message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. 600x1200 porcelain tiles, need screeding to fall for walk-in shower, ready to start next month..."
                    className="w-full px-3.5 py-2.5 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full min-h-[48px] py-3 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Free Measure &amp; Quote</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Direct Trade Confidentiality
                  </span>
                  <span>We reply within 24 business hours</span>
                </div>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
