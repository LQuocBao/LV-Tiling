import { NextResponse } from "next/server";
import { getServiceSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "EXISTS" : "MISSING";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? "EXISTS" : "MISSING";

  const diagnostics: any = {
    isSupabaseConfigured,
    env: {
      url,
      anonKey,
      serviceKey,
    },
  };

  const supabase = getServiceSupabase();
  if (!supabase) {
    diagnostics.status = "Supabase client not initialized (missing URL or Keys)";
    return NextResponse.json(diagnostics);
  }

  try {
    const { data, error } = await supabase.from("leads").select("*").limit(5);
    diagnostics.leadsQuery = {
      success: !error,
      error: error ? { message: error.message, details: error.details, code: error.code } : null,
      count: data ? data.length : 0,
    };

    // Test inserting a lead
    const testId = "diag-" + Date.now();
    const { error: insertError } = await supabase.from("leads").insert({
      id: testId,
      name: "Supabase Connection Verification",
      phone: "0452612336",
      email: "verify@lvtiling.com.au",
      suburb: "Perth",
      service_type: "Diagnostic Test",
      status: "new",
    });

    diagnostics.insertTest = {
      success: !insertError,
      error: insertError ? { message: insertError.message, details: insertError.details, code: insertError.code } : null,
    };

    if (!insertError) {
      // Clean up the test row
      await supabase.from("leads").delete().eq("id", testId);
    }
  } catch (err: any) {
    diagnostics.exception = {
      message: err.message,
      stack: err.stack,
    };
  }

  return NextResponse.json(diagnostics);
}
