import { prisma } from "@/lib/db";
import VerificationQueue from "../super-admin/VerificationQueue";
import VolunteerDutyManagement from "./VolunteerDutyManagement";

export default async function CoordinatorDashboard() {
  // Fetch pending and rejected ID proofs for Verification Queue
  const pendingRegistrations = await prisma.registration.findMany({
    where: { 
      idProofStatus: {
        in: ['PENDING', 'REJECTED']
      }
    },
    include: { university: true },
    orderBy: { createdAt: 'desc' }
  });

  const approvedRegistrationsCount = await prisma.registration.count({
    where: { idProofStatus: 'VERIFIED' }
  });
  
  const rejectedRegistrationsCount = await prisma.registration.count({
    where: { idProofStatus: 'REJECTED' }
  });

  const volunteers = await prisma.user.findMany({
    where: { role: 'VOLUNTEER' },
    select: { id: true, name: true, email: true, role: true }
  });

  const duties = await prisma.duty.findMany({
    include: { assignedTo: { select: { id: true, name: true } } },
    orderBy: { startsAt: 'asc' }
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
        {/* We place the Verification Queue here! */}
        <VerificationQueue registrations={pendingRegistrations} />
        
        {/* Volunteer Duty Management */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col items-center min-h-[400px]">
           <VolunteerDutyManagement volunteers={volunteers} duties={duties} />
        </div>
      </div>

    </div>
  );
}
