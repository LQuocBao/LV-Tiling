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
  Award,
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
    serviceType: "Luxury Bathroom & Shower Tiling",
    approxArea: "20-40 m²",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMsg("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setResponseMsg(data.message || "Your quote request has been received!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          suburb: "",
          serviceType: "Luxury Bathroom & Shower Tiling",
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
    <section id="contact" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-800 uppercase tracking-wider shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>Fast 24-Hour Quoting Turnaround</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Book Your Free On-Site <br className="hidden sm:inline" />
            <span className="text-[#2563eb]">Laser Measure &amp; Written Quote</span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Fill out the form below or phone us directly. We will schedule a visit, assess your substrate, and provide an accurate, fixed itemized proposal.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Quote Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Contact & Workshop Location */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900">
                Direct Trade Contact
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-[#dc2626] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#dc2626] group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Direct Trade Line
                    </span>
                    <span className="text-lg font-black text-slate-900 group-hover:text-[#dc2626] transition-colors">
                      {phone}
                    </span>
                    <span className="text-[11px] text-green-700 font-semibold block mt-0.5">
                      ● Active Mon–Sat 7:00 AM – 5:30 PM
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-400 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-[#dc2626] flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-[#dc2626] group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Plans & Scope Email
                    </span>
                    <span className="text-sm font-black text-slate-900 group-hover:text-[#dc2626] transition-colors break-all">
                      {email}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Send architectural PDF drawings for fast take-off
                    </span>
                  </div>
                </a>

                {/* Workshop Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-[#dc2626] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">
                      Workshop & Base
                    </span>
                    <span className="text-sm font-black text-slate-900 block">
                      {address}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Serving Morley, Dianella, Bayswater & Greater Perth
                    </span>
                  </div>
                </div>

                {/* Facebook Social */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-[#1877f2]/10 border border-[#1877f2]/20 hover:bg-[#1877f2]/20 text-[#1877f2] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FacebookIcon className="w-4 h-4" />
                    <span>Follow Our Work on Facebook</span>
                  </span>
                  <span>View Projects →</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Maps Widget (Morley WA) */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm h-56 relative bg-slate-100">
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

          {/* Right Column: Interactive Quote Request Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border-2 border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Request an Itemized Written Proposal
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    No obligation · Free on-site laser inspection · Written warranty included
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>4-Yr Warranty</span>
                </div>
              </div>

              {/* Form Status Messages */}
              {status === "success" && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-300 text-green-800 text-sm flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                  <div>
                    <h4 className="font-bold">Quote Request Received!</h4>
                    <p className="text-xs text-green-700 mt-1">{responseMsg}</p>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <h4 className="font-bold">Submission Notice</h4>
                    <p className="text-xs text-red-700 mt-1">{responseMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. David Morrison"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 0412 345 678"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. david@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Suburb */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Job Location / Suburb <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.suburb}
                      onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                      placeholder="e.g. Morley, WA 6062"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Primary Service Required
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    >
                      <option value="Luxury Bathroom & Shower Tiling">Luxury Bathroom & Shower Tiling</option>
                      <option value="Precision Floor Tiling">Precision Living & Floor Tiling</option>
                      <option value="Kitchen & Feature Splashbacks">Kitchen Splashback</option>
                      <option value="Outdoor, Patio & Pool Surrounds">Outdoor Patio & Pool</option>
                      <option value="Floor Screeding & Subfloor Prep">Subfloor Screeding Only</option>
                      <option value="Regrouting & Silicone Sealing">Regrouting & Leak Repair</option>
                      <option value="Complete Whole-Home Renovation">Whole Home Renovation</option>
                    </select>
                  </div>

                  {/* Approx Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Estimated Floor/Wall Area
                    </label>
                    <select
                      value={formData.approxArea}
                      onChange={(e) => setFormData({ ...formData, approxArea: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors"
                    >
                      <option value="Under 15 m² (Small Ensuite)">Under 15 m² (Small Ensuite)</option>
                      <option value="15-35 m² (Standard Bathroom)">15–35 m² (Standard Bathroom)</option>
                      <option value="35-70 m² (Living Areas / Multiple Bathrooms)">35–70 m² (Living / 2 Bathrooms)</option>
                      <option value="70-150 m² (Complete Home Floor)">70–150 m² (Full Home Floor)</option>
                      <option value="150+ m² (Commercial / Large Estate)">150+ m² (Commercial / Large Estate)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Project Details, Tile Choice, or Substrate Condition (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="e.g. 600x1200 porcelain tiles, need screeding to fall for walk-in shower, ready to start next month..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {status === "loading" ? "Submitting Request..." : "Request Free Measure & Quote"}
                  </span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
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
