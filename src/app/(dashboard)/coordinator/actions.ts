'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function createDuty(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const requester = await prisma.user.findUnique({ where: { id: user.id } });
    if (requester?.role !== 'SUPER_ADMIN' && requester?.role !== 'COORDINATOR') {
      return { error: 'Not authorized' };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const venue = formData.get("venue") as string;
    const startsAtStr = formData.get("startsAt") as string;
    const endsAtStr = formData.get("endsAt") as string;
    const assignedToId = formData.get("assignedToId") as string;
    const level = requester.role === 'SUPER_ADMIN' ? 'HIGH_LEVEL' : 'TASK';

    if (!title || !venue || !startsAtStr || !endsAtStr || !assignedToId) {
      return { error: 'Missing required fields' };
    }

    await prisma.duty.create({
      data: {
        title,
        description: description || null,
        venue,
        startsAt: new Date(startsAtStr),
        endsAt: new Date(endsAtStr),
        level,
        createdById: requester.id,
        assignedToId,
      }
    });

    revalidatePath('/coordinator');
    revalidatePath('/super-admin');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Unknown error occurred' };
  }
}

export async function deleteDuty(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN' && requester?.role !== 'COORDINATOR') {
    throw new Error('Not authorized');
  }

  await prisma.duty.delete({
    where: { id }
  });

  revalidatePath('/coordinator');
  revalidatePath('/super-admin');
}
