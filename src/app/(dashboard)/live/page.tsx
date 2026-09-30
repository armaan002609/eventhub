import { prisma } from "@/lib/db";
import Link from "next/link";
import { SportType, MatchStatus } from "@prisma/client";

export default async function LiveScoreboardPage() {
  const matches = await prisma.match.findMany({
    orderBy: [
      { status: 'asc' }, // LIVE first usually if we map it right, but for now just order by status
      { createdAt: 'desc' }
    ],
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch(status) {
      case 'LIVE': return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-bold tracking-wider animate-pulse uppercase">Live</span>;
      case 'UPCOMING': return <span className="px-2.5 py-0.5 rounded-full bg-[#554093]/10 text-[#554093] border border-[#554093]/20 text-[10px] font-bold tracking-wider uppercase">Upcoming</span>;
      case 'PAUSED': return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold tracking-wider uppercase">Paused</span>;
      case 'COMPLETED': return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase">Completed</span>;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Live Scores</h1>
          <p className="text-[#554093]/60 font-medium mt-1">Real-time match updates and scoreboards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#554093]/5 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#554093]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#554093] mb-2">No active matches</h3>
            <p className="text-[#554093]/60 font-medium max-w-md">There are currently no matches scheduled or live. Coordinators can create matches from the admin panel.</p>
          </div>
        ) : (
          matches.map(match => (
            <Link key={match.id} href={`/live/${match.id}`} className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 hover:shadow-lg transition-all group block">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[11px] font-bold text-[#554093]/60 tracking-wider uppercase">{match.sport}</div>
                {getStatusBadge(match.status)}
              </div>
              <h3 className="text-lg font-bold text-[#554093] mb-4 line-clamp-2 group-hover:text-rose-500 transition-colors">{match.title}</h3>
              <div className="flex justify-between items-center pt-4 border-t border-[#554093]/10 mt-auto">
                <span className="text-xs font-semibold text-[#554093]/40">View Details</span>
                <svg className="w-4 h-4 text-[#554093]/40 group-hover:text-rose-500 transition-colors group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
