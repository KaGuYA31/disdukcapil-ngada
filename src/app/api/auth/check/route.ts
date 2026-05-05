import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { valid, session } = await verifyAdminSession(request);

  if (!valid || !session) {
    return NextResponse.json(
      { authenticated: false, message: "Sesi tidak valid" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      username: session.username,
      name: session.name,
      email: session.email,
    },
  });
}
