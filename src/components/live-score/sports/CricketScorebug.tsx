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
    battingTeam: data.battingTeam || 'Team A',
    bowlingTeam: data.bowlingTeam || 'Team B',
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
    statusLine: data.statusLine || 'Match yet to begin'
  };

  return (
    <div className="w-full bg-[#1A1A24] text-white rounded-3xl overflow-hidden shadow-2xl font-sans border border-white/10 max-w-4xl mx-auto">
      
      {/* Top Bar: Team vs Team and Match Status */}
      <div className="bg-[#12121A] px-6 py-3 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold tracking-widest uppercase text-white/50">{d.battingTeam} vs {d.bowlingTeam}</span>
        </div>
        <div className="text-xs font-bold text-[#F43F5E] bg-[#F43F5E]/10 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          {status}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Left Column: Main Score */}
        <div className="p-8 flex flex-col justify-center items-center md:items-start border-r border-white/5 bg-gradient-to-br from-[#554093]/20 to-transparent">
          <h2 className="text-xl font-black text-white/80 uppercase tracking-widest mb-1">{d.battingTeam}</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black tabular-nums tracking-tighter leading-none">{d.runs}</span>
            <span className="text-4xl font-bold text-white/50">/{d.wickets}</span>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-white/10 px-3 py-1 rounded-lg">
              <span className="text-xs text-white/50 uppercase tracking-wider font-bold mr-2">Overs</span>
              <span className="text-lg font-black tabular-nums">{d.overs}</span>
            </div>
            <div className="px-2">
              <span className="text-xs text-white/50 uppercase tracking-wider font-bold mr-2">CRR</span>
              <span className="text-lg font-bold tabular-nums">{d.runRate.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Batters and Bowler */}
        <div className="col-span-2 p-6 flex flex-col gap-6">
          
          {/* Batters */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest text-white/40 font-bold px-2 mb-1">
              <div className="col-span-6">Batters</div>
              <div className="col-span-2 text-center">R</div>
              <div className="col-span-2 text-center">B</div>
              <div className="col-span-1 text-center">4s</div>
              <div className="col-span-1 text-center">6s</div>
            </div>
            
            {[d.batter1, d.batter2].map((batter, i) => (
              <div key={i} className={`grid grid-cols-12 items-center px-2 py-2 rounded-xl ${batter.isStriker ? 'bg-white/5 border border-white/10' : ''}`}>
                <div className="col-span-6 font-bold flex items-center gap-2">
                  {batter.name}
                  {batter.isStriker && <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>}
                </div>
                <div className="col-span-2 text-center font-black tabular-nums">{batter.runs}</div>
                <div className="col-span-2 text-center font-medium text-white/60 tabular-nums">{batter.balls}</div>
                <div className="col-span-1 text-center font-medium text-white/40 tabular-nums">{batter.fours}</div>
                <div className="col-span-1 text-center font-medium text-white/40 tabular-nums">{batter.sixes}</div>
              </div>
            ))}
          </div>

          {/* Bowler */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest text-white/40 font-bold px-2 mb-1">
              <div className="col-span-6">Bowler</div>
              <div className="col-span-2 text-center">O</div>
              <div className="col-span-1 text-center">M</div>
              <div className="col-span-2 text-center">R</div>
              <div className="col-span-1 text-center">W</div>
            </div>
            
            <div className="grid grid-cols-12 items-center px-2 py-2 rounded-xl bg-white/5 border border-white/10">
              <div className="col-span-6 font-bold">{d.bowler.name}</div>
              <div className="col-span-2 text-center font-medium text-white/60 tabular-nums">{d.bowler.overs}</div>
              <div className="col-span-1 text-center font-medium text-white/40 tabular-nums">{d.bowler.maidens}</div>
              <div className="col-span-2 text-center font-medium text-white/60 tabular-nums">{d.bowler.runs}</div>
              <div className="col-span-1 text-center font-black tabular-nums text-[#3B82F6]">{d.bowler.wickets}</div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: This Over & Status */}
      <div className="bg-[#12121A] p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">This Over</span>
          <div className="flex gap-1.5">
            {d.thisOver.map((ball, i) => (
              <span key={i} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black
                ${ball === 'W' ? 'bg-[#F43F5E] text-white' : 
                  ball === '4' || ball === '6' ? 'bg-[#3B82F6] text-white' : 
                  'bg-white/10 text-white/80'}`}
              >
                {ball}
              </span>
            ))}
          </div>
        </div>

        <div className="text-sm font-bold text-[#FBBF24]">
          {d.statusLine}
        </div>
      </div>

    </div>
  );
}
