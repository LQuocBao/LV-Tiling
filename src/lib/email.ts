import nodemailer from "nodemailer";
import { QuoteLead, SiteSettings } from "@/data/initialData";

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
  adminEmail?: string;
}

/**
 * Creates a configured Nodemailer transporter or returns null if unconfigured
 */
export function getMailTransporter(settings?: SiteSettings) {
  const host = settings?.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(settings?.smtpPort || process.env.SMTP_PORT || 465);
  const secure = port === 465;
  const user = settings?.smtpUser || process.env.SMTP_USER || "";
  const pass = settings?.smtpPass || process.env.SMTP_PASS || "";

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * 1. Send Alert Email to Admin / Business Owner
 */
export async function sendAdminLeadNotification(lead: QuoteLead, settings: SiteSettings) {
  const transporter = getMailTransporter(settings);
  const adminEmail = settings.adminNotificationEmail || settings.email || "lvotiling@gmail.com";
  const fromEmail = settings.smtpUser || adminEmail;
  const fromName = settings.emailFromName || "LV Tiling Website Notifications";

  const subject = `🚨 [ĐƠN BÁO GIÁ MỚI] ${lead.name} - ${lead.phone} (${lead.serviceType})`;

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #0f172a; color: #ffffff; padding: 24px 30px; border-bottom: 3px solid #f59e0b; }
    .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #f59e0b; letter-spacing: 0.5px; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 28px 30px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 4px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px; margin-bottom: 20px; }
    .row { display: flex; padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { width: 140px; font-weight: 600; color: #64748b; }
    .value { flex: 1; font-weight: 600; color: #0f172a; }
    .btn-group { margin-top: 24px; text-align: center; }
    .btn-call { display: inline-block; background: #d97706; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 12px 28px; border-radius: 6px; text-decoration: none; margin-right: 10px; }
    .btn-mail { display: inline-block; background: #0f172a; color: #ffffff !important; font-weight: 600; font-size: 14px; padding: 12px 20px; border-radius: 6px; text-decoration: none; }
    .footer { background: #f8fafc; padding: 16px 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LV TILING PTY LTD</h1>
      <p>Hệ thống Thông báo Yêu cầu Báo giá Trực tuyến</p>
    </div>
    <div class="content">
      <span class="badge">🔥 CÓ KHÁCH HÀNG MỚI CẦN LIÊN HỆ NGAY</span>
      
      <div class="card">
        <div class="row">
          <div class="label">👤 Họ và tên:</div>
          <div class="value">${lead.name}</div>
        </div>
        <div class="row">
          <div class="label">📞 Số điện thoại:</div>
          <div class="value" style="color: #d97706; font-size: 16px;">${lead.phone}</div>
        </div>
        <div class="row">
          <div class="label">📧 Email khách:</div>
          <div class="value">${lead.email || "Không cung cấp"}</div>
        </div>
        <div class="row">
          <div class="label">🛠 Dịch vụ yêu cầu:</div>
          <div class="value">${lead.serviceType}</div>
        </div>
        <div class="row">
          <div class="label">📍 Địa chỉ/Khu vực:</div>
          <div class="value">${lead.suburb || "Perth & Vùng lân cận"}</div>
        </div>
        <div class="row">
          <div class="label">📐 Diện tích ước tính:</div>
          <div class="value">${lead.approxArea || "Chưa xác định"}</div>
        </div>
        <div class="row">
          <div class="label">⏰ Thời gian gửi:</div>
          <div class="value">${new Date(lead.createdAt).toLocaleString("vi-VN", { timeZone: "Australia/Perth" })} (Perth Time)</div>
        </div>
      </div>

      ${
        lead.message
          ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 14px; margin-bottom: 20px;">
        <div style="font-weight: 700; color: #b45309; font-size: 13px; margin-bottom: 6px;">📝 Ghi chú yêu cầu từ khách:</div>
        <div style="font-size: 14px; color: #78350f; line-height: 1.5;">"${lead.message}"</div>
      </div>`
          : ""
      }

      <div class="btn-group">
        <a href="tel:${lead.phone}" class="btn-call">📞 GỌI CHO KHÁCH NGAY</a>
        ${lead.email ? `<a href="mailto:${lead.email}" class="btn-mail">✉️ Gửi Email</a>` : ""}
      </div>
    </div>
    <div class="footer">
      Email tự động được gửi từ hệ thống Website LV Tiling Pty Ltd · 130A Crimea street, Morley WA 6062
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.log("[EMAIL SIMULATION] Admin alert prepared (SMTP not configured):", {
      to: adminEmail,
      subject,
      customer: lead.name,
      phone: lead.phone,
    });
    return { success: true, simulated: true, message: "SMTP credentials not provided. Email notification logged to server." };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      replyTo: lead.email || undefined,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EMAIL ERROR] Failed to send admin alert email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. Send Professional Confirmation / Thank You Email to Customer
 */
export async function sendCustomerConfirmationEmail(lead: QuoteLead, settings: SiteSettings) {
  if (!lead.email || !lead.email.includes("@")) {
    return { success: false, message: "No valid customer email provided" };
  }

  const transporter = getMailTransporter(settings);
  const fromEmail = settings.smtpUser || settings.email || "lvotiling@gmail.com";
  const fromName = settings.emailFromName || "LV Tiling Pty Ltd";

  const subject = `✅ Quote Request Received - LV Tiling Pty Ltd (${lead.serviceType})`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 32px 30px; text-align: center; border-bottom: 4px solid #d97706; }
    .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #f59e0b; letter-spacing: 1px; }
    .header p { margin: 0; font-size: 13px; color: #94a3b8; letter-spacing: 0.5px; }
    .content { padding: 32px 30px; }
    .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
    .highlight-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 16px; margin: 20px 0; color: #065f46; font-size: 14px; }
    .summary-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .summary-table td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    .summary-table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
    .summary-table td.value { font-weight: 600; color: #0f172a; }
    .contact-card { background: #0f172a; color: #ffffff; border-radius: 6px; padding: 20px; text-align: center; margin-top: 28px; }
    .contact-card h4 { margin: 0 0 6px 0; color: #f59e0b; font-size: 16px; font-weight: 700; }
    .contact-card p { margin: 0 0 14px 0; font-size: 13px; color: #cbd5e1; }
    .phone-btn { display: inline-block; background: #d97706; color: #ffffff !important; font-size: 15px; font-weight: 700; padding: 10px 24px; border-radius: 6px; text-decoration: none; }
    .guarantee-badges { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
    .guarantee-badges span { display: inline-block; margin: 4px 8px; font-weight: 600; color: #334155; }
    .footer { background: #f8fafc; padding: 20px 30px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LV TILING PTY LTD</h1>
      <p>ARCHITECTURAL & RESIDENTIAL TILING SPECIALISTS · PERTH WA</p>
    </div>
    <div class="content">
      <div class="greeting">Hello ${lead.name},</div>
      <p style="margin-top: 0;">Thank you for getting in touch with <strong>LV Tiling Pty Ltd</strong>. We have successfully received your project specifications and assigned your request to our priority queue.</p>
      
      <div class="highlight-box">
        <strong>⚡ What happens next?</strong><br>
        Our lead tradesman will review your scope and contact you via phone (<strong>${lead.phone}</strong>) within <strong>15–30 minutes</strong> to discuss your layout, scheduling, and tailored quote.
      </div>

      <h3 style="font-size: 15px; color: #0f172a; margin: 24px 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">Summary of Your Quote Request</h3>
      <table class="summary-table">
        <tr>
          <td class="label">Trade Service</td>
          <td class="value">${lead.serviceType}</td>
        </tr>
        <tr>
          <td class="label">Location / Suburb</td>
          <td class="value">${lead.suburb || "Perth Metro Area"}</td>
        </tr>
        ${
          lead.approxArea
            ? `<tr>
          <td class="label">Approximate Area</td>
          <td class="value">${lead.approxArea}</td>
        </tr>`
            : ""
        }
        ${
          lead.message
            ? `<tr>
          <td class="label">Your Project Notes</td>
          <td class="value">${lead.message}</td>
        </tr>`
            : ""
        }
        <tr>
          <td class="label">Reference ID</td>
          <td class="value">#LV-${lead.id.slice(-6).toUpperCase()}</td>
        </tr>
      </table>

      <div class="contact-card">
        <h4>Need Urgent Assistance or On-Site Assessment?</h4>
        <p>You can speak directly with our head project specialist right away.</p>
        <a href="tel:${settings.phone || "0452612336"}" class="phone-btn">📞 Call Directly: ${settings.phone || "0452 612 336"}</a>
      </div>

      <div class="guarantee-badges">
        <span>🛡️ 4-Year Workmanship Warranty</span> • 
        <span>📜 AS 3740 & AS 3958.1 Certified</span> • 
        <span>🏢 ABN 84 629 140 821</span>
      </div>
    </div>
    
    <div class="footer">
      <strong>LV Tiling Pty Ltd</strong><br>
      ${settings.address || "130A Crimea street Morley 6062 WA"} · Phone: ${settings.phone || "0452 612 336"}<br>
      Licensed & Insured Western Australian Tiling Contractor
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.log("[EMAIL SIMULATION] Customer confirmation prepared (SMTP not configured):", {
      to: lead.email,
      subject,
      customer: lead.name,
    });
    return { success: true, simulated: true, message: "SMTP credentials not provided. Customer confirmation logged." };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: lead.email,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[EMAIL ERROR] Failed to send customer confirmation email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 3. Send Test Email to Verify SMTP Configuration
 */
export async function sendTestEmail(targetEmail: string, settings: SiteSettings) {
  const transporter = getMailTransporter(settings);
  if (!transporter) {
    return { success: false, error: "Missing SMTP User or Password in settings." };
  }

  const fromEmail = settings.smtpUser || settings.email || "lvotiling@gmail.com";
  const fromName = settings.emailFromName || "LV Tiling System";

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: targetEmail,
      subject: `🧪 [TEST THÀNH CÔNG] Kiểm tra kết nối Email LV Tiling`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 500px;">
          <h2 style="color: #059669; margin-top: 0;">🎉 Kết nối Email SMTP Thành Công!</h2>
          <p>Hệ thống gửi email thông báo 2 chiều của <strong>LV Tiling Pty Ltd</strong> đã hoạt động chính xác.</p>
          <ul style="color: #334155; line-height: 1.6;">
            <li><strong>SMTP Server:</strong> ${settings.smtpHost || "smtp.gmail.com"}</li>
            <li><strong>Tài khoản gửi:</strong> ${settings.smtpUser}</li>
            <li><strong>Email nhận test:</strong> ${targetEmail}</li>
            <li><strong>Thời gian kiểm tra:</strong> ${new Date().toLocaleString("vi-VN")}</li>
          </ul>
          <p style="color: #64748b; font-size: 13px;">Từ bây giờ, mỗi khi khách hàng gửi form, bạn sẽ nhận được thông báo ngay lập tức và khách hàng sẽ nhận được thư xác nhận cảm ơn.</p>
        </div>
      `,
    });
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
