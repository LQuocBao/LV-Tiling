import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServiceSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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

    // 1. Prioritize uploading to Supabase Storage if configured (Cloud CDN)
    const supabase = getServiceSupabase();
    if (supabase) {
      // Auto-ensure bucket 'gallery' exists as public
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const hasGallery = buckets?.some((b) => b.name === "gallery");
        if (!hasGallery) {
          await supabase.storage.createBucket("gallery", {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
        }
      } catch (bErr) {
        console.warn("Auto-create bucket warning:", bErr);
      }

      const storagePath = `${safeFolder}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(storagePath);

        return NextResponse.json({
          success: true,
          url: publicUrlData.publicUrl,
          fileName,
          storage: "supabase",
        });
      }

      console.error("Supabase Storage upload error:", uploadError);
      return NextResponse.json(
        {
          success: false,
          error: `Supabase Storage: ${uploadError.message || "Failed to upload image"}`,
        },
        { status: 400 }
      );
    }

    // 2. Fallback to local filesystem only in local development (not on Vercel Serverless)
    if (!process.env.VERCEL) {
      const uploadDir = path.join(process.cwd(), "public", "media", safeFolder);
      await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      const publicUrl = `/media/${safeFolder}/${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl, fileName, storage: "local" });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Supabase Storage is not configured. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.",
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Upload failed due to server error" },
      { status: 500 }
    );
  }
}
