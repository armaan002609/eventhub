import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { updateProfilePicture } from "./actions";
import Image from "next/image";

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
        <h2 className="text-xl font-bold text-[#554093] mb-6">Profile Picture</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-[#554093]/10 overflow-hidden bg-[#FDFBF7] flex-shrink-0 relative">
            {dbUser?.profilePicturePath ? (
              <Image 
                src={dbUser.profilePicturePath} 
                alt="Profile" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#554093]/40">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          
          <form action={updateProfilePicture} className="flex-1 w-full max-w-sm">
            <label className="block text-[13px] font-bold tracking-widest uppercase text-[#554093] mb-2">
              Upload New Picture
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                required
                className="flex-1 appearance-none block w-full px-4 py-2.5 border-2 border-[#554093]/20 bg-white text-[#554093] rounded-xl focus:outline-none focus:border-[#554093] focus:ring-0 transition-colors text-[14px] file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-bold file:bg-[#554093]/10 file:text-[#554093] hover:file:bg-[#554093]/20"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#554093] text-white text-[13px] font-bold uppercase tracking-wider rounded-xl hover:bg-[#433275] transition-colors whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        <h2 className="text-xl font-bold text-[#554093] mb-6 pt-6 border-t border-[#554093]/10">Profile Information</h2>
        
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
