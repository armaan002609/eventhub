import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { HttpError, requireRole, route } from '@/lib/auth';
import { limit } from '@/lib/ratelimit';
import { createIdProofUpload, signIdProofRead } from '@/lib/storage';
import { uploadRequestSchema } from '@/lib/validation';

/** Step 1 of upload: participant asks for a one-time signed upload target. */
export const POST = (req: Request) =>
  route(async () => {
    const user = await requireRole(['PARTICIPANT']);
    await limit('upload', user.id);
    const body = uploadRequestSchema.parse(await req.json().catch(() => ({})));
    const { path, token, bucketKey } = await createIdProofUpload(user.id, body.contentType);
    return NextResponse.json({ path, token, bucketKey });
  });

/** Admin-only: GET ?registrationId=... returns a 60s signed read URL and writes an audit row. */
export const GET = (req: Request) =>
  route(async () => {
    const admin = await requireRole(['SUPER_ADMIN']);
    const id = new URL(req.url).searchParams.get('registrationId');
    if (!id) throw new HttpError(400, 'registrationId required');
    const reg = await prisma.registration.findUnique({ where: { id }, select: { idProofPath: true } });
    if (!reg) throw new HttpError(404, 'Not found');
    await prisma.auditLog.create({ data: { actorId: admin.id, action: 'IDPROOF_VIEWED', target: id } });
    return NextResponse.json({ url: await signIdProofRead(reg.idProofPath) });
  });
