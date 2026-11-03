import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTestimonialsAsync, saveTestimonialsAsync } from "@/lib/storage";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const testimonials = await getTestimonialsAsync();
  return NextResponse.json({ success: true, data: testimonials });
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const updated = await request.json();
    const saved = await saveTestimonialsAsync(updated);
    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Testimonials updated", data: saved });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update testimonials" }, { status: 400 });
  }
}
