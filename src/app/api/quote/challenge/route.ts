import { NextResponse } from "next/server";
import { createChallenge } from "@/lib/antiSpam";

export const dynamic = "force-dynamic";

/** Issues a fresh signed math challenge for the public quote form. */
export async function GET() {
  const challenge = createChallenge();
  return NextResponse.json(
    { success: true, ...challenge },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
