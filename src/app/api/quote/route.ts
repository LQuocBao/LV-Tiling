import { NextResponse } from "next/server";
import { addLead, getSettings } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, suburb, serviceType, approxArea, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const newLead = addLead({
      name,
      phone,
      email: email || "",
      suburb: suburb || "Perth Metro",
      serviceType: serviceType || "General Tiling",
      approxArea: approxArea || "Not specified",
      message: message || "No extra notes provided.",
    });

    // Asynchronously dispatch to Google Sheet Webhook if configured
    try {
      const settings = getSettings();
      if (settings.googleSheetWebhookUrl && settings.googleSheetWebhookUrl.trim().startsWith("http")) {
        fetch(settings.googleSheetWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: newLead.id,
            name: newLead.name,
            phone: newLead.phone,
            email: newLead.email,
            suburb: newLead.suburb,
            serviceType: newLead.serviceType,
            approxArea: newLead.approxArea,
            message: newLead.message,
            status: newLead.status,
            createdAt: newLead.createdAt,
            timestamp: new Date().toLocaleString("en-AU", { timeZone: "Australia/Perth" }),
          }),
        }).catch((err) => console.warn("Google Sheet webhook dispatch error:", err));
      }
    } catch (sheetErr) {
      console.warn("Failed to check Google Sheet settings:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your quote request has been received. Our master tiler will contact you within 2 business hours.",
      lead: newLead,
    });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quote request. Please call directly at 0452 612 336." },
      { status: 500 }
    );
  }
}
