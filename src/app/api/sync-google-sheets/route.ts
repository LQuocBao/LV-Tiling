import { NextResponse } from "next/server";
import { getLeadsAsync, getSettingsAsync } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const settings = await getSettingsAsync();
    const webhookUrl = body.webhookUrl || settings.googleSheetWebhookUrl;

    if (!webhookUrl || !webhookUrl.trim().startsWith("http")) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Google Apps Script Webhook URL (starts with https://script.google.com/...)." },
        { status: 400 }
      );
    }

    const leads = await getLeadsAsync();

    // If it's just a connection test
    if (body.action === "test" || body.test) {
      const testPayload = {
        id: "TEST-001",
        name: "Test Customer (LV Tiling Admin Test)",
        phone: "0452 612 336",
        email: "test@lvtiling.com.au",
        suburb: "Morley 6062 WA",
        serviceType: "Completed Jobs photo",
        approxArea: "20-40 m²",
        message: "This is a test submission from LV Tiling CMS.",
        status: "new",
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth" }),
      };

      const res = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `Google Apps Script returned status ${res.status}. Ensure your Web App is deployed with access set to 'Anyone'.`,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Connection successful! A test row has been added to your Google Sheet.",
      });
    }

    // Sync all leads
    let syncedCount = 0;
    for (const lead of leads) {
      await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `#LV-${lead.id.slice(-6).toUpperCase()}`,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          suburb: lead.suburb,
          serviceType: lead.serviceType,
          approxArea: lead.approxArea,
          message: lead.message,
          status: lead.status,
          createdAt: lead.createdAt,
          timestamp: new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth" }),
        }),
      }).catch((err) => console.warn("Sync lead error:", err));
      syncedCount++;
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      message: `Successfully synced ${syncedCount} leads to Google Sheets!`,
    });
  } catch (err: any) {
    console.error("Sync Google Sheets error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to communicate with Google Sheets." },
      { status: 500 }
    );
  }
}
