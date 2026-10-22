-- ====================================================================
-- LV TILING PTY LTD — SUPABASE DATABASE & STORAGE SCHEMA
-- Run this script in your Supabase SQL Editor (1-Click Setup)
-- ====================================================================

-- 1. TABLE: leads (Customer Quote Requests)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  suburb TEXT DEFAULT '',
  service_type TEXT DEFAULT '',
  approx_area TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLE: settings (Site Configuration & Hero Content)
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE: gallery (Project Portfolio Items)
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  location TEXT DEFAULT '',
  tile_type TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE: testimonials (Customer Reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  suburb TEXT DEFAULT '',
  rating INTEGER DEFAULT 5,
  date TEXT DEFAULT '',
  comment TEXT DEFAULT '',
  service TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE: admin_users (Staff & Management Accounts)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'staff',
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT '',
  last_login TEXT
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service role (Next.js server API routes) full access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Leads Full Access') THEN
    CREATE POLICY "Service Role Leads Full Access" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Settings Full Access') THEN
    CREATE POLICY "Service Role Settings Full Access" ON public.settings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Gallery Full Access') THEN
    CREATE POLICY "Service Role Gallery Full Access" ON public.gallery FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Testimonials Full Access') THEN
    CREATE POLICY "Service Role Testimonials Full Access" ON public.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Users Full Access') THEN
    CREATE POLICY "Service Role Users Full Access" ON public.admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- Allow public read access to settings, gallery, testimonials
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Settings') THEN
    CREATE POLICY "Public Read Settings" ON public.settings FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Gallery') THEN
    CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT TO public USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Testimonials') THEN
    CREATE POLICY "Public Read Testimonials" ON public.testimonials FOR SELECT TO public USING (true);
  END IF;
END $$;

-- ====================================================================
-- STORAGE BUCKET: gallery (For Project Images & Media)
-- ====================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Gallery Bucket') THEN
    CREATE POLICY "Public Read Gallery Bucket" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'gallery');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Full Gallery Bucket Access') THEN
    CREATE POLICY "Service Role Full Gallery Bucket Access" ON storage.objects
    FOR ALL TO service_role USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

-- ====================================================================
-- DEFAULT ADMIN ACCOUNT SEED
-- Username: admin
-- Password default: lvtiling2026
-- ====================================================================

INSERT INTO public.admin_users (id, username, name, email, password_hash, role, status, created_at)
VALUES (
  'user-admin-default',
  'admin',
  'LV Tiling Master Admin',
  'lvotiling@gmail.com',
  '3a2958bb85a2105779eafe586a1005fb414c1fa0bcf9eb7f603c4f9bc26fc0e7',
  'admin',
  'active',
  '2026-01-01 00:00'
)
ON CONFLICT (username) DO NOTHING;
