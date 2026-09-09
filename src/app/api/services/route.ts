import { NextResponse } from "next/server";
import { getServices, saveServices } from "@/lib/storage";

export async function GET() {
  const services = getServices();
  return NextResponse.json({ success: true, data: services });
}

export async function POST(request: Request) {
  try {
    const updatedServices = await request.json();
    saveServices(updatedServices);
    return NextResponse.json({ success: true, message: "Services updated" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update services" }, { status: 400 });
  }
}
