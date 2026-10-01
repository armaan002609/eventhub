import { MatchStatus } from '@prisma/client';

export interface BadmintonScoreData {
  team1: { name: string; isServing: boolean; gamesWon: number };
  team2: { name: string; isServing: boolean; gamesWon: number };
  currentSet: number; // 1, 2, or 3
  scoresTeam1: number[]; // e.g. [21, 15, 0]
  scoresTeam2: number[]; // e.g. [19, 21, 0]
  statusLine: string;
}

export default function BadmintonScorebug({ data, status, showCarouselDots = true }: { data: Partial<BadmintonScoreData>, status: MatchStatus, showCarouselDots?: boolean }) {
  const d: BadmintonScoreData = {
    team1: data.team1 || { name: 'TEAM 1', isServing: true, gamesWon: 0 },
    team2: data.team2 || { name: 'TEAM 2', isServing: false, gamesWon: 0 },
    currentSet: data.currentSet || 1,
    scoresTeam1: data.scoresTeam1 || [0, 0, 0],
    scoresTeam2: data.scoresTeam2 || [0, 0, 0],
    statusLine: data.statusLine || 'GAME 1'
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans bg-gradient-to-br from-white to-gray-50 p-6 md:p-10 border border-gray-200 shadow-xl pb-16">
      {/* Match Status Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-md text-emerald-600 border border-gray-200">
          {d.statusLine}
        </div>
        {status === 'LIVE' ? (
          <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center gap-2 bg-rose-600 text-white shadow-lg shadow-rose-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            LIVE
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-md text-gray-700 border border-gray-200">
            {status}
          </div>
        )}
      </div>

      {/* Score Information */}
      <div className="w-full flex flex-col items-center gap-6 z-10 mt-8 md:mt-0">
        
        {/* Main Score Table */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
           {/* Header */}
           <div className="flex bg-gray-50 border-b border-gray-200 py-2 px-6">
              <div className="flex-1 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Team</div>
              <div className="w-[120px] md:w-[150px] flex justify-end gap-6 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest pr-4">
                 <span>Sets</span>
              </div>
           </div>

           <div className="flex flex-col">
              {/* TEAM 1 */}
              <div className="flex items-center py-4 px-6 border-b border-gray-200 shadow-xl hover:bg-gray-50 transition-colors">
                <div className="w-6 flex justify-start">
                  {d.team1.isServing && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>}
                </div>
                <div className="flex-1 text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter truncate">
                  {d.team1.name}
                </div>
                <div className="w-[120px] md:w-[150px] flex items-center justify-end gap-4 md:gap-8 pr-4">
                  {d.scoresTeam1.map((score, i) => {
                    if (i >= d.currentSet) return null;
                    const isCurrent = i === d.currentSet - 1;
                    return (
                      <span key={i} className={`text-2xl md:text-4xl font-black tabular-nums tracking-tighter ${isCurrent ? 'text-emerald-600 ' : 'text-gray-400'}`}>
                        {score}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* TEAM 2 */}
              <div className="flex items-center py-4 px-6 hover:bg-gray-50 transition-colors">
                <div className="w-6 flex justify-start">
                  {d.team2.isServing && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>}
                </div>
                <div className="flex-1 text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter truncate">
                  {d.team2.name}
                </div>
                <div className="w-[120px] md:w-[150px] flex items-center justify-end gap-4 md:gap-8 pr-4">
                  {d.scoresTeam2.map((score, i) => {
                    if (i >= d.currentSet) return null;
                    const isCurrent = i === d.currentSet - 1;
                    return (
                      <span key={i} className={`text-2xl md:text-4xl font-black tabular-nums tracking-tighter ${isCurrent ? 'text-emerald-600 ' : 'text-gray-400'}`}>
                        {score}
                      </span>
                    );
                  })}
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* Carousel Dots */}
      {showCarouselDots && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
          <div className="w-8 h-1.5 rounded-full bg-gray-900 shadow-sm"></div>
          <div className="w-2 h-1.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-500"></div>
          <div className="w-2 h-1.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-500"></div>
          <div className="w-2 h-1.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-500"></div>
          <div className="w-2 h-1.5 rounded-full bg-gray-300 transition-colors hover:bg-gray-500"></div>
        </div>
      )}
    </div>
  );
}

