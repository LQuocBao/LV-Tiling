"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
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
  HelpCircle,
  Globe,
  Settings,
  Edit3,
  Eye,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Sliders,
  CheckSquare,
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
  
  // Sidebar tab state
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "leads"
    | "sheets"
    | "cms-hero"
    | "cms-about"
    | "cms-services"
    | "cms-gallery"
    | "cms-faq"
    | "settings-company"
    | "settings-seo"
  >("dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State data
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Search & Filters
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>("all");

  // Selected Lead for Detail Modal
  const [selectedLead, setSelectedLead] = useState<QuoteLead | null>(null);

  // UI status
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [testingSheet, setTestingSheet] = useState(false);
  const [syncingSheet, setSyncingSheet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Gallery item modal & state
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "completed" as "completed" | "flashbacks" | "screeding" | "polyurethane" | "bandages" | "waterproof" | "tennax",
    image: "/media/completed/completed_1.jpg",
    location: "Morley, WA",
    tileType: "Porcelain 600x1200mm",
  });
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

  // Service item modal & state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Check authentication
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
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setStatusMsg({ type: "success", msg: "Configuration updated successfully!" });
      } else {
        setStatusMsg({ type: "error", msg: "Failed to save configuration." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Error connecting to server." });
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
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        setStatusMsg({ type: "success", msg: `Lead marked as "${newStatus}"` });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to update lead status." });
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead inquiry?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((l) => l.id !== id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
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

  // Save/Update Service Item
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const updatedServices = services.map((s) => (s.id === editingService.id ? editingService : s));
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedServices),
      });
      const data = await res.json();
      if (data.success) {
        setServices(updatedServices);
        setShowServiceModal(false);
        setEditingService(null);
        setStatusMsg({ type: "success", msg: "Trade service updated successfully!" });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to update service." });
    }
  };

  // Export Leads to Excel (CSV with UTF-8 BOM for perfect Microsoft Excel rendering)
  const exportLeadsExcel = () => {
    const BOM = "\uFEFF"; // UTF-8 BOM so Excel opens accented & special chars correctly
    const headers = ["Lead ID", "Customer Name", "Phone Number", "Email Address", "Job Suburb", "Service Required", "Approx Area", "Customer Message", "Status", "Date Created"];
    
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.suburb.replace(/"/g, '""')}"`,
      `"${l.serviceType.replace(/"/g, '""')}"`,
      `"${l.approxArea.replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      l.status,
      l.createdAt,
    ]);

    const csvContent = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LV_Tiling_Customer_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
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

  // Metrics
  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const contactedLeadsCount = leads.filter((l) => l.status === "contacted").length;
  const bookedLeadsCount = leads.filter((l) => l.status === "booked" || l.status === "completed").length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((bookedLeadsCount / totalLeadsCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Ant Design / Shadcn Clean Sidebar Layout) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Sidebar Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[6px] bg-[#dc2626] flex items-center justify-center text-white font-black text-sm">
                LV
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">LV Tiling CMS</h1>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Website &amp; Lead Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Grouped */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            
            {/* Group 1: OVERVIEW */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Overview
              </span>
              <button
                onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>
            </div>

            {/* Group 2: INQUIRIES & LEADS */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lead Management
              </span>
              <button
                onClick={() => { setActiveTab("leads"); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Quote Inquiries</span>
                </div>
                {newLeadsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-slate-900 text-[10px] font-bold">
                    {newLeadsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab("sheets"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "sheets"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets Sync</span>
              </button>
            </div>

            {/* Group 3: WEBSITE CMS */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Landing Page Content
              </span>
              <button
                onClick={() => { setActiveTab("cms-hero"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "cms-hero"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Hero &amp; Top Banner</span>
              </button>

              <button
                onClick={() => { setActiveTab("cms-services"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "cms-services"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Trade Services ({services.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab("cms-gallery"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "cms-gallery"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Portfolio Media ({gallery.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab("cms-about"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "cms-about"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>About Us &amp; Tabs</span>
              </button>
            </div>

            {/* Group 4: SYSTEM CONFIG */}
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                System &amp; Settings
              </span>
              <button
                onClick={() => { setActiveTab("settings-company"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "settings-company"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Company &amp; Contact Info</span>
              </button>

              <button
                onClick={() => { setActiveTab("settings-seo"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "settings-seo"
                    ? "bg-[#dc2626] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>SEO &amp; Schema Metadata</span>
              </button>
            </div>

          </div>

          {/* Sidebar Bottom Profile & Logout */}
          <div className="p-3 border-t border-slate-800 space-y-2">
            <a
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 rounded-[6px] bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#dc2626]" />
                <span>Live Website</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[6px] bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-800/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-[6px] border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-800">Admin</span>
              <span>/</span>
              <span className="text-[#b91c1c] capitalize font-semibold">
                {activeTab.replace("cms-", "Content: ").replace("settings-", "Settings: ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportLeadsExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Excel</span>
            </button>

            {settings.googleSheetWebhookUrl && (
              <button
                onClick={handleSyncAllToGoogleSheet}
                disabled={syncingSheet}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${syncingSheet ? "animate-spin" : ""}`} />
                <span>Sync Sheets</span>
              </button>
            )}
          </div>
        </header>

        {/* Status Toast Alert */}
        {statusMsg && (
          <div className="px-4 sm:px-6 pt-4">
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
          </div>
        )}

        {/* View Contents */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB: DASHBOARD OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time analytics, conversion performance, and website administration status.
                </p>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Total Inquiries</span>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalLeadsCount}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">+{newLeadsCount} new</span> awaiting response
                  </div>
                </div>

                <div className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Booked Projects</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">{bookedLeadsCount}</div>
                  <div className="text-[11px] text-slate-500">
                    {conversionRate}% lead-to-booking conversion
                  </div>
                </div>

                <div className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Active Services</span>
                    <Grid className="w-4 h-4 text-[#dc2626]" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{services.length}</div>
                  <div className="text-[11px] text-slate-500">
                    Synchronized across quote form &amp; cards
                  </div>
                </div>

                <div className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Portfolio Media</span>
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{gallery.length}</div>
                  <div className="text-[11px] text-slate-500">
                    {settings.googleSheetWebhookUrl ? "● Google Sheet Synced" : "○ Google Sheet Disconnected"}
                  </div>
                </div>

              </div>

              {/* Quick Actions & Recent Activity Strip */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Recent 5 Leads */}
                <div className="lg:col-span-2 p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Recent Customer Inquiries</h3>
                    <button
                      onClick={() => setActiveTab("leads")}
                      className="text-xs font-semibold text-[#b91c1c] hover:underline"
                    >
                      View all ({leads.length}) →
                    </button>
                  </div>

                  {leads.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No quote leads received yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex items-center justify-between p-3 rounded-[6px] bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{lead.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-semibold text-slate-700">
                                {lead.suburb}
                              </span>
                            </div>
                            <div className="text-slate-500">
                              {lead.phone} · <span className="text-slate-700 font-medium">{lead.serviceType}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                lead.status === "new"
                                  ? "bg-red-100 text-[#b91c1c]"
                                  : lead.status === "booked"
                                  ? "bg-emerald-100 text-emerald-900"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {lead.status}
                            </span>
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1 text-slate-500 hover:text-slate-900"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Quick Shortcuts */}
                <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Quick Admin Shortcuts
                  </h3>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setShowAddGalleryModal(true)}
                      className="w-full p-3 rounded-[6px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#dc2626]" />
                        <span>Add Project Photo</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("sheets")}
                      className="w-full p-3 rounded-[6px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span>Configure Google Sheets</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab("cms-hero")}
                      className="w-full p-3 rounded-[6px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-blue-600" />
                        <span>Edit Hero &amp; Marquee Copy</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    <button
                      onClick={exportLeadsExcel}
                      className="w-full p-3 rounded-[6px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-amber-600" />
                        <span>Export Leads to Excel (.csv)</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: QUOTE LEADS */}
          {/* ========================================================================= */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              
              {/* Header Title & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[6px] border border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Customer Quote Inquiries ({filteredLeads.length})</h2>
                  <p className="text-xs text-slate-500">Filter, search, update status, or export customer submissions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name, phone, suburb..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
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

                  <button
                    onClick={exportLeadsExcel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              {filteredLeads.length === 0 ? (
                <div className="p-12 text-center rounded-[6px] bg-white border border-slate-200 text-slate-500 text-sm">
                  No quote inquiries matching the selected filters.
                </div>
              ) : (
                <div className="bg-white rounded-[6px] border border-slate-200 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">Customer Name</th>
                        <th className="p-3.5">Contact Info</th>
                        <th className="p-3.5">Location &amp; Service</th>
                        <th className="p-3.5">Area &amp; Notes</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">
                            <div>{lead.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal mt-0.5">{lead.createdAt}</div>
                          </td>
                          <td className="p-3.5 space-y-0.5">
                            <a href={`tel:${lead.phone}`} className="font-semibold text-[#b91c1c] hover:underline block">
                              {lead.phone}
                            </a>
                            {lead.email && (
                              <a href={`mailto:${lead.email}`} className="text-slate-500 hover:text-slate-900 block truncate max-w-[140px]">
                                {lead.email}
                              </a>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold mb-1">
                              📍 {lead.suburb}
                            </span>
                            <div className="text-slate-600 font-medium">{lead.serviceType}</div>
                          </td>
                          <td className="p-3.5 max-w-xs">
                            <div className="font-semibold text-slate-700">{lead.approxArea}</div>
                            {lead.message && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                                &ldquo;{lead.message}&rdquo;
                              </p>
                            )}
                          </td>
                          <td className="p-3.5">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as QuoteLead["status"])}
                              className={`px-2 py-1 rounded-[4px] text-[11px] font-bold uppercase focus:outline-none cursor-pointer border ${
                                lead.status === "new"
                                  ? "bg-red-50 text-[#b91c1c] border-red-200"
                                  : lead.status === "contacted"
                                  ? "bg-amber-50 text-amber-900 border-amber-200"
                                  : lead.status === "quoted"
                                  ? "bg-blue-50 text-blue-900 border-blue-200"
                                  : lead.status === "booked"
                                  ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="quoted">Quoted</option>
                              <option value="booked">Booked</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: GOOGLE SHEETS INTEGRATION */}
          {/* ========================================================================= */}
          {activeTab === "sheets" && (
            <div className="space-y-6">
              
              <div className="bg-white p-6 rounded-[6px] border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      <span>Google Sheets Real-Time Sync Configuration</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Whenever a customer submits a quote on the landing page, it automatically appends a new row to your Google Sheet.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-slate-800 block">
                    Google Apps Script Web App Deployment URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/.../exec"
                      value={settings.googleSheetWebhookUrl || ""}
                      onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2 text-xs rounded-[6px] bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveSettings()}
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

              {/* Step-by-Step Guide */}
              <div className="bg-white p-6 rounded-[6px] border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  📖 Step-by-Step Google Sheet Connection Guide
                </h3>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                    <strong className="text-slate-900 block mb-1">Step 1: Create a Google Sheet</strong>
                    <span>Go to <a href="https://sheets.new" target="_blank" className="text-blue-600 underline font-semibold">sheets.new</a> to create an empty Google Sheet (e.g. named <em>&quot;LV Tiling Customer Leads&quot;</em>).</span>
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
                      <li>Set <strong>Who has access:</strong> <code>Anyone</code> (Bất kỳ ai).</li>
                      <li>Click <strong>Deploy</strong> and copy the <strong>Web App URL</strong>.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                    <strong className="text-slate-900 block mb-1">Step 5: Paste URL &amp; Test Connection</strong>
                    <span>Paste your Web App URL into the input field above, click <strong>Save URL</strong>, then click <strong>Test Connection</strong>. A sample row will be instantly added to your Google Sheet!</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CMS - HERO & TOP BANNER */}
          {/* ========================================================================= */}
          {activeTab === "cms-hero" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-[6px] border border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Hero Section &amp; Top Marquee Content</h2>
                  <p className="text-xs text-slate-500">Edit headline, sub-headline, and announcement ticker text.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hero Display Headline (Supports HTML span highlights)</label>
                  <textarea
                    rows={3}
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500 resize-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Hero Narrative Description</label>
                  <textarea
                    rows={3}
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Top Header Announcement Marquee Ticker</label>
                  <input
                    type="text"
                    value={settings.marqueeAnnouncement}
                    onChange={(e) => setSettings({ ...settings, marqueeAnnouncement: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB: CMS - TRADE SERVICES */}
          {/* ========================================================================= */}
          {activeTab === "cms-services" && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-[6px] border border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Trade Services Capabilities ({services.length})</h2>
                  <p className="text-xs text-slate-500">Edit titles, short descriptions, and feature bullet points.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={service.id} className="p-5 rounded-[6px] bg-white border border-slate-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
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

                    <div className="pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => { setEditingService(service); setShowServiceModal(true); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Service</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CMS - PORTFOLIO GALLERY */}
          {/* ========================================================================= */}
          {activeTab === "cms-gallery" && (
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

          {/* ========================================================================= */}
          {/* TAB: CMS - ABOUT US */}
          {/* ========================================================================= */}
          {activeTab === "cms-about" && (
            <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">About Us Section Content</h2>
                  <p className="text-xs text-slate-500">Overview of the Australian craftsmanship narrative and 3 interactive tabs.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Tab 1: Designing &amp; Aesthetic Precision</span>
                  <p className="text-slate-600">Custom tile patterns, laser-guided layout planning, and seamless 45-degree hand-mitred external corners &amp; niches.</p>
                </div>

                <div className="p-3.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Tab 2: Approved &amp; Certified Standards</span>
                  <p className="text-slate-600">Certified AS 3740 dual-membrane wet area waterproofing, ABN 84 629 140 821, $10M public liability insurance.</p>
                </div>

                <div className="p-3.5 rounded-[6px] bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block">Tab 3: 4-Year Workmanship Guarantee</span>
                  <p className="text-slate-600">Comprehensive 4-year written warranty certificate, laser zero-lippage guarantee, 100% leak-proof shower renovation guarantee.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SETTINGS - COMPANY & CONTACT */}
          {/* ========================================================================= */}
          {activeTab === "settings-company" && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-[6px] border border-slate-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Company &amp; Trade Accreditation Information</h2>
                  <p className="text-xs text-slate-500">Manage legal business name, ABN, phone, email, and workshop base.</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save Company Info"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Legal & Accreditation */}
                <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#dc2626]" />
                    <span>Business Credentials</span>
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Company Legal Name</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Australian Business Number (ABN)</label>
                    <input
                      type="text"
                      value={settings.abn}
                      onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Workmanship Warranty Duration (Years)</label>
                    <input
                      type="number"
                      value={settings.warrantyYears}
                      onChange={(e) => setSettings({ ...settings, warrantyYears: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direct Contact Channels */}
                <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#dc2626]" />
                    <span>Direct Contact Channels</span>
                  </h3>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number (Australian Mobile)</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Official Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Workshop &amp; Base Address</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Facebook Page URL</label>
                    <input
                      type="text"
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-[6px] bg-white border border-slate-300 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB: SETTINGS - SEO & METADATA */}
          {/* ========================================================================= */}
          {activeTab === "settings-seo" && (
            <div className="p-6 rounded-[6px] bg-white border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900">SEO &amp; Structured Schema Markup</h2>
              <p className="text-xs text-slate-500">The website automatically implements standard Australian LocalBusiness Schema.org JSON-LD.</p>
              
              <div className="p-4 rounded-[6px] bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "${settings.companyName}",
  "vatID": "${settings.abn}",
  "telephone": "${settings.phone}",
  "email": "${settings.email}",
  "address": {
    "streetAddress": "${settings.address}",
    "addressLocality": "Morley",
    "addressRegion": "WA",
    "postalCode": "6062",
    "addressCountry": "AU"
  },
  "areaServed": "Greater Perth Metropolitan & Western Australia"
}`}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL: LEAD DETAIL VIEW */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-[6px] bg-white border border-slate-200 space-y-5 text-left shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Quote Inquiry Details</h3>
                <p className="text-xs text-slate-400">ID: {selectedLead.id} · {selectedLead.createdAt}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Customer Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedLead.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className="font-bold text-[#dc2626] uppercase">{selectedLead.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone Number</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-bold text-[#b91c1c] hover:underline text-sm">
                    {selectedLead.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Email Address</span>
                  <span className="font-semibold text-slate-800 break-all">{selectedLead.email || "None provided"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location / Suburb</span>
                  <span className="font-semibold text-slate-800">{selectedLead.suburb}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Estimated Area</span>
                  <span className="font-semibold text-slate-800">{selectedLead.approxArea}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold block">Service Required</span>
                <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200 font-bold text-slate-900">
                  {selectedLead.serviceType}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold block">Customer Message / Notes</span>
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-slate-800 italic leading-relaxed">
                  {selectedLead.message ? `"${selectedLead.message}"` : "No extra notes provided."}
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-slate-700 font-semibold block">Update Status:</span>
                <div className="flex items-center gap-1.5">
                  {(["new", "contacted", "quoted", "booked", "completed"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateLeadStatus(selectedLead.id, st)}
                      className={`flex-1 py-1.5 rounded-[4px] text-[11px] font-semibold uppercase transition-colors cursor-pointer border ${
                        selectedLead.status === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={`tel:${selectedLead.phone}`}
                className="px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Customer</span>
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: ADD GALLERY PHOTO */}
      {/* ========================================================================= */}
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
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500 cursor-pointer"
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
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: EDIT SERVICE */}
      {/* ========================================================================= */}
      {showServiceModal && editingService && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full p-6 rounded-[6px] bg-white border border-slate-200 space-y-4 text-left shadow-lg">
            <h3 className="text-sm font-bold text-slate-900">Edit Trade Service Capability</h3>
            
            <form onSubmit={handleSaveService} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Badge Label (e.g. Master Craft)</label>
                <input
                  type="text"
                  value={editingService.badge || ""}
                  onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Feature Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={editingService.features.join(", ")}
                  onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split(",").map((f) => f.trim()) })}
                  className="w-full px-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
