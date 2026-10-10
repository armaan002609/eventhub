'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { uploadHackathonImage } from '@/lib/storage';

export async function updateUserRole(userId: string, newRole: 'SUPER_ADMIN' | 'COORDINATOR' | 'VOLUNTEER' | 'PARTICIPANT') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  // Verify the requester is a SUPER_ADMIN
  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') {
    throw new Error('Not authorized');
  }

  // Update the target user's role
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateIdProofStatus(registrationId: string, status: 'VERIFIED' | 'REJECTED') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN' && requester?.role !== 'COORDINATOR') {
    throw new Error('Not authorized');
  }

  await prisma.user.update({
    where: { id: registrationId },
    data: { idProofStatus: status }
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function createHackathon(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  const title = formData.get("title") as string;
  const organizer = formData.get("organizer") as string;
  const location = formData.get("location") as string;
  const themesStr = formData.get("themes") as string;
  const prizeText = formData.get("prizeText") as string;
  const startsAtStr = formData.get("startsAt") as string;
  const endsAtStr = formData.get("endsAt") as string;
  const eventType = formData.get("eventType") as string || "Event";

  const baseFee = parseInt(formData.get("baseFee") as string || "500");
  const transportFee = parseInt(formData.get("transportFee") as string || "350");
  const accommodationFee = parseInt(formData.get("accommodationFee") as string || "1500");
  const foodFee = parseInt(formData.get("foodFee") as string || "900");

  if (!title || !organizer || !location || !startsAtStr || !endsAtStr) {
    throw new Error("Missing required fields");
  }

  const themes = themesStr.split(',').map(t => t.trim()).filter(Boolean);

  const imageFile = formData.get('image') as File | null;
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Landscape photo is required");
  }
  
  const imagePath = await uploadHackathonImage(imageFile);

  const logoFile = formData.get('logo') as File | null;
  let logoPath = undefined;
  if (logoFile && logoFile.size > 0) {
    logoPath = await uploadHackathonImage(logoFile);
  }

  await prisma.hackathon.create({
    data: {
      title,
      organizer,
      location,
      themes,
      prizeText: prizeText || null,
      startsAt: new Date(startsAtStr),
      endsAt: new Date(endsAtStr),
      isPublished: true,
      participants: 0,
      imagePath,
      ...(logoPath ? { logoPath } : {}),
      eventType,
      baseFee,
      transportFee,
      accommodationFee,
      foodFee,
    }
  });

  revalidatePath('/', 'layout');
}

export async function deleteHackathon(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  await prisma.hackathon.deleteMany({
    where: { id }
  });
  revalidatePath('/', 'layout');
}


export async function createCommittee(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  await prisma.committee.create({
    data: {
      hackathonId: formData.get("hackathonId") as string,
      committeeName: formData.get("committeeName") as string,
      inCharge: formData.get("inCharge") as string,
      contactDetails: formData.get("contactDetails") as string || null,
      responsibility: formData.get("responsibility") as string || null,
      duty: formData.get("duty") as string || null,
      venue: formData.get("venue") as string || null,
      remarks: formData.get("remarks") as string || null,
    }
  });

  revalidatePath('/', 'layout');
}

export async function updateCommittee(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  await prisma.committee.update({
    where: { id },
    data: {
      committeeName: formData.get("committeeName") as string,
      inCharge: formData.get("inCharge") as string,
      contactDetails: formData.get("contactDetails") as string || null,
      responsibility: formData.get("responsibility") as string || null,
      duty: formData.get("duty") as string || null,
      venue: formData.get("venue") as string || null,
      remarks: formData.get("remarks") as string || null,
    }
  });

  revalidatePath('/', 'layout');
}

export async function deleteCommittee(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  await prisma.committee.delete({ where: { id } });
  revalidatePath('/', 'layout');
}

export async function updateHackathon(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  const title = formData.get("title") as string;
  const organizer = formData.get("organizer") as string;
  const location = formData.get("location") as string;
  const themesStr = formData.get("themes") as string;
  const prizeText = formData.get("prizeText") as string;
  const startsAtStr = formData.get("startsAt") as string;
  const endsAtStr = formData.get("endsAt") as string;
  const eventType = formData.get("eventType") as string || "Event";

  const baseFee = parseInt(formData.get("baseFee") as string || "500");
  const transportFee = parseInt(formData.get("transportFee") as string || "350");
  const accommodationFee = parseInt(formData.get("accommodationFee") as string || "1500");
  const foodFee = parseInt(formData.get("foodFee") as string || "900");

  if (!title || !organizer || !location || !startsAtStr || !endsAtStr) {
    throw new Error("Missing required fields");
  }

  const themes = themesStr.split(',').map(t => t.trim()).filter(Boolean);

  let imagePath = undefined;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0) {
    imagePath = await uploadHackathonImage(imageFile);
  }

  let logoPath = undefined;
  const logoFile = formData.get('logo') as File | null;
  if (logoFile && logoFile.size > 0) {
    logoPath = await uploadHackathonImage(logoFile);
  }

  await prisma.hackathon.update({
    where: { id },
    data: {
      title,
      organizer,
      location,
      themes,
      prizeText: prizeText || null,
      startsAt: new Date(startsAtStr),
      endsAt: new Date(endsAtStr),
      eventType,
      baseFee,
      transportFee,
      accommodationFee,
      foodFee,
      ...(imagePath ? { imagePath } : {}),
      ...(logoPath ? { logoPath } : {}),
    }
  });

  revalidatePath('/', 'layout');
}

export async function deleteRegistration(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  const registration = await prisma.registration.findUnique({
    where: { id },
    include: { team: { include: { members: true } } }
  });

  if (registration) {
    const userIdsToReset: string[] = [];
    if (registration.userId) {
      userIdsToReset.push(registration.userId);
    } else if (registration.teamId && registration.team) {
      userIdsToReset.push(registration.team.leaderId);
      registration.team.members.forEach(m => userIdsToReset.push(m.userId));
    }

    if (userIdsToReset.length > 0) {
      await prisma.user.updateMany({
        where: { id: { in: userIdsToReset } },
        data: { 
          idProofStatus: 'PENDING',
          idProofPath: null 
        }
      });
    }

    if (registration.teamId) {
      await prisma.team.delete({
        where: { id: registration.teamId }
      });
    } else {
      await prisma.registration.delete({
        where: { id }
      });
    }
  }

  revalidatePath('/', 'layout');
}
