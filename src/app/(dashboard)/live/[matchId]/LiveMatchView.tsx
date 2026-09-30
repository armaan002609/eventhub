'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SportType, MatchStatus } from '@prisma/client';
import { ScorebugRegistry } from '@/components/live-score/ScorebugRegistry';

type Props = {
  matchId: string;
  sport: SportType;
  initialData: any;
  status: MatchStatus;
};

export default function LiveMatchView({ matchId, sport, initialData, status }: Props) {
  const [scoreData, setScoreData] = useState<any>(initialData);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(status);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

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
    <div className="flex flex-col gap-4">
      {/* Connection Status Indicator */}
      <div className="flex justify-end items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#554093]/40">
          {isConnected ? 'Live Sync Active' : 'Reconnecting...'}
        </span>
      </div>

      {/* Sport-specific Scorebug Component */}
      <Scorebug data={scoreData} status={matchStatus} />
    </div>
  );
}
