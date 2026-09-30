'use server';

import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Super Admin & Coordinator allowed
export async function updateMatchScore(matchId: string, scoreData: any, actionType: string) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || (dbUser.role !== 'SUPER_ADMIN' && dbUser.role !== 'COORDINATOR')) {
    throw new Error("Unauthorized role");
  }

  // Update Match
  const updatedMatch = await prisma.match.update({
    where: { id: matchId },
    data: { scoreData }
  });

  // Log action
  await prisma.matchLog.create({
    data: {
      matchId: matchId,
      action: actionType,
      createdById: dbUser.id
    }
  });

  // Revalidate so Server Components show the latest on refresh
  revalidatePath(`/live/${matchId}`);
  revalidatePath(`/coordinator/live/${matchId}`);

  return updatedMatch;
}

export async function updateMatchStatus(matchId: string, status: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || (dbUser.role !== 'SUPER_ADMIN' && dbUser.role !== 'COORDINATOR')) {
    throw new Error("Unauthorized role");
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { status }
  });

  revalidatePath(`/live/${matchId}`);
  revalidatePath(`/coordinator/live/${matchId}`);
  revalidatePath(`/live`);
  revalidatePath(`/coordinator/live`);
}

export async function createMatch(title: string, sport: 'CRICKET' | 'FOOTBALL' | 'BADMINTON' | 'WRESTLING' | 'CANOEING') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!dbUser || (dbUser.role !== 'SUPER_ADMIN' && dbUser.role !== 'COORDINATOR')) {
    throw new Error("Unauthorized role");
  }

  const match = await prisma.match.create({
    data: {
      title,
      sport,
      status: 'UPCOMING',
      scoreData: {}
    }
  });

  revalidatePath(`/live`);
  revalidatePath(`/coordinator/live`);
  
  return match;
}
