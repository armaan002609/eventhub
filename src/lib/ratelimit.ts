import 'server-only';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { HttpError } from './auth';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

const mk = (n: number, window: `${number} ${'s' | 'm' | 'h'}`, prefix: string) =>
  redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(n, window), prefix, analytics: false }) : null;

const limiters = {
  login: mk(5, '10 m', 'rl:login'),          // per ip+email
  loginIp: mk(30, '10 m', 'rl:login-ip'),    // per ip, blunts credential stuffing
  register: mk(5, '1 h', 'rl:register'),     // per user
  registerIp: mk(20, '1 h', 'rl:register-ip'),
  upload: mk(10, '1 h', 'rl:upload'),
} as const;

export async function limit(kind: keyof typeof limiters, key: string) {
  const l = limiters[kind];
  if (!l) {
    // Fail closed in production if Redis isn't configured.
    if (process.env.NODE_ENV === 'production') throw new HttpError(503, 'Service unavailable');
    return;
  }
  const r = await l.limit(key);
  if (!r.success) {
    const retry = Math.max(1, Math.ceil((r.reset - Date.now()) / 1000));
    throw new HttpError(429, 'Too many requests', { 'Retry-After': String(retry) });
  }
}
