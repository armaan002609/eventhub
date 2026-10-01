import { MatchStatus } from '@prisma/client';

export interface CanoeingScoreData {
  eventName: string; // e.g. "MEN's K-1 1000m FINAL"
  distanceTotal: number;
  racers: { lane: number; name: string; country: string; splitTime: string; position: number }[];
}

export default function CanoeingScorebug({ data, status, showCarouselDots = true }: { data: Partial<CanoeingScoreData>, status: MatchStatus, showCarouselDots?: boolean }) {
  const d: CanoeingScoreData = {
    eventName: data.eventName || "MATCH",
    distanceTotal: data.distanceTotal || 1000,
    racers: data.racers || []
  };

  // Sort by position for display
  const sortedRacers = [...d.racers].sort((a, b) => a.position - b.position);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans bg-gradient-to-br from-[#1E1536] to-[#0A0710]">
      {/* Background Image (Placeholder for canoeing/rowing) */}
      
      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>

      {/* Match Status Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-10">
        {status === 'LIVE' ? (
          <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest flex items-center gap-2 bg-rose-600 text-white shadow-lg shadow-rose-600/30">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            LIVE
          </div>
        ) : (
          <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white/80 border border-white/10">
            {status}
          </div>
        )}
      </div>

      {/* Race Information & Leaderboard (Bottom Aligned) */}
      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex flex-col items-start gap-4 z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight drop-shadow-md">
          {d.eventName}
        </h2>
        
        {/* Sleek Leaderboard Table */}
        <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 mt-2">
            <div className="flex bg-white/10 border-b border-white/10 text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest py-2">
              <div className="w-12 text-center">POS</div>
              <div className="w-12 text-center">LANE</div>
              <div className="w-20 text-center">NAT</div>
              <div className="flex-1">NAME</div>
              <div className="w-24 md:w-32 text-right pr-6">TIME</div>
            </div>
            
            <div className="flex flex-col">
              {sortedRacers.length === 0 ? (
                <div className="py-6 text-center text-sm font-bold text-white/50 uppercase tracking-widest">
                  Awaiting Racers...
                </div>
              ) : (
                sortedRacers.slice(0, 3).map((racer, idx) => (
                  <div key={idx} className="flex items-center border-b border-white/5 py-2 md:py-3 relative hover:bg-white/5 transition-colors">
                    {idx === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>}
                    {idx === 1 && <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>}
                    {idx === 2 && <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>}
                    
                    <div className="w-12 text-center text-lg md:text-xl font-black text-white">{racer.position}</div>
                    <div className="w-12 text-center text-sm md:text-base font-bold text-white/50">{racer.lane}</div>
                    <div className="w-20 text-center text-sm md:text-base font-black text-white/90">{racer.country}</div>
                    <div className="flex-1 text-lg md:text-xl font-bold text-white uppercase tracking-tight truncate pr-2">{racer.name}</div>
                    <div className="w-24 md:w-32 text-right pr-6 text-lg md:text-xl font-black text-emerald-400 tabular-nums">{racer.splitTime}</div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>

      {/* Carousel Dots (for visual similarity to reference) */}
      {showCarouselDots && (
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
          <div className="w-8 h-1.5 rounded-full bg-white shadow-md"></div>
          <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
          <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
          <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
          <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
        </div>
      )}
    </div>
  );
}

