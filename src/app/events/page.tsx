import React from "react";
import { prisma } from '@/lib/db';
import Navbar from '@/components/Navbar';

export default async function EventsPage() {
  const hackathons = await prisma.hackathon.findMany({
    where: { isPublished: true },
    orderBy: { startsAt: 'asc' }
  });

  return (
    <>
      <Navbar />
      <main className="pt-12 pb-24 max-w-[1400px] mx-auto px-8 w-full flex-1">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#554093] mb-4">All Events</h1>
            <p className="text-[#554093]/70 font-medium text-lg">Discover open hackathons, build things, and get hired.</p>
          </div>
          
          {/* Devfolio-style Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button className="px-5 py-2.5 bg-[#554093] text-white rounded-full text-[13px] font-bold whitespace-nowrap shadow-md shadow-[#554093]/20 transition-transform hover:scale-105">
              All
            </button>
            <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
              Open
            </button>
            <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
              Upcoming
            </button>
            <button className="px-5 py-2.5 bg-[#554093]/5 text-[#554093] rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#554093]/10 transition-colors">
              Past
            </button>
          </div>
        </div>

        {hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => {
              const startsInDays = Math.max(0, Math.ceil((hackathon.startsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
              const isClosed = hackathon.endsAt < new Date();
              const badgeText = isClosed ? "Applications Closed" : (startsInDays <= 7 ? `Starts in ${startsInDays} days` : "Apply Now");
              
              return (
                <div key={hackathon.id} className="bg-[#FDFBF7] rounded-2xl overflow-hidden border border-[#554093]/10 hover:shadow-xl hover:shadow-[#554093]/5 transition-all duration-300 group cursor-pointer flex flex-col h-full relative">
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
                      {hackathon.prizeText && (
                        <span className="bg-[#554093]/5 text-[#554093] text-[11px] font-bold px-2.5 py-1 rounded-md">{hackathon.prizeText}</span>
                      )}
                    </div>

                    <div className="mt-auto pt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#554093]/60">
                        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {hackathon.startsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {hackathon.endsAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        ) : (
          <div className="text-center py-20 bg-[#FDFBF7] rounded-2xl border border-[#554093]/10">
             <div className="w-16 h-16 bg-[#554093]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#554093]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <h3 className="text-lg font-bold text-[#554093]">No Events Found</h3>
             <p className="text-[#554093]/60 mt-2 max-w-sm mx-auto">There are no open events at this time. Check back later for upcoming hackathons.</p>
          </div>
        )}

      </main>
    </>
  );
}
