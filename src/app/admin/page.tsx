"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
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
  FileSpreadsheet,
  Copy,
  Check,
  Search,
  RefreshCw,
  Send,
  Loader2,
  Settings,
  Bell,
  Sliders,
  CheckSquare,
  ShieldCheck,
  ArrowRight,
  Eye,
  Inbox,
  Filter,
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

  // Tab State
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "leads"
    | "notifications-email"
    | "notifications-sheets"
    | "settings-general"
    | "cms-gallery"
  >("dashboard");

  // State data
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [leads, setLeads] = useState<QuoteLead[]>([]);
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
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testingSheet, setTestingSheet] = useState(false);
  const [syncingSheet, setSyncingSheet] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Gallery modal
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "completed" as "completed" | "flashbacks" | "screeding" | "polyurethane" | "bandages" | "waterproof" | "tennax",
    image: "/media/completed/completed_1.jpg",
    location: "Morley, WA",
    tileType: "Porcelain 600x1200mm",
  });
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);

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
      const [resSettings, resLeads, resGallery] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/gallery").then((r) => r.json()),
      ]);

      if (resSettings.settings) {
        setSettings(resSettings.settings);
        setTestEmailAddress(resSettings.settings.adminNotificationEmail || resSettings.settings.email || "lvotiling@gmail.com");
      }
      if (resLeads.leads) setLeads(resLeads.leads);
      if (resGallery.gallery) setGallery(resGallery.gallery);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("lv_admin_auth");
    router.push("/admin/login");
  };

  const handleSaveSettings = async (customPayload?: SiteSettings) => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const payload = customPayload || settings;
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setStatusMsg({ type: "success", msg: "✅ Đã lưu cài đặt hệ thống thành công!" });
      } else {
        setStatusMsg({ type: "error", msg: "❌ Lưu thất bại: " + (data.error || "Lỗi không xác định") });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "❌ Lỗi kết nối khi lưu cài đặt." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: QuoteLead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
        setStatusMsg({ type: "success", msg: "Đã cập nhật trạng thái yêu cầu!" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Lỗi cập nhật trạng thái." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu báo giá này không?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
        setStatusMsg({ type: "success", msg: "Đã xóa yêu cầu báo giá." });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Lỗi khi xóa dữ liệu." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // Export Leads to Excel (.csv with UTF-8 BOM)
  const exportLeadsExcel = () => {
    if (leads.length === 0) {
      alert("Không có dữ liệu yêu cầu báo giá để xuất!");
      return;
    }

    const headers = [
      "Mã đơn (ID)",
      "Họ và Tên",
      "Số Điện Thoại",
      "Email",
      "Khu Vực / Suburb",
      "Dịch Vụ Yêu Cầu",
      "Diện Tích Ước Tính",
      "Trạng Thái",
      "Ghi Chú Chi Tiết",
      "Thời Gian Gửi",
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${(l.suburb || "").replace(/"/g, '""')}"`,
      `"${(l.serviceType || "").replace(/"/g, '""')}"`,
      `"${(l.approxArea || "").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${new Date(l.createdAt).toLocaleString("vi-VN")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LVTiling_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test Email SMTP
  const handleTestEmail = async () => {
    setTestingEmail(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmailAddress || settings.adminNotificationEmail || settings.email,
          customSettings: settings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: data.message });
      } else {
        setStatusMsg({ type: "error", msg: `❌ Thất bại: ${data.error}` });
      }
    } catch (err: any) {
      setStatusMsg({ type: "error", msg: "Lỗi kết nối kiểm tra email." });
    } finally {
      setTestingEmail(false);
    }
  };

  // Test Google Sheet
  const handleTestSheetConnection = async () => {
    if (!settings.googleSheetWebhookUrl) {
      alert("Vui lòng dán Webhook URL của Google Apps Script trước!");
      return;
    }
    setTestingSheet(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/sync-google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          webhookUrl: settings.googleSheetWebhookUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: "✅ Kết nối Google Sheet thành công! Đã thêm dòng test vào bảng tính." });
      } else {
        setStatusMsg({ type: "error", msg: `❌ Kết nối thất bại: ${data.error}` });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "❌ Không thể gọi Webhook Google Sheet. Vui lòng kiểm tra lại URL." });
    } finally {
      setTestingSheet(false);
    }
  };

  // Sync all leads to Google Sheet
  const handleSyncAllLeadsToSheet = async () => {
    if (!settings.googleSheetWebhookUrl) {
      alert("Vui lòng cấu hình Webhook URL trước!");
      return;
    }
    setSyncingSheet(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/sync-google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sync_all",
          webhookUrl: settings.googleSheetWebhookUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({ type: "success", msg: `✅ Đã đồng bộ thành công ${data.syncedCount || leads.length} yêu cầu sang Google Sheet!` });
      } else {
        setStatusMsg({ type: "error", msg: `❌ Lỗi đồng bộ: ${data.error}` });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "❌ Lỗi mạng khi đồng bộ Google Sheet." });
    } finally {
      setSyncingSheet(false);
    }
  };

  // Gallery Add Item
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title.trim()) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGalleryItem),
      });
      const data = await res.json();
      if (data.success) {
        setGallery((prev) => [data.item, ...prev]);
        setShowAddGalleryModal(false);
        setNewGalleryItem({
          title: "",
          category: "completed",
          image: "/media/completed/completed_1.jpg",
          location: "Morley, WA",
          tileType: "Porcelain 600x1200mm",
        });
        setStatusMsg({ type: "success", msg: "Đã thêm ảnh công trình mới vào thư viện!" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Lỗi thêm ảnh vào thư viện." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hình ảnh này khỏi thư viện?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setGallery((prev) => prev.filter((item) => item.id !== id));
        setStatusMsg({ type: "success", msg: "Đã xóa ảnh khỏi thư viện!" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: "Lỗi khi xóa ảnh." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="font-medium text-slate-300">Đang xác thực quyền quản trị...</span>
        </div>
      </div>
    );
  }

  // Filter Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.includes(leadSearch) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.suburb.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "all" || lead.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const bookedLeadsCount = leads.filter((l) => l.status === "booked" || l.status === "completed").length;

  const googleAppsScriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Tạo tiêu đề nếu trang tính còn trống
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Thời Gian Nhận",
        "Mã Đơn",
        "Họ và Tên",
        "Số Điện Thoại",
        "Email",
        "Khu Vực (Suburb)",
        "Dịch Vụ Yêu Cầu",
        "Diện Tích",
        "Trạng Thái",
        "Ghi Chú / Yêu Cầu"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#f1f5f9");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Nếu là sync toàn bộ danh sách
    if (data.action === "sync_all" && Array.isArray(data.leads)) {
      data.leads.forEach(function(lead) {
        sheet.appendRow([
          lead.timestamp || new Date().toLocaleString("vi-VN"),
          lead.id,
          lead.name,
          lead.phone,
          lead.email || "",
          lead.suburb || "",
          lead.serviceType || "",
          lead.approxArea || "",
          lead.status || "new",
          lead.message || ""
        ]);
      });
      return ContentService.createTextOutput(JSON.stringify({ "status": "success", "synced": data.leads.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Ghi 1 dòng đơn mới
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("vi-VN"),
      data.id || "LEAD-" + new Date().getTime(),
      data.name,
      data.phone,
      data.email || "",
      data.suburb || "",
      data.serviceType || "",
      data.approxArea || "",
      data.status || "new",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900 font-sans antialiased">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-[6px] bg-amber-500 flex items-center justify-center font-black text-slate-950 text-sm">
              LV
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">LV TILING ADMIN</h1>
              <p className="text-[11px] text-slate-400">Hệ thống Quản trị & Leads</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
          {/* Group 1: TỔNG QUAN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tổng Quan
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Bảng điều khiển</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: QUẢN LÝ BÁO GIÁ */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Khách hàng & Báo giá
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("leads")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "leads"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4" />
                  <span>Danh sách Báo giá</span>
                </div>
                {newLeadsCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-[4px] ${
                      activeTab === "leads" ? "bg-slate-950 text-amber-400" : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {newLeadsCount} mới
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Group 3: THÔNG BÁO TỨC THÌ */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Thông Báo Tức Thì
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("notifications-email")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "notifications-email"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4" />
                  <span>Email 2 Chiều (Khuyên dùng)</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("notifications-sheets")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "notifications-sheets"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Google Sheets Webhook</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 4: CÀI ĐẶT & THƯ VIỆN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cài Đặt & Nội Dung
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("settings-general")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "settings-general"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Hotline & Doanh nghiệp</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("cms-gallery")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-gallery"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Thư viện Ảnh Thực Tế</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({gallery.length})</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-[6px] text-xs text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Xem Website Ngoài</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-[6px] text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {activeTab === "dashboard" && "Bảng điều khiển"}
              {activeTab === "leads" && "Danh sách Báo giá Khách hàng"}
              {activeTab === "notifications-email" && "Cấu hình Email Thông Báo 2 Chiều"}
              {activeTab === "notifications-sheets" && "Cấu hình Google Sheets"}
              {activeTab === "settings-general" && "Thông tin Công ty & Hotline"}
              {activeTab === "cms-gallery" && "Quản lý Thư viện hình ảnh"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Export Excel */}
            <button
              onClick={exportLeadsExcel}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất File Excel</span>
            </button>

            {/* Quick Save */}
            <button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-400" />}
              <span>{saving ? "Đang lưu..." : "Lưu Cài Đặt"}</span>
            </button>
          </div>
        </header>

        {/* Global Toast Alert */}
        {statusMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-medium border-b flex items-center space-x-2 ${
              statusMsg.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {statusMsg.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{statusMsg.msg}</span>
          </div>
        )}

        {/* Scrollable View Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Tổng đơn yêu cầu</span>
                    <Inbox className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                    <span className="font-semibold text-amber-600">{newLeadsCount} đơn mới</span>
                    <span>cần gọi tư vấn</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Đã chốt / Thi công</span>
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{bookedLeadsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tỷ lệ chốt: {leads.length ? Math.round((bookedLeadsCount / leads.length) * 100) : 0}%
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Email thông báo 2 chiều</span>
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {settings.emailNotificationsEnabled !== false ? "Đang kích hoạt" : "Đang tắt"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    Đến: {settings.adminNotificationEmail || settings.email}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Google Sheets Sync</span>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {settings.googleSheetWebhookUrl ? "Đã kết nối Webhook" : "Chưa cấu hình"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Real-time khi có form submit</div>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-white border border-slate-200 rounded-[6px] shadow-xs">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Yêu cầu Báo giá Gần đây nhất</h2>
                    <p className="text-xs text-slate-500">Khách hàng vừa submit form trực tuyến</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                  >
                    <span>Xem tất cả ({leads.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Số điện thoại</th>
                        <th className="p-3">Dịch vụ yêu cầu</th>
                        <th className="p-3">Khu vực</th>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-slate-900">{lead.name}</td>
                          <td className="p-3 font-mono text-amber-600 font-semibold">{lead.phone}</td>
                          <td className="p-3 text-slate-700">{lead.serviceType}</td>
                          <td className="p-3 text-slate-600">{lead.suburb}</td>
                          <td className="p-3 text-slate-500">{new Date(lead.createdAt).toLocaleString("vi-VN")}</td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                                lead.status === "new"
                                  ? "bg-amber-100 text-amber-800"
                                  : lead.status === "contacted"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "booked"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {lead.status === "new"
                                ? "Mới tiếp nhận"
                                : lead.status === "contacted"
                                ? "Đã liên hệ"
                                : lead.status === "quoted"
                                ? "Đã gửi báo giá"
                                : lead.status === "booked"
                                ? "Đã chốt việc"
                                : "Hoàn thành"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-[4px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px]"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Gọi ngay</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-400">
                            Chưa có yêu cầu báo giá nào trong cơ sở dữ liệu.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: QUẢN LÝ LEADS ================= */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              {/* Filters & Export Header */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm theo tên, số điện thoại, email, khu vực..."
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded-[6px] px-3 py-1.5 bg-white text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="all">Tất cả trạng thái ({leads.length})</option>
                    <option value="new">Mới tiếp nhận ({newLeadsCount})</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="quoted">Đã báo giá</option>
                    <option value="booked">Đã chốt việc ({bookedLeadsCount})</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportLeadsExcel}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất File Excel (.CSV)</span>
                  </button>
                </div>
              </div>

              {/* Main Leads Table */}
              <div className="bg-white border border-slate-200 rounded-[6px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Liên hệ</th>
                        <th className="p-3">Dịch vụ & Khu vực</th>
                        <th className="p-3">Ghi chú yêu cầu</th>
                        <th className="p-3">Thời gian</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">#{lead.id.slice(-6)}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-bold text-amber-600 flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <a href={`tel:${lead.phone}`} className="hover:underline">
                                {lead.phone}
                              </a>
                            </div>
                            {lead.email && (
                              <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <a href={`mailto:${lead.email}`} className="hover:underline truncate max-w-[150px]">
                                  {lead.email}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{lead.serviceType}</div>
                            <div className="text-[11px] text-slate-500">{lead.suburb}</div>
                            {lead.approxArea && (
                              <div className="text-[10px] text-slate-400">Diện tích: {lead.approxArea}</div>
                            )}
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="text-slate-600 line-clamp-2 text-[11px] italic">
                              "{lead.message || "Không có ghi chú"}"
                            </p>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-[11px] font-bold rounded-[4px] px-2 py-1 border focus:outline-none ${
                                lead.status === "new"
                                  ? "bg-amber-50 border-amber-300 text-amber-800"
                                  : lead.status === "contacted"
                                  ? "bg-blue-50 border-blue-300 text-blue-800"
                                  : lead.status === "quoted"
                                  ? "bg-purple-50 border-purple-300 text-purple-800"
                                  : lead.status === "booked"
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                  : "bg-slate-100 border-slate-300 text-slate-700"
                              }`}
                            >
                              <option value="new">Mới tiếp nhận</option>
                              <option value="contacted">Đã liên hệ</option>
                              <option value="quoted">Đã báo giá</option>
                              <option value="booked">Đã chốt việc</option>
                              <option value="completed">Hoàn thành</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="px-2 py-1 rounded-[4px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold"
                              >
                                Chi tiết
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 rounded-[4px] hover:bg-red-50 text-slate-400 hover:text-red-600"
                                title="Xóa yêu cầu"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            Không tìm thấy yêu cầu báo giá phù hợp.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CẤU HÌNH EMAIL THÔNG BÁO 2 CHIỀU ================= */}
          {activeTab === "notifications-email" && (
            <div className="max-w-4xl space-y-6">
              {/* Explanation Card */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <h2>Cơ chế Thông Báo Email 2 Chiều Tự Động</h2>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi khách hàng nhấn nút gửi yêu cầu báo giá ngoài landing page, hệ thống sẽ tự động kích hoạt 2 email song song:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-[6px]">
                    <div className="font-bold text-amber-900 mb-1 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>1. Email Gửi Đến Chủ Doanh Nghiệp (Admin Alert)</span>
                    </div>
                    <p className="text-amber-800 text-[11px]">
                      Gửi ngay thông báo kèm đầy đủ Tên, SĐT, Dịch vụ, Địa chỉ và nút bấm gọi điện trực tiếp trên di động.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-[6px]">
                    <div className="font-bold text-emerald-900 mb-1 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>2. Email Gửi Cho Khách Hàng (Customer Confirmation)</span>
                    </div>
                    <p className="text-emerald-800 text-[11px]">
                      Thư cảm ơn chuyên nghiệp chuẩn Úc, xác nhận đã tiếp nhận đơn và cam kết kỹ thuật viên sẽ gọi lại trong 15-30 phút.
                    </p>
                  </div>
                </div>
              </div>

              {/* SMTP Configuration Form */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Cấu hình Máy chủ Gửi Email (SMTP)</h3>
                    <p className="text-xs text-slate-500">Hỗ trợ Gmail (Mật khẩu ứng dụng App Password) hoặc Custom Domain</p>
                  </div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotificationsEnabled !== false}
                      onChange={(e) =>
                        setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })
                      }
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span>Bật gửi Email tự động</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Nhận Thông Báo Của Admin (Chủ Web)
                    </label>
                    <input
                      type="email"
                      value={settings.adminNotificationEmail || settings.email || ""}
                      onChange={(e) => setSettings({ ...settings, adminNotificationEmail: e.target.value })}
                      placeholder="lvotiling@gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Đơn hàng mới từ khách sẽ được gửi tới hòm thư này.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tên Người Gửi Hiển Thị (Sender Name)
                    </label>
                    <input
                      type="text"
                      value={settings.emailFromName || "LV Tiling Pty Ltd"}
                      onChange={(e) => setSettings({ ...settings, emailFromName: e.target.value })}
                      placeholder="LV Tiling Pty Ltd"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tài Khoản Gmail Gửi Đi (SMTP Username)
                    </label>
                    <input
                      type="email"
                      value={settings.smtpUser || ""}
                      onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                      placeholder="lvotiling.notification@gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mật Khẩu Ứng Dụng Gmail (16 Ký Tự App Password)
                    </label>
                    <input
                      type="password"
                      value={settings.smtpPass || ""}
                      onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      (Tạo trong: Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords)
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtpHost || "smtp.gmail.com"}
                      onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 text-slate-600 focus:bg-white focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SMTP Port</label>
                    <input
                      type="number"
                      value={settings.smtpPort || 465}
                      onChange={(e) => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                      placeholder="465"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 text-slate-600 focus:bg-white focus:outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Test Email Section */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      placeholder="Nhập email nhận thử..."
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded-[6px] w-64 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleTestEmail}
                      disabled={testingEmail}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-50"
                    >
                      {testingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{testingEmail ? "Đang gửi thử..." : "Gửi Email Thử Nghiệm"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="flex items-center space-x-1.5 px-4 py-1.5 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lưu Cấu Hình Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: GOOGLE SHEETS ================= */}
          {activeTab === "notifications-sheets" && (
            <div className="max-w-4xl space-y-6">
              {/* Webhook Settings Card */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Cấu hình Webhook Tự Động Điền Google Sheets</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Khi khách hàng gửi form, hệ thống sẽ tự động thêm 1 dòng mới vào Google Sheet của bạn.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Google Apps Script Webhook URL (Dán URL vào đây)
                    </label>
                    <input
                      type="url"
                      placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                      value={settings.googleSheetWebhookUrl || ""}
                      onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-slate-800"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={handleTestSheetConnection}
                      disabled={testingSheet || !settings.googleSheetWebhookUrl}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {testingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{testingSheet ? "Đang gửi..." : "Kiểm tra kết nối (Gửi dòng mẫu)"}</span>
                    </button>

                    <button
                      onClick={handleSyncAllLeadsToSheet}
                      disabled={syncingSheet || !settings.googleSheetWebhookUrl || leads.length === 0}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {syncingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
                      <span>Đồng bộ toàn bộ {leads.length} yêu cầu cũ</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step-by-step Apps Script Guide */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Hướng dẫn 5 bước kết nối Google Sheet</h3>
                    <p className="text-xs text-slate-500">Chỉ mất 2 phút cài đặt 1 lần duy nhất</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(googleAppsScriptCode);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2500);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{copiedCode ? "Đã copy code!" : "Copy mã Apps Script"}</span>
                  </button>
                </div>

                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    Mở <strong>Google Sheets</strong> và tạo một bảng tính mới (đặt tên ví dụ: <em>LV Tiling Leads</em>).
                  </li>
                  <li>
                    Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions) &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Xóa toàn bộ code cũ trong file <code>Mã.gs</code>, dán đoạn mã bên dưới vào rồi bấm <strong>Lưu (Ctrl+S)</strong>.
                  </li>
                  <li>
                    Nhấn nút <strong>Triển khai (Deploy) &gt; Tùy chọn triển khai mới (New deployment)</strong>.
                    <br />
                    <span className="text-slate-500 ml-4 font-mono text-[11px]">
                      Loại: Ứng dụng web (Web app) | Người có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong>
                    </span>
                  </li>
                  <li>
                    Nhấn <strong>Triển khai</strong>, copy đường link <strong>URL của ứng dụng web</strong> và dán vào ô Webhook ở trên.
                  </li>
                </ol>

                <div className="relative">
                  <pre className="p-3 bg-slate-900 text-slate-300 rounded-[6px] font-mono text-[11px] overflow-x-auto max-h-56 leading-normal">
                    {googleAppsScriptCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: THÔNG TIN DOANH NGHIỆP ================= */}
          {activeTab === "settings-general" && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-sm font-bold text-slate-900">Thông tin Doanh nghiệp & Liên hệ</h2>
                  <p className="text-xs text-slate-500">Các thông tin hiển thị trên Header, Contact Form và Footer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên Doanh Nghiệp</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mã ABN</label>
                    <input
                      type="text"
                      value={settings.abn}
                      onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Số Hotline (Bấm gọi)</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none font-semibold text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Liên Hệ</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Địa Chỉ Trụ Sở</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Link Trang Facebook</label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Nội dung Banner chữ chạy (Marquee Ticker)</label>
                    <textarea
                      rows={2}
                      value={settings.marqueeAnnouncement}
                      onChange={(e) => setSettings({ ...settings, marqueeAnnouncement: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lưu Thay Đổi Thông Tin</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: THƯ VIỆN HÌNH ẢNH (GALLERY) ================= */}
          {activeTab === "cms-gallery" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <select
                    value={galleryCategoryFilter}
                    onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded-[6px] px-3 py-1.5 bg-white text-slate-700 font-medium"
                  >
                    <option value="all">Tất cả danh mục ({gallery.length})</option>
                    <option value="completed">Completed Jobs</option>
                    <option value="flashbacks">Flashbacks</option>
                    <option value="screeding">Screeding & Prep</option>
                    <option value="polyurethane">Polyurethane & Primer</option>
                    <option value="bandages">Shower Bandages</option>
                    <option value="waterproof">Waterproofing</option>
                    <option value="tennax">Tennax Adhesive</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddGalleryModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Thêm Hình Ảnh Mới</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {gallery
                  .filter((item) => galleryCategoryFilter === "all" || item.category === galleryCategoryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-[6px] overflow-hidden group shadow-xs hover:border-slate-300 transition-colors flex flex-col"
                    >
                      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[4px] bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.location || "Perth, WA"}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100">
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.tileType}</span>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-[4px] hover:bg-red-50"
                            title="Xóa hình ảnh"
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
        </main>
      </div>

      {/* ================= LEAD DETAIL MODAL ================= */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[6px] max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Chi tiết Yêu cầu Báo giá #{selectedLead.id.slice(-6)}</h3>
                <p className="text-xs text-slate-500">{new Date(selectedLead.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-[6px]">
                <div>
                  <span className="text-slate-500 font-medium">Khách hàng:</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedLead.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Số điện thoại:</span>
                  <p className="font-bold text-amber-600 text-sm font-mono">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Email:</span>
                  <p className="font-semibold text-slate-800">{selectedLead.email || "Không có"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Khu vực / Suburb:</span>
                  <p className="font-semibold text-slate-800">{selectedLead.suburb || "Perth"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Dịch vụ yêu cầu:</span>
                  <p className="font-semibold text-slate-800">{selectedLead.serviceType}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Diện tích ước tính:</span>
                  <p className="font-semibold text-slate-800">{selectedLead.approxArea || "Chưa xác định"}</p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Ghi chú chi tiết:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px] text-slate-700 italic">
                  "{selectedLead.message || "Không có ghi chú thêm"}"
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Cập nhật trạng thái:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as any)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[6px] p-2 bg-white"
                >
                  <option value="new">Mới tiếp nhận</option>
                  <option value="contacted">Đã liên hệ qua điện thoại</option>
                  <option value="quoted">Đã gửi bảng báo giá</option>
                  <option value="booked">Đã chốt lịch thi công</option>
                  <option value="completed">Đã hoàn thành công trình</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-[6px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Điện Thoại Ngay</span>
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD GALLERY ITEM MODAL ================= */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddGalleryItem}
            className="bg-white rounded-[6px] max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Ảnh Công Trình Thực Tế</h3>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên công trình / Tiêu đề</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Luxury Ensuite Renovation"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hạng mục công trình</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-white"
                >
                  <option value="completed">Completed Jobs</option>
                  <option value="flashbacks">Flashbacks</option>
                  <option value="screeding">Screeding & Prep</option>
                  <option value="polyurethane">Polyurethane & Primer</option>
                  <option value="bandages">Shower Bandages</option>
                  <option value="waterproof">Waterproofing</option>
                  <option value="tennax">Tennax Adhesive</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đường dẫn ảnh (Image Path)</label>
                <input
                  type="text"
                  required
                  placeholder="/media/completed/completed_1.jpg"
                  value={newGalleryItem.image}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Địa điểm (Location)</label>
                  <input
                    type="text"
                    placeholder="Morley, WA"
                    value={newGalleryItem.location}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-[6px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại gạch (Tile Type)</label>
                  <input
                    type="text"
                    placeholder="Porcelain 600x1200"
                    value={newGalleryItem.tileType}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, tileType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-[6px]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-[6px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Thêm vào thư viện
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
