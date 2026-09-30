import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { HttpError, clientIp, requireRole, route } from '@/lib/auth';
import { limit } from '@/lib/ratelimit';
import { calcFees } from '@/lib/pricing';
import { registrationSchema } from '@/lib/validation';

export const POST = (req: Request) =>
  route(async () => {
    const user = await requireRole(['PARTICIPANT']);
    await limit('registerIp', clientIp(req));
    await limit('register', user.id);

    const input = registrationSchema.parse(await req.json().catch(() => ({})));

    // The uploaded file must live in THIS user's namespace (stops pointing at someone else's document).
    if (!input.idProofPath.startsWith(`id-proofs/${user.id}/`)) throw new HttpError(422, 'Invalid ID proof');

    const [uni, bp] = await Promise.all([
      prisma.university.findUnique({ where: { id: input.universityId }, select: { id: true } }),
      input.needsTransport
        ? prisma.boardingPoint.findFirst({ where: { id: input.boardingPointId, isActive: true } })
        : Promise.resolve(null),
    ]);
    if (!uni) throw new HttpError(422, 'Unknown university');
    if (input.needsTransport && !bp) throw new HttpError(422, 'Unknown boarding point');

    // Authoritative fee calculation: client-sent totals are not even accepted by the schema.
    const fees = calcFees({
      boardingCharge: bp?.charge,
      accommodationDays: input.needsAccommodation ? input.accommodationDays : 0,
      mealsPerDay: input.needsFood ? input.mealsPerDay : 0,
    });

    try {
      const reg = await prisma.registration.create({
        data: {
          userId: user.id,
          hackathonId: input.hackathonId,
          studentName: input.studentName,
          phone: input.phone,
          email: input.email,
          universityId: input.universityId,
          idProofPath: input.idProofPath,
          needsTransport: input.needsTransport,
          boardingPointId: input.needsTransport ? bp!.id : null,
          transportFee: fees.transport,
          needsAccommodation: input.needsAccommodation,
          accommodationDays: input.needsAccommodation ? input.accommodationDays : null,
          checkIn: input.needsAccommodation ? new Date(input.checkIn!) : null,
          checkOut: input.needsAccommodation ? new Date(input.checkOut!) : null,
          accommodationFee: fees.accommodation,
          needsFood: input.needsFood,
          mealsPerDay: input.needsFood ? input.mealsPerDay : null,
          foodFee: fees.food,
          totalFee: fees.total,
          // paymentStatus defaults to UNPAID; only admins/payment webhook may change it.
        },
        select: { id: true, totalFee: true, paymentStatus: true },
      });
      return NextResponse.json(reg, { status: 201 });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new HttpError(409, 'You have already registered');
      }
      throw e;
    }
  });
