import React from "react";
import Link from "next/link";
import { prisma } from '@/lib/db';
import Navbar from '@/components/Navbar';

export default async function HackathonPage() {
  const hackathons = await prisma.hackathon.findMany({
    where: { isPublished: true },
    orderBy: { startsAt: 'asc' },
    take: 3
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-8 max-w-[1400px] mx-auto text-center">
          <div className="inline-flex items-center border border-[#554093]/20 rounded-full mb-8 overflow-hidden">
            <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#554093] border-r border-[#554093]/20">SEASON 1</span>
            <span className="px-4 py-1.5 text-[14px] font-medium text-[#554093] bg-[#554093]/5">
              The ultimate hackathon experience
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#554093] mb-6 max-w-4xl mx-auto leading-[1.1]">
            Build something <br className="hidden sm:block"/> extraordinary.
          </h1>
          
          <p className="text-lg sm:text-xl text-[#554093]/70 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of builders, designers, and creators. Compete for prizes, learn new skills, and connect with top tech companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#554093] text-white rounded-full px-8 py-3.5 text-[13px] font-bold uppercase tracking-widest hover:bg-[#433275] transition-colors text-center shadow-lg shadow-[#554093]/20 hover:scale-105 transform duration-200"
            >
              Apply Now
            </Link>
            <Link
              href="/events"
              className="w-full sm:w-auto bg-transparent border border-[#554093]/30 text-[#554093] rounded-full px-8 py-3.5 text-[13px] font-bold uppercase tracking-widest hover:bg-[#554093]/5 transition-colors text-center"
            >
              View Schedule
            </Link>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-20 px-8 bg-[#FDFBF7] border-t border-b border-[#554093]/10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#554093]/10 text-[#554093] flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#554093] mb-3">Fast-Paced Building</h3>
              <p className="text-[#554093]/70 leading-relaxed">Turn your ideas into reality in 48 hours. We provide the food, drinks, and space; you bring the innovation.</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#554093]/10 text-[#554093] flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#554093] mb-3">Networking & Mentorship</h3>
              <p className="text-[#554093]/70 leading-relaxed">Connect with industry experts, find co-founders, and get guidance from engineers at top companies.</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#554093]/10 text-[#554093] flex items-center justify-center mb-6 mx-auto md:mx-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#554093] mb-3">Prizes & Opportunities</h3>
              <p className="text-[#554093]/70 leading-relaxed">Win cash prizes, software credits, hardware, and even land interviews with our sponsor companies.</p>
            </div>
          </div>
        </section>

        {/* Featured Hackathons */}
        <section className="py-20 px-8 max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#554093] tracking-tight mb-2">Upcoming Hackathons</h2>
              <p className="text-[#554093]/70">Find the perfect event to showcase your skills.</p>
            </div>
            <Link href="/events" className="hidden sm:flex text-[13px] font-bold text-[#554093] hover:opacity-70 transition-opacity items-center gap-1">
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => {
              const startsInDays = Math.max(0, Math.ceil((hackathon.startsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              const isClosed = hackathon.endsAt < new Date();
              const badgeText = isClosed ? "Applications Closed" : (startsInDays <= 7 ? `Starts in ${startsInDays} days` : "Apply Now");
              
              return (
                <div key={hackathon.id} className="bg-white rounded-2xl overflow-hidden border border-[#554093]/10 hover:shadow-xl hover:shadow-[#554093]/5 transition-all duration-300 group cursor-pointer flex flex-col h-full relative">
                  {/* Cover Image / Gradient */}
                  <div className={`h-32 w-full bg-gradient-to-r relative ${
                    !hackathon.imagePath ? (isClosed ? "from-rose-500 to-orange-400" : (startsInDays <= 7 ? "from-[#554093] to-[#7B61C8]" : "from-emerald-500 to-teal-400")) : ""
                  }`}
                  style={hackathon.imagePath ? { backgroundImage: `url(${hackathon.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                  >
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                      {badgeText}
                    </div>
                  </div>
                  
                  {/* Logo (Overlapping) */}
                  <div className="px-5 relative">
                    <div className="w-14 h-14 rounded-xl bg-white shadow-md border border-[#554093]/10 flex items-center justify-center -mt-7 mb-3 overflow-hidden p-2">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${isClosed ? "from-rose-400 to-orange-400" : "from-indigo-500 to-purple-400"}`}></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 flex flex-col flex-1">
                    <h3 className="text-[17px] font-bold text-[#554093] group-hover:text-[#3B2C66] transition-colors line-clamp-1">{hackathon.title}</h3>
                    <p className="text-[13px] text-[#554093]/60 font-medium mt-1">by {hackathon.organizer}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{hackathon.location}</span>
                      {hackathon.themes.map((theme, i) => (
                        <span key={i} className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{theme}</span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#554093]/60">
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {hackathon.startsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {hackathon.participants > 0 && (
                             <span className="text-[11px] font-bold text-[#554093]/60">{hackathon.participants.toLocaleString()} Builders</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="text-[13px] font-bold text-[#554093] border border-[#554093]/20 rounded-full px-6 py-2.5 inline-block">
              View all events
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
