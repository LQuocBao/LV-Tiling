"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Settings,
  Users,
  Grid,
  Image as ImageIcon,
  Save,
  Trash2,
  Plus,
  ExternalLink,
  LogOut,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Download,
  Shield,
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  RefreshCw,
  Send,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";
import {
  SiteSettings,
  ServiceItem,
  GalleryItem,
  QuoteLead,
  defaultSettings,
} from "@/data/initialData";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "settings" | "sheets" | "gallery" | "services">("leads");

  // State data
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Search & Filters
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>("all");

  // UI status
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [testingSheet, setTestingSheet] = useState(false);
  const [syncingSheet, setSyncingSheet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New gallery item state
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "completed" as "completed" | "flashbacks" | "screeding" | "polyurethane" | "bandages" | "waterproof" | "tennax",
    image: "/media/completed/completed_1.jpg",
    location: "Morley, WA",
    tileType: "Porcelain 600x1200mm",
  });
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  // Check auth
  useEffect(() => {
    const isAuth = localStorage.getItem("lv_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [resSettings, resLeads, resServices, resGallery] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/gallery").then((r) => r.json()),
      ]);

      if (resSettings.data) setSettings(resSettings.data);
      if (resLeads.data) setLeads(resLeads.data);
      if (resServices.data) setServices(resServices.data);
      if (resGallery.data) setGallery(resGallery.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lv_admin_auth");
    localStorage.removeItem("lv_admin_user");
    router.push("/admin/login");
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: "Website configuration saved successfully!" });
      } else {
        setStatusMsg({ type: "error", msg: "Failed to save settings." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Error saving settings." });
    } finally {
      setSaving(false);
    }
  };

  // Test Google Sheet Webhook
  const handleTestGoogleSheet = async () => {
    if (!settings.googleSheetWebhookUrl || !settings.googleSheetWebhookUrl.trim().startsWith("http")) {
      setStatusMsg({ type: "error", msg: "Please enter a valid Google Apps Script Webhook URL first." });
      return;
    }

    setTestingSheet(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/sync-google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true, webhookUrl: settings.googleSheetWebhookUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: data.message || "Test connection succeeded! Row added to your Google Sheet." });
      } else {
        setStatusMsg({ type: "error", msg: data.error || "Connection failed. Please check your Web App deployment settings." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: err.message || "Failed to reach Google Sheet webhook." });
    } finally {
      setTestingSheet(false);
    }
  };

  // Sync all leads to Google Sheet
  const handleSyncAllToGoogleSheet = async () => {
    if (!settings.googleSheetWebhookUrl || !settings.googleSheetWebhookUrl.trim().startsWith("http")) {
      setStatusMsg({ type: "error", msg: "Please enter a valid Google Apps Script Webhook URL first." });
      return;
    }

    setSyncingSheet(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/sync-google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: false, webhookUrl: settings.googleSheetWebhookUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: data.message });
      } else {
        setStatusMsg({ type: "error", msg: data.error || "Failed to sync leads." });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: err.message || "Error communicating with Google Sheets." });
    } finally {
      setSyncingSheet(false);
    }
  };

  // Update Lead Status
  const handleUpdateLeadStatus = async (id: string, newStatus: QuoteLead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        setStatusMsg({ type: "success", msg: `Lead marked as "${newStatus}"` });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to update lead status." });
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((l) => l.id !== id));
        setStatusMsg({ type: "success", msg: "Lead deleted successfully." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to delete lead." });
    }
  };

  // Add Gallery Item
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGalleryItem),
      });
      const data = await res.json();
      if (data.success) {
        setGallery([data.data, ...gallery]);
        setShowAddGalleryModal(false);
        setStatusMsg({ type: "success", msg: "New project added to portfolio gallery!" });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to add project." });
    }
  };

  // Delete Gallery Item
  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Remove this photo from portfolio?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setGallery(gallery.filter((g) => g.id !== id));
        setStatusMsg({ type: "success", msg: "Project image removed." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to delete image." });
    }
  };

  // Export Leads to CSV
  const exportLeadsCsv = () => {
    const headers = "ID,Name,Phone,Email,Suburb,Service,Area,Message,Status,Date\n";
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.name}","${l.phone}","${l.email}","${l.suburb}","${l.serviceType}","${l.approxArea}","${l.message.replace(/"/g, '""')}","${l.status}","${l.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `lv_tiling_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyAppsScriptCode = () => {
    const code = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead ID",
        "Customer Name",
        "Phone Number",
        "Email Address",
        "Job Suburb",
        "Service Required",
        "Approx Area",
        "Customer Message",
        "Status"
      ]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.id || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.suburb || "",
      data.serviceType || "",
      data.approxArea || "",
      data.message || "",
      data.status || "new"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Row added" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (!authenticated) {
    return null;
  }

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.suburb.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "all" || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Gallery
  const filteredGallery = gallery.filter((g) => {
    return galleryCategoryFilter === "all" || g.category === galleryCategoryFilter;
  });

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Header (Shadcn / Ant Design TopBar) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#dc2626] flex items-center justify-center text-white font-black text-sm">
            LV
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              LV Tiling Pty Ltd CMS
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Administration &amp; Leads Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-red-50 hover:bg-red-100 text-xs font-semibold text-[#b91c1c] border border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Alert Notice */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-[6px] flex items-center justify-between gap-3 text-xs font-semibold border ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{statusMsg.msg}</span>
            </div>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-slate-500 hover:text-slate-900 cursor-pointer font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "leads"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quote Leads</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#dc2626] text-white text-[10px] font-bold">
                {newLeadsCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("sheets")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "sheets"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets Sync</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "settings"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "gallery"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Portfolio Media ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "services"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Trade Services ({services.length})</span>
          </button>
        </div>

        {/* TAB 1: QUOTE LEADS */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-[6px] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search leads by name, phone, suburb..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                >
                  <option value="all">All Statuses ({leads.length})</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quoted">Quoted</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportLeadsCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                {settings.googleSheetWebhookUrl && (
                  <button
                    onClick={handleSyncAllToGoogleSheet}
                    disabled={syncingSheet}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${syncingSheet ? "animate-spin" : ""}`} />
                    <span>Sync Sheet</span>
                  </button>
                )}
              </div>
            </div>

            {/* Leads Table */}
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center rounded-[6px] bg-white border border-slate-200 text-slate-500 text-sm">
                No quote leads matching your filter criteria.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-5 rounded-[6px] bg-white border transition-colors ${
                      lead.status === "new"
                        ? "border-[#dc2626]/40 bg-red-50/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Customer Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-base font-bold text-slate-900">{lead.name}</h3>
                          
                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                              lead.status === "new"
                                ? "bg-red-100 text-[#b91c1c] border border-red-200"
                                : lead.status === "contacted"
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : lead.status === "quoted"
                                ? "bg-blue-100 text-blue-900 border border-blue-200"
                                : lead.status === "booked"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {lead.status}
                          </span>

                          <span className="text-xs text-slate-400 font-medium">
                            {lead.createdAt}
                          </span>
                        </div>

                        {/* Contact Chips */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 text-[#b91c1c] hover:underline font-bold"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{lead.phone}</span>
                          </a>

                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:underline"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{lead.email}</span>
                            </a>
                          )}

                          <span className="inline-flex items-center gap-1 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.suburb}</span>
                          </span>
                        </div>

                        {/* Service Scope */}
                        <div className="text-xs text-slate-700 space-y-1">
                          <div>
                            <span className="font-semibold text-slate-900">Service:</span> {lead.serviceType} ·{" "}
                            <span className="font-semibold text-slate-900">Area:</span> {lead.approxArea}
                          </div>
                          {lead.message && (
                            <p className="p-2.5 rounded-[4px] bg-slate-50 border border-slate-200 text-slate-700 italic">
                              &ldquo;{lead.message}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-[6px]">
                          {(["new", "contacted", "quoted", "booked", "completed"] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => handleUpdateLeadStatus(lead.id, st)}
                              className={`px-2 py-1 rounded-[4px] text-[11px] font-semibold transition-colors cursor-pointer ${
                                lead.status === st
                                  ? "bg-white text-slate-900 font-bold shadow-xs"
                                  : "text-slate-600 hover:text-slate-900"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GOOGLE SHEETS INTEGRATION & SETUP GUIDE */}
        {activeTab === "sheets" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[6px] border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span>Google Sheets Real-Time Sync Configuration</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect your Google Sheet via Google Apps Script Webhook. When a customer submits a quote, it automatically appends a new row to your sheet in real-time.
                  </p>
                </div>
              </div>

              {/* Webhook URL Input */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-800 block">
                  Google Apps Script Web App URL
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={settings.googleSheetWebhookUrl || ""}
                    onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="px-4 py-2 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save URL"}
                  </button>
                  <button
                    onClick={handleTestGoogleSheet}
                    disabled={testingSheet || !settings.googleSheetWebhookUrl}
                    className="px-4 py-2 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {testingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Test Connection</span>
                  </button>
                  <button
                    onClick={handleSyncAllToGoogleSheet}
                    disabled={syncingSheet || !settings.googleSheetWebhookUrl}
                    className="px-4 py-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingSheet ? "animate-spin" : ""}`} />
                    <span>Sync All Leads ({leads.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step-by-Step Setup Guide */}
            <div className="bg-white p-6 rounded-[6px] border border-slate-200 space-y-4 text-left">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span>📖 Step-by-Step Google Sheet Setup Guide (2 Minutes)</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                  <strong className="text-slate-900 block mb-1">Step 1: Create a new Google Sheet</strong>
                  <span>Go to <a href="https://sheets.new" target="_blank" className="text-blue-600 underline font-semibold">sheets.new</a> to create an empty Google Sheet (e.g. named <em>&quot;LV Tiling Quote Leads&quot;</em>).</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                  <strong className="text-slate-900 block mb-1">Step 2: Open Apps Script</strong>
                  <span>In Google Sheets menu, click <strong>Extensions ➔ Apps Script</strong> (Tiện ích mở rộng ➔ Apps Script).</span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-slate-900">Step 3: Paste this Google Apps Script code</strong>
                    <button
                      onClick={copyAppsScriptCode}
                      className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium inline-flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-[4px] bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Lead ID",
        "Customer Name",
        "Phone Number",
        "Email Address",
        "Job Suburb",
        "Service Required",
        "Approx Area",
        "Customer Message",
        "Status"
      ]);
    }
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.id || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.suburb || "",
      data.serviceType || "",
      data.approxArea || "",
      data.message || "",
      data.status || "new"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Row added" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                  <strong className="text-slate-900 block mb-1">Step 4: Deploy as Web App</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Click <strong>Deploy ➔ New deployment</strong> (Triển khai ➔ Lần triển khai mới).</li>
                    <li>Click the gear icon ⚙️ next to Select type ➔ choose <strong>Web app</strong>.</li>
                    <li>Set <strong>Execute as:</strong> <code>Me (your email)</code>.</li>
                    <li>Set <strong>Who has access:</strong> <code>Anyone</code> (Bất kỳ ai). <em>(Crucial for webhook delivery)</em>.</li>
                    <li>Click <strong>Deploy</strong> and copy the <strong>Web App URL</strong>.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                  <strong className="text-slate-900 block mb-1">Step 5: Paste URL &amp; Test</strong>
                  <span>Paste your Web App URL into the input field above, click <strong>Save URL</strong> and then <strong>Test Connection</strong>. A sample row will be instantly added to your Google Sheet!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITE SETTINGS */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Website Content &amp; Contact Information</h2>
                <p className="text-xs text-slate-500">
                  Update public contact details, ABN accreditation, hero copywriting, and top bar notices.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save All Settings"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company & Accreditation */}
              <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#dc2626]" />
                  <span>Company Credentials</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Company Legal Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Australian Business Number (ABN)</label>
                  <input
                    type="text"
                    value={settings.abn}
                    onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Workmanship Warranty (Years)</label>
                  <input
                    type="number"
                    value={settings.warrantyYears}
                    onChange={(e) => setSettings({ ...settings, warrantyYears: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Contact Channels */}
              <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#dc2626]" />
                  <span>Contact Channels</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number (Australian Mobile)</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Physical Workshop Base</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Facebook Page URL</label>
                  <input
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

            </div>

            {/* Copywriting & Announcements */}
            <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Hero Copywriting &amp; Top Marquee Banner
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Hero Section Main Headline Text</label>
                <textarea
                  rows={3}
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Top Header Announcement Marquee</label>
                <input
                  type="text"
                  value={settings.marqueeAnnouncement}
                  onChange={(e) => setSettings({ ...settings, marqueeAnnouncement: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: PORTFOLIO GALLERY */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-[6px] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Filter Category:</span>
                <select
                  value={galleryCategoryFilter}
                  onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                >
                  <option value="all">All Categories ({gallery.length})</option>
                  <option value="completed">Completed Jobs photo</option>
                  <option value="flashbacks">Flashbacks</option>
                  <option value="screeding">Screeding and prep</option>
                  <option value="polyurethane">Polyurethane and Primer</option>
                  <option value="bandages">Shower Bandages</option>
                  <option value="waterproof">Waterproof</option>
                  <option value="tennax">Tennax Seal</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[6px] overflow-hidden bg-white border border-slate-200 flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-slate-900/80 text-[10px] font-semibold text-white uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">📍 {item.location}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {item.tileType}
                      </span>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-[6px] border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">7 Core Trade Capabilities (Synchronized)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These 7 trade categories power the Services Grid, Quote Form selector, and Project Galleries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={service.id} className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#b91c1c]">Trade #{index + 1}</span>
                    {service.badge && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-red-50 text-[#b91c1c] text-[10px] font-bold border border-red-200">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{service.shortDesc}</p>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {service.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-[11px] text-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD GALLERY PHOTO */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-[6px] bg-white border border-slate-200 space-y-4 text-left shadow-lg">
            <h3 className="text-sm font-bold text-slate-900">Add Project Photo to Portfolio</h3>
            
            <form onSubmit={handleAddGalleryItem} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bathroom Full Height Tiling"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Trade Category</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) =>
                    setNewGalleryItem({
                      ...newGalleryItem,
                      category: e.target.value as typeof newGalleryItem.category,
                    })
                  }
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                >
                  <option value="completed">Completed Jobs photo</option>
                  <option value="flashbacks">Flashbacks</option>
                  <option value="screeding">Screeding and prep</option>
                  <option value="polyurethane">Polyurethane and Primer</option>
                  <option value="bandages">Shower Bandages</option>
                  <option value="waterproof">Waterproof</option>
                  <option value="tennax">Tennax Seal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Image Path / URL</label>
                <input
                  type="text"
                  required
                  placeholder="/media/completed/completed_1.jpg"
                  value={newGalleryItem.image}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Location (Suburb, WA)</label>
                <input
                  type="text"
                  placeholder="Morley, WA"
                  value={newGalleryItem.location}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Tile Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. 600x1200mm Porcelain"
                  value={newGalleryItem.tileType}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, tileType: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
