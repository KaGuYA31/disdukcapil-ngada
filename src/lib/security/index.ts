/**
 * Security Utilities for Disdukcapil Ngada
 * 
 * Features:
 * - AES-256-GCM encryption for sensitive data (NIK)
 * - Rate limiting (in-memory with cleanup)
 * - Input validation and sanitization
 * - Secure response helpers
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// ============================================
// ENCRYPTION UTILITIES (AES-256-GCM)
// ============================================

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

/**
 * Validate encryption key format
 * Key must be 32 bytes (256 bits) hex-encoded (64 characters)
 */
function validateEncryptionKey(): Buffer {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error("ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
  }
  return Buffer.from(ENCRYPTION_KEY, "hex");
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * Returns: iv:authTag:encryptedData (all hex-encoded)
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return "";
  
  const key = validateEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt data encrypted with AES-256-GCM
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";
  
  const key = validateEncryptionKey();
  const parts = encryptedData.split(":");
  
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }
  
  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

/**
 * Mask NIK for display (show only last 4 digits)
 * Example: 3578010101990001 -> ************0001
 */
export function maskNIK(nik: string): string {
  if (!nik || nik.length !== 16) return "****************";
  return "*".repeat(12) + nik.slice(-4);
}

/**
 * Mask NIK for logging (show only first 4 and last 4 digits)
 * Example: 3578010101990001 -> 3578********0001
 */
export function maskNIKForLog(nik: string): string {
  if (!nik || nik.length !== 16) return "****************";
  return nik.slice(0, 4) + "********" + nik.slice(-4);
}

// ============================================
// RATE LIMITING (In-Memory with TTL)
// ============================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

/**
 * Get client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfIp = request.headers.get("cf-connecting-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfIp) {
    return cfIp;
  }
  
  return "unknown";
}

/**
 * Check if request is rate limited
 * Returns an object with allowed status and metadata
 */
export function checkRateLimit(
  request: NextRequest,
  config: { windowMs: number; maxRequests: number }
): { allowed: boolean; remaining: number; resetTime: number; retryAfter: number } {
  const key = getClientIP(request);
  const maxRequests = config.maxRequests || 10;
  
  const now = Date.now();
  const resetTime = now + config.windowMs;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetTime < now) {
    // New window
    entry = {
      count: 1,
      resetTime,
      blocked: false,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime,
      retryAfter: 0,
    };
  }
  
  if (entry.blocked && entry.resetTime > now) {
    // Still blocked
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }
  
  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    entry.blocked = true;
    rateLimitStore.set(key, entry);
    
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter,
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
    retryAfter: 0,
  };
}

// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================

/**
 * Sanitize string input to prevent injection
 */
export function sanitizeString(input: string): string {
  if (!input) return "";
  
  return input
    .replace(/[<>]/g, "") // Remove potential HTML/XML tags
    .replace(/['"]/g, "") // Remove quotes
    .replace(/[;&|`$]/g, "") // Remove shell special chars
    .trim();
}

/**
 * Validate NIK format (16 digits, starts with valid province code)
 */
export function validateNIK(nik: string): { valid: boolean; error?: string } {
  if (!nik) {
    return { valid: false, error: "NIK wajib diisi" };
  }
  
  // Check length
  if (nik.length !== 16) {
    return { valid: false, error: "NIK harus 16 digit" };
  }
  
  // Check if all digits
  if (!/^\d{16}$/.test(nik)) {
    return { valid: false, error: "NIK hanya boleh berisi angka" };
  }
  
  // Validate province code (first 2 digits) - Indonesia has codes 11-96
  const provinceCode = parseInt(nik.substring(0, 2));
  if (provinceCode < 11 || provinceCode > 96) {
    return { valid: false, error: "Kode provinsi NIK tidak valid" };
  }
  
  // Validate date portion (digits 7-12, format DDMMYY)
  const day = parseInt(nik.substring(6, 8));
  const month = parseInt(nik.substring(8, 10));
  
  // For females, day is added 40
  const actualDay = day > 40 ? day - 40 : day;
  
  if (actualDay < 1 || actualDay > 31) {
    return { valid: false, error: "Tanggal lahir dalam NIK tidak valid" };
  }
  
  if (month < 1 || month > 12) {
    return { valid: false, error: "Bulan lahir dalam NIK tidak valid" };
  }
  
  return { valid: true };
}

/**
 * Validate phone number format
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: false, error: "Nomor telepon wajib diisi" };
  }
  
  // Indonesian phone format: 08xx or +62xx
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,10}$/;
  
  if (!phoneRegex.test(phone.replace(/[\s-]/g, ""))) {
    return { valid: false, error: "Format nomor telepon tidak valid" };
  }
  
  return { valid: true };
}

/**
 * Validate nomor pengajuan format
 */
export function validateNomorPengajuan(nomor: string): { valid: boolean; error?: string } {
  if (!nomor) {
    return { valid: false, error: "Nomor pengajuan wajib diisi" };
  }
  
  // Format: ONL-YYYYMMDD-XXXX
  const regex = /^ONL-\d{8}-\d{4}$/;
  
  if (!regex.test(nomor)) {
    return { valid: false, error: "Format nomor pengajuan tidak valid" };
  }
  
  return { valid: true };
}

/**
 * Validate UUID format (for IDs)
 */
export function validateUUID(id: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(id);
}

// ============================================
// SECURE RESPONSE HELPERS
// ============================================

/**
 * Remove sensitive fields from response data
 */
export function sanitizeResponse<T>(data: T, sensitiveFields: string[]): T {
  if (!data || typeof data !== "object") return data;
  
  const sanitized = { ...data } as any;
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      delete sanitized[field];
    }
  }
  
  return sanitized;
}

/**
 * Create secure JSON response with security headers
 */
export function secureResponse(
  data: any,
  status: number = 200,
  options?: { cache?: boolean }
): NextResponse {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  
  if (!options?.cache) {
    headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate";
    headers["Pragma"] = "no-cache";
    headers["Expires"] = "0";
  }
  
  return NextResponse.json(data, { status, headers });
}

/**
 * Log security event (for monitoring)
 */
export function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  request: NextRequest
): void {
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ip,
    userAgent,
    ...details,
  }));
}
