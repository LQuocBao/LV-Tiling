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

-- 5. TABLE: services (Core Trade Services)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_desc TEXT DEFAULT '',
  full_desc TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  icon TEXT DEFAULT 'Award',
  image TEXT NOT NULL,
  badge TEXT DEFAULT '',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE: admin_users (Staff & Management Accounts)
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
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
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

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Services Full Access') THEN
    CREATE POLICY "Service Role Services Full Access" ON public.services FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service Role Users Full Access') THEN
    CREATE POLICY "Service Role Users Full Access" ON public.admin_users FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;

  -- Allow full read/write access to settings, gallery, testimonials, services, leads
  -- (All write security is enforced server-side by Next.js API route session guards)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Full Access Settings') THEN
    CREATE POLICY "Public Full Access Settings" ON public.settings FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Full Access Gallery') THEN
    CREATE POLICY "Public Full Access Gallery" ON public.gallery FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Full Access Testimonials') THEN
    CREATE POLICY "Public Full Access Testimonials" ON public.testimonials FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Full Access Services') THEN
    CREATE POLICY "Public Full Access Services" ON public.services FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Full Access Leads') THEN
    CREATE POLICY "Public Full Access Leads" ON public.leads FOR ALL TO public USING (true) WITH CHECK (true);
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
  '9be44a887289c0764ed7a8295d2ac0972825047ea7843b76802d85fb732e8333',
  'admin',
  'active',
  '2026-01-01 00:00'
)
ON CONFLICT (username) DO NOTHING;
