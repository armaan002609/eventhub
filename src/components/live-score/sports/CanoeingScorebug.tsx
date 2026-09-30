import { MatchStatus } from '@prisma/client';

export interface CanoeingScoreData {
  eventName: string; // e.g. "K1 200m Final"
  lanes: Array<{
    lane: number;
    name: string;
    team: string;
    splitTime: string; // e.g. "34.12s"
    gapToLeader: string; // e.g. "+0.42s"
    rank: number;
    status: 'RACING' | 'FINISHED' | 'DNF' | 'DSQ';
  }>;
}

export default function CanoeingScorebug({ data, status }: { data: Partial<CanoeingScoreData>, status: MatchStatus }) {
  const d: CanoeingScoreData = {
    eventName: data.eventName || 'Canoeing Event',
    lanes: data.lanes || []
  };

  // Sort lanes by rank for display
  const sortedLanes = [...d.lanes].sort((a, b) => {
    if (a.rank === 0) return 1;
    if (b.rank === 0) return -1;
    return a.rank - b.rank;
  });

  return (
    <div className="w-full bg-[#1A1A24] text-white rounded-3xl overflow-hidden shadow-2xl font-sans border border-white/10 max-w-4xl mx-auto flex flex-col">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 px-6 py-4 flex justify-between items-center shadow-lg z-10">
        <h2 className="text-xl font-black uppercase tracking-widest drop-shadow-md">{d.eventName}</h2>
        <div className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full uppercase tracking-wider">
          {status}
        </div>
      </div>

      <div className="flex flex-col p-4 bg-[#12121A]">
        {/* Table Header */}
        <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-widest text-white/40 px-4 py-2 border-b border-white/5">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-1 text-center">Lane</div>
          <div className="col-span-5">Athlete / Team</div>
          <div className="col-span-2 text-right">Split / Time</div>
          <div className="col-span-2 text-right">Gap</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {/* Lanes List */}
        <div className="flex flex-col gap-1 mt-2">
          {sortedLanes.map((lane) => (
            <div key={lane.lane} className="grid grid-cols-12 items-center px-4 py-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
              <div className="col-span-1 text-center font-black text-lg text-cyan-400 tabular-nums">{lane.rank > 0 ? lane.rank : '-'}</div>
              <div className="col-span-1 text-center font-bold text-white/50">{lane.lane}</div>
              <div className="col-span-5 flex flex-col">
                <span className="font-bold text-base uppercase tracking-wider">{lane.name}</span>
                <span className="text-[10px] text-white/50 font-bold uppercase">{lane.team}</span>
              </div>
              <div className="col-span-2 text-right font-black tabular-nums text-lg tracking-wider">{lane.splitTime || '-'}</div>
              <div className="col-span-2 text-right font-bold text-white/60 tabular-nums">{lane.gapToLeader}</div>
              <div className="col-span-1 text-right">
                <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full 
                  ${lane.status === 'FINISHED' ? 'bg-emerald-500/20 text-emerald-400' : 
                    lane.status === 'RACING' ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 
                    'bg-red-500/20 text-red-400'}`}>
                  {lane.status}
                </span>
              </div>
            </div>
          ))}
          {sortedLanes.length === 0 && (
            <div className="py-8 text-center text-white/30 text-sm font-bold uppercase tracking-widest">
              Awaiting athletes to be assigned to lanes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
