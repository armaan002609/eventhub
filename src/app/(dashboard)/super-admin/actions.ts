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

  revalidatePath('/super-admin'); revalidatePath('/coordinator');
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

  await prisma.registration.update({
    where: { id: registrationId },
    data: { idProofStatus: status }
  });

  revalidatePath('/super-admin'); revalidatePath('/coordinator');
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

  if (!title || !organizer || !location || !startsAtStr || !endsAtStr) {
    throw new Error("Missing required fields");
  }

  const themes = themesStr.split(',').map(t => t.trim()).filter(Boolean);

  const imageFile = formData.get('image') as File | null;
  if (!imageFile || imageFile.size === 0) {
    throw new Error("Landscape photo is required");
  }
  
  const imagePath = await uploadHackathonImage(imageFile);

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
    }
  });

  revalidatePath('/');
  revalidatePath('/super-admin');
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
  revalidatePath('/');
  revalidatePath('/super-admin');
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

  revalidatePath('/super-admin');
  revalidatePath('/committees');
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

  revalidatePath('/super-admin');
  revalidatePath('/committees');
}

export async function deleteCommittee(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const requester = await prisma.user.findUnique({ where: { id: user.id } });
  if (requester?.role !== 'SUPER_ADMIN') throw new Error('Not authorized');

  await prisma.committee.delete({ where: { id } });
  revalidatePath('/super-admin');
  revalidatePath('/committees');
}
