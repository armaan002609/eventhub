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
    <div className="w-full max-w-[800px] flex flex-col items-center mt-8 drop-shadow-2xl font-sans mx-auto">
      
      {/* Top Banner (Weight & Period) */}
      <div className="bg-[#1A1A24] text-white/80 border-t border-l border-r border-white/10 rounded-t-2xl px-6 py-1.5 flex items-center justify-between w-[300px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        <span className="text-[10px] font-black uppercase tracking-widest">{d.weightClass}</span>
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{d.period}</span>
      </div>

      {/* Main Score Bar */}
      <div className="flex bg-[#0A0B10]/95 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] w-full">
        
        {/* Red Corner */}
        <div className="flex-1 flex justify-between bg-gradient-to-r from-red-700 to-red-900 border-r border-black">
          <div className="flex items-center pl-6">
            <span className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md">{d.redName}</span>
          </div>
          <div className="w-24 bg-red-950 flex items-center justify-center relative shadow-inner">
            <span className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">{d.redScore}</span>
          </div>
        </div>

        {/* Center Clock */}
        <div className="w-32 bg-[#15161E] flex items-center justify-center relative">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20"></div>
          <span className="text-4xl font-black text-amber-400 tabular-nums tracking-tighter drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">{d.periodTimer}</span>
        </div>

        {/* Blue Corner */}
        <div className="flex-1 flex justify-between bg-gradient-to-l from-blue-700 to-blue-900 border-l border-black">
          <div className="w-24 bg-blue-950 flex items-center justify-center relative shadow-inner">
            <span className="text-5xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">{d.blueScore}</span>
          </div>
          <div className="flex items-center pr-6">
            <span className="text-3xl font-black text-white italic tracking-tighter drop-shadow-md">{d.blueName}</span>
          </div>
        </div>

      </div>
      
      {/* Status */}
      {status === 'LIVE' && (
        <div className="mt-3 flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">LIVE</span>
        </div>
      )}
      
    </div>
  );
}
