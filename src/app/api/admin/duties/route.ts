import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { HttpError, requireRole, route } from '@/lib/auth';
import { dutySchema } from '@/lib/validation';

/** Super Admin -> Coordinator high-level duty. */
export const POST = (req: Request) =>
  route(async () => {
    const admin = await requireRole(['SUPER_ADMIN']);
    const d = dutySchema.parse(await req.json().catch(() => ({})));

    const assignee = await prisma.user.findUnique({
      where: { id: d.assignedToId },
      select: { role: true, universityId: true },
    });
    if (!assignee || assignee.role !== 'COORDINATOR') throw new HttpError(422, 'Assignee must be a Coordinator');

    const duty = await prisma.duty.create({
      data: {
        level: 'HIGH_LEVEL',
        title: d.title,
        description: d.description,
        venue: d.venue,
        startsAt: new Date(d.startsAt),
        endsAt: new Date(d.endsAt),
        universityId: assignee.universityId,
        createdById: admin.id,
        assignedToId: d.assignedToId,
      },
      select: { id: true },
    });
    return NextResponse.json(duty, { status: 201 });
  });
