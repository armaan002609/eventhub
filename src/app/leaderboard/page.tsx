import React from "react";
import Link from "next/link";

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, team: "ByteBuilders", score: 98, updated: "3s ago" },
    { rank: 2, team: "CodeNinjas", score: 92, updated: "1m ago" },
    { rank: 3, team: "TechTitans", score: 88, updated: "5m ago" },
    { rank: 4, team: "DebugDemons", score: 82, updated: "10m ago" },
    { rank: 5, team: "SyntaxSquad", score: 75, updated: "1h ago" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-slate-200 bg-white">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">EventHub</span>
        </Link>
        <Link 
          href="/participant" 
          className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          My Dashboard
        </Link>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Live Leaderboard</h1>
            <p className="mt-2 text-sm text-slate-600">Real-time standings for the Main Hackathon.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live Updates
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Rank</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Team / Participant</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100" aria-live="polite">
                {leaderboardData.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-slate-100 text-slate-600 shadow-sm border border-slate-200"
                           style={
                             entry.rank === 1 ? { backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' } :
                             entry.rank === 2 ? { backgroundColor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' } :
                             entry.rank === 3 ? { backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FED7AA' } : {}
                           }>
                        {entry.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{entry.team}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-xl font-bold tabular-nums text-indigo-600">{entry.score} <span className="text-sm font-normal text-slate-500">pts</span></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500 tabular-nums">
                      {entry.updated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden divide-y divide-slate-100">
            {leaderboardData.map((entry) => (
              <div key={entry.rank} className="p-4 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-slate-100 text-slate-600 border border-slate-200"
                           style={
                             entry.rank === 1 ? { backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FDE68A' } :
                             entry.rank === 2 ? { backgroundColor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB' } :
                             entry.rank === 3 ? { backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FED7AA' } : {}
                           }>
                    {entry.rank}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{entry.team}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Updated {entry.updated}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600 tabular-nums">{entry.score}</p>
                  <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Points</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
