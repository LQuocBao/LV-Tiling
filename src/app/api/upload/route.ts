import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 10MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder name (only allow alphanumeric, dash, underscore)
    const safeFolder = folder.replace(/[^a-zA-Z0-9\-_]/g, "") || "uploads";

    // Build destination path under /public/media/<folder>/
    const uploadDir = path.join(process.cwd(), "public", "media", safeFolder);
    await mkdir(uploadDir, { recursive: true });

    // Generate slug-based filename
    const ext = path.extname(file.name) || ".jpg";
    const customName = (formData.get("customName") as string)?.trim();
    const rawBase = customName || path.basename(file.name, ext);
    const safeBase = rawBase
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const fileName = `${safeBase || "photo"}_${Date.now()}${ext.toLowerCase()}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/media/${safeFolder}/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl, fileName });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
