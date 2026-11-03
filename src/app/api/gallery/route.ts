import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getGalleryAsync,
  addGalleryItemAsync,
  deleteGalleryItemAsync,
  updateGalleryItemAsync,
} from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const gallery = await getGalleryAsync();
  return NextResponse.json({ success: true, data: gallery, gallery });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const item = await request.json();
    const newItem = {
      ...item,
      id: item.id || "gal-" + Date.now(),
    };
    const saved = await addGalleryItemAsync(newItem);
    revalidatePath("/");
    return NextResponse.json({ success: true, data: saved, item: saved });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add gallery item" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    const updated = await updateGalleryItemAsync(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
    }
    revalidatePath("/");
    return NextResponse.json({ success: true, data: updated, item: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    await deleteGalleryItemAsync(id);
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 400 });
  }
}
