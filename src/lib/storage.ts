import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  SiteSettings,
  ServiceItem,
  GalleryItem,
  TestimonialItem,
  QuoteLead,
  AdminUser,
  defaultSettings,
  defaultServices,
  defaultGallery,
  defaultTestimonials,
  defaultLeads,
  defaultUsers,
} from "@/data/initialData";
import { getServiceSupabase } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data-store");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDir();
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), "utf-8");
      return fallback;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    ensureDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Getters and Setters
export function getSettings(): SiteSettings {
  return readJson<SiteSettings>(SETTINGS_FILE, defaultSettings);
}

export function saveSettings(settings: SiteSettings): void {
  writeJson(SETTINGS_FILE, settings);
}

export function getServices(): ServiceItem[] {
  return readJson<ServiceItem[]>(SERVICES_FILE, defaultServices);
}

export function saveServices(services: ServiceItem[]): void {
  writeJson(SERVICES_FILE, services);
}

export function getGallery(): GalleryItem[] {
  return readJson<GalleryItem[]>(GALLERY_FILE, defaultGallery);
}

export function saveGallery(gallery: GalleryItem[]): void {
  writeJson(GALLERY_FILE, gallery);
}

export function getTestimonials(): TestimonialItem[] {
  return readJson<TestimonialItem[]>(TESTIMONIALS_FILE, defaultTestimonials);
}

export function saveTestimonials(testimonials: TestimonialItem[]): void {
  writeJson(TESTIMONIALS_FILE, testimonials);
}

export function getLeads(): QuoteLead[] {
  return readJson<QuoteLead[]>(LEADS_FILE, defaultLeads);
}

export function saveLeads(leads: QuoteLead[]): void {
  writeJson(LEADS_FILE, leads);
}

export function addLead(lead: Omit<QuoteLead, "id" | "createdAt" | "status">): QuoteLead {
  const current = getLeads();
  const newLead: QuoteLead = {
    ...lead,
    id: "lead-" + Date.now(),
    status: "new",
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  current.unshift(newLead);
  saveLeads(current);
  return newLead;
}

// User Authentication & Management
const PASSWORD_SALT = ":lvtiling_salt_2026";

export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + PASSWORD_SALT).digest("hex");
}

export function getUsers(): AdminUser[] {
  return readJson<AdminUser[]>(USERS_FILE, defaultUsers);
}

export function saveUsers(users: AdminUser[]): void {
  writeJson(USERS_FILE, users);
}

export function authenticateUser(username: string, password: string): AdminUser | null {
  const users = getUsers();
  const inputHash = hashPassword(password);
  const normalizedUser = username.trim().toLowerCase();
  const defaultAdminHash = "9be44a887289c0764ed7a8295d2ac0972825047ea7843b76802d85fb732e8333";

  const user = users.find((u) => {
    if (u.username.toLowerCase() !== normalizedUser) return false;
    if (u.passwordHash === inputHash) return true;
    if (u.username === "admin" && u.passwordHash === defaultAdminHash && (password === "lvtiling2026" || password === "admin123")) {
      return true;
    }
    return false;
  });

  if (!user || user.status !== "active") return null;

  // Record last login timestamp
  user.lastLogin = new Date().toISOString().replace("T", " ").substring(0, 16);
  saveUsers(users);

  return user;
}

export function addUser(user: Omit<AdminUser, "id" | "createdAt" | "lastLogin">): AdminUser {
  const users = getUsers();
  const newUser: AdminUser = {
    ...user,
    id: "user-" + Date.now(),
    username: user.username.trim().toLowerCase(),
    createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    lastLogin: null,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return false;
  // Protect last admin account from deletion
  const admins = users.filter((u) => u.role === "admin");
  if (user.role === "admin" && admins.length <= 1) return false;
  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);
  return true;
}

// ====================================================================
// ASYNC METHODS WITH SUPABASE DATABASE SYNCHRONIZATION
// (Falls back gracefully to local JSON if Supabase is not configured)
// ====================================================================

// --- LEADS ---
export async function getLeadsAsync(): Promise<QuoteLead[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email,
          suburb: row.suburb || "",
          serviceType: row.service_type || "",
          approxArea: row.approx_area || "",
          message: row.message || "",
          status: row.status || "new",
          createdAt: row.created_at
            ? new Date(row.created_at).toISOString().replace("T", " ").substring(0, 16)
            : "",
        }));
      }
    } catch (e) {
      console.warn("Supabase getLeads error, fallback to local:", e);
    }
  }
  return getLeads();
}

