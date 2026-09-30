import { MatchStatus } from '@prisma/client';

export interface BadmintonScoreData {
  team1: { name: string; isServing: boolean; gamesWon: number };
  team2: { name: string; isServing: boolean; gamesWon: number };
  currentSet: number; // 1, 2, or 3
  scoresTeam1: number[]; // e.g. [21, 15, 0]
  scoresTeam2: number[]; // e.g. [19, 21, 0]
  statusLine: string;
}

export default function BadmintonScorebug({ data, status }: { data: Partial<BadmintonScoreData>, status: MatchStatus }) {
  const d: BadmintonScoreData = {
    team1: data.team1 || { name: 'P. Sindhu', isServing: true, gamesWon: 1 },
    team2: data.team2 || { name: 'C. Yufei', isServing: false, gamesWon: 0 },
    currentSet: data.currentSet || 2,
    scoresTeam1: data.scoresTeam1 || [21, 14, 0],
    scoresTeam2: data.scoresTeam2 || [19, 11, 0],
    statusLine: data.statusLine || 'GAME 2'
  };

  return (
    <div className="w-full max-w-[500px] flex flex-col font-sans drop-shadow-2xl mx-auto my-auto border border-white/10 rounded-2xl overflow-hidden bg-[#0A0B10]/95 backdrop-blur-md shadow-black/60 shadow-2xl">
      
      {/* Header */}
      <div className="bg-[#1A1A24] h-8 flex items-center justify-between px-4 border-b border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-rose-500 animate-pulse' : 'bg-gray-500'}`}></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{status === 'LIVE' ? 'BWF LIVE' : status}</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{d.statusLine}</span>
      </div>

      {/* Main Table */}
      <div className="flex flex-col">
        {/* TEAM 1 */}
        <div className="flex items-center bg-[#15161E] border-b border-white/5">
          {/* Serving Dot */}
          <div className="w-8 flex justify-center">
            {d.team1.isServing && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>}
          </div>
          
          <div className="flex-1 py-3 text-lg font-black text-white uppercase tracking-tighter truncate">
            {d.team1.name}
          </div>

          <div className="w-[100px] flex items-center justify-end px-4 gap-4">
            {/* Previous Sets */}
            {d.scoresTeam1.map((score, i) => {
              if (i >= d.currentSet) return null;
              const isCurrent = i === d.currentSet - 1;
              return (
                <span key={i} className={`text-2xl font-black tabular-nums tracking-tighter ${isCurrent ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/40'}`}>
                  {score}
                </span>
              );
            })}
          </div>
        </div>

        {/* TEAM 2 */}
        <div className="flex items-center bg-[#0A0B10]">
          {/* Serving Dot */}
          <div className="w-8 flex justify-center">
            {d.team2.isServing && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>}
          </div>
          
          <div className="flex-1 py-3 text-lg font-black text-white uppercase tracking-tighter truncate">
            {d.team2.name}
          </div>

          <div className="w-[100px] flex items-center justify-end px-4 gap-4">
            {/* Previous Sets */}
            {d.scoresTeam2.map((score, i) => {
              if (i >= d.currentSet) return null;
              const isCurrent = i === d.currentSet - 1;
              return (
                <span key={i} className={`text-2xl font-black tabular-nums tracking-tighter ${isCurrent ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-white/40'}`}>
                  {score}
                </span>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
