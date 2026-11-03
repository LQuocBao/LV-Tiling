/**
 * LV Tiling - Server-side Authentication & Session Guard
 * Lightweight HMAC-SHA256 session tokens powered by Web Crypto API (Edge & Node.js compatible).
 */

export interface SessionPayload {
  id: string;
  username: string;
  role: "admin" | "staff";
  exp: number; // Unix timestamp in seconds
}

export const SESSION_COOKIE_NAME = "lv_admin_session";
export const SESSION_MAX_AGE_SEC = 4 * 60 * 60; // 4 hours session limit

function getSecretKey(): string {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.QUOTE_CAPTCHA_SECRET ||
    "lv-tiling-perth-wa-secure-jwt-hmac-key-2026"
  );
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }
  return btoa(str)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").toString("utf-8");
  }
  return atob(b64);
}

async function signData(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const hashArray = Array.from(new Uint8Array(signature));
  const binaryString = String.fromCharCode(...hashArray);
  return base64UrlEncode(binaryString);
}

/**
 * Creates a signed session token valid for 7 days
 */
export async function createSessionToken(user: {
  id: string;
  username: string;
  role: "admin" | "staff";
}): Promise<string> {
  const payload: SessionPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const sig = await signData(payloadB64, getSecretKey());
  return `${payloadB64}.${sig}`;
}

/**
 * Verifies a session token and returns the payload if valid and not expired
 */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  try {
    const expectedSig = await signData(payloadB64, getSecretKey());
    if (expectedSig !== sig) return null;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload: SessionPayload = JSON.parse(payloadJson);

    if (!payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the session from Request cookies or Authorization header
 */
export async function getSessionUser(request: Request): Promise<SessionPayload | null> {
  // 1. Check Cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (match) {
    const token = match.substring(SESSION_COOKIE_NAME.length + 1);
    const user = await verifySessionToken(token);
    if (user) return user;
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const user = await verifySessionToken(token);
    if (user) return user;
  }

  return null;
}

/**
 * Cookie options helper for setting and clearing session cookie
 */
export function getSessionCookieOptions(isProduction = process.env.NODE_ENV === "production") {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

