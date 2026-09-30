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
  Clock,
  Download,
  Shield,
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
  const [activeTab, setActiveTab] = useState<"leads" | "settings" | "services" | "gallery">("leads");

  // State data
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // UI status
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // New gallery item state
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "completed" as "completed" | "flashbacks" | "screeding" | "polyurethane" | "bandages" | "waterproof" | "tennax",
    image: "/media/9935903f-3f4e-4182-8197-19e2a50fa065.jpg",
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
      console.error("Error fetching data:", err);
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
        setStatusMsg({ type: "success", msg: "Website settings saved successfully!" });
      } else {
        setStatusMsg({ type: "error", msg: "Failed to save settings." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Error saving settings." });
    } finally {
      setSaving(false);
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
        setStatusMsg({ type: "success", msg: `Lead marked as ${newStatus}` });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "Failed to update lead status." });
    }
  };

  // Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to remove this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads(leads.filter((l) => l.id !== id));
        setStatusMsg({ type: "success", msg: "Lead deleted." });
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
        setStatusMsg({ type: "success", msg: "New project added to gallery!" });
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

  if (!authenticated) {
    return null;
  }

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="min-h-screen bg-[#070a0f] text-gray-200">
      
      {/* Admin Top Navigation */}
      <header className="bg-[#0e1420] border-b border-gray-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#e53835] flex items-center justify-center text-white font-black text-base shadow-md">
            LV
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">LV Tiling Pty Ltd CMS</h1>
            <p className="text-[11px] text-gray-400">Content & Lead Administration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#161d2d] hover:bg-[#1f283d] text-xs font-semibold text-gray-300 border border-gray-700 transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Toast Status Notice */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold ${
              statusMsg.type === "success"
                ? "bg-green-950/80 border border-green-500/50 text-green-300"
                : "bg-red-950/80 border border-red-500/50 text-red-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === "success" ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{statusMsg.msg}</span>
            </div>
            <button onClick={() => setStatusMsg(null)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 pb-4">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-[#e53835] text-white shadow-lg shadow-red-950"
                : "bg-[#121824] text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Quote Requests & Leads</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-[#e53835] text-[10px] font-black">
                {newLeadsCount} New
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#e53835] text-white shadow-lg shadow-red-950"
                : "bg-[#121824] text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings & Info</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "gallery"
                ? "bg-[#e53835] text-white shadow-lg shadow-red-950"
                : "bg-[#121824] text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery & Projects ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "services"
                ? "bg-[#e53835] text-white shadow-lg shadow-red-950"
                : "bg-[#121824] text-gray-400 hover:text-white border border-gray-800"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Services List ({services.length})</span>
          </button>
        </div>

        {/* TAB 1: LEADS & QUOTE REQUESTS */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Incoming Client Quote Requests</h2>
                <p className="text-xs text-gray-400">
                  Received in real-time from the website. Contact leads promptly.
                </p>
              </div>
              <button
                onClick={exportLeadsCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161d2d] hover:bg-[#1f283d] text-xs font-semibold text-gray-200 border border-gray-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#e53835]" />
                <span>Export CSV</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121824] border border-gray-800 text-gray-400 text-sm">
                No quote requests received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      lead.status === "new"
                        ? "bg-[#141c2c] border-red-500/40 shadow-lg shadow-red-950/20"
                        : "bg-[#121824] border-gray-800"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Customer info */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-white">{lead.name}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              lead.status === "new"
                                ? "bg-[#e53835] text-white"
                                : lead.status === "contacted"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : lead.status === "quoted"
                                ? "bg-red-500/20 text-blue-300 border border-blue-500/30"
                                : lead.status === "booked"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {lead.status}
                          </span>
                          <span className="text-xs text-gray-400">📅 {lead.createdAt}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1.5 text-[#ff524f] hover:underline font-bold"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{lead.phone}</span>
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-1.5 hover:underline text-gray-300"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{lead.email}</span>
                            </a>
                          )}
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>Suburb: {lead.suburb}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs text-gray-300 space-y-1">
                          <div>
                            <strong className="text-white">Service:</strong> {lead.serviceType} ·{" "}
                            <strong className="text-white">Area:</strong> {lead.approxArea}
                          </div>
                          {lead.message && (
                            <div className="p-3 rounded-xl bg-[#090d14] text-gray-300 border border-gray-800 text-xs">
                              &ldquo;{lead.message}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-800">
                        <div className="flex items-center gap-1">
                          {(["new", "contacted", "quoted", "booked", "completed"] as const).map(
                            (st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateLeadStatus(lead.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                                  lead.status === st
                                    ? "bg-white text-black font-bold"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                }`}
                              >
                                {st}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
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

        {/* TAB 2: SITE SETTINGS & INFO */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">General Website Configuration</h2>
                <p className="text-xs text-gray-400">
                  Update phone, email, address, Facebook link, and hero headline copy.
                </p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#e53835] hover:bg-[#ff4d49] text-white font-bold text-xs shadow-lg shadow-red-900/40 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save All Changes"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company & Legal */}
              <div className="p-6 rounded-2xl bg-[#121824] border border-gray-800 space-y-4 text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#e53835]" />
                  <span>Company & Accreditation</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Company Legal Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Australian Business Number (ABN)</label>
                  <input
                    type="text"
                    value={settings.abn}
                    onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Workmanship Warranty (Years)</label>
                  <input
                    type="number"
                    value={settings.warrantyYears}
                    onChange={(e) => setSettings({ ...settings, warrantyYears: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 rounded-2xl bg-[#121824] border border-gray-800 space-y-4 text-left">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#e53835]" />
                  <span>Contact & Location Channels</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Phone Number (Australian Mobile)</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Physical Address / Workshop</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Trang Facebook URL</label>
                  <input
                    type="text"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Headline & Text Content */}
            <div className="p-6 rounded-2xl bg-[#121824] border border-gray-800 space-y-4 text-left">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Hero Headline & Announcement Text
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Hero Section Main Headline</label>
                <textarea
                  rows={3}
                  value={settings.heroHeadline}
                  onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Top Header Announcement Marquee</label>
                <input
                  type="text"
                  value={settings.marqueeAnnouncement}
                  onChange={(e) => setSettings({ ...settings, marqueeAnnouncement: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#e53835] hover:bg-[#ff4d49] text-white font-bold text-sm shadow-xl shadow-red-900/40 cursor-pointer transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: GALLERY MANAGER */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Portfolio Gallery Manager</h2>
                <p className="text-xs text-gray-400">
                  {gallery.length} projects displayed on the public landing page.
                </p>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e53835] hover:bg-[#ff4d49] text-white font-bold text-xs cursor-pointer shadow-lg shadow-red-900/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden bg-[#121824] border border-gray-800 flex flex-col justify-between group"
                >
                  <div className="relative h-48 w-full bg-gray-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-bold text-white uppercase">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-2">{item.title}</h4>
                      <p className="text-[11px] text-gray-400 mt-1">📍 {item.location}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono truncate max-w-[120px]">
                        {item.tileType}
                      </span>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete project"
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

        {/* TAB 4: SERVICES LIST */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Website Tiling Services</h2>
                <p className="text-xs text-gray-400">
                  Manage the core services presented on the landing page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div key={service.id} className="p-6 rounded-2xl bg-[#121824] border border-gray-800 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#e53835]">Service #{index + 1}</span>
                    {service.badge && (
                      <span className="px-2 py-0.5 rounded bg-[#e53835]/20 text-[#ff524f] text-[10px] font-bold">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">{service.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{service.shortDesc}</p>
                  <div className="pt-2 border-t border-gray-800 flex flex-wrap gap-1.5">
                    {service.features.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#090d14] text-[11px] text-gray-300 border border-gray-700">
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#121824] border border-gray-800 space-y-4 text-left">
            <h3 className="text-base font-bold text-white">Add Project to Portfolio</h3>
            
            <form onSubmit={handleAddGalleryItem} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bathroom Full Height Tiling"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300">Category</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) =>
                    setNewGalleryItem({
                      ...newGalleryItem,
                      category: e.target.value as typeof newGalleryItem.category,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                >
                  <option value="completed">Completed Jobs photo</option>
                  <option value="flashbacks">Flashbacks</option>
                  <option value="screeding">Screeding and prep</option>
                  <option value="polyurethane">Polyurethane and Primer</option>
                  <option value="bandages">Shower Bandages</option>
                  <option value="waterproof">Waterproof</option>
                  <option value="tennax">tennax seal</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300">Image Path / URL</label>
                <input
                  type="text"
                  required
                  placeholder="/media/...jpg or https://..."
                  value={newGalleryItem.image}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300">Location (Suburb, WA)</label>
                <input
                  type="text"
                  placeholder="Morley, WA"
                  value={newGalleryItem.location}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300">Tile Specifications</label>
                <input
                  type="text"
                  placeholder="e.g. 600x1200mm Porcelain"
                  value={newGalleryItem.tileType}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, tileType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-gray-700 text-white text-xs focus:border-[#e53835] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#e53835] hover:bg-[#ff4d49] text-xs font-bold text-white shadow-md shadow-red-900"
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
