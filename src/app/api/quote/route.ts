import { NextResponse } from "next/server";
import { addLead } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, suburb, serviceType, approxArea, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const newLead = addLead({
      name,
      phone,
      email: email || "",
      suburb: suburb || "Perth Metro",
      serviceType: serviceType || "General Tiling",
      approxArea: approxArea || "Not specified",
      message: message || "No extra notes provided.",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your quote request has been received. Our master tiler will contact you within 2 business hours.",
      lead: newLead,
    });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quote request. Please call directly at 0452 612 336." },
      { status: 500 }
    );
  }
}
