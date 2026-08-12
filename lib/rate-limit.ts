type Bucket = {
  count: number;
  resetAt: number;
};

type Store = Map<string, Bucket>;

const globalForRateLimit = globalThis as typeof globalThis & {
  portfolioRateLimitStore?: Store;
};

const store = globalForRateLimit.portfolioRateLimitStore ?? new Map<string, Bucket>();
globalForRateLimit.portfolioRateLimitStore = store;

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    store.set(key, next);
    return { allowed: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
