import { NextResponse } from "next/server";
import { getTestimonials, saveTestimonials } from "@/lib/storage";

export async function GET() {
  const testimonials = getTestimonials();
  return NextResponse.json({ success: true, data: testimonials });
}

export async function POST(request: Request) {
  try {
    const updated = await request.json();
    saveTestimonials(updated);
    return NextResponse.json({ success: true, message: "Testimonials updated" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update testimonials" }, { status: 400 });
  }
}
