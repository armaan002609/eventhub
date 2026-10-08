import { prisma } from "@/lib/db";
import VerificationQueue from "../super-admin/VerificationQueue";

export default async function CoordinatorDashboard() {
  // Fetch pending and rejected ID proofs for Verification Queue
  const pendingUsers = await prisma.user.findMany({
    where: { 
      idProofStatus: {
        in: ['PENDING', 'REJECTED']
      },
      idProofPath: {
        not: null
      }
    },
    include: { university: true },
    orderBy: { createdAt: 'desc' }
  });

  const approvedUsersCount = await prisma.user.count({
    where: { idProofStatus: 'VERIFIED' }
  });
  
  const rejectedUsersCount = await prisma.user.count({
    where: { idProofStatus: 'REJECTED' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Coordinator Dashboard</h1>
        <p className="text-[#554093]/60 font-medium mt-1">Manage event registrations and verify participant identities.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Pending Verifications", value: pendingUsers.length, bg: "bg-amber-100/50", trendColor: "text-amber-600" },
          { label: "Approved Participants", value: approvedUsersCount, bg: "bg-emerald-100/50", trendColor: "text-emerald-600" },
          { label: "Rejected Applications", value: rejectedUsersCount, bg: "bg-rose-100/50", trendColor: "text-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col justify-between">
            <p className="text-[11px] uppercase tracking-wider font-bold text-[#554093]/60 mb-4">{stat.label}</p>
            <div>
              <p className="text-3xl font-bold text-[#554093] tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
        {/* We place the Verification Queue here! */}
        <VerificationQueue users={pendingUsers} />
        
        {/* Placeholder for future Coordinator Tools */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col items-center justify-center min-h-[400px]">
           <div className="w-16 h-16 bg-[#554093]/5 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#554093]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
           <h3 className="text-lg font-bold text-[#554093] mb-1">More tools coming soon</h3>
           <p className="text-[#554093]/60 text-sm font-medium text-center max-w-sm">Event scheduling, team management, and broadcast announcements will appear here.</p>
        </div>
      </div>

    </div>
  );
}
