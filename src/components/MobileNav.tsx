'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 -ml-2 text-[#554093] hover:bg-[#554093]/10 rounded-xl"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-[280px] h-full bg-white flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#554093] hover:bg-[#554093]/10 rounded-xl"
            >
              <X size={24} />
            </button>

            <div>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 mb-10" onClick={() => setIsOpen(false)}>
                <div className="w-7 h-7 rounded-full border-[3px] border-[#554093] flex flex-col justify-center items-center gap-0.5">
                   <div className="w-4 h-[2px] bg-[#554093]"></div>
                   <div className="w-4 h-[2px] bg-[#554093]"></div>
                   <div className="w-4 h-[2px] bg-[#554093]"></div>
                </div>
                <span className="font-bold text-2xl tracking-tight text-[#554093]">eventhub</span>
              </Link>

              {/* Nav */}
              <nav className="space-y-1">
                {role === 'SUPER_ADMIN' && (
                  <Link href="/super-admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                    Super Admin
                  </Link>
                )}

                {(role === 'COORDINATOR' || role === 'SUPER_ADMIN') && (
                  <Link href="/coordinator" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    Coordinator
                  </Link>
                )}

                {(role === 'VOLUNTEER' || role === 'COORDINATOR' || role === 'SUPER_ADMIN') && (
                  <Link href="/volunteer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    Volunteer
                  </Link>
                )}

                <Link href="/live" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors group">
                  <div className="relative">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border border-white animate-pulse"></span>
                  </div>
                  Live Scores
                </Link>

                {(role === 'COORDINATOR' || role === 'SUPER_ADMIN') && (
                  <Link href="/coordinator/live" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Live Scorer Panel
                  </Link>
                )}

                <Link href="/participant" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Participant
                </Link>

                <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Leaderboard
                </Link>
              </nav>
            </div>

            <nav className="space-y-1">
              <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-[#554093]/70 font-bold hover:text-[#554093] hover:bg-[#554093]/5 rounded-xl transition-colors">
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
        </div>
      )}
    </>
  );
}
