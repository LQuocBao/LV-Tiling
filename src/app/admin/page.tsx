"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  User,
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
  ChevronUp,
  ChevronDown,
  Edit3,
  Star,
  ToggleLeft,
  ToggleRight,
  Upload,
  X,
  Layout,
  MessageSquare,
  Globe,
  Key,
  HelpCircle,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  SiteSettings,
  ServiceItem,
  GalleryItem,
  QuoteLead,
  TestimonialItem,
  AdminUser,
  defaultSettings,
  defaultSectionVisibility,
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
    | "settings-users"
    | "cms-gallery"
    | "cms-services"
    | "cms-content"
    | "cms-visibility"
    | "cms-testimonials"
  >("dashboard");

  // State data
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // User Management State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "staff" as "admin" | "staff",
    status: "active" as "active" | "inactive",
  });
  const [userSaving, setUserSaving] = useState(false);

  // Services editing state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceUploading, setServiceUploading] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const serviceFileRef = useRef<HTMLInputElement | null>(null);

  // Testimonials editing state
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [showAddTestimonialForm, setShowAddTestimonialForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Omit<TestimonialItem, 'id'>>({
    name: "",
    suburb: "",
    rating: 5,
    date: new Date().toLocaleDateString("en-AU", { month: "long", year: "numeric" }),
    comment: "",
    service: "",
  });

  // Search & Filters
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<"all" | "today" | "week" | "month" | "year">("all");
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
  const [exportingExcel, setExportingExcel] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [lang, setLang] = useState<"en" | "vi">("en");

  // Gallery modal
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    category: "completed" as "completed" | "flashbacks" | "screeding" | "polyurethane" | "bandages" | "waterproof" | "tennax",
    image: "/media/completed/completed_1.jpg",
    location: "Morley, WA",
    tileType: "Porcelain 600x1200mm",
  });
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [hasCustomImage, setHasCustomImage] = useState(false);

  // Check authentication & language preference
  useEffect(() => {
    const isAuth = localStorage.getItem("lv_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      const savedLang = localStorage.getItem("lv_admin_lang") as "en" | "vi" | null;
      if (savedLang) setLang(savedLang);
      fetchData();
    }
  }, [router]);

  const switchLanguage = (newLang: "en" | "vi") => {
    setLang(newLang);
    localStorage.setItem("lv_admin_lang", newLang);
  };

  const fetchData = async () => {
    try {
      const [resSettings, resLeads, resGallery, resServices, resTestimonials, resUsers] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/leads").then((r) => r.json()),
        fetch("/api/gallery").then((r) => r.json()),
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/testimonials").then((r) => r.json()),
        fetch("/api/users").then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      const loadedSettings = resSettings.settings || resSettings.data;
      if (loadedSettings) {
        setSettings(loadedSettings);
        setTestEmailAddress(loadedSettings.adminNotificationEmail || loadedSettings.email || "lvotiling@gmail.com");
      }
      if (resLeads.data || resLeads.leads) setLeads(resLeads.data || resLeads.leads);
      if (resGallery.data || resGallery.gallery) setGallery(resGallery.data || resGallery.gallery);
      if (resServices.data) setServices(resServices.data);
      if (resTestimonials.data) setTestimonials(resTestimonials.data);
      if (resUsers.data || resUsers.users) setUsers(resUsers.data || resUsers.users);
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
        if (data.settings) {
          setSettings(data.settings);
        } else {
          setSettings(payload);
        }
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

  // Export Leads to Native Styled Excel (.xlsx) with date range & status filtering
  const exportLeadsExcel = async (targetLeads = filteredLeads) => {
    if (!targetLeads || targetLeads.length === 0) {
      alert(lang === "en" ? "No lead inquiries match your current filter to export!" : "Không có dữ liệu yêu cầu báo giá phù hợp bộ lọc để xuất!");
      return;
    }

    setExportingExcel(true);
    try {
      const filterLabelMap: Record<string, string> = {
        all: lang === "en" ? "All Time" : "Toàn bộ thời gian",
        today: lang === "en" ? "Today" : "Hôm nay",
        week: lang === "en" ? "Past 7 Days" : "7 ngày qua (Theo tuần)",
        month: lang === "en" ? "This Month" : "Tháng này (Theo tháng)",
        year: lang === "en" ? "This Year" : "Năm nay (Theo năm)",
      };

      const res = await fetch("/api/leads/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: targetLeads,
          filterLabel: filterLabelMap[dateRangeFilter] || dateRangeFilter,
          lang,
        }),
      });

      if (!res.ok) throw new Error("Failed to export Excel file");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LVTiling_Leads_${dateRangeFilter}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMsg({
        type: "success",
        msg: lang === "en" ? "Excel file exported with professional styling!" : "Đã xuất file Excel chuẩn giao diện thành công!",
      });
    } catch (err) {
      console.error(err);
      setStatusMsg({
        type: "error",
        msg: lang === "en" ? "Failed to export Excel file." : "Lỗi khi xuất file Excel.",
      });
    } finally {
      setExportingExcel(false);
      setTimeout(() => setStatusMsg(null), 3000);
    }
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

  // Slug generator for clean file and URL paths
  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleOpenAddGallery = () => {
    setNewGalleryItem({
      title: "",
      category: "completed",
      image: "/media/completed/completed_1.jpg",
      location: "Morley, WA",
      tileType: "Porcelain 600x1200mm",
    });
    setHasCustomImage(false);
    setShowAddGalleryModal(true);
  };

  const handleGalleryTitleChange = (val: string) => {
    const slug = slugify(val);
    const fileName = slug ? `${slug}.jpg` : `${newGalleryItem.category}_1.jpg`;
    setNewGalleryItem((prev) => ({
      ...prev,
      title: val,
      image: hasCustomImage ? prev.image : `/media/${prev.category}/${fileName}`,
    }));
  };

  const handleGalleryCategoryChange = (cat: string) => {
    const slug = slugify(newGalleryItem.title);
    const fileName = slug ? `${slug}.jpg` : `${cat}_1.jpg`;
    setNewGalleryItem((prev) => ({
      ...prev,
      category: cat as any,
      image: hasCustomImage ? prev.image : `/media/${cat}/${fileName}`,
    }));
  };

  const handleUploadGalleryImage = async (file: File) => {
    setGalleryUploading(true);
    const slug = slugify(newGalleryItem.title) || "project-photo";
    const url = await uploadFile(file, newGalleryItem.category, slug);
    if (url) {
      setNewGalleryItem((prev) => ({ ...prev, image: url }));
      setHasCustomImage(true);
      setStatusMsg({
        type: "success",
        msg: lang === "en" ? "Photo uploaded and organized successfully!" : "Đã tải và lưu trữ ảnh vào đúng thư mục danh mục!",
      });
    } else {
      setStatusMsg({
        type: "error",
        msg: lang === "en" ? "Failed to upload photo." : "Lỗi khi tải ảnh lên máy chủ.",
      });
    }
    setGalleryUploading(false);
    setTimeout(() => setStatusMsg(null), 3500);
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
        setHasCustomImage(false);
        setStatusMsg({ type: "success", msg: lang === "en" ? "New project photo added to gallery!" : "Đã thêm ảnh công trình mới vào thư viện!" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: lang === "en" ? "Error adding photo to gallery." : "Lỗi thêm ảnh vào thư viện." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm(lang === "en" ? "Are you sure you want to remove this photo?" : "Bạn có chắc chắn muốn xóa hình ảnh này khỏi thư viện?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setGallery((prev) => prev.filter((item) => item.id !== id));
        setStatusMsg({ type: "success", msg: lang === "en" ? "Photo removed from gallery!" : "Đã xóa ảnh khỏi thư viện!" });
      }
    } catch (err) {
      setStatusMsg({ type: "error", msg: lang === "en" ? "Error removing photo." : "Lỗi khi xóa ảnh." });
    } finally {
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  // ─────────── UPLOAD HELPER ───────────
  const uploadFile = async (file: File, folder: string, customName?: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (customName) formData.append("customName", customName);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      return data.success ? data.url : null;
    } catch {
      return null;
    }
  };

  // ─────────── SERVICES HANDLERS ───────────
  const handleSaveServices = async (updated?: ServiceItem[]) => {
    setSaving(true);
    const payload = updated || services;
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setServices(payload);
        setEditingServiceId(null);
        setStatusMsg({ type: "success", msg: "✅ Services saved successfully!" });
      } else {
        setStatusMsg({ type: "error", msg: "❌ Failed to save services." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "❌ Network error saving services." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleUpdateServiceField = (id: string, field: keyof ServiceItem, value: string | string[]) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleMoveService = (index: number, dir: "up" | "down") => {
    const arr = [...services];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setServices(arr);
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Remove this service card? This cannot be undone.")) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUploadServiceImage = async (id: string, file: File) => {
    setServiceUploading(true);
    const url = await uploadFile(file, "services");
    if (url) {
      handleUpdateServiceField(id, "image", url);
      setStatusMsg({ type: "success", msg: "Image uploaded! Click Save to apply." });
    } else {
      setStatusMsg({ type: "error", msg: "❌ Upload failed." });
    }
    setServiceUploading(false);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleUploadHeroImage = async (file: File) => {
    setSaving(true);
    const url = await uploadFile(file, "hero");
    if (url) {
      const updated = { ...settings, heroImage: url };
      await handleSaveSettings(updated);
    } else {
      setStatusMsg({ type: "error", msg: "❌ Hero image upload failed." });
      setSaving(false);
    }
  };

  // ─────────── SECTION VISIBILITY HANDLER ───────────
  const handleToggleSection = async (key: string, value: boolean) => {
    const vis = { ...defaultSectionVisibility, ...(settings.sectionVisibility ?? {}), [key]: value };
    const updated = { ...settings, sectionVisibility: vis };
    setSettings(updated);
    await handleSaveSettings(updated);
  };

  // ─────────── TESTIMONIALS HANDLERS ───────────
  const handleSaveTestimonials = async (updated?: TestimonialItem[]) => {
    setSaving(true);
    const payload = updated || testimonials;
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials(payload);
        setEditingTestimonialId(null);
        setStatusMsg({ type: "success", msg: "✅ Testimonials saved successfully!" });
      } else {
        setStatusMsg({ type: "error", msg: "❌ Failed to save testimonials." });
      }
    } catch {
      setStatusMsg({ type: "error", msg: "❌ Network error saving testimonials." });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.comment.trim()) return;
    const item: TestimonialItem = { ...newTestimonial, id: "t-" + Date.now() };
    const updated = [...testimonials, item];
    setTestimonials(updated);
    await handleSaveTestimonials(updated);
    setNewTestimonial({ name: "", suburb: "", rating: 5, date: new Date().toLocaleDateString("en-AU", { month: "long", year: "numeric" }), comment: "", service: "" });
    setShowAddTestimonialForm(false);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    await handleSaveTestimonials(updated);
  };

  const handleUpdateTestimonialField = (id: string, field: keyof TestimonialItem, value: string | number) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  // User Management Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      role: "staff",
      status: "active",
    });
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSaving(true);
    setStatusMsg(null);

    try {
      if (editingUser) {
        const payload: any = {
          id: editingUser.id,
          name: userFormData.name,
          email: userFormData.email,
          role: userFormData.role,
          status: userFormData.status,
        };
        if (userFormData.password.trim()) {
          payload.newPassword = userFormData.password.trim();
        }

        const res = await fetch("/api/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data.data } : u)));
          setShowUserModal(false);
          setStatusMsg({ type: "success", msg: lang === "en" ? "User account updated successfully!" : "Đã cập nhật thông tin tài khoản thành công!" });
        } else {
          setStatusMsg({ type: "error", msg: data.error || (lang === "en" ? "Failed to update account." : "Lỗi cập nhật tài khoản.") });
        }
      } else {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userFormData),
        });
        const data = await res.json();
        if (data.success) {
          setUsers((prev) => [data.data, ...prev]);
          setShowUserModal(false);
          setStatusMsg({ type: "success", msg: lang === "en" ? "New user account created successfully!" : "Đã tạo tài khoản người dùng mới thành công!" });
        } else {
          setStatusMsg({ type: "error", msg: data.error || (lang === "en" ? "Failed to create account." : "Lỗi tạo tài khoản mới.") });
        }
      }
    } catch {
      setStatusMsg({ type: "error", msg: lang === "en" ? "Connection error saving user." : "Lỗi kết nối khi lưu tài khoản." });
    } finally {
      setUserSaving(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(lang === "en" ? `Are you sure you want to delete account "${user.username}"?` : `Bạn có chắc chắn muốn xóa tài khoản "${user.username}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/users?id=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setStatusMsg({ type: "success", msg: lang === "en" ? "Account deleted." : "Đã xóa tài khoản." });
      } else {
        setStatusMsg({ type: "error", msg: data.error || (lang === "en" ? "Cannot delete account." : "Không thể xóa tài khoản.") });
      }
    } catch {
      setStatusMsg({ type: "error", msg: lang === "en" ? "Network error deleting account." : "Lỗi kết nối khi xóa tài khoản." });
    } finally {
      setTimeout(() => setStatusMsg(null), 4000);
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

  // Filter Leads by Search, Status and Date Range (day/week/month/year)
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.includes(leadSearch) ||
      lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.suburb.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "all" || lead.status === leadStatusFilter;

    // Date range filter: Ngày (Today), Tuần (Week), Tháng (Month), Năm (Year)
    let matchesDate = true;
    if (dateRangeFilter !== "all") {
      const rawDate = lead.createdAt || "";
      // storage.ts saves UTC as "YYYY-MM-DD HH:mm" (no Z) → append Z so it isn't parsed as local time
      const normalizedDate = rawDate.includes("T") ? rawDate : rawDate.replace(" ", "T") + "Z";
      let leadDate = new Date(normalizedDate).getTime();
      if (isNaN(leadDate)) leadDate = new Date(rawDate).getTime();

      if (!isNaN(leadDate) && leadDate > 0) {
        const now = new Date();
        if (dateRangeFilter === "today") {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          matchesDate = leadDate >= startOfDay;
        } else if (dateRangeFilter === "week") {
          const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
          matchesDate = leadDate >= weekAgo;
        } else if (dateRangeFilter === "month") {
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          matchesDate = leadDate >= startOfMonth;
        } else if (dateRangeFilter === "year") {
          const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
          matchesDate = leadDate >= startOfYear;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
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
    <div className="h-screen w-screen overflow-hidden bg-slate-100 flex text-slate-900 font-sans antialiased">
      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800 select-none h-full overflow-hidden">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-[6px] bg-white p-1 border border-slate-200/20 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Image
                src="/logo.png"
                alt="LV Tiling Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight uppercase leading-none text-white">
                LV Tiling
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase leading-tight mt-1 text-[#dc2626]">
                Perth Master Tilers
              </span>
            </div>
          </div>
        </div>

        {/* Language Switcher Bar */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-medium">{lang === "en" ? "Language" : "Ngôn ngữ"}:</span>
          </div>
          <div className="flex items-center bg-slate-800 p-0.5 rounded-[5px] border border-slate-700/60">
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-[4px] transition-all ${
                lang === "en"
                  ? "bg-[#dc2626] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("vi")}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded-[4px] transition-all ${
                lang === "vi"
                  ? "bg-[#dc2626] text-white shadow-xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              VI
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav data-lenis-prevent className="flex-1 p-3 space-y-5 overflow-y-auto no-scrollbar">
          {/* Group 1: OVERVIEW */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "en" ? "Overview" : "Tổng Quan"}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{lang === "en" ? "Dashboard" : "Bảng điều khiển"}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 2: LEADS & QUOTES */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "en" ? "Customer Quotes" : "Khách hàng & Báo giá"}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("leads")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "leads"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4" />
                  <span>{lang === "en" ? "Quote Inquiries" : "Danh sách Báo giá"}</span>
                </div>
                {newLeadsCount > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-[4px] ${
                      activeTab === "leads" ? "bg-white text-[#dc2626]" : "bg-[#dc2626] text-white"
                    }`}
                  >
                    {newLeadsCount} {lang === "en" ? "new" : "mới"}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Group 3: INSTANT NOTIFICATIONS */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "en" ? "Instant Alerts" : "Thông Báo Tức Thì"}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("notifications-email")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "notifications-email"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4" />
                  <span>{lang === "en" ? "2-Way Email (SMTP)" : "Email 2 Chiều (Khuyên dùng)"}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("notifications-sheets")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "notifications-sheets"
                    ? "bg-[#dc2626] text-white font-bold"
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

          {/* Group 4: BUSINESS INFO & MEDIA */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "en" ? "Settings & Media" : "Cài đặt & Thư viện"}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("settings-general")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "settings-general"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Settings className="w-4 h-4" />
                  <span>{lang === "en" ? "Hotline & Business Info" : "Hotline & Thông tin"}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("settings-users")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "settings-users"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4" />
                  <span>{lang === "en" ? "User Accounts" : "Quản lý Tài khoản"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({users.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("cms-gallery")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-gallery"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>{lang === "en" ? "Project Gallery" : "Thư viện Dự án"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({gallery.length})</span>
              </button>
            </div>
          </div>

          {/* Group 5: CONTENT MANAGEMENT */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {lang === "en" ? "Content Management" : "Quản lý Nội dung"}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("cms-services")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-services"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Sliders className="w-4 h-4" />
                  <span>{lang === "en" ? "Services" : "Dịch vụ"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("cms-content")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-content"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Globe className="w-4 h-4" />
                  <span>{lang === "en" ? "Page Content & Hero" : "Nội dung Trang & Hero"}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("cms-visibility")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-visibility"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layout className="w-4 h-4" />
                  <span>{lang === "en" ? "Section Visibility" : "Ẩn/Hiện Section"}</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("cms-testimonials")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-semibold transition-colors ${
                  activeTab === "cms-testimonials"
                    ? "bg-[#dc2626] text-white font-bold"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{lang === "en" ? "Customer Reviews" : "Đánh giá Khách hàng"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">({testimonials.length})</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1.5">
          <a
            href="/admin-guide.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:text-amber-200 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{lang === "en" ? "User Guide & Manual" : "Hướng Dẫn Sử Dụng"}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400/80" />
          </a>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-[6px] text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{lang === "en" ? "View Live Site" : "Xem Website Ngoài"}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-[6px] text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === "en" ? "Log Out" : "Đăng xuất"}</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Sticky Header */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="font-semibold text-slate-800 capitalize">
              {activeTab === "dashboard" && (lang === "en" ? "Dashboard" : "Bảng điều khiển")}
              {activeTab === "leads" && (lang === "en" ? "Customer Quotes & Leads" : "Danh sách Báo giá Khách hàng")}
              {activeTab === "notifications-email" && (lang === "en" ? "Email Notifications (SMTP)" : "Cấu hình Email Thông Báo 2 Chiều")}
              {activeTab === "notifications-sheets" && (lang === "en" ? "Google Sheets Webhook" : "Cấu hình Google Sheets")}
              {activeTab === "settings-general" && (lang === "en" ? "Business Info & Hotline" : "Thông tin Doanh nghiệp & Hotline")}
              {activeTab === "settings-users" && (lang === "en" ? "User Accounts Management" : "Quản lý Tài khoản Quản trị & Nhân viên")}
              {activeTab === "cms-gallery" && (lang === "en" ? "Project Gallery" : "Thư viện Ảnh Dự án")}
              {activeTab === "cms-services" && (lang === "en" ? "Services Management" : "Quản lý Dịch vụ")}
              {activeTab === "cms-content" && (lang === "en" ? "Page Content & Hero Image" : "Nội dung Trang & Banner Hero")}
              {activeTab === "cms-visibility" && (lang === "en" ? "Section Visibility" : "Quản lý Ẩn/Hiện Section")}
              {activeTab === "cms-testimonials" && (lang === "en" ? "Customer Testimonials" : "Đánh giá Khách hàng")}
            </span>
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
        <main data-lenis-prevent className="flex-1 p-6 overflow-y-auto space-y-6 no-scrollbar">
          {/* ================= TAB 1: DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {lang === "en" ? "Total Quote Requests" : "Tổng đơn yêu cầu"}
                    </span>
                    <Inbox className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{leads.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                    <span className="font-semibold text-[#dc2626]">
                      {newLeadsCount} {lang === "en" ? "new leads" : "đơn mới"}
                    </span>
                    <span>{lang === "en" ? "awaiting call" : "cần gọi tư vấn"}</span>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {lang === "en" ? "Jobs Booked / Won" : "Đã chốt / Thi công"}
                    </span>
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">{bookedLeadsCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === "en" ? "Conversion rate:" : "Tỷ lệ chốt:"}{" "}
                    {leads.length ? Math.round((bookedLeadsCount / leads.length) * 100) : 0}%
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {lang === "en" ? "2-Way Email Alerts" : "Email thông báo 2 chiều"}
                    </span>
                    <Mail className="w-4 h-4 text-[#dc2626]" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {settings.emailNotificationsEnabled !== false
                      ? (lang === "en" ? "Active (Enabled)" : "Đang kích hoạt")
                      : (lang === "en" ? "Disabled" : "Đang tắt")}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {lang === "en" ? "To:" : "Đến:"} {settings.adminNotificationEmail || settings.email}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Google Sheets Sync</span>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 mt-1">
                    {settings.googleSheetWebhookUrl
                      ? (lang === "en" ? "Webhook Connected" : "Đã kết nối Webhook")
                      : (lang === "en" ? "Not Configured" : "Chưa cấu hình")}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {lang === "en" ? "Real-time sync on submit" : "Real-time khi có form submit"}
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Quick Table */}
              <div className="bg-white border border-slate-200 rounded-[6px] shadow-xs">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {lang === "en" ? "Recent Quote Inquiries" : "Yêu cầu Báo giá Gần đây nhất"}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Latest submissions from web quote form" : "Khách hàng vừa submit form trực tuyến"}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-semibold text-[#dc2626] hover:text-[#b91c1c] flex items-center space-x-1"
                  >
                    <span>{lang === "en" ? `View All (${leads.length})` : `Xem tất cả (${leads.length})`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">{lang === "en" ? "Customer" : "Khách hàng"}</th>
                        <th className="p-3">{lang === "en" ? "Phone" : "Số điện thoại"}</th>
                        <th className="p-3">{lang === "en" ? "Service" : "Dịch vụ yêu cầu"}</th>
                        <th className="p-3">{lang === "en" ? "Suburb" : "Khu vực"}</th>
                        <th className="p-3">{lang === "en" ? "Submitted At" : "Thời gian"}</th>
                        <th className="p-3">{lang === "en" ? "Status" : "Trạng thái"}</th>
                        <th className="p-3 text-right">{lang === "en" ? "Actions" : "Thao tác"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                              #LV-{lead.id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-900">{lead.name}</td>
                          <td className="p-3 font-mono text-[#dc2626] font-semibold">{lead.phone}</td>
                          <td className="p-3 text-slate-700">{lead.serviceType}</td>
                          <td className="p-3 text-slate-600">{lead.suburb}</td>
                          <td className="p-3 text-slate-500">
                            {new Date(lead.createdAt).toLocaleString(lang === "en" ? "en-AU" : "vi-VN")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${
                                lead.status === "new"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : lead.status === "contacted"
                                  ? "bg-blue-100 text-blue-800"
                                  : lead.status === "booked"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {lead.status === "new"
                                ? (lang === "en" ? "New Lead" : "Mới tiếp nhận")
                                : lead.status === "contacted"
                                ? (lang === "en" ? "Contacted" : "Đã liên hệ")
                                : lead.status === "quoted"
                                ? (lang === "en" ? "Quote Sent" : "Đã gửi báo giá")
                                : lead.status === "booked"
                                ? (lang === "en" ? "Job Booked" : "Đã chốt việc")
                                : (lang === "en" ? "Completed" : "Hoàn thành")}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-[4px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-[11px] shadow-xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{lang === "en" ? "Call" : "Gọi ngay"}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            {lang === "en"
                              ? "No customer quote requests found in database."
                              : "Chưa có yêu cầu báo giá nào trong cơ sở dữ liệu."}
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
                      placeholder={
                        lang === "en"
                          ? "Search by name, phone, email, suburb..."
                          : "Tìm theo tên, số điện thoại, email, khu vực..."
                      }
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
                    <option value="all">
                      {lang === "en" ? `All Statuses (${leads.length})` : `Tất cả trạng thái (${leads.length})`}
                    </option>
                    <option value="new">
                      {lang === "en" ? `New Leads (${newLeadsCount})` : `Mới tiếp nhận (${newLeadsCount})`}
                    </option>
                    <option value="contacted">{lang === "en" ? "Contacted" : "Đã liên hệ"}</option>
                    <option value="quoted">{lang === "en" ? "Quote Sent" : "Đã báo giá"}</option>
                    <option value="booked">
                      {lang === "en" ? `Job Booked (${bookedLeadsCount})` : `Đã chốt việc (${bookedLeadsCount})`}
                    </option>
                    <option value="completed">{lang === "en" ? "Completed" : "Hoàn thành"}</option>
                  </select>

                  {/* Time Range Filter: Ngày, Tuần, Tháng, Năm */}
                  <div className="flex items-center space-x-1 border border-slate-300 rounded-[6px] px-2 py-1 bg-white text-xs text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <select
                      value={dateRangeFilter}
                      onChange={(e) => setDateRangeFilter(e.target.value as any)}
                      className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="all">{lang === "en" ? "All Time" : "Toàn bộ thời gian"}</option>
                      <option value="today">{lang === "en" ? "Today (Day)" : "Hôm nay (Theo ngày)"}</option>
                      <option value="week">{lang === "en" ? "Past 7 Days (Week)" : "7 ngày qua (Theo tuần)"}</option>
                      <option value="month">{lang === "en" ? "This Month" : "Tháng này (Theo tháng)"}</option>
                      <option value="year">{lang === "en" ? "This Year" : "Năm nay (Theo năm)"}</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportLeadsExcel(filteredLeads)}
                    disabled={exportingExcel || filteredLeads.length === 0}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-[6px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    {exportingExcel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    <span>
                      {exportingExcel
                        ? (lang === "en" ? "Exporting..." : "Đang tạo file...")
                        : (lang === "en"
                            ? `Export Excel (${filteredLeads.length})`
                            : `Xuất Excel (${filteredLeads.length} đơn đã lọc)`)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Main Leads Table */}
              <div className="bg-white border border-slate-200 rounded-[6px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3">Ref ID</th>
                        <th className="p-3">{lang === "en" ? "Customer" : "Khách hàng"}</th>
                        <th className="p-3">{lang === "en" ? "Contact" : "Liên hệ"}</th>
                        <th className="p-3">{lang === "en" ? "Service & Suburb" : "Dịch vụ & Khu vực"}</th>
                        <th className="p-3">{lang === "en" ? "Customer Message" : "Ghi chú yêu cầu"}</th>
                        <th className="p-3">{lang === "en" ? "Received At" : "Thời gian"}</th>
                        <th className="p-3">{lang === "en" ? "Status" : "Trạng thái"}</th>
                        <th className="p-3 text-right">{lang === "en" ? "Actions" : "Thao tác"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 whitespace-nowrap">
                            <span className="font-mono font-bold px-2 py-0.5 rounded-[4px] bg-slate-900 text-white text-[11px] shadow-2xs">
                              #LV-{lead.id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{lead.name}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-bold text-[#dc2626] flex items-center space-x-1">
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
                              <div className="text-[10px] text-slate-400">
                                {lang === "en" ? "Area:" : "Diện tích:"} {lead.approxArea}
                              </div>
                            )}
                          </td>
                          <td className="p-3 max-w-xs">
                            <p className="text-slate-600 line-clamp-2 text-[11px] italic">
                              "{lead.message || (lang === "en" ? "No extra message" : "Không có ghi chú")}"
                            </p>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString(lang === "en" ? "en-AU" : "vi-VN")}
                          </td>
                          <td className="p-3">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-[11px] font-bold rounded-[4px] px-2 py-1 border focus:outline-none ${
                                lead.status === "new"
                                  ? "bg-red-50 border-red-300 text-red-800"
                                  : lead.status === "contacted"
                                  ? "bg-blue-50 border-blue-300 text-blue-800"
                                  : lead.status === "quoted"
                                  ? "bg-purple-50 border-purple-300 text-purple-800"
                                  : lead.status === "booked"
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                  : "bg-slate-100 border-slate-300 text-slate-700"
                              }`}
                            >
                              <option value="new">{lang === "en" ? "New Lead" : "Mới tiếp nhận"}</option>
                              <option value="contacted">{lang === "en" ? "Contacted" : "Đã liên hệ"}</option>
                              <option value="quoted">{lang === "en" ? "Quote Sent" : "Đã báo giá"}</option>
                              <option value="booked">{lang === "en" ? "Job Booked" : "Đã chốt việc"}</option>
                              <option value="completed">{lang === "en" ? "Completed" : "Hoàn thành"}</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="px-2.5 py-1 rounded-[4px] bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold transition-colors"
                              >
                                {lang === "en" ? "Details" : "Chi tiết"}
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1 rounded-[4px] hover:bg-red-50 text-slate-400 hover:text-red-600"
                                title={lang === "en" ? "Delete Inquiry" : "Xóa yêu cầu"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            {lang === "en"
                              ? "No matching quote inquiries found."
                              : "Không tìm thấy yêu cầu báo giá phù hợp."}
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
                  <h2>
                    {lang === "en"
                      ? "Automated 2-Way Email Notification System"
                      : "Cơ chế Thông Báo Email 2 Chiều Tự Động"}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {lang === "en"
                    ? "When a customer submits a quote form, the system immediately triggers two automated emails in parallel:"
                    : "Khi khách hàng nhấn nút gửi yêu cầu báo giá ngoài landing page, hệ thống sẽ tự động kích hoạt 2 email song song:"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-[6px]">
                    <div className="font-bold text-red-900 mb-1 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
                      <span>
                        {lang === "en"
                          ? "1. Admin Instant Alert (Business Owner)"
                          : "1. Email Gửi Đến Chủ Doanh Nghiệp (Admin Alert)"}
                      </span>
                    </div>
                    <p className="text-red-800 text-[11px]">
                      {lang === "en"
                        ? "Immediate notice with Reference ID, Name, Phone, Service, Suburb & 1-tap mobile call button."
                        : "Gửi ngay thông báo kèm Reference ID, Tên, SĐT, Dịch vụ, Địa chỉ và nút bấm gọi điện trực tiếp trên di động."}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px]">
                    <div className="font-bold text-slate-900 mb-1 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-800"></span>
                      <span>
                        {lang === "en"
                          ? "2. Customer Confirmation Email"
                          : "2. Email Gửi Cho Khách Hàng (Customer Confirmation)"}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">
                      {lang === "en"
                        ? "Professional Australian thank-you email confirming inquiry receipt & promising a callback within 15-30 mins."
                        : "Thư cảm ơn chuyên nghiệp chuẩn Úc, xác nhận đã tiếp nhận đơn và cam kết kỹ thuật viên sẽ gọi lại trong 15-30 phút."}
                    </p>
                  </div>
                </div>
              </div>

              {/* SMTP Configuration Form */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {lang === "en" ? "SMTP Server Configuration" : "Cấu hình Máy chủ Gửi Email (SMTP)"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en"
                        ? "Supports Gmail (16-char App Password) or Custom Business Email"
                        : "Hỗ trợ Gmail (Mật khẩu ứng dụng App Password) hoặc Custom Domain"}
                    </p>
                  </div>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotificationsEnabled !== false}
                      onChange={(e) =>
                        setSettings({ ...settings, emailNotificationsEnabled: e.target.checked })
                      }
                      className="rounded text-[#dc2626] focus:ring-[#dc2626]"
                    />
                    <span>
                      {lang === "en" ? "Enable automated emails" : "Bật gửi Email tự động"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en"
                        ? "Admin Notification Recipient Email"
                        : "Email Nhận Thông Báo Của Admin (Chủ Web)"}
                    </label>
                    <input
                      type="email"
                      value={settings.adminNotificationEmail || settings.email || ""}
                      onChange={(e) => setSettings({ ...settings, adminNotificationEmail: e.target.value })}
                      placeholder="lvotiling@gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {lang === "en"
                        ? "New quote requests will be delivered to this inbox."
                        : "Đơn hàng mới từ khách sẽ được gửi tới hòm thư này."}
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Sender Display Name" : "Tên Người Gửi Hiển Thị (Sender Name)"}
                    </label>
                    <input
                      type="text"
                      value={settings.emailFromName || "LV Tiling Pty Ltd"}
                      onChange={(e) => setSettings({ ...settings, emailFromName: e.target.value })}
                      placeholder="LV Tiling Pty Ltd"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "SMTP Username / Sending Email" : "Tài Khoản Gmail Gửi Đi (SMTP Username)"}
                    </label>
                    <input
                      type="email"
                      value={settings.smtpUser || ""}
                      onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                      placeholder="lvotiling.notification@gmail.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Gmail App Password (16 Characters)" : "Mật Khẩu Ứng Dụng Gmail (16 Ký Tự App Password)"}
                    </label>
                    <input
                      type="password"
                      value={settings.smtpPass || ""}
                      onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#dc2626] font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {lang === "en"
                        ? "(Generated in Google Account > Security > 2-Step Verification > App Passwords)"
                        : "(Tạo trong: Google Account > Security > 2-Step Verification > App Passwords)"}
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

                {/* Save Action */}
                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-semibold shadow-xs transition-colors w-full sm:w-auto justify-center"
                  >
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>{saving ? (lang === "en" ? "Saving..." : "Đang lưu...") : (lang === "en" ? "Save Email Settings" : "Lưu Cấu Hình Email")}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-step Gmail App Password Guide Card */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-[6px] bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {lang === "en"
                          ? "How to Generate a Gmail App Password (4 Easy Steps)"
                          : "Hướng dẫn 4 bước tạo Mật khẩu ứng dụng Gmail"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {lang === "en"
                          ? "Required by Google for secure SMTP sending without exposing your real account password"
                          : "Google bắt buộc dùng mật khẩu này để bảo vệ tài khoản của bạn"}
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-[6px] bg-red-50 hover:bg-red-100 text-[#dc2626] border border-red-200 text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    <span>{lang === "en" ? "Open Google App Passwords" : "Mở trang tạo App Passwords"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                      <span>{lang === "en" ? "Enable 2-Step Verification" : "Bật Xác minh 2 bước"}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {lang === "en" ? (
                        <>Log into your Google Account, go to <strong>Security &gt; 2-Step Verification</strong> and make sure it is turned <strong>ON</strong>.</>
                      ) : (
                        <>Đăng nhập tài khoản Google gửi mail, vào <strong>Bảo mật (Security) &gt; Xác minh 2 bước</strong> và đảm bảo đã bật.</>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                      <span>{lang === "en" ? "Access App Passwords" : "Vào mục Mật khẩu ứng dụng"}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {lang === "en" ? (
                        <>Search <em>"App passwords"</em> in your Google Account search bar or click the red button above to jump directly.</>
                      ) : (
                        <>Gõ tìm kiếm <em>"Mật khẩu ứng dụng"</em> trên thanh tìm kiếm của Google Account hoặc bấm nút màu đỏ ở góc trên.</>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                      <span>{lang === "en" ? "Name and Create Key" : "Đặt tên & Bấm Tạo"}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {lang === "en" ? (
                        <>Enter an app name like <code>LV Tiling Website</code>, then click <strong>Create</strong>. Google will generate a 16-character code.</>
                      ) : (
                        <>Nhập tên ứng dụng là <code>LV Tiling Website</code> rồi nhấn <strong>Tạo (Create)</strong>. Google sẽ cấp cho bạn một chuỗi 16 ký tự màu vàng.</>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-[6px] border border-slate-200 space-y-1.5">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-[11px] flex items-center justify-center font-bold">4</span>
                      <span>{lang === "en" ? "Paste into Admin Settings" : "Dán vào ô Mật khẩu"}</span>
                    </div>
                    <p className="text-slate-600 text-[11.5px] leading-relaxed">
                      {lang === "en" ? (
                        <>Copy the 16 characters (e.g. <code>abcd efgh ijkl mnop</code>), paste into <strong>App Password</strong> above and click <strong>Save</strong>.</>
                      ) : (
                        <>Sao chép 16 ký tự đó (vd: <code>abcd efgh ijkl mnop</code>), dán vào ô <strong>Mật Khẩu Ứng Dụng</strong> ở trên và bấm <strong>Lưu Cấu Hình</strong>.</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-[6px] flex items-start space-x-2.5 text-xs text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[11.5px] leading-relaxed">
                    {lang === "en" ? (
                      <><strong>Note:</strong> Never use your personal login password. The 16-character App Password only grants email sending rights, keeping your Google Account completely secure.</>
                    ) : (
                      <><strong>Lưu ý:</strong> Tuyệt đối không dùng mật khẩu cá nhân đăng nhập Google của bạn. Mật khẩu ứng dụng 16 ký tự chỉ cho phép gửi mail thông báo mà không lộ tài khoản chính.</>
                    )}
                  </p>
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
                    <span>
                      {lang === "en"
                        ? "Google Sheets Automatic Webhook Configuration"
                        : "Cấu hình Webhook Tự Động Điền Google Sheets"}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {lang === "en"
                      ? "When a customer submits a form, a new row is instantly appended into your Google Sheet."
                      : "Khi khách hàng gửi form, hệ thống sẽ tự động thêm 1 dòng mới vào Google Sheet của bạn."}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {lang === "en"
                        ? "Google Apps Script Webhook URL (Paste URL here)"
                        : "Google Apps Script Webhook URL (Dán URL vào đây)"}
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
                      <span>
                        {testingSheet
                          ? (lang === "en" ? "Sending..." : "Đang gửi...")
                          : (lang === "en" ? "Test Connection (Send sample row)" : "Kiểm tra kết nối (Gửi dòng mẫu)")}
                      </span>
                    </button>

                    <button
                      onClick={handleSyncAllLeadsToSheet}
                      disabled={syncingSheet || !settings.googleSheetWebhookUrl || leads.length === 0}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-[6px] bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                    >
                      {syncingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
                      <span>
                        {lang === "en"
                          ? `Sync all ${leads.length} past quote requests`
                          : `Đồng bộ toàn bộ ${leads.length} yêu cầu cũ`}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step-by-step Apps Script Guide */}
              <div className="bg-white border border-slate-200 rounded-[6px] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {lang === "en"
                        ? "5-Step Google Sheet Connection Guide"
                        : "Hướng dẫn 5 bước kết nối Google Sheet"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === "en" ? "Takes only 2 minutes for a one-time setup" : "Chỉ mất 2 phút cài đặt 1 lần duy nhất"}
                    </p>
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
                    <span>
                      {copiedCode
                        ? (lang === "en" ? "Copied code!" : "Đã copy code!")
                        : (lang === "en" ? "Copy Apps Script Code" : "Copy mã Apps Script")}
                    </span>
                  </button>
                </div>

                <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    {lang === "en" ? (
                      <>Open <strong>Google Sheets</strong> and create a new spreadsheet (e.g. <em>LV Tiling Leads</em>).</>
                    ) : (
                      <>Mở <strong>Google Sheets</strong> và tạo một bảng tính mới (đặt tên ví dụ: <em>LV Tiling Leads</em>).</>
                    )}
                  </li>
                  <li>
                    {lang === "en" ? (
                      <>On top menu, select <strong>Extensions &gt; Apps Script</strong>.</>
                    ) : (
                      <>Trên thanh menu, chọn <strong>Tiện ích mở rộng (Extensions) &gt; Apps Script</strong>.</>
                    )}
                  </li>
                  <li>
                    {lang === "en" ? (
                      <>Clear all boilerplate code inside <code>Code.gs</code>, paste the script below, and click <strong>Save (Ctrl+S)</strong>.</>
                    ) : (
                      <>Xóa toàn bộ code cũ trong file <code>Mã.gs</code>, dán đoạn mã bên dưới vào rồi bấm <strong>Lưu (Ctrl+S)</strong>.</>
                    )}
                  </li>
                  <li>
                    {lang === "en" ? (
                      <>Click <strong>Deploy &gt; New deployment</strong>.<br /><span className="text-slate-500 ml-4 font-mono text-[11px]">Type: Web app | Who has access: <strong>Anyone</strong></span></>
                    ) : (
                      <>Nhấn nút <strong>Triển khai (Deploy) &gt; Tùy chọn triển khai mới (New deployment)</strong>.<br /><span className="text-slate-500 ml-4 font-mono text-[11px]">Loại: Ứng dụng web (Web app) | Người có quyền truy cập: <strong>Bất kỳ ai (Anyone)</strong></span></>
                    )}
                  </li>
                  <li>
                    {lang === "en" ? (
                      <>Click <strong>Deploy</strong>, copy the generated <strong>Web app URL</strong>, and paste it into the Webhook box above.</>
                    ) : (
                      <>Nhấn <strong>Triển khai</strong>, copy đường link <strong>URL của ứng dụng web</strong> và dán vào ô Webhook ở trên.</>
                    )}
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
                  <h2 className="text-sm font-bold text-slate-900">
                    {lang === "en" ? "Business & Contact Information" : "Thông tin Doanh nghiệp & Liên hệ"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "en"
                      ? "Displayed across Header, Floating Widgets, Quote Form & Footer"
                      : "Các thông tin hiển thị trên Header, Contact Form và Footer"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Company / Trading Name" : "Tên Doanh Nghiệp"}
                    </label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "ABN (Australian Business Number)" : "Mã ABN"}
                    </label>
                    <input
                      type="text"
                      value={settings.abn}
                      onChange={(e) => setSettings({ ...settings, abn: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Phone Hotline (Click to call)" : "Số Hotline (Bấm gọi)"}
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none font-semibold text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "General Contact Email" : "Email Liên Hệ"}
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Physical Office / Base Address" : "Địa Chỉ Trụ Sở"}
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Facebook Page URL" : "Link Trang Facebook"}
                    </label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      {lang === "en" ? "Top Marquee Announcement Ticker" : "Nội dung Banner chữ chạy (Marquee Ticker)"}
                    </label>
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
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-white" />}
                    <span>
                      {saving
                        ? (lang === "en" ? "Saving..." : "Đang lưu...")
                        : (lang === "en" ? "Save Business Info" : "Lưu Thay Đổi Thông Tin")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5.5: QUẢN LÝ TÀI KHOẢN (USER ACCOUNTS) ================= */}
          {activeTab === "settings-users" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-[6px] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#dc2626]" />
                    <span>{lang === "en" ? "User Accounts Management" : "Quản lý Tài khoản Quản trị & Nhân viên"}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en"
                      ? "Manage team members authorized to log in, track customer leads and update website content."
                      : "Thêm thành viên trong công ty để cùng đăng nhập theo dõi danh sách khách hàng và quản lý website."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddUser}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>{lang === "en" ? "Add New User" : "Thêm Tài khoản Mới"}</span>
                </button>
              </div>

              {/* Accounts Table */}
              <div className="bg-white border border-slate-200 rounded-[6px] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">{lang === "en" ? "Member / Username" : "Thành viên / Tên đăng nhập"}</th>
                        <th className="py-3 px-4">{lang === "en" ? "Email Address" : "Email liên hệ"}</th>
                        <th className="py-3 px-4">{lang === "en" ? "Role & Access" : "Vai trò / Quyền hạn"}</th>
                        <th className="py-3 px-4">{lang === "en" ? "Status" : "Trạng thái"}</th>
                        <th className="py-3 px-4">{lang === "en" ? "Last Login" : "Đăng nhập gần nhất"}</th>
                        <th className="py-3 px-4 text-right">{lang === "en" ? "Actions" : "Thao tác"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            {lang === "en" ? "No user accounts found." : "Chưa có tài khoản người dùng nào."}
                          </td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
                                  {u.name ? u.name.charAt(0) : u.username.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{u.name}</p>
                                  <p className="font-mono text-[11px] text-slate-500">@{u.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {u.email || <span className="text-slate-400 italic">None</span>}
                            </td>
                            <td className="py-3 px-4">
                              {u.role === "admin" ? (
                                <span className="px-2 py-0.5 rounded-[4px] bg-red-50 text-red-700 font-bold text-[11px] border border-red-200 inline-flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-[#dc2626]" />
                                  <span>{lang === "en" ? "Administrator" : "Quản trị viên (Toàn quyền)"}</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200 inline-flex items-center gap-1">
                                  <User className="w-3 h-3 text-slate-500" />
                                  <span>{lang === "en" ? "Staff Member" : "Nhân viên (Xem & Xử lý Leads)"}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {u.status === "active" ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>{lang === "en" ? "Active" : "Đang hoạt động"}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[11px] border border-slate-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                  <span>{lang === "en" ? "Suspended" : "Tạm khóa"}</span>
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                              {u.lastLogin || (lang === "en" ? "Never logged in" : "Chưa đăng nhập")}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="px-2.5 py-1 rounded-[4px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  title={lang === "en" ? "Edit account" : "Sửa thông tin tài khoản"}
                                >
                                  <Edit3 className="w-3 h-3 text-slate-600" />
                                  <span>{lang === "en" ? "Edit" : "Sửa"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={u.username === "admin"}
                                  className="p-1 rounded-[4px] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                                  title={u.username === "admin" ? (lang === "en" ? "Cannot delete root admin" : "Không thể xóa tài khoản admin gốc") : (lang === "en" ? "Delete account" : "Xóa tài khoản")}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
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
                    <option value="all">
                      {lang === "en" ? `All Categories (${gallery.length})` : `Tất cả danh mục (${gallery.length})`}
                    </option>
                    <option value="completed">{lang === "en" ? "Completed Jobs" : "Công trình thực tế"}</option>
                    <option value="flashbacks">{lang === "en" ? "Flashbacks" : "Hồi tưởng & Quá trình"}</option>
                    <option value="screeding">{lang === "en" ? "Screeding & Prep" : "Cán nền & Xử lý cốt"}</option>
                    <option value="polyurethane">{lang === "en" ? "Polyurethane & Primer" : "Sơn lót & Polyurethane"}</option>
                    <option value="bandages">{lang === "en" ? "Shower Bandages" : "Băng chống thấm góc"}</option>
                    <option value="waterproof">{lang === "en" ? "Waterproofing" : "Chống thấm chuyên sâu"}</option>
                    <option value="tennax">{lang === "en" ? "Tennax Adhesive" : "Keo dán Tennax"}</option>
                  </select>
                </div>

                <button
                  onClick={handleOpenAddGallery}
                  className="flex items-center space-x-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>{lang === "en" ? "Add New Project Photo" : "Thêm Hình Ảnh Mới"}</span>
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
                            title={lang === "en" ? "Delete photo" : "Xóa hình ảnh"}
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

          {/* ============ SERVICES TAB ============ */}
          {activeTab === "cms-services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "en" ? "Services Management" : "Quản lý Dịch vụ"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en"
                      ? "Edit service cards shown on the website. Reorder using arrows. Changes only apply after clicking Save."
                      : "Chỉnh sửa danh thiếp dịch vụ hiển thị trên website. Đổi thứ tự bằng mũi tên. Thay đổi chỉ có hiệu lực sau khi bấm Lưu."}
                  </p>
                </div>
                <button
                  onClick={() => handleSaveServices()}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {lang === "en" ? "Save All Services" : "Lưu Tất Cả Dịch Vụ"}
                </button>
              </div>

              <div className="space-y-4">
                {services.map((svc, idx) => (
                  <div key={svc.id} className="bg-white border border-slate-200 rounded-[8px] overflow-hidden">
                    {/* Header row */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => handleMoveService(idx, "up")}
                          disabled={idx === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title={lang === "en" ? "Move up" : "Di chuyển lên"}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveService(idx, "down")}
                          disabled={idx === services.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title={lang === "en" ? "Move down" : "Di chuyển xuống"}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="w-6 h-6 rounded-[4px] bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{svc.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{svc.image}</p>
                      </div>
                      <button
                        onClick={() => setEditingServiceId(editingServiceId === svc.id ? null : svc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        <Edit3 className="w-3 h-3" />
                        {editingServiceId === svc.id
                          ? (lang === "en" ? "Collapse" : "Thu gọn")
                          : (lang === "en" ? "Edit" : "Chỉnh sửa")}
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="p-1.5 rounded-[6px] text-red-400 hover:bg-red-50 hover:text-red-600"
                        title={lang === "en" ? "Delete service" : "Xóa dịch vụ"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Edit form (expanded) */}
                    {editingServiceId === svc.id && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Image preview + upload */}
                        <div className="md:col-span-2 flex items-start gap-4">
                          <div className="w-24 h-20 rounded-[6px] overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                            <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <label className="block font-semibold text-slate-700">
                              {lang === "en" ? "Service Image" : "Hình ảnh dịch vụ"}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={svc.image}
                                onChange={(e) => handleUpdateServiceField(svc.id, "image", e.target.value)}
                                className="flex-1 border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs"
                                placeholder="/media/services/image.jpg"
                              />
                              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer whitespace-nowrap">
                                <Upload className="w-3.5 h-3.5" />
                                {serviceUploading
                                  ? (lang === "en" ? "Uploading..." : "Đang tải lên...")
                                  : (lang === "en" ? "Upload" : "Tải ảnh lên")}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleUploadServiceImage(svc.id, f);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Service Title *" : "Tên dịch vụ *"}
                          </label>
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => handleUpdateServiceField(svc.id, "title", e.target.value)}
                            className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Card Badge (Optional)" : "Huy hiệu nổi bật (Tùy chọn)"}
                          </label>
                          <input
                            type="text"
                            value={svc.badge || ""}
                            onChange={(e) => handleUpdateServiceField(svc.id, "badge", e.target.value)}
                            className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs"
                            placeholder="e.g. AS 3740 Certified"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Card Short Description (shown in grid)" : "Mô tả ngắn (hiển thị trên thẻ)"}
                          </label>
                          <textarea
                            value={svc.shortDesc}
                            rows={2}
                            onChange={(e) => handleUpdateServiceField(svc.id, "shortDesc", e.target.value)}
                            className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs resize-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Full Description (shown in detail view)" : "Mô tả chi tiết (xem mở rộng)"}
                          </label>
                          <textarea
                            value={svc.fullDesc}
                            rows={3}
                            onChange={(e) => handleUpdateServiceField(svc.id, "fullDesc", e.target.value)}
                            className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs resize-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Key Features (one per line)" : "Đặc điểm nổi bật (mỗi dòng 1 ý)"}
                          </label>
                          <textarea
                            value={Array.isArray(svc.features) ? svc.features.join("\n") : ""}
                            rows={4}
                            onChange={(e) => handleUpdateServiceField(svc.id, "features", e.target.value.split("\n").filter(Boolean))}
                            className="w-full border border-slate-200 rounded-[6px] px-3 py-1.5 text-xs font-mono resize-none"
                            placeholder={"Feature 1\nFeature 2\nFeature 3"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveServices()}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {lang === "en" ? "Save All Services" : "Lưu Tất Cả Dịch Vụ"}
                </button>
              </div>
            </div>
          )}

          {/* ============ CONTENT & HERO TAB ============ */}
          {activeTab === "cms-content" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {lang === "en" ? "Page Content & Hero" : "Nội Dung Trang & Banner Hero"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === "en"
                    ? "Edit the main page text content and hero background image."
                    : "Chỉnh sửa nội dung văn bản chính và hình nền banner hero ngoài trang chủ."}
                </p>
              </div>

              {/* Hero Image */}
              <div className="bg-white border border-slate-200 rounded-[8px] p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === "en" ? "Hero Background Image" : "Hình Nền Banner Hero"}
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-36 h-24 rounded-[6px] overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                    <img
                      src={settings.heroImage || "/media/completed/completed_21.jpg"}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2 text-xs">
                    <p className="text-slate-500">
                      {lang === "en"
                        ? "Current image shown in the hero banner. Upload a new image to replace it."
                        : "Hình ảnh hiện tại trên banner hero. Tải ảnh mới lên để thay thế."}
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {saving
                        ? (lang === "en" ? "Uploading..." : "Đang tải lên...")
                        : (lang === "en" ? "Upload New Hero Image" : "Tải Ảnh Hero Mới")}
                      <input
                        ref={heroFileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUploadHeroImage(f);
                        }}
                      />
                    </label>
                    {settings.heroImage && (
                      <button
                        onClick={() => handleSaveSettings({ ...settings, heroImage: "" })}
                        className="text-slate-400 hover:text-red-500 text-[11px] flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> {lang === "en" ? "Reset to default image" : "Đặt lại ảnh mặc định"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="bg-white border border-slate-200 rounded-[8px] p-5 space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-800">
                  {lang === "en" ? "Text Content" : "Nội Dung Văn Bản"}
                </h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Company Name" : "Tên Doanh Nghiệp / Công Ty"}
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Tagline (used in various sections)" : "Khẩu hiệu (Tagline thương hiệu)"}
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Announcement Bar Text" : "Nội dung thanh thông báo chạy chữ"}
                  </label>
                  <input
                    type="text"
                    value={settings.marqueeAnnouncement}
                    onChange={(e) => setSettings({ ...settings, marqueeAnnouncement: e.target.value })}
                    className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Hero Headline" : "Tiêu đề chính Hero"}
                  </label>
                  <textarea
                    value={settings.heroHeadline}
                    rows={3}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full border border-slate-200 rounded-[6px] px-3 py-2 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Hero Subheadline" : "Tiêu đề phụ Hero"}
                  </label>
                  <textarea
                    value={settings.heroSubheadline}
                    rows={3}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full border border-slate-200 rounded-[6px] px-3 py-2 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Warranty Years (e.g. 4)" : "Số năm bảo hành (ví dụ: 4)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={settings.warrantyYears}
                    onChange={(e) => setSettings({ ...settings, warrantyYears: parseInt(e.target.value) || 4 })}
                    className="w-32 border border-slate-200 rounded-[6px] px-3 py-2"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings()}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {lang === "en" ? "Save Content" : "Lưu Nội Dung"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============ SECTION VISIBILITY TAB ============ */}
          {activeTab === "cms-visibility" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {lang === "en" ? "Section Visibility Management" : "Quản lý Ẩn / Hiện Section"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === "en"
                    ? "Toggle page sections on or off. Changes are saved immediately. Sections set to OFF are hidden from visitors but preserved."
                    : "Bật hoặc tắt hiển thị các section trên trang web. Thay đổi được lưu tức thì. Section tắt sẽ ẩn khỏi người xem nhưng dữ liệu vẫn được bảo lưu."}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-[8px] divide-y divide-slate-100">
                {[
                  {
                    key: "announcementBar",
                    label: lang === "en" ? "Announcement Bar" : "Thanh chữ chạy Announcement Bar",
                    desc: lang === "en" ? "The red scrolling text bar at the very top of the page." : "Thanh thông báo đỏ chạy chữ ở vị trí cao nhất trên cùng website."
                  },
                  {
                    key: "hero",
                    label: lang === "en" ? "Hero Banner" : "Banner Hero chính",
                    desc: lang === "en" ? "The large hero image with headline and CTA buttons." : "Phần ảnh lớn đầu trang kèm tiêu đề chính và nút kêu gọi hành động."
                  },
                  {
                    key: "welcome",
                    label: lang === "en" ? "Welcome / About Us" : "Mục Giới thiệu / Welcome Us",
                    desc: lang === "en" ? "The tabbed about section below the hero." : "Phần giới thiệu công ty gồm các tab tương tác ngay dưới banner hero."
                  },
                  {
                    key: "services",
                    label: lang === "en" ? "Services Grid" : "Khu vực Dịch vụ cốt lõi (Services)",
                    desc: lang === "en" ? "The main services showcase section — the most important section." : "Khu vực giới thiệu danh sách dịch vụ ốp lát chính của doanh nghiệp."
                  },
                  {
                    key: "tradeCredentials",
                    label: lang === "en" ? "Trade Credentials" : "Tiêu chuẩn & Chứng chỉ Úc",
                    desc: lang === "en" ? "Australian Standards compliance and certification badges." : "Huy hiệu tiêu chuẩn thi công và quy chuẩn chứng nhận của Úc."
                  },
                  {
                    key: "whyChooseUs",
                    label: lang === "en" ? "Why Choose Us" : "Lý do chọn chúng tôi (Why Choose Us)",
                    desc: lang === "en" ? "Key differentiators and trust points." : "Các cam kết chất lượng, bảo hành và thế mạnh vượt trội của đội ngũ."
                  },
                  {
                    key: "testimonials",
                    label: lang === "en" ? "Customer Testimonials" : "Đánh giá Khách hàng (Testimonials)",
                    desc: lang === "en" ? "Client reviews section (can be toggled whenever ready)." : "Phần cảm nhận và đánh giá thực tế của khách hàng (bật/tắt tùy ý)."
                  },
                  {
                    key: "faq",
                    label: lang === "en" ? "FAQ Section" : "Câu hỏi thường gặp (FAQ)",
                    desc: lang === "en" ? "Frequently asked questions accordion." : "Khu vực câu hỏi và giải đáp thắc mắc của khách hàng."
                  },
                  {
                    key: "quote",
                    label: lang === "en" ? "Quote / Contact Form" : "Form Đăng ký Báo giá",
                    desc: lang === "en" ? "The free measure & quote request form." : "Biểu mẫu gửi yêu cầu đo đạc và báo giá miễn phí."
                  },
                ].map(({ key, label, desc }) => {
                  const vis = { ...defaultSectionVisibility, ...(settings.sectionVisibility ?? {}) };
                  const isOn = vis[key as keyof typeof vis];
                  return (
                    <div key={key} className="flex items-center justify-between px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => handleToggleSection(key, !isOn)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ml-4 ${
                          isOn ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {isOn ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {isOn ? (lang === "en" ? "Visible" : "Đang hiện") : (lang === "en" ? "Hidden" : "Đang ẩn")}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 text-xs text-amber-800">
                <strong>{lang === "en" ? "Note:" : "Lưu ý:"}</strong>{" "}
                {lang === "en"
                  ? "The Navigation Menu and Footer are always visible and cannot be hidden to maintain site usability."
                  : "Thanh Menu điều hướng và Footer chân trang luôn hiển thị cố định để đảm bảo cấu trúc website."}
              </div>
            </div>
          )}

          {/* ============ TESTIMONIALS TAB ============ */}
          {activeTab === "cms-testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "en" ? "Customer Testimonials" : "Đánh Giá Khách Hàng"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lang === "en"
                      ? "Manage customer reviews shown on the website. Enable the Testimonials section via Section Visibility to make them visible."
                      : "Quản lý cảm nhận của khách hàng trên website. Bật hiển thị mục Đánh giá ở phần 'Ẩn/Hiện Section' để xuất hiện ngoài trang chủ."}
                  </p>
                </div>
                <button
                  onClick={() => setShowAddTestimonialForm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === "en" ? "Add Review" : "Thêm Đánh Giá"}
                </button>
              </div>

              {/* Add form */}
              {showAddTestimonialForm && (
                <div className="bg-white border border-slate-200 rounded-[8px] p-5 space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-slate-800">
                    {lang === "en" ? "New Testimonial" : "Thêm Đánh Giá Mới"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === "en" ? "Customer Name *" : "Tên khách hàng *"}
                      </label>
                      <input
                        type="text"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === "en" ? "Suburb / Area" : "Khu vực / Suburb"}
                      </label>
                      <input
                        type="text"
                        value={newTestimonial.suburb}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, suburb: e.target.value })}
                        className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                        placeholder="Morley, WA"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === "en" ? "Service Type" : "Loại dịch vụ thi công"}
                      </label>
                      <input
                        type="text"
                        value={newTestimonial.service}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, service: e.target.value })}
                        className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                        placeholder="Bathroom Tiling"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === "en" ? "Rating" : "Số sao đánh giá"}
                      </label>
                      <select
                        value={newTestimonial.rating}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}
                        className="w-full border border-slate-200 rounded-[6px] px-3 py-2"
                      >
                        {[5, 4, 3, 2, 1].map((r) => (
                          <option key={r} value={r}>
                            {r} {lang === "en" ? "Stars" : "Sao"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">
                        {lang === "en" ? "Review Comment *" : "Nội dung nhận xét *"}
                      </label>
                      <textarea
                        value={newTestimonial.comment}
                        rows={3}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                        className="w-full border border-slate-200 rounded-[6px] px-3 py-2 resize-none"
                        placeholder={lang === "en" ? "Customer review text..." : "Nhập nhận xét của khách hàng..."}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowAddTestimonialForm(false)}
                      className="px-4 py-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      {lang === "en" ? "Cancel" : "Hủy"}
                    </button>
                    <button
                      onClick={handleAddTestimonial}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                      {lang === "en" ? "Save Review" : "Lưu Đánh Giá"}
                    </button>
                  </div>
                </div>
              )}

              {/* List */}
              <div className="space-y-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white border border-slate-200 rounded-[8px] overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{t.name}</p>
                          <span className="text-[11px] text-slate-500">{t.suburb}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                          ))}
                          <span className="text-[11px] text-slate-400 ml-1">{t.service} · {t.date}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingTestimonialId(editingTestimonialId === t.id ? null : t.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                      >
                        <Edit3 className="w-3 h-3" />
                        {editingTestimonialId === t.id
                          ? (lang === "en" ? "Collapse" : "Thu gọn")
                          : (lang === "en" ? "Edit" : "Sửa")}
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-1.5 rounded-[6px] text-red-400 hover:bg-red-50 hover:text-red-600"
                        title={lang === "en" ? "Delete review" : "Xóa nhận xét"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {editingTestimonialId === t.id && (
                      <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Customer Name" : "Tên khách hàng"}
                          </label>
                          <input type="text" value={t.name} onChange={(e) => handleUpdateTestimonialField(t.id, "name", e.target.value)} className="w-full border border-slate-200 rounded-[6px] px-3 py-2" />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Suburb / Area" : "Khu vực / Suburb"}
                          </label>
                          <input type="text" value={t.suburb} onChange={(e) => handleUpdateTestimonialField(t.id, "suburb", e.target.value)} className="w-full border border-slate-200 rounded-[6px] px-3 py-2" />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Service Type" : "Loại dịch vụ thi công"}
                          </label>
                          <input type="text" value={t.service} onChange={(e) => handleUpdateTestimonialField(t.id, "service", e.target.value)} className="w-full border border-slate-200 rounded-[6px] px-3 py-2" />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Rating" : "Số sao đánh giá"}
                          </label>
                          <select value={t.rating} onChange={(e) => handleUpdateTestimonialField(t.id, "rating", parseInt(e.target.value))} className="w-full border border-slate-200 rounded-[6px] px-3 py-2">
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} {lang === "en" ? "Stars" : "Sao"}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block font-semibold text-slate-700 mb-1">
                            {lang === "en" ? "Review Comment" : "Nội dung nhận xét"}
                          </label>
                          <textarea value={t.comment} rows={3} onChange={(e) => handleUpdateTestimonialField(t.id, "comment", e.target.value)} className="w-full border border-slate-200 rounded-[6px] px-3 py-2 resize-none" />
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <button onClick={() => handleSaveTestimonials()} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold disabled:opacity-50">
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            {lang === "en" ? "Save Reviews" : "Lưu Đánh Giá"}
                          </button>
                        </div>
                      </div>
                    )}

                    {editingTestimonialId !== t.id && (
                      <div className="px-4 py-3 text-xs text-slate-600 italic">&quot;{t.comment}&quot;</div>
                    )}
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
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold px-2 py-0.5 rounded-[4px] bg-slate-900 text-white text-xs">
                    #LV-{selectedLead.id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {lang === "en" ? "Quote Request Details" : "Chi tiết Yêu cầu Báo giá"}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(selectedLead.createdAt).toLocaleString(lang === "en" ? "en-AU" : "vi-VN")}
                </p>
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
                  <span className="text-slate-500 font-medium">
                    {lang === "en" ? "Customer Name:" : "Khách hàng:"}
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{selectedLead.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">
                    {lang === "en" ? "Phone Number:" : "Số điện thoại:"}
                  </span>
                  <p className="font-bold text-[#dc2626] text-sm font-mono">{selectedLead.phone}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Email:</span>
                  <p className="font-semibold text-slate-800">
                    {selectedLead.email || (lang === "en" ? "None provided" : "Không có")}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">
                    {lang === "en" ? "Suburb / Area:" : "Khu vực / Suburb:"}
                  </span>
                  <p className="font-semibold text-slate-800">{selectedLead.suburb || "Perth"}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">
                    {lang === "en" ? "Requested Service:" : "Dịch vụ yêu cầu:"}
                  </span>
                  <p className="font-semibold text-slate-800">{selectedLead.serviceType}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">
                    {lang === "en" ? "Estimated Area:" : "Diện tích ước tính:"}
                  </span>
                  <p className="font-semibold text-slate-800">
                    {selectedLead.approxArea || (lang === "en" ? "Unspecified" : "Chưa xác định")}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  {lang === "en" ? "Detailed Notes / Message:" : "Ghi chú chi tiết:"}
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px] text-slate-700 italic">
                  &quot;{selectedLead.message || (lang === "en" ? "No additional notes" : "Không có ghi chú thêm")}&quot;
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  {lang === "en" ? "Update Status:" : "Cập nhật trạng thái:"}
                </span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateLeadStatus(selectedLead.id, e.target.value as any)}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-[6px] p-2 bg-white"
                >
                  <option value="new">{lang === "en" ? "New Lead" : "Mới tiếp nhận"}</option>
                  <option value="contacted">{lang === "en" ? "Contacted via phone" : "Đã liên hệ qua điện thoại"}</option>
                  <option value="quoted">{lang === "en" ? "Quote Sent" : "Đã gửi bảng báo giá"}</option>
                  <option value="booked">{lang === "en" ? "Job Booked" : "Đã chốt lịch thi công"}</option>
                  <option value="completed">{lang === "en" ? "Work Completed" : "Đã hoàn thành công trình"}</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <a
                href={`tel:${selectedLead.phone}`}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{lang === "en" ? "Call Customer Now" : "Gọi Điện Thoại Ngay"}</span>
              </a>

              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                {lang === "en" ? "Close" : "Đóng"}
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
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === "en" ? "Add Completed Project Photo" : "Thêm Ảnh Công Trình Thực Tế"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddGalleryModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "1. Project Category" : "1. Hạng mục công trình"}
                </label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => handleGalleryCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                >
                  <option value="completed">{lang === "en" ? "Completed Jobs" : "Công trình thực tế"}</option>
                  <option value="flashbacks">{lang === "en" ? "Flashbacks" : "Hồi tưởng & Quá trình"}</option>
                  <option value="screeding">{lang === "en" ? "Screeding & Prep" : "Cán nền & Xử lý cốt"}</option>
                  <option value="polyurethane">{lang === "en" ? "Polyurethane & Primer" : "Sơn lót & Polyurethane"}</option>
                  <option value="bandages">{lang === "en" ? "Shower Bandages" : "Băng chống thấm góc"}</option>
                  <option value="waterproof">{lang === "en" ? "Waterproofing" : "Chống thấm chuyên sâu"}</option>
                  <option value="tennax">{lang === "en" ? "Tennax Adhesive" : "Keo dán Tennax"}</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  📁 {lang === "en" ? "Folder destination:" : "Thư mục lưu trữ:"}{" "}
                  <span className="font-mono text-slate-700 font-semibold">/media/{newGalleryItem.category}/</span>
                </p>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "2. Project Title / Description *" : "2. Tên công trình / Tiêu đề *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={lang === "en" ? "e.g. Luxury Ensuite Renovation" : "Ví dụ: Luxury Ensuite Renovation"}
                  value={newGalleryItem.title}
                  onChange={(e) => handleGalleryTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] focus:outline-none focus:ring-1 focus:ring-[#dc2626]"
                />
                {newGalleryItem.title && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    🏷️ {lang === "en" ? "Auto-generated file slug:" : "Tên file tự động:"}{" "}
                    <span className="font-mono text-slate-700 font-semibold">{slugify(newGalleryItem.title)}.jpg</span>
                  </p>
                )}
              </div>

              {/* Upload & Image Preview Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[6px] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    {lang === "en" ? "3. Project Image" : "3. Hình ảnh công trình"}
                  </span>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-xs">
                    {galleryUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>
                      {galleryUploading
                        ? (lang === "en" ? "Uploading..." : "Đang tải ảnh...")
                        : (lang === "en" ? "Upload from device" : "Tải ảnh từ máy tính")}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={galleryUploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadGalleryImage(f);
                      }}
                    />
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-20 h-16 rounded-[4px] border border-slate-200 bg-slate-100 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={newGalleryItem.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // fallback visual if path doesn't exist yet
                        (e.target as HTMLImageElement).src = "/media/completed/completed_1.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      {lang === "en" ? "Image Path / URL (Auto-syncs):" : "Đường dẫn ảnh (Tự động nhảy):"}
                    </label>
                    <input
                      type="text"
                      required
                      value={newGalleryItem.image}
                      onChange={(e) => {
                        setNewGalleryItem({ ...newGalleryItem, image: e.target.value });
                        setHasCustomImage(true);
                      }}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] font-mono text-[11px] bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      {hasCustomImage
                        ? (lang === "en" ? "✓ Custom / uploaded file linked" : "✓ Đã liên kết ảnh tải lên")
                        : (lang === "en" ? "Auto-synced with category folder & title slug" : "Tự động nhảy theo thư mục hạng mục và slug tên công trình")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Tile Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Location (Suburb, WA)" : "Địa điểm (Khu vực)"}
                  </label>
                  <input
                    type="text"
                    placeholder="Morley, WA"
                    value={newGalleryItem.location}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-[6px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Tile Type" : "Loại gạch thi công"}
                  </label>
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
                {lang === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                type="submit"
                disabled={galleryUploading}
                className="px-5 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              >
                {lang === "en" ? "Add Photo to Gallery" : "Thêm vào thư viện"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= USER MODAL (ADD / EDIT) ================= */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveUser}
            className="bg-white rounded-[6px] max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-[#dc2626]" />
                <span>
                  {editingUser
                    ? (lang === "en" ? `Edit User: ${editingUser.username}` : `Chỉnh sửa tài khoản: ${editingUser.username}`)
                    : (lang === "en" ? "Add New Team Member" : "Thêm Tài khoản Thành viên Mới")}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "Full Name / Display Name *" : "Họ và tên / Tên hiển thị *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A hoặc Quản lý công trình"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "Username (for Login) *" : "Tên đăng nhập (Username) *"}
                </label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  placeholder="ví dụ: staff1, accountant, manager"
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] font-mono focus:outline-none focus:border-[#dc2626] disabled:bg-slate-100 disabled:text-slate-500"
                />
                {editingUser && (
                  <span className="text-[10px] text-slate-400 italic">
                    {lang === "en" ? "Username cannot be changed after creation." : "Tên đăng nhập không thể thay đổi sau khi tạo."}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {lang === "en" ? "Email Address (Optional)" : "Email liên hệ (Tùy chọn)"}
                </label>
                <input
                  type="email"
                  placeholder="staff@lvtiling.com.au"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {editingUser
                    ? (lang === "en" ? "New Password (Leave blank to keep current)" : "Mật khẩu mới (Để trống nếu giữ nguyên)")
                    : (lang === "en" ? "Password (at least 6 characters) *" : "Mật khẩu đăng nhập (tối thiểu 6 ký tự) *")}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? "••••••••" : "Nhập mật khẩu an toàn"}
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-[6px] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Role & Permissions" : "Quyền hạn"}
                  </label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-white font-medium focus:outline-none focus:border-[#dc2626]"
                  >
                    <option value="staff">{lang === "en" ? "Staff (View Leads)" : "Nhân viên (Xem & Xử lý đơn)"}</option>
                    <option value="admin">{lang === "en" ? "Admin (Full Access)" : "Quản trị viên (Toàn quyền)"}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {lang === "en" ? "Status" : "Trạng thái"}
                  </label>
                  <select
                    value={userFormData.status}
                    onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-[6px] bg-white font-medium focus:outline-none focus:border-[#dc2626]"
                  >
                    <option value="active">{lang === "en" ? "Active (Normal)" : "Hoạt động bình thường"}</option>
                    <option value="inactive">{lang === "en" ? "Suspended (Locked)" : "Tạm khóa đăng nhập"}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-3.5 py-1.5 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                {lang === "en" ? "Cancel" : "Hủy"}
              </button>
              <button
                type="submit"
                disabled={userSaving}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-[6px] bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
              >
                {userSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>
                  {userSaving
                    ? (lang === "en" ? "Saving..." : "Đang lưu...")
                    : (editingUser
                        ? (lang === "en" ? "Update Account" : "Lưu Thay Đổi")
                        : (lang === "en" ? "Create Account" : "Tạo Tài Khoản"))}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
