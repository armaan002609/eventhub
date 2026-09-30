import { MatchStatus } from '@prisma/client';

export interface BadmintonScoreData {
  team1: { name: string; isServing: boolean };
  team2: { name: string; isServing: boolean };
  currentSet: number; // 1, 2, or 3
  setsTeam1: number;
  setsTeam2: number;
  scoresTeam1: number[]; // e.g. [21, 15, 10]
  scoresTeam2: number[]; // e.g. [18, 21, 8]
  statusLine: string;
}

export default function BadmintonScorebug({ data, status }: { data: Partial<BadmintonScoreData>, status: MatchStatus }) {
  const d: BadmintonScoreData = {
    team1: data.team1 || { name: 'Player 1', isServing: true },
    team2: data.team2 || { name: 'Player 2', isServing: false },
    currentSet: data.currentSet || 1,
    setsTeam1: data.setsTeam1 || 0,
    setsTeam2: data.setsTeam2 || 0,
    scoresTeam1: data.scoresTeam1 || [0, 0, 0],
    scoresTeam2: data.scoresTeam2 || [0, 0, 0],
    statusLine: data.statusLine || 'Game 1'
  };

  return (
    <div className="w-full bg-[#1A1A24] text-white rounded-3xl overflow-hidden shadow-2xl font-sans border border-white/10 max-w-4xl mx-auto flex flex-col">
      <div className="bg-[#12121A] px-6 py-3 flex justify-between items-center border-b border-white/5">
        <div className="text-sm font-bold text-[#3B82F6] uppercase tracking-widest">{d.statusLine}</div>
        <div className="text-xs font-bold text-[#F43F5E] bg-[#F43F5E]/10 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          {status}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-4 bg-gradient-to-br from-[#12121A] to-transparent">
        
        {/* Team 1 Row */}
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="w-4 flex justify-center">
            {d.team1.isServing && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>}
          </div>
          <div className="flex-1 text-2xl font-bold uppercase tracking-wider">{d.team1.name}</div>
          
          {/* Sets Won */}
          <div className="px-4 border-r border-white/10 flex items-center justify-center gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full ${i <= d.setsTeam1 ? 'bg-rose-500' : 'bg-white/10'}`}></div>
            ))}
          </div>

          {/* Past/Current Game Scores */}
          <div className="flex gap-2">
            {[0, 1, 2].map(setIdx => (
              <div key={setIdx} className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black tabular-nums
                ${d.currentSet === setIdx + 1 ? 'bg-[#554093] text-white border-2 border-[#554093]/50' : 'bg-black/50 text-white/50'}`}>
                {d.scoresTeam1[setIdx] ?? '-'}
              </div>
            ))}
          </div>
        </div>

        {/* Team 2 Row */}
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="w-4 flex justify-center">
            {d.team2.isServing && <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>}
          </div>
          <div className="flex-1 text-2xl font-bold uppercase tracking-wider">{d.team2.name}</div>
          
          {/* Sets Won */}
          <div className="px-4 border-r border-white/10 flex items-center justify-center gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full ${i <= d.setsTeam2 ? 'bg-rose-500' : 'bg-white/10'}`}></div>
            ))}
          </div>

          {/* Past/Current Game Scores */}
          <div className="flex gap-2">
            {[0, 1, 2].map(setIdx => (
              <div key={setIdx} className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black tabular-nums
                ${d.currentSet === setIdx + 1 ? 'bg-[#554093] text-white border-2 border-[#554093]/50' : 'bg-black/50 text-white/50'}`}>
                {d.scoresTeam2[setIdx] ?? '-'}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
