import { MatchStatus } from '@prisma/client';

export interface CanoeingScoreData {
  eventName: string; // e.g. "MEN's K-1 1000m FINAL"
  distanceTotal: number;
  racers: { lane: number; name: string; country: string; splitTime: string; position: number }[];
}

export default function CanoeingScorebug({ data, status }: { data: Partial<CanoeingScoreData>, status: MatchStatus }) {
  const d: CanoeingScoreData = {
    eventName: data.eventName || "MATCH",
    distanceTotal: data.distanceTotal || 1000,
    racers: data.racers || []
  };

  // Sort by position for display
  const sortedRacers = [...d.racers].sort((a, b) => a.position - b.position);

  return (
    <div className="w-full max-w-[600px] flex flex-col mt-auto pb-4 font-sans drop-shadow-2xl mx-auto">
      
      <div className="flex items-center gap-3 mb-2 px-2 drop-shadow-md">
        {status === 'LIVE' && (
          <div className="bg-rose-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm flex items-center gap-1.5 animate-pulse">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            LIVE
          </div>
        )}
        <h2 className="text-sm font-black text-white uppercase tracking-widest bg-black/50 px-3 py-0.5 rounded-sm backdrop-blur-sm border border-white/10">{d.eventName}</h2>
      </div>

      <div className="bg-[#0A0B10]/95 backdrop-blur-md rounded-lg overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        
        {/* Table Header */}
        <div className="flex bg-[#1A1A24] border-b border-white/10 text-[9px] font-bold text-white/50 uppercase tracking-widest py-1.5">
          <div className="w-10 text-center">POS</div>
          <div className="w-10 text-center">LANE</div>
          <div className="w-16 text-center">NAT</div>
          <div className="flex-1">NAME</div>
          <div className="w-24 text-right pr-4">TIME</div>
        </div>

        {/* Racers */}
        <div className="flex flex-col">
          {sortedRacers.length === 0 ? (
            <div className="flex items-center border-b border-white/5 py-4 relative overflow-hidden bg-[#15161E]">
              <div className="w-full text-center text-xs font-bold text-white/30 uppercase tracking-widest">
                Awaiting Racers & Splits...
              </div>
            </div>
          ) : (
            sortedRacers.map((racer, idx) => (
            <div key={idx} className="flex items-center border-b border-white/5 py-1.5 relative overflow-hidden bg-gradient-to-r from-transparent hover:from-white/5">
              {idx === 0 && <div className="absolute top-0 left-0 w-[2px] h-full bg-amber-400"></div>}
              {idx === 1 && <div className="absolute top-0 left-0 w-[2px] h-full bg-gray-300"></div>}
              {idx === 2 && <div className="absolute top-0 left-0 w-[2px] h-full bg-orange-600"></div>}
              
              <div className="w-10 text-center text-sm font-black text-white">{racer.position}</div>
              <div className="w-10 text-center text-xs font-bold text-white/40">{racer.lane}</div>
              <div className="w-16 text-center text-xs font-black text-white/80">{racer.country}</div>
              <div className="flex-1 text-sm font-bold text-white uppercase tracking-tight truncate pr-2">{racer.name}</div>
              <div className="w-24 text-right pr-4 text-sm font-black text-emerald-400 tabular-nums">{racer.splitTime}</div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
