'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MobileMenu({ userEmail, dashboardPath }: { userEmail?: string, dashboardPath?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-[#554093] hover:opacity-70 transition-opacity">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-[#FDFBF7] z-[100] flex flex-col p-6 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="flex justify-between items-center mb-10">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="w-7 h-7 rounded-full border-[3px] border-[#554093] flex flex-col justify-center items-center gap-0.5">
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
                 <div className="w-4 h-[2px] bg-[#554093]"></div>
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#554093]">eventhub</span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-[#554093] hover:opacity-70 transition-opacity bg-[#554093]/10 rounded-full">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-xl font-bold text-[#554093] overflow-y-auto pb-8 custom-scrollbar">
            <Link href="/events" onClick={() => setIsOpen(false)} className="hover:translate-x-2 transition-transform">Events</Link>
            <Link href="/hackathon" onClick={() => setIsOpen(false)} className="hover:translate-x-2 transition-transform">Hackathon</Link>
            <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="hover:translate-x-2 transition-transform">Leaderboard</Link>
            
            <div className="flex flex-col gap-4 mt-2">
              <span className="opacity-50 text-xs font-bold uppercase tracking-widest text-[#554093]">About Us</span>
              <Link href="/about#team" onClick={() => setIsOpen(false)} className="pl-4 text-lg hover:translate-x-2 transition-transform">Our Team</Link>
              <Link href="/about#contact" onClick={() => setIsOpen(false)} className="pl-4 text-lg hover:translate-x-2 transition-transform">Contact Us</Link>
              <Link href="/about#faq" onClick={() => setIsOpen(false)} className="pl-4 text-lg hover:translate-x-2 transition-transform">FAQ</Link>
            </div>
            
            <div className="w-full h-px bg-[#554093]/10 my-4"></div>

            {userEmail ? (
              <Link href={dashboardPath || '/'} onClick={() => setIsOpen(false)} className="flex items-center gap-4 bg-[#554093]/5 p-4 rounded-2xl hover:bg-[#554093]/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#554093] text-white flex items-center justify-center text-lg font-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm opacity-60 font-medium">Logged in as</span>
                  <span>Dashboard</span>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="bg-[#554093]/10 px-6 py-4 rounded-xl text-center hover:bg-[#554093]/20 transition-colors">Log in</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="text-white bg-[#554093] px-6 py-4 rounded-xl text-center hover:bg-[#433275] transition-colors shadow-xl shadow-[#554093]/20">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
