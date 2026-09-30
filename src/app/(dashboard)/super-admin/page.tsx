import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import RoleManagement from "./RoleManagement";
import HackathonManagement from "./HackathonManagement";

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

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Super Admin Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Manage platform access, roles, and landing page events.</p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
          <HackathonManagement hackathons={hackathons} />
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[400px]">
          <RoleManagement initialUsers={users} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
}

