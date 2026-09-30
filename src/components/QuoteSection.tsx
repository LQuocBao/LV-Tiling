"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Check,
  RotateCcw,
} from "lucide-react";
import FacebookIcon from "@/components/FacebookIcon";

interface QuoteSectionProps {
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
}

const DRAFT_STORAGE_KEY = "lvtiling_quote_draft_v1";

const INITIAL_FORM_DATA = {
  name: "",
  phone: "",
  email: "",
  suburb: "",
  serviceType: "Completed Jobs photo",
  approxArea: "20-40 m²",
  message: "",
};

export default function QuoteSection({
  phone = "0452 612 336",
  email = "lvotiling@gmail.com",
  address = "130A Crimea street Morley 6062 WA",
  facebookUrl = "https://www.facebook.com/share/lvtiling",
}: QuoteSectionProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMsg, setResponseMsg] = useState("");
  const isInitialMount = useRef(true);

  // 1. Restore draft from localStorage on initial load
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === "object") {
          // Check if draft has any actual content
          const hasContent = Object.values(parsed).some((val) => typeof val === "string" && val.trim().length > 0 && val !== INITIAL_FORM_DATA.serviceType && val !== INITIAL_FORM_DATA.approxArea);
          if (hasContent) {
            setFormData((prev) => ({ ...prev, ...parsed }));
            setHasRestoredDraft(true);
          }
        }
      }
    } catch (err) {
      console.warn("Could not retrieve quote form draft from localStorage", err);
    }
  }, []);

  // 2. Autosave draft to localStorage on form changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      const hasContent = Object.values(formData).some((val) => typeof val === "string" && val.trim().length > 0);
      if (hasContent) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      }
    } catch (err) {
      console.warn("Could not save quote form draft to localStorage", err);
    }
  }, [formData]);

  // 3. Validation Logic
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name": {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your full name.";
        if (trimmed.length < 2) return "Name must be at least 2 characters long.";
        if (!/[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/.test(trimmed)) return "Name must contain letters.";
        return "";
      }
      case "phone": {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your mobile or phone number.";
        // Clean digits
        const digitsOnly = trimmed.replace(/\D/g, "");
        if (digitsOnly.length < 8 || digitsOnly.length > 12) {
          return "Please enter a valid phone number (8 to 12 digits).";
        }
        // Australian format: 04xx xxx xxx, 08 xxxx xxxx, +61 4xx, etc.
        const isAuPhone = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){7,9}$/.test(trimmed) || digitsOnly.startsWith("04") || digitsOnly.startsWith("614") || digitsOnly.startsWith("08") || digitsOnly.startsWith("618");
        if (!isAuPhone) {
          return "Please enter a valid Australian phone number (e.g. 0452 612 336).";
        }
        return "";
      }
      case "email": {
        const trimmed = value.trim();
        if (!trimmed) return ""; // Email is optional, but if provided must be valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(trimmed)) {
          return "Please enter a valid email address (e.g. name@example.com).";
        }
        return "";
      }
      case "suburb": {
        const trimmed = value.trim();
        if (!trimmed) return "Please enter your job location or suburb in Perth.";
        if (trimmed.length < 2) return "Suburb must be at least 2 characters.";
        return "";
      }
      case "serviceType": {
        if (!value) return "Please select the service required.";
        return "";
      }
      default:
        return "";
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
      suburb: validateField("suburb", formData.suburb),
      serviceType: validateField("serviceType", formData.serviceType),
    };

    // Filter out empty strings
    const activeErrors: Record<string, string> = {};
    let isValid = true;
    for (const [key, err] of Object.entries(newErrors)) {
      if (err) {
        activeErrors[key] = err;
        isValid = false;
      }
    }

    setErrors(activeErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      suburb: true,
      serviceType: true,
      approxArea: true,
      message: true,
    });

    return isValid;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setTouched({});
    setHasRestoredDraft(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setResponseMsg("");

    const isValid = validateAll();
    if (!isValid) {
      setStatus("error");
      setResponseMsg("Please resolve the highlighted validation errors before submitting.");
      return;
    }

    setStatus("loading");

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
        // Clear saved draft from localStorage
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch (e) {
          console.warn(e);
        }
        setFormData(INITIAL_FORM_DATA);
        setTouched({});
        setErrors({});
        setHasRestoredDraft(false);
      } else {
        setStatus("error");
        setResponseMsg(data.message || "Failed to submit quote request. Please try again or phone us directly.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setResponseMsg("Network connection issue. Please phone our direct trade line at 0452 612 336.");
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

              {/* Draft Restored Notice */}
              {hasRestoredDraft && (
                <div className="p-3 rounded-[6px] bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Restored your unsaved quote draft</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="underline text-amber-900 hover:text-amber-950 font-semibold cursor-pointer ml-2"
                  >
                    Clear Draft
                  </button>
                </div>
              )}

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

              <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="quote-name" className="text-xs font-semibold text-slate-800 block">
                        Your Full Name <span className="text-[#dc2626]">*</span>
                      </label>
                      {touched.name && !errors.name && formData.name.trim() && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      id="quote-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onBlur={() => handleBlur("name")}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. David Morrison"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border text-slate-900 text-sm focus:outline-none transition-colors ${
                        touched.name && errors.name
                          ? "border-red-500 bg-red-50/20 focus:border-red-600"
                          : touched.name && formData.name.trim()
                          ? "border-emerald-500 focus:border-emerald-600"
                          : "border-slate-300 focus:border-[#dc2626]"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="quote-phone" className="text-xs font-semibold text-slate-800 block">
                        Mobile Number <span className="text-[#dc2626]">*</span>
                      </label>
                      {touched.phone && !errors.phone && formData.phone.trim() && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      id="quote-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onBlur={() => handleBlur("phone")}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="e.g. 0452 612 336"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border text-slate-900 text-sm focus:outline-none transition-colors ${
                        touched.phone && errors.phone
                          ? "border-red-500 bg-red-50/20 focus:border-red-600"
                          : touched.phone && formData.phone.trim()
                          ? "border-emerald-500 focus:border-emerald-600"
                          : "border-slate-300 focus:border-[#dc2626]"
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Email */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="quote-email" className="text-xs font-semibold text-slate-800 block">
                        Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      {touched.email && !errors.email && formData.email.trim() && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      id="quote-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onBlur={() => handleBlur("email")}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="e.g. david@gmail.com"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border text-slate-900 text-sm focus:outline-none transition-colors ${
                        touched.email && errors.email
                          ? "border-red-500 bg-red-50/20 focus:border-red-600"
                          : touched.email && formData.email.trim()
                          ? "border-emerald-500 focus:border-emerald-600"
                          : "border-slate-300 focus:border-[#dc2626]"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Suburb */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="quote-suburb" className="text-xs font-semibold text-slate-800 block">
                        Job Location / Suburb <span className="text-[#dc2626]">*</span>
                      </label>
                      {touched.suburb && !errors.suburb && formData.suburb.trim() && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      id="quote-suburb"
                      name="suburb"
                      type="text"
                      required
                      value={formData.suburb}
                      onBlur={() => handleBlur("suburb")}
                      onChange={(e) => handleChange("suburb", e.target.value)}
                      placeholder="e.g. Morley, WA 6062"
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[6px] bg-white border text-slate-900 text-sm focus:outline-none transition-colors ${
                        touched.suburb && errors.suburb
                          ? "border-red-500 bg-red-50/20 focus:border-red-600"
                          : touched.suburb && formData.suburb.trim()
                          ? "border-emerald-500 focus:border-emerald-600"
                          : "border-slate-300 focus:border-[#dc2626]"
                      }`}
                    />
                    {touched.suburb && errors.suburb && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.suburb}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Service Type with explicit associated Label */}
                  <div className="space-y-1">
                    <label htmlFor="quote-service-type" className="text-xs font-semibold text-slate-800 block">
                      Primary Service Required <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      id="quote-service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onBlur={() => handleBlur("serviceType")}
                      onChange={(e) => handleChange("serviceType", e.target.value)}
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
                      onChange={(e) => handleChange("approxArea", e.target.value)}
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
                    onChange={(e) => handleChange("message", e.target.value)}
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