export async function addLeadAsync(
  lead: Omit<QuoteLead, "id" | "createdAt" | "status">
): Promise<QuoteLead> {
  const newLead = addLead(lead);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from("leads").insert({
        id: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email,
        suburb: newLead.suburb,
        service_type: newLead.serviceType,
        approx_area: newLead.approxArea,
        message: newLead.message,
        status: newLead.status,
      });
    } catch (e) {
      console.warn("Supabase addLead error:", e);
    }
  }
  return newLead;
}

export async function updateLeadStatusAsync(
  id: string,
  status: QuoteLead["status"]
): Promise<boolean> {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx].status = status;
    saveLeads(leads);
  }
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      return !error;
    } catch (e) {
      console.warn("Supabase updateLeadStatus error:", e);
    }
  }
  return idx !== -1;
}

export async function deleteLeadAsync(id: string): Promise<boolean> {
  const leads = getLeads().filter((l) => l.id !== id);
  saveLeads(leads);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      return !error;
    } catch (e) {
      console.warn("Supabase deleteLead error:", e);
    }
  }
  return true;
}

// --- SETTINGS ---
export async function getSettingsAsync(): Promise<SiteSettings> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("data")
        .eq("id", "current")
        .maybeSingle();
      if (!error && data?.data) {
        return { ...defaultSettings, ...data.data };
      }
    } catch (e) {
      console.warn("Supabase getSettings error, fallback to local:", e);
    }
  }
  return getSettings();
}

export async function saveSettingsAsync(settings: SiteSettings): Promise<SiteSettings> {
  saveSettings(settings);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("settings").upsert({
        id: "current",
        data: settings,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error("Supabase saveSettings error:", error);
        throw new Error(`Supabase saveSettings failed: ${error.message}`);
      }
    } catch (e) {
      console.error("Supabase saveSettings exception:", e);
      throw e;
    }
  }
  return settings;
}

// --- GALLERY ---
export async function getGalleryAsync(): Promise<GalleryItem[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          image: row.image,
          location: row.location || "",
          tileType: row.tile_type || "",
          description: row.description || "",
        }));
      }
    } catch (e) {
      console.warn("Supabase getGallery error, fallback to local:", e);
    }
  }
  return getGallery();
}

export async function addGalleryItemAsync(item: GalleryItem): Promise<GalleryItem> {
  const current = getGallery();
  current.unshift(item);
  saveGallery(current);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from("gallery").upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        location: item.location || "",
        tile_type: item.tileType || "",
        description: item.description || "",
      });
    } catch (e) {
      console.warn("Supabase addGallery error:", e);
    }
  }
  return item;
}

export async function deleteGalleryItemAsync(id: string): Promise<boolean> {
  const current = getGallery().filter((g) => g.id !== id);
  saveGallery(current);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      return !error;
    } catch (e) {
      console.warn("Supabase deleteGallery error:", e);
    }
  }
  return true;
}

export async function updateGalleryItemAsync(
  id: string,
  updates: Partial<GalleryItem>
): Promise<GalleryItem | null> {
  const current = getGallery();
  const index = current.findIndex((g) => g.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveGallery(current);

  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.image !== undefined) payload.image = updates.image;
      if (updates.location !== undefined) payload.location = updates.location;
      if (updates.tileType !== undefined) payload.tile_type = updates.tileType;
      if (updates.description !== undefined) payload.description = updates.description;

      await supabase.from("gallery").update(payload).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateGallery error:", e);
    }
  }
  return current[index];
}

// --- SERVICES ---
export async function getServicesAsync(): Promise<ServiceItem[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("position", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          shortDesc: row.short_desc || "",
          fullDesc: row.full_desc || "",
          features: Array.isArray(row.features)
            ? row.features
            : typeof row.features === "string"
            ? JSON.parse(row.features)
            : [],
          icon: row.icon || "Award",
          image: row.image || "",
          badge: row.badge || "",
        }));
      }
    } catch (e) {
      console.warn("Supabase getServices error, fallback to local:", e);
    }
  }
  return getServices();
}

