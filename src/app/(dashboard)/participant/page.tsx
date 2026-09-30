import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RegistrationForm from "./RegistrationForm";

export default async function ParticipantDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has completed registration
  const registration = await prisma.registration.findUnique({
    where: { userId: user.id },
    include: { university: true }
  });

  if (!registration) {
    return <RegistrationForm />;
  }

  // They are registered, show summary
  const isVerified = registration.idProofStatus === 'VERIFIED';
  const statusColor = isVerified 
    ? "bg-emerald-50 border-emerald-200/60 text-emerald-600"
    : registration.idProofStatus === 'REJECTED'
    ? "bg-rose-50 border-rose-200/60 text-rose-600"
    : "bg-amber-50 border-amber-200/60 text-amber-600";

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-12 gap-6">
      
      {/* Header Info */}
      <div className="col-span-12 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Registration Summary</h1>
          <p className="text-slate-500 font-medium mt-1">Review your details and complete pending payments.</p>
        </div>
        <span className={`border text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${statusColor}`}>
          {registration.idProofStatus === 'PENDING' ? 'Pending Verification' : registration.idProofStatus}
        </span>
      </div>

      {/* Main Grid */}
      {/* Left Column (Spans 8) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        
        {/* Registration Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[17px] font-bold text-slate-800">Your Details</h2>
            <button className="text-indigo-600 text-xs font-bold hover:underline">Edit</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Full Name</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.studentName}</dd>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">University</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.university.name}</dd>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Phone</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.phone}</dd>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Transport Required</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.needsTransport ? 'Yes' : 'No'}</dd>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Accommodation</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.needsAccommodation ? 'Yes' : 'No'}</dd>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-[20px] border border-slate-100">
              <dt className="text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Food / Meals</dt>
              <dd className="text-sm text-slate-900 font-semibold">{registration.needsFood ? 'Yes' : 'No'}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Spans 4) */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        
        {/* Fees Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl border border-slate-700 text-white flex flex-col">
          <h2 className="text-[17px] font-bold mb-6">Payment Summary</h2>
          <div className="space-y-4 text-sm flex-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Base Registration</span>
              <span className="font-bold">₹ 500</span>
            </div>
            {registration.needsTransport && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Transport</span>
                <span className="font-bold">₹ {registration.transportFee}</span>
              </div>
            )}
            {registration.needsAccommodation && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Accommodation</span>
                <span className="font-bold">₹ {registration.accommodationFee}</span>
              </div>
            )}
            {registration.needsFood && (
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Food</span>
                <span className="font-bold">₹ {registration.foodFee}</span>
              </div>
            )}
          </div>
          
          <div className="pt-4 mt-6 border-t border-slate-700/50 flex justify-between items-end mb-6">
            <span className="font-semibold text-slate-300 text-sm">Total Due</span>
            <span className="text-3xl font-bold text-white tracking-tight">₹ {registration.totalFee}</span>
          </div>
          
          <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm py-3 rounded-[16px] shadow-lg shadow-indigo-500/20 transition-colors">
            Pay Now
          </button>
        </div>

      </div>

    </div>
  );
}
