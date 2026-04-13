import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  // Turbopack may not load .env properly for Prisma schema validation
  // This fallback reads .env directly when env var is missing
  if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
    return process.env.DATABASE_URL
  }
  try {
    const fs = require('fs')
    const path = require('path')
    const envPath = path.join(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const match = line.match(/^DATABASE_URL=(.+)$/);
      if (match && match[1].trim().startsWith('postgresql://')) {
        return match[1].trim()
      }
    }
  } catch {
    // ignore - production (Vercel) loads env from dashboard
  }
  return process.env.DATABASE_URL || ''
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatabaseUrl(),
    log: [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
