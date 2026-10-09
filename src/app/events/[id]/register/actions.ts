'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function registerParticipant(hackathonId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || !dbUser.username || !dbUser.universityId) {
    return { error: 'You must complete your profile setup before registering.' };
  }

  const registrationType = formData.get('registrationType') as 'SOLO' | 'TEAM';

  // Logistics
  const needsTransport = formData.get('needsTransport') === 'true';
  const boardingPointName = formData.get('boardingPointName') as string;
  const transportCount = registrationType === 'TEAM' ? parseInt(formData.get('transportCount') as string || '1', 10) : 1;
  
  const needsAccommodation = formData.get('needsAccommodation') === 'true';
  const accommodationDays = parseInt(formData.get('accommodationDays') as string || '1', 10);
  const accommodationCount = registrationType === 'TEAM' ? parseInt(formData.get('accommodationCount') as string || '1', 10) : 1;
  
  const needsFood = formData.get('needsFood') === 'true';
  const mealsPerDay = parseInt(formData.get('mealsPerDay') as string || '3', 10);
  const foodCount = registrationType === 'TEAM' ? parseInt(formData.get('foodCount') as string || '1', 10) : 1;

  // Find or Create Boarding Point
  let boardingPointId = null;
  if (needsTransport && boardingPointName) {
    let bp = await prisma.boardingPoint.findUnique({ where: { name: boardingPointName } });
    if (!bp) {
      bp = await prisma.boardingPoint.create({ data: { name: boardingPointName, charge: 0 } });
    }
    boardingPointId = bp.id;
  }

  // Fetch Hackathon to get base fees
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    return { error: 'Event not found' };
  }

  if (registrationType === 'SOLO') {
    // Check if already registered
    const existingSolo = await prisma.registration.findFirst({ where: { userId: user.id, hackathonId } });
    const existingTeam = await prisma.teamMember.findFirst({ where: { userId: user.id, team: { hackathonId } } });
    
    if (existingSolo || existingTeam) {
      return { error: 'You are already registered for this event.' };
    }

    const baseFee = hackathon.baseFee;
    const transportFee = needsTransport ? hackathon.transportFee : 0;
    const accommodationFee = needsAccommodation ? (hackathon.accommodationFee * accommodationDays) : 0;
    const foodFee = needsFood ? (hackathon.foodFee * mealsPerDay * accommodationDays) : 0;
    const totalFee = baseFee + transportFee + accommodationFee + foodFee;

    await prisma.registration.create({
      data: {
        userId: user.id,
        hackathonId,
        universityId: dbUser.universityId,
        teamSize: 1,
        needsTransport,
        boardingPointId,
        transportFee,
        needsAccommodation,
        accommodationDays,
        accommodationFee,
        needsFood,
        mealsPerDay,
        foodFee,
        totalFee
      }
    });

  } else {
    // TEAM logic
    const teamName = formData.get('teamName') as string;
    const teamUsernamesRaw = formData.get('teamUsernames') as string;

    if (!teamName || !teamUsernamesRaw) {
      return { error: 'Team name and member usernames are required.' };
    }

    const usernamesList = teamUsernamesRaw.split(',').map(u => u.trim().toLowerCase()).filter(u => u !== '');
    
    if (usernamesList.length === 0) {
      return { error: 'You must add at least one teammate.' };
    }
    
    if (usernamesList.includes(dbUser.username.toLowerCase())) {
      return { error: 'Do not include your own username in the teammate list.' };
    }

    const teammates = await prisma.user.findMany({
      where: { username: { in: usernamesList } }
    });

    if (teammates.length !== usernamesList.length) {
      const foundUsernames = teammates.map(t => t.username?.toLowerCase());
      const missing = usernamesList.filter(u => !foundUsernames.includes(u));
      return { error: `Could not find users with usernames: ${missing.join(', ')}` };
    }

    // Check if any member (including leader) is already registered
    const allUserIds = [user.id, ...teammates.map(t => t.id)];
    
    const existingSolos = await prisma.registration.findMany({
      where: { userId: { in: allUserIds }, hackathonId }
    });
    
    if (existingSolos.length > 0) {
      return { error: 'One or more members are already registered as solo participants.' };
    }

    const existingTeamMembers = await prisma.teamMember.findMany({
      where: { userId: { in: allUserIds }, team: { hackathonId } }
    });

    if (existingTeamMembers.length > 0) {
      return { error: 'One or more members are already part of another team for this event.' };
    }

    const existingTeamName = await prisma.team.findUnique({
      where: { name_hackathonId: { name: teamName, hackathonId } }
    });

    if (existingTeamName) {
      return { error: 'This team name is already taken for this event.' };
    }

    const totalTeamSize = teammates.length + 1; // +1 for leader

    const baseFee = hackathon.baseFee * totalTeamSize;
    const transportFee = needsTransport ? (hackathon.transportFee * transportCount) : 0;
    const accommodationFee = needsAccommodation ? (hackathon.accommodationFee * accommodationDays * accommodationCount) : 0;
    const foodFee = needsFood ? (hackathon.foodFee * mealsPerDay * accommodationDays * foodCount) : 0;
    const totalFee = baseFee + transportFee + accommodationFee + foodFee;

    // Create Team, Members, and Registration in a transaction
    await prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: {
          name: teamName,
          hackathonId,
          leaderId: user.id,
          members: {
            create: [
              {
                userId: user.id,
                status: 'ACCEPTED' // Leader is automatically accepted
              },
              ...teammates.map(t => ({
                userId: t.id,
                status: 'PENDING'
              }))
            ]
          }
        }
      });

      await tx.registration.create({
        data: {
          teamId: team.id,
          hackathonId,
          universityId: dbUser.universityId!,
          teamSize: totalTeamSize,
          needsTransport,
          boardingPointId,
          transportFee,
          needsAccommodation,
          accommodationDays,
          accommodationFee,
          needsFood,
          mealsPerDay,
          foodFee,
          totalFee
        }
      });
    });
  }

  revalidatePath(`/events/${hackathonId}`);
  revalidatePath('/dashboard');
  return { success: true };
}
