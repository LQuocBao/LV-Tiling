/**
 * Anti-spam toolkit for the public Quote form.
 *
 * Defence-in-depth, zero third-party dependency (no Google reCAPTCHA keys needed):
 *   Layer 1 – Honeypot field      : hidden input that only bots fill in.
 *   Layer 2 – Time trap           : a human needs > MIN_FILL_MS to complete the form.
 *   Layer 3 – Signed math challenge: stateless HMAC token, answer never sent to the client.
 *   Layer 4 – One-time token      : each challenge can be redeemed once (anti-replay).
 *   Layer 5 – IP rate limiting    : max N submissions per window per IP.
 *   Layer 6 – Duplicate detection : same phone/email within a cooldown window is rejected.
 *
 * NOTE: rate-limit / nonce stores are in-memory (per server instance). This is fine for a
 * single Node server. If the site is ever deployed to multiple instances / serverless,
 * move these stores to Redis / Upstash.
 */
import crypto from "crypto";

export const MIN_FILL_MS = 3_000; // faster than 3s = bot
export const CHALLENGE_TTL_MS = 30 * 60_000; // challenge valid for 30 minutes
export const RATE_LIMIT_MAX = 3; // max submissions…
export const RATE_LIMIT_WINDOW_MS = 10 * 60_000; // …per 10 minutes per IP
export const DUPLICATE_COOLDOWN_MS = 10 * 60_000; // same phone/email blocked for 10 minutes

type GlobalStore = {
  __quoteSecret?: string;
  __quoteUsedNonces?: Map<string, number>;
  __quoteRateLimit?: Map<string, number[]>;
};
// Use globalThis so every route bundle (and dev hot-reload) shares the same state.
const g = globalThis as unknown as GlobalStore;

function getSecret(): string {
  if (process.env.QUOTE_CAPTCHA_SECRET) return process.env.QUOTE_CAPTCHA_SECRET;
  if (!g.__quoteSecret) g.__quoteSecret = crypto.randomBytes(32).toString("hex");
  return g.__quoteSecret;
}
const usedNonces = (g.__quoteUsedNonces ??= new Map<string, number>());
const rateLimitStore = (g.__quoteRateLimit ??= new Map<string, number[]>());

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
}

/* ------------------------------------------------------------------ */
/* Layer 3 + 4: Signed math challenge                                  */
/* ------------------------------------------------------------------ */
export function createChallenge(): { question: string; token: string } {
  const a = crypto.randomInt(2, 10);
  const b = crypto.randomInt(1, 10);
  const useAdd = crypto.randomInt(0, 2) === 0 || a < b;
  const answer = useAdd ? a + b : a - b;
  const question = useAdd ? `${a} + ${b}` : `${a} − ${b}`;

  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(8).toString("hex");
  // The answer is part of the signed data but NOT of the token payload → client cannot read it.
  const signature = sign(`${issuedAt}.${nonce}.${answer}`);
  return { question, token: `${issuedAt}.${nonce}.${signature}` };
}

export type ChallengeResult = { ok: true } | { ok: false; reason: string };

export function verifyChallenge(token: unknown, answer: unknown): ChallengeResult {
  if (typeof token !== "string" || token.split(".").length !== 3) {
    return { ok: false, reason: "Security check expired. Please refresh the question and try again." };
  }
  const [issuedAtStr, nonce, signature] = token.split(".");
  const issuedAt = Number(issuedAtStr);
  const age = Date.now() - issuedAt;

  if (!Number.isFinite(issuedAt) || age > CHALLENGE_TTL_MS) {
    return { ok: false, reason: "Security check expired. Please answer the new question." };
  }
  if (age < MIN_FILL_MS) {
    return { ok: false, reason: "Form submitted too quickly. Please take a moment and try again." };
  }

  const numericAnswer = Number(String(answer ?? "").trim());
  if (!Number.isInteger(numericAnswer)) {
    return { ok: false, reason: "Please answer the security question." };
  }

  const expected = sign(`${issuedAt}.${nonce}.${numericAnswer}`);
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  if (!valid) {
    return { ok: false, reason: "Incorrect answer to the security question. Please try again." };
  }

  // One-time use (anti-replay)
  purgeExpiredNonces();
  if (usedNonces.has(nonce)) {
    return { ok: false, reason: "This security check was already used. Please answer the new question." };
  }
  usedNonces.set(nonce, issuedAt + CHALLENGE_TTL_MS);
  return { ok: true };
}

function purgeExpiredNonces() {
  const now = Date.now();
  for (const [nonce, exp] of usedNonces) if (exp < now) usedNonces.delete(nonce);
}

/* ------------------------------------------------------------------ */
/* Layer 5: IP rate limiting (sliding window)                          */
/* ------------------------------------------------------------------ */
export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(
  key: string,
  max: number = RATE_LIMIT_MAX
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const hits = (rateLimitStore.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= max) {
    const retryAfterSec = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - hits[0])) / 1000);
    rateLimitStore.set(key, hits);
    return { ok: false, retryAfterSec };
  }
  hits.push(now);
  rateLimitStore.set(key, hits);
  return { ok: true, retryAfterSec: 0 };
}

/** Max wrong captcha answers per IP per window (prevents brute-forcing the small answer space). */
export const MAX_FAILED_CHALLENGES = 8;

/** Returns true if `key` already reached `max` hits in the window (does NOT record a hit). */
export function isRateLimited(key: string, max: number): boolean {
  const now = Date.now();
  const hits = (rateLimitStore.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  rateLimitStore.set(key, hits);
  return hits.length >= max;
}

export function recordHit(key: string) {
  const hits = rateLimitStore.get(key) || [];
  hits.push(Date.now());
  rateLimitStore.set(key, hits);
}

/* ------------------------------------------------------------------ */
/* Layer 6: Duplicate detection                                        */
/* ------------------------------------------------------------------ */
const normalizePhone = (p: string) => (p || "").replace(/\D/g, "").replace(/^61/, "0");
const normalizeEmail = (e: string) => (e || "").trim().toLowerCase();

/** Lead IDs are `lead-<Date.now()>`, so we use them as a reliable UTC timestamp. */
function leadTimestamp(lead: { id: string; createdAt?: string }): number {
  const fromId = Number(String(lead.id).replace(/^lead-/, ""));
  if (Number.isFinite(fromId) && fromId > 1_000_000_000_000) return fromId;
  const t = Date.parse(String(lead.createdAt || "").replace(" ", "T") + "Z");
  return Number.isFinite(t) ? t : 0;
}

export function isDuplicateLead(
  existing: { id: string; phone: string; email: string; createdAt?: string }[],
  phone: string,
  email: string
): boolean {
  const now = Date.now();
  const p = normalizePhone(phone);
  const e = normalizeEmail(email);
  return existing.some(
    (l) =>
      now - leadTimestamp(l) < DUPLICATE_COOLDOWN_MS &&
      ((p && normalizePhone(l.phone) === p) || (e && normalizeEmail(l.email) === e))
  );
}
