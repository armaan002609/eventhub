import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'PARTICIPANT';
  let dashboardPath = '/participant';
  
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    if (dbUser?.role) {
      userRole = dbUser.role;
      if (userRole === 'SUPER_ADMIN') dashboardPath = '/super-admin';
      if (userRole === 'COORDINATOR') dashboardPath = '/coordinator';
      if (userRole === 'VOLUNTEER') dashboardPath = '/volunteer';
    }
  }

  return (
    <header className="flex justify-between items-center py-5 px-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-[3px] border-[#554093] flex flex-col justify-center items-center gap-0.5">
             <div className="w-4 h-[2px] bg-[#554093]"></div>
             <div className="w-4 h-[2px] bg-[#554093]"></div>
             <div className="w-4 h-[2px] bg-[#554093]"></div>
          </div>
          <span className="font-bold text-2xl tracking-tight">eventhub</span>
        </Link>
        
        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#554093]">
          <Link href="/events" className="hover:opacity-70 transition-opacity">Events</Link>
          <Link href="/hackathon" className="hover:opacity-70 transition-opacity">Hackathon</Link>
          <Link href="/leaderboard" className="hover:opacity-70 transition-opacity">Leaderboard</Link>
          <Link href="/about" className="hover:opacity-70 transition-opacity">About</Link>
        </nav>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link href={dashboardPath} className="flex items-center gap-2 font-medium text-[15px] hover:opacity-70 transition-opacity bg-[#554093]/10 px-4 py-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-[#554093] text-white flex items-center justify-center text-[10px] font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <span>Dashboard</span>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-5 text-[#554093]">
              <Link href="/login" className="font-medium text-[15px] hover:opacity-70 transition-opacity">Log in</Link>
              <Link href="/register" className="font-medium text-[15px] hover:opacity-70 transition-opacity">Sign up</Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
