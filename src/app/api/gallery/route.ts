import { NextResponse } from "next/server";
import { getGallery, saveGallery } from "@/lib/storage";

export async function GET() {
  const gallery = getGallery();
  return NextResponse.json({ success: true, data: gallery });
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    const gallery = getGallery();
    const newItem = {
      ...item,
      id: "gal-" + Date.now(),
    };
    gallery.unshift(newItem);
    saveGallery(gallery);
    return NextResponse.json({ success: true, data: newItem });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add gallery item" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    const gallery = getGallery().filter((item) => item.id !== id);
    saveGallery(gallery);
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 400 });
  }
}
