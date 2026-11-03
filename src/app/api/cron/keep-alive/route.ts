import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

/**
 * Keep-Alive Cron Endpoint
 * Automatically pings Supabase once a day to prevent Free tier auto-pausing due to inactivity.
 */
export async function GET() {
  try {
    const supabase = getServiceSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        message: "Supabase client not configured",
        timestamp: new Date().toISOString(),
      });
    }

    // Perform a lightweight read to register activity in Supabase
    const { data, error } = await supabase.from("settings").select("id").limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Supabase successfully pinged! Inactivity timer reset.",
      timestamp: new Date().toISOString(),
      pingResult: data,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message || "Failed to ping Supabase",
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

