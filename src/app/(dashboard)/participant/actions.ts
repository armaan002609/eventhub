'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function handleInviteAction(teamId: string, userId: string, action: 'ACCEPT' | 'REJECT') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    throw new Error("Not authenticated");
  }

  if (action === 'REJECT') {
    // We could delete it or mark it REJECTED
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });
  } else if (action === 'ACCEPT') {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser?.idProofPath) {
      throw new Error("You must upload an ID proof in Profile Setup before accepting this invitation.");
    }

    await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      },
      data: {
        status: 'ACCEPTED'
      }
    });
  }

  revalidatePath('/participant');
}
