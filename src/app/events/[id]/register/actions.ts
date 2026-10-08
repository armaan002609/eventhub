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
  const fathersName = formData.get('fathersName') as string;
  const fathersPhone = formData.get('fathersPhone') as string;
  const rollNumber = formData.get('rollNumber') as string;
  const department = formData.get('department') as string;
  const address = formData.get('address') as string;
  const teamSize = parseInt(formData.get('teamSize') as string || '1', 10);
  
  const needsTransport = formData.get('needsTransport') === 'true';
  const boardingPointName = formData.get('boardingPointName') as string;
  
  const needsAccommodation = formData.get('needsAccommodation') === 'true';
  const accommodationDays = parseInt(formData.get('accommodationDays') as string || '1', 10);
  
  const needsFood = formData.get('needsFood') === 'true';
  const mealsPerDay = parseInt(formData.get('mealsPerDay') as string || '3', 10);

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

  // Find or Create Boarding Point
  let boardingPointId = null;
  if (needsTransport && boardingPointName) {
    let bp = await prisma.boardingPoint.findUnique({ where: { name: boardingPointName } });
    if (!bp) {
      bp = await prisma.boardingPoint.create({ data: { name: boardingPointName, charge: 0 } });
    }
    boardingPointId = bp.id;
  }

  // Fetch Hackathon to get fees
  const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
  if (!hackathon) {
    return { error: 'Event not found' };
  }

  // Calculate fees (multiply by days/meals/teamSize if appropriate, but keeping it simple for now based on base schemas)
  // According to previous logic, it's flat fees, but we can multiply by teamSize for base fee.
  const baseFee = hackathon.baseFee * teamSize;
  const transportFee = needsTransport ? hackathon.transportFee : 0; // Or multiply by teamSize?
  const accommodationFee = needsAccommodation ? (hackathon.accommodationFee * accommodationDays) : 0;
  const foodFee = needsFood ? (hackathon.foodFee * mealsPerDay * accommodationDays) : 0;
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
      fathersName,
      fathersPhone,
      rollNumber,
      department,
      address,
      teamSize,
      email: user.email || '',
      universityId: university.id,
      idProofPath: publicUrl,
      teamName,
      teamMembers,
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

  revalidatePath(`/events/${hackathonId}`);
  revalidatePath('/dashboard');
  return { success: true };
}
