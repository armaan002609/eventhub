import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! }
  });

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-[#554093] tracking-tight">Settings</h1>
        <p className="text-[#554093]/70 font-medium mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-[#554093]/10 shadow-[0_4px_24px_rgba(85,64,147,0.05)]">
        <h2 className="text-xl font-bold text-[#554093] mb-6">Profile Information</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Name
              </label>
              <div className="px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] text-[#554093] rounded-2xl text-[15px] font-medium">
                {dbUser?.name || 'Not set'}
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Email
              </label>
              <div className="px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] text-[#554093] rounded-2xl text-[15px] font-medium">
                {dbUser?.email || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Username
              </label>
              <div className="px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] text-[#554093] rounded-2xl text-[15px] font-medium">
                {dbUser?.username || 'Not set'}
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
                Phone
              </label>
              <div className="px-5 py-4 border-2 border-[#554093]/10 bg-[#FDFBF7] text-[#554093] rounded-2xl text-[15px] font-medium">
                {dbUser?.phone || 'Not set'}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#554093]/10">
            <p className="text-[13px] font-medium text-[#554093]/60 italic">
              More settings and profile editing will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
