import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/storage";

export async function GET() {
  const settings = getSettings();
  return NextResponse.json({ success: true, settings, data: settings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveSettings(body);
    return NextResponse.json({ success: true, message: "Settings updated successfully", settings: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 400 });
  }
}
