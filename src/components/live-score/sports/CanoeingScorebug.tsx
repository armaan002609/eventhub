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
    <div className="relative w-full rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans bg-gradient-to-br from-white to-gray-50 p-6 md:p-10 border border-gray-200 shadow-xl pb-16">
      {/* Match Status Badge (Top Right) */}
      <div className="absolute top-6 right-6 z-10">
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

      {/* Race Information & Leaderboard */}
      <div className="w-full flex flex-col items-start gap-4 pr-24">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight ">
          {d.eventName}
        </h2>
        
        {/* Sleek Leaderboard Table */}
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mt-2">
            <div className="flex bg-gray-100 border-b border-gray-200 text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest py-2">
              <div className="w-12 text-center">POS</div>
              <div className="w-12 text-center">LANE</div>
              <div className="w-20 text-center">NAT</div>
              <div className="flex-1">NAME</div>
              <div className="w-24 md:w-32 text-right pr-6">TIME</div>
            </div>
            
            <div className="flex flex-col">
              {sortedRacers.length === 0 ? (
                <div className="py-6 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Awaiting Racers...
                </div>
              ) : (
                sortedRacers.slice(0, 3).map((racer, idx) => (
                  <div key={idx} className="flex items-center border-b border-gray-200 shadow-xl py-2 md:py-3 relative hover:bg-gray-50 transition-colors">
                    {idx === 0 && <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>}
                    {idx === 1 && <div className="absolute top-0 left-0 w-1 h-full bg-gray-300"></div>}
                    {idx === 2 && <div className="absolute top-0 left-0 w-1 h-full bg-orange-600"></div>}
                    
                    <div className="w-12 text-center text-lg md:text-xl font-black text-gray-900">{racer.position}</div>
                    <div className="w-12 text-center text-sm md:text-base font-bold text-gray-500">{racer.lane}</div>
                    <div className="w-20 text-center text-sm md:text-base font-black text-gray-800">{racer.country}</div>
                    <div className="flex-1 text-lg md:text-xl font-bold text-gray-900 uppercase tracking-tight truncate pr-2">{racer.name}</div>
                    <div className="w-24 md:w-32 text-right pr-6 text-lg md:text-xl font-black text-emerald-600 tabular-nums">{racer.splitTime}</div>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>

      {/* Carousel Dots (for visual similarity to reference) */}
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

