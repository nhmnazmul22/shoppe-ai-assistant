// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // Agar tidak duplikasi instance saat hot-reload di dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

/**
 * Prisma singleton untuk Next.js.
 * - Gunakan DATABASE_URL dari .env (disarankan pakai ?pgbouncer=true&connection_limit=1).
 * - Log hanya warning & error agar tidak bising.
 */
export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma
