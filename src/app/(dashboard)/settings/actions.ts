'use server'

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadProfilePicture } from "@/lib/storage";

export async function updateProfilePicture(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const profilePicture = formData.get('profilePicture') as File | null;
  if (!profilePicture || profilePicture.size === 0) {
    throw new Error('Profile picture is required');
  }

  const profilePicturePath = await uploadProfilePicture(profilePicture);

  // Update in Prisma
  await prisma.user.update({
    where: { id: user.id },
    data: { profilePicturePath }
  });

  // Update in Supabase auth metadata
  await supabase.auth.updateUser({
    data: { profilePicturePath }
  });

  revalidatePath('/settings');
  revalidatePath('/', 'layout');
}
