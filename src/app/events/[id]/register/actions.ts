'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function registerParticipant(hackathonId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const studentName = formData.get('studentName') as string;
  const phone = formData.get('phone') as string;
  const universityName = formData.get('universityName') as string;
  const needsTransport = formData.get('needsTransport') === 'true';
  const needsAccommodation = formData.get('needsAccommodation') === 'true';
  const needsFood = formData.get('needsFood') === 'true';
  const file = formData.get('idProof') as File;
  const teamName = formData.get('teamName') as string | null;
  const teamMembers = formData.get('teamMembers') as string | null;

  if (!studentName || !phone || !universityName || !file || file.size === 0) {
    return { error: 'Missing required fields' };
  }

  // Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${uuidv4()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('id-proofs')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return { error: `Storage Error: Make sure you have created a public bucket named 'id-proofs' in your Supabase dashboard. (${uploadError.message})` };
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('id-proofs')
    .getPublicUrl(fileName);

  // Find or Create University
  // We'll create a simple hash/slug for the UID if it doesn't exist
  const uid = universityName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  let university = await prisma.university.findFirst({
    where: { uid }
  });

  if (!university) {
    university = await prisma.university.create({
      data: {
        uid,
        name: universityName
      }
    });
  }
  // Fetch Hackathon to get fees
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    return { error: 'Event not found' };
  }

  // Calculate fees
  const baseFee = hackathon.baseFee;
  const transportFee = needsTransport ? hackathon.transportFee : 0;
  const accommodationFee = needsAccommodation ? hackathon.accommodationFee : 0;
  const foodFee = needsFood ? hackathon.foodFee : 0;
  const totalFee = baseFee + transportFee + accommodationFee + foodFee;

  // Check if already registered
  const existing = await prisma.registration.findUnique({
    where: {
      userId_hackathonId: {
        userId: user.id,
        hackathonId,
      }
    }
  });

  if (existing) {
    return { error: 'You are already registered for this event.' };
  }

  // Create Registration
  await prisma.registration.create({
    data: {
      userId: user.id,
      hackathonId,
      studentName,
      phone,
      email: user.email || '',
      universityId: university.id,
      idProofPath: publicUrl,
      teamName,
      teamMembers,
      needsTransport,
      transportFee,
      needsAccommodation,
      accommodationFee,
      needsFood,
      foodFee,
      totalFee
    }
  });

  revalidatePath(`/events/${hackathonId}`);
  revalidatePath('/dashboard');
  return { success: true };
}
