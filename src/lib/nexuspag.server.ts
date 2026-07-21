// NexusPag Gateway helpers (Deprecated - use venopay.server.ts)
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  return { allowed: true, retryAfterSec: 0 };
}
