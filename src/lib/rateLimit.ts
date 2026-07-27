// Minimal in-memory rate limiter — enough to blunt casual spam/abuse on public
// form submissions and admin login. For multi-instance production scale, swap
// for Upstash Redis (this Map is per-process, so N instances = N x the limit).
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Buckets used to accumulate forever: one entry per unique IP, never removed.
// A modest bot sweep would grow the Map unbounded until the process OOMs. Sweep
// expired entries periodically, and hard-cap the Map as a backstop.
const MAX_BUCKETS = 10_000;
let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_BUCKETS) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
  // Still oversized after the sweep (sustained attack) — drop the oldest half
  // rather than let memory grow without bound.
  if (buckets.size >= MAX_BUCKETS) {
    const drop = Math.ceil(buckets.size / 2);
    let i = 0;
    for (const key of buckets.keys()) {
      if (i++ >= drop) break;
      buckets.delete(key);
    }
  }
}

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  sweep(now);

  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const, remaining: limit - 1 };
  }
  b.count += 1;
  if (b.count > limit) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfter: Math.ceil((b.resetAt - now) / 1000),
    };
  }
  return { ok: true as const, remaining: limit - b.count };
}

// Clear a bucket after a legitimate action (e.g. a successful login) so honest
// users aren't locked out by their own earlier typos.
export function resetLimit(key: string) {
  buckets.delete(key);
}

// x-forwarded-for is attacker-controlled unless a trusted proxy sets it, so a
// spoofed header would otherwise let one client mint unlimited buckets. Trust
// it only when TRUST_PROXY is on (Vercel/Render/Railway all terminate TLS at a
// proxy and rewrite the header), and take the LAST hop the proxy appended.
const TRUST_PROXY = process.env.TRUST_PROXY !== "false";

export function clientIp(req: Request) {
  if (TRUST_PROXY) {
    // x-real-ip is overwritten (not appended to) by the proxy, so prefer it.
    const real = req.headers.get("x-real-ip");
    if (real) return real.trim();
    const xff = req.headers.get("x-forwarded-for");
    if (xff) {
      const hops = xff.split(",").map((s) => s.trim()).filter(Boolean);
      if (hops.length) return hops[hops.length - 1];
    }
  }
  return "unknown";
}
