import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServicesAsync, saveServicesAsync } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const services = await getServicesAsync();
  return NextResponse.json({ success: true, data: services });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const updatedServices = await request.json();
    const saved = await saveServicesAsync(updatedServices);
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Services updated", data: saved });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update services" }, { status: 400 });
  }
}
