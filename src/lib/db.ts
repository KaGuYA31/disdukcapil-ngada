import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL || ''
  // Turbopack may not load .env properly for Prisma schema validation
  if (envUrl.startsWith('postgresql://')) {
    return envUrl
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
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
  return envUrl
}

function buildDatasourceUrl(): string {
  const base = getDatabaseUrl()
  if (!base) return base

  const url = new URL(base)

  // Ensure connection pool settings for Supabase
  if (!url.searchParams.has('connect_timeout')) {
    url.searchParams.set('connect_timeout', '10')
  }
  if (!url.searchParams.has('pgbouncer') && url.port === '6543') {
    // Port 6543 is Supabase transaction mode - pgbouncer=true is recommended
    url.searchParams.set('pgbouncer', 'true')
  }

  return url.toString()
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: buildDatasourceUrl(),
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })

// Handle connection errors gracefully
db.$on('error' as never, (e: Error) => {
  console.error('[Prisma Connection Error]:', e.message)
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
