import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  createAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    const isValid = await validateCredentials(String(username), String(password));

    if (!isValid) {
      // Clear any existing session cookie on failed login
      return new NextResponse(
        JSON.stringify({ success: false, message: "Username atau password salah" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": clearAdminSessionCookie(),
          },
        }
      );
    }

    // Credentials are valid – set the HttpOnly session cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      admin: {
        username: process.env.ADMIN_USERNAME ?? "admin",
        name: process.env.ADMIN_NAME ?? "Administrator",
        email: process.env.ADMIN_EMAIL ?? "admin@ngadakab.go.id",
      },
    });

    response.headers.set("Set-Cookie", await createAdminSessionCookie());

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
