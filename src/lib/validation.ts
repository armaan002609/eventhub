import { z } from 'zod';

// Reject markup characters outright; React escapes on output, this is defence in depth against stored XSS.
const safe = /^[^<>]*$/;
const text = (min: number, max: number) => z.string().trim().min(min).max(max).regex(safe, 'Invalid characters');

export const ID_PROOF_RULES = {
  maxBytes: 5 * 1024 * 1024,
  types: { 'image/jpeg': 'jpg', 'image/png': 'png', 'application/pdf': 'pdf' } as Record<string, string>,
};

export const loginSchema = z
  .object({ email: z.string().trim().toLowerCase().email().max(254), password: z.string().min(8).max(128) })
  .strict();

export const uploadRequestSchema = z
  .object({
    contentType: z.enum(['image/jpeg', 'image/png', 'application/pdf']),
    size: z.number().int().positive().max(ID_PROOF_RULES.maxBytes),
  })
  .strict();

export const registrationSchema = z
  .object({
    hackathonId: z.string().cuid(),
    studentName: text(2, 100),
    phone: z.string().trim().regex(/^\+?[0-9]{10,13}$/, 'Enter a valid phone number'),
    email: z.string().trim().toLowerCase().email().max(254),
    universityId: z.string().cuid(),
    idProofPath: z.string().regex(/^id-proofs\/[A-Za-z0-9_-]+\/[0-9a-f-]{36}\.(jpg|png|pdf)$/, 'Upload your ID proof'),

    needsTransport: z.boolean(),
    boardingPointId: z.string().cuid().optional(),

    needsAccommodation: z.boolean(),
    accommodationDays: z.number().int().min(1).max(5).optional(),
    checkIn: z.string().datetime({ local: true }).optional(),
    checkOut: z.string().datetime({ local: true }).optional(),

    needsFood: z.boolean(),
    mealsPerDay: z.number().int().min(1).max(4).optional(),
  })
  .strict() // unknown keys (incl. Mongo-style operators or a forged totalFee) are rejected
  .superRefine((v, ctx) => {
    const need = (ok: boolean, path: string, message: string) =>
      ok || ctx.addIssue({ code: 'custom', path: [path], message });

    if (v.needsTransport) need(!!v.boardingPointId, 'boardingPointId', 'Select a boarding point');
    if (v.needsFood) need(!!v.mealsPerDay, 'mealsPerDay', 'Select meals per day');
    if (v.needsAccommodation) {
      need(!!v.accommodationDays, 'accommodationDays', 'Select number of days');
      need(!!v.checkIn, 'checkIn', 'Check-in required');
      need(!!v.checkOut, 'checkOut', 'Check-out required');
      if (v.checkIn && v.checkOut && v.accommodationDays) {
        const ms = new Date(v.checkOut).getTime() - new Date(v.checkIn).getTime();
        need(ms > 0, 'checkOut', 'Check-out must be after check-in');
        need(v.accommodationDays >= Math.ceil(ms / 86_400_000), 'accommodationDays', 'Days must cover your stay');
      }
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const coordinatorAssignSchema = z
  .object({ universityUid: text(2, 40), userId: z.string().cuid() })
  .strict();

export const dutySchema = z
  .object({
    title: text(3, 120),
    description: text(0, 1000).optional(),
    venue: text(2, 120),
    startsAt: z.string().datetime({ local: true }),
    endsAt: z.string().datetime({ local: true }),
    assignedToId: z.string().cuid(),
  })
  .strict()
  .refine((v) => new Date(v.endsAt) > new Date(v.startsAt), { path: ['endsAt'], message: 'End must be after start' });
