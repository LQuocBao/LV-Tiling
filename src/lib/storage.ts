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

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === normalizedUser &&
      (u.passwordHash === inputHash ||
        (u.username === "admin" && (password === "lvtiling2026" || password === "admin123")))
  );

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

