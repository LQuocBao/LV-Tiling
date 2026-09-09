import { NextResponse } from "next/server";
import { getLeads, saveLeads } from "@/lib/storage";

export async function GET() {
  const leads = getLeads();
  return NextResponse.json({ success: true, data: leads });
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const leads = getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }
    leads[index].status = status;
    saveLeads(leads);
    return NextResponse.json({ success: true, data: leads[index] });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }
    const leads = getLeads().filter((l) => l.id !== id);
    saveLeads(leads);
    return NextResponse.json({ success: true, message: "Lead deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete lead" }, { status: 400 });
  }
}
