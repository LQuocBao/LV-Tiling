import { NextResponse } from "next/server";
import { getLeadsAsync, updateLeadStatusAsync, deleteLeadAsync } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getLeadsAsync();
  return NextResponse.json({ success: true, data: leads, leads });
}

export async function PATCH(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();
    const ok = await updateLeadStatusAsync(id, status);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: { id, status } });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    await deleteLeadAsync(id);
    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete lead" }, { status: 400 });
  }
}
