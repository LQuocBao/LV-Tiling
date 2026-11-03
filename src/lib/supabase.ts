import { createClient } from "@supabase/supabase-js";

function cleanEnv(val?: string): string {
  if (!val) return "";
  let res = val.trim();
  if (
    (res.startsWith('"') && res.endsWith('"')) ||
    (res.startsWith("'") && res.endsWith("'"))
  ) {
    res = res.slice(1, -1).trim();
  }
  return res;
}

const supabaseUrl = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey =
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const supabaseServiceKey =
  cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
  cleanEnv(process.env.SUPABASE_SECRET_KEY) ||
  supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith("http") &&
  (supabaseServiceKey || supabaseAnonKey)
);

// Client-side Supabase instance (uses anon key)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side privileged Supabase instance (bypasses RLS for secure Next.js API Routes)
export const getServiceSupabase = () => {
  if (!isSupabaseConfigured) return null;
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
