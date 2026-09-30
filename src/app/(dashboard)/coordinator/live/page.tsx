import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function CoordinatorLiveMatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Scorer Panel</h1>
          <p className="text-[#554093]/60 font-medium mt-1">Select a match to update live scores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-8 border border-[#554093]/10 text-center">
            <h3 className="text-xl font-bold text-[#554093] mb-2">No matches found</h3>
            <p className="text-[#554093]/60 font-medium">Create a match first to start live scoring.</p>
          </div>
        ) : (
          matches.map(match => (
            <div key={match.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#554093]/10">
              <div className="text-[11px] font-bold text-[#554093]/60 tracking-wider uppercase mb-2">{match.sport} • {match.status}</div>
              <h3 className="text-lg font-bold text-[#554093] mb-4 line-clamp-2">{match.title}</h3>
              <Link 
                href={`/coordinator/live/${match.id}`} 
                className="w-full py-2 bg-[#554093] text-white rounded-xl font-bold text-sm hover:bg-[#554093]/90 transition-colors flex items-center justify-center gap-2"
              >
                Open Scorer Panel
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
