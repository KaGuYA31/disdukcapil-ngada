import { NextRequest, NextResponse } from "next/server";

/**
 * Authentication utilities for Disdukcapil Ngada admin panel.
 *
 * Uses a signed HMAC-based session token stored in an HttpOnly cookie
 * so that middleware and API routes can verify authenticity without
 * sharing the secret with the client.
 *
 * Uses Web Crypto API for Edge Runtime compatibility.
 */

// ---- Constants ----

const COOKIE_NAME = "admin_session";
const TOKEN_SEPARATOR = ".";
const MAX_AGE = 86400; // 24 hours in seconds

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Administrator";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ngadakab.go.id";

/**
 * Server-only signing secret derived from NEXTAUTH_SECRET (or a fallback).
 * This is used to HMAC-sign session tokens so they cannot be forged.
 */
const SIGNING_SECRET = process.env.NEXTAUTH_SECRET ?? "disdukcapil-ngada-default-secret";

// ---- Web Crypto Helpers (Edge Runtime compatible) ----

function encodeBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmacSign(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return encodeBase64Url(signature);
}

async function hmacVerify(data: string, signature: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SIGNING_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = decodeBase64Url(signature);
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
}

async function timingSafeEqual(a: Uint8Array, b: Uint8Array): Promise<boolean> {
  if (a.length !== b.length) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    new Uint8Array(32).fill(0),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  // Use HMAC comparison as timing-safe comparison proxy
  const sigA = await crypto.subtle.sign("HMAC", key, a);
  const sigB = await crypto.subtle.sign("HMAC", key, b);
  // Compare the HMAC outputs byte by byte
  const arrA = new Uint8Array(sigA);
  const arrB = new Uint8Array(sigB);
  let result = 0;
  for (let i = 0; i < arrA.length; i++) {
    result |= arrA[i] ^ arrB[i];
  }
  return result === 0;
}

// ---- Public types ----

export interface AdminSession {
  username: string;
  name: string;
  email: string;
  issuedAt: number;   // unix timestamp (seconds)
  expiresAt: number;  // unix timestamp (seconds)
}

export interface VerifyResult {
  valid: boolean;
  session: AdminSession | null;
}

// ---- Cookie helpers ----

function buildCookieString(value: string, maxAge: number): string {
  const parts = [
    `${COOKIE_NAME}=${value}`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Strict",
  ];

  // Set Secure flag in production (HTTPS)
  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

// ---- Exported helpers ----

/**
 * Verify an incoming admin session from the request's cookies.
 * Works in both middleware and API routes.
 */
export async function verifyAdminSession(request: NextRequest): Promise<VerifyResult> {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return { valid: false, session: null };
  }

  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]*)`));
  if (!match) {
    return { valid: false, session: null };
  }

  const token = match[1];
  if (!token) {
    return { valid: false, session: null };
  }

  try {
    const separatorIndex = token.indexOf(TOKEN_SEPARATOR);
    if (separatorIndex === -1) return { valid: false, session: null };

    const payload = token.slice(0, separatorIndex);
    const signature = token.slice(separatorIndex + 1);

    const valid = await hmacVerify(payload, signature);
    if (!valid) return { valid: false, session: null };

    const session = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payload))
    ) as AdminSession;

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (session.expiresAt < now) {
      return { valid: false, session: null };
    }

    return { valid: true, session };
  } catch {
    return { valid: false, session: null };
  }
}

/**
 * Create a Set-Cookie header value for a newly authenticated admin session.
 * Call this from a server-side route handler and include it in the response.
 */
export async function createAdminSessionCookie(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const session: AdminSession = {
    username: ADMIN_USERNAME,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    issuedAt: now,
    expiresAt: now + MAX_AGE,
  };

  const payload = encodeBase64Url(new TextEncoder().encode(JSON.stringify(session)).buffer);
  const signature = await hmacSign(payload);
  const token = `${payload}${TOKEN_SEPARATOR}${signature}`;

  return buildCookieString(token, MAX_AGE);
}

/**
 * Create a Set-Cookie header value that clears the admin session cookie.
 */
export function clearAdminSessionCookie(): string {
  return buildCookieString("", 0);
}

/**
 * Validate credentials against environment variables.
 */
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const usernameValid = await timingSafeEqual(
    encoder.encode(username.normalize("NFC")),
    encoder.encode(ADMIN_USERNAME.normalize("NFC"))
  );
  const passwordValid = await timingSafeEqual(
    encoder.encode(password),
    encoder.encode(ADMIN_PASSWORD)
  );

  return usernameValid && passwordValid;
}

/**
 * Helper to create a JSON response that also clears the session cookie.
 */
export function unauthorizedResponse(): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: "Unauthorized", message: "Autentikasi diperlukan" }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearAdminSessionCookie(),
      },
    }
  );
}
