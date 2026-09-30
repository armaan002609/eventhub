'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function CricketScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const addRuns = async (runs: number, extraType?: 'wd' | 'nb') => {
    setIsUpdating(true);
    
    // Copy current state
    const newData = { ...data };
    
    // Calculate new runs
    const runIncrement = extraType ? runs + 1 : runs;
    newData.runs = (newData.runs || 0) + runIncrement;
    
    // Update overs logic (basic)
    if (!extraType) {
      const currentBalls = Math.round(((newData.overs || 0) % 1) * 10);
      if (currentBalls === 5) {
        newData.overs = Math.floor(newData.overs || 0) + 1.0;
      } else {
        newData.overs = (newData.overs || 0) + 0.1;
      }
    }

    // Update this over timeline
    const ballStr = extraType ? `${runs}${extraType}` : runs.toString();
    newData.thisOver = [...(newData.thisOver || []), ballStr];
    if (newData.thisOver.length > 6) newData.thisOver.shift(); // Keep only last 6 for UI

    // Calculate run rate
    const totalBalls = Math.floor(newData.overs) * 6 + Math.round((newData.overs % 1) * 10);
    newData.runRate = totalBalls > 0 ? (newData.runs / totalBalls) * 6 : 0;

    setData(newData);
    await updateMatchScore(matchId, newData, `ADD_${runs}_RUNS`);
    setIsUpdating(false);
  };

  const addWicket = async () => {
    setIsUpdating(true);
    const newData = { ...data };
    newData.wickets = (newData.wickets || 0) + 1;
    
    const currentBalls = Math.round(((newData.overs || 0) % 1) * 10);
    if (currentBalls === 5) {
      newData.overs = Math.floor(newData.overs || 0) + 1.0;
    } else {
      newData.overs = (newData.overs || 0) + 0.1;
    }
    
    newData.thisOver = [...(newData.thisOver || []), 'W'];
    if (newData.thisOver.length > 6) newData.thisOver.shift();

    setData(newData);
    await updateMatchScore(matchId, newData, 'WICKET');
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[0, 1, 2, 3, 4, 6].map(runs => (
          <button 
            key={runs} 
            onClick={() => addRuns(runs)}
            disabled={isUpdating}
            className="py-4 bg-[#554093]/5 hover:bg-[#554093]/10 text-[#554093] rounded-2xl font-black text-2xl border border-[#554093]/20 disabled:opacity-50"
          >
            {runs}
          </button>
        ))}
        
        <button 
          onClick={addWicket}
          disabled={isUpdating}
          className="py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 rounded-2xl font-black text-xl border border-rose-500/20 disabled:opacity-50"
        >
          WICKET
        </button>

        <button 
          onClick={() => addRuns(0, 'wd')}
          disabled={isUpdating}
          className="py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-2xl font-black text-xl border border-blue-500/20 disabled:opacity-50"
        >
          WIDE
        </button>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Runs</span>
            <span className="text-3xl font-black text-gray-900">{data.runs || 0}/{data.wickets || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Overs</span>
            <span className="text-3xl font-black text-gray-900">{data.overs?.toFixed(1) || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
