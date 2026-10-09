'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { uploadProfilePicture } from '@/lib/storage'
import { prisma } from '@/lib/db'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const profilePicture = formData.get('profilePicture') as File | null

  if (!profilePicture || profilePicture.size === 0) {
    redirect('/register?error=' + encodeURIComponent('Profile picture is required'))
  }

  let profilePicturePath = ''
  try {
    profilePicturePath = await uploadProfilePicture(profilePicture)
  } catch (error) {
    redirect('/register?error=' + encodeURIComponent('Failed to upload profile picture'))
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role: 'participant', // default role
        profilePicturePath,
      }
    }
  })

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  if (data.user) {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: email,
        name: name,
        profilePicturePath: profilePicturePath,
      },
      create: {
        id: data.user.id,
        email: email,
        passwordHash: '', // Password managed by Supabase
        name: name,
        role: 'PARTICIPANT',
        profilePicturePath: profilePicturePath,
      },
    })
  }

  // Optionally, you can insert the user into a public.users table or just rely on auth.users
  // If no email confirmation is required, they will be logged in. 
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}
