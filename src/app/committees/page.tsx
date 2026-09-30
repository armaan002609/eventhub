import React from "react";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";

export default async function CommitteesPage() {
  const hackathons = await prisma.hackathon.findMany({
    where: { isPublished: true },
    include: {
      Committee: true
    },
    orderBy: { startsAt: 'asc' }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-8 pt-12 pb-24">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#554093] mb-4">Event Committees</h1>
          <p className="text-lg text-[#554093]/70 font-medium max-w-3xl">
            View the dedicated teams and officials responsible for organizing our events.
          </p>
        </div>

        {hackathons.map(hackathon => {
          if (hackathon.Committee.length === 0) return null;
          
          return (
            <div key={hackathon.id} className="mb-20">
              <h2 className="text-3xl font-bold text-[#554093] mb-8 pb-4 border-b-2 border-[#554093]/10">
                {hackathon.title}
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hackathon.Committee.map(committee => (
                  <div key={committee.id} className="bg-white rounded-2xl p-6 border border-[#554093]/10 shadow-sm hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-[#554093] group-hover:text-[#3B2C66] transition-colors">{committee.committeeName}</h3>
                      <span className="bg-[#554093]/10 text-[#554093] text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
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
            </div>
          );
        })}

        {hackathons.filter(h => h.Committee.length > 0).length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#554093]/10">
            <h3 className="text-xl font-bold text-[#554093] mb-2">No Committees Found</h3>
            <p className="text-[#554093]/60">There are currently no public committees assigned to any active events.</p>
          </div>
        )}

      </main>
    </div>
  );
}
