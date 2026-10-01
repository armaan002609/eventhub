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

export default function WrestlingScorebug({ data, status }: { data: Partial<WrestlingScoreData>, status: MatchStatus }) {
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
    <div className="relative w-full h-[450px] md:h-[550px] rounded-[32px] overflow-hidden group cursor-pointer drop-shadow-2xl max-w-5xl mx-auto font-sans">
      {/* Background Image (Placeholder) */}
      <img 
        src="https://images.unsplash.com/photo-1544211145-8c017ef65427?auto=format&fit=crop&q=80&w=1600" 
        alt="Wrestling Background" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

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

      {/* Match Information (Top Left) */}
      <div className="absolute top-6 left-6 md:left-12 flex items-center gap-3 z-10">
         <span className="bg-amber-500 text-black px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest">
           {d.weightClass}
         </span>
         <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
           {d.period}
         </span>
      </div>

      {/* Score Information (Bottom Aligned) */}
      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex flex-col items-center gap-4 z-10">
        
        {/* Timer */}
        <div className="text-3xl md:text-5xl font-black text-amber-400 tabular-nums tracking-tighter drop-shadow-lg mb-2">
          {d.periodTimer}
        </div>

        {/* Scores */}
        <div className="flex items-end justify-between w-full">
          {/* Red Corner */}
          <div className="flex flex-col items-start w-[40%]">
             <div className="w-full flex items-center gap-4">
               <span className="text-5xl md:text-7xl font-black text-white tabular-nums drop-shadow-xl bg-red-600 px-4 rounded-xl">{d.redScore}</span>
               <span className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md truncate max-w-full">
                 {d.redName}
               </span>
             </div>
          </div>
          
          <span className="text-3xl font-black text-white/40 mb-2">VS</span>

          {/* Blue Corner */}
          <div className="flex flex-col items-end w-[40%]">
             <div className="w-full flex items-center justify-end gap-4">
               <span className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md truncate max-w-full text-right">
                 {d.blueName}
               </span>
               <span className="text-5xl md:text-7xl font-black text-white tabular-nums drop-shadow-xl bg-blue-600 px-4 rounded-xl">{d.blueScore}</span>
             </div>
          </div>
        </div>

      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
        <div className="w-8 h-1.5 rounded-full bg-white shadow-md"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
        <div className="w-2 h-1.5 rounded-full bg-white/40 transition-colors hover:bg-white/60"></div>
      </div>
    </div>
  );
}
