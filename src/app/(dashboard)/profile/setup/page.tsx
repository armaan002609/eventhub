import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileSetupForm from "./ProfileSetupForm";

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if profile already set up (has username)
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { university: true }
  });

  if (dbUser?.username && dbUser?.idProofPath) {
    // Already setup
    redirect('/dashboard');
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 py-8">
      <div>
        <h1 className="text-3xl font-black text-[#554093] tracking-tight">Complete Your Profile</h1>
        <p className="text-[#554093]/70 font-medium mt-2">Before you can participate in events or join teams, we need a few more details.</p>
      </div>

      <ProfileSetupForm userId={dbUser?.id || ''} initialData={dbUser} />
    </div>
  );
}
