import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get session token from cookie or authorization header
  const token =
    request.cookies.get(SESSION_COOKIE_NAME)?.value ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const user = await verifySessionToken(token);

  // 2. Protect Admin Web UI
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    // If authenticated user visits login page, redirect to dashboard
    if (isLoginPage && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // If unauthenticated user visits protected admin page, redirect to login
    if (!isLoginPage && !user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // 3. Protect Sensitive API Routes
  if (pathname.startsWith("/api/")) {
    // Whitelisted Public API Routes (always allowed)
    if (
      pathname.startsWith("/api/quote") ||
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/logout") ||
      pathname.startsWith("/api/test-supabase") ||
      pathname.startsWith("/api/cron")
    ) {
      return NextResponse.next();
    }

    // CMS Content endpoints: Allow public GET (for landing page), require Auth for writes
    const isPublicReadAllowed =
      pathname.startsWith("/api/gallery") ||
      pathname.startsWith("/api/services") ||
      pathname.startsWith("/api/testimonials") ||
      pathname.startsWith("/api/settings");

    if (request.method === "GET" && isPublicReadAllowed) {
      return NextResponse.next();
    }

    // All other operations require at least a valid session (Staff or Admin)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to access this resource." },
        { status: 401 }
      );
    }

    // Strict Admin-only endpoints (Staff is blocked with 403 Forbidden)
    const isAdminOnlyEndpoint =
      pathname.startsWith("/api/users") ||
      pathname.startsWith("/api/sync-google-sheets") ||
      pathname.startsWith("/api/test-email") ||
      (pathname.startsWith("/api/settings") && request.method === "POST");

    if (isAdminOnlyEndpoint && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Administrator privileges required." },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
  ],
};

