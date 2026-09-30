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

export default function CricketScorebug({ data, status }: { data: Partial<CricketScoreData>, status: MatchStatus }) {
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
    <div className="w-full flex items-center justify-center font-sans mt-auto pb-4">
      
      <div className="w-full max-w-[1000px] flex flex-col drop-shadow-2xl">
        
        {/* Status / Target Bar (Top thin bar) */}
        <div className="bg-[#1A1A24] h-8 flex items-center justify-between px-4 rounded-t-xl border-t border-l border-r border-white/10 text-[11px] font-bold text-white/80 uppercase tracking-widest relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status === 'LIVE' ? 'bg-rose-500 animate-pulse' : 'bg-gray-500'}`}></span>
              {status === 'LIVE' ? 'LIVE' : status}
            </span>
            <span className="text-white/30">|</span>
            <span className="text-amber-400">{d.statusLine}</span>
          </div>
          {d.target && (
            <div className="flex gap-4">
              <span>TARGET <span className="text-white ml-1">{d.target}</span></span>
              <span>REQ RR <span className="text-white ml-1">{d.reqRunRate?.toFixed(2)}</span></span>
            </div>
          )}
        </div>

        {/* Main Scorebug (Middle thick bar) */}
        <div className="flex h-[72px] bg-gradient-to-b from-[#0A0B10] to-[#12131C] border border-white/10 relative overflow-hidden shadow-black/50 shadow-2xl">
          
          {/* Batting Team Block */}
          <div className="w-[120px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 border-r border-white/10 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            <span className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md z-10">{d.battingTeam}</span>
          </div>

          {/* Main Score Block */}
          <div className="w-[200px] flex items-center justify-center bg-[#15161E] border-r border-white/5 relative">
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-5xl font-black text-white tabular-nums tracking-tighter leading-none">{d.runs}</span>
              <span className="text-2xl font-black text-rose-500 tracking-tighter leading-none">-{d.wickets}</span>
            </div>
          </div>

          {/* Overs & CRR */}
          <div className="w-[140px] flex flex-col justify-center px-4 bg-[#1A1A24] border-r border-white/5">
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Overs</span>
              <span className="text-2xl font-black text-white tabular-nums leading-none tracking-tighter">{d.overs.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">CRR</span>
              <span className="text-sm font-bold text-amber-400 tabular-nums">{d.runRate.toFixed(2)}</span>
            </div>
          </div>

          {/* Batters Block */}
          <div className="flex-1 flex flex-col justify-center px-4 bg-[#12131C] border-r border-white/5">
            {[d.batter1, d.batter2].map((batter, i) => (
              <div key={i} className={`flex justify-between items-center ${i===0 ? 'mb-1' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${batter.isStriker ? 'bg-rose-500' : 'bg-transparent'}`}></span>
                  <span className={`text-sm font-bold truncate w-[120px] ${batter.isStriker ? 'text-white' : 'text-white/60'}`}>{batter.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className={`text-sm font-black tabular-nums ${batter.isStriker ? 'text-white' : 'text-white/60'}`}>{batter.runs}</span>
                  <span className="text-[11px] font-medium text-white/40 tabular-nums w-6 text-right">({batter.balls})</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bowler Block */}
          <div className="flex-1 flex flex-col justify-center px-4 bg-[#1A1A24]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Bowler</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white truncate w-[100px]">{d.bowler.name}</span>
              <div className="flex gap-3 text-xs font-black tabular-nums">
                <span className="text-white/80">{d.bowler.wickets}-{d.bowler.runs}</span>
                <span className="text-white/40">({d.bowler.overs.toFixed(1)})</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: This Over Timeline */}
        <div className="bg-[#12131C] h-10 flex items-center px-4 rounded-b-xl border-b border-l border-r border-white/10 relative overflow-hidden">
          <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mr-4">This Over</span>
          <div className="flex items-center gap-2">
            {d.thisOver.map((ball, i) => {
              let bg = 'bg-white/10 text-white/80';
              let border = 'border border-white/10';
              if (ball === '4') bg = 'bg-blue-600 text-white shadow-[0_0_8px_rgba(37,99,235,0.6)]';
              if (ball === '6') bg = 'bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.6)]';
              if (ball === 'W') bg = 'bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.6)]';
              if (ball.includes('wd') || ball.includes('nb')) bg = 'bg-amber-500 text-black';
              
              return (
                <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${bg} ${border}`}>
                  {ball}
                </div>
              );
            })}
            {d.thisOver.length === 0 && (
              <span className="text-xs text-white/30 italic">No balls bowled yet</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
