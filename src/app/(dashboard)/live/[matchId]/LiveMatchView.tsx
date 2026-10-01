'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SportType, MatchStatus } from '@prisma/client';
import { ScorebugRegistry } from '@/components/live-score/ScorebugRegistry';

type Props = {
  matchId: string;
  sport: SportType;
  initialData: any;
  status: MatchStatus;
  hideSyncStatus?: boolean;
  showCarouselDots?: boolean;
};

export default function LiveMatchView({ matchId, sport, initialData, status, hideSyncStatus, showCarouselDots }: Props) {
  const [scoreData, setScoreData] = useState<any>(initialData);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(status);
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    // Subscribe to changes on the Match table specifically for this matchId
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'Match',
          filter: `id=eq.${matchId}`
        },
        (payload) => {
          // payload.new contains the updated row
          if (payload.new.scoreData) {
            setScoreData(payload.new.scoreData);
          }
          if (payload.new.status) {
            setMatchStatus(payload.new.status);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, supabase]);

  // Dynamically load the correct Scorebug component based on SportType
  const Scorebug = ScorebugRegistry[sport];

  if (!Scorebug) {
    return (
      <div className="bg-white rounded-3xl p-12 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 text-center">
        <h3 className="text-xl font-bold text-rose-500 mb-2">Unsupported Sport</h3>
        <p className="text-[#554093]/60 font-medium">The live scoreboard for {sport} is not implemented yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Connection Status Indicator */}
      {!hideSyncStatus && (
        <div className="flex justify-end items-center gap-2 max-w-5xl mx-auto w-full px-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#554093]/40">
            {isConnected ? 'Live Sync Active' : 'Reconnecting...'}
          </span>
        </div>
      )}

      {/* Sport-specific Scorebug Component Wrapped for Fullscreen */}
      <div 
        ref={wrapperRef} 
        className={`relative group/fs flex flex-col justify-center transition-all duration-500 mx-auto w-full ${
          isFullscreen 
            ? 'bg-[#0A0710] h-screen w-screen max-w-none p-4 md:p-12 items-center' 
            : 'max-w-5xl'
        }`}
      >
        <button 
          onClick={toggleFullscreen} 
          className={`absolute z-50 p-2.5 rounded-xl text-white backdrop-blur-md shadow-xl transition-all duration-300 flex items-center justify-center border border-white/10 ${
            isFullscreen 
              ? 'top-6 right-6 bg-white/10 hover:bg-white/20 opacity-100' 
              : 'top-4 left-4 bg-black/50 hover:bg-black opacity-0 group-hover/fs:opacity-100'
          }`}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3h-3m18 0h-3V3m0 18v-3h3M3 16h3v3"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          )}
        </button>

        <div className={`w-full ${isFullscreen ? 'max-w-7xl transform scale-110' : ''}`}>
          <Scorebug data={scoreData} status={matchStatus} showCarouselDots={showCarouselDots} />
        </div>
      </div>
    </div>
  );
}
