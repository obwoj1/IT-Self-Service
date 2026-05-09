interface Record {
  count: number;
  resetAt: number;
}

// Module-level Map persists across requests in the same Node.js process
const store = new Map<string, Record>();

export function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= max) return false;

  record.count++;
  return true;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
