import React from "react";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db";

// Helper function to format relative time
function getRelativeTime(date: Date) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
  const minutesDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60));

  if (Math.abs(minutesDifference) < 60) {
    return rtf.format(minutesDifference, 'minute');
  } else if (Math.abs(hoursDifference) < 24) {
    return rtf.format(hoursDifference, 'hour');
  } else {
    return rtf.format(daysDifference, 'day');
  }
}

export default async function LeaderboardPage({
  searchParams
}: {
  searchParams?: { competitionId?: string }
}) {
  // Wait for searchParams (in Next.js 15, searchParams is an async promise or requires await if accessed dynamically, but in page props it's sometimes just passed. Let's do it safely.)
  const params = await searchParams;
  
  // Fetch published competitions
  const competitions = await prisma.competition.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'asc' }
  });

  const activeCompetitionId = params?.competitionId || (competitions.length > 0 ? competitions[0].id : null);
  const activeCompetition = competitions.find(c => c.id === activeCompetitionId);

  let rawEntries = [];
  if (activeCompetitionId) {
    rawEntries = await prisma.scoreEntry.findMany({
      where: { competitionId: activeCompetitionId },
      include: {
        updatedBy: { select: { name: true } }
      }
    });
  }

  // Sort entries based on metric
  const sortedEntries = [...rawEntries].sort((a, b) => {
    if (activeCompetition?.metric === 'POINTS_DESC') {
      return (b.points || 0) - (a.points || 0);
    } else if (activeCompetition?.metric === 'TIME_MS_ASC') {
      return (a.timeMs || Infinity) - (b.timeMs || Infinity);
    }
    return 0;
  });

  // Assign ranks
  const leaderboardData = sortedEntries.map((entry, index) => {
    let scoreDisplay = "0";
    if (activeCompetition?.metric === 'POINTS_DESC') {
      scoreDisplay = `${entry.points}`;
    } else if (activeCompetition?.metric === 'TIME_MS_ASC') {
      scoreDisplay = `${((entry.timeMs || 0) / 1000).toFixed(2)}s`;
    }

    return {
      id: entry.id,
      rank: index + 1,
      team: entry.teamName,
      score: scoreDisplay,
      updated: getRelativeTime(entry.updatedAt)
    };
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Live Leaderboard</h1>
            <p className="mt-2 text-sm text-[#554093]/70">
              {activeCompetition ? `Real-time standings for ${activeCompetition.name}.` : 'No active competitions found.'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#554093] bg-[#554093]/5 px-3 py-1.5 rounded-full border border-[#554093]/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#554093] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#554093]"></span>
            </span>
            Live Updates
          </div>
        </div>

        {competitions.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {competitions.map((comp) => (
              <a
                key={comp.id}
                href={`/leaderboard?competitionId=${comp.id}`}
                className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-colors ${
                  comp.id === activeCompetitionId
                    ? 'bg-[#554093] text-white shadow-md shadow-[#554093]/20'
                    : 'bg-[#554093]/5 text-[#554093] hover:bg-[#554093]/10'
                }`}
              >
                {comp.name}
              </a>
            ))}
          </div>
        )}

        <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-[#554093]/10 overflow-hidden">
          {leaderboardData.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-[#554093]/10">
                  <thead className="bg-[#554093]/5">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#554093]/70 uppercase tracking-wider w-24">Rank</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#554093]/70 uppercase tracking-wider">Team / Participant</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#554093]/70 uppercase tracking-wider">
                        {activeCompetition?.metric === 'TIME_MS_ASC' ? 'Time' : 'Score'}
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#554093]/70 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#FDFBF7] divide-y divide-[#554093]/5" aria-live="polite">
                    {leaderboardData.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#554093]/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-[#554093]/10 text-[#554093] shadow-sm border border-[#554093]/20"
                               style={
                                 entry.rank === 1 ? { backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' } :
                                 entry.rank === 2 ? { backgroundColor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' } :
                                 entry.rank === 3 ? { backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FED7AA' } : {}
                               }>
                            {entry.rank}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-[#554093]">{entry.team}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-xl font-bold tabular-nums text-[#554093]">
                            {entry.score} 
                            {activeCompetition?.unit && <span className="text-sm font-medium text-[#554093]/70 ml-1">{activeCompetition.unit}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#554093]/70 tabular-nums">
                          {entry.updated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden divide-y divide-[#554093]/5">
                {leaderboardData.map((entry) => (
                  <div key={entry.id} className="p-4 flex items-center justify-between bg-[#FDFBF7]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-[#554093]/10 text-[#554093] border border-[#554093]/20"
                               style={
                                 entry.rank === 1 ? { backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' } :
                                 entry.rank === 2 ? { backgroundColor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' } :
                                 entry.rank === 3 ? { backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FED7AA' } : {}
                               }>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#554093]">{entry.team}</p>
                        <p className="text-xs text-[#554093]/70 mt-0.5">Updated {entry.updated}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#554093] tabular-nums">{entry.score}</p>
                      <p className="text-[10px] uppercase font-bold text-[#554093]/50 tracking-wider">
                        {activeCompetition?.unit || (activeCompetition?.metric === 'TIME_MS_ASC' ? 'Time' : 'Points')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
               <div className="w-16 h-16 bg-[#554093]/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#554093]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
               </div>
               <h3 className="text-lg font-bold text-[#554093]">No Entries Yet</h3>
               <p className="text-[#554093]/60 mt-2 max-w-sm mx-auto">The leaderboard will update automatically once teams start submitting their scores.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
