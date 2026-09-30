import { MatchStatus } from '@prisma/client';

export interface FootballScoreData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchClock: string; // e.g. "45:00"
  period: string; // e.g. "1ST HALF"
  events: {
    minute: string;
    type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUB';
    team: 'HOME' | 'AWAY';
    player: string;
  }[];
}

export default function FootballScorebug({ data, status }: { data: Partial<FootballScoreData>, status: MatchStatus }) {
  const d: FootballScoreData = {
    homeTeam: data.homeTeam || 'CHE',
    awayTeam: data.awayTeam || 'ARS',
    homeScore: data.homeScore || 0,
    awayScore: data.awayScore || 0,
    matchClock: data.matchClock || '00:00',
    period: data.period || '1ST HALF',
    events: data.events || []
  };

  return (
    <div className="w-full flex flex-col items-center justify-start mt-8 font-sans drop-shadow-2xl max-w-[600px] mx-auto">
      
      {/* Top TV Scorebug Widget */}
      <div className="flex bg-[#0A0B10]/95 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        
        {/* Match Clock & Period */}
        <div className="w-[100px] flex flex-col items-center justify-center bg-[#1A1A24] border-r border-white/5 relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
          <span className="text-xl font-black text-white tabular-nums tracking-tighter">{d.matchClock}</span>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{d.period}</span>
        </div>

        {/* Home Team */}
        <div className="w-[120px] flex items-center justify-between pl-6 pr-4 bg-gradient-to-r from-blue-700 to-blue-900 border-r border-white/10 relative">
          <span className="text-2xl font-black text-white italic tracking-tighter z-10">{d.homeTeam}</span>
          <span className="text-3xl font-black text-white tabular-nums z-10 drop-shadow-md">{d.homeScore}</span>
        </div>

        {/* Away Team */}
        <div className="w-[120px] flex items-center justify-between pr-6 pl-4 bg-gradient-to-l from-rose-700 to-rose-900 relative">
          <span className="text-3xl font-black text-white tabular-nums z-10 drop-shadow-md">{d.awayScore}</span>
          <span className="text-2xl font-black text-white italic tracking-tighter z-10">{d.awayTeam}</span>
        </div>

      </div>

      {/* Match Status Badge */}
      <div className={`mt-3 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${status === 'LIVE' ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' : 'bg-white/10 text-white/50 border-white/10'}`}>
        {status === 'LIVE' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
        {status}
      </div>

    </div>
  );
}
