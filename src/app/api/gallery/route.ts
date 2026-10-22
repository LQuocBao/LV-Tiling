import { NextResponse } from "next/server";
import { getGalleryAsync, addGalleryItemAsync, deleteGalleryItemAsync } from "@/lib/storage";

export async function GET() {
  const gallery = await getGalleryAsync();
  return NextResponse.json({ success: true, data: gallery, gallery });
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    const newItem = {
      ...item,
      id: item.id || "gal-" + Date.now(),
    };
    const saved = await addGalleryItemAsync(newItem);
    return NextResponse.json({ success: true, data: saved });
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
    await deleteGalleryItemAsync(id);
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 400 });
  }
}
