import { MatchStatus } from '@prisma/client';

export interface WrestlingScoreData {
  redName: string;
  blueName: string;
  redScore: number;
  blueScore: number;
  weightClass: string; // e.g. "MENS FREESTYLE 86KG"
  periodTimer: string; // e.g. "01:45"
  period: string; // e.g. "PERIOD 2"
}

export default function WrestlingScorebug({ data, status, showCarouselDots = true }: { data: Partial<WrestlingScoreData>, status: MatchStatus, showCarouselDots?: boolean }) {
  const d: WrestlingScoreData = {
    redName: data.redName || 'RED CORNER',
    blueName: data.blueName || 'BLUE CORNER',
    redScore: data.redScore || 0,
    blueScore: data.blueScore || 0,
    weightClass: data.weightClass || 'MATCH',
    periodTimer: data.periodTimer || '00:00',
    period: data.period || 'PERIOD 1'
  };

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

      {/* Match Information (Top Left) */}
      <div className="flex items-center gap-3 z-10 mb-6">
         <span className="bg-amber-500 text-black px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest">
           {d.weightClass}
         </span>
         <span className="bg-white/90 backdrop-blur-md border border-gray-200 text-gray-900 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
           {d.period}
         </span>
      </div>

      {/* Score Information */}
      <div className="w-full flex flex-col items-center gap-4 z-10">
        
        {/* Timer */}
        <div className="text-3xl md:text-5xl font-black text-amber-600 tabular-nums tracking-tighter  mb-2">
          {d.periodTimer}
        </div>

        {/* Scores */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-4 md:gap-0 mt-4 md:mt-0">
          {/* Red Corner */}
          <div className="flex flex-col items-start w-full md:w-[40%]">
             <div className="w-full flex items-center justify-between md:justify-start gap-4">
               <span className="text-4xl md:text-7xl font-black text-white tabular-nums bg-red-600 px-3 md:px-4 py-1 rounded-xl order-2 md:order-1">{d.redScore}</span>
               <span className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight truncate max-w-full order-1 md:order-2">
                 {d.redName}
               </span>
             </div>
          </div>
          
          <span className="text-xl md:text-3xl font-black text-gray-400 mb-0 md:mb-2 py-2 md:py-0">VS</span>

          {/* Blue Corner */}
          <div className="flex flex-col items-end w-full md:w-[40%]">
             <div className="w-full flex items-center justify-between md:justify-end gap-4">
               <span className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 tracking-tight truncate max-w-full text-left md:text-right">
                 {d.blueName}
               </span>
               <span className="text-4xl md:text-7xl font-black text-white tabular-nums bg-blue-600 px-3 md:px-4 py-1 rounded-xl">{d.blueScore}</span>
             </div>
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

