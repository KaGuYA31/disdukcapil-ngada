import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

/**
 * Next.js Middleware – runs on the Edge before every request.
 *
 * Responsibilities:
 *  1. Protect /admin/* page routes (except the login page itself).
 *  2. Protect sensitive API routes (POST / PUT / DELETE on write endpoints).
 *  3. Return 401 JSON for unauthenticated API requests.
 *  4. Redirect unauthenticated page visitors to /admin.
 *  5. Allow all public GET requests and public page routes through.
 */

// ---- Route definitions ----

/** API base paths where POST/PUT/DELETE require admin auth. */
const PROTECTED_API_PREFIXES: string[] = [
  "/api/berita",
  "/api/inovasi",
  "/api/layanan-online",
  "/api/admin",
  "/api/upload",
  "/api/upload-document",
  "/api/blanko-ektp",
  "/api/pimpinan",
  "/api/struktur",
  "/api/pengumuman",
  "/api/testimoni",
  "/api/formulir/sync",
];

/** HTTP methods that require authentication on protected API routes. */
const WRITE_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

// ---- Helpers ----

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ---- Matcher configuration (used by Next.js) ----

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static (static files)
     *  - _next/image (image optimisation)
     *  - favicon.ico, robots.txt, sitemap, etc.
     *  - public assets (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap|images|fonts|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$).*)",
  ],
};

// ---- Middleware entry point ----

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ---- 1. Admin page routes ----

  if (pathname.startsWith("/admin")) {
    // Allow the login page itself
    if (pathname === "/admin") {
      const { valid } = await verifyAdminSession(request);
      // If already authenticated, redirect to dashboard
      if (valid) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // All other /admin/* routes require auth
    const { valid } = await verifyAdminSession(request);
    if (!valid) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ---- 2. Protected API routes ----

  if (pathname.startsWith("/api/") && isProtectedApiRoute(pathname)) {
    // GET requests are allowed without auth (public data)
    if (!WRITE_METHODS.has(method)) {
      return NextResponse.next();
    }

    // Write operations require auth
    const { valid } = await verifyAdminSession(request);
    if (!valid) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Autentikasi diperlukan untuk mengakses resource ini",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.next();
  }

  // ---- 3. Public routes – allow through ----

  return NextResponse.next();
}
