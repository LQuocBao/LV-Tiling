import { NextResponse } from "next/server";
import { addLeadAsync, getLeadsAsync, getSettingsAsync } from "@/lib/storage";
import {
  checkRateLimit,
  getClientIp,
  isDuplicateLead,
  isRateLimited,
  recordHit,
  verifyChallenge,
  MAX_FAILED_CHALLENGES,
} from "@/lib/antiSpam";

const reject = (message: string, status = 400, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ success: false, error: message, message, ...extra }, { status });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, suburb, serviceType, approxArea, message } = body;
    const { website, captchaToken, captchaAnswer } = body;
    const ip = getClientIp(request);

    // Layer 1 – Honeypot: real users never see/fill "website". Pretend success so bots don't adapt.
    if (typeof website === "string" && website.trim() !== "") {
      console.warn(`[anti-spam] Honeypot triggered from ${ip}`);
      return NextResponse.json({ success: true, message: "Thank you! Your quote request has been received." });
    }

    // Brute-force guard on the security question
    if (isRateLimited(`fail:${ip}`, MAX_FAILED_CHALLENGES)) {
      return reject("Too many failed attempts. Please wait 10 minutes or call us directly on 0452 612 336.", 429);
    }

    // Layers 2–4 – Time trap + signed math challenge + one-time token
    const challenge = verifyChallenge(captchaToken, captchaAnswer);
    if (!challenge.ok) {
      recordHit(`fail:${ip}`);
      return reject(challenge.reason, 400, { field: "captcha", refreshCaptcha: true });
    }

    if (!name || !phone || !email) {
      return reject("Name, Phone number, and Email address are required.");
    }

    // Layer 5 – IP rate limit (successful submissions)
    const rate = checkRateLimit(`submit:${ip}`);
    if (!rate.ok) {
      const minutes = Math.ceil(rate.retryAfterSec / 60);
      return reject(
        `You've sent several requests recently. Please wait about ${minutes} minute(s) or call us directly on 0452 612 336.`,
        429,
        { refreshCaptcha: true }
      );
    }

    // Layer 6 – Duplicate detection: same phone/email recently submitted
    const existingLeads = await getLeadsAsync();
    if (isDuplicateLead(existingLeads, phone, email)) {
      return reject(
        "We've already received your request a few minutes ago — no need to resend. Our team will contact you shortly.",
        409,
        { duplicate: true }
      );
    }

    const newLead = await addLeadAsync({
      name: String(name).slice(0, 120),
      phone: String(phone).slice(0, 30),
      email: String(email || "").slice(0, 160),
      suburb: String(suburb || "Perth Metro").slice(0, 120),
      serviceType: String(serviceType || "General Tiling").slice(0, 120),
      approxArea: String(approxArea || "Not specified").slice(0, 120),
      message: String(message || "No extra notes provided.").slice(0, 2000),
    });

    // Asynchronously dispatch to Google Sheet Webhook if configured
    try {
      const settings = await getSettingsAsync();
      if (settings.googleSheetWebhookUrl && settings.googleSheetWebhookUrl.trim().startsWith("http")) {
        fetch(settings.googleSheetWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `#LV-${newLead.id.slice(-6).toUpperCase()}`,
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

      // Send Two-Way Email Notifications (Admin alert + Customer confirmation)
      if (settings.emailNotificationsEnabled !== false) {
        import("@/lib/email").then(async ({ sendAdminLeadNotification, sendCustomerConfirmationEmail }) => {
          try {
            await sendAdminLeadNotification(newLead, settings);
            if (newLead.email) {
              await sendCustomerConfirmationEmail(newLead, settings);
            }
          } catch (e) {
            console.error("Email notification dispatch error:", e);
          }
        });
      }
    } catch (sheetErr) {
      console.warn("Failed to check notification settings:", sheetErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your quote request has been received. Our master tiler will contact you within 2 business hours. Please check your email inbox (including Spam / Junk folder) for confirmation details.",
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
