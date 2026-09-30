import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { prisma } from './db';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, verifySession } from './jwt';
import type { Role } from './rbac';

export class HttpError extends Error {
  constructor(public status: number, message: string, public headers?: Record<string, string>) {
    super(message);
  }
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Authoritative check, called by every route handler and protected server page.
 * Middleware is the first gate; this re-verifies against the DB so a demoted,
 * deactivated or token-revoked user is cut off immediately.
 */
export async function requireRole(roles: Role[]) {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) throw new HttpError(401, 'Unauthenticated');

  const user = await prisma.user.findUnique({
    where: { id: claims.sub },
    select: { id: true, role: true, isActive: true, tokenVersion: true, universityId: true },
  });
  if (!user || !user.isActive || user.tokenVersion !== claims.tv) throw new HttpError(401, 'Session expired');
  if (!roles.includes(user.role)) throw new HttpError(403, 'Forbidden'); // DB role wins over token role
  return user;
}

/** Wrap handlers so errors never leak internals. */
export function route<T>(fn: () => Promise<T>) {
  return fn().catch((e: unknown) => {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status, headers: e.headers });
    }
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid input', issues: e.flatten().fieldErrors }, { status: 422 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  });
}

export function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
