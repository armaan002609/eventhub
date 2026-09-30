import { MatchStatus } from '@prisma/client';

export interface FootballScoreData {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchClock: string; // e.g. "67:12" or "90+3:00"
  phase: string; // "1st Half", "HT", "2nd Half", "FT"
  events: Array<{ minute: string; type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUB'; team: 'HOME' | 'AWAY'; player: string }>;
}

export default function FootballScorebug({ data, status }: { data: Partial<FootballScoreData>, status: MatchStatus }) {
  const d: FootballScoreData = {
    homeTeam: data.homeTeam || 'HOME',
    awayTeam: data.awayTeam || 'AWAY',
    homeScore: data.homeScore || 0,
    awayScore: data.awayScore || 0,
    matchClock: data.matchClock || '00:00',
    phase: data.phase || '1st Half',
    events: data.events || []
  };

  return (
    <div className="w-full bg-[#1A1A24] text-white rounded-3xl overflow-hidden shadow-2xl font-sans border border-white/10 max-w-4xl mx-auto flex flex-col">
      {/* Top Broadcast Bug */}
      <div className="flex justify-center mt-6 mb-4">
        <div className="flex bg-[#12121A] rounded-2xl shadow-xl overflow-hidden border border-white/5">
          {/* Home Team */}
          <div className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/20 to-transparent">
            <span className="text-2xl font-black uppercase tracking-widest w-24 text-right">{d.homeTeam}</span>
          </div>
          {/* Score */}
          <div className="flex items-center justify-center bg-black/50 px-6 py-3 gap-3">
            <span className="text-4xl font-black tabular-nums">{d.homeScore}</span>
            <span className="text-white/30 text-xl font-bold">-</span>
            <span className="text-4xl font-black tabular-nums">{d.awayScore}</span>
          </div>
          {/* Away Team */}
          <div className="flex items-center px-6 py-3 bg-gradient-to-l from-red-600/20 to-transparent">
            <span className="text-2xl font-black uppercase tracking-widest w-24 text-left">{d.awayTeam}</span>
          </div>
          {/* Clock & Phase */}
          <div className="flex items-center justify-center bg-[#554093] px-6 py-3 border-l border-white/10 flex-col">
            <span className="text-xl font-bold tabular-nums tracking-wider">{d.matchClock}</span>
            <span className="text-[10px] uppercase font-bold text-white/70">{d.phase}</span>
          </div>
        </div>
      </div>

      {/* Match Events Timeline */}
      <div className="p-6 grid grid-cols-2 gap-4 border-t border-white/5 bg-[#12121A]">
        {/* Home Events */}
        <div className="flex flex-col gap-2 border-r border-white/5 pr-4">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest text-right mb-2">Home Events</h4>
          {d.events.filter(e => e.team === 'HOME').map((e, i) => (
            <div key={i} className="flex items-center justify-end gap-3 text-sm">
              <span className="font-bold">{e.player}</span>
              <span className="text-white/50 text-xs tabular-nums">{e.minute}'</span>
              <div className="w-5 h-5 flex items-center justify-center">
                {e.type === 'GOAL' && <span>⚽</span>}
                {e.type === 'YELLOW_CARD' && <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>}
                {e.type === 'RED_CARD' && <div className="w-3 h-4 bg-red-500 rounded-sm"></div>}
                {e.type === 'SUB' && <span className="text-green-400">⇅</span>}
              </div>
            </div>
          ))}
        </div>
        {/* Away Events */}
        <div className="flex flex-col gap-2 pl-4">
          <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">Away Events</h4>
          {d.events.filter(e => e.team === 'AWAY').map((e, i) => (
            <div key={i} className="flex items-center justify-start gap-3 text-sm">
              <div className="w-5 h-5 flex items-center justify-center">
                {e.type === 'GOAL' && <span>⚽</span>}
                {e.type === 'YELLOW_CARD' && <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>}
                {e.type === 'RED_CARD' && <div className="w-3 h-4 bg-red-500 rounded-sm"></div>}
                {e.type === 'SUB' && <span className="text-green-400">⇅</span>}
              </div>
              <span className="text-white/50 text-xs tabular-nums">{e.minute}'</span>
              <span className="font-bold">{e.player}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