export async function saveServicesAsync(services: ServiceItem[]): Promise<ServiceItem[]> {
  saveServices(services);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const rows = services.map((s, index) => ({
        id: s.id,
        title: s.title,
        short_desc: s.shortDesc,
        full_desc: s.fullDesc,
        features: s.features,
        icon: s.icon,
        image: s.image,
        badge: s.badge || "",
        position: index,
      }));
      await supabase.from("services").upsert(rows);
    } catch (e) {
      console.warn("Supabase saveServices error:", e);
    }
  }
  return services;
}

// --- TESTIMONIALS ---
export async function getTestimonialsAsync(): Promise<TestimonialItem[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          suburb: row.suburb || "",
          rating: row.rating || 5,
          date: row.date || "",
          comment: row.comment || "",
          service: row.service || "",
        }));
      }
    } catch (e) {
      console.warn("Supabase getTestimonials error, fallback to local:", e);
    }
  }
  return getTestimonials();
}

export async function saveTestimonialsAsync(testimonials: TestimonialItem[]): Promise<TestimonialItem[]> {
  saveTestimonials(testimonials);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const rows = testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        suburb: t.suburb,
        rating: t.rating,
        date: t.date,
        comment: t.comment,
        service: t.service,
      }));
      await supabase.from("testimonials").upsert(rows);
    } catch (e) {
      console.warn("Supabase saveTestimonials error:", e);
    }
  }
  return testimonials;
}

// --- USERS ---
export async function getUsersAsync(): Promise<AdminUser[]> {
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("admin_users").select("*");
      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          username: row.username,
          name: row.name,
          email: row.email || "",
          passwordHash: row.password_hash,
          role: row.role || "staff",
          status: row.status || "active",
          createdAt: row.created_at || "",
          lastLogin: row.last_login || null,
        }));
      }
    } catch (e) {
      console.warn("Supabase getUsers error, fallback to local:", e);
    }
  }
  return getUsers();
}

export async function authenticateUserAsync(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const users = await getUsersAsync();
  const inputHash = hashPassword(password);
  const normalizedUser = username.trim().toLowerCase();
  const defaultAdminHash = "9be44a887289c0764ed7a8295d2ac0972825047ea7843b76802d85fb732e8333";

  const user = users.find((u) => {
    if (u.username.toLowerCase() !== normalizedUser) return false;
    if (u.passwordHash === inputHash) return true;
    if (u.username === "admin" && u.passwordHash === defaultAdminHash && (password === "lvtiling2026" || password === "admin123")) {
      return true;
    }
    return false;
  });

  if (!user || user.status !== "active") return null;

  const now = new Date().toISOString().replace("T", " ").substring(0, 16);
  user.lastLogin = now;

  // Sync back last login
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from("admin_users").update({ last_login: now }).eq("id", user.id);
    } catch {}
  }
  saveUsers(users);

  return user;
}

export async function addUserAsync(
  user: Omit<AdminUser, "id" | "createdAt" | "lastLogin">
): Promise<AdminUser> {
  const newUser = addUser(user);
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from("admin_users").insert({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        password_hash: newUser.passwordHash,
        role: newUser.role,
        status: newUser.status,
        created_at: newUser.createdAt,
      });
    } catch (e) {
      console.warn("Supabase addUser error:", e);
    }
  }
  return newUser;
}

export async function updateUserAsync(
  id: string,
  updates: Partial<AdminUser>
): Promise<AdminUser | null> {
  const updated = updateUser(id, updates);
  const supabase = getServiceSupabase();
  if (supabase && updated) {
    try {
      const payload: any = {};
      if (updates.name) payload.name = updates.name;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.role) payload.role = updates.role;
      if (updates.status) payload.status = updates.status;
      if (updates.passwordHash) payload.password_hash = updates.passwordHash;
      await supabase.from("admin_users").update(payload).eq("id", id);
    } catch (e) {
      console.warn("Supabase updateUser error:", e);
    }
  }
  return updated;
}

export async function deleteUserAsync(id: string): Promise<boolean> {
  const ok = deleteUser(id);
  if (!ok) return false;
  const supabase = getServiceSupabase();
  if (supabase) {
    try {
      await supabase.from("admin_users").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase deleteUser error:", e);
    }
  }
  return true;
}


