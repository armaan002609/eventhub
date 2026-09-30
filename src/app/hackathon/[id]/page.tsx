import React from "react";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const hackathon = await prisma.hackathon.findUnique({
    where: { id: resolvedParams.id },
    include: { committees: true }
  });

  if (!hackathon) {
    return notFound();
  }

  const startsInDays = Math.max(0, Math.ceil((hackathon.startsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isClosed = hackathon.endsAt < new Date();
  const badgeText = isClosed ? "Applications Closed" : (startsInDays <= 7 ? `Starts in ${startsInDays} days` : "Apply Now");

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-8 pt-8 pb-24">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/hackathon" className="text-[#554093]/70 hover:text-[#554093] text-sm font-medium flex items-center gap-1">
            &larr; Back to Events
          </Link>
        </div>

        {/* Hero Section */}
        <div className={`w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-12 relative flex items-end ${
          !hackathon.imagePath ? (isClosed ? "bg-gradient-to-r from-rose-500 to-orange-400" : (startsInDays <= 7 ? "bg-gradient-to-r from-[#554093] to-[#7B61C8]" : "bg-gradient-to-r from-emerald-500 to-teal-400")) : ""
        }`}
        style={hackathon.imagePath ? { backgroundImage: `url(${hackathon.imagePath})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {hackathon.imagePath && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>}
          
          <div className="relative z-10 p-8 md:p-12 w-full text-white">
             <div className="flex gap-3 mb-4">
               <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/30">
                  {badgeText}
               </div>
               <div className="inline-block bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/30">
                  {hackathon.eventType}
               </div>
             </div>
             <div className="flex flex-col md:flex-row md:items-end gap-6">
               {hackathon.logoPath && (
                 <div className="w-24 h-24 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center flex-shrink-0 p-1">
                   <img src={hackathon.logoPath} alt={`${hackathon.organizer} logo`} className="w-full h-full object-contain rounded-xl block" />
                 </div>
               )}
               <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">{hackathon.title}</h1>
                 <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow">by {hackathon.organizer} &middot; {hackathon.location}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Details & Committees */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1 space-y-8">
            {/* Event Info Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-[#554093]/10 shadow-sm">
              <h3 className="text-lg font-bold text-[#554093] mb-4">Event Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#554093]/50">Dates</p>
                  <p className="text-[14px] font-medium text-[#554093]">{hackathon.startsAt.toLocaleDateString()} &mdash; {hackathon.endsAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#554093]/50">Themes</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hackathon.themes.map((t, i) => <span key={i} className="bg-[#554093]/5 text-[#554093] px-2 py-1 rounded text-xs font-bold">{t}</span>)}
                  </div>
                </div>
                {hackathon.prizeText && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#554093]/50">Prize</p>
                    <p className="text-[14px] font-medium text-[#554093]">{hackathon.prizeText}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-[#554093]/10">
                {!isClosed ? (
                  <Link href={`/hackathon/${hackathon.id}/register`} className="block w-full bg-[#554093] text-white text-center font-bold py-3.5 rounded-xl shadow-[0_2px_8px_rgba(85,64,147,0.2)] hover:bg-[#3B2C66] transition-colors">
                    Apply Now
                  </Link>
                ) : (
                  <button disabled className="block w-full bg-[#554093]/10 text-[#554093]/40 text-center font-bold py-3.5 rounded-xl cursor-not-allowed">
                    Applications Closed
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#554093] mb-6">Committees & Duties</h2>
            
            {hackathon.committees.length === 0 ? (
               <div className="p-8 text-center bg-white rounded-2xl border border-[#554093]/10 text-[#554093]/60">
                 No committees have been announced for this event yet.
               </div>
            ) : (
              <div className="space-y-6">
                {hackathon.committees.map(committee => (
                  <div key={committee.id} className="bg-white rounded-2xl p-6 border border-[#554093]/10 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-[#554093]">{committee.committeeName}</h3>
                      <span className="bg-[#554093]/10 text-[#554093] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {committee.inCharge}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {committee.responsibility && (
                        <div>
                          <p className="text-[11px] font-bold tracking-wider uppercase text-[#554093]/50 mb-1">Responsibility</p>
                          <p className="text-[14px] text-[#554093]/80 leading-relaxed">{committee.responsibility}</p>
                        </div>
                      )}
                      
                      {committee.duty && (
                        <div>
                          <p className="text-[11px] font-bold tracking-wider uppercase text-[#554093]/50 mb-1">Duty</p>
                          <p className="text-[14px] text-[#554093]/80 leading-relaxed">{committee.duty}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#554093]/5 mt-2">
                        {committee.venue && (
                          <div>
                            <p className="text-[11px] font-bold tracking-wider uppercase text-[#554093]/50 mb-1">Venue</p>
                            <p className="text-[13px] font-medium text-[#554093]">{committee.venue}</p>
                          </div>
                        )}
                        {committee.contactDetails && (
                          <div>
                            <p className="text-[11px] font-bold tracking-wider uppercase text-[#554093]/50 mb-1">Contact</p>
                            <p className="text-[13px] font-medium text-[#554093]">{committee.contactDetails}</p>
                          </div>
                        )}
                      </div>
                      
                      {committee.remarks && (
                        <div className="pt-2">
                          <p className="text-[11px] font-bold tracking-wider uppercase text-[#554093]/50 mb-1">Remarks</p>
                          <p className="text-[13px] italic text-[#554093]/70">{committee.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
