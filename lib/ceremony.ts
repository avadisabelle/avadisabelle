// The ceremony key — a rite of entry, not a login.
//
// A guest offers a key at the threshold. We validate it SERVER-SIDE ONLY against
// CEREMONY_KEYS, then hand back a signed "ceremony token" (an HMAC-signed cookie).
// Middleware checks that token to open the (commons) route group.
//
// Implemented with Web Crypto so the same code runs in the Edge middleware and in
// Node route handlers. No dependencies.

export const COOKIE_NAME = "ceremony_token";

// Encode to bytes backed by a definite ArrayBuffer, so the result satisfies
// Web Crypto's BufferSource (ArrayBufferView<ArrayBuffer>) under strict lib types.
function te(s: string): Uint8Array<ArrayBuffer> {
  const u = new TextEncoder().encode(s);
  const out = new Uint8Array(new ArrayBuffer(u.byteLength));
  out.set(u);
  return out;
}

function b64urlFromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlFromString(s: string): string {
  return b64urlFromBytes(te(s));
}

function stringFromB64url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  let out = "";
  for (let i = 0; i < bin.length; i++) out += String.fromCharCode(bin.charCodeAt(i));
  return out;
}

// Timing-safe-ish string comparison (length-independent early exit avoided).
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // still walk `a` to reduce trivial length leaks
    let acc = 1;
    for (let i = 0; i < a.length; i++) acc |= a.charCodeAt(i);
    return acc === 0 && a.length === b.length;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function signingSecret(): string {
  const s = process.env.CEREMONY_SIGNING_SECRET;
  if (!s) throw new Error("CEREMONY_SIGNING_SECRET is not set");
  return s;
}

async function hmac(payloadB64: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    te(signingSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, te(payloadB64));
  return b64urlFromBytes(new Uint8Array(sig));
}

/** Validate an offered key against CEREMONY_KEYS (comma-separated). */
export function validateKey(offered: string): boolean {
  const raw = process.env.CEREMONY_KEYS ?? "";
  const keys = raw.split(",").map((k) => k.trim()).filter(Boolean);
  const candidate = offered.trim();
  if (!candidate) return false;
  // Compare against every key so timing doesn't reveal which matched.
  let ok = false;
  for (const k of keys) if (safeEqual(candidate, k)) ok = true;
  return ok;
}

/** Mint a signed ceremony token that expires after CEREMONY_TTL_HOURS. */
export async function signCeremonyToken(): Promise<{ token: string; maxAge: number }> {
  const ttlHours = Number(process.env.CEREMONY_TTL_HOURS ?? "168") || 168;
  const maxAge = Math.floor(ttlHours * 3600);
  const exp = Math.floor(Date.now() / 1000) + maxAge;
  const payloadB64 = b64urlFromString(JSON.stringify({ exp }));
  const sig = await hmac(payloadB64);
  return { token: `${payloadB64}.${sig}`, maxAge };
}

/** Verify a ceremony token: signature valid AND not expired. */
export async function verifyCeremonyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let expected: string;
  try {
    expected = await hmac(payloadB64);
  } catch {
    return false;
  }
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(stringFromB64url(payloadB64)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
