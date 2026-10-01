import { MatchStatus } from '@prisma/client';

export interface CricketScoreData {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  overs: number;
  runRate: number;
  target?: number;
  reqRunRate?: number;
  batter1: { name: string; runs: number; balls: number; fours: number; sixes: number; isStriker: boolean };
  batter2: { name: string; runs: number; balls: number; fours: number; sixes: number; isStriker: boolean };
  bowler: { name: string; overs: number; maidens: number; runs: number; wickets: number };
  thisOver: string[]; // e.g. ["1", "4", "W", "0", "6", "wd"]
  statusLine: string;
}

export default function CricketScorebug({ data, status, showCarouselDots = true }: { data: Partial<CricketScoreData>, status: MatchStatus, showCarouselDots?: boolean }) {
  // Safe defaults if data is missing
  const d: CricketScoreData = {
    battingTeam: data.battingTeam || 'TEAM A',
    bowlingTeam: data.bowlingTeam || 'TEAM B',
    runs: data.runs || 0,
    wickets: data.wickets || 0,
    overs: data.overs || 0,
    runRate: data.runRate || 0,
    target: data.target,
    reqRunRate: data.reqRunRate,
    batter1: data.batter1 || { name: 'Batter 1', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: true },
    batter2: data.batter2 || { name: 'Batter 2', runs: 0, balls: 0, fours: 0, sixes: 0, isStriker: false },
    bowler: data.bowler || { name: 'Bowler 1', overs: 0, maidens: 0, runs: 0, wickets: 0 },
    thisOver: data.thisOver || [],
    statusLine: data.statusLine || 'MATCH YET TO BEGIN'
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans bg-gradient-to-br from-white to-gray-50 p-6 md:p-10 border border-gray-200 shadow-xl pb-16">
      {/* Match Status Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest bg-white/80 backdrop-blur-md text-amber-600 border border-gray-200">
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
      <div className="w-full flex flex-col gap-6 z-10 mt-8 md:mt-0">
        
        {/* Main Score Area */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-4">
           <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-700 uppercase tracking-tight mb-1 md:mb-2">
                {d.battingTeam}
              </span>
              <div className="flex items-baseline gap-1 md:gap-2">
                <span className="text-5xl sm:text-6xl md:text-8xl font-black text-gray-900 tabular-nums leading-none">{d.runs}</span>
                <span className="text-3xl sm:text-4xl md:text-6xl font-black text-rose-600 leading-none">-{d.wickets}</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-500 ml-1 md:ml-2">({d.overs.toFixed(1)})</span>
              </div>
              <div className="flex gap-3 md:gap-4 mt-2 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest">
                 <span className="text-gray-500">CRR: <span className="text-amber-600 ml-1">{d.runRate.toFixed(2)}</span></span>
                 {d.target && (
                   <span className="text-gray-500">Target: <span className="text-gray-900 ml-1">{d.target}</span></span>
                 )}
              </div>
           </div>

           {/* Batters & Bowler panel */}
           <div className="w-full md:w-[350px] bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col gap-3">
                 {/* Batters */}
                 <div className="flex flex-col gap-1.5 pb-3 border-b border-gray-200">
                   {[d.batter1, d.batter2].map((batter, i) => (
                     <div key={i} className="flex justify-between items-center text-sm md:text-base">
                       <div className="flex items-center gap-2">
                         {batter.isStriker ? <span className="w-2 h-2 rounded-full bg-rose-500"></span> : <span className="w-2 h-2"></span>}
                         <span className={`font-bold truncate w-[140px] ${batter.isStriker ? 'text-gray-900' : 'text-gray-500'}`}>{batter.name}</span>
                       </div>
                       <div className="flex gap-4">
                         <span className={`font-black tabular-nums ${batter.isStriker ? 'text-gray-900' : 'text-gray-500'}`}>{batter.runs}</span>
                         <span className="text-xs font-medium text-gray-400 tabular-nums w-8 text-right">({batter.balls})</span>
                       </div>
                     </div>
                   ))}
                 </div>
                 {/* Bowler */}
                 <div className="flex justify-between items-center text-sm md:text-base pt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2"></span>
                      <span className="font-bold text-gray-700 truncate w-[140px]">{d.bowler.name}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="font-black tabular-nums text-gray-700">{d.bowler.wickets}-{d.bowler.runs}</span>
                      <span className="text-xs font-medium text-gray-400 tabular-nums w-8 text-right">({d.bowler.overs.toFixed(1)})</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* This Over Timeline */}
        <div className="flex items-center gap-3 w-full bg-white/60 backdrop-blur-md rounded-lg border border-gray-200 shadow-xl p-2 px-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">This Over</span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {d.thisOver.map((ball, i) => {
              let bg = 'bg-gray-100 text-gray-700 border border-gray-200';
              if (ball === '4') bg = 'bg-blue-600 text-gray-900 border border-blue-500';
              if (ball === '6') bg = 'bg-emerald-500 text-gray-900 border border-emerald-400';
              if (ball === 'W') bg = 'bg-rose-600 text-white border border-rose-500';
              if (ball.includes('wd') || ball.includes('nb')) bg = 'bg-amber-500 text-black border border-amber-400';
              
              return (
                <div key={i} className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-black ${bg}`}>
                  {ball}
                </div>
              );
            })}
            {d.thisOver.length === 0 && (
              <span className="text-xs text-gray-900/30 italic">No balls bowled yet</span>
            )}
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

