import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/auth";

export async function POST() {
  return new NextResponse(
    JSON.stringify({ success: true, message: "Logout berhasil" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": clearAdminSessionCookie(),
      },
    }
  );
}
