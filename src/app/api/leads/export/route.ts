import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const leads = body.leads || [];
    const filterLabel = body.filterLabel || "Toàn bộ";
    const lang = body.lang || "vi";

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "LV Tiling Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(lang === "en" ? "Quote Inquiries" : "Danh Sách Báo Giá", {
      views: [{ showGridLines: true }],
    });

    // 1. Title Banner (Row 1)
    sheet.mergeCells("A1:K1");
    const titleCell = sheet.getCell("A1");
    titleCell.value =
      lang === "en"
        ? "LV TILING PTY LTD — CUSTOMER QUOTE INQUIRIES REPORT"
        : "LV TILING PTY LTD — BÁO CÁO DANH SÁCH YÊU CẦU BÁO GIÁ KHÁCH HÀNG";
    titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFDC2626" }, // Brand Red
    };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };
    sheet.getRow(1).height = 36;

    // 2. Subtitle / Metadata (Row 2)
    sheet.mergeCells("A2:K2");
    const metaCell = sheet.getCell("A2");
    const nowStr = new Date().toLocaleString(lang === "en" ? "en-AU" : "vi-VN");
    metaCell.value =
      lang === "en"
        ? `Exported At: ${nowStr}   |   Time Range Filter: ${filterLabel}   |   Total Inquiries: ${leads.length}`
        : `Thời gian xuất file: ${nowStr}   |   Bộ lọc thời gian: ${filterLabel}   |   Tổng số yêu cầu: ${leads.length} đơn`;
    metaCell.font = { name: "Arial", size: 10, italic: true, color: { argb: "FF475569" } };
    metaCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    metaCell.alignment = { vertical: "middle", horizontal: "center" };
    sheet.getRow(2).height = 24;

    // Blank spacing row (Row 3)
    sheet.getRow(3).height = 10;

    // 3. Table Headers (Row 4)
    const headers =
      lang === "en"
        ? [
            "No.",
            "Ref ID",
            "Customer Name",
            "Phone Number",
            "Email Address",
            "Suburb / Area",
            "Service Requested",
            "Approx Area",
            "Status",
            "Submitted At",
            "Customer Notes / Message",
          ]
        : [
            "STT",
            "Mã đơn (Ref ID)",
            "Họ và Tên",
            "Số Điện Thoại",
            "Email",
            "Khu Vực (Suburb)",
            "Dịch Vụ Yêu Cầu",
            "Diện Tích Ước Tính",
            "Trạng Thái",
            "Thời Gian Gửi",
            "Ghi Chú Chi Tiết Của Khách",
          ];

    const headerRow = sheet.getRow(4);
    headerRow.values = headers;
    headerRow.height = 28;

    headerRow.eachCell((cell) => {
      cell.font = { name: "Arial", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0F172A" }, // Slate-900
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "FF94A3B8" } },
        left: { style: "thin", color: { argb: "FF94A3B8" } },
        bottom: { style: "medium", color: { argb: "FFDC2626" } },
        right: { style: "thin", color: { argb: "FF94A3B8" } },
      };
    });

    // 4. Data Rows
    const statusMapVi: Record<string, string> = {
      new: "Mới tiếp nhận",
      contacted: "Đã liên hệ",
      quoted: "Đã gửi báo giá",
      booked: "Đã chốt việc",
      completed: "Đã hoàn thành",
    };
    const statusMapEn: Record<string, string> = {
      new: "New Lead",
      contacted: "Contacted",
      quoted: "Quote Sent",
      booked: "Job Booked",
      completed: "Completed",
    };

    leads.forEach((l: any, idx: number) => {
      const rowNum = 5 + idx;
      const row = sheet.getRow(rowNum);

      let formattedDate = l.createdAt || "";
      if (l.createdAt) {
        const norm = l.createdAt.includes("T") ? l.createdAt : l.createdAt.replace(" ", "T") + "Z";
        const d = new Date(norm);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleString(lang === "en" ? "en-AU" : "vi-VN");
        }
      }

      const st = lang === "en" ? statusMapEn[l.status] || l.status : statusMapVi[l.status] || l.status;

      const refId = l.id ? `#LV-${l.id.slice(-6).toUpperCase()}` : "";

      row.values = [
        idx + 1,
        refId,
        l.name || "",
        String(l.phone || ""),
        l.email || (lang === "en" ? "None" : "Không có"),
        l.suburb || "Perth",
        l.serviceType || "",
        l.approxArea || (lang === "en" ? "Unspecified" : "Chưa xác định"),
        st,
        formattedDate,
        l.message || (lang === "en" ? "None" : "Không có ghi chú thêm"),
      ];

      row.height = 24;
      const isEven = idx % 2 === 0;
      const rowBg = isEven ? "FFFFFFFF" : "FFF8FAFC"; // subtle zebra striping

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: "Arial", size: 10, color: { argb: "FF1E293B" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowBg },
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };

        if (colNumber === 1) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else if (colNumber === 2) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = { name: "Consolas", size: 9.5, bold: true, color: { argb: "FF334155" } };
        } else if (colNumber === 3) {
          cell.alignment = { vertical: "middle", horizontal: "left" };
          cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FF0F172A" } };
        } else if (colNumber === 4) {
          // Explicit text format so Excel NEVER converts phone numbers into scientific notation (7.86E+08)
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.numFmt = "@";
          cell.font = { name: "Consolas", size: 10, bold: true, color: { argb: "FFDC2626" } };
        } else if (colNumber === 8) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        } else if (colNumber === 9) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = {
            name: "Arial",
            size: 9.5,
            bold: true,
            color: {
              argb: l.status === "booked" ? "FF16A34A" : l.status === "new" ? "FFDC2626" : "FF334155",
            },
          };
        } else if (colNumber === 10) {
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.numFmt = "@";
        } else {
          cell.alignment = { vertical: "middle", horizontal: "left" };
        }
      });
    });

    // 5. Spacious, customized column widths so no text is clipped and dates never show '########'
    sheet.columns = [
      { width: 7 },   // STT
      { width: 18 },  // Ref ID
      { width: 24 },  // Customer Name
      { width: 20 },  // Phone (wide, styled, unclipped)
      { width: 28 },  // Email
      { width: 20 },  // Suburb
      { width: 26 },  // Service
      { width: 18 },  // Approx Area
      { width: 20 },  // Status
      { width: 24 },  // Submitted At (wide enough, no ###)
      { width: 44 },  // Customer Message
    ];

    // Generate binary buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="LVTiling_Leads_${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  } catch (err: any) {
    console.error("Export Excel error:", err);
    return NextResponse.json({ success: false, error: "Failed to generate Excel file" }, { status: 500 });
  }
}
