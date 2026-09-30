import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { HttpError, requireRole } from '@/lib/auth';
import DutyAssignmentPanel from '@/components/admin/DutyAssignmentPanel';

export const dynamic = 'force-dynamic';

export default async function SuperAdminDutiesPage() {
  // Second gate after middleware: authoritative DB-backed check.
  try { await requireRole(['SUPER_ADMIN']); }
  catch (e) { if (e instanceof HttpError) redirect('/login'); throw e; }

  const [universities, users, duties] = await Promise.all([
    prisma.university.findMany({ select: { id: true, uid: true, name: true }, orderBy: { uid: 'asc' } }),
    prisma.user.findMany({
      where: { isActive: true, role: { in: ['PARTICIPANT', 'VOLUNTEER', 'COORDINATOR'] } },
      select: { id: true, name: true, email: true, role: true, university: { select: { uid: true } } },
      orderBy: { name: 'asc' }, take: 500,
    }),
    prisma.duty.findMany({
      where: { level: 'HIGH_LEVEL' },
      select: { id: true, title: true, venue: true, startsAt: true, endsAt: true, assignedTo: { select: { name: true } } },
      orderBy: { startsAt: 'asc' }, take: 200,
    }),
  ]);

  const people = users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, universityUid: u.university?.uid ?? null }));

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Coordinators &amp; duties</h1>
      <DutyAssignmentPanel
        universities={universities}
        candidates={people.filter((p) => p.role !== 'COORDINATOR')}
        coordinators={people.filter((p) => p.role === 'COORDINATOR')}
        duties={duties.map((d) => ({ id: d.id, title: d.title, venue: d.venue, startsAt: d.startsAt.toISOString(), endsAt: d.endsAt.toISOString(), assignee: d.assignedTo.name }))}
      />
    </main>
  );
}
