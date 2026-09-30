import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { HttpError, clientIp, requireRole, route } from '@/lib/auth';
import { coordinatorAssignSchema } from '@/lib/validation';

/** Assign a user as Coordinator for a college, identified by its UID. Bumps tokenVersion so the new role applies at once. */
export const POST = (req: Request) =>
  route(async () => {
    const admin = await requireRole(['SUPER_ADMIN']);
    const { universityUid, userId } = coordinatorAssignSchema.parse(await req.json().catch(() => ({})));

    const uni = await prisma.university.findUnique({ where: { uid: universityUid } });
    if (!uni) throw new HttpError(404, 'No university with that UID');

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } });
    if (!target) throw new HttpError(404, 'User not found');
    if (target.role === 'SUPER_ADMIN') throw new HttpError(422, 'Cannot change a Super Admin');

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: 'COORDINATOR', universityId: uni.id, tokenVersion: { increment: 1 } },
      }),
      prisma.auditLog.create({
        data: { actorId: admin.id, action: 'COORDINATOR_ASSIGNED', target: `${userId}@${uni.uid}`, ip: clientIp(req) },
      }),
    ]);
    return NextResponse.json({ ok: true });
  });
