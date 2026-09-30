// Edge-safe: no Prisma / Node-only imports, so middleware can use it.
import { SignJWT, jwtVerify } from 'jose';
import type { Role } from './rbac';

export const SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-session' : 'session';
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8h, no silent refresh: re-login is cheap for an event app

export type SessionClaims = { sub: string; role: Role; tv: number };

const key = () => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error('JWT_SECRET missing or too short');
  return new TextEncoder().encode(s);
};

export async function signSession(c: SessionClaims) {
  return new SignJWT({ role: c.role, tv: c.tv })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(c.sub)
    .setIssuer('eventhub')
    .setAudience('eventhub-web')
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ['HS256'], // pin the algorithm: blocks alg=none / key-confusion
      issuer: 'eventhub',
      audience: 'eventhub-web',
    });
    if (!payload.sub || typeof payload.role !== 'string' || typeof payload.tv !== 'number') return null;
    return { sub: payload.sub, role: payload.role as Role, tv: payload.tv };
  } catch {
    return null;
  }
}
