import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ParticipantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get all registrations for this user
  const registrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { university: true, hackathon: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      
      {/* Header Info */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Your Registrations</h1>
          <p className="text-[#554093]/60 font-medium mt-1">Review your event applications and pending payments.</p>
        </div>
        <Link href="/" className="bg-[#554093] text-white font-bold px-5 py-2 rounded-xl text-sm shadow hover:bg-[#3B2C66] transition">
          Find Events
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10">
          <h2 className="text-xl font-bold text-[#554093] mb-2">You haven't applied to any events yet!</h2>
          <p className="text-[#554093]/60 font-medium mb-6">Discover hackathons and events to participate in.</p>
          <Link href="/" className="inline-block bg-[#554093]/10 text-[#554093] font-bold px-6 py-2.5 rounded-xl hover:bg-[#554093]/20 transition">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map(reg => {
            const isVerified = reg.idProofStatus === 'VERIFIED';
            const statusColor = isVerified 
              ? "bg-emerald-50 border-emerald-200/60 text-emerald-600"
              : reg.idProofStatus === 'REJECTED'
              ? "bg-rose-50 border-rose-200/60 text-rose-600"
              : "bg-amber-50 border-amber-200/60 text-amber-600";
              
            return (
              <div key={reg.id} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-4 border-b border-[#554093]/10">
                  <div>
                    <h2 className="text-xl font-bold text-[#554093]">{reg.hackathon.title}</h2>
                    <p className="text-[#554093]/60 text-sm font-medium mt-1">Applied on {reg.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`border text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm mb-2 ${statusColor}`}>
                      {reg.idProofStatus === 'PENDING' ? 'ID Pending Verification' : reg.idProofStatus}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[#554093]/60 font-semibold text-sm">Total Due: <strong className="text-[#554093]">₹{reg.totalFee}</strong></span>
                      {reg.totalFee > 0 && reg.paymentStatus !== 'PAID' && (
                        <button className="bg-[#554093] hover:bg-[#3B2C66] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                          Pay Now
                        </button>
                      )}
                      {reg.paymentStatus === 'PAID' && (
                        <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-md">Paid</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#554093]/5 p-3 rounded-[16px] border border-[#554093]/10">
                    <dt className="text-[10px] uppercase tracking-wider font-bold text-[#554093]/60 mb-1">Team</dt>
                    <dd className="text-sm text-[#554093] font-semibold line-clamp-1">{reg.teamName || 'Solo'}</dd>
                  </div>
                  <div className="bg-[#554093]/5 p-3 rounded-[16px] border border-[#554093]/10">
                    <dt className="text-[10px] uppercase tracking-wider font-bold text-[#554093]/60 mb-1">Transport</dt>
                    <dd className="text-sm text-[#554093] font-semibold">{reg.needsTransport ? 'Requested' : 'None'}</dd>
                  </div>
                  <div className="bg-[#554093]/5 p-3 rounded-[16px] border border-[#554093]/10">
                    <dt className="text-[10px] uppercase tracking-wider font-bold text-[#554093]/60 mb-1">Accommodation</dt>
                    <dd className="text-sm text-[#554093] font-semibold">{reg.needsAccommodation ? 'Requested' : 'None'}</dd>
                  </div>
                  <div className="bg-[#554093]/5 p-3 rounded-[16px] border border-[#554093]/10">
                    <dt className="text-[10px] uppercase tracking-wider font-bold text-[#554093]/60 mb-1">Food / Meals</dt>
                    <dd className="text-sm text-[#554093] font-semibold">{reg.needsFood ? 'Requested' : 'None'}</dd>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
