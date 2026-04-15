/**
 * Retry utility for database operations that may fail intermittently
 * due to Supabase connection pool limitations.
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    context?: string;
  } = {}
): Promise<T> {
  const { maxRetries = 2, delayMs = 500, context = 'DB operation' } = options
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on client errors (4xx) or validation errors
      if (lastError.message.includes('Unique constraint') ||
          lastError.message.includes('not found') ||
          lastError.message.includes('Invalid')) {
        throw lastError
      }

      if (attempt <= maxRetries) {
        console.warn(
          `[${context}] Attempt ${attempt}/${maxRetries + 1} failed: ${lastError.message}. Retrying in ${delayMs}ms...`
        )
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt))
      }
    }
  }

  throw lastError
}
