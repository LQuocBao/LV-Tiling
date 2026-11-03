import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettingsAsync, saveSettingsAsync } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const settings = await getSettingsAsync();
  const user = await getSessionUser(request);

  // If not admin, mask/omit sensitive email & SMTP credentials
  const safeSettings = {
    ...settings,
    smtpPass: user?.role === "admin" && settings.smtpPass ? "••••••••" : "",
    ...(user ? {} : { smtpUser: "", adminNotificationEmail: "" }),
  };

  return NextResponse.json({ success: true, settings: safeSettings, data: safeSettings });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const current = await getSettingsAsync();
    
    // Preserve existing smtpPass if body has masked "••••••••", empty or omitted password
    const isMaskedOrEmpty =
      !body.smtpPass ||
      body.smtpPass === "••••••••" ||
      body.smtpPass.trim() === "";

    const payload = {
      ...current,
      ...body,
      smtpPass: isMaskedOrEmpty ? current.smtpPass : body.smtpPass,
    };

    const updated = await saveSettingsAsync(payload);
    revalidatePath("/");

    const safeResponseSettings = {
      ...updated,
      smtpPass: updated.smtpPass ? "••••••••" : "",
    };

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: safeResponseSettings,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 400 });
  }
}
