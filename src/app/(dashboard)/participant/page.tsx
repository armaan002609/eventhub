import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import TeamInvites from "./TeamInvites"; // We will create this next

export default async function ParticipantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  });

  if (!dbUser || !dbUser.username || !dbUser.idProofPath) {
    redirect('/profile/setup');
  }

  // Get Solo Registrations
  const soloRegistrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { hackathon: true },
    orderBy: { createdAt: 'desc' }
  });

  // Get Team Registrations (Accepted or Pending, we can show both differently)
  const teamMemberships = await prisma.teamMember.findMany({
    where: { userId: user.id },
    include: {
      team: {
        include: { 
          hackathon: true, 
          registration: true,
          leader: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const allEventsCount = soloRegistrations.length + teamMemberships.filter(m => m.status === 'ACCEPTED' && m.team.registration).length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Your Dashboard</h1>
          <p className="text-[#554093]/60 font-medium mt-1">Review your event applications and team invites.</p>
        </div>
        <Link href="/" className="bg-[#554093] text-white font-bold px-5 py-2 rounded-xl text-sm shadow hover:bg-[#3B2C66] transition">
          Find Events
        </Link>
      </div>

      <TeamInvites invites={teamMemberships.filter(m => m.status === 'PENDING')} userId={user.id} />

      <h2 className="text-xl font-bold text-[#554093] mt-4">Your Registrations</h2>

      {allEventsCount === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10">
          <h2 className="text-xl font-bold text-[#554093] mb-2">You haven't applied to any events yet!</h2>
          <p className="text-[#554093]/60 font-medium mb-6">Discover hackathons and events to participate in.</p>
          <Link href="/" className="inline-block bg-[#554093]/10 text-[#554093] font-bold px-6 py-2.5 rounded-xl hover:bg-[#554093]/20 transition">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Solo Registrations */}
          {soloRegistrations.map(reg => {
            const isVerified = dbUser.idProofStatus === 'VERIFIED';
            const statusColor = isVerified 
              ? "bg-emerald-50 border-emerald-200/60 text-emerald-600"
              : dbUser.idProofStatus === 'REJECTED'
              ? "bg-rose-50 border-rose-200/60 text-rose-600"
              : "bg-amber-50 border-amber-200/60 text-amber-600";
              
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://eventhub-armaan6.vercel.app';
            const qrData = `${baseUrl}/ticket/${reg.id}?user=${user.id}`;
              
            return (
              <div key={reg.id} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-[#554093]/10">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#554093] mb-1">{reg.hackathon.title}</h2>
                    <p className="text-[#554093]/60 text-sm font-medium mb-4">Applied as Solo on {reg.createdAt.toLocaleDateString()}</p>
                    
                    <span className={`inline-block border text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm mb-4 ${statusColor}`}>
                      {dbUser.idProofStatus === 'PENDING' ? 'ID Pending Verification' : dbUser.idProofStatus}
                    </span>
                    
                    <div className="flex items-center gap-4">
                      {isVerified ? (
                        <>
                          <span className="text-[#554093]/60 font-semibold text-sm">Total Due: <strong className="text-[#554093]">₹{reg.totalFee}</strong></span>
                          {reg.totalFee > 0 && reg.paymentStatus !== 'PAID' && (
                            <button className="bg-[#554093] hover:bg-[#3B2C66] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                              Pay Now
                            </button>
                          )}
                          {reg.paymentStatus === 'PAID' && (
                            <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-md">Paid</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[#554093]/60 font-semibold text-sm">Fees calculated after ID verification</span>
                      )}
                    </div>
                  </div>
                  
                  {isVerified && (
                    <div className="flex flex-col items-center justify-center shrink-0 bg-[#554093]/5 p-4 rounded-2xl border border-[#554093]/10">
                      <QRCodeDisplay value={qrData} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#554093]/60 mt-3 text-center">Event Pass<br/>Scan to Check-in</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Team Registrations */}
          {teamMemberships.filter(m => m.status === 'ACCEPTED').map(membership => {
            const team = membership.team;
            const reg = team.registration;
            if (!reg) return null;

            const isVerified = dbUser.idProofStatus === 'VERIFIED';
            const statusColor = isVerified 
              ? "bg-emerald-50 border-emerald-200/60 text-emerald-600"
              : dbUser.idProofStatus === 'REJECTED'
              ? "bg-rose-50 border-rose-200/60 text-rose-600"
              : "bg-amber-50 border-amber-200/60 text-amber-600";
              
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://eventhub-armaan6.vercel.app';
            const qrData = `${baseUrl}/ticket/${reg.id}?user=${user.id}`;
              
            return (
              <div key={team.id} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-6 mb-6 pb-6 border-b border-[#554093]/10">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#554093] mb-1">{team.hackathon.title}</h2>
                    <p className="text-[#554093]/60 text-sm font-medium mb-4">Team: {team.name} • Applied on {team.createdAt.toLocaleDateString()}</p>
                    
                    <span className={`inline-block border text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm mb-4 ${statusColor}`}>
                      {dbUser.idProofStatus === 'PENDING' ? 'Your ID: Pending' : dbUser.idProofStatus}
                    </span>
                    
                    <div className="flex items-center gap-4">
                      {isVerified ? (
                        <>
                          <span className="text-[#554093]/60 font-semibold text-sm">Team Fee: <strong className="text-[#554093]">₹{reg.totalFee}</strong></span>
                          {reg.totalFee > 0 && reg.paymentStatus !== 'PAID' && user.id === team.leaderId && (
                            <button className="bg-[#554093] hover:bg-[#3B2C66] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                              Pay for Team
                            </button>
                          )}
                          {reg.totalFee > 0 && reg.paymentStatus !== 'PAID' && user.id !== team.leaderId && (
                            <span className="text-rose-600 font-bold text-sm bg-rose-50 px-3 py-1 rounded-md">Pending Leader Payment</span>
                          )}
                          {reg.paymentStatus === 'PAID' && (
                            <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-md">Paid</span>
                          )}
                        </>
                      ) : (
                        <span className="text-[#554093]/60 font-semibold text-sm">Fees calculated after ID verification</span>
                      )}
                    </div>
                  </div>
                  
                  {isVerified && (
                    <div className="flex flex-col items-center justify-center shrink-0 bg-[#554093]/5 p-4 rounded-2xl border border-[#554093]/10">
                      <QRCodeDisplay value={qrData} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#554093]/60 mt-3 text-center">Event Pass<br/>Scan to Check-in</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
