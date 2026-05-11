import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    let dbStatus = "unknown";
    let dbLatency = 0;
    try {
      const { db } = await import("@/lib/db");
      const dbStart = Date.now();
      await db.$queryRaw`SELECT 1 as health`;
      dbLatency = Date.now() - dbStart;
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
      dbLatency = -1;
    }

    const totalLatency = Date.now() - startTime;

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      responseTime: `${totalLatency}ms`,
      services: {
        database: {
          status: dbStatus,
          latency: dbLatency > 0 ? `${dbLatency}ms` : "N/A",
          provider: "Supabase PostgreSQL",
        },
        api: {
          status: "operational",
          version: "1.0.0",
        },
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        message: "Health check failed",
      },
      { status: 503 }
    );
  }
}
