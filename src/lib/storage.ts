import fs from "fs";
import path from "path";
import {
  SiteSettings,
  ServiceItem,
  GalleryItem,
  TestimonialItem,
  QuoteLead,
  defaultSettings,
  defaultServices,
  defaultGallery,
  defaultTestimonials,
  defaultLeads,
} from "@/data/initialData";

const DATA_DIR = path.join(process.cwd(), "data-store");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const GALLERY_FILE = path.join(DATA_DIR, "gallery.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");

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
