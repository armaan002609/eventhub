'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function BadmintonScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fallback defaults
  const currentSet = data.currentSet || 1;
  const scoresTeam1 = data.scoresTeam1 || [0, 0, 0];
  const scoresTeam2 = data.scoresTeam2 || [0, 0, 0];

  const addPoint = async (team: 1 | 2) => {
    setIsUpdating(true);
    const newData = { ...data };
    
    // Ensure arrays exist
    if (!newData.scoresTeam1) newData.scoresTeam1 = [0, 0, 0];
    if (!newData.scoresTeam2) newData.scoresTeam2 = [0, 0, 0];
    
    const setIdx = (newData.currentSet || 1) - 1;

    if (team === 1) {
      newData.scoresTeam1[setIdx] += 1;
      newData.team1 = { ...newData.team1, isServing: true };
      newData.team2 = { ...newData.team2, isServing: false };
    } else {
      newData.scoresTeam2[setIdx] += 1;
      newData.team2 = { ...newData.team2, isServing: true };
      newData.team1 = { ...newData.team1, isServing: false };
    }

    setData(newData);
    await updateMatchScore(matchId, newData, `TEAM_${team}_POINT`);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Current Set controls */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
        <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">Active Game: {currentSet}</span>
        <div className="flex gap-2">
          {[1, 2, 3].map(set => (
            <button 
              key={set}
              onClick={() => {
                const newData = { ...data, currentSet: set, statusLine: `Game ${set}` };
                setData(newData);
                updateMatchScore(matchId, newData, 'CHANGE_SET');
              }}
              className={`w-10 h-10 rounded-full font-bold flex items-center justify-center ${currentSet === set ? 'bg-[#554093] text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {set}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* TEAM 1 */}
        <div className="bg-blue-500/5 border border-blue-500/20 p-6 rounded-3xl flex flex-col items-center gap-6">
          <h2 className="text-xl font-black text-blue-600 uppercase">{data.team1?.name || 'Player 1'}</h2>
          <span className="text-8xl font-black tabular-nums">{scoresTeam1[currentSet - 1]}</span>
          <button 
            onClick={() => addPoint(1)} 
            disabled={isUpdating}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-2xl hover:bg-blue-700 disabled:opacity-50"
          >
            +1 POINT
          </button>
        </div>

        {/* TEAM 2 */}
        <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-3xl flex flex-col items-center gap-6">
          <h2 className="text-xl font-black text-rose-600 uppercase">{data.team2?.name || 'Player 2'}</h2>
          <span className="text-8xl font-black tabular-nums">{scoresTeam2[currentSet - 1]}</span>
          <button 
            onClick={() => addPoint(2)} 
            disabled={isUpdating}
            className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold text-2xl hover:bg-rose-700 disabled:opacity-50"
          >
            +1 POINT
          </button>
        </div>
      </div>

    </div>
  );
}
