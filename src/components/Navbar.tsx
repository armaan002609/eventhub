import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/db';
import MobileMenu from './MobileMenu';

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userRole = 'PARTICIPANT';
  let dashboardPath = '/dashboard';
  
  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    if (dbUser?.role) {
      userRole = dbUser.role;
    }
  }

  return (
    <header className="flex justify-between items-center py-5 px-6 md:px-8 max-w-[1400px] mx-auto w-full">
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
        
        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-[#554093]">
          <Link href="/events" className="hover:opacity-70 transition-opacity">Discover Events</Link>
          <Link href="/leaderboard" className="hover:opacity-70 transition-opacity">Leaderboard</Link>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              About
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full -left-4 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-48 bg-[#FDFBF7] rounded-xl shadow-xl border border-[#554093]/10 overflow-hidden flex flex-col py-2">
                <Link href="/about#team" className="px-5 py-2.5 text-[14px] font-medium text-[#554093] hover:bg-[#554093]/5 hover:text-[#554093] transition-colors">Our Team</Link>
                <Link href="/about#contact" className="px-5 py-2.5 text-[14px] font-medium text-[#554093] hover:bg-[#554093]/5 hover:text-[#554093] transition-colors">Contact Us</Link>
                <Link href="/about#faq" className="px-5 py-2.5 text-[14px] font-medium text-[#554093] hover:bg-[#554093]/5 hover:text-[#554093] transition-colors">FAQ</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
                {userRole}
              </span>
              <Link href={dashboardPath} className="flex items-center gap-2 font-medium text-[15px] hover:opacity-70 transition-opacity bg-[#554093]/10 px-4 py-2 rounded-full">
                <div className="w-6 h-6 rounded-full bg-[#554093] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span>Dashboard</span>
              </Link>
            </div>
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

      <div className="lg:hidden flex items-center">
        <MobileMenu userEmail={user?.email} dashboardPath={dashboardPath} />
      </div>
    </header>
  );
}
