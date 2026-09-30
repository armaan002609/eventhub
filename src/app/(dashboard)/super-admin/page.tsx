import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import RoleManagement from "./RoleManagement";
import HackathonManagement from "./HackathonManagement";
import RegistrationManagement from "./RegistrationManagement";
import CoordinatorManagement from "./CoordinatorManagement";

export default async function SuperAdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch users for Role Management
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const hackathons = await prisma.hackathon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const committees = await prisma.committee.findMany({
    orderBy: { createdAt: 'asc' }
  });

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      university: true,
      hackathon: true
    }
  });

  const coordinators = await prisma.user.findMany({
    where: { role: 'COORDINATOR' },
    select: { id: true, name: true, email: true, role: true }
  });

  const coordinatorDuties = await prisma.duty.findMany({
    where: { level: 'HIGH_LEVEL' },
    include: { assignedTo: { select: { id: true, name: true } } },
    orderBy: { startsAt: 'asc' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Super Admin Dashboard</h1>
        <p className="text-[#554093]/60 font-medium mt-1">Manage platform access, roles, and landing page events.</p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 min-h-[400px]">
          <RegistrationManagement registrations={registrations} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 min-h-[400px]">
          <HackathonManagement hackathons={hackathons} committees={committees} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 min-h-[400px]">
          <CoordinatorManagement coordinators={coordinators} duties={coordinatorDuties} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 min-h-[400px]">
          <RoleManagement initialUsers={users} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
}

