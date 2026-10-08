import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  const role = dbUser?.role || 'PARTICIPANT';

  if (role === 'SUPER_ADMIN') redirect('/super-admin');
  if (role === 'COORDINATOR') redirect('/coordinator');
  if (role === 'VOLUNTEER') redirect('/volunteer');
  
  redirect('/participant');
}
