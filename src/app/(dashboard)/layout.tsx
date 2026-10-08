import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import MobileNav from "@/components/MobileNav";
import ChatWidget from "@/components/chat/ChatWidget";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'PARTICIPANT';
  let userName = 'User';
  let userEmail = '';

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true, email: true }
    });
    if (dbUser) {
      role = dbUser.role;
      userName = dbUser.name;
      userEmail = dbUser.email;
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#554093]/20 selection:text-[#554093]">
      <div className="flex h-screen overflow-hidden p-3 gap-3">
        
        {/* Sidebar */}
        <aside className="w-[280px] bg-white hidden lg:flex flex-col justify-between shrink-0 border border-[#554093]/10 rounded-3xl h-full overflow-hidden shadow-[0_4px_24px_rgba(85,64,147,0.05)]">
          <div className="p-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-10 px-2">
              <div className="w-7 h-7 rounded-full border-[3px] border-[#554093] flex flex-col justify-center items-center gap-0.5">
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#554093]">eventhub</span>
            </Link>

            {/* Nav */}
            <nav className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-[#554093] font-bold bg-[#554093]/10 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dashboard
              </Link>

              <Link href="/live" className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors group">
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                </div>
                Live Scores
              </Link>

              {(role === 'COORDINATOR' || role === 'SUPER_ADMIN') && (
                <Link href="/coordinator/live" className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Live Scorer Panel
                </Link>
              )}

              <Link href="/leaderboard" className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Live Leaderboard
              </Link>
            </nav>
          </div>

          <div className="p-6">
            <nav className="space-y-1">
              <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                Settings
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Log Out
                </button>
              </form>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#FDFBF7] h-full rounded-3xl overflow-hidden relative">
          {/* Header */}
          <header className="px-4 sm:px-8 py-5 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-40 border-b border-[#554093]/5">
            <div className="flex items-center gap-4">
              <MobileNav role={role} />
              
              <div className="relative w-full max-w-[280px] hidden sm:block">
                <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#554093]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Quick search..." className="w-full pl-11 pr-4 py-2 bg-white border border-[#554093]/10 rounded-full text-[13px] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:ring-2 focus:ring-[#554093] outline-none transition-all placeholder:text-[#554093]/40 font-bold text-[#554093]" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              
              <button className="relative text-[#554093]/50 hover:text-[#554093] p-2 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>

              <div className="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-[#554093]/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#554093] to-[#7B61C8] overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-white font-black text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[13px] font-bold text-[#554093] leading-tight">{userName}</p>
                  <p className="text-[11px] text-[#554093]/60 font-bold uppercase tracking-wider">{role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="px-8 pb-8 pt-4 overflow-y-auto custom-scrollbar flex-1">
            {children}
          </div>
        </main>
      </div>

      {role !== 'PARTICIPANT' && (
        <ChatWidget currentUser={{ id: user?.id || '', role, name: userName }} />
      )}
    </div>
  );
}
