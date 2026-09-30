import React from "react";
import Navbar from "@/components/Navbar";

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, team: "ByteBuilders", score: 98, updated: "3s ago" },
    { rank: 2, team: "CodeNinjas", score: 92, updated: "1m ago" },
    { rank: 3, team: "TechTitans", score: 88, updated: "5m ago" },
    { rank: 4, team: "DebugDemons", score: 82, updated: "10m ago" },
    { rank: 5, team: "SyntaxSquad", score: 75, updated: "1h ago" },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#554093] tracking-tight">Live Leaderboard</h1>
            <p className="mt-2 text-sm text-[#554093]/70">Real-time standings for the Main Hackathon.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#554093] bg-[#554093]/5 px-3 py-1.5 rounded-full border border-[#554093]/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#554093] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#554093]"></span>
            </span>
            Live Updates
          </div>
        </div>

        <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-[#554093]/10 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-[#554093]/10">
              <thead className="bg-[#554093]/5">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#554093]/70 uppercase tracking-wider w-24">Rank</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#554093]/70 uppercase tracking-wider">Team / Participant</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#554093]/70 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#554093]/70 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="bg-[#FDFBF7] divide-y divide-[#554093]/5" aria-live="polite">
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-[#554093]/5 transition-colors">
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
                      <div className="text-xl font-bold tabular-nums text-[#554093]">{entry.score} <span className="text-sm font-medium text-[#554093]/70">pts</span></div>
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
              <div key={entry.rank} className="p-4 flex items-center justify-between bg-[#FDFBF7]">
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
                  <p className="text-[10px] uppercase font-bold text-[#554093]/50 tracking-wider">Points</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
