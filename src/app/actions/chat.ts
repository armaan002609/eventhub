'use server';

import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export async function getChatContacts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, universityId: true }
  });
  if (!dbUser) return [];

  const { role } = dbUser;

  // PARTICIPANT cannot chat
  if (role === 'PARTICIPANT') return [];

  let queryRoles: any[] = [];
  
  if (role === 'SUPER_ADMIN') {
    queryRoles = ['COORDINATOR', 'VOLUNTEER'];
  } else if (role === 'COORDINATOR') {
    queryRoles = ['SUPER_ADMIN', 'VOLUNTEER'];
  } else if (role === 'VOLUNTEER') {
    queryRoles = ['COORDINATOR'];
  }

  // Find users with those roles
  const contacts = await prisma.user.findMany({
    where: {
      role: { in: queryRoles },
      isActive: true,
      // If we want to restrict to same university? The prompt didn't say, but usually volunteers report to coordinators of the same university.
      // But let's keep it simple: just by role globally, or we can restrict.
      // Let's restrict volunteer/coordinator to same university if applicable, but super_admin is global.
      ...(role !== 'SUPER_ADMIN' && dbUser.universityId ? {
        OR: [
          { role: 'SUPER_ADMIN' }, // can always talk to super admin
          { universityId: dbUser.universityId } // same university
        ]
      } : {})
    },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      university: { select: { name: true } }
    },
    orderBy: { name: 'asc' }
  });

  return contacts;
}

export async function getMessages(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: user.id }
      ]
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
      senderId: true,
      receiverId: true,
      read: true,
      sender: { select: { name: true, role: true } }
    }
  });

  return messages;
}

export async function sendMessage(receiverId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  if (!content.trim()) throw new Error("Empty message");

  const msg = await prisma.chatMessage.create({
    data: {
      senderId: user.id,
      receiverId,
      content: content.trim()
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      senderId: true,
      receiverId: true,
      read: true,
      sender: { select: { name: true, role: true } }
    }
  });

  return msg;
}

export async function markAsRead(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await prisma.chatMessage.updateMany({
    where: {
      senderId: otherUserId,
      receiverId: user.id,
      read: false
    },
    data: {
      read: true
    }
  });
}
