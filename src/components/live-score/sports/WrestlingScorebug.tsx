import { MatchStatus } from '@prisma/client';

export interface WrestlingScoreData {
  redName: string;
  blueName: string;
  redScore: number;
  blueScore: number;
  periodTimer: string; // e.g. "02:14"
  period: number; // 1 or 2
  weightCategory: string; // e.g. "74kg Freestyle"
}

export default function WrestlingScorebug({ data, status }: { data: Partial<WrestlingScoreData>, status: MatchStatus }) {
  const d: WrestlingScoreData = {
    redName: data.redName || 'RED WRESTLER',
    blueName: data.blueName || 'BLUE WRESTLER',
    redScore: data.redScore || 0,
    blueScore: data.blueScore || 0,
    periodTimer: data.periodTimer || '03:00',
    period: data.period || 1,
    weightCategory: data.weightCategory || 'Freestyle'
  };

  return (
    <div className="w-full bg-[#1A1A24] text-white rounded-3xl overflow-hidden shadow-2xl font-sans max-w-4xl mx-auto flex flex-col">
      <div className="bg-[#12121A] px-6 py-2 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/50">
        <span>{d.weightCategory}</span>
        <span className="text-[#F43F5E] animate-pulse">{status}</span>
      </div>

      <div className="flex h-48">
        {/* Red Corner */}
        <div className="flex-1 bg-gradient-to-br from-red-700 to-red-900 flex flex-col justify-center items-center p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-black uppercase tracking-widest drop-shadow-lg z-10 text-center">{d.redName}</h2>
          <span className="text-8xl font-black tabular-nums tracking-tighter drop-shadow-2xl z-10 mt-2">{d.redScore}</span>
        </div>

        {/* Timer Middle */}
        <div className="w-48 bg-black flex flex-col justify-center items-center border-x-4 border-[#1A1A24] z-20 shadow-2xl">
          <span className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Period {d.period}</span>
          <span className="text-5xl font-black text-yellow-400 tabular-nums">{d.periodTimer}</span>
        </div>

        {/* Blue Corner */}
        <div className="flex-1 bg-gradient-to-bl from-blue-700 to-blue-900 flex flex-col justify-center items-center p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <h2 className="text-2xl font-black uppercase tracking-widest drop-shadow-lg z-10 text-center">{d.blueName}</h2>
          <span className="text-8xl font-black tabular-nums tracking-tighter drop-shadow-2xl z-10 mt-2">{d.blueScore}</span>
        </div>
      </div>
    </div>
  );
}
