import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function VolunteerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch real duties assigned to this volunteer
  const duties = await prisma.duty.findMany({
    where: { assignedToId: user.id },
    orderBy: { startsAt: 'asc' }
  });

  // Fetch coordinators for contact info
  const coordinators = await prisma.user.findMany({
    where: { role: 'COORDINATOR' },
    select: { id: true, name: true, email: true }
  });

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-12 gap-6">
      
      {/* Header Info */}
      <div className="col-span-12 flex justify-between items-end mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Volunteer Agenda</h1>
          <p className="text-slate-500 font-medium mt-1">Your assigned duties and time slots.</p>
        </div>
        <button className="hidden sm:flex text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold text-sm px-4 py-2 rounded-xl transition-colors">
          Download PDF
        </button>
      </div>

      {/* Main Agenda Column */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[17px] font-bold text-slate-800">Your Duties</h2>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            {duties.length} ASSIGNED
          </span>
        </div>
        
        <div className="space-y-4">
          {duties.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Duties Assigned Yet</h3>
              <p className="text-slate-500 text-sm font-medium">You will be notified once a coordinator assigns a task to you.</p>
            </div>
          ) : (
            duties.map((duty, idx) => {
              const now = new Date();
              const isPast = duty.endsAt < now;
              const isNow = duty.startsAt <= now && duty.endsAt >= now;
              
              let statusText = 'UPCOMING';
              let statusBg = 'bg-slate-200 text-slate-600';
              let cardBg = 'bg-[#F8F9FA] border-slate-100';
              let iconBg = 'bg-slate-100 text-slate-500';

              if (isPast) {
                statusText = 'DONE';
                statusBg = 'bg-emerald-100 text-emerald-700';
                cardBg = 'bg-emerald-50 border-emerald-100';
                iconBg = 'bg-emerald-100 text-emerald-600';
              } else if (isNow) {
                statusText = 'NOW';
                statusBg = 'bg-indigo-200 text-indigo-800 shadow-sm shadow-indigo-200/50';
                cardBg = 'bg-indigo-50 border-indigo-100';
                iconBg = 'bg-indigo-100 text-indigo-600';
              }

              return (
                <div key={duty.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[20px] border transition-shadow hover:shadow-sm ${cardBg}`}>
                  <div className="flex gap-4 items-start">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${iconBg}`}>
                        {isPast ? (
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        ) : isNow ? (
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        )}
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className={`text-sm font-bold ${isNow ? 'text-indigo-900' : 'text-slate-800'}`}>{duty.title}</h3>
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBg}`}>
                            {statusText}
                          </span>
                        </div>
                        <p className={`text-[13px] font-medium flex items-center gap-1.5 ${isNow ? 'text-indigo-700/70' : 'text-slate-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isNow ? 'bg-indigo-300' : 'bg-slate-300'}`}></span>
                          {duty.venue}
                        </p>
                        {duty.description && (
                          <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">{duty.description}</p>
                        )}
                     </div>
                  </div>
                  <div className="text-left sm:text-right pl-14 sm:pl-0">
                    <p className={`text-[13px] font-bold ${isNow ? 'text-indigo-900' : 'text-slate-800'}`}>
                      {new Date(duty.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(duty.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className={`text-[11px] font-semibold mt-0.5 ${isNow ? 'text-indigo-500' : 'text-slate-400'}`}>
                      {new Date(duty.startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Coordinators Sidebar */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-[17px] font-bold text-slate-800 mb-6">Contact Coordinators</h2>
          
          <div className="space-y-4">
            {coordinators.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium text-center">No coordinators found.</p>
            ) : (
              coordinators.map((coordinator) => (
                <div key={coordinator.id} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-[20px] border border-slate-100">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {coordinator.name.charAt(0).toUpperCase()}
                     </div>
                     <div className="min-w-0">
                       <p className="text-sm font-bold text-slate-800 truncate">{coordinator.name}</p>
                       <p className="text-[11px] font-semibold text-slate-500 truncate">{coordinator.email}</p>
                     </div>
                  </div>
                  <a href={`mailto:${coordinator.email}`} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors shrink-0">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
