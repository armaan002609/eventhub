import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { clientIp, route, setSessionCookie, HttpError } from '@/lib/auth';
import { signSession } from '@/lib/jwt';
import { limit } from '@/lib/ratelimit';
import { loginSchema } from '@/lib/validation';

// Constant-time-ish path when the user doesn't exist (prevents account enumeration by timing).
const DUMMY_HASH = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO5x8cN1V0k1o5p9c0fJ9Q9y6y3d1pM2e';

export const POST = (req: Request) =>
  route(async () => {
    const ip = clientIp(req);
    const body = loginSchema.parse(await req.json().catch(() => ({})));

    await limit('loginIp', ip);
    await limit('login', `${ip}:${body.email}`);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    const ok = await bcrypt.compare(body.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok || !user.isActive) throw new HttpError(401, 'Invalid email or password');

    await setSessionCookie(await signSession({ sub: user.id, role: user.role, tv: user.tokenVersion }));
    return NextResponse.json({ role: user.role });
  });
