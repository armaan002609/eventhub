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

export default function FootballScorebug({ data, status, showCarouselDots = true }: { data: Partial<FootballScoreData>, status: MatchStatus, showCarouselDots?: boolean }) {
  const d: FootballScoreData = {
    homeTeam: data.homeTeam || 'HOME',
    awayTeam: data.awayTeam || 'AWAY',
    homeScore: data.homeScore || 0,
    awayScore: data.awayScore || 0,
    matchClock: data.matchClock || '00:00',
    period: data.period || '1ST HALF',
    events: data.events || []
  };

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans bg-[#130E24] p-6 md:p-10 border border-white/5 pb-16">
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

      {/* Score Information */}
      <div className="w-full flex flex-col items-start gap-4 pr-24">
        
        {/* Clock & Period */}
        <div className="flex items-center gap-3">
           <span className="bg-rose-600 px-3 py-1 rounded-md text-xs font-black text-white uppercase tracking-widest">
             {d.period}
           </span>
           <span className="text-xl font-bold text-white/90 tabular-nums">
             {d.matchClock}
           </span>
        </div>

        {/* Teams and Scores */}
        <div className="flex items-end gap-4 md:gap-8 w-full">
          {/* Home Team */}
          <div className="flex flex-col items-start w-[35%] md:w-[40%]">
            <span className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md truncate w-full">
              {d.homeTeam}
            </span>
          </div>

          {/* Scores */}
          <div className="flex items-center justify-center gap-3 md:gap-6 w-[30%] md:w-[20%]">
             <span className="text-5xl md:text-7xl font-black text-white tabular-nums drop-shadow-xl">{d.homeScore}</span>
             <span className="text-3xl font-black text-white/40">-</span>
             <span className="text-5xl md:text-7xl font-black text-white tabular-nums drop-shadow-xl">{d.awayScore}</span>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-end w-[35%] md:w-[40%]">
            <span className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md truncate w-full text-right">
              {d.awayTeam}
            </span>
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

