import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import VerificationQueue from "../super-admin/VerificationQueue";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  const role = dbUser?.role || 'PARTICIPANT';

  // Fetch Participant Data
  const registrations = await prisma.registration.findMany({
    where: { userId: user.id },
    include: { university: true, hackathon: true },
    orderBy: { createdAt: 'desc' }
  });

  // Fetch Coordinator Data
  let pendingRegistrations: any[] = [];
  let approvedRegistrationsCount = 0;
  let rejectedRegistrationsCount = 0;

  if (role === 'COORDINATOR' || role === 'SUPER_ADMIN') {
    pendingRegistrations = await prisma.registration.findMany({
      where: { 
        idProofStatus: {
          in: ['PENDING', 'REJECTED']
        }
      },
      include: { university: true },
      orderBy: { createdAt: 'desc' }
    });

    approvedRegistrationsCount = await prisma.registration.count({
      where: { idProofStatus: 'VERIFIED' }
    });
    
    rejectedRegistrationsCount = await prisma.registration.count({
      where: { idProofStatus: 'REJECTED' }
    });
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12">
      
      {/* Coordinator / Admin Section */}
      {(role === 'COORDINATOR' || role === 'SUPER_ADMIN') && (
        <section className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Coordinator Dashboard</h1>
            <p className="text-[#554093]/60 font-medium mt-1">Manage event registrations and verify participant identities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Pending Verifications", value: pendingRegistrations.length, bg: "bg-amber-100/50", trendColor: "text-amber-600" },
              { label: "Approved Participants", value: approvedRegistrationsCount, bg: "bg-emerald-100/50", trendColor: "text-emerald-600" },
              { label: "Rejected Applications", value: rejectedRegistrationsCount, bg: "bg-rose-100/50", trendColor: "text-rose-600" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col justify-between">
                <p className="text-[11px] uppercase tracking-wider font-bold text-[#554093]/60 mb-4">{stat.label}</p>
                <div>
                  <p className="text-3xl font-bold text-[#554093] tracking-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
            <VerificationQueue registrations={pendingRegistrations} />
            
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col items-center justify-center min-h-[400px]">
               <div className="w-16 h-16 bg-[#554093]/5 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#554093]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               </div>
               <h3 className="text-lg font-bold text-[#554093] mb-1">More tools coming soon</h3>
               <p className="text-[#554093]/60 text-sm font-medium text-center max-w-sm">Event scheduling, team management, and broadcast announcements will appear here.</p>
            </div>
          </div>
        </section>
      )}

      {/* Participant Section (Everyone sees their own registrations) */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Your Registrations</h1>
            <p className="text-[#554093]/60 font-medium mt-1">Review your event applications and pending payments.</p>
          </div>
          <Link href="/events" className="bg-[#554093] text-white font-bold px-5 py-2 rounded-xl text-sm shadow hover:bg-[#3B2C66] transition">
            Find Events
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10">
            <h2 className="text-xl font-bold text-[#554093] mb-2">You haven't applied to any events yet!</h2>
            <p className="text-[#554093]/60 font-medium mb-6">Discover events and hackathons to participate in.</p>
            <Link href="/events" className="inline-block bg-[#554093]/10 text-[#554093] font-bold px-6 py-2.5 rounded-xl hover:bg-[#554093]/20 transition">
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
      </section>
    </div>
  );
}
