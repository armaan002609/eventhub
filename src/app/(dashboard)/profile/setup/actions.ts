'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

export async function updateProfile(userId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return { error: 'Not authenticated' };
  }

  const username = formData.get('username') as string;
  const phone = formData.get('phone') as string;
  const fathersName = formData.get('fathersName') as string;
  const fathersPhone = formData.get('fathersPhone') as string;
  const rollNumber = formData.get('rollNumber') as string;
  const department = formData.get('department') as string;
  const address = formData.get('address') as string;
  const universityName = formData.get('universityName') as string;
  const file = formData.get('idProof') as File;

  if (!phone || !fathersName || !rollNumber || !file || file.size === 0) {
    return { error: 'Missing required fields' };
  }

  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  
  // If username is already set on the user, ignore the submitted one
  const finalUsername = existingUser?.username || username;

  if (!finalUsername) {
    return { error: 'Username is required' };
  }

  // Check if username is taken
  const existingUsernameCheck = await prisma.user.findUnique({
    where: { username: finalUsername }
  });

  if (existingUsernameCheck && existingUsernameCheck.id !== userId) {
    return { error: 'Username is already taken' };
  }

  // Upload file to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}-${uuidv4()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('id-proofs')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    return { error: `Storage Error: Make sure you have created a public bucket named 'id-proofs'. (${uploadError.message})` };
  }

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
      data: { uid, name: universityName }
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      username: finalUsername,
      phone,
      fathersName,
      fathersPhone,
      rollNumber,
      department,
      address,
      idProofPath: publicUrl,
      universityId: university.id
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/profile/setup');
  
  return { success: true };
}
